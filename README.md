# Weather Events API

Fetches current weather conditions and local events for any city, combining
the [OpenWeatherMap](https://openweathermap.org/api) API with the
[Ticketmaster Discovery](https://developer.ticketmaster.com/) API behind a
small Spring Boot backend and a static HTML/CSS/JS frontend.

## Prerequisites

- Java 17+
- Maven (or use the included `mvnw` wrapper if you add one)
- Free API keys from:
  - OpenWeatherMap: https://home.openweathermap.org/users/sign_up
  - Ticketmaster: https://developer-acct.ticketmaster.com/user/register

## Setup

1. Set your API keys as environment variables:

   ```bash
   export OPENWEATHERMAP_API_KEY=your_key_here
   export TICKETMASTER_API_KEY=your_key_here
   ```

2. Run the app:

   ```bash
   mvn spring-boot:run
   ```

3. Open http://localhost:8080 in your browser and search for a city.

## Building a jar

```bash
mvn clean package
java -jar target/weather-events-api-1.0.0.jar
```

## API

`GET /api/weather-events?city={city}` returns:

```json
{
  "city": "Austin",
  "weather": {
    "condition": "Clear",
    "description": "clear sky",
    "temperature": 91.4,
    "feelsLike": 93.2,
    "humidity": 40,
    "icon": "01d"
  },
  "events": [
    { "name": "Concert Name", "date": "2026-08-01", "venue": "Venue Name", "url": "https://..." }
  ]
}
```

Returns `404` with `{"error": "City not found: ..."}` for an unrecognized city.

## Publishing

This is a standard Spring Boot jar, so it deploys easily to Render, Railway,
Fly.io, or any host that runs a Java process — set `OPENWEATHERMAP_API_KEY`
and `TICKETMASTER_API_KEY` as environment variables on the host and point it
at `java -jar target/weather-events-api-1.0.0.jar`.
