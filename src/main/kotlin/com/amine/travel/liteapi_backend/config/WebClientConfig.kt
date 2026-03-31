package com.amine.travel.liteapi_backend.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.client.RestClient

@Configuration
class WebClientConfig {

    @Value("\${liteapi.base-url}")
    lateinit var baseUrl: String

    @Value("\${liteapi.api-key}")
    lateinit var apiKey: String

    @Bean
    fun liteApiRestClient(): RestClient {
        return RestClient.builder()
            .baseUrl(baseUrl)
            .defaultHeader("X-API-Key", apiKey)
            .defaultHeader("Accept", "application/json")
            .defaultHeader("Content-Type", "application/json")
            .defaultHeader("User-Agent", "BookingAPI/1.0")
            .build()
    }
}
