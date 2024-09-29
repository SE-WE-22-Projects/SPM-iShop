package io.github.yehan2002.ishop.aruco

import android.graphics.PointF
import org.opencv.core.Mat


class Tag(
    val id: Int,
    tagCorners: Mat,
    val rotation: Rotation? = null,
    val position: Position? = null,
) {
    var corners: Array<PointF>
    val detectedTime: Long

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

        detectedTime = System.nanoTime()
        corners = pointList.toTypedArray()
    }

    class Rotation(val roll: Double, val pitch: Double, val yaw: Double) {
        val facingYaw: Double = ((if (yaw < 0) 360 + yaw else yaw) + 90) % 360
    }

    class Position(val x: Double, val y: Double, val z: Double)

}

