package io.github.yehan2002.ishop.navigation

import io.github.yehan2002.ishop.aruco.Tag
import io.github.yehan2002.ishop.util.RingBuffer

class StoreNavigator {
    private var markerBuffer = RingBuffer<Map<Int, StoreMap.Point2D>>(BUFFER_SIZE)
    val storeMap: StoreMap = StoreMap.loadTestMap()

    /**
     * The current detected position of the user.
     * This can be null if the position cannot be determined.
     */
    var position: StoreMap.Point2D? = null

    /**
     * This method adds the given markers to the marker buffer.
     * The position of the user is determined using the average position of the user relative to all
     * markers detected within the last [BUFFER_SIZE] calls to this method.
     * This method must be called each time a frame is processed even if there are no detected markers.
     */
    fun addMarkers(markers: Array<Tag>?) {
        if (!markers.isNullOrEmpty()) {
            // convert the markers to a map of ids and estimated user positions

            val markerPos = mutableMapOf<Int, StoreMap.Point2D>()
            for (marker in markers) {
                // relative position cannot be determined if the rotation data is not available
                if (marker.rotation == null) continue

                // estimate the user position from the marker distance and rotation
                val est =
                    storeMap.estimatePos(marker.id, marker.distance, marker.rotation.facingYaw)

                if (est != null)
                    markerPos[marker.id] = est
            }

            markerBuffer.add(markerPos)
        } else {
            // add null to overwrite the oldest detection data
            markerBuffer.add(null)
        }

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
            return
        }

        // get the sum of all positions
        val positionSum = positions.map { entry -> entry.value.toPoint() }
            .reduce { acc, point2D -> point2D.add(acc) }

        // get the average position of the user based on all detected tags.
        position = StoreMap.Point2D(positionSum.x / positions.size, positionSum.y / positions.size)
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
        fun add(weight: Int, newPos: StoreMap.Point2D) {
            this.weight += weight
            this.x += newPos.x * weight
            this.y += newPos.y * weight
        }

        /**
         * Convert the weighted position to [StoreMap.Point2D].
         */
        fun toPoint(): StoreMap.Point2D {
            return StoreMap.Point2D(x / weight, y / weight)
        }
    }


    companion object {
        const val BUFFER_SIZE = 10
    }
}