package io.github.yehan2002.ishop

import io.github.yehan2002.ishop.map.StoreMap
import io.github.yehan2002.ishop.map.StoreMap.Point2D
import org.junit.Assert.assertEquals
import org.junit.Test

class StoreMapTest {
    @Test
    fun estimatePos() {
        val map = StoreMap(200.0, 200.0)
        val markerPos = Point2D(100.0, 100.0)
        map.markers[1] = markerPos

        assertEquals(markerPos, map.estimatePos(1, 0.0, 0.0))
        assertEquals(markerPos.add(100.0, 0.0), map.estimatePos(1, 100.0, 0.0))
        assertEquals(markerPos.add(0.0, 100.0), map.estimatePos(1, 100.0, 90.0))
    }
}