import { useEffect, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { roleHomePath } from '../../auth/roleHome'
import { useAuth } from '../../auth/useAuth'
import { PublicFooter, PublicHeader } from './PublicChrome'
import './publicPage.css'

export function PublicPage({
  title,
  lead,
  children,
}: {
  title: string
  lead?: string
  children: ReactNode
}) {
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (isAuthenticated && user) {
    return <Navigate to={roleHomePath(user.role)} replace />
  }

  return (
    <div className="lp">
      <PublicHeader />
      <main className="lp-page">
        <header className="lp-page__head">
          <h1>{title}</h1>
          {lead && <p className="lp-page__lead">{lead}</p>}
        </header>
        <div className="lp-prose">{children}</div>
      </main>
      <PublicFooter />
    </div>
  )
}
