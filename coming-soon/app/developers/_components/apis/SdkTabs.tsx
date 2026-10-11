'use client'

import { installCommand, REGISTRY_LABELS, registryPageUrl } from '@/lib/developers/snippets'
import { sdkLanguageRank, sdkTabFor } from '@/lib/developers/taxonomy'
import type { ApiSdk } from '@/lib/developers/types'
import DvTabs, { type DvTab } from '../shell/DvTabs'
import CodeBlock from '../ui/CodeBlock'
import DvExternalLink from '../ui/DvExternalLink'

/* ═══════════════════════════════════════════════════════════════════════
   SdkTabs (spec 3.15, 4.8) - one tab per SDK language (JavaScript and
   TypeScript share a tab, as do C# and .NET), each showing its install
   command, version and registry link. A thin wrapper over shell/DvTabs,
   so the WAI-ARIA tab mechanics and the no-JS fallback are not
   reimplemented. The full SdkTable (every official SDK, always in the
   HTML) renders separately, under this component.
   ═══════════════════════════════════════════════════════════════════════ */

export interface SdkTabsProps {
  /** Official SDKs only; pass community libraries to their own SdkTable. */
  sdks: readonly ApiSdk[]
  label: string
}

export default function SdkTabs({ sdks, label }: SdkTabsProps) {
  const groups = new Map<string, { label: string; sdks: ApiSdk[] }>()
  for (const sdk of sdks) {
    const tab = sdkTabFor(sdk.languageSlug, sdk.language)
    const g = groups.get(tab.key)
    if (g) g.sdks.push(sdk)
    else groups.set(tab.key, { label: tab.label, sdks: [sdk] })
  }
  if (!groups.size) return null

  const tabs: DvTab[] = [...groups.entries()]
    .sort((a, b) => sdkLanguageRank(a[0]) - sdkLanguageRank(b[0]))
    .map(([key, g]) => ({
      id: key,
      label: g.label,
      count: g.sdks.length > 1 ? g.sdks.length : undefined,
      content: (
        <div>
          {g.sdks.map((sdk, i) => {
            const install = installCommand(sdk)
            const regUrl = sdk.registryUrl ?? registryPageUrl(sdk)
            return (
              <div className="dv-sdk-install" key={`${sdk.package}-${i}`}>
                {install ? (
                  <CodeBlock code={install.code} lang={install.lang} label={install.label} />
                ) : (
                  <p className="dv-sdk-install-pkg"><code>{sdk.package}</code></p>
                )}
                <div className="dv-sdk-install-meta">
                  <span>{REGISTRY_LABELS[sdk.registry]}</span>
                  {sdk.version && <span>Version <code>{sdk.version}</code></span>}
                  {regUrl && <DvExternalLink href={regUrl}>View on {REGISTRY_LABELS[sdk.registry]}</DvExternalLink>}
                </div>
              </div>
            )
          })}
        </div>
      ),
    }))

  return <DvTabs tabs={tabs} label={label} />
}
