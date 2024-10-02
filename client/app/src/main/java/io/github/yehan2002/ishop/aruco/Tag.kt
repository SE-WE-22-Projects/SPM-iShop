package io.github.yehan2002.ishop.aruco

import android.graphics.PointF
import org.opencv.core.Mat


/**
 * This class contains the details of a single detected aruco tag.
 */
class Tag(
    val id: Int,
    tagCorners: Mat,
    val rotation: Rotation? = null,
    val position: Position? = null,
) {
    var corners: Array<PointF>

    /**
     * Gets the distance to the tag from the user.
     * If the distance cannot be calculated, [Double.NaN] is returned.
     */
    val distance: Double
        get() {
            if (position != null) return position.z
            return Double.NaN
        }

    init {
        val pointList = mutableListOf<PointF>()
        for (i in 0..3) {
            val pointData = tagCorners.get(0, i)
            pointList.add(PointF(pointData[0].toFloat(), pointData[1].toFloat()))
        }

        corners = pointList.toTypedArray()
    }

    class Rotation(val roll: Double, val pitch: Double, val yaw: Double)
    class Position(val x: Double, val y: Double, val z: Double)
}

