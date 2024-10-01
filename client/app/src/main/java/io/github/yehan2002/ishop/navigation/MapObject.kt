package io.github.yehan2002.ishop.navigation

sealed class MapObject {
    data object Invalid : MapObject()


    interface Valid {
        fun position(): Section
    }

    data class Section(val sectionId: Int, val name: String) : MapObject(), Valid {
        override fun position(): Section {
            return this
        }

        override fun toString(): String {
            return "Floor"
        }
    }

    data class Shelf(val shelfId: Int, val section: Section) : MapObject(), Valid {
        override fun position(): Section {
            return section
        }

        override fun toString(): String {
            return "Shelf"
        }
    }

    data class FloorTag(val tagId: Int, val section: Section) : MapObject(), Valid {
        override fun position(): Section {
            return section
        }

        override fun toString(): String {
            return "FloorTag"
        }
    }

    companion object {
        val UnknownSection = Section(-1, "Unknown")
    }

}
