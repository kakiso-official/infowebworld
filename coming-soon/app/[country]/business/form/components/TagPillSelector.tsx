'use client'

type Option = { id: string; name: string }

type Props = {
  options: Option[]
  selected: string[]
  onToggle: (id: string) => void
  min?: number
  max?: number
  placeholder?: string
}

/**
 * Reusable multi-select as a grid of pill buttons.
 * Used for specializations (listing types) and faceted tags.
 */
export default function TagPillSelector({ options, selected, onToggle, min, max, placeholder }: Props) {
  if (options.length === 0) {
    return <div className="lf2-pills-empty">{placeholder || 'No options available'}</div>
  }
  const hasMin = typeof min === 'number' && min > 0
  const minUnmet = hasMin && selected.length < (min as number)

  return (
    <div className="lf2-pills">
      <div className="lf2-pills-grid">
        {options.map(opt => {
          const on = selected.includes(opt.id)
          const cantAdd = !on && typeof max === 'number' && max > 0 && selected.length >= max
          return (
            <button
              key={opt.id}
              type="button"
              className={`lf2-pill${on ? ' lf2-pill--on' : ''}${cantAdd ? ' lf2-pill--capped' : ''}`}
              onClick={() => !cantAdd && onToggle(opt.id)}
              disabled={cantAdd}
            >
              {opt.name}
            </button>
          )
        })}
      </div>
      <div className={`lf2-pills-count${minUnmet ? ' lf2-pills-count--warn' : ''}`}>
        {selected.length}
        {hasMin && <> / min {min}</>}
        {typeof max === 'number' && max > 0 && max < 99 && <> · max {max}</>}
        {' selected'}
      </div>
    </div>
  )
}
