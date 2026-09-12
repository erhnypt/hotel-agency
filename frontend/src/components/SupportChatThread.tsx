import axios from 'axios'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { listSupportMessages, sendSupportMessage } from '../api/supportMessages'
import type { ApiErrorResponse } from '../auth/types'
import { useAuth } from '../auth/useAuth'
import { useAsync } from '../hooks/useAsync'
import { notifySupportRead } from '../hooks/supportEvents'
import { ErrorState, LoadingState } from './PageState'
import './SupportChatThread.css'

const POLL_INTERVAL_MS = 20_000

export function SupportChatThread({ hotelId }: { hotelId: number }) {
  const { user } = useAuth()
  const [refreshKey, setRefreshKey] = useState(0)
  const [messages, setMessages] = useState<Awaited<ReturnType<typeof listSupportMessages>>>([])
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false)
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const fetched = useAsync(() => listSupportMessages(hotelId), [hotelId, refreshKey])

  useEffect(() => {
    if (fetched.data) {
      setMessages(fetched.data)
      setHasLoadedOnce(true)
      // The backend marks the thread read as a side effect of this fetch —
      // tell the nav/list unread badges to re-check now instead of on their next poll.
      notifySupportRead()
    }
  }, [fetched.data])

  useEffect(() => {
    const interval = setInterval(() => setRefreshKey((key) => key + 1), POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = body.trim()
    if (!trimmed) return

    setError(null)
    setSending(true)
    try {
      await sendSupportMessage(hotelId, trimmed)
      setBody('')
      setRefreshKey((key) => key + 1)
    } catch (err) {
      if (axios.isAxiosError<ApiErrorResponse>(err) && err.response) {
        setError(err.response.data.message)
      } else {
        setError('Mesaj gönderilemedi.')
      }
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="support-chat">
      {!hasLoadedOnce && fetched.loading && <LoadingState />}
      {fetched.error && !hasLoadedOnce && <ErrorState message={fetched.error} />}

      {hasLoadedOnce && (
        <div className="support-chat__thread">
          {messages.length === 0 && <p className="page-state">Henüz mesaj yok. İlk mesajı siz gönderin.</p>}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`support-chat__bubble ${
                message.senderId === user?.id ? 'support-chat__bubble--mine' : 'support-chat__bubble--theirs'
              }`}
            >
              <div className="support-chat__meta">
                <span className="support-chat__sender">{message.senderName}</span>
                <span className="support-chat__time">{new Date(message.createdAt).toLocaleString('tr-TR')}</span>
              </div>
              <p className="support-chat__body">{message.body}</p>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      )}

      {error && <p className="form-error">{error}</p>}

      <form className="support-chat__composer" onSubmit={handleSubmit}>
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Mesajınızı yazın..."
          rows={2}
          required
        />
        <button type="submit" className="btn btn--primary" disabled={sending}>
          Gönder
        </button>
      </form>
    </div>
  )
}
