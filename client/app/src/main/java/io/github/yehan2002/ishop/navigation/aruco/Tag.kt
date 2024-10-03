package io.github.yehan2002.ishop.navigation.aruco


/**
 * This class contains the details of a single detected aruco tag.
 */
class Tag(
    val id: Int,
    val corners: FloatArray,
    val rotation: Rotation? = null,
    val position: Position? = null,
) {

    /**
     * Gets the distance to the tag from the user.
     * If the distance cannot be calculated, [Double.NaN] is returned.
     */
    val distance: Double
        get() {
            if (position != null) return position.z
            return Double.NaN
        }


    class Rotation(val roll: Double, val pitch: Double, val yaw: Double)
    class Position(val x: Double, val y: Double, val z: Double)
}

