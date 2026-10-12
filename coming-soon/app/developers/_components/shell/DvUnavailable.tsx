import DvBand from './DvBand'
import DvNotice from './DvNotice'

/* ═══════════════════════════════════════════════════════════════════════
   What a page renders when its snapshot cannot be loaded (spec 6.2,
   DevDataError): a short notice instead of zeros or a 404 for a real URL.
   The page's metadata sets noindex for that render (devUnavailableMetadata).
   ═══════════════════════════════════════════════════════════════════════ */

export interface DvUnavailableProps {
  /** Which dataset is refreshing: 'open source' or 'free API'. */
  data: 'open source' | 'free API' | 'developer'
}

export default function DvUnavailable({ data }: DvUnavailableProps) {
  return (
    <DvBand tone="white" title="This data is refreshing">
      <DvNotice tone="info">Our {data} data is refreshing. Please try again in a few minutes.</DvNotice>
    </DvBand>
  )
}
