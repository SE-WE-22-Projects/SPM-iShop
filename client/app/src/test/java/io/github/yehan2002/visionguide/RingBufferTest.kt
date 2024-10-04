package io.github.yehan2002.visionguide

import io.github.yehan2002.visionguide.util.RingBuffer
import org.junit.Assert.assertEquals
import org.junit.Test

class RingBufferTest {
    @Test
    fun testAdd() {
        val buffer = RingBuffer<Int>(10)

        for (i in 0..<10) {
            buffer.add(i)
        }

        for (i in 0..<10) {
            assertEquals(i, buffer[i])
        }

    }

    @Test
    fun testOverflow() {
        val buffer = RingBuffer<Int>(5)

        for (i in 0..<10) {
            buffer.add(i)
        }

        for (i in 5..<10) {
            assertEquals(i, buffer[i])
        }
    }

    @Test
    fun testIterator() {
        val buffer = RingBuffer<Int>(5)

        for (i in 0..<10) {
            buffer.add(i)
        }

        var i = 5
        for (v in buffer) {
            assertEquals(i, v)
            i++
        }
    }
}