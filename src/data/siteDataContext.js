import { createContext, useContext } from 'react'

export const SiteDataContext = createContext({ data: null, error: false })

export function useSiteData() {
  return useContext(SiteDataContext)
}
