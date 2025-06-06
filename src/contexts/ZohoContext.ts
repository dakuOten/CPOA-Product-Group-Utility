import { createContext } from 'react'
import { type ZohoDealData } from '@/types/zoho'

// Enhanced context state with proper typing
export interface ZohoContextState {
  readonly isZohoReady: boolean
  readonly dealData: ZohoDealData | null
  readonly error: string | null
  readonly loading: boolean
  readonly rawPageLoadData: Record<string, unknown> | null
}

// Define the context actions interface  
export interface ZohoContextActions {
  readonly refreshData: () => void
  readonly clearError: () => void
}

// React contexts using modern patterns
export const ZohoStateContext = createContext<ZohoContextState | undefined>(undefined)
export const ZohoActionsContext = createContext<ZohoContextActions | undefined>(undefined)
