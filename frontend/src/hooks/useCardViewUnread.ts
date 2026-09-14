import { useEffect, useState } from 'react'
import { getCardViewUnreadCount } from '../api/cardViewLogs'
import { useAuth } from '../auth/useAuth'
import { onCardViewRead } from './cardViewEvents'

const POLL_INTERVAL_MS = 20_000

export function useCardViewUnread() {
  const { user } = useAuth()
  const [unread, setUnread] = useState(false)

  useEffect(() => {
    if (user?.role !== 'AGENCY_ADMIN') return
    let cancelled = false

    const poll = async () => {
      try {
        const count = await getCardViewUnreadCount()
        if (!cancelled) setUnread(count > 0)
      } catch {
        // Transient failure — the next poll retries; the badge just stays as it was.
      }
    }

    poll()
    const interval = setInterval(poll, POLL_INTERVAL_MS)
    const unsubscribe = onCardViewRead(poll)
    return () => {
      cancelled = true
      clearInterval(interval)
      unsubscribe()
    }
  }, [user])

  return unread
}
