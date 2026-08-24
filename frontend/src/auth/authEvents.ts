/**
 * Lets the axios interceptor (outside the React tree) notify AuthContext when a
 * request comes back 401, so the app logs out and redirects immediately instead
 * of leaving stale, now-invalid auth state in React until the next re-render.
 */
type Listener = () => void

let listeners: Listener[] = []

export function onUnauthorized(listener: Listener): () => void {
  listeners.push(listener)
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}

export function notifyUnauthorized(): void {
  listeners.forEach((listener) => listener())
}
