package io.github.yehan2002.visionguide.drawable

import android.annotation.SuppressLint
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.ColorFilter
import android.graphics.Paint
import android.graphics.Path
import android.graphics.PixelFormat
import android.graphics.drawable.Drawable
import io.github.yehan2002.visionguide.navigation.aruco.Tag

class TagDrawable(
    private val tag: Tag,
) : Drawable() {

    private val boundingRectPaint = Paint().apply {
        style = Paint.Style.STROKE
        color = Color.GREEN
        strokeWidth = 3F
        alpha = 200
    }

    private val boundingRectTopPaint = Paint().apply {
        style = Paint.Style.STROKE
        color = Color.BLUE
        strokeWidth = 3F
        alpha = 200
    }


    private val tagContent = Paint().apply {
        color = Color.CYAN
        alpha = 128
        style = Paint.Style.FILL
    }

    private val contentIDPaint = Paint().apply {
        color = Color.BLUE
        alpha = 255
        textSize = 40F
    }

    private val contentTextPaint = Paint().apply {
        color = Color.RED
        alpha = 255
        textSize = 32F
    }

    private val topDotPaint = Paint().apply {
        style = Paint.Style.STROKE
        color = Color.RED
        strokeWidth = 26F
        alpha = 200
    }


    @SuppressLint("DefaultLocale")
    override fun draw(canvas: Canvas) {
        val pts = tag.corners

        // paint a square over the detected tag
        val path = Path()
        path.lineTo(pts[0], pts[1])
        path.lineTo(pts[2], pts[3])
        path.lineTo(pts[4], pts[5])
        path.lineTo(pts[6], pts[7])
        path.lineTo(pts[0], pts[1])
        canvas.drawPath(path, tagContent)

        // draw the tag borders
        canvas.drawLine(pts[0], pts[1], pts[2], pts[3], boundingRectTopPaint)
        canvas.drawLine(pts[2], pts[3], pts[4], pts[5], boundingRectPaint)
        canvas.drawLine(pts[4], pts[5], pts[6], pts[7], boundingRectPaint)
        canvas.drawLine(pts[6], pts[7], pts[0], pts[1], boundingRectPaint)

        // draw an orange point at the top corner of the tag.
        canvas.drawPoint(pts[0], pts[1], topDotPaint)


        // display tag ID
        canvas.drawText(
            tag.id.toString(),
            (pts[0] + pts[4]) / 2,
            (pts[1] + pts[5]) / 2,
            contentIDPaint
        )

        // display distance to tag
        canvas.drawText(
            String.format("%.2fm", tag.distance),
            (pts[0] + pts[4]) / 2,
            (pts[1] + pts[5]) / 2 + 32,
            contentTextPaint
        )

        // display rotation information
        if (tag.rotation != null) {
            val yaw = Math.toDegrees(tag.rotation.yaw)

            canvas.drawText(
                String.format("%.2f°", ((if (yaw < 0) 360 + yaw else yaw) + 90) % 360),
                (pts[0] + pts[4]) / 2,
                (pts[1] + pts[5]) / 2 + 64,
                contentTextPaint
            )

            if (DEBUG_TAGS) {
                canvas.drawText(
                    String.format(
                        "%.2f %.2f",
                        Math.toDegrees(tag.rotation.roll),
                        Math.toDegrees(tag.rotation.pitch)
                    ),
                    (pts[0] + pts[4]) / 2,
                    (pts[1] + pts[5]) / 2 + 96,
                    contentTextPaint
                )

                canvas.drawText(
                    String.format(
                        "%.2f %.2f %.2f",
                        tag.position!!.x,
                        tag.position.y,
                        tag.position.z
                    ),
                    (pts[0] + pts[4]) / 2,
                    (pts[1] + pts[5]) / 2 + 128,
                    contentTextPaint
                )
            }
        }


    }

    override fun setAlpha(alpha: Int) {}

    override fun setColorFilter(colorFiter: ColorFilter?) {}

    @Deprecated(
        "Deprecated in Java",
        ReplaceWith("PixelFormat.TRANSLUCENT", "android.graphics.PixelFormat")
    )
    override fun getOpacity(): Int = PixelFormat.TRANSLUCENT

    companion object {
        const val DEBUG_TAGS = true
    }
}