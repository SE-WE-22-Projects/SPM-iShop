package io.github.yehan2002.visionguide.util


/**
 * A ring buffer that holds the last `capacity` values.
 */
class RingBuffer<T>(val capacity: Int) {
    private val data = Array<Any?>(capacity) { null }
    private var insertPos = 0

    /**
     * Adds the given item to the ring buffer.
     * If the more than `capacity` values have been added, the oldest value in the buffer will
     * be replaced with this value.
     */
    fun add(value: T?) {
        data[insertPos % capacity] = value
        insertPos++
    }

    /**
     * Gets the values in this ring buffer in the order the values were inserted in (FIFO).
     */
    @Suppress("UNCHECKED_CAST")
    operator fun get(idx: Int): T? {
        return data[(idx + insertPos) % capacity] as T?
    }

    /**
     * Sets the value at the given index.
     */
    operator fun set(idx: Int, value: T?) {
        data[(idx + insertPos) % capacity] = value
    }

    /**
     * Returns an iterator that iterates over the values in this ring buffer in order.
     */
    operator fun iterator(): Iterator<T?> {
        return RingBufferIterator(this)
    }


    private class RingBufferIterator<T>(val buffer: RingBuffer<T>) : Iterator<T?> {
        var pos = 0

        override fun hasNext(): Boolean {
            return pos < buffer.capacity
        }

        override fun next(): T? {
            return buffer[pos++]
        }

    }
}