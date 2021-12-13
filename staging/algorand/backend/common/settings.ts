/**
 * Pricecaster Service.
 *
 * Fetcher backend component.
 *
 * (c) 2021 Randlabs, Inc.
 */

import { Symbol } from './basetypes'

export interface IAppSettings extends Record<string, unknown> {
  algo: {
    token: string,
    api: string,
    port: string
  },
  pyth: {
    chainId: number,
    emitterAddress: string,
  },
  debug?: {
    logAllVaa?: boolean,
  }
  wormhole: {
    spyServiceHost: string
  },
  strategy: {
    bufferSize: number
  },
  symbols: Symbol[]
}
