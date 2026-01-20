package com.weatherevents.api.model;

public record WeatherInfo(
        String cityLabel,
        String condition,
        String description,
        double temperature,
        double feelsLike,
        int humidity,
        double visibilityMiles,
        String icon
) {
}
