import { getCurrentChain, divisionDecimals } from "../api/util"

export const NSymbol = 'NAI'
export const NDecimals = 4
export const NULSDecimals = 8
export const NDiffDeciamsl = NULSDecimals - NDecimals
export const FEE_PERKB = '100000'
export const CROSS_FEE = '1000000'
export const SET_ALIAS_FEE = '100000000'
export const MIN_DEPOSIT = '200000000000'
export const MAX_DEPOSIT = '50000000000000'
export const MIN_Margin = '2000000000000'
export const MAX_Margin = '20000000000000'

export const DEFAULT_FEE = divisionDecimals(FEE_PERKB, NDecimals)
export const DEFAULT_CROSS_FEE = divisionDecimals(CROSS_FEE, NDecimals)
export const DEFAULT_SET_ALIAS_FEE = divisionDecimals(SET_ALIAS_FEE, NDecimals)
export const min_deposit = divisionDecimals(MIN_DEPOSIT, NDecimals)
export const max_deposit = divisionDecimals(MAX_DEPOSIT, NDecimals)
export const min_margin = divisionDecimals(MIN_Margin, NDecimals)
export const max_margin = divisionDecimals(MAX_Margin, NDecimals)

export function calDecimalsAndSymbol(item) {
  const currentChain = getCurrentChain()
  const NKey = currentChain.chainId === 2 ? '2-1' : '1-1'
  const { chainId, assetId, symbol, decimals, decimal } = item
  const assetKey = chainId + '-' + assetId
  const isNULS = symbol == 'NULS' || assetKey === NKey
  const originDecimal = decimals || decimal
  const newDecimals = isNULS ? NDecimals : originDecimal
  return {
    decimals: newDecimals,
    symbol: isNULS ? NSymbol : symbol
  }
}
