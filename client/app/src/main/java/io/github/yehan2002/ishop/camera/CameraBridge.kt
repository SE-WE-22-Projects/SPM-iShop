package io.github.yehan2002.ishop.camera

import android.graphics.Matrix
import android.graphics.Rect
import android.os.Build
import android.util.Log
import android.view.ViewGroupOverlay
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
import androidx.core.content.ContextCompat
import io.github.yehan2002.ishop.MainActivity.Companion.TAG

/**
 * This class acts as a bridge between the camera and the App.
 * This handles camera calibrations and calculating the correctionMatrix for the current camera.
 */
class CameraBridge(
    private val activity: AppCompatActivity,
    private val previewView: PreviewView,
    private val handler: (CameraBridge, ImageProxy) -> Unit
) {
    lateinit var calibration: CameraCalibration
        private set

    lateinit var correctionMatrix: Matrix
        private set

    val overlay: ViewGroupOverlay = previewView.overlay

    @RequiresApi(Build.VERSION_CODES.P)
    @OptIn(ExperimentalCamera2Interop::class)
    fun start() {
        val cameraController = LifecycleCameraController(activity.baseContext)
        cameraController.isPinchToZoomEnabled = false
        cameraController.imageCaptureMode = ImageCapture.CAPTURE_MODE_MAXIMIZE_QUALITY
        cameraController.setEnabledUseCases(CameraController.IMAGE_ANALYSIS)

        var lastCameraId = "UNSET"
        var lastCropRect = Rect()
        var lastViewWidth = -1
        var lastViewHeight = -1

        calibration = CameraCalibration()

        cameraController.setImageAnalysisAnalyzer(
            ContextCompat.getMainExecutor(activity)
        ) { proxy ->

            // update the camera calibration information on camera change.
            val cameraInfo = cameraController.cameraInfo
            if (cameraInfo != null) {
                val cameraId = Camera2CameraInfo.from(cameraInfo).cameraId
                if (cameraId != lastCameraId) {
                    calibration = CameraCalibration.loadCalibrations(activity, cameraId, proxy)
                    lastCameraId = cameraId
                }
            }

            // update the correctionMatrix if the image size or PreviewView size has changed.
            if (proxy.cropRect != lastCropRect ||
                previewView.height != lastViewHeight || previewView.width != lastViewWidth
            ) {
                correctionMatrix = getCorrectionMatrix(proxy, previewView)
                lastCropRect = proxy.cropRect
                lastViewHeight = previewView.height
                lastViewWidth = previewView.width
            }

            previewView.overlay.clear()

            try {
                handler(this, proxy)
            } catch (e: Exception) {
                Log.e(TAG, "Failed to process frame", e)
            }

            proxy.close()
        }

        cameraController.bindToLifecycle(activity)
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
}