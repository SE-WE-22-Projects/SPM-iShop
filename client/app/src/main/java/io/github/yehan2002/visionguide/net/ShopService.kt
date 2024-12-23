package io.github.yehan2002.visionguide.net

import io.github.yehan2002.visionguide.net.dto.Item
import io.github.yehan2002.visionguide.net.dto.MapData
import io.github.yehan2002.visionguide.net.dto.Promotions
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Query

interface ShopService {
    @GET("/api/promotions/promotion/section/{section}")
    suspend fun getPromotions(@Path("section") section: Int): Promotions

    @GET("/api/mapping/map")
    suspend fun getMap(): MapData

    @GET("/api/inventory/search")
    suspend fun searchItem(@Query("q") query: String): Item?
}

