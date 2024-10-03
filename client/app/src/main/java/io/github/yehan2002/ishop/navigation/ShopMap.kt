package io.github.yehan2002.ishop.navigation

import android.util.Log
import io.github.yehan2002.ishop.MainActivity.Companion.TAG
import io.github.yehan2002.ishop.aruco.Tag
import org.json.JSONObject
import kotlin.math.cos
import kotlin.math.roundToInt
import kotlin.math.sin

class ShopMap(val width: Int, val height: Int) {
    var map: Array<Array<MapObjects>> = Array(width) {
        Array(height) { MapObjects.Invalid }
    }
    var markers = mutableMapOf<Int, Point2D>()

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


    companion object {
        fun loadMapJSON(jsonData: String): ShopMap {
            val json = JSONObject(jsonData)

            val height = json.getJSONObject("size").getDouble("height")
            val width = json.getJSONObject("size").getDouble("width")

            val map = ShopMap((width).toInt(), (height).toInt())

            val sections = mutableMapOf<Int, MapObjects.Section>()

            val sectionsArray = json.getJSONArray("sections")
            for (i in 0..<sectionsArray.length()) {
                val data = sectionsArray.getJSONObject(i)
                val section =
                    MapObjects.Section(
                        data.getInt("id"),
                        data.getString("name")
                    )
                sections[section.sectionId] = section
            }

            val rackArray = json.getJSONArray("racks")
            for (i in 0..<rackArray.length()) {
                val data = rackArray.getJSONObject(i)
                val section = sections[data.getInt("section")]!!

                val rack = MapObjects.Shelf(data.getInt("id"), section)

                val topX = (data.getDouble("top_x")).toInt()
                val topY = (data.getDouble("top_y")).toInt()
                val bottomX = (data.getDouble("bottom_x")).toInt()
                val bottomY = (data.getDouble("bottom_y")).toInt()

                for (x in topX..<bottomX) {
                    for (y in topY..<bottomY) {
                        if (map.map[x][y] !== MapObjects.Invalid) {
                            throw RuntimeException("Tiles overlap ${map.map[x][y]}")
                        }

                        map.map[x][y] = rack
                    }
                }
            }

            val tagArray = json.getJSONArray("tags")
            for (i in 0..<tagArray.length()) {
                val data = tagArray.getJSONObject(i)
                val section = sections[data.getInt("section")]!!

                val tag = MapObjects.FloorTag(data.getInt("code"), section)

                val posX = (data.getDouble("pos_x")).toInt()
                val posY = (data.getDouble("pos_y")).toInt()

                if (map.map[posX][posY] !== MapObjects.Invalid) {
                    throw RuntimeException("Tiles overlap ${map.map[posX][posY]}")
                }

                map.map[posX][posY] = tag
                map.markers[tag.tagId] = Point2D(posX, posY)
            }

            for (i in 0..<sectionsArray.length()) {
                val data = sectionsArray.getJSONObject(i)
                val section = sections[data.getInt("id")]!!

                val topX = (data.getDouble("top_x")).toInt()
                val topY = (data.getDouble("top_y")).toInt()
                val bottomX = (data.getDouble("bottom_x")).toInt()
                val bottomY = (data.getDouble("bottom_y")).toInt()

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