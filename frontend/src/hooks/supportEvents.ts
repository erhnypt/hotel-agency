/**
 * Lets SupportChatThread (which just had the backend mark a thread read by
 * fetching it) tell useSupportUnread (living in the AppShell ancestor) to
 * re-check immediately, instead of waiting for its next 20s poll tick.
 */
type Listener = () => void

let listeners: Listener[] = []

export function onSupportRead(listener: Listener): () => void {
  listeners.push(listener)
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}

export function notifySupportRead(): void {
  listeners.forEach((listener) => listener())
}
