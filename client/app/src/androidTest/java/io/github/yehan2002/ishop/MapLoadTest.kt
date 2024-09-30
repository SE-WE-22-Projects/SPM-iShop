package io.github.yehan2002.ishop

import androidx.test.ext.junit.runners.AndroidJUnit4
import io.github.yehan2002.ishop.navigation.MapData
import io.github.yehan2002.ishop.navigation.StoreMap
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class MapLoadTest {

    @Test
    fun testLoad() {
        val map = StoreMap.loadMapJSON(MapData)
        println(map)
    }
}
