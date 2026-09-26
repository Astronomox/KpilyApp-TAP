'use client'

import { createContext, useContext } from 'react'
import type { Profile } from '@/lib/kpily'

export const ProfileContext = createContext<{ profile: Profile | null; setProfile: (p: Profile) => void }>({ profile: null, setProfile: () => {} })
/** The signed-in user, provided by AppShell. */
export const useProfile = () => useContext(ProfileContext)
