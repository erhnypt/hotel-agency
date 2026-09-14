/**
 * Lets CardViewLogsPage (which just had the backend mark logs read) tell
 * useCardViewUnread (living in the AppShell ancestor) to re-check immediately,
 * instead of waiting for its next poll tick.
 */
type Listener = () => void

let listeners: Listener[] = []

export function onCardViewRead(listener: Listener): () => void {
  listeners.push(listener)
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}

export function notifyCardViewRead(): void {
  listeners.forEach((listener) => listener())
}
