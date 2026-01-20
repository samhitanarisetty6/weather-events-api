package com.weatherevents.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.client.RestTemplate;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class WeatherEventsApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(WeatherEventsApiApplication.class, args);
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
