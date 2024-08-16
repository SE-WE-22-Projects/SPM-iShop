package io.github.yehan2002.ishop.aruco

import org.opencv.core.Mat
import org.opencv.core.Point
import org.opencv.core.Scalar
import org.opencv.imgproc.Imgproc

/**
 * Adds a line of text to the given image.
 */
fun addTextLine(img: Mat, row: Int, text: String) {
    Imgproc.putText(
        img,
        text,
        Point(8.0, 32.0 * (row + 1)),
        Imgproc.FONT_HERSHEY_SIMPLEX,
        1.0,
        Scalar(0.0, 255.0, 0.0)
    )
}
