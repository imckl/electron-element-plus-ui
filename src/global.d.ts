import type { ElectronLayoutApi } from './layout/types'

declare global {
  interface Window {
    electronLayoutApi?: ElectronLayoutApi
  }
}

export {}
