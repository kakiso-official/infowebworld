'use client'
import { useState } from 'react'
import { faClock, faDesktop, faEarthAmericas, faLanguage, faRepeat } from '@fortawesome/free-solid-svg-icons'
import type { AudienceReport, BreakdownRow } from '@/lib/analytics/types'
import '../../../styles/analytics-insights.css'
import {
  BarChart, CountryFlag, EmptyState, InfoTip, OTHER_COLOR, PageHeader, Panel, PanelGrid, ReportView, SERIES, Skeleton, Tabs,
  countryName, deviceLabel, fmtNumber, fmtPercent, fmtRange, sectionFor, useAnalyticsQuery, useReport,
} from '../_ui'
import {
  BreakdownTable, FactTile, HourOfWeekHeatmap, ProportionBar, RetentionPanel, hourOfWeekSummary, plural,
} from '../_ui/insights'

/* ════════════════════════════════════════════════════════════════════════
   Analytics - Audience. Who the visitors are: where they are, what they
   use, which language they read, whether they come back (new vs returning,
   visit frequency, weekly retention cohorts) and when they visit (hour of
   the week in the analytics timezone). Every row filters the section.
   ════════════════════════════════════════════════════════════════════════ */

export default function AudiencePage() {
  const r = useReport<AudienceReport>('audience')
  const range = r.data?.range
  return (
    <>
      <PageHeader
        title="Audience"
        subtitle={sectionFor('audience').subtitle}
        meta={range && <span>{fmtRange(range.from, range.to)}</span>}
      />
      <ReportView state={r} skeleton={<AudienceSkeleton />}>
        {data => <AudienceBody data={data} />}
      </ReportView>
      {/* Its own report (cohorts span weeks past the range) - loads independently. */}
      {!r.needsMigration && <RetentionPanel />}
    </>
  )
}

function AudienceSkeleton() {
  return (
    <>
      <Skeleton variant="kpis" rows={4} />
      <PanelGrid>
        <Skeleton variant="block" height={260} />
        <Skeleton variant="block" height={260} />
      </PanelGrid>
      <Skeleton variant="table" rows={8} />
    </>
  )
}

function AudienceBody({ data }: { data: AudienceReport }) {
  const q = useAnalyticsQuery()
  const nr = data.newVsReturning
  const people = nr.newVisitors + nr.returningVisitors
  const topCountry = data.countries[0]
  const topDevice = data.devices[0]

  return (
    <>
      <div className="an-kpis an-ix-facts" role="group" aria-label="Headline answers">
        <FactTile
          label="Top country"
          tip={{ text: 'The country most visitors came from (Cloudflare location - no IP addresses are stored). Click to see only those visitors everywhere.' }}
          value={topCountry ? <span className="an-ix-fact-flag"><CountryFlag code={topCountry.key} decorative />{topCountry.label}</span> : '–'}
          title={topCountry?.label}
          textValue
          sub={topCountry ? `${fmtPercent(topCountry.share, 0)} of visitors · ${fmtNumber(data.countries.length)}${data.countries.length >= 50 ? '+' : ''} ${plural(data.countries.length, 'country', 'countries')} in total` : 'No visits yet'}
          onClick={topCountry ? () => q.setFilter('country', topCountry.key) : undefined}
          actionLabel={topCountry ? `Show only visitors from ${countryName(topCountry.key)}` : undefined}
        />
        <FactTile
          label="New visitors"
          tip={{ metric: 'newVisitors' }}
          value={fmtNumber(nr.newVisitors)}
          sub={people ? `${fmtPercent(nr.newVisitors / people, 0)} of visitors` : undefined}
          onClick={nr.newVisitors ? () => q.setFilter('visitor', 'new') : undefined}
          actionLabel="Show only new visitors"
        />
        <FactTile
          label="Returning visitors"
          tip={{ metric: 'returningVisitors' }}
          value={fmtNumber(nr.returningVisitors)}
          sub={people ? `${fmtPercent(nr.returningVisitors / people, 0)} of visitors` : undefined}
          onClick={nr.returningVisitors ? () => q.setFilter('visitor', 'returning') : undefined}
          actionLabel="Show only returning visitors"
        />
        <FactTile
          label="Mostly on"
          tip={{ text: 'The device type most visitors used: desktop, mobile or tablet. Click to see only those visitors.' }}
          value={topDevice ? deviceLabel(topDevice.key) : '–'}
          textValue
          sub={topDevice ? `${fmtPercent(topDevice.share, 0)} of visitors` : undefined}
          onClick={topDevice ? () => q.setFilter('device', topDevice.key) : undefined}
          actionLabel={topDevice ? `Show only ${deviceLabel(topDevice.key).toLowerCase()} visitors` : undefined}
        />
      </div>

      <PanelGrid>
        <LoyaltyPanel data={data} />
        <FrequencyPanel data={data} />
      </PanelGrid>

      <LocationPanel data={data} />
      <TechPanel data={data} />
      <WhenPanel data={data} />
    </>
  )
}

/* ── New vs returning + frequency ───────────────────────────────────────── */

function LoyaltyPanel({ data }: { data: AudienceReport }) {
  const nr = data.newVsReturning
  const people = nr.newVisitors + nr.returningVisitors
  const visits = nr.newSessions + nr.returningSessions
  return (
    <Panel
      title="New vs returning"
      info={<InfoTip title="New vs returning" text="New = this period held the visitor's very first visit. Returning = they had been on the site before. One person can be both in a long period (first visit, then a return visit)." />}
    >
      {people === 0 ? (
        <EmptyState compact icon={faRepeat} title="No visitors in this period" text="The split between first-time and returning visitors appears here." />
      ) : (
        <div className="an-ix-loyalty">
          <div>
            <div className="an-ix-mini-title">Visitors</div>
            <ProportionBar
              ariaLabel="Visitors: new vs returning"
              height={14}
              showCounts
              segments={[
                { key: 'new', label: 'New', value: nr.newVisitors, color: SERIES[0], detail: `${fmtNumber(nr.newVisitors)} ${plural(nr.newVisitors, 'visitor')}` },
                { key: 'ret', label: 'Returning', value: nr.returningVisitors, color: SERIES[1], detail: `${fmtNumber(nr.returningVisitors)} ${plural(nr.returningVisitors, 'visitor')}` },
              ]}
            />
          </div>
          <div>
            <div className="an-ix-mini-title">Visits</div>
            <ProportionBar
              ariaLabel="Visits: by new vs returning visitors"
              height={14}
              showCounts
              segments={[
                { key: 'new', label: 'By new visitors', value: nr.newSessions, color: SERIES[0], detail: `${fmtNumber(nr.newSessions)} ${plural(nr.newSessions, 'visit')}` },
                { key: 'ret', label: 'By returning visitors', value: nr.returningSessions, color: SERIES[1], detail: `${fmtNumber(nr.returningSessions)} ${plural(nr.returningSessions, 'visit')}` },
              ]}
            />
          </div>
          {visits > 0 && nr.returningSessions > 0 && (
            <p className="an-ix-note">
              Returning visitors made {fmtPercent(nr.returningSessions / visits, 0)} of all visits.
            </p>
          )}
        </div>
      )}
    </Panel>
  )
}

function FrequencyPanel({ data }: { data: AudienceReport }) {
  const total = data.frequency.reduce((s, f) => s + f.visitors, 0)
  const once = data.frequency.find(f => f.bucket === '1')?.visitors ?? 0
  return (
    <Panel
      title="How often each visitor came"
      info={<InfoTip title="Visit frequency" text="Visitors grouped by how many separate visits they made in this period. Many visitors with 2+ visits means people come back to use the directory." />}
      subtitle={total ? `${fmtPercent(1 - once / total, 0)} of visitors came more than once` : undefined}
    >
      {total === 0 ? (
        <EmptyState compact icon={faRepeat} title="No visitors in this period" text="How many times each visitor came back appears here." />
      ) : (
        <BarChart
          bars={data.frequency.map(f => ({
            key: f.bucket,
            label: f.bucket === '1' ? '1 visit' : `${f.bucket} visits`,
            value: f.visitors,
            tooltipLabel: f.bucket === '1' ? 'Came once' : `Came ${f.bucket} times`,
            detail: `${fmtPercent(f.visitors / total, 0)} of visitors`,
          }))}
          valueLabel="Visitors"
          height={210}
          ariaLabel="Visitors by number of visits in this period"
        />
      )}
    </Panel>
  )
}

/* ── Location + language ────────────────────────────────────────────────── */

type LocTab = 'countries' | 'regions' | 'cities' | 'languages'

function LocationPanel({ data }: { data: AudienceReport }) {
  const [tab, setTab] = useState<LocTab>('countries')
  const cityHint = 'Cities and regions need Cloudflare\'s "Add visitor location headers" transform (Analytics → Settings explains how).'
  const placeSub = (r: BreakdownRow) => {
    const cc = typeof r.extra?.country === 'string' ? countryName(r.extra.country) : null
    const region = typeof r.extra?.region === 'string' ? r.extra.region : null
    return [region, cc].filter(Boolean).join(', ') || null
  }
  return (
    <Panel
      title="Where they are"
      info={<InfoTip title="Locations" text="Country, region and city from Cloudflare (no IP addresses are stored), and the browser's language. Click a row to filter the whole section by it." />}
      tabs={(
        <Tabs<LocTab>
          ariaLabel="Location breakdown"
          value={tab}
          onChange={setTab}
          items={[
            { key: 'countries', label: 'Countries' },
            { key: 'regions', label: 'Regions' },
            { key: 'cities', label: 'Cities' },
            { key: 'languages', label: 'Languages' },
          ]}
        />
      )}
      flush
    >
      {tab === 'countries' && (
        <BreakdownTable
          dim="country" rows={data.countries} caption="Countries" csvName="countries" nameHeader="Country"
          clickHint="Show only this country" pageSize={10}
          empty={<EmptyState compact icon={faEarthAmericas} title="No visitors in this period" text="Every country visitors came from is listed here with how engaged they were." />}
        />
      )}
      {tab === 'regions' && (
        <BreakdownTable
          dim="region" rows={data.regions} caption="Regions" csvName="regions" nameHeader="Region"
          sub={placeSub} clickHint="Show only this region" pageSize={10}
          empty={<EmptyState compact icon={faEarthAmericas} title="No region data" text={cityHint} />}
        />
      )}
      {tab === 'cities' && (
        <BreakdownTable
          dim="city" rows={data.cities} caption="Cities" csvName="cities" nameHeader="City"
          sub={placeSub} clickHint="Show only this city" pageSize={10}
          empty={<EmptyState compact icon={faEarthAmericas} title="No city data" text={cityHint} />}
        />
      )}
      {tab === 'languages' && (
        <BreakdownTable
          dim="language" rows={data.languages} caption="Languages" csvName="languages" nameHeader="Language"
          nameTip={<InfoTip title="Language" text="The main language of the visitor's browser (English covers en-US, en-GB...). Not filterable." />}
          pageSize={10}
          empty={<EmptyState compact icon={faLanguage} title="No language data" text="The language each visitor's browser is set to appears here." />}
        />
      )}
    </Panel>
  )
}

/* ── Technology ─────────────────────────────────────────────────────────── */

type TechTab = 'devices' | 'browsers' | 'os' | 'screens'

/** Color follows the device, never its rank (a filter must not repaint the bar). */
const DEVICE_COLOR: Record<string, string> = { desktop: SERIES[0], mobile: SERIES[1], tablet: SERIES[2] }

function TechPanel({ data }: { data: AudienceReport }) {
  const [tab, setTab] = useState<TechTab>('devices')
  const total = data.devices.reduce((s, d) => s + d.visitors, 0)
  return (
    <Panel
      title="What they use"
      info={<InfoTip title="Technology" text="Device type, browser, operating system and screen size of each visit - read from the browser, never fingerprinted. Click a device, browser or OS to filter." />}
      tabs={(
        <Tabs<TechTab>
          ariaLabel="Technology breakdown"
          value={tab}
          onChange={setTab}
          items={[
            { key: 'devices', label: 'Devices' },
            { key: 'browsers', label: 'Browsers' },
            { key: 'os', label: 'Operating systems' },
            { key: 'screens', label: 'Screens' },
          ]}
        />
      )}
      flush
    >
      {tab === 'devices' && (
        <>
          {total > 0 && (
            <div className="an-ix-panel-pad">
              <ProportionBar
                ariaLabel="Visitors by device"
                height={12}
                segments={data.devices.map(d => ({ key: d.key, label: d.label, value: d.visitors, color: DEVICE_COLOR[d.key] ?? OTHER_COLOR }))}
              />
            </div>
          )}
          <BreakdownTable
            dim="device" rows={data.devices} caption="Devices" csvName="devices" nameHeader="Device"
            clickHint="Show only this device type" pageSize={10}
            empty={<EmptyState compact icon={faDesktop} title="No visitors in this period" text="Desktop, mobile and tablet visitors are compared here." />}
          />
        </>
      )}
      {tab === 'browsers' && (
        <BreakdownTable dim="browser" rows={data.browsers} caption="Browsers" csvName="browsers" nameHeader="Browser" clickHint="Show only this browser" pageSize={10} />
      )}
      {tab === 'os' && (
        <BreakdownTable dim="os" rows={data.os} caption="Operating systems" csvName="operating-systems" nameHeader="Operating system" clickHint="Show only this operating system" pageSize={10} />
      )}
      {tab === 'screens' && (
        <BreakdownTable
          dim="screen" rows={data.screens} caption="Screen sizes" csvName="screens" nameHeader="Screen (width × height)"
          nameTip={<InfoTip title="Screen size" text="The device's screen size in CSS pixels - useful when deciding which layouts to test. Not filterable." />}
          variant="basic" pageSize={10}
        />
      )}
    </Panel>
  )
}

/* ── When ───────────────────────────────────────────────────────────────── */

function WhenPanel({ data }: { data: AudienceReport }) {
  const q = useAnalyticsQuery()
  const summary = hourOfWeekSummary(data.hourOfWeek)
  return (
    <Panel
      title="When visitors come"
      info={<InfoTip title="Hour of the week" text={`Visits by weekday and hour of the day, in your analytics timezone (${q.tz}). Darker = more visits. Useful for timing emails, posts and maintenance.`} />}
      subtitle={`Times in ${q.tz}`}
    >
      {summary ? (
        <>
          <p className="an-ix-lede">{summary}</p>
          <HourOfWeekHeatmap matrix={data.hourOfWeek} tz={q.tz} />
        </>
      ) : (
        <EmptyState compact icon={faClock} title="No visits in this period" text="Once visits come in, this shows which days and hours are busiest." />
      )}
    </Panel>
  )
}
