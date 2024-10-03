package io.github.yehan2002.ishop.util

/**
 * A position represented as 2 doubles.
 */
data class Point2D(val x: Double, val y: Double) {

    constructor(x: Int, y: Int) : this(x.toDouble(), y.toDouble())

    /**
     * Returns a new point after adding dx and dy to the current point's coordinates.
     */
    fun add(dx: Double, dy: Double): Point2D {
        return Point2D(dx + x, dy + y)
    }

    fun add(p: Point2D): Point2D {
        return add(p.x, p.y)
    }

    override fun equals(other: Any?): Boolean {
        if (other == null || other !is Point2D) return false

        return other.x == this.x && other.y == this.y
    }

    override fun hashCode(): Int {
        var result = x.hashCode()
        result = 31 * result + y.hashCode()
        return result
    }
}