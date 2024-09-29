package io.github.yehan2002.ishop.aruco

import android.content.Context
import android.hardware.camera2.CameraCharacteristics
import android.hardware.camera2.CameraManager
import android.os.Build
import android.util.Log
import android.widget.Toast
import androidx.annotation.OptIn
import androidx.annotation.RequiresApi
import androidx.camera.camera2.interop.ExperimentalCamera2Interop
import androidx.camera.core.ImageProxy
import io.github.yehan2002.ishop.MainActivity
import io.github.yehan2002.ishop.R
import org.opencv.core.CvType
import org.opencv.core.Mat
import org.opencv.core.MatOfDouble

/**
 * This class contains the camera calibration values used in the ArucoDetector class.
 */
class CameraCalibration() {


    // camera matrix and distortion coefficients
    // https://docs.opencv.org/4.x/dc/dbb/tutorial_py_calibration.html
    val cameraMatrix: Mat = Mat()
    val distortionCoefficients: MatOfDouble = MatOfDouble()

    /**
     * The scale used to convert the unit used for distance in solvePnP into meters.
     */
    var distanceScale: Double

    /**
     * Indicates if this calibration is valid.
     * If this is false, this calibration cannot be used to call solvePnP.
     * This will be false if this object was constructed using the default constructor.
     */
    var isValid: Boolean

    init {
        distanceScale = 0.0
        isValid = false
    }

    private constructor(
        intrinsics: FloatArray,
        distortion: FloatArray?,
        scale: Double
    ) : this() {

        Mat.zeros(5, 1, CvType.CV_64FC1).copyTo(distortionCoefficients)
        Mat.eye(3, 3, CvType.CV_64FC1).copyTo(cameraMatrix)

        // create the camera calibration matrix from the camera intrinsics.
        // https://developer.android.com/reference/android/hardware/camera2/CameraCharacteristics#LENS_INTRINSIC_CALIBRATION
        // https://docs.opencv.org/4.x/dc/dbb/tutorial_py_calibration.html
        val cameraMatrixArray = doubleArrayOf(
            intrinsics[0].toDouble(),
            intrinsics[4].toDouble(),
            intrinsics[2].toDouble(),
            0.0,
            intrinsics[1].toDouble(),
            intrinsics[3].toDouble(),
            0.0, 0.0, 1.0
        )
        cameraMatrix.put(0, 0, *cameraMatrixArray)
        Log.d(MainActivity.TAG, "Camera matrix is ${cameraMatrixArray.contentToString()}")

        // set the distortion coefficients if it exists.
        if (distortion != null) {
            // convert float array to doubles
            val distortionCoefficientsArray =
                distortion.map { v -> v.toDouble() }.toDoubleArray()

            distortionCoefficients.put(0, 0, *distortionCoefficientsArray)
            Log.d(
                MainActivity.TAG,
                "distortion coefficients are ${distortion.contentToString()}"
            )
        }

        // set the distance scale
        distanceScale = scale
        Log.i(MainActivity.TAG, "Distance scaling is $distanceScale")

        isValid = true
    }

    companion object {
        /**
         * This method tries to load the camera calibrations for the camera with the given cameraId.
         *
         * @param context: the current context. Used to get the camera service.
         * @param cameraId: the camera id
         * @param imageProxy: the image proxy that is being used.
         * @return CameraCalibration if the operation was successful, null otherwise.
         */
        @JvmStatic
        @RequiresApi(Build.VERSION_CODES.P)
        @OptIn(ExperimentalCamera2Interop::class)
        fun loadCalibrations(
            context: Context,
            cameraId: String,
            imageProxy: ImageProxy
        ): CameraCalibration? {

            val cameraManager = context.getSystemService(Context.CAMERA_SERVICE) as CameraManager
            val char = cameraManager.getCameraCharacteristics(cameraId)

            // get the lens intrinsics and distortions for the current camera
            // some phones may return null values if the operation is unsupported
            val intrinsics = char.get(CameraCharacteristics.LENS_INTRINSIC_CALIBRATION)
            val distortion = char.get(CameraCharacteristics.LENS_DISTORTION)

            if (intrinsics == null) {
                Log.i(MainActivity.TAG, "loadCalibration: intrinsics is null")

                Toast.makeText(
                    context,
                    context.getText(R.string.error_camera_support),
                    Toast.LENGTH_LONG
                ).show()

                return null
            }

            // calculate distance scaling
            val scale = (imageProxy.width / 2) / intrinsics[2].toDouble()

            return CameraCalibration(intrinsics, distortion, scale)
        }

    }

}