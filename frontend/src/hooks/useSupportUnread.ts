import { useEffect, useState } from 'react'
import { getMySupportUnread, listHotelsWithUnreadSupport } from '../api/supportMessages'
import { useAuth } from '../auth/useAuth'
import { onSupportRead } from './supportEvents'

const POLL_INTERVAL_MS = 20_000

export function useSupportUnread() {
  const { user } = useAuth()
  const [hotelUnread, setHotelUnread] = useState(false)
  const [unreadHotelIds, setUnreadHotelIds] = useState<number[]>([])

  useEffect(() => {
    if (!user) return
    let cancelled = false

    const poll = async () => {
      try {
        if (user.role === 'HOTEL_ADMIN') {
          const unread = await getMySupportUnread()
          if (!cancelled) setHotelUnread(unread)
        } else if (user.role === 'AGENCY_ADMIN' || user.role === 'AGENCY_STAFF') {
          const ids = await listHotelsWithUnreadSupport()
          if (!cancelled) setUnreadHotelIds(ids)
        }
      } catch {
        // Transient failure — the next poll retries; badges just stay as they were.
      }
    }

    poll()
    const interval = setInterval(poll, POLL_INTERVAL_MS)
    const unsubscribe = onSupportRead(poll)
    return () => {
      cancelled = true
      clearInterval(interval)
      unsubscribe()
    }
  }, [user])

  return { hotelUnread, unreadHotelIds }
}
