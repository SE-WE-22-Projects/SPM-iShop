package io.github.yehan2002.ishop.navigation

import android.util.Log
import androidx.camera.core.ImageProxy
import io.github.yehan2002.ishop.MainActivity.Companion.TAG
import io.github.yehan2002.ishop.camera.CameraBridge
import io.github.yehan2002.ishop.navigation.StoreNavigator.Companion.BUFFER_SIZE
import io.github.yehan2002.ishop.navigation.aruco.ArucoDetector
import io.github.yehan2002.ishop.navigation.aruco.Tag
import io.github.yehan2002.ishop.util.Point2D
import io.github.yehan2002.ishop.util.RingBuffer
import org.opencv.objdetect.Objdetect

class StoreNavigator {
    private var markerBuffer = RingBuffer<Map<Int, Point2D>>(BUFFER_SIZE)

    var lastTags: Array<Tag>? = null
        private set

    val shopMap: ShopMap = ShopMap.loadMapJSON(MapData)
    val detector = ArucoDetector(
        dictionary = Objdetect.getPredefinedDictionary(Objdetect.DICT_4X4_50),
        markerSize = 0.06,
    )

    // TODO: alert on entering new section, tag detection

    /**
     * The current detected position of the user.
     * This can be null if the position cannot be determined.
     */
    var position: Point2D? = null

    var currentTile: MapObjects = MapObjects.Invalid

    var section: MapObjects.Section = MapObjects.UnknownSection


    var route: Array<Point2D>? = null

    fun findMarkers(bridge: CameraBridge, proxy: ImageProxy) {
        val tags: Array<Tag>

        try {
            tags = detector.detectMarkers(bridge, proxy.toBitmap())
        } catch (e: Exception) {
            Log.e(TAG, "Failed to find tags", e)
            return
        }

        addMarkers(tags)

    }

    /**
     * This method adds the given markers to the marker buffer.
     * The position of the user is determined using the average position of the user relative to all
     * markers detected within the last [BUFFER_SIZE] calls to this method.
     * This method must be called each time a frame is processed even if there are no detected markers.
     */
    private fun addMarkers(markers: Array<Tag>?) {
        if (!markers.isNullOrEmpty()) {
            // convert the markers to a map of ids and estimated user positions

            val markerPos = mutableMapOf<Int, Point2D>()
            for (marker in markers) {
                // relative position cannot be determined if the rotation data is not available
                if (marker.rotation == null) continue

                // estimate the user position from the marker distance and rotation
                val est =
                    shopMap.estimatePos(marker.id, marker.distance, marker.rotation)

                if (est != null)
                    markerPos[marker.id] = est
            }

            markerBuffer.add(markerPos)
        } else {
            // add null to overwrite the oldest detection data
            markerBuffer.add(null)
        }

        lastTags = markers
        updatePosition()
    }

    /**
     * Updates the user position using the marker detection history
     */
    private fun updatePosition() {
        val positions = mutableMapOf<Int, WeightedPos>()

        var weight = 0
        for (history in markerBuffer) {
            weight += 1

            if (history == null) continue

            for (tag in history) {
                val pos = positions.getOrPut(tag.key) { WeightedPos() }
                pos.add(weight, tag.value)
            }
        }

        // no markers, cannot determine position
        if (positions.isEmpty()) {
            position = null
            currentTile = MapObjects.Invalid
            section = MapObjects.UnknownSection
            route = null
            return
        }

        // get the sum of all positions
        val positionSum = positions.map { entry -> entry.value.toPoint() }
            .reduce { acc, point2D -> point2D.add(acc) }

        // get the average position of the user based on all detected tags.
        val userPosition =
            Point2D(positionSum.x / positions.size, positionSum.y / positions.size)

        val tile = shopMap.getTileAt(position)

        position = userPosition
        currentTile = tile
        section = if (tile is MapObjects.Valid) tile.position() else MapObjects.UnknownSection

        route = shopMap.pathfinder.findRoute(userPosition, Point2D(10, 10))
    }


    /**
     * A class used to calculate the weighted average of positions.
     */
    private class WeightedPos {
        var weight: Int = 0
        var x: Double = 0.0
        var y: Double = 0.0


        /**
         * Add a position with the given weight.
         */
        fun add(weight: Int, newPos: Point2D) {
            this.weight += weight
            this.x += newPos.x * weight
            this.y += newPos.y * weight
        }

        /**
         * Convert the weighted position to [ShopMap.Point2D].
         */
        fun toPoint(): Point2D {
            return Point2D(x / weight, y / weight)
        }
    }


    companion object {
        const val BUFFER_SIZE = 10
    }
}