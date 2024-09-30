package io.github.yehan2002.ishop.navigation

import android.util.Log
import io.github.yehan2002.ishop.MainActivity.Companion.TAG
import org.json.JSONObject
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.roundToInt
import kotlin.math.sin

class StoreMap(val width: Int, val height: Int) {
    var map: Array<Array<MapObject>> = Array(width) {
        Array(height) { MapObject.Invalid }
    }
    var markers = mutableMapOf<Int, Point2D>()

    fun estimatePos(markerId: Int, distance: Double, angle: Double): Point2D? {
        val pos = markers[markerId]
        if (pos == null) {
            Log.d(TAG, "Invalid marker id")
            return null
        }

        val angleRad = (angle / 180) * PI

        // calculate the position.
        // https://stackoverflow.com/a/13895314/6587830
        val position = Point2D(
            pos.x + distance * cos(angleRad),
            pos.y + distance * sin(angleRad)
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
     * If the position is null or outside the mapped area, [MapObject.Invalid] is returned.
     */
    fun getTileAt(pos: Point2D?): MapObject {
        if (pos == null) return MapObject.Invalid

        val x = pos.x.roundToInt()
        val y = pos.y.roundToInt()

        if (x < 0 || x > height || y < 0 || y > width) return MapObject.Invalid

        return map[pos.x.roundToInt()][pos.y.roundToInt()]
    }


    override fun toString(): String {
        val sb = StringBuilder()

        for (row in map) {
            if (sb.isNotEmpty()) sb.append('\n')

            for (tile in row) {
                sb.append(
                    when (tile) {
                        MapObject.Invalid -> "U"
                        is MapObject.FloorTag -> "T"
                        is MapObject.Section -> tile.sectionId.toString()
                        is MapObject.Shelf -> "R"
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
    }


    companion object {
        fun loadMapJSON(jsonData: String): StoreMap {
            val json = JSONObject(jsonData)

            val height = json.getJSONObject("size").getDouble("height")
            val width = json.getJSONObject("size").getDouble("width")

            val map = StoreMap((width).toInt(), (height).toInt())

            val sections = mutableMapOf<Int, MapObject.Section>()

            val sectionsArray = json.getJSONArray("sections")
            for (i in 0..<sectionsArray.length()) {
                val data = sectionsArray.getJSONObject(i)
                val section =
                    MapObject.Section(
                        data.getInt("id"),
                        data.getString("name")
                    )
                sections[section.sectionId] = section
            }

            val rackArray = json.getJSONArray("racks")
            for (i in 0..<rackArray.length()) {
                val data = rackArray.getJSONObject(i)
                val section = sections[data.getInt("section")]!!

                val rack = MapObject.Shelf(data.getInt("id"), section)

                val topX = (data.getDouble("top_x")).toInt()
                val topY = (data.getDouble("top_y")).toInt()
                val bottomX = (data.getDouble("bottom_x")).toInt()
                val bottomY = (data.getDouble("bottom_y")).toInt()

                for (x in topX..<bottomX) {
                    for (y in topY..<bottomY) {
                        if (map.map[x][y] !== MapObject.Invalid) {
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

                val tag = MapObject.FloorTag(data.getInt("code"), section)

                val posX = (data.getDouble("pos_x")).toInt()
                val posY = (data.getDouble("pos_y")).toInt()

                if (map.map[posX][posY] !== MapObject.Invalid) {
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
                        if (map.map[x][y] == MapObject.Invalid) {
                            map.map[x][y] = section
                        }

                    }
                }


            }

            return map
        }

        fun loadTestMap(): StoreMap {

            // the test map has 4 sections that have 2 shelves and 2 tags each.
            val sections = arrayOf(
                MapObject.Section(1, "Section A"),
                MapObject.Section(2, "Section B"),
                MapObject.Section(3, "Section C"),
                MapObject.Section(4, "Section D")
            )

            val areaPattern = arrayOf(
                "L***R",
                "L***R",
                "L*T*R",
                "L***R",
                "L***R"
            )

            val map = StoreMap(areaPattern.size * 2, areaPattern[0].length * 2 + 1)


            fun addArea(
                startX: Int, startY: Int,
                section: MapObject.Section,
                shelfLeft: MapObject.Shelf,
                shelfRight: MapObject.Shelf,
                tag: MapObject.FloorTag
            ) {

                var y = startY
                for (rowPattern in areaPattern) {
                    var x = startX
                    for (tile in rowPattern) {
                        map.map[x][y] = when (tile) {
                            'L' -> shelfLeft
                            'R' -> shelfRight
                            'T' -> tag
                            '*' -> section
                            else -> throw RuntimeException("Invalid tile type $tile")
                        }

                        if (tile == 'T') {
                            map.markers[tag.tagId] = Point2D(x, y)
                        }

                        x += 1
                    }
                    y += 1
                }

            }

            for (idx in sections.indices) {
                addArea(
                    (idx / 2) * areaPattern[0].length,
                    (idx % 2) * (areaPattern.size + 1),
                    sections[idx],
                    MapObject.Shelf(idx * 2 + 1, sections[idx]),
                    MapObject.Shelf(idx * 2 + 2, sections[idx]),
                    MapObject.FloorTag(idx + 1, sections[idx])
                )
            }

            return map
        }
    }
}