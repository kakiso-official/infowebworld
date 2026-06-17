/* ════════════════════════════════════════════════════════════════════════
   Local-business vertical vocabulary — LOCAL-BUSINESSES SECTOR ONLY.

   The Yelp-style local-business page reuses ONE layout for every kind of
   local business, but the WORDING has to match the category: a restaurant
   has a "Menu", a plumber has "Services", a boutique has "Products", a gym
   has "Classes". This module maps each of the 17 L2 verticals under the
   `local-businesses` L1 (see database/migration-local-businesses-taxonomy-v2.sql)
   to its own vocabulary — section label, item noun, primary CTA, amenity set,
   and category-appropriate sample fallback.

   Used by:
   - app/profile/LocalBusinessProfilePage.tsx   (render real + sample wording)
   - app/dashboard/new/local-business/LocalBusinessForm.tsx (labels + amenities
     + category picker)

   Nothing here is imported by any other sector. Client-safe (no server deps).
   ════════════════════════════════════════════════════════════════════════ */

export type LBCtaIcon = 'bag' | 'calendar' | 'phone' | 'ticket' | 'bed'
export type LBSampleItem = { name: string; price: string }
export type LBChild = { slug: string; name: string }

export interface LBVertical {
  key: string
  l2Slug: string            // L2 category slug — the detection anchor
  l2Name: string
  listingLabel: string      // section heading: "Menu" | "Services" | "Products" …
  listingItemNoun: string   // singular noun for form copy: "dish" | "service" …
  listingViewAll: string    // "View full menu" | "View all services" …
  listingFormHint: string   // empty-state hint inside the owner form
  primaryCtaLabel: string   // sidebar CTA: "Order Online" | "Book Now" …
  primaryCtaIcon: LBCtaIcon
  amenities: string[]       // amenity slugs offered for this vertical
  sampleItems: LBSampleItem[]
  aiTopics: string[]
  children: LBChild[]       // L3 sub-categories (for the form's picker)
}

/* Master amenity slug → label map. Covers every slug used across all
   verticals, so the profile can render any stored amenity even if the owner's
   vertical later changes. */
export const AMENITY_LABELS: Record<string, string> = {
  takeout: 'Offers Takeout',
  delivery: 'Offers Delivery',
  credit_cards: 'Accepts Credit Cards',
  wifi: 'Free Wi-Fi',
  vegetarian: 'Vegetarian Options',
  parking: 'Parking Available',
  wheelchair: 'Wheelchair Accessible',
  outdoor_seating: 'Outdoor Seating',
  reservations: 'Takes Reservations',
  free_estimates: 'Free Estimates',
  licensed_insured: 'Licensed & Insured',
  emergency_service: 'Emergency Service',
  financing: 'Financing Available',
  warranty: 'Warranty Offered',
  eco_friendly: 'Eco-Friendly',
  accepts_insurance: 'Accepts Insurance',
  telehealth: 'Telehealth Available',
  new_patients: 'Accepting New Patients',
  loaner_cars: 'Loaner Cars',
  by_appointment: 'By Appointment',
  walk_ins: 'Walk-Ins Welcome',
  in_store_pickup: 'In-Store Pickup',
  curbside: 'Curbside Pickup',
  returns_accepted: 'Easy Returns',
  free_trial: 'Free Trial',
  personal_training: 'Personal Training',
  showers: 'Showers',
  lockers: 'Lockers',
  pet_friendly: 'Pet Friendly',
  family_friendly: 'Family Friendly',
  air_conditioning: 'Air Conditioning',
  free_consultation: 'Free Consultation',
  rush_service: 'Rush Service Available',
  certified_staff: 'Certified Staff',
  gift_cards: 'Gift Cards',
}

export function amenityLabel(slug: string): string {
  return (
    AMENITY_LABELS[slug] ||
    slug.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  )
}

export const LB_VERTICALS: LBVertical[] = [
  {
    key: 'food',
    l2Slug: 'restaurants-food-drink',
    l2Name: 'Restaurants, Food & Drink',
    listingLabel: 'Menu',
    listingItemNoun: 'menu item',
    listingViewAll: 'View full menu',
    listingFormHint: 'Add your popular dishes, drinks or specials.',
    primaryCtaLabel: 'Order Online',
    primaryCtaIcon: 'bag',
    amenities: ['takeout', 'delivery', 'credit_cards', 'wifi', 'vegetarian', 'outdoor_seating', 'reservations', 'parking', 'wheelchair'],
    sampleItems: [{ name: 'Signature Sandwich', price: '$9.50' }, { name: 'House Salad', price: '$7.00' }, { name: 'Daily Soup', price: '$5.50' }, { name: 'Fresh Lemonade', price: '$3.50' }],
    aiTopics: ['Fresh ingredients', 'Fast service', 'Great value', 'Friendly staff'],
    children: [
      { slug: 'restaurants-by-cuisine', name: 'Restaurants by Cuisine' }, { slug: 'restaurants-by-meal-type', name: 'Restaurants by Meal Type' },
      { slug: 'fast-food-quick-service', name: 'Fast Food & Quick Service' }, { slug: 'healthy-specialty-diets', name: 'Healthy & Specialty Diets' },
      { slug: 'specialty-restaurants', name: 'Specialty Restaurants' }, { slug: 'cafes-coffee', name: 'Cafes & Coffee' },
      { slug: 'bakeries-desserts', name: 'Bakeries & Desserts' }, { slug: 'bars-pubs-nightlife', name: 'Bars, Pubs & Nightlife' },
      { slug: 'food-delivery-catering', name: 'Food Delivery & Catering' },
    ],
  },
  {
    key: 'home-services',
    l2Slug: 'home-services-contractors',
    l2Name: 'Home Services & Contractors',
    listingLabel: 'Services',
    listingItemNoun: 'service',
    listingViewAll: 'View all services',
    listingFormHint: 'Add the services you offer and starting prices.',
    primaryCtaLabel: 'Request a Quote',
    primaryCtaIcon: 'calendar',
    amenities: ['free_estimates', 'licensed_insured', 'emergency_service', 'financing', 'warranty', 'eco_friendly', 'credit_cards'],
    sampleItems: [{ name: 'Service Call / Diagnostic', price: '$89' }, { name: 'Standard Repair', price: '$$' }, { name: 'New Installation', price: '$$$' }, { name: 'Maintenance Plan', price: '$$' }],
    aiTopics: ['Professional', 'On time', 'Fair pricing', 'Quality work'],
    children: [
      { slug: 'plumbing', name: 'Plumbing' }, { slug: 'electrical', name: 'Electrical' }, { slug: 'hvac-climate-control', name: 'HVAC & Climate Control' },
      { slug: 'cleaning-services', name: 'Cleaning Services' }, { slug: 'pest-wildlife-control', name: 'Pest & Wildlife Control' },
      { slug: 'landscaping-lawn-care', name: 'Landscaping & Lawn Care' }, { slug: 'roofing-exterior', name: 'Roofing & Exterior' },
      { slug: 'construction-remodeling', name: 'Construction & Remodeling' }, { slug: 'interior-specialists', name: 'Interior Specialists' },
      { slug: 'handyman-repairs', name: 'Handyman & Repairs' }, { slug: 'restoration-damage', name: 'Restoration & Damage' }, { slug: 'pool-outdoor', name: 'Pool & Outdoor' },
    ],
  },
  {
    key: 'health',
    l2Slug: 'health-medical',
    l2Name: 'Health & Medical',
    listingLabel: 'Services',
    listingItemNoun: 'service',
    listingViewAll: 'View all services',
    listingFormHint: 'List the services or treatments you provide.',
    primaryCtaLabel: 'Book Appointment',
    primaryCtaIcon: 'calendar',
    amenities: ['accepts_insurance', 'telehealth', 'new_patients', 'by_appointment', 'wheelchair', 'parking', 'credit_cards'],
    sampleItems: [{ name: 'New Patient Visit', price: '$$' }, { name: 'Consultation', price: '$$' }, { name: 'Follow-up Visit', price: '$' }, { name: 'Preventive Care', price: '$$' }],
    aiTopics: ['Caring staff', 'Short wait', 'Thorough', 'Professional'],
    children: [
      { slug: 'doctors-clinics', name: 'Doctors & Clinics' }, { slug: 'specialists', name: 'Specialists' }, { slug: 'dental', name: 'Dental' },
      { slug: 'vision-eye-care', name: 'Vision & Eye Care' }, { slug: 'mental-health-therapy', name: 'Mental Health & Therapy' },
      { slug: 'alternative-holistic-care', name: 'Alternative & Holistic Care' }, { slug: 'physical-therapy-rehab', name: 'Physical Therapy & Rehab' },
      { slug: 'hospitals-facilities', name: 'Hospitals & Facilities' }, { slug: 'pharmacy-supplies', name: 'Pharmacy & Supplies' },
      { slug: 'senior-home-care', name: 'Senior & Home Care' }, { slug: 'weight-loss-wellness', name: 'Weight Loss & Wellness' },
    ],
  },
  {
    key: 'automotive',
    l2Slug: 'automotive',
    l2Name: 'Automotive',
    listingLabel: 'Services',
    listingItemNoun: 'service',
    listingViewAll: 'View all services',
    listingFormHint: 'Add the services you offer and starting prices.',
    primaryCtaLabel: 'Book Service',
    primaryCtaIcon: 'calendar',
    amenities: ['free_estimates', 'credit_cards', 'financing', 'warranty', 'loaner_cars', 'wheelchair'],
    sampleItems: [{ name: 'Oil Change', price: '$49' }, { name: 'Brake Service', price: '$$' }, { name: 'Tire Rotation', price: '$25' }, { name: 'Diagnostics', price: '$89' }],
    aiTopics: ['Honest', 'Fair pricing', 'Fast turnaround', 'Quality work'],
    children: [
      { slug: 'auto-repair', name: 'Auto Repair' }, { slug: 'car-dealers', name: 'Car Dealers' }, { slug: 'auto-services', name: 'Auto Services' },
      { slug: 'auto-rental-sharing', name: 'Auto Rental & Sharing' }, { slug: 'auto-parts-accessories', name: 'Auto Parts & Accessories' }, { slug: 'fuel-charging', name: 'Fuel & Charging' },
    ],
  },
  {
    key: 'beauty',
    l2Slug: 'beauty-personal-care',
    l2Name: 'Beauty & Personal Care',
    listingLabel: 'Services',
    listingItemNoun: 'service',
    listingViewAll: 'View all services',
    listingFormHint: 'Add your services and prices.',
    primaryCtaLabel: 'Book Now',
    primaryCtaIcon: 'calendar',
    amenities: ['by_appointment', 'walk_ins', 'credit_cards', 'wifi', 'parking', 'wheelchair', 'gift_cards'],
    sampleItems: [{ name: 'Haircut', price: '$35' }, { name: 'Color', price: '$85' }, { name: 'Manicure', price: '$25' }, { name: 'Facial', price: '$70' }],
    aiTopics: ['Skilled', 'Relaxing', 'Friendly staff', 'Great value'],
    children: [
      { slug: 'hair-salons', name: 'Hair Salons' }, { slug: 'barbershops', name: 'Barbershops' }, { slug: 'nail-salons', name: 'Nail Salons' },
      { slug: 'skincare-facials', name: 'Skincare & Facials' }, { slug: 'spas-massage', name: 'Spas & Massage' }, { slug: 'specialty-beauty', name: 'Specialty Beauty' },
    ],
  },
  {
    key: 'retail',
    l2Slug: 'shopping-retail',
    l2Name: 'Shopping & Retail',
    listingLabel: 'Featured Products',
    listingItemNoun: 'product',
    listingViewAll: 'View all products',
    listingFormHint: 'Showcase your featured products and prices.',
    primaryCtaLabel: 'Shop Now',
    primaryCtaIcon: 'bag',
    amenities: ['in_store_pickup', 'curbside', 'returns_accepted', 'credit_cards', 'wifi', 'parking', 'wheelchair', 'gift_cards'],
    sampleItems: [{ name: 'Best Seller', price: '$$' }, { name: 'New Arrival', price: '$$' }, { name: 'Staff Pick', price: '$' }, { name: 'Gift Card', price: '$$' }],
    aiTopics: ['Great selection', 'Helpful staff', 'Good prices', 'Quality'],
    children: [
      { slug: 'apparel-accessories', name: 'Apparel & Accessories' }, { slug: 'department-general', name: 'Department & General' },
      { slug: 'grocery-food-shopping', name: 'Grocery & Food Shopping' }, { slug: 'home-furniture', name: 'Home & Furniture' },
      { slug: 'home-improvement', name: 'Home Improvement' }, { slug: 'electronics-tech', name: 'Electronics & Tech' }, { slug: 'hobby-specialty', name: 'Hobby & Specialty' },
    ],
  },
  {
    key: 'fitness',
    l2Slug: 'active-life-fitness',
    l2Name: 'Active Life & Fitness',
    listingLabel: 'Classes & Memberships',
    listingItemNoun: 'class',
    listingViewAll: 'View all classes',
    listingFormHint: 'Add classes, day passes and memberships.',
    primaryCtaLabel: 'Book a Class',
    primaryCtaIcon: 'calendar',
    amenities: ['free_trial', 'personal_training', 'showers', 'lockers', 'parking', 'wheelchair', 'credit_cards'],
    sampleItems: [{ name: 'Day Pass', price: '$20' }, { name: 'Monthly Membership', price: '$59' }, { name: 'Personal Training', price: '$65' }, { name: 'Group Class', price: '$18' }],
    aiTopics: ['Motivating', 'Clean', 'Great trainers', 'Welcoming'],
    children: [
      { slug: 'gyms-fitness-centers', name: 'Gyms & Fitness Centers' }, { slug: 'studios-classes', name: 'Studios & Classes' },
      { slug: 'personal-training', name: 'Personal Training' }, { slug: 'sports-recreation', name: 'Sports & Recreation' }, { slug: 'outdoor-adventure', name: 'Outdoor Adventure' },
    ],
  },
  {
    key: 'pets',
    l2Slug: 'pets-animals',
    l2Name: 'Pets & Animals',
    listingLabel: 'Services',
    listingItemNoun: 'service',
    listingViewAll: 'View all services',
    listingFormHint: 'Add the services you offer and prices.',
    primaryCtaLabel: 'Book Now',
    primaryCtaIcon: 'calendar',
    amenities: ['walk_ins', 'emergency_service', 'by_appointment', 'credit_cards', 'parking', 'wheelchair'],
    sampleItems: [{ name: 'Grooming', price: '$55' }, { name: 'Boarding (per night)', price: '$40' }, { name: 'Wellness Exam', price: '$50' }, { name: 'Vaccination', price: '$30' }],
    aiTopics: ['Caring', 'Gentle', 'Professional', 'Great value'],
    children: [
      { slug: 'veterinary-care', name: 'Veterinary Care' }, { slug: 'pet-services', name: 'Pet Services' },
      { slug: 'pet-retail', name: 'Pet Retail' }, { slug: 'animal-welfare', name: 'Animal Welfare' },
    ],
  },
  {
    key: 'education',
    l2Slug: 'education-childcare',
    l2Name: 'Education & Childcare',
    listingLabel: 'Programs',
    listingItemNoun: 'program',
    listingViewAll: 'View all programs',
    listingFormHint: 'Add your programs, classes and enrollment options.',
    primaryCtaLabel: 'Enroll Now',
    primaryCtaIcon: 'calendar',
    amenities: ['certified_staff', 'by_appointment', 'financing', 'family_friendly', 'parking', 'wheelchair'],
    sampleItems: [{ name: 'Free Assessment', price: 'Free' }, { name: 'Group Class', price: '$$' }, { name: '1-on-1 Tutoring', price: '$$' }, { name: 'Summer Program', price: '$$$' }],
    aiTopics: ['Caring teachers', 'Great results', 'Safe', 'Engaging'],
    children: [
      { slug: 'childcare', name: 'Childcare' }, { slug: 'k-12-schools', name: 'K-12 Schools' }, { slug: 'tutoring-test-prep', name: 'Tutoring & Test Prep' },
      { slug: 'arts-music-lessons', name: 'Arts & Music Lessons' }, { slug: 'specialty-schools', name: 'Specialty Schools' }, { slug: 'libraries-centers', name: 'Libraries & Centers' },
    ],
  },
  {
    key: 'events',
    l2Slug: 'event-services-planning',
    l2Name: 'Event Services & Planning',
    listingLabel: 'Packages',
    listingItemNoun: 'package',
    listingViewAll: 'View all packages',
    listingFormHint: 'Add your packages and services.',
    primaryCtaLabel: 'Request a Quote',
    primaryCtaIcon: 'calendar',
    amenities: ['by_appointment', 'free_consultation', 'financing', 'credit_cards'],
    sampleItems: [{ name: 'Consultation', price: 'Free' }, { name: 'Half-Day Package', price: '$$' }, { name: 'Full-Day Package', price: '$$$' }, { name: 'Custom Quote', price: '$$$' }],
    aiTopics: ['Organized', 'Creative', 'Responsive', 'Stress-free'],
    children: [
      { slug: 'event-planners', name: 'Event Planners' }, { slug: 'venues', name: 'Venues' }, { slug: 'photography-video', name: 'Photography & Video' },
      { slug: 'music-entertainment', name: 'Music & Entertainment' }, { slug: 'rentals-decor', name: 'Rentals & Decor' },
    ],
  },
  {
    key: 'entertainment',
    l2Slug: 'entertainment-arts',
    l2Name: 'Entertainment & Arts',
    listingLabel: 'Highlights',
    listingItemNoun: 'experience',
    listingViewAll: "See what's on",
    listingFormHint: 'Add featured experiences, shows or admissions.',
    primaryCtaLabel: 'Buy Tickets',
    primaryCtaIcon: 'ticket',
    amenities: ['family_friendly', 'parking', 'wheelchair', 'credit_cards', 'wifi'],
    sampleItems: [{ name: 'General Admission', price: '$$' }, { name: 'Group Rate', price: '$$' }, { name: 'Membership', price: '$$$' }, { name: 'Private Event', price: '$$$' }],
    aiTopics: ['Fun', 'Great value', 'Family friendly', 'Well run'],
    children: [
      { slug: 'movies-theater', name: 'Movies & Theater' }, { slug: 'museums-galleries', name: 'Museums & Galleries' },
      { slug: 'family-entertainment', name: 'Family Entertainment' }, { slug: 'live-music-venues', name: 'Live Music & Venues' }, { slug: 'gambling-casino', name: 'Gambling & Casino' },
    ],
  },
  {
    key: 'travel',
    l2Slug: 'travel-hotels-transportation',
    l2Name: 'Travel, Hotels & Transportation',
    listingLabel: 'Rooms & Rates',
    listingItemNoun: 'option',
    listingViewAll: 'View all options',
    listingFormHint: 'Add rooms, rates or services.',
    primaryCtaLabel: 'Book Now',
    primaryCtaIcon: 'bed',
    amenities: ['wifi', 'parking', 'pet_friendly', 'air_conditioning', 'wheelchair', 'credit_cards'],
    sampleItems: [{ name: 'Standard Room', price: '$$' }, { name: 'Deluxe Room', price: '$$$' }, { name: 'Suite', price: '$$$' }, { name: 'Extended Stay', price: '$$' }],
    aiTopics: ['Clean', 'Comfortable', 'Great location', 'Friendly staff'],
    children: [
      { slug: 'lodging', name: 'Lodging' }, { slug: 'travel-services', name: 'Travel Services' },
      { slug: 'public-transportation', name: 'Public Transportation' }, { slug: 'moving-storage', name: 'Moving & Storage' },
    ],
  },
  {
    key: 'real-estate',
    l2Slug: 'real-estate',
    l2Name: 'Real Estate',
    listingLabel: 'Listings & Services',
    listingItemNoun: 'service',
    listingViewAll: 'View all services',
    listingFormHint: 'Add your services or featured listings.',
    primaryCtaLabel: 'Contact Agent',
    primaryCtaIcon: 'phone',
    amenities: ['by_appointment', 'free_consultation', 'credit_cards', 'parking', 'wheelchair'],
    sampleItems: [{ name: 'Buyer Consultation', price: 'Free' }, { name: 'Home Valuation', price: 'Free' }, { name: 'Listing Service', price: '$$$' }, { name: 'Property Management', price: '$$' }],
    aiTopics: ['Knowledgeable', 'Responsive', 'Trustworthy', 'Smooth process'],
    children: [
      { slug: 'buying-selling', name: 'Buying & Selling' }, { slug: 'renting-leasing', name: 'Renting & Leasing' }, { slug: 'real-estate-services-local', name: 'Real Estate Services' },
    ],
  },
  {
    key: 'community',
    l2Slug: 'religious-community-public',
    l2Name: 'Religious, Community & Public',
    listingLabel: 'Programs & Services',
    listingItemNoun: 'program',
    listingViewAll: 'View all programs',
    listingFormHint: 'Add your programs and services.',
    primaryCtaLabel: 'Get in Touch',
    primaryCtaIcon: 'phone',
    amenities: ['family_friendly', 'wheelchair', 'parking', 'wifi'],
    sampleItems: [{ name: 'Weekly Service', price: 'Free' }, { name: 'Community Program', price: 'Free' }, { name: 'Volunteer Program', price: 'Free' }, { name: 'Youth Group', price: 'Free' }],
    aiTopics: ['Welcoming', 'Inclusive', 'Well organized', 'Friendly'],
    children: [
      { slug: 'places-of-worship', name: 'Places of Worship' }, { slug: 'government-offices', name: 'Government Offices' },
      { slug: 'public-safety', name: 'Public Safety' }, { slug: 'community-services', name: 'Community Services' },
    ],
  },
  {
    key: 'financial',
    l2Slug: 'financial-insurance',
    l2Name: 'Financial & Insurance',
    listingLabel: 'Services',
    listingItemNoun: 'service',
    listingViewAll: 'View all services',
    listingFormHint: 'Add the services you offer.',
    primaryCtaLabel: 'Get a Quote',
    primaryCtaIcon: 'calendar',
    amenities: ['by_appointment', 'free_consultation', 'credit_cards', 'parking', 'wheelchair'],
    sampleItems: [{ name: 'Free Consultation', price: 'Free' }, { name: 'Account Opening', price: 'Free' }, { name: 'Loan Application', price: '$' }, { name: 'Advisory Service', price: '$$' }],
    aiTopics: ['Helpful', 'Trustworthy', 'Professional', 'Responsive'],
    children: [
      { slug: 'banks-credit-unions', name: 'Banks & Credit Unions' }, { slug: 'insurance', name: 'Insurance' }, { slug: 'lending-loans', name: 'Lending & Loans' },
    ],
  },
  {
    key: 'media',
    l2Slug: 'media-printing-signage',
    l2Name: 'Media, Printing & Signage',
    listingLabel: 'Services',
    listingItemNoun: 'service',
    listingViewAll: 'View all services',
    listingFormHint: 'Add the services you offer and starting prices.',
    primaryCtaLabel: 'Request a Quote',
    primaryCtaIcon: 'calendar',
    amenities: ['free_estimates', 'rush_service', 'credit_cards', 'parking', 'wheelchair'],
    sampleItems: [{ name: 'Business Cards', price: '$' }, { name: 'Banners & Signs', price: '$$' }, { name: 'Custom Printing', price: '$$' }, { name: 'Design Service', price: '$$' }],
    aiTopics: ['Fast', 'Quality', 'Fair pricing', 'Helpful'],
    children: [
      { slug: 'printing', name: 'Printing' }, { slug: 'signage', name: 'Signage' }, { slug: 'local-media', name: 'Local Media' },
    ],
  },
  {
    key: 'funeral',
    l2Slug: 'funeral-end-of-life-services',
    l2Name: 'Funeral & End-of-Life Services',
    listingLabel: 'Services',
    listingItemNoun: 'service',
    listingViewAll: 'View all services',
    listingFormHint: 'Add the services you offer.',
    primaryCtaLabel: 'Contact Us',
    primaryCtaIcon: 'phone',
    amenities: ['by_appointment', 'financing', 'credit_cards', 'wheelchair', 'parking'],
    sampleItems: [{ name: 'Consultation', price: 'Free' }, { name: 'Memorial Service', price: '$$$' }, { name: 'Cremation Service', price: '$$' }, { name: 'Pre-Planning', price: '$' }],
    aiTopics: ['Compassionate', 'Professional', 'Supportive', 'Respectful'],
    children: [{ slug: 'funeral-services', name: 'Funeral Services' }],
  },
]

/* Generic fallback — used when a local business has no recognised vertical
   (e.g. categorised directly at the L1, or a future vertical not yet mapped). */
export const GENERIC_VERTICAL: LBVertical = {
  key: 'generic',
  l2Slug: '',
  l2Name: 'Local Business',
  listingLabel: 'Services',
  listingItemNoun: 'service',
  listingViewAll: 'View all services',
  listingFormHint: 'Add the services or products you offer.',
  primaryCtaLabel: 'Contact',
  primaryCtaIcon: 'phone',
  amenities: ['credit_cards', 'wifi', 'parking', 'wheelchair', 'by_appointment'],
  sampleItems: [{ name: 'Consultation', price: 'Free' }, { name: 'Standard Service', price: '$$' }, { name: 'Premium Service', price: '$$$' }, { name: 'Custom Quote', price: '$$$' }],
  aiTopics: ['Professional', 'Friendly', 'Great value', 'Responsive'],
  children: [],
}

/* slug → vertical index. Includes each vertical's L2 slug AND its L3 children,
   so both the form (selected slug) and the profile (any crumb) resolve. */
const SLUG_INDEX: Record<string, LBVertical> = (() => {
  const idx: Record<string, LBVertical> = {}
  for (const v of LB_VERTICALS) {
    idx[v.l2Slug] = v
    for (const c of v.children) idx[c.slug] = v
  }
  return idx
})()

/** Resolve the vertical from a single category slug (L2 or L3). */
export function verticalForSlug(slug: string | null | undefined): LBVertical {
  return (slug && SLUG_INDEX[slug]) || GENERIC_VERTICAL
}

/** Resolve the vertical from a breadcrumb trail (L1 → leaf). Matches the first
 *  crumb whose slug is a known L2/L3 — works at any depth (incl. L4 leaves,
 *  whose L2/L3 ancestors are always present in the trail). */
export function verticalForBreadcrumb(
  crumbs: { slug?: string }[] | null | undefined,
): LBVertical {
  if (Array.isArray(crumbs)) {
    for (const c of crumbs) {
      const v = c?.slug ? SLUG_INDEX[c.slug] : undefined
      if (v) return v
    }
  }
  return GENERIC_VERTICAL
}
