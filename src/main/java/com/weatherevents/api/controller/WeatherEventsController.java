package com.weatherevents.api.controller;

import com.weatherevents.api.model.WeatherEventsResponse;
import com.weatherevents.api.service.EventsService;
import com.weatherevents.api.service.WeatherService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;

import java.util.Map;

@RestController
public class WeatherEventsController {

    private final WeatherService weatherService;
    private final EventsService eventsService;

    public WeatherEventsController(WeatherService weatherService, EventsService eventsService) {
        this.weatherService = weatherService;
        this.eventsService = eventsService;
    }

    @GetMapping("/api/weather-events")
    public WeatherEventsResponse getWeatherEvents(@RequestParam String city) {
        var weather = weatherService.getWeatherForCity(city);
        var events = eventsService.getEventsForCity(city);
        return new WeatherEventsResponse(city, weather, events);
    }

    @ExceptionHandler(WeatherService.CityNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleCityNotFound(WeatherService.CityNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(HttpClientErrorException.Unauthorized.class)
    public ResponseEntity<Map<String, String>> handleUnauthorized() {
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                .body(Map.of("error", "Invalid or missing API key. Check OPENWEATHERMAP_API_KEY / TICKETMASTER_API_KEY."));
    }

    @ExceptionHandler(HttpClientErrorException.class)
    public ResponseEntity<Map<String, String>> handleUpstreamError(HttpClientErrorException ex) {
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                .body(Map.of("error", "Upstream weather/events service error: " + ex.getStatusCode()));
    }
}
