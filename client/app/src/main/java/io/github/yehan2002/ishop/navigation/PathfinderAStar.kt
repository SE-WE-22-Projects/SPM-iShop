package io.github.yehan2002.ishop.navigation

import io.github.yehan2002.ishop.util.Point2D
import java.util.PriorityQueue
import kotlin.math.roundToInt
import kotlin.math.sqrt

class PathfinderAStar(private val map: ShopMap) {

    private val tileInfo: Array<Array<TileInfo>> = Array(map.width) { x ->
        Array(map.height) { y -> TileInfo(x, y) }
    }

    fun findRoute(start: Point2D, end: Point2D): Array<Point2D> {
        resetState()

        val queue = PriorityQueue<TileInfo> { t1, t2 -> return@PriorityQueue t1.score - t2.score }

        val startTile = tileInfo[start.x.toInt()][start.y.toInt()]
        queue.add(startTile)

        var foundPath = false
        var currentTile: TileInfo? = null


        main@
        while (!queue.isEmpty()) {
            do {
                if (queue.isEmpty()) break@main

                currentTile = queue.remove()

            } while (!currentTile!!.open)

            currentTile.open = false

            if (currentTile.x == end.x.toInt() && currentTile.y == end.y.toInt()) {
                foundPath = true
                break
            }

            for (dir in DIRECTIONS) {
                val nextX = currentTile.x + dir.x
                val nextY = currentTile.y + dir.y

                if (isValidTile(nextX, nextY)) {
                    val newTile = tileInfo[nextX][nextY]
                    val score = currentTile.score + getScore(end, nextX, nextY)

                    if (newTile.open) {
                        newTile.score = score
                        newTile.parent = currentTile
                        queue.add(newTile)
                    } else if (newTile.score > score) {
                        newTile.score = score
                        newTile.parent = currentTile
                    }
                }
            }


        }

        if (!foundPath) return arrayOf()

        val path = mutableListOf<Point2D>()
        while (currentTile != null) {
            path.add(Point2D(currentTile.x, currentTile.y))
            currentTile = currentTile.parent
        }

        return path.toTypedArray()

    }


    private fun isValidTile(x: Int, y: Int): Boolean {
        if (x < 0 || y < 0 || x >= map.width || y >= map.height) return false

        return map.map[x][y] !is MapObjects.Shelf
    }


    private fun getScore(end: Point2D, x: Int, y: Int): Int {
        val dx = (end.x.toInt() - x)
        val dy = (end.y.toInt() - y)
        return sqrt((dx * dx + dy * dy).toDouble()).roundToInt()
    }

    private fun resetState() {
        for (row in tileInfo) {
            for (info in row) {
                info.parent = null
                info.open = true
                info.score = 0
            }
        }
    }


    companion object {
        private val DIRECTIONS =
            arrayOf(Direction(-1, 0), Direction(1, 0), Direction(0, -1), Direction(0, 1))

        private class Direction(val x: Int, val y: Int)
        private class TileInfo(
            val x: Int,
            val y: Int,
            var parent: TileInfo? = null,
            var open: Boolean = false,
            var score: Int = 0,
        )
    }
}