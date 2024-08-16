package io.github.yehan2002.ishop.aruco

import android.graphics.PointF
import org.opencv.core.Mat


class Tag(
    val id: Int,
    val distance: Double,
    tagCorners: Mat,
    val rotation: Rotation? = null,
    val extra: Array<String>? = null
) {
    var corners: Array<PointF>

    init {
        val pointList = mutableListOf<PointF>()
        for (i in 0..3) {
            val pointData = tagCorners.get(0, i)
            pointList.add(PointF(pointData[0].toFloat(), pointData[1].toFloat()))
        }

        corners = pointList.toTypedArray()
    }

    class Rotation(val roll: Double, val pitch: Double, val yaw: Double) {
        val facingYaw = (yaw + 90) % 360

    }

}

