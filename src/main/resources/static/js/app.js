const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const weatherResult = document.getElementById("weather-result");
const eventsResult = document.getElementById("events-result");

const weatherIcons = {
  Clear: "☀️",
  Clouds: "☁️",
  Rain: "🌧️",
  Drizzle: "🌦️",
  Thunderstorm: "⛈️",
  Snow: "❄️",
  Mist: "🌫️",
};

function iconFor(condition) {
  return weatherIcons[condition] || "🌤️";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;

  weatherResult.innerHTML = "<p class=\"empty-state\">Loading...</p>";
  eventsResult.innerHTML = "<p class=\"empty-state\">Loading...</p>";

  const submitButton = form.querySelector("button");
  submitButton.disabled = true;

  try {
    const response = await fetch(`/api/weather-events?city=${encodeURIComponent(city)}`);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const message = errorBody.error || "Could not find weather for that city.";
      weatherResult.innerHTML = `<p class="error-state">${escapeHtml(message)}</p>`;
      eventsResult.innerHTML = "<p class=\"empty-state\">No weather events to display.</p>";
      return;
    }

    const data = await response.json();
    renderWeather(data.weather);
    renderEvents(data.events);
  } catch (err) {
    weatherResult.innerHTML = "<p class=\"error-state\">Something went wrong. Please try again.</p>";
    eventsResult.innerHTML = "<p class=\"empty-state\">No weather events to display.</p>";
  } finally {
    submitButton.disabled = false;
  }
});

function renderWeather(weather) {
  if (!weather) {
    weatherResult.innerHTML = "<p class=\"empty-state\">No weather data to display.</p>";
    return;
  }

  weatherResult.innerHTML = `
    <div class="weather-card">
      <span class="icon">${iconFor(weather.condition)}</span>
      <div class="details">
        <p class="temp">${Math.round(weather.temperature)}&deg;F</p>
        <p>${escapeHtml(weather.description)}</p>
        <p>Feels like ${Math.round(weather.feelsLike)}&deg;F &middot; Humidity ${weather.humidity}%</p>
      </div>
    </div>
  `;
}

function renderEvents(events) {
  if (!events || events.length === 0) {
    eventsResult.innerHTML = "<p class=\"empty-state\">No weather events to display.</p>";
    return;
  }

  const items = events
    .map(
      (event) => `
        <li class="event-item">
          <a href="${escapeAttr(event.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(event.name)}</a>
          <div class="meta">${escapeHtml(event.date)} &middot; ${escapeHtml(event.venue)}</div>
        </li>
      `
    )
    .join("");

  eventsResult.innerHTML = `<ul class="event-list">${items}</ul>`;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function escapeAttr(str) {
  return (str ?? "").replace(/"/g, "&quot;");
}
