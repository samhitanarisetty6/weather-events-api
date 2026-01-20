const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const errorBanner = document.getElementById("search-error");
const eventsResult = document.getElementById("events-result");
const precipContainer = document.getElementById("precip");

const locationEl = document.getElementById("location");
const conditionLabelEl = document.getElementById("condition-label");
const tempEl = document.getElementById("temp");
const statHumidity = document.getElementById("stat-humidity");
const statVisibility = document.getElementById("stat-visibility");
const statFeels = document.getElementById("stat-feels");

const CONDITION_THEMES = {
  Clear: { theme: "clear", label: "It's Sunny" },
  Clouds: { theme: "clouds", label: "It's Cloudy" },
  Rain: { theme: "rain", label: "It's Rainy" },
  Drizzle: { theme: "rain", label: "Light Rain" },
  Thunderstorm: { theme: "thunderstorm", label: "Stormy Skies" },
  Snow: { theme: "snow", label: "Let It Snow" },
  Mist: { theme: "mist", label: "It's Misty" },
  Smoke: { theme: "mist", label: "Smoky Skies" },
  Haze: { theme: "mist", label: "Hazy Skies" },
  Fog: { theme: "mist", label: "Foggy" },
  Dust: { theme: "mist", label: "Dusty Skies" },
  Sand: { theme: "mist", label: "Sandy Skies" },
  Squall: { theme: "rain", label: "Squally" },
  Tornado: { theme: "thunderstorm", label: "Tornado Warning" },
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;

  const submitButton = form.querySelector("button");
  submitButton.disabled = true;
  hideError();

  try {
    const response = await fetch(`/api/weather-events?city=${encodeURIComponent(city)}`);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      showError(errorBody.error || "Could not find weather for that city.");
      return;
    }

    const data = await response.json();
    renderWeather(data.weather);
    renderEvents(data.events, data.eventsError);
  } catch (err) {
    showError("Something went wrong. Please try again.");
  } finally {
    submitButton.disabled = false;
  }
});

function renderWeather(weather) {
  const config = CONDITION_THEMES[weather.condition] || { theme: "clear", label: capitalize(weather.description) };

  document.body.dataset.theme = config.theme;
  locationEl.textContent = weather.cityLabel;
  conditionLabelEl.textContent = config.label;
  tempEl.textContent = Math.round(weather.temperature);
  statHumidity.textContent = `${weather.humidity}%`;
  statVisibility.textContent = `${Math.round(weather.visibilityMiles)} mi`;
  statFeels.textContent = `${Math.round(weather.feelsLike)}°`;

  renderPrecipitation(config.theme);
}

function renderPrecipitation(theme) {
  precipContainer.innerHTML = "";

  if (theme === "rain" || theme === "thunderstorm") {
    const count = theme === "thunderstorm" ? 55 : 40;
    for (let i = 0; i < count; i++) {
      const drop = document.createElement("div");
      drop.className = "drop";
      drop.style.left = `${Math.random() * 100}%`;
      drop.style.animationDuration = `${0.5 + Math.random() * 0.4}s`;
      drop.style.animationDelay = `${-Math.random() * 1}s`;
      precipContainer.appendChild(drop);
    }
  } else if (theme === "snow") {
    for (let i = 0; i < 35; i++) {
      const flake = document.createElement("div");
      flake.className = "flake";
      flake.style.left = `${Math.random() * 100}%`;
      flake.style.animationDuration = `${4 + Math.random() * 4}s`;
      flake.style.animationDelay = `${-Math.random() * 6}s`;
      flake.style.opacity = `${0.6 + Math.random() * 0.4}`;
      precipContainer.appendChild(flake);
    }
  }
}

function renderEvents(events, eventsError) {
  if (eventsError) {
    eventsResult.innerHTML = `<p class="error-state">${escapeHtml(eventsError)}</p>`;
    return;
  }

  if (!events || events.length === 0) {
    eventsResult.innerHTML = "<p class=\"empty-state\">No upcoming events found for this city.</p>";
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

function showError(message) {
  errorBanner.textContent = message;
  errorBanner.classList.remove("hidden");
}

function hideError() {
  errorBanner.classList.add("hidden");
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function escapeAttr(str) {
  return (str ?? "").replace(/"/g, "&quot;");
}
