# Software & SaaS Listing Re-mapping Notes (v2)

After the v2 taxonomy migration deletes the old software-saas categories,
the 5 existing software-saas submissions need a `category_id` re-pointed at
the closest match in the new tree. UPDATE statements live in **Section F** at
the bottom of `database/migration-software-saas-taxonomy-v2.sql`.

All 5 mapped to **DB L4** (deepest level — most specific).

| id | Company | Old category | New category (full path) | New slug |
|---|---|---|---|---|
| 32 | Salesforce | Sales & CRM Software → All-in-One CRM Software | CRM & Sales Software → CRM Platforms → **CRM Software** | `crm-software` |
| 33 | HubSpot | Sales & CRM Software → All-in-One CRM Software | CRM & Sales Software → CRM Platforms → **CRM Software** | `crm-software` |
| 34 | Zoho CRM | Sales & CRM Software → All-in-One CRM Software | CRM & Sales Software → CRM Platforms → **CRM Software** | `crm-software` |
| 35 | Pipedrive | Sales & CRM Software → All-in-One CRM Software | CRM & Sales Software → CRM Platforms → **CRM Software** | `crm-software` |
| 36 | Freshsales | Sales & CRM Software → All-in-One CRM Software | CRM & Sales Software → CRM Platforms → **CRM Software** | `crm-software` |

## Reasoning

All five are general-purpose CRM platforms — none specialised for a single
vertical (real estate, healthcare, construction, etc.) — so `crm-software`
(the generic CRM L4 under "CRM Platforms") is the best fit for every one.

Specialised L4 alternatives within the same L3 ("CRM Platforms") if you
want to override any individual mapping:
- `small-business-crm` — for an SMB-tilted CRM
- `real-estate-crm` / `healthcare-crm` / `financial-services-crm` /
  `insurance-crm` / `construction-crm` / `nonprofit-crm` — vertical CRMs
- `social-crm-tools` — social/community CRMs
- `mac-crm` — Mac-only CRMs

If any of these mappings feels off, override the slug in Section F before
running the SQL — every UPDATE looks up its target via `slug + level=4
LIMIT 1`, so swapping the slug is enough.
