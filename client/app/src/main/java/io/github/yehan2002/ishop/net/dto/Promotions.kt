package io.github.yehan2002.ishop.net.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class Promotions(
    @JsonProperty("promotionDescriptions") val descriptions: List<String>
)