package io.github.yehan2002.visionguide.util

import kotlin.math.sqrt

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

    fun add(dx: Int, dy: Int) = add(dx.toDouble(), dy.toDouble())

    fun add(p: Point2D): Point2D {
        return add(p.x, p.y)
    }

    fun div(v: Double): Point2D {
        return Point2D(x / v, y / v)
    }

    fun mul(v: Double): Point2D {
        return Point2D(x * v, y * v)
    }

    fun mul(v: Int): Point2D = mul(v.toDouble())

    fun div(v: Int): Point2D = div(v.toDouble())

    fun distance(p2: Point2D): Double {
        val dx = x - p2.x
        val dy = y - p2.y

        return sqrt(dx * dx + dy * dy)
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