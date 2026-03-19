import DashboardCard from '../../dashboard/shared/DashboardCard'
import { calendarEvents } from '../../../data/admin/newsData'

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const TOTAL_DAYS = 31
const START_DAY = 0 // March 2026 starts on Sunday

const eventMap = {}
calendarEvents.forEach(e => { eventMap[e.day] = e.title })

export default function ContentCalendar() {
  const emptyCells = START_DAY
  const cells = []

  for (let i = 0; i < emptyCells; i++) {
    cells.push(<div key={`e${i}`} className="adm-cal-day adm-cal-day--empty" />)
  }

  for (let d = 1; d <= TOTAL_DAYS; d++) {
    const isToday = d === 19
    const hasContent = !!eventMap[d]
    const classes = [
      'adm-cal-day',
      isToday ? 'adm-cal-day--today' : '',
      hasContent ? 'adm-cal-day--has-content' : '',
    ].filter(Boolean).join(' ')

    cells.push(
      <div key={d} className={classes} title={eventMap[d] || ''}>
        {d}
        {hasContent && <span className="adm-cal-dot" />}
      </div>
    )
  }

  return (
    <DashboardCard
      title="Content Calendar — March 2026"
      icon={<><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>}
    >
      <div className="adm-calendar">
        <div className="adm-cal-header">
          {DAYS_OF_WEEK.map(d => <div key={d}>{d}</div>)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
          {cells}
        </div>
      </div>
    </DashboardCard>
  )
}
