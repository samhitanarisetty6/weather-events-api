package com.weatherevents.api.model;

public record WeatherInfo(
        String condition,
        String description,
        double temperature,
        double feelsLike,
        int humidity,
        String icon
) {
}
