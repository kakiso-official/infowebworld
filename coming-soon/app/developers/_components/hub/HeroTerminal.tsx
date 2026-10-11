import { formatDate } from '@/lib/developers/format'
import { shellQuote } from '@/lib/developers/snippets'

/* ═══════════════════════════════════════════════════════════════════════
   Hub hero terminal card (spec 3.1): a static, non-interactive preview of
   the hero API's recorded sample request and the top repository's clone
   command. Nothing here is invented - the status line only appears when
   our checker actually recorded it.
   ═══════════════════════════════════════════════════════════════════════ */

export interface HeroTerminalProps {
  sampleUrl: string | null
  sampleDescription: string | null
  checkedAt: string | null
  httpStatus: number | null
  contentType: string | null
  apiName: string | null
  apiHref: string | null
  topRepoNameWithOwner: string | null
  topRepoUrl: string | null
  className?: string
}

export default function HeroTerminal({
  sampleUrl, sampleDescription, checkedAt, httpStatus, contentType, apiName, apiHref,
  topRepoNameWithOwner, topRepoUrl, className,
}: HeroTerminalProps) {
  if (!sampleUrl && !topRepoUrl) return null

  return (
    <figure className={`dv-terminal${className ? ` ${className}` : ''}`}>
      <div className="dv-terminal-bar" aria-hidden="true">
        <span className="dv-terminal-dot" />
        <span className="dv-terminal-dot" />
        <span className="dv-terminal-dot" />
        <span className="dv-terminal-title">terminal</span>
      </div>
      <pre className="dv-terminal-body"><code>
        {sampleUrl && (
          <>
            <span className="dv-prompt" aria-hidden="true">$</span>
            <span className="tk-cmd">curl</span> <span className="tk-str">{shellQuote(sampleUrl)}</span>{'\n'}
            {sampleDescription && <><span className="tk-com"># {sampleDescription}</span>{'\n'}</>}
            {httpStatus && (
              <>
                <span className="dv-terminal-muted">HTTP/2</span> {httpStatus}
                {contentType && <span className="dv-terminal-muted"> - {contentType.split(';')[0]}</span>}
                {'\n'}
              </>
            )}
            {checkedAt && <span className="dv-terminal-muted">Recorded check, {formatDate(checkedAt)}</span>}
            {'\n\n'}
          </>
        )}
        {topRepoUrl && topRepoNameWithOwner && (
          <>
            <span className="dv-prompt" aria-hidden="true">$</span>
            <span className="tk-cmd">git</span> <span className="tk-flag">clone</span>{' '}
            <span className="tk-str">{topRepoUrl}.git</span>{'\n'}
          </>
        )}
      </code></pre>
      {apiHref && apiName && (
        <a className="dv-terminal-link" href={apiHref}>Try the {apiName} API live -&gt;</a>
      )}
    </figure>
  )
}
