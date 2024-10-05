package io.github.yehan2002.visionguide.net.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class Promotions(
    @JsonProperty("promotionDescriptions") val descriptions: List<String>
)