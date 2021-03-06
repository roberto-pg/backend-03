import { StormGlass, ForecastPoint } from '@src/clients/stormGlass'

export enum BeachPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N',
}

export interface Beach {
  name: string
  position: BeachPosition
  lat: number
  lng: number
  user: string
}

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

export class Forecast {
  constructor(protected stormglas = new StormGlass()) {}

  public async processForecastForBeaches(
    beaches: Beach[]
  ): Promise<BeachForecast[]> {
    const pointWithCorrectSources: BeachForecast[] = []
    for (const beach of beaches) {
      const points = await this.stormglas.fetchPoints(beach.lat, beach.lng)
      const enrichedBeachData = points.map((e) => ({
        ...{
          lat: beach.lat,
          lng: beach.lng,
          name: beach.name,
          position: beach.position,
          rating: 1,
        },
        ...e,
      }))
      pointWithCorrectSources.push(...enrichedBeachData)
    }

    return pointWithCorrectSources
  }
}
