'use client'

/* ════════════════════════════════════════════════════════════════════════
   LocalBusinessForm — the create/edit form for local-business profiles.
   Self-contained (own `lbf-*` styles, own inputs) so it never touches the
   product / company multi-step form flow. Captures every field the Yelp-style
   /profile page renders, then POSTs to /api/submissions (create) or PUTs to
   /api/submissions/[uuid] (edit) with listingMode='company' + lb_* fields.
   ════════════════════════════════════════════════════════════════════════ */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash, faImage, faSpinner, faCheck } from '@fortawesome/free-solid-svg-icons'
import { uploadFile } from '../../../iww-hq/data/submissions-storage'
import { LB_VERTICALS, verticalForSlug, amenityLabel } from '../../../lib/local-business-verticals'
import './local-business-form.css'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const PRICES = ['$', '$$', '$$$', '$$$$']

type HourRow = { day: string; open: string; close: string; closed: boolean }
type MenuRow = { name: string; price: string; description: string; photo: string }
type VideoRow = { url: string; title: string }
export type LBInitial = {
  uuid?: string
  companyName?: string; contactName?: string; email?: string; phone?: string; website?: string
  categorySlug?: string; address?: string; city?: string; state?: string; country?: string
  tagline?: string; description?: string; logoUrl?: string
  priceRange?: string; hours?: HourRow[]; amenities?: string[]; menu?: MenuRow[]; photos?: string[]; videos?: VideoRow[]
}

const defaultHours = (): HourRow[] => DAYS.map((d) => ({ day: d, open: '9:00 AM', close: '5:00 PM', closed: false }))

export default function LocalBusinessForm({ initial }: { initial?: LBInitial }) {
  const router = useRouter()
  const editing = !!initial?.uuid

  const [name, setName] = useState(initial?.companyName || '')
  const [contactName, setContactName] = useState(initial?.contactName || '')
  const [email, setEmail] = useState(initial?.email || '')
  const [phone, setPhone] = useState(initial?.phone || '')
  const [website, setWebsite] = useState(initial?.website || '')
  const [categorySlug, setCategorySlug] = useState(initial?.categorySlug || '')
  const [address, setAddress] = useState(initial?.address || '')
  const [city, setCity] = useState(initial?.city || '')
  const [state, setState] = useState(initial?.state || '')
  const [country, setCountry] = useState(initial?.country || 'United States')
  const [tagline, setTagline] = useState(initial?.tagline || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [logoUrl, setLogoUrl] = useState(initial?.logoUrl || '')
  const [priceRange, setPriceRange] = useState(initial?.priceRange || '$')
  const [hours, setHours] = useState<HourRow[]>(initial?.hours?.length ? initial.hours : defaultHours())
  const [amenities, setAmenities] = useState<string[]>(initial?.amenities || [])
  const [menu, setMenu] = useState<MenuRow[]>(initial?.menu || [])
  const [photos, setPhotos] = useState<string[]>(initial?.photos || [])
  const [videos, setVideos] = useState<VideoRow[]>(initial?.videos || [])

  /* Category-appropriate wording (Menu vs Services vs Products …) + the amenity
     set for the chosen category. Re-derived live as the picker changes. */
  const vertical = verticalForSlug(categorySlug)

  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState('')
  const [done, setDone] = useState(false)

  const setHour = (i: number, patch: Partial<HourRow>) => setHours((h) => h.map((r, j) => (j === i ? { ...r, ...patch } : r)))
  const toggleAmenity = (slug: string) => setAmenities((a) => (a.includes(slug) ? a.filter((s) => s !== slug) : [...a, slug]))
  const setMenuRow = (i: number, patch: Partial<MenuRow>) => setMenu((m) => m.map((r, j) => (j === i ? { ...r, ...patch } : r)))
  const setVideoRow = (i: number, patch: Partial<VideoRow>) => setVideos((v) => v.map((r, j) => (j === i ? { ...r, ...patch } : r)))

  async function onUpload(files: FileList | null, set: (url: string) => void) {
    if (!files || !files.length) return
    setUploading(true); setErr('')
    try {
      for (const f of Array.from(files)) {
        const url = await uploadFile(f, 'screenshot')
        set(url)
      }
    } catch { setErr('Image upload failed. Try again.') } finally { setUploading(false) }
  }

  async function submit() {
    setErr('')
    if (!name.trim()) return setErr('Business name is required.')
    if (!contactName.trim()) return setErr('Contact name is required.')
    if (!email.trim()) return setErr('Contact email is required.')
    if (!tagline.trim()) return setErr('A short tagline is required.')
    if (!country.trim()) return setErr('Country is required.')

    const payload = {
      listingMode: 'company',
      plan: 'free',
      companyName: name.trim(), contactName: contactName.trim(), email: email.trim(),
      phoneCode: '+1', phone: phone.trim() || null, website: website.trim() || null,
      category: categorySlug, categorySlug,
      country: country.trim(), city: city.trim() || null, state: state.trim() || null,
      hqLocation: address.trim() || null,
      tagline: tagline.trim(), description: description.trim() || null, logoUrl: logoUrl || null,
      lbPriceRange: priceRange,
      lbHours: hours.map((h) => ({ day: h.day, time: h.closed ? '' : `${h.open} - ${h.close}`, closed: h.closed })),
      lbAmenities: amenities,
      lbMenu: menu.filter((m) => m.name.trim()),
      lbPhotos: photos,
      lbVideos: videos.filter((v) => v.url.trim()),
    }

    setBusy(true)
    try {
      const res = editing
        ? await fetch(`/api/submissions/${initial!.uuid}`, { method: 'PUT', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        : await fetch('/api/submissions', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) { setErr(j?.error || 'Could not save. Please try again.'); return }
      setDone(true)
      setTimeout(() => router.push('/dashboard/listings'), 1400)
    } catch { setErr('Network error. Please try again.') } finally { setBusy(false) }
  }

  if (done) {
    return (
      <div className="lbf-done">
        <span className="lbf-done-ic"><FontAwesomeIcon icon={faCheck} /></span>
        <h2>{editing ? 'Changes submitted' : 'Listing submitted'}</h2>
        <p>Your local business {editing ? 'update is' : 'listing is'} in review. Redirecting to your listings…</p>
      </div>
    )
  }

  return (
    <div className="lbf">
      <div className="lbf-head">
        <h1>{editing ? 'Edit your business' : 'List your local business'}</h1>
        <p>Fill in everything customers see on your page — photos, hours, {vertical.listingLabel.toLowerCase()} and more.</p>
      </div>

      {/* Basics */}
      <section className="lbf-sec">
        <h2>Basics</h2>
        <div className="lbf-grid">
          <label className="lbf-f"><span>Business name *</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Mason Street Subs" /></label>
          <label className="lbf-f"><span>Category</span>
            <select value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)}>
              <option value="">Select a category…</option>
              {LB_VERTICALS.map((v) => (
                <optgroup key={v.l2Slug} label={v.l2Name}>
                  <option value={v.l2Slug}>{v.l2Name} (general)</option>
                  {v.children.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </optgroup>
              ))}
            </select>
          </label>
          <label className="lbf-f lbf-f--full"><span>Tagline *</span><input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Fresh-made subs, salads and wraps — fast and friendly." maxLength={255} /></label>
          <label className="lbf-f lbf-f--full"><span>About the business</span><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Tell customers what makes your business special…" /></label>
          <label className="lbf-f"><span>Price range</span>
            <div className="lbf-prices">
              {PRICES.map((p) => <button key={p} type="button" className={`lbf-price ${priceRange === p ? 'is-on' : ''}`} onClick={() => setPriceRange(p)}>{p}</button>)}
            </div>
          </label>
          <label className="lbf-f"><span>Logo</span>
            <div className="lbf-logo">
              {logoUrl && <img src={logoUrl} alt="" />}
              <label className="lbf-upload-btn">{uploading ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faImage} />} {logoUrl ? 'Replace' : 'Upload logo'}
                <input type="file" accept="image/*" hidden onChange={(e) => onUpload(e.target.files, setLogoUrl)} />
              </label>
            </div>
          </label>
        </div>
      </section>

      {/* Contact & location */}
      <section className="lbf-sec">
        <h2>Contact & location</h2>
        <div className="lbf-grid">
          <label className="lbf-f"><span>Contact name *</span><input value={contactName} onChange={(e) => setContactName(e.target.value)} /></label>
          <label className="lbf-f"><span>Contact email *</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label className="lbf-f"><span>Phone</span><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="415 685 2455" /></label>
          <label className="lbf-f"><span>Website</span><input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://…" /></label>
          <label className="lbf-f lbf-f--full"><span>Street address</span><input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="1480 Mason St, San Francisco, CA 94133" /></label>
          <label className="lbf-f"><span>City</span><input value={city} onChange={(e) => setCity(e.target.value)} /></label>
          <label className="lbf-f"><span>State / Region</span><input value={state} onChange={(e) => setState(e.target.value)} /></label>
          <label className="lbf-f"><span>Country *</span><input value={country} onChange={(e) => setCountry(e.target.value)} /></label>
        </div>
      </section>

      {/* Hours */}
      <section className="lbf-sec">
        <h2>Hours</h2>
        <div className="lbf-hours">
          {hours.map((h, i) => (
            <div key={h.day} className="lbf-hour">
              <span className="lbf-hour-day">{h.day}</span>
              <label className="lbf-hour-closed"><input type="checkbox" checked={h.closed} onChange={(e) => setHour(i, { closed: e.target.checked })} /> Closed</label>
              {!h.closed && (
                <>
                  <input className="lbf-hour-t" value={h.open} onChange={(e) => setHour(i, { open: e.target.value })} placeholder="9:00 AM" />
                  <span className="lbf-hour-to">to</span>
                  <input className="lbf-hour-t" value={h.close} onChange={(e) => setHour(i, { close: e.target.value })} placeholder="5:00 PM" />
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Amenities */}
      <section className="lbf-sec">
        <h2>Amenities</h2>
        <div className="lbf-amen">
          {vertical.amenities.map((slug) => (
            <label key={slug} className={`lbf-amen-item ${amenities.includes(slug) ? 'is-on' : ''}`}>
              <input type="checkbox" checked={amenities.includes(slug)} onChange={() => toggleAmenity(slug)} /> {amenityLabel(slug)}
            </label>
          ))}
        </div>
      </section>

      {/* Menu */}
      <section className="lbf-sec">
        <div className="lbf-sec-head"><h2>{vertical.listingLabel}</h2>
          <button type="button" className="lbf-add" onClick={() => setMenu((m) => [...m, { name: '', price: '', description: '', photo: '' }])}><FontAwesomeIcon icon={faPlus} /> Add {vertical.listingItemNoun}</button>
        </div>
        {menu.length === 0 && <p className="lbf-empty">{vertical.listingFormHint}</p>}
        <div className="lbf-menu">
          {menu.map((m, i) => (
            <div key={i} className="lbf-menu-row">
              {m.photo
                ? <img className="lbf-menu-img" src={m.photo} alt="" />
                : <label className="lbf-menu-up">{uploading ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faImage} />}<input type="file" accept="image/*" hidden onChange={(e) => onUpload(e.target.files, (url) => setMenuRow(i, { photo: url }))} /></label>}
              <div className="lbf-menu-fields">
                <input value={m.name} onChange={(e) => setMenuRow(i, { name: e.target.value })} placeholder={vertical.listingItemNoun.charAt(0).toUpperCase() + vertical.listingItemNoun.slice(1) + ' name'} />
                <input className="lbf-menu-price" value={m.price} onChange={(e) => setMenuRow(i, { price: e.target.value })} placeholder="Price" />
                <input value={m.description} onChange={(e) => setMenuRow(i, { description: e.target.value })} placeholder="Short description (optional)" />
              </div>
              <button type="button" className="lbf-del" onClick={() => setMenu((mm) => mm.filter((_, j) => j !== i))}><FontAwesomeIcon icon={faTrash} /></button>
            </div>
          ))}
        </div>
      </section>

      {/* Photos */}
      <section className="lbf-sec">
        <h2>Photos</h2>
        <div className="lbf-photos">
          {photos.map((p, i) => (
            <div key={i} className="lbf-photo">
              <img src={p} alt="" />
              <button type="button" className="lbf-photo-x" onClick={() => setPhotos((ph) => ph.filter((_, j) => j !== i))}><FontAwesomeIcon icon={faTrash} /></button>
            </div>
          ))}
          <label className="lbf-photo-add">{uploading ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faPlus} />}<span>Add photos</span>
            <input type="file" accept="image/*" multiple hidden onChange={(e) => onUpload(e.target.files, (url) => setPhotos((ph) => [...ph, url]))} />
          </label>
        </div>
      </section>

      {/* Videos */}
      <section className="lbf-sec">
        <div className="lbf-sec-head"><h2>Videos</h2>
          <button type="button" className="lbf-add" onClick={() => setVideos((v) => [...v, { url: '', title: '' }])}><FontAwesomeIcon icon={faPlus} /> Add video</button>
        </div>
        {videos.length === 0 && <p className="lbf-empty">Paste a YouTube or Vimeo link to feature a video.</p>}
        {videos.map((v, i) => (
          <div key={i} className="lbf-video-row">
            <input value={v.url} onChange={(e) => setVideoRow(i, { url: e.target.value })} placeholder="https://www.youtube.com/watch?v=…" />
            <input value={v.title} onChange={(e) => setVideoRow(i, { title: e.target.value })} placeholder="Title (optional)" />
            <button type="button" className="lbf-del" onClick={() => setVideos((vv) => vv.filter((_, j) => j !== i))}><FontAwesomeIcon icon={faTrash} /></button>
          </div>
        ))}
      </section>

      {err && <div className="lbf-err">{err}</div>}
      <div className="lbf-actions">
        <button type="button" className="lbf-submit" onClick={submit} disabled={busy || uploading}>
          {busy ? <><FontAwesomeIcon icon={faSpinner} spin /> Saving…</> : editing ? 'Save changes' : 'Submit listing'}
        </button>
      </div>
    </div>
  )
}
