export default function Stars({ rating = 5, size = 14 }) {
  return (
    <div className="db-stars">
      {[1,2,3,4,5].map(s => (
        <svg key={s} viewBox="0 0 24 24" style={size !== 14 ? {width:size,height:size} : undefined} className={s > rating ? 'empty' : ''}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}
