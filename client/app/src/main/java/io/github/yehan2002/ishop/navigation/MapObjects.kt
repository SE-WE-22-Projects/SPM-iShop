package io.github.yehan2002.ishop.navigation

import io.github.yehan2002.ishop.util.Point2D

sealed class MapObjects {
    data object Invalid : MapObjects()


    interface Valid {
        fun position(): Section
    }

    data class Section(
        val sectionId: Int,
        val name: String,
        val top: Point2D,
        val bottom: Point2D
    ) : MapObjects(), Valid {
        override fun position(): Section {
            return this
        }

        override fun toString(): String {
            return "Floor"
        }
    }

    data class Shelf(
        val shelfId: Int,
        val section: Section,
        val top: Point2D,
        val bottom: Point2D
    ) : MapObjects(), Valid {
        override fun position(): Section {
            return section
        }

        override fun toString(): String {
            return "Shelf"
        }
    }

    data class FloorTag(val tagId: Int, val section: Section, val pos: Point2D) : MapObjects(),
        Valid {
        override fun position(): Section {
            return section
        }

        override fun toString(): String {
            return "FloorTag"
        }
    }

    companion object {
        val UnknownSection = Section(-1, "Unknown", Point2D(0, 0), Point2D(0, 0))
    }

}
