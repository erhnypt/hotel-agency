import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useT } from '../../i18n/useT'
import { PublicPage } from './PublicPage'
// Canonical legal text lives in repo-root docs/ and is bundled at build time.
import agreementMarkdown from '../../../../docs/legal/otel-is-ortakligi-sozlesmesi.md?raw'

type Block =
  | { kind: 'h2'; text: string }
  | { kind: 'p'; text: string }
  | { kind: 'ul'; items: string[] }
  | { kind: 'hr' }

function parse(markdown: string): Block[] {
  const blocks: Block[] = []
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')

  let paragraph: string[] = []
  let list: string[] = []

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ kind: 'p', text: paragraph.join(' ').trim() })
      paragraph = []
    }
  }
  const flushList = () => {
    if (list.length) {
      blocks.push({ kind: 'ul', items: list })
      list = []
    }
  }

  for (const raw of lines) {
    const line = raw.trimEnd()
    if (line.startsWith('# ')) continue
    if (line.startsWith('## ')) {
      flushParagraph()
      flushList()
      blocks.push({ kind: 'h2', text: line.slice(3).trim() })
      continue
    }
    if (line.trim() === '---') {
      flushParagraph()
      flushList()
      blocks.push({ kind: 'hr' })
      continue
    }
    const listMatch = line.match(/^\s*-\s+(.*)$/)
    if (listMatch) {
      flushParagraph()
      list.push(listMatch[1].trim())
      continue
    }
    if (line.trim() === '') {
      flushParagraph()
      flushList()
      continue
    }
    flushList()
    paragraph.push(line.trim())
  }
  flushParagraph()
  flushList()
  return blocks
}

function renderInline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    return <Fragment key={i}>{part}</Fragment>
  })
}

const BLOCKS = parse(agreementMarkdown)

export function HotelAgreementPage() {
  const { t } = useT()
  return (
    <PublicPage title={t('hotelAgreement.title')} lead={t('hotelAgreement.lead')}>
      <p>
        <em>{t('hotelAgreement.version')}</em>
      </p>
      {BLOCKS.map((block, i) => {
        switch (block.kind) {
          case 'h2':
            return <h2 key={i}>{renderInline(block.text)}</h2>
          case 'p':
            return <p key={i}>{renderInline(block.text)}</p>
          case 'ul':
            return (
              <ul key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>{renderInline(item)}</li>
                ))}
              </ul>
            )
          case 'hr':
            return <hr key={i} />
        }
      })}
      <p>
        <Link to="/iletisim">{t('legal.contactPrompt')}</Link>
      </p>
    </PublicPage>
  )
}
