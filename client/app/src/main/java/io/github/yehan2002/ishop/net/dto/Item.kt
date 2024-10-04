package io.github.yehan2002.ishop.net.dto

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty

@JsonIgnoreProperties("createdAt", "updatedAt")
data class Item(
    @JsonProperty("id") val id: Int,
    @JsonProperty("name") val name: String,
    @JsonProperty("desc") val description: String,
    @JsonProperty("category") val category: String,
    @JsonProperty("unit") val unit: String,
    @JsonProperty("qty") val quantity: Int,
    @JsonProperty("price") val price: Double,
    @JsonProperty("rackId") val rackId: Int
)
