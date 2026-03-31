package com.amine.travel.liteapi_backend.controller

import com.amine.travel.liteapi_backend.service.LiteApiService
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/hotels")
class HotelController(private val liteApiService: LiteApiService) {

    @GetMapping("/places", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun getPlaces(@RequestParam name: String): String {
        return liteApiService.getPlaces(name)
    }

    @GetMapping("/all", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun getHotels(@RequestParam cityId: String): String {
        return liteApiService.getHotels(cityId)
    }

    @GetMapping("/{id}", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun getHotelDetails(@PathVariable id: String): String {
        return liteApiService.getHotelDetails(id)
    }

    @PostMapping("/search", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun searchRates(@RequestBody payload: String): String {
        return liteApiService.searchRates(payload)
    }

    @PostMapping("/prebook", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun prebook(@RequestBody payload: String): String {
        return liteApiService.prebook(payload)
    }

    @PostMapping("/book", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun book(@RequestBody payload: String): String {
        return liteApiService.book(payload)
    }
}
