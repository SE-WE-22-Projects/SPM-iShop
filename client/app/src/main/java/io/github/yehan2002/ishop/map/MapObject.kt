package io.github.yehan2002.ishop.map

sealed class MapObject {
    data object Empty : MapObject()
    
    data class Section(val sectionId: Int, val name: String) : MapObject() {
        override fun toString(): String {
            return "Section: $name Tile: Empty"
        }
    }

    data class Shelf(val shelfId: Int, val section: Section) : MapObject() {
        override fun toString(): String {
            return "Section: ${section.name} Tile: Shelf"
        }
    }

    data class FloorTag(val tagId: Int, val section: Section) : MapObject() {
        override fun toString(): String {
            return "Section: ${section.name} Tile: FloorTag"
        }
    }
}
