import { Connection, Keypair, PublicKey } from "@solana/web3.js"

export interface AutoSellConfig {
  takeProfitX?: number[] // e.g. [2,5]
  stopLoss?: number // e.g. 0.5 meaning 50% drop
}

// Placeholder for automatic sell logic using Jupiter aggregator
export const autoSellToken = async (
  connection: Connection,
  keypair: Keypair,
  tokenMint: PublicKey,
  currentPrice: number,
  entryPrice: number,
  cfg: AutoSellConfig
) => {
  const gain = currentPrice / entryPrice
  if (cfg.stopLoss && gain <= cfg.stopLoss) {
    // TODO: integrate Jupiter swap for stop loss
    return "STOP_LOSS"
  }
  if (cfg.takeProfitX) {
    for (const x of cfg.takeProfitX) {
      if (gain >= x) {
        // TODO: integrate Jupiter swap for take profit
        return `TP_${x}`
      }
    }
  }
  return null
}
