package io.github.yehan2002.ishop.aruco

import android.graphics.Matrix
import android.graphics.PointF
import android.util.Log
import io.github.yehan2002.ishop.MainActivity.Companion.TAG
import org.opencv.core.Mat


class Tag(val id: Int, mat: Mat) {
    var points: Array<PointF>;

    init {
        val pointList = mutableListOf<PointF>();

        for (i in 0..3) {
            val pointData = mat.get(0, i);
            pointList.add(PointF(pointData[0].toFloat(), pointData[1].toFloat()))
        }

        points = pointList.toTypedArray();
    }


}