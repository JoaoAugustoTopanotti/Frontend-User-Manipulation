// src/lib/ReactQueryProvider.tsx
'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './queryClient'
import { ReactNode } from 'react'

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
