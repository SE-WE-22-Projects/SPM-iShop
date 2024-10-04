package io.github.yehan2002.ishop.drawable

import android.annotation.SuppressLint
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.ColorFilter
import android.graphics.Paint
import android.graphics.Path
import android.graphics.PixelFormat
import android.graphics.RectF
import android.graphics.drawable.Drawable
import io.github.yehan2002.ishop.navigation.MapObjects
import io.github.yehan2002.ishop.navigation.ShopMap
import io.github.yehan2002.ishop.util.Point2D

class MapDrawable(
    private val shopMap: ShopMap,
    private val userPos: Point2D?,
    private val userRoute: Array<Point2D>?
) :
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
        color = Color.parseColor("#0084CA")
    }

    private val userPath = Paint().apply {
        style = Paint.Style.STROKE
        color = Color.parseColor("#0084CA")
    }

    @SuppressLint("CanvasSize")
    override fun draw(canvas: Canvas) {
        val widthOffset = canvas.width - shopMap.width * TILE_SIZE

        // display the shop map
        for (x in 0..<shopMap.width) {
            for (y in 0..<shopMap.height) {
                val tile = shopMap.getTileAt(x, y)

                val rect = RectF(
                    widthOffset + (x * TILE_SIZE).toFloat(),
                    (y * TILE_SIZE).toFloat(),
                    widthOffset + ((x + 1) * TILE_SIZE).toFloat(),
                    ((y + 1) * TILE_SIZE).toFloat(),
                )

                val paint = when (tile) {

                    MapObjects.Invalid -> empty
                    is MapObjects.FloorTag -> tag
                    is MapObjects.Section -> empty
                    is MapObjects.Shelf -> rack
                }



                canvas.drawRect(
                    rect,
                    paint
                )
            }
        }


        // display the user's position
        val userTile = shopMap.getTileAt(userPos)
        if (userPos != null && userTile != empty) {
            // user is inside the store

            val ux = userPos.x * ShopMap.SCALE
            val uy = userPos.y * ShopMap.SCALE

            canvas.drawCircle(
                widthOffset + ((ux + 0.5) * TILE_SIZE).toFloat(),
                ((uy + 0.5) * TILE_SIZE).toFloat(),
                (USER_SIZE).toFloat(),
                user
            )

        }

        if (userRoute != null) {
            val path = Path()

            var first = true

            for (i in userRoute.indices) {
                val pos = userRoute[i].mul(ShopMap.SCALE)

                val px = widthOffset + (pos.x + 0.5) * TILE_SIZE
                val py = (pos.y + 0.5) * TILE_SIZE

                if (first) path.moveTo(px.toFloat(), py.toFloat())
                else path.lineTo(px.toFloat(), py.toFloat())

                first = false
            }

            canvas.drawPath(path, userPath)
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
        const val TILE_SIZE = (32 / ShopMap.SCALE).toInt()
        const val USER_SIZE = 32 / 2.5
    }
}