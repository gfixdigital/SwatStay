import { BadRequestException, Injectable, ServiceUnavailableException } from "@nestjs/common";

const locations: Record<string, { name: string; latitude: number; longitude: number }> = {
  swat: { name: "Swat Valley", latitude: 34.7717, longitude: 72.3602 },
  mingora: { name: "Mingora", latitude: 34.7717, longitude: 72.3602 },
  kalam: { name: "Kalam", latitude: 35.4906, longitude: 72.5856 },
  "malam-jabba": { name: "Malam Jabba", latitude: 34.7936, longitude: 72.5744 },
  bahrain: { name: "Bahrain", latitude: 35.2088, longitude: 72.5276 },
  madyan: { name: "Madyan", latitude: 35.0736, longitude: 72.5594 },
};

@Injectable()
export class WeatherService {
  async forecast(destination: string) {
    const location = locations[destination.toLowerCase().trim()];
    if (!location) throw new BadRequestException("Weather is not available for this destination yet");
    const params = new URLSearchParams({ latitude: String(location.latitude), longitude: String(location.longitude), current: "temperature_2m,apparent_temperature,precipitation_probability,wind_speed_10m,weather_code", daily: "temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code", timezone: "Asia/Karachi", forecast_days: "7" });
    try {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
      if (!response.ok) throw new Error(`Open-Meteo returned ${response.status}`);
      return { destination: location.name, ...await response.json() };
    } catch {
      throw new ServiceUnavailableException("Weather forecast is temporarily unavailable");
    }
  }
}
