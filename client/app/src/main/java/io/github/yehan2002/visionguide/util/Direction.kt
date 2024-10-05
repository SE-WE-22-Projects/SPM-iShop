package io.github.yehan2002.visionguide.util

enum class Direction {
    /**
     * Facing Positive Y
     * */
    NORTH,

    /**
     * Facing Negative X
     */
    EAST,

    /**
     * Facing Negative Y
     * */
    SOUTH,

    /**
     * Facing Positive X
     */
    WEST,

    UNKNOWN;

    fun turnDirection(to: Direction): Turn {
        return when (this) {
            NORTH -> when (to) {
                NORTH -> Turn.NONE
                EAST -> Turn.RIGHT
                SOUTH -> Turn.LEFT
                WEST -> Turn.AROUND
                UNKNOWN -> throw IllegalArgumentException("Direction cannot be unknown")
            }

            EAST -> when (to) {
                NORTH -> Turn.LEFT
                EAST -> Turn.NONE
                SOUTH -> Turn.RIGHT
                WEST -> Turn.AROUND
                UNKNOWN -> throw IllegalArgumentException("Direction cannot be unknown")
            }

            SOUTH -> when (to) {
                NORTH -> Turn.AROUND
                EAST -> Turn.LEFT
                SOUTH -> Turn.NONE
                WEST -> Turn.RIGHT
                UNKNOWN -> throw IllegalArgumentException("Direction cannot be unknown")
            }

            WEST -> when (to) {
                NORTH -> Turn.RIGHT
                EAST -> Turn.AROUND
                SOUTH -> Turn.LEFT
                WEST -> Turn.NONE
                UNKNOWN -> throw IllegalArgumentException("Direction cannot be unknown")
            }

            UNKNOWN -> throw IllegalArgumentException("Direction cannot be unknown")
        }
    }

    enum class Turn {
        LEFT,
        RIGHT,
        AROUND,
        NONE
    }
}