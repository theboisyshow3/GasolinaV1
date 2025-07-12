export interface LaunchFilter {
  minLiquidity?: number
  minVolume?: number
  maxAgeMinutes?: number
  blocklist?: string[]
}

export interface PumpFunLaunch {
  mint: string
  liquidity: number
  volume: number
  createdAt: number
}

// Fetch recent Pump.fun launches and apply optional filters
export const fetchPumpfunLaunches = async (
  filters: LaunchFilter = {}
): Promise<PumpFunLaunch[]> => {
  const res = await fetch('https://frontend-api.pump.fun/projects?limit=50')
  if (!res.ok) {
    throw new Error('Pump.fun API error')
  }
  const data = await res.json()
  const now = Date.now()

  const projects = (data.projects || []) as any[]
  return projects
    .map((p) => ({
      mint: p.mintAddress as string,
      liquidity: Number(p.liquiditySol) || 0,
      volume: Number(p.volume24h) || 0,
      createdAt: Number(p.createdTime) * 1000,
    }))
    .filter((p) => {
      if (filters.blocklist && filters.blocklist.includes(p.mint)) {
        return false
      }
      if (filters.minLiquidity && p.liquidity < filters.minLiquidity) {
        return false
      }
      if (filters.minVolume && p.volume < filters.minVolume) {
        return false
      }
      if (
        filters.maxAgeMinutes &&
        now - p.createdAt > filters.maxAgeMinutes * 60 * 1000
      ) {
        return false
      }
      return true
    })
}

