import { use } from 'react'
import { ZohoActionsContext, ZohoStateContext, type ZohoContextState, type ZohoContextActions } from '@/contexts/ZohoContext'

// Combined context type
export type ZohoContextType = ZohoContextState & ZohoContextActions

// Modern hook to use Zoho context state using React 19.1's use() API
export const useZohoState = (): ZohoContextState => {
  const context = use(ZohoStateContext)
  if (context === undefined) {
    throw new Error('useZohoState must be used within a ZohoProvider')
  }
  return context
}

// Modern hook to use Zoho context actions using React 19.1's use() API
export const useZohoActions = (): ZohoContextActions => {
  const context = use(ZohoActionsContext)
  if (context === undefined) {
    throw new Error('useZohoActions must be used within a ZohoProvider')
  }
  return context
}

// Combined hook for convenience using modern patterns
export const useZoho = (): ZohoContextType => {
  const state = useZohoState()
  const actions = useZohoActions()
  
  return {
    ...state,
    ...actions,
  } as const
}
