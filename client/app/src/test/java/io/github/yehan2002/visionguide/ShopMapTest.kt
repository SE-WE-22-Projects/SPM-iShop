package io.github.yehan2002.visionguide

import io.github.yehan2002.visionguide.navigation.ShopMap
import io.github.yehan2002.visionguide.navigation.aruco.Tag
import io.github.yehan2002.visionguide.util.Point2D
import org.junit.Assert.assertEquals
import org.junit.Test

class ShopMapTest {
    @Test
    fun estimatePos() {
        val map = ShopMap(200, 200)
        val markerPos = Point2D(100.0, 100.0)
        map.markers[1] = markerPos

        assertEquals(
            markerPos,
            map.estimatePos(
                1,
                0.0,
                Tag.Rotation(yaw = Math.toRadians(0.0), roll = 0.0, pitch = 0.0)
            )
        )
        assertEquals(
            markerPos.add(100.0, 0.0),
            map.estimatePos(
                1,
                100.0,
                Tag.Rotation(yaw = Math.toRadians(0.0), roll = 0.0, pitch = 0.0)
            )
        )
        assertEquals(
            markerPos.add(0.0, 100.0),
            map.estimatePos(
                1,
                100.0,
                Tag.Rotation(yaw = Math.toRadians(90.0), roll = 0.0, pitch = 0.0)
            )
        )
    }
}