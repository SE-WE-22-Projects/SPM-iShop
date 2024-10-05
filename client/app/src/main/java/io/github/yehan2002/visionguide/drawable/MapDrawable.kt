package io.github.yehan2002.visionguide.drawable

import android.annotation.SuppressLint
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.ColorFilter
import android.graphics.Paint
import android.graphics.Path
import android.graphics.PixelFormat
import android.graphics.RectF
import android.graphics.drawable.Drawable
import io.github.yehan2002.visionguide.navigation.MapObjects
import io.github.yehan2002.visionguide.navigation.ShopMap
import io.github.yehan2002.visionguide.util.Direction
import io.github.yehan2002.visionguide.util.Point2D

class MapDrawable(
    private val shopMap: ShopMap,
    private val userPos: Point2D?,
    private val userRoute: Array<Point2D>?,
    private val navigationTarget: Point2D?,
    private val userFacing: Direction
) :
    Drawable() {
    private val empty = Paint().apply {
        style = Paint.Style.FILL
        color = Color.WHITE
        alpha = 200
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
        strokeWidth = 2.0F
    }

    private val target = Paint().apply {
        style = Paint.Style.FILL
        color = Color.parseColor("#C4A000")
        strokeWidth = 2.0F
    }

    @SuppressLint("CanvasSize")
    override fun draw(canvas: Canvas) {
        val widthOffset = (canvas.width - shopMap.width * TILE_SIZE) / 2
        val heightOffset = canvas.height - 240 - shopMap.height * TILE_SIZE

        // display the shop map
        for (x in 0..<shopMap.width) {
            for (y in 0..<shopMap.height) {
                val tile = shopMap.getScaledTileAt(x, y)

                val rect = RectF(
                    widthOffset + (x * TILE_SIZE).toFloat(),
                    heightOffset + (y * TILE_SIZE).toFloat(),
                    widthOffset + ((x + 1) * TILE_SIZE).toFloat(),
                    heightOffset + ((y + 1) * TILE_SIZE).toFloat(),
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
                heightOffset + ((uy + 0.5) * TILE_SIZE).toFloat(),
                (USER_SIZE).toFloat(),
                user
            )
            if (userFacing != Direction.UNKNOWN) {

                @Suppress("KotlinConstantConditions")
                val angle = when (userFacing) {
                    Direction.NORTH -> 240F
                    Direction.SOUTH -> 60F
                    Direction.EAST -> -30F
                    Direction.WEST -> 150F
                    Direction.UNKNOWN -> throw RuntimeException("unreachable")
                }

                canvas.drawArc(
                    widthOffset + ((ux + 0.5) * TILE_SIZE - USER_SIZE).toFloat(),
                    heightOffset + ((uy + 0.5) * TILE_SIZE - USER_SIZE).toFloat(),
                    widthOffset + ((ux + 0.5) * TILE_SIZE + USER_SIZE).toFloat(),
                    heightOffset + ((uy + 0.5) * TILE_SIZE + USER_SIZE).toFloat(),
                    angle, 60F, true,
                    target
                )
            }
        }

        if (userRoute != null && userPos != null) {
            val path = Path()


            val ux = userPos.x * ShopMap.SCALE * TILE_SIZE
            val uy = userPos.y * ShopMap.SCALE * TILE_SIZE

            path.moveTo(
                widthOffset + ux.toFloat(), heightOffset + uy.toFloat()
            )

            for (i in userRoute.indices) {
                val pos = userRoute[i].mul(ShopMap.SCALE)

                val px = widthOffset + (pos.x + 0.25) * TILE_SIZE
                val py = heightOffset + (pos.y + 0.25) * TILE_SIZE

                path.lineTo(px.toFloat(), py.toFloat())
            }

            canvas.drawPath(path, userPath)
        }

        if (navigationTarget != null) {
            val ux = navigationTarget.x * ShopMap.SCALE
            val uy = navigationTarget.y * ShopMap.SCALE

            canvas.drawCircle(
                widthOffset + ((ux + 0.5) * TILE_SIZE).toFloat(),
                heightOffset + ((uy + 0.5) * TILE_SIZE).toFloat(),
                (USER_SIZE / 2).toFloat(),
                target
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
        private const val DISPLAY_SCALE = 2
        const val TILE_SIZE = (32 / ShopMap.SCALE) * DISPLAY_SCALE
        const val USER_SIZE = 32 / 2.5 * DISPLAY_SCALE
    }
}