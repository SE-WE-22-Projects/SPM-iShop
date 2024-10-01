package io.github.yehan2002.ishop.drawable

import android.annotation.SuppressLint
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.ColorFilter
import android.graphics.Paint
import android.graphics.PixelFormat
import android.graphics.drawable.Drawable
import io.github.yehan2002.ishop.navigation.ShopMap

class DebugInfoDrawable(
    private val processTime: Int,
    private val tags: Int,
    private val estPos: ShopMap.Point2D?,
    private vararg val extra: String,
) : Drawable() {
    private val contentTextPaint = Paint().apply {
        color = Color.GREEN
        alpha = 255
        textSize = 36F
    }

    @SuppressLint("DefaultLocale")
    override fun draw(canvas: Canvas) {
        canvas.drawText("Tags: $tags", 32F, 32F, contentTextPaint)
        canvas.drawText("Time: ${processTime}ms", 32F, 64F, contentTextPaint)
        if (estPos != null) {
            canvas.drawText(
                String.format("Pos: x: %.2f y: %.2f", estPos.x, estPos.y),
                32F,
                96F,
                contentTextPaint
            )
        }

        for (i in extra.indices) {
            canvas.drawText(
                extra[i],
                32F,
                96F + 32F * (i + 1),
                contentTextPaint
            )
        }

    }

    override fun setAlpha(alpha: Int) {
        contentTextPaint.alpha = alpha
    }

    override fun setColorFilter(colorFilter: ColorFilter?) {
        contentTextPaint.colorFilter = colorFilter
    }

    @Deprecated(
        "Deprecated in Java",
        ReplaceWith("PixelFormat.TRANSLUCENT", "android.graphics.PixelFormat")
    )
    override fun getOpacity(): Int = PixelFormat.TRANSLUCENT
}