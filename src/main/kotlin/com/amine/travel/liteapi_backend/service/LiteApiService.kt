package com.amine.travel.liteapi_backend.service

import org.springframework.stereotype.Service
import org.springframework.web.client.RestClient
import org.springframework.web.client.HttpClientErrorException

@Service
class LiteApiService(private val liteApiRestClient: RestClient) {

    private fun executeGet(path: String, paramName: String, paramValue: String): String {
        return try {
            liteApiRestClient.get()
                .uri { it.path(path).queryParam(paramName, paramValue).build() }
                .retrieve()
                .body(String::class.java) ?: "{}"
        } catch (e: HttpClientErrorException) {
            e.responseBodyAsString
        } catch (e: Exception) {
            "{\"error\": \"${e.message ?: "Unknown error"}\"}"
        }
    }

    private fun executePost(path: String, payload: String): String {
        return try {
            liteApiRestClient.post()
                .uri(path)
                .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                .body(payload)
                .retrieve()
                .body(String::class.java) ?: "{}"
        } catch (e: HttpClientErrorException) {
            e.responseBodyAsString
        } catch (e: Exception) {
            "{\"error\": \"${e.message ?: "Unknown error"}\"}"
        }
    }

    fun getPlaces(textQuery: String) = executeGet("/data/places", "textQuery", textQuery)
    fun getHotels(cityId: String) = executeGet("/data/hotels", "cityIds", cityId)
    fun getHotelDetails(hotelId: String) = executeGet("/data/hotel", "hotelId", hotelId)

    fun searchRates(payload: String) = executePost("/hotels/rates", payload)
    fun prebook(payload: String) = executePost("/rates/prebook", payload)
    fun book(payload: String) = executePost("/rates/book", payload)
}
