# WeatherXu SDK

A TypeScript SDK for accessing WeatherXu's weather data API.

## Installation

```bash
npm install @weatherxu/weatherxu
```

## Usage

```typescript
import { WeatherXu } from '@weatherxu/weatherxu';

// Initialize the SDK
const weatherXu = new WeatherXu({
  apiKey: 'YOUR_API_KEY',
  units: 'metric' // optional, defaults to metric
});

// Get current weather and forecast
const getWeather = async () => {
  try {
    const weather = await weatherXu.getWeather({
      lat: 40.7128,
      lon: -74.0060,
      parts: ['currently', 'hourly', 'daily'] // optional
    });
    console.log(weather.data);
  } catch (error) {
    console.error('Error fetching weather:', error);
  }
};

// Get historical weather data
const getHistorical = async () => {
  try {
    const historical = await weatherXu.getHistorical({
      lat: 40.7128,
      lon: -74.0060,
      start: 1704880800, // Unix timestamp
      end: 1704970800    // Unix timestamp
    });
    console.log(historical.data);
  } catch (error) {
    console.error('Error fetching historical data:', error);
  }
};
```

## API Reference

### Configuration

The SDK can be initialized with the following options:

```typescript
interface WeatherXuConfig {
  apiKey: string;          // Your WeatherXu API key
  units?: 'metric' | 'imperial'; // Optional, defaults to metric
}
```

### Methods

#### getWeather(params)

Get current weather and forecast data for a location.

```typescript
interface WeatherParams {
  lat: number;            // Latitude (-90 to 90)
  lon: number;            // Longitude (-180 to 180)
  parts?: WeatherParts;   // Optional, data blocks to include
  units?: 'metric' | 'imperial'; // Optional, overrides default units
}

type WeatherParts = ('alerts' | 'currently' | 'hourly' | 'daily')[];
```

#### getHistorical(params)

Get historical weather data for a location.

```typescript
interface HistoricalParams {
  lat: number;            // Latitude (-90 to 90)
  lon: number;            // Longitude (-180 to 180)
  start: number;          // Start time (Unix timestamp)
  end: number;            // End time (Unix timestamp)
  units?: 'metric' | 'imperial'; // Optional, overrides default units
}
```

## Error Handling

The SDK throws `WeatherXuError` for any API or network-related errors. Each error includes:

- `message`: Description of the error
- `status`: HTTP status code (if applicable)
- `code`: Error code (if provided by the API)

## Requirements

- Node.js >= 18.0.0
- TypeScript >= 4.5.0 (for development)

## License

MIT