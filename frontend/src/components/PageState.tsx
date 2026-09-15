import { useT } from '../i18n/useT'
import './PageState.css'

export function LoadingState() {
  const { t } = useT()
  return (
    <p className="page-state">
      <span className="page-state__pulse" />
      {t('common.loading')}
    </p>
  )
}

export function ErrorState({ message }: { message: string }) {
  return <p className="page-state page-state--error">{message}</p>
}

export function ComingSoon({ title }: { title: string }) {
  const { t } = useT()
  return (
    <div>
      <h2 className="page-state__title">{title}</h2>
      <p className="page-state">{t('common.comingSoon')}</p>
    </div>
  )
}
