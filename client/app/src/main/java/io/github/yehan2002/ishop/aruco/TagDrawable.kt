package io.github.yehan2002.ishop.aruco

import android.graphics.Canvas
import android.graphics.Color
import android.graphics.ColorFilter
import android.graphics.Matrix
import android.graphics.Paint
import android.graphics.Path
import android.graphics.PixelFormat
import android.graphics.drawable.Drawable

class TagDrawable(
    private val pos: Tag,
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

    private val contentTextPaint = Paint().apply {
        color = Color.RED
        alpha = 255
        textSize = 36F
    }

    private val contentPadding = 25
    override fun draw(canvas: Canvas) {
//        canvas.drawRect(pos, boundingRectPaint)
//        canvas.drawRect(
//            Rect(
//                pos.left,
//                pos.bottom + contentPadding / 2,
//                pos.left + 12 + contentPadding * 2,
//                pos.bottom + contentTextPaint.textSize.toInt() + contentPadding
//            ),
//            contentRectPaint
//        )


        // convert the image points into point on the screen
        val pts = floatArrayOf(
            pos.points[0].x, pos.points[0].y,
            pos.points[1].x, pos.points[1].y,
            pos.points[2].x, pos.points[2].y,
            pos.points[3].x, pos.points[3].y,
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

        canvas.drawText(
            pos.id.toString(),
            (pts[0] + pts[4]) / 2,
            (pts[1] + pts[5]) / 2,
            contentTextPaint
        )

//        canvas.drawText(
//            qrCodeViewModel.qrContent,
//            (pos.left + contentPadding).toFloat(),
//            (pos.bottom + contentPadding * 2).toFloat(),
//            contentTextPaint
//        )
    }

    override fun setAlpha(alpha: Int) {
        boundingRectPaint.alpha = alpha
        boundingRectTopPaint.alpha = alpha
        contentTextPaint.alpha = alpha
    }

    override fun setColorFilter(colorFiter: ColorFilter?) {
        boundingRectPaint.colorFilter = colorFilter
        boundingRectTopPaint.colorFilter = colorFilter
        contentTextPaint.colorFilter = colorFilter
    }

    @Deprecated(
        "Deprecated in Java",
        ReplaceWith("PixelFormat.TRANSLUCENT", "android.graphics.PixelFormat")
    )
    override fun getOpacity(): Int = PixelFormat.TRANSLUCENT
}