# Company profile styles (`/profile/[slug]`)

CSS for the public company profile page (`app/profile/CompanyDetailPage.tsx`),
namespace `cmp-*`. Formerly one ~1,800-line `app/styles/profile-page.css`;
split here one file per page section so each part is easy to find and edit.

## How it loads

These files are imported **directly, in order** at the top of
`CompanyDetailPage.tsx`. **That import order is the cascade order — keep it.**
`test-listing-page.css` (the reused `.tlp-*` listing cards) loads *after* these.

There is no barrel/index file — the component's import block is the manifest.
To add a section: create the file here and add its `import` line in the right
position in `CompanyDetailPage.tsx`.

## Files (in load order = top-to-bottom of the page)

| File | Section |
| --- | --- |
| `tokens.css` | `.cmp-root` design tokens (colors, accent) + reset — **must stay first** |
| `buttons.css` | `.cmp-btn` primary / outline buttons |
| `head.css` | Sticky head: logo, name, verified pill, rating, awards pill, CTAs |
| `main.css` | Left column: tagline, description + Read more, Watch video, stats |
| `tab-widget.css` | Right column: Services/Focus/Industries/Clients tabs + pie chart |
| `pricing-snapshot.css` | `.cmp-snap` stat cards, "What clients said", range bar, service pills |
| `section.css` | Generic `.cmp-section` heading shell (shared by sections below) |
| `portfolio.css` | "Products by us" card grid (`.cmp-portfolio`) |
| `connect.css` | "Get in touch" block (`.cmp-connect`) |
| `tlp-bridge.css` | Spacing bridge into the reused `.tlp-*` listing cards |
| `similar-companies.css` | "Similar companies" cards (`.cmp-sib`) |
| `popular-tools.css` | "Popular tools" cards (`.cmp-tools`) |
| `versus.css` | Compare / "X vs Y" cards (`.cmp-vs`) |
| `video.css` | Watch-our-video embed (`.cmp-video`) |
| `awards.css` | Awards & recognition cards + reveal animation (`.cmp-awards`, keyframes) |
| `reviews.css` | Reviews list + empty state (`.cmp-reviews`) |
| `responsive-mobile.css` | Cross-section `@media` polish — **layered after the per-section rules** |
| `breadcrumb.css` | Breadcrumb bar (`.cmp-crumb`) |
| `pricing-snapshot-hero.css` | Alternate pricing snapshot hero band (`.cmp-snap-hero`) |

> Order note: `responsive-mobile.css` intentionally sits late so its overrides
> win over the per-section defaults above it. Don't move it earlier.
