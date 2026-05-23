# Professional Services Listing Re-mapping Notes (v2)

After the v2 taxonomy migration, the 1 existing professional-services
submission is re-attached in Section F at the bottom of the SQL.

| id | Company | Old category | New category | New slug |
|---|---|---|---|---|
| 22 | AZB & Partners | Lawyers & Law Firms by Specialty → Corporate Law Attorneys (Listing type: Corporate Law: Mergers & Acquisitions) | Legal Services → Business Law → **Mergers & Acquisitions Lawyers** | `mergers-acquisitions-lawyers` |

## Reasoning

AZB & Partners is one of India's "Big Six" law firms. Their OLD listing_type
was explicitly **"Corporate Law: Mergers & Acquisitions"** — so the new
`mergers-acquisitions-lawyers` L4 is the exact-match successor (also under
Business Law, same conceptual placement).

Alternatives if a broader category is preferred:
- `corporate-law-attorneys` (L4, same parent) — broader corporate-law catch-all
- `business-law` (L3, parent of both) — even broader, the L2-style "Business Law" bucket

Override the slug in Section F before running the SQL if you want to
re-point the firm to one of the alternatives.
