package io.github.yehan2002.ishop.aruco

import android.graphics.Canvas
import android.graphics.Color
import android.graphics.ColorFilter
import android.graphics.Paint
import android.graphics.PixelFormat
import android.graphics.drawable.Drawable

class DebugInfoDrawable(private val processTime: Int, private val tags: Int) : Drawable() {
    private val contentTextPaint = Paint().apply {
        color = Color.GREEN
        alpha = 255
        textSize = 36F
    }

    override fun draw(canvas: Canvas) {
        canvas.drawText("Tags: $tags", 32F, 32F, contentTextPaint)
        canvas.drawText("Time: ${processTime}ms", 32F, 64F, contentTextPaint)

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