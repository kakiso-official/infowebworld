'use client'
import {
  faBullhorn, faChartColumn, faFileLines, faLink, faMagnifyingGlass, faRobot, faShareNodes,
} from '@fortawesome/free-solid-svg-icons'
import type { AcquisitionReport, BreakdownRow, PageRow } from '@/lib/analytics/types'
import '../../../styles/analytics-insights.css'
import {
  DataTable, EmptyState, InfoTip, PageHeader, Panel, PathCell, ReportView, Skeleton, SourceIcon, StackedBars, Tabs,
  channelLabel, fmtNumber, fmtPercent, fmtRange, foldChannels, sectionFor, useAnalyticsQuery, useReport,
  type Column,
} from '../_ui'
import { BreakdownTable, FactTile, comparisonLabel, isHttpUrl } from '../_ui/insights'

/* ════════════════════════════════════════════════════════════════════════
   Analytics - Traffic sources. Answers "where do visitors come from?":
   headline tiles (biggest channel, search, AI assistants, referring sites),
   the channel mix over time, a channel quality table, the detailed source
   tabs (sources, referrers, referring URLs, campaigns, AI, search, social),
   the pages people land on, and how a visit's source is decided.
   ════════════════════════════════════════════════════════════════════════ */

type SourceTab = 'sources' | 'referrers' | 'urls' | 'campaigns' | 'ai' | 'search' | 'social'
const SOURCE_TABS: SourceTab[] = ['sources', 'referrers', 'urls', 'campaigns', 'ai', 'search', 'social']

const BUCKET_WORD = { hour: 'per hour', day: 'per day', week: 'per week', month: 'per month' } as const

export default function AcquisitionPage() {
  const r = useReport<AcquisitionReport>('acquisition')
  const range = r.data?.range
  return (
    <>
      <PageHeader
        title="Traffic sources"
        subtitle={sectionFor('acquisition').subtitle}
        meta={range && <span>{fmtRange(range.from, range.to)}{range.prev ? ` · compared with ${fmtRange(range.prev.from, range.prev.to)}` : ''}</span>}
      />
      <ReportView state={r} skeleton={<AcquisitionSkeleton />}>
        {data => <AcquisitionBody data={data} />}
      </ReportView>
    </>
  )
}

function AcquisitionSkeleton() {
  return (
    <>
      <Skeleton variant="kpis" rows={4} />
      <Skeleton variant="chart" height={320} />
      <Skeleton variant="table" rows={8} />
    </>
  )
}

/** The channel row with this key, if any visits came through it. */
const channelRow = (rows: BreakdownRow[], key: string) => rows.find(r => r.key === key)

function AcquisitionBody({ data }: { data: AcquisitionReport }) {
  const q = useAnalyticsQuery()
  const periodLabel = comparisonLabel(data.range)
  const top = data.channels[0]
  const search = channelRow(data.channels, 'organic_search')
  const ai = channelRow(data.channels, 'ai_assistant')
  const nothing = data.channels.length === 0
  // Referrer hosts include search engines and social networks; "websites" are the plain referrals.
  const sites = data.referrers.filter(r => r.extra?.channel === 'referral')
  const sitesCapped = data.referrers.length >= 50

  return (
    <>
      <div className="an-kpis an-ix-facts" role="group" aria-label="Headline answers">
        <FactTile
          label="Biggest channel"
          tip={{ text: 'The channel that brought the most visitors in this period. Click to see only those visitors everywhere.' }}
          value={top ? top.label : '–'}
          textValue
          sub={top ? `${fmtPercent(top.share, 0)} of visitors` : 'No visits yet'}
          delta={top?.previous ? { value: top.visitors, previous: top.previous.visitors, periodLabel } : undefined}
          onClick={top ? () => q.setFilter('channel', top.key) : undefined}
          actionLabel={top ? `Show only visitors from ${top.label}` : undefined}
        />
        <FactTile
          label="From search engines"
          tip={{ channel: 'organic_search', title: 'From search engines' }}
          value={fmtNumber(search?.sessions ?? 0)}
          sub={data.searchEngines[0] ? `visits · mostly ${data.searchEngines[0].label}` : 'visits'}
          delta={search?.previous ? { value: search.sessions, previous: search.previous.sessions, periodLabel } : undefined}
          onClick={search ? () => q.setFilter('channel', 'organic_search') : undefined}
          actionLabel="Show only visits from search engines"
        />
        <FactTile
          label="From AI assistants"
          tip={{ channel: 'ai_assistant', title: 'From AI assistants' }}
          value={fmtNumber(ai?.sessions ?? 0)}
          sub={data.aiAssistants[0] ? `visits · mostly ${data.aiAssistants[0].label}` : 'visits'}
          delta={ai?.previous ? { value: ai.sessions, previous: ai.previous.sessions, periodLabel } : undefined}
          onClick={ai ? () => q.setFilter('channel', 'ai_assistant') : undefined}
          actionLabel="Show only visits from AI assistants"
        />
        <FactTile
          label="Websites linking to you"
          tip={{ text: 'Other websites (not search engines, social networks, webmail or AI assistants) whose links brought visitors in this period.' }}
          value={`${fmtNumber(sites.length)}${sitesCapped ? '+' : ''}`}
          sub={sites[0] ? `top: ${sites[0].label}` : 'none in this period'}
          title={sites[0]?.label}
          href={sites.length ? 'acquisition?tab=referrers' : undefined}
          actionLabel="See every referring website"
        />
      </div>

      <Panel
        title="Visits by channel"
        info={<InfoTip title="Visits by channel" text="How many visits each channel brought, stacked so the total height is all visits. Click a legend item to hide or show a channel; hover a bar for the exact split." />}
        subtitle={`Visits ${BUCKET_WORD[data.channelSeries.bucket]} · ${fmtRange(data.range.from, data.range.to)}`}
      >
        {nothing ? (
          <EmptyState
            icon={faChartColumn}
            title="No visits in this period"
            text={`Each visit is counted under the channel that brought it - search, AI assistants, social, other websites, email or direct.${q.filterList.length ? ' Try clearing the filters or choosing a longer range.' : ' Try a longer date range.'}`}
          />
        ) : (
          <StackedBars
            labels={data.channelSeries.labels}
            series={foldChannels(data.channelSeries.series, channelLabel)}
            totalLabel="Visits"
            height={280}
            ariaLabel={`Visits per channel, ${BUCKET_WORD[data.channelSeries.bucket]}`}
          />
        )}
      </Panel>

      <Panel
        title="Channels"
        info={<InfoTip title="Channels" text="Every channel with how many people it brought and how good those visits were. Engaged and bounce rate show whether visitors stayed; key actions and conversion show whether they did something that matters. Click a row to filter the whole section by that channel." />}
        flush
      >
        <BreakdownTable
          dim="channel"
          rows={data.channels}
          caption="Channels"
          csvName="traffic-channels"
          nameHeader="Channel"
          periodLabel={periodLabel}
          clickHint="Show only this channel"
          rowTip={row => <InfoTip channel={row.key} />}
          empty={<EmptyState compact icon={faChartColumn} title="No visits yet" text="Channels appear as soon as visits are recorded in this period." />}
        />
      </Panel>

      <SourcesPanel data={data} periodLabel={periodLabel} />

      <div className="an-ix-split">
        <LandingPanel rows={data.landingPages} />
        <ExplainerPanel />
      </div>
    </>
  )
}

/* ── Source tabs ────────────────────────────────────────────────────────── */

function SourcesPanel({ data, periodLabel }: { data: AcquisitionReport; periodLabel: string }) {
  const q = useAnalyticsQuery()
  const raw = q.param('tab') as SourceTab | null
  const tab: SourceTab = raw && SOURCE_TABS.includes(raw) ? raw : 'sources'
  const setTab = (t: SourceTab) => q.set({ tab: t === 'sources' ? null : t }, { replace: true })

  const common = { periodLabel, pageSize: 15 }
  const hostSub = (r: BreakdownRow) => (typeof r.extra?.sampleUrl === 'string' ? r.extra.sampleUrl : null)

  return (
    <Panel
      title="Where exactly they came from"
      info={<InfoTip title="Sources" text="The exact search engine, AI assistant, social network, website or campaign behind each visit. Click a row to filter the whole section by it." />}
      tabs={(
        <Tabs<SourceTab>
          ariaLabel="Source breakdown"
          value={tab}
          onChange={setTab}
          items={[
            { key: 'sources', label: 'Sources', count: data.sources.length || undefined },
            { key: 'referrers', label: 'Referrers', count: data.referrers.length || undefined },
            { key: 'urls', label: 'Referring pages', count: data.referrerUrls.length || undefined },
            { key: 'campaigns', label: 'Campaigns', count: data.campaigns.length || undefined },
            { key: 'ai', label: 'AI assistants', count: data.aiAssistants.length || undefined },
            { key: 'search', label: 'Search engines', count: data.searchEngines.length || undefined },
            { key: 'social', label: 'Social', count: data.socialNetworks.length || undefined },
          ]}
        />
      )}
      flush
    >
      {tab === 'sources' && (
        <BreakdownTable
          {...common}
          dim="source"
          rows={data.sources}
          caption="Sources"
          csvName="traffic-sources"
          nameHeader="Source"
          clickHint="Show only this source"
          sub={r => (typeof r.extra?.channel === 'string' ? channelLabel(r.extra.channel) : null)}
          empty={<EmptyState compact icon={faShareNodes} title="No sources yet" text="Search engines, websites, apps and campaigns that sent visitors show up here." />}
        />
      )}
      {tab === 'referrers' && (
        <BreakdownTable
          {...common}
          dim="referrer"
          rows={data.referrers}
          caption="Referring websites"
          csvName="referrers"
          nameHeader="Website"
          nameTip={<InfoTip title="Referrers" text="The website the visitor was on when they clicked a link to us (its domain). Includes search engines and social networks; visits that hide their origin count as Direct and are not listed." />}
          clickHint="Show only visits from this website"
          sub={hostSub}
          externalUrl={hostSub}
          empty={<EmptyState compact icon={faLink} title="No referring websites in this period" text="When another website links to InfoWebWorld and someone clicks it, that website is listed here." />}
        />
      )}
      {tab === 'urls' && (
        <BreakdownTable
          {...common}
          dim="referrer"
          rows={data.referrerUrls}
          caption="Referring pages"
          csvName="referring-pages"
          nameHeader="Page that linked to you"
          nameTip={<InfoTip title="Referring pages" text="The exact page (address without its query string) that held the link. Clicking a row filters by that page's website." />}
          icon={r => <SourceIcon source={null} channel={typeof r.extra?.channel === 'string' ? r.extra.channel : 'referral'} />}
          sub={r => (typeof r.extra?.channel === 'string' ? channelLabel(r.extra.channel) : null)}
          externalUrl={r => (isHttpUrl(r.key) ? r.key : null)}
          onRowClick={r => { if (typeof r.extra?.host === 'string') q.setFilter('referrer', r.extra.host) }}
          clickHint="Show only visits from this website"
          variant="basic"
          empty={<EmptyState compact icon={faLink} title="No referring pages in this period" text="The exact pages on other websites that link to you appear here, so you can see (and thank) who is sending traffic." />}
        />
      )}
      {tab === 'campaigns' && (
        <BreakdownTable
          {...common}
          dim="campaign"
          rows={data.campaigns}
          caption="Campaigns"
          csvName="campaigns"
          nameHeader="Campaign"
          nameTip={<InfoTip title="Campaigns" text="Links tagged with utm_campaign (in emails, ads, social posts). Under the name: the utm_source / utm_medium most of its visits used." />}
          clickHint="Show only this campaign"
          empty={<EmptyState compact icon={faBullhorn} title="No campaign links used in this period" text="Add utm_source, utm_medium and utm_campaign to links you share in emails, ads or posts and each campaign is listed here with its results." />}
        />
      )}
      {tab === 'ai' && (
        <BreakdownTable
          {...common}
          dim="ai"
          rows={data.aiAssistants}
          caption="AI assistants"
          csvName="ai-assistants"
          nameHeader="AI assistant"
          nameTip={<InfoTip channel="ai_assistant" />}
          clickHint="Show only this AI assistant"
          empty={<EmptyState compact icon={faRobot} title="No visits from AI assistants in this period" text="When someone clicks a link to InfoWebWorld inside ChatGPT, Perplexity, Claude, Gemini, Copilot or another assistant, the visit shows up here." />}
        />
      )}
      {tab === 'search' && (
        <BreakdownTable
          {...common}
          dim="source"
          rows={data.searchEngines}
          caption="Search engines"
          csvName="search-engines"
          nameHeader="Search engine"
          nameTip={<InfoTip channel="organic_search" />}
          clickHint="Show only this search engine"
          empty={<EmptyState compact icon={faMagnifyingGlass} title="No search engine visits in this period" text="Unpaid visits from Google, Bing, DuckDuckGo and other search engines appear here." />}
        />
      )}
      {tab === 'social' && (
        <BreakdownTable
          {...common}
          dim="source"
          rows={data.socialNetworks}
          caption="Social networks"
          csvName="social-networks"
          nameHeader="Social network"
          nameTip={<InfoTip channel="social" />}
          clickHint="Show only this social network"
          empty={<EmptyState compact icon={faShareNodes} title="No visits from social networks in this period" text="Unpaid links clicked on LinkedIn, Facebook, X, Reddit, YouTube and other networks appear here." />}
        />
      )}
    </Panel>
  )
}

/* ── Landing pages ──────────────────────────────────────────────────────── */

function LandingPanel({ rows }: { rows: PageRow[] }) {
  const q = useAnalyticsQuery()
  const columns: Column<PageRow>[] = [
    {
      key: 'path', header: 'Landing page', sticky: true, minWidth: 220,
      value: r => r.path,
      render: r => <PathCell path={r.path} title={r.title} pageType={r.pageType} />,
    },
    { key: 'entries', header: 'Entrances', tip: <InfoTip metric="entries" />, value: r => r.entries, format: 'number', bar: true },
    { key: 'bounceRate', header: 'Bounce rate', tip: <InfoTip metric="bounceRate" text="Share of visits that started on this page and left quickly: one page, under 10 seconds of active time, no key action." />, value: r => r.bounceRate, format: 'percent' },
    { key: 'avgEngagedMs', header: 'Avg. time', tip: <InfoTip title="Avg. time on page" text="Average active time on this page per view (only while the tab was visible and in use)." />, value: r => r.avgEngagedMs, format: 'duration' },
  ]
  return (
    <Panel
      title="Landing pages"
      info={<InfoTip title="Landing pages" text="The first page of each visit - usually pages that rank in search, get shared or are linked from other sites. Click a row to see only visits that landed there." />}
      viewAll={{ href: 'pages?group=entry', label: 'All landing pages' }}
      flush
    >
      <DataTable
        rows={rows}
        columns={columns}
        rowKey={r => r.path}
        onRowClick={r => q.setFilter('entry', r.path)}
        defaultSort={{ key: 'entries', dir: 'desc' }}
        pageSize={10}
        csvName="landing-pages"
        caption="Landing pages"
        empty={<EmptyState compact icon={faFileLines} title="No landing pages in this period" text="The pages where visits start are listed here with how well each one holds on to visitors." />}
      />
    </Panel>
  )
}

/* ── Explainer ──────────────────────────────────────────────────────────── */

function ExplainerPanel() {
  return (
    <Panel
      title="How we decide the source"
      info={<InfoTip title="Attribution" text="A visit's source is decided once, on its first page, and kept for the whole visit." />}
      className="an-ix-explainer"
    >
      <ol className="an-ix-steps">
        <li><b>Campaign tags win.</b> A link with <code>utm_source</code> / <code>utm_medium</code> is credited to that campaign and channel.</li>
        <li><b>Ad click ids next.</b> A <code>gclid</code>, <code>msclkid</code> or similar id means paid search or paid social.</li>
        <li><b>Then the referring website.</b> Known search engines, AI assistants, social networks and webmail get their own channel; any other website is a referral.</li>
        <li><b>Nothing to go on = Direct.</b> Typed address, bookmark, or an app that hides where the visitor came from.</li>
        <li><b>A new visit starts</b> after 30 minutes without activity, or when the visitor arrives again through a different campaign.</li>
      </ol>
      <p className="an-ix-note">Moving between our own pages, signing in with Google or paying with PayPal never changes the source.</p>
    </Panel>
  )
}
