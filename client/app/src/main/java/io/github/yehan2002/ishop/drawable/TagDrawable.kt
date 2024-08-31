package io.github.yehan2002.ishop.drawable

import android.graphics.Canvas
import android.graphics.Color
import android.graphics.ColorFilter
import android.graphics.Matrix
import android.graphics.Paint
import android.graphics.Path
import android.graphics.PixelFormat
import android.graphics.drawable.Drawable
import io.github.yehan2002.ishop.aruco.Tag

class TagDrawable(
    private val tag: Tag,
    private val correction: Matrix,
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


    override fun draw(canvas: Canvas) {

        // convert the image points into point on the screen
        val pts = floatArrayOf(
            tag.corners[0].x, tag.corners[0].y,
            tag.corners[1].x, tag.corners[1].y,
            tag.corners[2].x, tag.corners[2].y,
            tag.corners[3].x, tag.corners[3].y,
        )
        correction.mapPoints(pts)

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
            "${tag.distance}m",
            (pts[0] + pts[4]) / 2,
            (pts[1] + pts[5]) / 2 + 32,
            contentTextPaint
        )

        // display rotation information
        if (tag.rotation != null) {
            canvas.drawText(
                String.format("%.2f°", tag.rotation.facingYaw),
                (pts[0] + pts[4]) / 2,
                (pts[1] + pts[5]) / 2 + 64,
                contentTextPaint
            )
        }


    }

    override fun setAlpha(alpha: Int) {}

    override fun setColorFilter(colorFiter: ColorFilter?) {}

    @Deprecated(
        "Deprecated in Java",
        ReplaceWith("PixelFormat.TRANSLUCENT", "android.graphics.PixelFormat")
    )
    override fun getOpacity(): Int = PixelFormat.TRANSLUCENT
}