package com.weatherevents.api.service;

import com.weatherevents.api.model.WeatherInfo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;

@Service
public class WeatherService {

    private static final String BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

    private final RestTemplate restTemplate;
    private final String apiKey;

    public WeatherService(RestTemplate restTemplate, @Value("${openweathermap.api-key}") String apiKey) {
        this.restTemplate = restTemplate;
        this.apiKey = apiKey;
    }

    @SuppressWarnings("unchecked")
    public WeatherInfo getWeatherForCity(String city) {
        String url = UriComponentsBuilder.fromHttpUrl(BASE_URL)
                .queryParam("q", city)
                .queryParam("appid", apiKey)
                .queryParam("units", "imperial")
                .toUriString();

        Map<String, Object> body;
        try {
            body = restTemplate.getForObject(url, Map.class);
        } catch (HttpClientErrorException.NotFound e) {
            throw new CityNotFoundException(city);
        }

        if (body == null) {
            throw new CityNotFoundException(city);
        }

        var weatherList = (java.util.List<Map<String, Object>>) body.get("weather");
        var weatherEntry = weatherList.get(0);
        var main = (Map<String, Object>) body.get("main");

        return new WeatherInfo(
                (String) weatherEntry.get("main"),
                (String) weatherEntry.get("description"),
                ((Number) main.get("temp")).doubleValue(),
                ((Number) main.get("feels_like")).doubleValue(),
                ((Number) main.get("humidity")).intValue(),
                (String) weatherEntry.get("icon")
        );
    }

    public static class CityNotFoundException extends RuntimeException {
        public CityNotFoundException(String city) {
            super("City not found: " + city);
        }
    }
}
