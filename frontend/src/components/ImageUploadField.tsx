import { useRef, useState } from 'react'
import { MAX_ROOM_IMAGES } from '../api/types'
import { compressImageToDataUrl } from '../utils/compressImage'
import { useT } from '../i18n/useT'
import './ImageUploadField.css'

export interface ImageUploadItem {
  key: string
  url: string
}

export function ImageUploadField({
  images,
  maxImages = MAX_ROOM_IMAGES,
  onAdd,
  onRemove,
}: {
  images: ImageUploadItem[]
  maxImages?: number
  onAdd: (dataUrl: string) => void | Promise<void>
  onRemove: (key: string) => void | Promise<void>
}) {
  const { t } = useT()
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const remainingSlots = maxImages - images.length

  const handleFilesSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    setError(null)
    const files = Array.from(fileList).slice(0, remainingSlots)
    setBusy(true)
    try {
      for (const file of files) {
        const dataUrl = await compressImageToDataUrl(file)
        await onAdd(dataUrl)
      }
    } catch {
      setError(t('imageUpload.error'))
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="image-upload-field">
      <div className="image-upload-field__grid">
        {images.map((image) => (
          <div key={image.key} className="image-upload-field__thumb">
            <img src={image.url} alt="" />
            <button
              type="button"
              className="image-upload-field__remove"
              onClick={() => onRemove(image.key)}
              aria-label={t('imageUpload.remove')}
            >
              ×
            </button>
          </div>
        ))}

        {remainingSlots > 0 && (
          <button
            type="button"
            className="image-upload-field__add"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
          >
            {busy ? '...' : t('imageUpload.add')}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => handleFilesSelected(e.target.files)}
      />

      <p className="image-upload-field__hint">
        {t('imageUpload.count', { count: images.length, max: maxImages })}{' '}
        {remainingSlots === 0 && t('imageUpload.limitReached')}
      </p>

      {error && <p className="form-error">{error}</p>}
    </div>
  )
}
