/**
 * @file WeatherXu Official TypeScript SDK
 * @description Official TypeScript SDK for accessing WeatherXu's weather data API
 *
 * This SDK provides a simple and type-safe way to access WeatherXu's weather data,
 * including current conditions, forecasts, and historical weather data.
 *
 * For detailed API documentation, visit: https://weatherxu.com/documentation
 */

// WeatherXu SDK
// A TypeScript SDK for accessing WeatherXu weather data

// Types
export interface WeatherXuConfig {
  apiKey: string;
  units?: 'metric' | 'imperial';
}

export type WeatherParts = ('alerts' | 'currently' | 'hourly' | 'daily')[];

export interface WeatherParams {
  lat: number;
  lon: number;
  parts?: WeatherParts;
  units?: 'metric' | 'imperial';
}

export interface HistoricalParams {
  lat: number;
  lon: number;
  start: number; // Unix timestamp
  end: number; // Unix timestamp
  units?: 'metric' | 'imperial';
}

export interface WeatherData {
  success: boolean;
  data: {
    dt: number;
    latitude: number;
    longitude: number;
    timezone: string;
    timezone_abbreviation: string;
    timezone_offset: number;
    units: string;
    alerts?: Alert[];
    currently?: CurrentConditions;
    hourly?: HourlyForecast;
    daily?: DailyForecast;
  };
}

export interface HistoricalData {
  success: boolean;
  data: {
    dt: number;
    latitude: number;
    longitude: number;
    timezone: string;
    timezone_abbreviation: string;
    timezone_offset: number;
    units: string;
    hourly: {
      data: HistoricalHourlyCondition[];
    };
  };
}

interface Alert {
  title: string;
  description: string;
  endsAt?: number;
}

interface CurrentConditions {
  apparentTemperature: number;
  cloudCover: number;
  dewPoint: number;
  humidity: number;
  icon: string;
  precipIntensity: number;
  pressure: number;
  temperature: number;
  uvIndex: number;
  visibility: number;
  windDirection: number;
  windGust: number;
  windSpeed: number;
}

interface HourlyCondition {
  apparentTemperature: number;
  cloudCover: number;
  dewPoint: number;
  forecastStart: number;
  humidity: number;
  icon: string;
  precipIntensity: number;
  precipProbability: number;
  pressure: number;
  temperature: number;
  uvIndex: number;
  visibility: number;
  windDirection: number;
  windGust: number;
  windSpeed: number;
}

interface HistoricalHourlyCondition {
  apparentTemperature: number;
  cloudCover: number;
  dewPoint: number;
  forecastStart: number;
  humidity: number;
  icon: string;
  precipIntensity: number;
  pressure: number;
  temperature: number;
  windDirection: number;
  windGust: number;
  windSpeed: number;
}

interface HourlyForecast {
  data: HourlyCondition[];
}

interface DailyCondition {
  apparentTemperatureAvg: number;
  apparentTemperatureMax: number;
  apparentTemperatureMin: number;
  cloudCover: number;
  dewPointAvg: number;
  dewPointMax: number;
  dewPointMin: number;
  forecastEnd: number;
  forecastStart: number;
  humidity: number;
  icon: string;
  moonPhase: number;
  precipIntensity: number;
  precipProbability: number;
  pressure: number;
  sunriseTime: number;
  sunsetTime: number;
  temperatureAvg: number;
  temperatureMax: number;
  temperatureMin: number;
  uvIndexMax: number;
  visibility: number;
  windDirectionAvg: number;
  windGustAvg: number;
  windGustMax: number;
  windGustMin: number;
  windSpeedAvg: number;
  windSpeedMax: number;
  windSpeedMin: number;
}

interface DailyForecast {
  data: DailyCondition[];
}

// Error handling
export class WeatherXuError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'WeatherXuError';
  }
}

// Main SDK class
export class WeatherXu {
  private readonly apiKey: string;
  private readonly defaultUnits: 'metric' | 'imperial';
  private readonly weatherBaseUrl = 'https://api.weatherxu.com/v1';
  private readonly historicalBaseUrl = 'https://historical.weatherxu.com/v1';

  constructor(config: WeatherXuConfig) {
    if (!config.apiKey) {
      throw new WeatherXuError('API key is required');
    }
    this.apiKey = config.apiKey;
    this.defaultUnits = config.units || 'metric';
  }

  /**
   * Get current weather and forecast data for a location
   * @param params Weather request parameters
   * @returns Promise with weather data
   */
  async getWeather(params: WeatherParams): Promise<WeatherData> {
    const queryParams = new URLSearchParams({
      lat: params.lat.toString(),
      lon: params.lon.toString(),
      units: params.units || this.defaultUnits,
      ...(params.parts && { parts: params.parts.join(',') }),
    });

    try {
      const response = await fetch(`${this.weatherBaseUrl}/weather?${queryParams}`, {
        headers: {
          'X-API-KEY': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new WeatherXuError(
          `Weather API request failed: ${response.statusText}`,
          response.status
        );
      }

      const result = await response.json();

      if (!result.success) {
        const { error: { message, statusCode } } = result;
        throw new WeatherXuError(
          message,
          undefined,
          statusCode
        );
      }

      return result;
    } catch (error) {
      if (error instanceof WeatherXuError) {
        throw error;
      }
      throw new WeatherXuError(
        `Failed to fetch weather data: ${(error as Error).message}`
      );
    }
  }

  /**
   * Get historical weather data for a location
   * @param params Historical weather request parameters
   * @returns Promise with historical weather data
   */
  async getHistorical(params: HistoricalParams): Promise<HistoricalData> {
    const queryParams = new URLSearchParams({
      lat: params.lat.toString(),
      lon: params.lon.toString(),
      start: params.start.toString(),
      end: params.end.toString(),
      units: params.units || this.defaultUnits,
    });

    try {
      const response = await fetch(`${this.historicalBaseUrl}/history?${queryParams}`, {
        headers: {
          'X-API-KEY': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new WeatherXuError(
          `Historical API request failed: ${response.statusText}`,
          response.status
        );
      }

      const result = await response.json();

      if (!result.success) {
        const { error: { message, statusCode } } = result;
        throw new WeatherXuError(
          message,
          undefined,
          statusCode
        );
      }

      return result;
    } catch (error) {
      if (error instanceof WeatherXuError) {
        throw error;
      }
      throw new WeatherXuError(
        `Failed to fetch historical data: ${(error as Error).message}`
      );
    }
  }
}
