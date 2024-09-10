package io.github.yehan2002.ishop.drawable

import android.annotation.SuppressLint
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.ColorFilter
import android.graphics.Paint
import android.graphics.PixelFormat
import android.graphics.RectF
import android.graphics.drawable.Drawable
import io.github.yehan2002.ishop.map.MapObject
import io.github.yehan2002.ishop.map.StoreMap

class MapDrawable(private val storeMap: StoreMap, private val userPos: StoreMap.Point2D?) :
    Drawable() {
    private val empty = Paint().apply {
        style = Paint.Style.FILL
        color = Color.WHITE
        alpha = 100
    }
    private val rack = Paint().apply {
        style = Paint.Style.FILL
        color = Color.GREEN
        alpha = 200
    }
    private val tag = Paint().apply {
        style = Paint.Style.FILL
        color = Color.RED
        alpha = 200
    }

    private val user = Paint().apply {
        style = Paint.Style.FILL
        color = Color.BLUE
        alpha = 200
    }

    @SuppressLint("CanvasSize")
    override fun draw(canvas: Canvas) {
        val widthOffset = canvas.width - storeMap.width * TILE_SIZE

        for (x in 0..<storeMap.width) {
            for (y in 0..<storeMap.height) {
                val tile = storeMap.map[x][y]

                val rect = RectF(
                    widthOffset + (x * TILE_SIZE).toFloat(),
                    (y * TILE_SIZE).toFloat(),
                    widthOffset + ((x + 1) * TILE_SIZE).toFloat(),
                    ((y + 1) * TILE_SIZE).toFloat(),
                )

                val paint = when (tile) {

                    MapObject.Empty -> empty
                    is MapObject.FloorTag -> tag
                    is MapObject.Section -> empty
                    is MapObject.Shelf -> rack
                }



                canvas.drawRect(
                    rect,
                    paint
                )
            }
        }

        val userTile = storeMap.getTileAt(userPos)
        if (userPos != null && userTile != empty) {
            // user is inside the store

            val ux = userPos.x
            val uy = userPos.y

            canvas.drawRect(
                widthOffset + ((ux - 0.25) * TILE_SIZE).toFloat(),
                ((uy - 0.25) * TILE_SIZE).toFloat(),
                widthOffset + ((ux + 0.25) * TILE_SIZE).toFloat(),
                ((uy + 0.25) * TILE_SIZE).toFloat(),
                user
            )

        }
    }

    override fun setAlpha(alpha: Int) {
    }

    override fun setColorFilter(colorFilter: ColorFilter?) {
    }

    @Deprecated(
        "Deprecated in Java",
        ReplaceWith("PixelFormat.TRANSLUCENT", "android.graphics.PixelFormat")
    )
    override fun getOpacity(): Int = PixelFormat.TRANSLUCENT

    companion object {
        const val TILE_SIZE = 64
    }
}