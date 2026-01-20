package com.weatherevents.api.model;

public record EventInfo(
        String name,
        String date,
        String venue,
        String url
) {
}
