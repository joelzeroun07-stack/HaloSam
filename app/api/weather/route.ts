import { NextResponse } from 'next/server'

// In production, connect to a real weather API like OpenWeatherMap
export async function GET() {
  // Mock weather data for Malang region
  const weatherData = {
    batu: {
      temp: 22,
      condition: 'Berawan Sebagian',
      humidity: 65,
      wind: 12,
      icon: 'cloudy',
      forecast: [
        { day: 'Sen', temp: 21, icon: 'rain' },
        { day: 'Sel', temp: 23, icon: 'sunny' },
        { day: 'Rab', temp: 20, icon: 'cloudy' },
        { day: 'Kam', temp: 22, icon: 'sunny' },
        { day: 'Jum', temp: 19, icon: 'rain' },
      ],
    },
    malang: {
      temp: 26,
      condition: 'Cerah Berawan',
      humidity: 58,
      wind: 8,
      icon: 'sunny',
    },
    bromo: {
      temp: 12,
      condition: 'Cerah',
      humidity: 45,
      wind: 20,
      icon: 'sunny',
    },
  }

  const trafficAlerts = [
    {
      id: '1',
      severity: 'high',
      route: 'Jalur Kediri–Malang',
      description: 'Kepadatan tinggi, estimasi tambahan 45 menit',
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      severity: 'low',
      route: 'Tol Malang–Surabaya',
      description: 'Kondisi normal, lancar jaya',
      timestamp: new Date().toISOString(),
    },
  ]

  return NextResponse.json({ weather: weatherData, trafficAlerts })
}
