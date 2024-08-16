package io.github.yehan2002.ishop

import android.content.Context
import android.content.pm.PackageManager
import android.graphics.Matrix
import android.hardware.camera2.CameraCharacteristics
import android.hardware.camera2.CameraManager
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
import io.github.yehan2002.ishop.aruco.DebugInfoDrawable
import io.github.yehan2002.ishop.aruco.TagDrawable
import io.github.yehan2002.ishop.databinding.ActivityMainBinding
import org.opencv.android.OpenCVLoader
import org.opencv.objdetect.Objdetect
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors


class MainActivity : AppCompatActivity() {
    private lateinit var viewBinding: ActivityMainBinding
    private lateinit var cameraExecutor: ExecutorService
    private lateinit var detector: ArucoDetector

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

        if (OpenCVLoader.initLocal()) {
            Log.i(TAG, "OpenCV loaded successfully");
            (Toast.makeText(this, "OpenCV initialized", Toast.LENGTH_SHORT)).show();
        } else {
            Log.e(TAG, "OpenCV initialization failed");
            (Toast.makeText(this, "OpenCV initialization failed", Toast.LENGTH_LONG)).show();
            return;
        }

        detector = ArucoDetector(
            0.06,
            Objdetect.getPredefinedDictionary(Objdetect.DICT_4X4_50),
        )
        cameraExecutor = Executors.newSingleThreadExecutor()
    }

    @RequiresApi(Build.VERSION_CODES.P)
    @OptIn(ExperimentalCamera2Interop::class)
    private fun startCamera() {
        val cameraController = LifecycleCameraController(baseContext)
        val previewView: PreviewView = viewBinding.viewFinder


        cameraController.isPinchToZoomEnabled = false
        cameraController.imageCaptureMode = ImageCapture.CAPTURE_MODE_MAXIMIZE_QUALITY
        cameraController.setEnabledUseCases(CameraController.IMAGE_ANALYSIS);

        var lastCameraId = "UNSET";

        cameraController.setImageAnalysisAnalyzer(
            ContextCompat.getMainExecutor(this)
        ) { proxy ->

            val cameraInfo = cameraController.cameraInfo;
            if (cameraInfo != null) {
                val cameraId = Camera2CameraInfo.from(cameraInfo).cameraId
                if (cameraId != lastCameraId) {
                    val calibration = getCameraCalibration(cameraId, proxy)
                    if (calibration != null) {
                        detector.setCalibration(calibration)
                        lastCameraId = cameraId
                    }

                }
//            Log.i(TAG, intrinsics.contentToString())
            }

            val tags = detector.detectMarkers(proxy.toBitmap())


            previewView.overlay.clear()
            tags.forEach {
                val inverse = getCorrectionMatrix(proxy, previewView)

                previewView.overlay.add(
                    TagDrawable(
                        it,
                        inverse
                    )
                )
            }
            previewView.overlay.add(
                DebugInfoDrawable(
                    detector.lastProcessTime,
                    tags.size,
                )
            )

            proxy.close()
        }

        cameraController.bindToLifecycle(this)
        previewView.controller = cameraController
    }

    @RequiresApi(Build.VERSION_CODES.P)
    @OptIn(ExperimentalCamera2Interop::class)
    private fun getCameraCalibration(
        cameraId: String,
        imageProxy: ImageProxy
    ): ArucoDetector.Calibration? {
        val cameraManager = getSystemService(Context.CAMERA_SERVICE) as CameraManager
        val characteristics = cameraManager.getCameraCharacteristics(cameraId)

        val intrinsics =
            characteristics.get(CameraCharacteristics.LENS_INTRINSIC_CALIBRATION)

        val focalLength =
            characteristics.get(CameraCharacteristics.LENS_INFO_AVAILABLE_FOCAL_LENGTHS)

        val distortion = characteristics.get(CameraCharacteristics.LENS_DISTORTION)

        if (intrinsics == null || focalLength == null) {
            Log.i(TAG, "Calibrate: intrinsics is null")
            return null;
        }

        Log.i(TAG, "Calibrate: intrinsics is ${intrinsics.contentToString()}")

//        intrinsics[0] = focalLength[0]
//        intrinsics[1] = focalLength[0]
//        intrinsics[2] = (imageProxy.width / 2).toFloat()
//        intrinsics[3] = (imageProxy.height / 2).toFloat()

        Log.i(TAG, "Calibrate: intrinsics is ${intrinsics.contentToString()}")

        return ArucoDetector.Calibration(intrinsics, distortion)

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
        const val TAG = "IShop_Log";
        private const val REQUEST_CODE_PERMISSIONS = 10
        private val REQUIRED_PERMISSIONS =
            mutableListOf(
                android.Manifest.permission.CAMERA
            ).toTypedArray()
    }


}
