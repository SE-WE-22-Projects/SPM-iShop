package io.github.yehan2002.ishop.aruco

import android.graphics.Bitmap
import android.util.Log
import io.github.yehan2002.ishop.MainActivity.Companion.TAG
import org.opencv.android.Utils
import org.opencv.calib3d.Calib3d
import org.opencv.core.CvType
import org.opencv.core.Mat
import org.opencv.core.MatOfPoint2f
import org.opencv.core.MatOfPoint3f
import org.opencv.core.Point
import org.opencv.core.Point3
import org.opencv.core.Scalar
import org.opencv.objdetect.ArucoDetector
import org.opencv.objdetect.Dictionary
import kotlin.math.PI
import kotlin.math.abs
import kotlin.math.atan2
import kotlin.math.roundToInt
import kotlin.math.sin

class ArucoDetector(
    private val markerLength: Double,
    dictionary: Dictionary,
) {
    private val detector: ArucoDetector = ArucoDetector(dictionary)
    private val objPointsMat: MatOfPoint3f

    private var calibration = CameraCalibration()

    init {

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

    /**
     * Sets the camera calibration values for pose estimation.
     * Distances and angles of the tags will be unavailable until this method is called.
     */
    fun setCalibration(calibration: CameraCalibration) {
        this.calibration = calibration
    }


    /**
     * Detects markers in the given bitmap
     * @param bitmap the bitmap to process
     * @return an array containing all found tags
     */
    fun detectMarkers(bitmap: Bitmap): Array<Tag> {
        val detectedTags = mutableListOf<Tag>()


        // convert the bitmap to a opencv Mat
        val img = bitmap.copy(Bitmap.Config.ARGB_8888, true)
        val image = Mat(img.height, img.width, CvType.CV_8U, Scalar(4.0))
        Utils.bitmapToMat(img, image)


        // find markers in the image
        val corners: MutableList<Mat> = mutableListOf()
        val ids = Mat()
        detector.detectMarkers(image, corners, ids)


        // if markers were found, process them.
        if (corners.size > 0) {
            for (i in 0 until corners.size) {

                val tagId = ids[i, 0][0].toInt()
                var rotation: Tag.Rotation? = null
                var postion: Tag.Position? = null

                if (calibration.isValid) {
                    val rvec = Mat(3, 1, CvType.CV_64F)
                    val tvec = Mat(3, 1, CvType.CV_64F)

                    val corner = corners[i]


                    var hasPnP = false
                    try {
                        // convert the corner Mat into points
                        val cornerPoints = MatOfPoint2f(
                            Point(corner.get(0, 0)),
                            Point(corner.get(0, 1)),
                            Point(corner.get(0, 2)),
                            Point(corner.get(0, 3))
                        )

                        // calculate the position and pose of the tag
                        Calib3d.solvePnP(
                            objPointsMat,
                            cornerPoints, calibration.cameraMatrix,
                            calibration.distortionCoefficients,
                            rvec, tvec,
                            false,
                            Calib3d.SOLVEPNP_IPPE_SQUARE
                        )

                        // check if rvec and tvec are valid
                        hasPnP = isValidVec(rvec) && isValidVec(tvec)
                    } catch (e: Exception) {
                        Log.e(TAG, "Failed to solvePnP", e)
                    }

                    if (hasPnP) {
                        // calculate the rotation for the tag
                        // https://stackoverflow.com/questions/54970421/python-opencv-solvepnp-convert-to-euler-angles
                        val rotationMat = Mat(3, 3, CvType.CV_32FC1)
                        Calib3d.Rodrigues(rvec, rotationMat)

                        val roll =
                            180 * atan2(-rotationMat.get(2, 1)[0], rotationMat.get(2, 2)[0]) / PI
                        val pitch = 180 * sin(rotationMat.get(2, 0)[0]) / PI
                        val yaw =
                            180 * atan2(-rotationMat.get(1, 0)[0], rotationMat.get(0, 0)[0]) / PI

                        rotation = Tag.Rotation(
                            roll = round2(roll),
                            pitch = round2(pitch),
                            yaw = round2(yaw)
                        )

                        // calculate the distance
                        postion = Tag.Position(
                            tvec.get(0, 0)[0] * calibration.distanceScale,
                            tvec.get(1, 0)[0] * calibration.distanceScale,
                            tvec.get(2, 0)[0] * calibration.distanceScale
                        )
                    }
                }

                detectedTags.add(
                    Tag(
                        tagId,
                        corners[i],
                        rotation = rotation,
                        position = postion
                    )
                )
            }

        }

        image.release()

        return detectedTags.toTypedArray()
    }

    /**
     * Rounds the given double to 2 decimal points.
     */
    private fun round2(value: Double): Double {
        if (value.isNaN()) return Double.NaN

        return (value * 100.0).roundToInt() / 100.0
    }

    /**
     * Returns if the given vector is a valid finite vector.
     * @param vec: the vector to be checked.
     */
    private fun isValidVec(vec: Mat): Boolean {

        if (vec.rows() != 3 || vec.cols() != 1) {
            Log.i(TAG, "Invalid vec size ${vec.rows()} ${vec.cols()}")
            return false
        }

        for (i in 0..2) {
            val v = vec[i, 0][0]
            if (abs(v) > DISTANCE_LIMIT) return false
        }

        return true
    }

    companion object {
        const val DISTANCE_LIMIT = 1000
    }

}