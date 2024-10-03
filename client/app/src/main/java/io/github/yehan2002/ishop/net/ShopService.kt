package io.github.yehan2002.ishop.net

import com.fasterxml.jackson.annotation.JsonProperty
import retrofit2.http.GET
import retrofit2.http.Path

interface ShopService {
    @GET("/api/promotions/promotion/section/{section}")
    suspend fun getPromotions(@Path("section") section: Int): Promotions

    @GET("/api/mapping/map")
    suspend fun getMap(): String
}

data class Promotions(@JsonProperty("promotionDescriptions") val promos: List<String>)