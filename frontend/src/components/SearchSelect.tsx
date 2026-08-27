import { useEffect, useId, useMemo, useRef, useState } from 'react'
import './SearchSelect.css'

export interface SearchSelectProps<T> {
  items: T[]
  value: T | null
  onChange: (item: T | null) => void
  getKey: (item: T) => string
  getLabel: (item: T) => string
  getMeta?: (item: T) => string
  /** Text used for matching; defaults to label + meta. */
  getSearchText?: (item: T) => string
  placeholder?: string
  maxResults?: number
  id?: string
}

export function SearchSelect<T>({
  items,
  value,
  onChange,
  getKey,
  getLabel,
  getMeta,
  getSearchText,
  placeholder = 'Ara...',
  maxResults = 60,
  id,
}: SearchSelectProps<T>) {
  const reactId = useId()
  const listId = `${id ?? reactId}-list`
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)

  const searchText = (item: T) =>
    (getSearchText ? getSearchText(item) : `${getLabel(item)} ${getMeta?.(item) ?? ''}`).toLowerCase()

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items.slice(0, maxResults)
    const terms = q.split(/\s+/)
    return items.filter((it) => {
      const text = searchText(it)
      return terms.every((t) => text.includes(t))
    }).slice(0, maxResults)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, query, maxResults])

  useEffect(() => {
    setActive(0)
  }, [query])

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  const select = (item: T) => {
    onChange(item)
    setQuery('')
    setOpen(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActive((a) => Math.min(a + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      if (open && results[active]) {
        e.preventDefault()
        select(results[active])
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const displayValue = open ? query : value ? getLabel(value) : ''

  return (
    <div className="search-select" ref={rootRef}>
      <div className="search-select__field">
        <svg className="search-select__icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          className="search-select__input"
          placeholder={placeholder}
          value={displayValue}
          onFocusCapture={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onKeyDown={onKeyDown}
        />
        {value && !open && (
          <button
            type="button"
            className="search-select__clear"
            aria-label="Seçimi temizle"
            onClick={() => onChange(null)}
          >
            ×
          </button>
        )}
      </div>

      {open && (
        <ul className="search-select__list" id={listId} role="listbox">
          {results.length === 0 && <li className="search-select__empty">Sonuç yok</li>}
          {results.map((item, i) => (
            <li
              key={getKey(item)}
              role="option"
              aria-selected={i === active}
              className={'search-select__option' + (i === active ? ' is-active' : '')}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => {
                e.preventDefault()
                select(item)
              }}
            >
              <span className="search-select__option-label">{getLabel(item)}</span>
              {getMeta && <span className="search-select__option-meta">{getMeta(item)}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
