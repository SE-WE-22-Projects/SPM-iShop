package io.github.yehan2002.visionguide.navigation

import android.util.Log
import androidx.camera.core.ImageProxy
import io.github.yehan2002.visionguide.MainActivity.Companion.TAG
import io.github.yehan2002.visionguide.camera.CameraBridge
import io.github.yehan2002.visionguide.navigation.StoreNavigator.Companion.BUFFER_SIZE
import io.github.yehan2002.visionguide.navigation.aruco.ArucoDetector
import io.github.yehan2002.visionguide.navigation.aruco.Tag
import io.github.yehan2002.visionguide.net.dto.MapData
import io.github.yehan2002.visionguide.util.Point2D
import io.github.yehan2002.visionguide.util.RingBuffer
import org.opencv.objdetect.Objdetect

class StoreNavigator(private val handler: NavigationHandler) {
    private var markerBuffer = RingBuffer<Map<Int, Point2D>>(BUFFER_SIZE)

    var lastTags: Array<Tag>? = null
        private set

    var shopMap: ShopMap = ShopMap(0, 0)
        private set

    private val detector = ArucoDetector(
        dictionary = Objdetect.getPredefinedDictionary(Objdetect.DICT_4X4_50),
        markerSize = 0.06,
    )

    var target: Point2D? = null

    // TODO: alert on entering new section, tag detection

    /**
     * The current detected position of the user.
     * This can be null if the position cannot be determined.
     */
    var position: Point2D? = null

    var currentTile: MapObjects = MapObjects.Invalid

    var section: MapObjects.Section = MapObjects.UnknownSection

    var userFacing: ShopMap.Direction = ShopMap.Direction.UNKNOWN

    var route: Array<Point2D>? = null

    private var tick = 0


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

    fun loadMap(data: MapData) {
        shopMap = ShopMap.loadMapJSON(data)

        position = null
        currentTile = MapObjects.Invalid
        section = MapObjects.UnknownSection
        route = null
    }

    fun setMarkerSize(size: Double) {
        detector.setMarkerLength(size)
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

            if (markers.isNotEmpty()) {
                val marker = markers[0]
                if (marker.rotation != null) {
                    userFacing = shopMap.getFacingDirection(marker.id, marker.rotation)
                }
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

        val newSection =
            if (tile is MapObjects.Valid) tile.position() else MapObjects.UnknownSection

        if (newSection != section) {
            handler.onSectionChange(newSection, section)
        }

        position = userPosition
        currentTile = tile
        section = newSection



        tick++

        val currentTarget = target
        if (currentTarget != null) {
            if (userPosition.distance(currentTarget) < 1) {
                target = null
                route = null
                handler.onDestinationReached()
            } else if (tick % 10 == 0)
                route = shopMap.findRoute(userPosition, currentTarget)
        } else {
            route = null
        }

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
         * Convert the weighted position to [Point2D].
         */
        fun toPoint(): Point2D {
            return Point2D(x / weight, y / weight)
        }
    }

    interface NavigationHandler {
        fun onSectionChange(section: MapObjects.Section, prevSection: MapObjects.Section)
        fun onDestinationReached()
        fun onRouteDirectionChange()
    }


    companion object {
        const val BUFFER_SIZE = 10
    }
}