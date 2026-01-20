package com.weatherevents.api.service;

import com.weatherevents.api.model.EventInfo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class EventsService {

    private static final String BASE_URL = "https://app.ticketmaster.com/discovery/v2/events.json";

    private final RestTemplate restTemplate;
    private final String apiKey;

    public EventsService(RestTemplate restTemplate, @Value("${ticketmaster.api-key}") String apiKey) {
        this.restTemplate = restTemplate;
        this.apiKey = apiKey;
    }

    @SuppressWarnings("unchecked")
    public List<EventInfo> getEventsForCity(String city) {
        String url = UriComponentsBuilder.fromHttpUrl(BASE_URL)
                .queryParam("apikey", apiKey)
                .queryParam("city", city)
                .queryParam("size", "10")
                .toUriString();

        Map<String, Object> body;
        try {
            body = restTemplate.getForObject(url, Map.class);
        } catch (HttpClientErrorException e) {
            return List.of();
        }

        List<EventInfo> events = new ArrayList<>();
        if (body == null || !body.containsKey("_embedded")) {
            return events;
        }

        var embedded = (Map<String, Object>) body.get("_embedded");
        var rawEvents = (List<Map<String, Object>>) embedded.get("events");

        for (var event : rawEvents) {
            String name = (String) event.get("name");
            String url_ = (String) event.get("url");

            var dates = (Map<String, Object>) event.get("dates");
            var start = (Map<String, Object>) dates.get("start");
            String date = (String) start.get("localDate");

            String venueName = "TBD";
            var embeddedVenue = (Map<String, Object>) event.get("_embedded");
            if (embeddedVenue != null) {
                var venues = (List<Map<String, Object>>) embeddedVenue.get("venues");
                if (venues != null && !venues.isEmpty()) {
                    venueName = (String) venues.get(0).get("name");
                }
            }

            events.add(new EventInfo(name, date, venueName, url_));
        }

        return events;
    }
}
