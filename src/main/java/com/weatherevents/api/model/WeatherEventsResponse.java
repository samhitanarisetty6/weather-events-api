package com.weatherevents.api.model;

import java.util.List;

public record WeatherEventsResponse(
        String city,
        WeatherInfo weather,
        List<EventInfo> events
) {
}
