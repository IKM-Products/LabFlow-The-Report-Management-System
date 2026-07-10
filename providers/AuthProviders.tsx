"use client"

import { useEffect } from 'react'
import { get_user_service } from '@/services/auth_services'
import { useUserStore } from '@/store/userStore'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setLoading, clear } = useUserStore()

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      try {
        const response = await get_user_service()

        if (response.success) {
          setUser(response.data)
        } else {
          clear()
        }
      } catch {
        clear()
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [setUser, setLoading, clear])

  return <>{children}</>
}