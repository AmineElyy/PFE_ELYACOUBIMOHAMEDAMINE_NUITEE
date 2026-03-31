package com.amine.travel.liteapi_backend.service

import org.springframework.stereotype.Service
import org.springframework.web.client.RestClient

@Service
class LiteApiService(private val liteApiRestClient: RestClient) {

    fun getPlaces(textQuery: String): String {
        return liteApiRestClient.get()
            .uri { it.path("/data/places").queryParam("textQuery", textQuery).build() }
            .retrieve()
            .body(String::class.java) ?: "{}"
    }

    fun getHotels(cityId: String): String {
        return liteApiRestClient.get()
            .uri { it.path("/data/hotels").queryParam("cityIds", cityId).build() }
            .retrieve()
            .body(String::class.java) ?: "{}"
    }

    fun getHotelDetails(hotelId: String): String {
        return liteApiRestClient.get()
            .uri { it.path("/data/hotel").queryParam("hotelId", hotelId).build() }
            .retrieve()
            .body(String::class.java) ?: "{}"
    }

    fun searchRates(payload: String): String {
        return liteApiRestClient.post()
            .uri("/hotels/rates")
            .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
            .body(payload)
            .retrieve()
            .body(String::class.java) ?: "{}"
    }

    fun prebook(payload: String): String {
        return liteApiRestClient.post()
            .uri("/rates/prebook")
            .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
            .body(payload)
            .retrieve()
            .body(String::class.java) ?: "{}"
    }

    fun book(payload: String): String {
        return liteApiRestClient.post()
            .uri("/rates/book")
            .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
            .body(payload)
            .retrieve()
            .body(String::class.java) ?: "{}"
    }
}
