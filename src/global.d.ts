import type { ElectronLayoutApi } from './shared/types'

declare global {
  interface Window {
    electronLayoutApi?: ElectronLayoutApi
  }
}

export {}
