import { Controller, Get, Param } from "@nestjs/common";
import { success } from "../common/api-response";
import { WeatherService } from "./weather.service";

@Controller("weather")
export class WeatherController {
  constructor(private readonly weather: WeatherService) {}
  @Get(":destination") async forecast(@Param("destination") destination: string) { return success(await this.weather.forecast(destination), "Weather forecast fetched successfully"); }
}
