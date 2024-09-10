package io.github.yehan2002.ishop

import android.content.Context
import android.content.pm.PackageManager
import android.graphics.Matrix
import android.hardware.SensorManager
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.annotation.OptIn
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import androidx.camera.camera2.interop.Camera2CameraInfo
import androidx.camera.camera2.interop.ExperimentalCamera2Interop
import androidx.camera.core.ImageCapture
import androidx.camera.core.ImageProxy
import androidx.camera.view.CameraController
import androidx.camera.view.LifecycleCameraController
import androidx.camera.view.PreviewView
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import io.github.yehan2002.ishop.aruco.ArucoDetector
import io.github.yehan2002.ishop.aruco.CameraCalibration
import io.github.yehan2002.ishop.aruco.RotationSensor
import io.github.yehan2002.ishop.databinding.ActivityMainBinding
import io.github.yehan2002.ishop.drawable.DebugInfoDrawable
import io.github.yehan2002.ishop.drawable.MapDrawable
import io.github.yehan2002.ishop.drawable.TagDrawable
import io.github.yehan2002.ishop.navigation.StoreNavigator
import org.opencv.android.OpenCVLoader
import org.opencv.objdetect.Objdetect
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import kotlin.math.PI
import kotlin.math.roundToInt


class MainActivity : AppCompatActivity() {
    private lateinit var viewBinding: ActivityMainBinding
    private lateinit var cameraExecutor: ExecutorService
    private lateinit var detector: ArucoDetector
    private lateinit var rotation: RotationSensor
    private lateinit var navigator: StoreNavigator

    @RequiresApi(Build.VERSION_CODES.P)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        viewBinding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(viewBinding.root)

        // Request camera permissions
        if (allPermissionsGranted()) {
            startCamera()
        } else {
            ActivityCompat.requestPermissions(
                this, REQUIRED_PERMISSIONS, REQUEST_CODE_PERMISSIONS
            )
        }

        // load openCV library
        if (!OpenCVLoader.initLocal()) {
            Log.e(TAG, "OpenCV initialization failed")
            (Toast.makeText(this, "OpenCV initialization failed", Toast.LENGTH_LONG)).show()
            return
        }

        detector = ArucoDetector(
            0.06,
            Objdetect.getPredefinedDictionary(Objdetect.DICT_4X4_50),
        )

        rotation = RotationSensor(
            getSystemService(Context.SENSOR_SERVICE) as SensorManager
        )

        cameraExecutor = Executors.newSingleThreadExecutor()


        navigator = StoreNavigator()
        rotation.startTracking()
    }

    @RequiresApi(Build.VERSION_CODES.P)
    @OptIn(ExperimentalCamera2Interop::class)
    private fun startCamera() {
        val cameraController = LifecycleCameraController(baseContext)
        val previewView: PreviewView = viewBinding.viewFinder


        cameraController.isPinchToZoomEnabled = false
        cameraController.imageCaptureMode = ImageCapture.CAPTURE_MODE_MAXIMIZE_QUALITY
        cameraController.setEnabledUseCases(CameraController.IMAGE_ANALYSIS)

        var lastCameraId = "UNSET"

        cameraController.setImageAnalysisAnalyzer(
            ContextCompat.getMainExecutor(this)
        ) { proxy ->

            val startTime = System.nanoTime()

            val cameraInfo = cameraController.cameraInfo
            if (cameraInfo != null) {
                val cameraId = Camera2CameraInfo.from(cameraInfo).cameraId
                if (cameraId != lastCameraId) {
                    val calibration = CameraCalibration.loadCalibrations(this, cameraId, proxy)

                    if (calibration != null) {
                        detector.setCalibration(calibration)
                        lastCameraId = cameraId
                    }
                }
            }

            val tags = detector.detectMarkers(proxy.toBitmap())
            rotation.updateOrientationAngles()
            navigator.addMarkers(tags)

            previewView.overlay.clear()

            if (DISPLAY_TAGS) {
                // display all detected tags as a overlay
                tags.forEach {
                    val inverse = getCorrectionMatrix(proxy, previewView)

                    previewView.overlay.add(
                        TagDrawable(
                            it,
                            inverse
                        )
                    )
                }
            }

            val processingTime = ((System.nanoTime() - startTime) / 1e6).roundToInt()

            // display the debug information overlay
            previewView.overlay.add(
                DebugInfoDrawable(
                    processingTime,
                    tags.size,
                    navigator.position,
                    "Rot 1: " + (180 * rotation.orientationAngles[0] / PI).roundToInt(),
                    "Rot 2: " + (180 * 2 * rotation.orientationAngles[1] / PI).roundToInt(),
                    "Rot 3: " + (180 * rotation.orientationAngles[2] / PI).roundToInt(),
                    navigator.storeMap.getTileAt(navigator.position).toString()
                )
            )

            // display the map
            previewView.overlay.add(MapDrawable(navigator.storeMap, navigator.position))

            proxy.close()
        }

        cameraController.bindToLifecycle(this)
        previewView.controller = cameraController
    }


    /**
     * Creates a matrix used to transform the coordinates detected using opencv to PreviewView
     * coordinates.
     *
     * Based on https://developer.android.com/media/camera/camerax/transform-output
     */
    private fun getCorrectionMatrix(imageProxy: ImageProxy, previewView: PreviewView): Matrix {
        val cropRect = imageProxy.cropRect
        val matrix = Matrix()


        // A float array of the source vertices (crop rect) in clockwise order.
        val source = floatArrayOf(
            cropRect.left.toFloat(),
            cropRect.top.toFloat(),
            cropRect.right.toFloat(),
            cropRect.top.toFloat(),
            cropRect.right.toFloat(),
            cropRect.bottom.toFloat(),
            cropRect.left.toFloat(),
            cropRect.bottom.toFloat()
        )

        // A float array of the destination vertices in clockwise order.
        val destination = floatArrayOf(
            0f,
            0f,
            previewView.width.toFloat(),
            0f,
            previewView.width.toFloat(),
            previewView.height.toFloat(),
            0f,
            previewView.height.toFloat()
        )

        // skip rotation because the image will not be rotated on the display.

//        val rotationDegrees = imageProxy.imageInfo.rotationDegrees
        // The destination vertexes need to be shifted based on rotation degrees. The
        // rotation degree represents the clockwise rotation needed to correct the image.
        // Each vertex is represented by 2 float numbers in the vertices array.
//        val vertexSize = 2
        // The destination needs to be shifted 1 vertex for every 90° rotation.
//        val shiftOffset = rotationDegrees / 90 * vertexSize;

        val shiftOffset = 90
        val tempArray = destination.clone()
        for (toIndex in source.indices) {
            val fromIndex = (toIndex + shiftOffset) % source.size
            destination[toIndex] = tempArray[fromIndex]
        }
        matrix.setPolyToPoly(source, 0, destination, 0, 4)
        return matrix
    }


    private fun allPermissionsGranted() = REQUIRED_PERMISSIONS.all {
        ContextCompat.checkSelfPermission(
            baseContext, it
        ) == PackageManager.PERMISSION_GRANTED
    }

    override fun onDestroy() {
        super.onDestroy()
        cameraExecutor.shutdown()
        rotation.stopTracking()
    }


    @RequiresApi(Build.VERSION_CODES.P)
    @OptIn(ExperimentalCamera2Interop::class)
    override fun onRequestPermissionsResult(
        requestCode: Int, permissions: Array<String>, grantResults:
        IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == REQUEST_CODE_PERMISSIONS) {
            if (allPermissionsGranted()) {
                startCamera()
            } else {
                Toast.makeText(
                    this,
                    "Permissions not granted by the user.",
                    Toast.LENGTH_SHORT
                ).show()
                finish()
            }
        }
    }

    companion object {
        const val TAG = "IShop_Log"
        const val DISPLAY_TAGS = true

        private const val REQUEST_CODE_PERMISSIONS = 10
        private val REQUIRED_PERMISSIONS =
            mutableListOf(
                android.Manifest.permission.CAMERA,
            ).toTypedArray()
    }
}
