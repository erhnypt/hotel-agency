import './PageState.css'

export function LoadingState() {
  return (
    <p className="page-state">
      <span className="page-state__pulse" />
      Yükleniyor
    </p>
  )
}

export function ErrorState({ message }: { message: string }) {
  return <p className="page-state page-state--error">{message}</p>
}

export function ComingSoon({ title }: { title: string }) {
  return (
    <div>
      <h2 className="page-state__title">{title}</h2>
      <p className="page-state">Bu sayfa yapım aşamasında.</p>
    </div>
  )
}
