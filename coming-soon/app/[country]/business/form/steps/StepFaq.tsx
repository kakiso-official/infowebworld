'use client'
import StepHead from '../components/StepHead'
import { I } from '../icons'
import type { StepProps, PlanCaps } from '../types'

export default function StepFaq({ form, set, caps }: StepProps & { caps: PlanCaps }) {
  const addFaq = () => { if (form.faqs.length >= caps.maxFaqs) return; set('faqs', [...form.faqs, { question: '', answer: '' }]) }
  const updateFaq = (i: number, f: 'question' | 'answer', v: string) => {
    const arr = [...form.faqs]; arr[i] = { ...arr[i], [f]: v }; set('faqs', arr)
  }
  const removeFaq = (i: number) => {
    const arr = form.faqs.filter((_, j) => j !== i)
    set('faqs', arr.length ? arr : [{ question: '', answer: '' }])
  }

  return (
    <div className="lf2-section">
      <StepHead icon={I.sparkle} title="Frequently asked questions"
        sub="Answer buyer questions. Boosts SEO and confidence." />

      {form.faqs.map((faq, i) => (
        <div key={i} className="lf2-faq-item">
          <div className="lf2-faq-head">
            <span className="lf2-faq-num">Q{i + 1}</span>
            {form.faqs.length > 1 && (
              <button type="button" className="lf2-icon-btn" onClick={() => removeFaq(i)} aria-label="Remove">{I.trash}</button>
            )}
          </div>
          <input type="text" className="lf2-input" value={faq.question}
            onChange={e => updateFaq(i, 'question', e.target.value)}
            placeholder="Question" maxLength={200} />
          <textarea className="lf2-input lf2-textarea lf2-textarea--sm" value={faq.answer}
            onChange={e => updateFaq(i, 'answer', e.target.value)}
            placeholder="Answer (3–4 sentences work best)" rows={3} maxLength={600} />
        </div>
      ))}
      {form.faqs.length < caps.maxFaqs && (
        <button type="button" className="lf2-add-btn" onClick={addFaq}>{I.plus} Add FAQ</button>
      )}
    </div>
  )
}
