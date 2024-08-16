package io.github.yehan2002.ishop.aruco

import android.graphics.Bitmap
import android.util.Log
import io.github.yehan2002.ishop.MainActivity.Companion.TAG
import org.opencv.android.Utils
import org.opencv.calib3d.Calib3d
import org.opencv.core.CvType
import org.opencv.core.Mat
import org.opencv.core.MatOfDouble
import org.opencv.core.MatOfPoint2f
import org.opencv.core.MatOfPoint3f
import org.opencv.core.Point
import org.opencv.core.Point3
import org.opencv.core.Scalar
import org.opencv.objdetect.ArucoDetector
import org.opencv.objdetect.Dictionary
import kotlin.math.abs
import kotlin.math.roundToInt

class ArucoDetector(
    private val markerLength: Double,
    dictionary: Dictionary,

    ) {
    private val detector: ArucoDetector
    private val objPointsMat: MatOfPoint3f

    private lateinit var cameraMatrix: Mat
    private lateinit var distortionCoefficients: MatOfDouble
    private var isCalibrated = false;

    var lastProcessTime = 0;

    init {
        this.detector = ArucoDetector(dictionary)

        // create the object point matrix
        val halfSize = this.markerLength / 2
        val objPointsArray: MutableList<Point3> = ArrayList()
        objPointsArray.add(Point3(-halfSize, halfSize, 0.0))
        objPointsArray.add(Point3(halfSize, halfSize, 0.0))
        objPointsArray.add(Point3(halfSize, -halfSize, 0.0))
        objPointsArray.add(Point3(-halfSize, -halfSize, 0.0))

        this.objPointsMat = MatOfPoint3f()
        this.objPointsMat.fromList(objPointsArray)
    }

    public fun setCalibration(calibration: Calibration) {
        cameraMatrix = Mat()
        distortionCoefficients = MatOfDouble()
        Mat.zeros(5, 1, CvType.CV_64FC1).copyTo(distortionCoefficients)
        Mat.eye(3, 3, CvType.CV_64FC1).copyTo(cameraMatrix)

        // create the camera calibration matrix from the camera intrinsics
        val cameraMatrixArray = doubleArrayOf(
            calibration.intrinsics[0].toDouble(),
            calibration.intrinsics[4].toDouble(),
            calibration.intrinsics[2].toDouble(),
            0.0,
            calibration.intrinsics[1].toDouble(),
            calibration.intrinsics[3].toDouble(),
            0.0, 0.0, 1.0
        );
        cameraMatrix.put(0, 0, *cameraMatrixArray)

        isCalibrated = true
    }

    fun detectMarkers(bitmap: Bitmap): Array<Tag> {
        val start = System.nanoTime()

        val img = bitmap.copy(Bitmap.Config.ARGB_8888, true)
        val image = Mat(img.height, img.width, CvType.CV_8U, Scalar(4.0))
        Utils.bitmapToMat(img, image)


        val corners: MutableList<Mat> = mutableListOf()
        val ids = Mat()

        detector.detectMarkers(image, corners, ids)

        val markerRects = mutableListOf<Tag>()

        if (corners.size > 0) {
            Log.i(TAG, "Found ARUCO tags")


            for (i in 0 until corners.size) {
                val rvec = Mat(3, 1, CvType.CV_64F)
                val tvec = Mat(3, 1, CvType.CV_64F)
                var hasPnP = false;

                try {
                    if (isCalibrated) {
                        val corner = corners[i]


                        val corner2 = MatOfPoint2f(
                            Point(corner.get(0, 0)),
                            Point(corner.get(0, 1)),
                            Point(corner.get(0, 2)),
                            Point(corner.get(0, 3))
                        )

                        Calib3d.solvePnP(
                            objPointsMat,
                            corner2, cameraMatrix,
                            distortionCoefficients,
                            rvec, tvec,
                            false,
                            Calib3d.SOLVEPNP_IPPE_SQUARE
                        )


                        hasPnP = true;
                    }
                } catch (e: Exception) {
                    Log.e(TAG, "Failed to solvePnP") //, e)
                }

                Log.i(TAG, "pnp ${(tvec.get(2, 0)[0] * 100).roundToInt() / 100.0}")

                markerRects.add(
                    Tag(ids[i, 0][0].toInt(), corners[i])
                )

            }

        }

        image.release()
        lastProcessTime = ((System.nanoTime() - start) / 1e6).roundToInt()

        // display the number of tags found and the processing time.
//        addTextLine(image, 0, "Tags: ${corners.size}")
//        addTextLine(image, 1, "${time}ms")

        return markerRects.toTypedArray()
    }

    /**
     * Returns if the given vector is a valid finite vector
     * @param vec: the vector to be checked.
     */
    private fun isValidVec(vec: Mat): Boolean {

        if (vec.rows() != 3 || vec.cols() == 1) {
            Log.i(TAG, "Invalid vec size ${vec.rows()} ${vec.cols()}")
            return false
        }

        for (i in 0..2) {
            val v = vec[0, i][0]
            if (abs(v) > DISTANCE_LIMIT) return false
        }

        return true
    }

    companion object {
        const val DISTANCE_LIMIT = 1000;
    }

    data class Calibration(val intrinsics: FloatArray, val distortion: FloatArray?) {
        override fun equals(other: Any?): Boolean {
            if (this === other) return true
            if (javaClass != other?.javaClass) return false

            other as Calibration

            if (!intrinsics.contentEquals(other.intrinsics)) return false
            if (!distortion.contentEquals(other.distortion)) return false

            return true
        }

        override fun hashCode(): Int {
            var result = intrinsics.contentHashCode()
            result = 31 * result + distortion.contentHashCode()
            return result
        }

    }
}