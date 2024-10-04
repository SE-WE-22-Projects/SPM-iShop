package io.github.yehan2002.ishop.navigation

import android.util.Log
import io.github.yehan2002.ishop.MainActivity.Companion.TAG
import io.github.yehan2002.ishop.navigation.aruco.Tag
import io.github.yehan2002.ishop.net.dto.MapData
import io.github.yehan2002.ishop.util.Point2D
import kotlin.math.cos
import kotlin.math.roundToInt
import kotlin.math.sin

class ShopMap(val width: Int, val height: Int) {
    private val map: Array<Array<MapObjects>> = Array(width) {
        Array(height) { MapObjects.Invalid }
    }

    val markers = mutableMapOf<Int, Point2D>()

    val pathfinder = PathfinderAStar(this)

    fun estimatePos(markerId: Int, distance: Double, angle: Tag.Rotation): Point2D? {
        val pos = markers[markerId]
        if (pos == null) {
            Log.d(TAG, "Invalid marker id")
            return null
        }

        // calculate the position.
        // https://stackoverflow.com/a/13895314/6587830
        val position = Point2D(
            pos.x + distance * cos(angle.yaw),
            pos.y + distance * sin(angle.yaw)
        )

        // check if the position is within the map.
        // a buffer of 10 meters is added around the map.
        if (pos.x < -10 || pos.y < -10 || pos.x > height + 10 || pos.y > width + 10) {
            Log.d(TAG, "Position outsize map")
            return null
        }

        return position
    }

    /**
     * Gets the tile at the given position.
     * If the position is null or outside the mapped area, [MapObjects.Invalid] is returned.
     */
    fun getTileAt(pos: Point2D?): MapObjects {
        if (pos == null) return MapObjects.Invalid

        val x = pos.x.roundToInt()
        val y = pos.y.roundToInt()

        if (x < 0 || x > height || y < 0 || y > width) return MapObjects.Invalid

        return map[pos.x.roundToInt()][pos.y.roundToInt()]
    }

    /**
     * Gets the tile at the given position.
     * If the position is null or outside the mapped area, [MapObjects.Invalid] is returned.
     */
    fun getTileAt(x: Int, y: Int): MapObjects {
        if (x < 0 || x > height || y < 0 || y > width) return MapObjects.Invalid

        return map[x][y]
    }

    override fun toString(): String {
        val sb = StringBuilder()

        for (row in map) {
            if (sb.isNotEmpty()) sb.append('\n')

            for (tile in row) {
                sb.append(
                    when (tile) {
                        MapObjects.Invalid -> "U"
                        is MapObjects.FloorTag -> "T"
                        is MapObjects.Section -> tile.sectionId.toString()
                        is MapObjects.Shelf -> "R"
                    }
                )
            }
        }


        return sb.toString()
    }


    companion object {
        fun loadMapJSON(data: MapData): ShopMap {
            val map = ShopMap(data.size.width.toInt(), data.size.height.toInt())

            val sections = mutableMapOf<Int, MapObjects.Section>()
            data.sections.forEach {
                sections[it.id] = MapObjects.Section(it.id, it.name)
            }

            data.racks.forEach {
                val rack = MapObjects.Shelf(it.id, sections[it.section]!!)

                val topX = (it.topX).toInt()
                val topY = (it.topY).toInt()
                val bottomX = (it.bottomX).toInt()
                val bottomY = (it.bottomY).toInt()

                for (x in topX..<bottomX) {
                    for (y in topY..<bottomY) {
                        if (map.map[x][y] !== MapObjects.Invalid) {
                            throw RuntimeException("Tiles overlap ${map.map[x][y]}")
                        }

                        map.map[x][y] = rack
                    }
                }
            }

            data.tags.forEach {
                val section = sections[it.section]!!
                val tag = MapObjects.FloorTag(it.code, section)

                val posX = it.x.toInt()
                val posY = it.y.toInt()

                if (map.map[posX][posY] !== MapObjects.Invalid) {
                    throw RuntimeException("Tiles overlap ${map.map[posX][posY]}")
                }

                map.map[posX][posY] = tag
                map.markers[tag.tagId] = Point2D(posX, posY)
            }

            data.sections.forEach {
                val section = sections[it.id]!!

                val topX = (it.topX).toInt()
                val topY = (it.topY).toInt()
                val bottomX = (it.bottomX).toInt()
                val bottomY = (it.bottomY).toInt()

                for (x in topX..<bottomX) {
                    for (y in topY..<bottomY) {
                        if (map.map[x][y] == MapObjects.Invalid) {
                            map.map[x][y] = section
                        }

                    }
                }
            }

            return map
        }

    }
}