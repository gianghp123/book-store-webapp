// src/app/(auth)/auth-provider.tsx
'use client'

import { Refine } from '@refinedev/core'
import { dataProvider } from '@/provider/public-data-provider'
import { authProvider } from '@/provider/auth-provider' // 1. Import authProvider

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <Refine
      // 2. Thêm authProvider vào đây
      authProvider={authProvider}
      dataProvider={dataProvider()}
    >
      {children}
    </Refine>
  )
}