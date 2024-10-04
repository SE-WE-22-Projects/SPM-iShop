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

    val markers = mutableMapOf<Int, MapObjects.FloorTag>()
    val shelves = mutableMapOf<Int, MapObjects.Shelf>()
    val sections = mutableMapOf<Int, MapObjects.Section>()

    private val pathfinder = PathfinderAStar(this)

    fun estimatePos(markerId: Int, distance: Double, angle: Tag.Rotation): Point2D? {
        val tag = markers[markerId]
        if (tag == null) {
            Log.d(TAG, "Invalid marker id")
            return null
        }

        // calculate the position.
        // https://stackoverflow.com/a/13895314/6587830
        val position = Point2D(
            tag.pos.x + distance * cos(angle.yaw),
            tag.pos.y + distance * sin(angle.yaw)
        )

        // check if the position is within the map.
        // a buffer of 10 meters is added around the map.
        if (position.x < -10 || position.y < -10 || position.x > height + 10 || position.y > width + 10) {
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

        val x = (pos.x * SCALE).roundToInt()
        val y = (pos.y * SCALE).roundToInt()

        if (x < 0 || x > height || y < 0 || y > width) return MapObjects.Invalid

        return map[x][x]
    }

    fun getRackPosition(rackId: Int): Point2D? {
        val rack = shelves[rackId] ?: return null

        val midY = rack.top.y + (rack.bottom.y - rack.top.y - 1) / 2

        var pos = Point2D(rack.top.x - 1, midY)
        if (getTileAt(pos) is MapObjects.Section) {
            return pos.add(1, 0)
        }

        pos = Point2D(rack.bottom.x + 1, midY)
        if (getTileAt(pos) is MapObjects.Section) {
            return pos.add(-1, 0)
        }

        return null
    }

    /**
     * Gets the tile at the given position. The tile coordinates are multiplied by the [SCALE].
     * If the position is null or outside the mapped area, [MapObjects.Invalid] is returned.
     */
    fun getScaledTileAt(x: Int, y: Int): MapObjects {
        if (x < 0 || x > height || y < 0 || y > width) return MapObjects.Invalid

        return map[x][y]
    }

    fun findRoute(start: Point2D, end: Point2D): Array<Point2D> {
        val route = pathfinder.findRoute(start.mul(SCALE), end.mul(SCALE))

        return route.map { it.div(SCALE) }.toTypedArray()
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


    private fun addObject(obj: MapObjects) {
        when (obj) {
            is MapObjects.FloorTag -> {
                val mapPosX = (obj.pos.x * SCALE).toInt()
                val mapPosY = (obj.pos.y * SCALE).toInt()

                if (map[mapPosX][mapPosY] !== MapObjects.Invalid) {
                    throw RuntimeException("Tiles overlap ${map[mapPosX][mapPosY]}")
                }

                map[mapPosX][mapPosY] = obj
                markers[obj.tagId] = obj
            }

            is MapObjects.Section -> {
                val topX = (obj.top.x * SCALE).toInt()
                val topY = (obj.top.y * SCALE).toInt()
                val bottomX = (obj.bottom.x * SCALE).toInt()
                val bottomY = (obj.bottom.y * SCALE).toInt()

                for (x in topX..<bottomX) {
                    for (y in topY..<bottomY) {
                        if (map[x][y] == MapObjects.Invalid) {
                            map[x][y] = obj
                        }

                    }
                }

                sections[obj.sectionId] = obj
            }

            is MapObjects.Shelf -> {
                val topX = (obj.top.x * SCALE).toInt()
                val topY = (obj.top.y * SCALE).toInt()
                val bottomX = (obj.bottom.x * SCALE).toInt()
                val bottomY = (obj.bottom.y * SCALE).toInt()

                for (x in topX..<bottomX) {
                    for (y in topY..<bottomY) {
                        if (map[x][y] !== MapObjects.Invalid) {
                            throw RuntimeException("Tiles overlap ${map[x][y]}")
                        }

                        map[x][y] = obj
                        shelves[obj.shelfId] = obj
                    }
                }
            }

            MapObjects.Invalid -> throw IllegalArgumentException("Cannot add Invalid object to map")
        }
    }

    companion object {
        const val SCALE = 2

        fun loadMapJSON(data: MapData): ShopMap {
            val map = ShopMap((data.size.width * SCALE).toInt(), (data.size.height * SCALE).toInt())

            val sections = mutableMapOf<Int, MapObjects.Section>()
            data.sections.forEach {
                sections[it.id] = MapObjects.Section(
                    it.id,
                    it.name,
                    Point2D(it.topX, it.topY),
                    Point2D(it.bottomX, it.bottomY)
                )
            }

            data.racks.forEach {
                val rack = MapObjects.Shelf(
                    it.id, sections[it.section]!!,
                    Point2D(it.topX, it.topY),
                    Point2D(it.bottomX, it.bottomY)
                )

                map.addObject(rack)
            }

            data.tags.forEach {
                val tag = MapObjects.FloorTag(it.code, sections[it.section]!!, Point2D(it.x, it.y))
                map.addObject(tag)
            }

            sections.forEach {
                map.addObject(it.value)
            }

            return map
        }
    }
}