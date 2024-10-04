package io.github.yehan2002.visionguide

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import io.github.yehan2002.visionguide.net.TestMapData
import io.github.yehan2002.visionguide.net.dto.MapData
import org.junit.Test

class MapLoadTest {

    @Test
    fun testLoad() {
        val mapper = jacksonObjectMapper()

        val data: MapData = mapper.readValue(TestMapData)

        println(data)
    }
}
