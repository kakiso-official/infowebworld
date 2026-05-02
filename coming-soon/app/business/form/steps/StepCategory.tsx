'use client'
import type { Category } from '../../../iww-hq/data/category-storage'
import type { ListingType } from '../../../iww-hq/data/listing-type-storage'
import type { StepProps, PlanCaps } from '../types'
import CategoryPicker from '../components/CategoryPicker'
import TagPillSelector from '../components/TagPillSelector'
import StepHead from '../components/StepHead'
import { I } from '../icons'

type Props = StepProps & {
  allCategories: Category[]
  listingTypes: ListingType[]
  caps: PlanCaps
}

export default function StepCategory({ form, set, errors, allCategories, listingTypes, caps }: Props) {
  const toggleSpec = (id: string) => {
    if (form.listingTypeIds.includes(id)) {
      set('listingTypeIds', form.listingTypeIds.filter(x => x !== id))
    } else {
      set('listingTypeIds', [...form.listingTypeIds, id])
    }
  }

  return (
    <div className="lf2-section">
      <StepHead
        icon={I.star}
        title="Where does your business fit?"
        sub="Sector → category → subcategory → specializations (at least 2)."
      />

      <CategoryPicker
        categories={allCategories}
        l1Id={form.l1Id}
        l2Id={form.l2Id}
        l3Id={form.l3Id}
        errors={{ l1: errors.l1Id, l2: errors.l2Id, l3: errors.l3Id }}
        onChange={(l1, l2, l3) => {
          set('l1Id', l1); set('l2Id', l2); set('l3Id', l3)
          set('listingTypeIds', [])
        }}
      />

      {form.l3Id && (
        <div className="lf2-specs">
          <div className="lf2-specs-head">
            <div className="lf2-cat-num">4</div>
            <div className="lf2-cat-col">
              <div className="lf2-cat-title">
                Specializations <span className="lf2-cat-req">*</span>
              </div>
              <div className="lf2-cat-hint">
                Pick at least {caps.minSpecializations}. More help buyers find you.
              </div>
            </div>
          </div>

          <TagPillSelector
            options={listingTypes.map(lt => ({ id: lt.id, name: lt.name }))}
            selected={form.listingTypeIds}
            onToggle={toggleSpec}
            min={caps.minSpecializations}
            placeholder="No specializations available for this subcategory"
          />
          {errors.listingTypeIds && <div className="lf2-field-error">{errors.listingTypeIds}</div>}
        </div>
      )}
    </div>
  )
}
