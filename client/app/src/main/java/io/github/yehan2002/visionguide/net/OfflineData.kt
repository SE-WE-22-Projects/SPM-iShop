package io.github.yehan2002.visionguide.net

import androidx.appcompat.app.AppCompatActivity
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import io.github.yehan2002.visionguide.R
import io.github.yehan2002.visionguide.net.dto.Item
import io.github.yehan2002.visionguide.net.dto.MapData
import io.github.yehan2002.visionguide.net.dto.Promotions

class OfflineData(private val activity: AppCompatActivity) :
    ShopService {

    override suspend fun getPromotions(section: Int): Promotions {
        val allPromotions: List<PromoData> = jacksonObjectMapper().readValue(
            activity.resources.openRawResource(R.raw.promotions)
        )

        return Promotions(allPromotions.filter { it.item.rack.section == section }
            .map { it.description })
    }

    override suspend fun getMap(): MapData {


        return jacksonObjectMapper().readValue(
            activity.resources.openRawResource(R.raw.map)
        )
    }

    override suspend fun searchItem(query: String): Item? {
        val items: List<Item> =
            jacksonObjectMapper().readValue(activity.resources.openRawResource(R.raw.items))

        return items.find { it.name.lowercase().contains(query.lowercase()) }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    data class PromoData(
        @JsonProperty("desc") val description: String,
        @JsonProperty("item") val item: PromoItem
    ) {
        @JsonIgnoreProperties(ignoreUnknown = true)
        data class PromoItem(@JsonProperty("rack") val rack: PromoRack)

        @JsonIgnoreProperties(ignoreUnknown = true)
        data class PromoRack(@JsonProperty("sectionId") val section: Int)
    }
}