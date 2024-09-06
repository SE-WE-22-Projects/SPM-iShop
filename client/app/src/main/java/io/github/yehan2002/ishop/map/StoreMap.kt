package io.github.yehan2002.ishop.map

import android.util.Log
import io.github.yehan2002.ishop.MainActivity.Companion.TAG
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.roundToInt
import kotlin.math.sin

class StoreMap(val width: Double, val height: Double) {
    var map: Array<Array<TileState>> = Array(width.roundToInt()) {
        Array(height.roundToInt()) { TileState.EMPTY }
    }
    var markers = mutableMapOf<Int, Point2D>();

    fun estimatePos(markerId: Int, distance: Double, angle: Double): Point2D? {
        val pos = markers[markerId]
        if (pos == null) {
            Log.d(TAG, "Invalid marker id");
            return null;
        }

        val angleRad = (angle / 180) * PI

        // calculate the position.
        // https://stackoverflow.com/a/13895314/6587830
        val position = Point2D(
            pos.x + distance * cos(angleRad),
            pos.y + distance * sin(angleRad)
        )

        // check if the position is within the map
        if (pos.x < -10 || pos.y < -10 || pos.x > height + 10 || pos.y > width + 10) {
            Log.d(TAG, "Position outsize map");
            return null;
        }

        return position
    }

    enum class TileState {
        EMPTY,
        SHELF
    }

    /**
     * A position represented as 2 doubles.
     */
    data class Point2D(val x: Double, val y: Double) {
        /**
         * Returns a new point after adding dx and dy to the current point's coordinates.
         */
        fun add(dx: Double, dy: Double): Point2D {
            return Point2D(dx + x, dy + y)
        }
    }
}