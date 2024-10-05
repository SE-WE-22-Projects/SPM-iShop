package io.github.yehan2002.visionguide.net.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class MapData(
    @JsonProperty("size") val size: Size,
    @JsonProperty("tags") val tags: List<Tag>,
    @JsonProperty("sections") val sections: List<Section>,
    @JsonProperty("racks") val racks: List<Rack>
) {
    data class Size(
        @JsonProperty("height") val height: Double,
        @JsonProperty("width") val width: Double
    )

    data class Tag(
        @JsonProperty("code") val code: Int,
        @JsonProperty("section") val section: Int,
        @JsonProperty("pos_x") val x: Double,
        @JsonProperty("pos_y") val y: Double
    )

    data class Section(
        @JsonProperty("id") val id: Int,
        @JsonProperty("name") val name: String,
        @JsonProperty("top_x") val topX: Double,
        @JsonProperty("top_y") val topY: Double,
        @JsonProperty("bottom_x") val bottomX: Double,
        @JsonProperty("bottom_y") val bottomY: Double
    )

    data class Rack(
        @JsonProperty("id") val id: Int,
        @JsonProperty("section") val section: Int,
        @JsonProperty("top_x") val topX: Double,
        @JsonProperty("top_y") val topY: Double,
        @JsonProperty("bottom_x") val bottomX: Double,
        @JsonProperty("bottom_y") val bottomY: Double
    )
}