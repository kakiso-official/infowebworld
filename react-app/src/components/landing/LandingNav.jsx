import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

/* ── Search suggestions database ── */
const allSuggestions = [
  { name: 'CloudSync Pro', cat: 'Technology', rating: '4.9', color: 'var(--accent)', icon: <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /> },
  { name: 'The Garden Table', cat: 'Restaurant', rating: '4.9', color: 'var(--coral)', icon: <><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /></> },
  { name: 'MindBridge Wellness', cat: 'Healthcare', rating: '4.8', color: 'var(--emerald)', icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2" /> },
  { name: 'BrightPath Academy', cat: 'Education', rating: '4.8', color: 'var(--teal)', icon: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></> },
  { name: 'UrbanNest Realty', cat: 'Real Estate', rating: '4.7', color: 'var(--azure)', icon: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></> },
  { name: 'PrecisionFix Plumbing', cat: 'Home Services', rating: '4.9', color: 'var(--amber)', icon: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /> },
  { name: 'Summit Legal Group', cat: 'Legal', rating: '4.7', color: 'var(--plum)', icon: <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" /></> },
  { name: 'CreativeForge Studio', cat: 'Marketing', rating: '4.7', color: 'var(--rose)', icon: <><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /></> },
  { name: 'NovaByte Analytics', cat: 'Technology', rating: '4.8', color: 'var(--accent)', icon: <><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></> },
  { name: 'FreshBite Catering', cat: 'Restaurant', rating: '4.8', color: 'var(--coral)', icon: <><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /></> },
]

const categorySuggestions = [
  { name: 'Technology & SaaS', slug: 'technology', color: 'var(--accent)' },
  { name: 'Restaurants & Food', slug: 'restaurants', color: 'var(--coral)' },
  { name: 'Healthcare & Wellness', slug: 'healthcare', color: 'var(--emerald)' },
  { name: 'Real Estate', slug: 'real-estate', color: 'var(--azure)' },
  { name: 'Home Services', slug: 'home-services', color: 'var(--amber)' },
  { name: 'Education & Training', slug: 'education', color: 'var(--teal)' },
  { name: 'Legal & Financial', slug: 'legal', color: 'var(--plum)' },
  { name: 'Marketing & Creative', slug: 'marketing', color: 'var(--rose)' },
]

const trendingSearches = ['Restaurants', 'SaaS Tools', 'Marketing Agency', 'Real Estate', 'Healthcare']

/* ── Category strip data — 5 levels deep, 200+ categories ── */
const stripCats = [
  { name: 'Technology', slug: 'technology-saas', color: '#4361EE', tree: [
    { n: 'SaaS Platforms', c: [{ n: 'CRM Software', c: [{ n: 'Sales CRM', c: ['Enterprise', 'SMB', 'Startup', 'Freelancer'] }, { n: 'Marketing CRM', c: ['Email Automation', 'Lead Scoring', 'Campaign Mgmt'] }, 'Support CRM', 'Social CRM', 'Analytics CRM'] }, { n: 'ERP Solutions', c: ['Manufacturing ERP', 'Retail ERP', 'Healthcare ERP', 'Logistics ERP', 'Finance ERP'] }, { n: 'Project Management', c: [{ n: 'Agile Tools', c: ['Scrum Boards', 'Sprint Planning', 'Retrospectives'] }, 'Kanban', 'Time Tracking', 'Resource Planning', 'Gantt Charts'] }, 'Communication Tools', 'HR Software', 'Billing & Invoicing'] },
    { n: 'Cloud Infrastructure', c: [{ n: 'Compute', c: ['Virtual Machines', 'Containers', 'Serverless', 'GPU Instances', 'Edge Computing'] }, { n: 'Storage', c: ['Object Storage', 'Block Storage', 'CDN', 'Backup Solutions'] }, { n: 'Networking', c: ['Load Balancers', 'DNS', 'VPN', 'Firewalls'] }, 'Monitoring', 'DevOps Pipelines', 'Kubernetes'] },
    { n: 'AI & Machine Learning', c: [{ n: 'NLP Tools', c: ['Chatbots', 'Sentiment Analysis', 'Translation', 'Summarization', 'Voice AI'] }, { n: 'Computer Vision', c: ['Image Recognition', 'OCR', 'Video Analytics'] }, 'ML Platforms', 'Data Labeling', 'AI APIs', 'AutoML'] },
    { n: 'Cybersecurity', c: [{ n: 'Endpoint Security', c: ['Antivirus', 'EDR', 'MDM', 'DLP'] }, { n: 'Network Security', c: ['Firewalls', 'IDS/IPS', 'Zero Trust'] }, 'Cloud Security', 'Identity & Access', 'Penetration Testing', 'SIEM'] },
    { n: 'Data Analytics', c: [{ n: 'BI Dashboards', c: ['Tableau', 'Power BI', 'Looker', 'Metabase'] }, 'ETL Pipelines', { n: 'Visualization', c: ['Charts', 'Geospatial', 'Real-time', 'Embedded'] }, 'Data Warehouses', 'Data Lakes', 'Data Governance'] },
    { n: 'Developer Tools', c: [{ n: 'IDEs & Editors', c: ['VS Code', 'JetBrains', 'Vim/Neovim'] }, { n: 'Version Control', c: ['GitHub', 'GitLab', 'Bitbucket'] }, 'CI/CD', 'Testing Tools', 'API Management', 'Documentation'] },
    { n: 'IoT & Hardware', c: ['Smart Sensors', 'Industrial IoT', { n: 'Wearables', c: ['Fitness Trackers', 'Smartwatches', 'Medical Devices'] }, 'Robotics', '3D Printing'] },
  ]},
  { name: 'Restaurants', slug: 'restaurants-food', color: '#E8553D', tree: [
    { n: 'Fine Dining', c: [{ n: 'French Cuisine', c: ['Michelin Star', 'Bistros', 'Wine Bars', 'Patisseries'] }, { n: 'Italian', c: ['Trattoria', 'Osteria', 'Pizzeria Gourmet'] }, 'Japanese Omakase', 'Steakhouses', 'Seafood', 'Farm-to-Table'] },
    { n: 'Casual Dining', c: [{ n: 'American', c: ['Burgers', 'BBQ', 'Diners', 'Wings', 'Mac & Cheese'] }, { n: 'Mexican', c: ['Tacos', 'Burritos', 'Tex-Mex', 'Cantinas'] }, { n: 'Asian', c: ['Chinese', 'Thai', 'Vietnamese', 'Korean', 'Indian'] }, 'Mediterranean', 'Greek'] },
    { n: 'Cafes & Bakeries', c: [{ n: 'Coffee Shops', c: ['Specialty Coffee', 'Espresso Bars', 'Cold Brew'] }, 'Artisan Bakeries', { n: 'Tea Houses', c: ['Matcha Bars', 'Bubble Tea', 'Herbal Tea'] }, 'Dessert Bars', 'Brunch Spots', 'Juice Bars'] },
    { n: 'Fast Food', c: ['Pizza Chains', 'Burger Joints', 'Chicken', 'Subs & Wraps', 'Taco Stands', 'Poke Bowls', 'Shawarma'] },
    { n: 'Catering', c: [{ n: 'Events', c: ['Corporate Events', 'Weddings', 'Birthday Parties', 'Galas'] }, 'Private Chefs', 'Food Trucks', 'Meal Prep Services', 'Buffet Services'] },
    { n: 'Bars & Nightlife', c: [{ n: 'Cocktail Bars', c: ['Speakeasy', 'Rooftop', 'Tiki Bars'] }, 'Wine Bars', 'Craft Beer', 'Pubs', 'Lounges', 'Karaoke'] },
    { n: 'Delivery & Ghost Kitchens', c: ['Cloud Kitchens', 'Meal Kits', 'Grocery Delivery', 'Late Night Delivery'] },
  ]},
  { name: 'Healthcare', slug: 'healthcare-wellness', color: '#2FAE6A', tree: [
    { n: 'Clinics & Hospitals', c: [{ n: 'General Practice', c: ['Family Medicine', 'Internal Med', 'Pediatrics', 'Geriatrics'] }, { n: 'Urgent Care', c: ['Walk-In Clinics', '24-Hour ER', 'Telehealth'] }, { n: 'Specialty Clinics', c: ['Cardiology', 'Orthopedics', 'Dermatology', 'ENT', 'Ophthalmology'] }, 'Surgery Centers', 'Rehabilitation'] },
    { n: 'Mental Health', c: [{ n: 'Therapy', c: ['CBT', 'Couples Therapy', 'Group Sessions', 'EMDR', 'Art Therapy'] }, 'Psychiatry', 'Counseling', 'Addiction Recovery', 'Eating Disorders', 'Child Psychology'] },
    { n: 'Dental Care', c: ['General Dentistry', 'Orthodontics', { n: 'Cosmetic', c: ['Veneers', 'Whitening', 'Implants', 'Bonding'] }, 'Pediatric Dental', 'Oral Surgery', 'Periodontics'] },
    { n: 'Alternative Medicine', c: ['Chiropractic', 'Acupuncture', { n: 'Naturopathy', c: ['Herbal', 'Homeopathy', 'Functional Medicine'] }, 'Ayurveda', 'Osteopathy', 'Reiki'] },
    { n: 'Pharmacies', c: ['Retail Pharmacies', 'Compounding', 'Online Pharmacy', 'Specialty', 'Pet Pharmacy'] },
    { n: 'Medical Devices', c: ['Prosthetics', 'Hearing Aids', 'Mobility Aids', 'Monitoring Devices', 'Respiratory'] },
    { n: 'Wellness & Prevention', c: [{ n: 'Nutrition', c: ['Dietitians', 'Meal Plans', 'Supplements'] }, 'Health Screening', 'Vaccination Centers', 'Sleep Clinics'] },
  ]},
  { name: 'Real Estate', slug: 'real-estate', color: '#3B82F6', tree: [
    { n: 'Residential', c: [{ n: 'Buying', c: ['Houses', 'Condos', 'Townhouses', 'Luxury', 'Foreclosures', 'Auctions'] }, { n: 'Renting', c: ['Apartments', 'Studios', 'Shared Living', 'Short-Term', 'Student Housing'] }, 'New Construction', 'Tiny Homes', 'Vacation Homes'] },
    { n: 'Commercial', c: [{ n: 'Office Space', c: ['Traditional', 'Coworking', 'Virtual', 'Executive Suites'] }, { n: 'Retail', c: ['Storefronts', 'Malls', 'Pop-Up Shops'] }, 'Industrial', 'Warehouses', 'Mixed-Use'] },
    { n: 'Property Management', c: ['Residential Mgmt', 'HOA Services', 'Maintenance', 'Tenant Screening', 'Rent Collection', 'Eviction Services'] },
    { n: 'Mortgages & Loans', c: ['Fixed Rate', 'Adjustable', 'FHA Loans', { n: 'Refinancing', c: ['Cash-out', 'Rate & Term', 'Streamline'] }, 'VA Loans', 'Jumbo Loans'] },
    { n: 'Interior Design', c: [{ n: 'Styles', c: ['Modern', 'Minimalist', 'Industrial', 'Scandinavian', 'Bohemian'] }, 'Staging', 'Renovation', 'Kitchen & Bath', 'Smart Home Design'] },
    { n: 'Land & Development', c: ['Raw Land', 'Zoning Consulting', 'Subdivisions', 'Environmental Assessment'] },
    { n: 'Appraisal & Inspection', c: ['Home Inspection', 'Appraisals', 'Radon Testing', 'Pest Inspection', 'Roof Inspection'] },
  ]},
  { name: 'Legal', slug: 'legal-financial', color: '#8B5CF6', tree: [
    { n: 'Corporate Law', c: [{ n: 'Business Formation', c: ['LLC', 'Corporation', 'Partnership', 'Sole Proprietor', 'Nonprofit'] }, { n: 'M&A', c: ['Due Diligence', 'Valuation', 'Integration'] }, 'Securities', 'Compliance', 'Governance'] },
    { n: 'Tax & Accounting', c: [{ n: 'Tax Preparation', c: ['Individual', 'Business', 'International', 'Estate Tax'] }, 'Bookkeeping', { n: 'Audit Services', c: ['Internal Audit', 'External Audit', 'Forensic'] }, 'Payroll', 'CFO Services'] },
    { n: 'Insurance', c: [{ n: 'Business Insurance', c: ['Liability', 'Property', "Worker's Comp", 'D&O', 'Cyber'] }, { n: 'Personal Insurance', c: ['Health', 'Life', 'Auto', 'Home', 'Umbrella'] }, 'Pet Insurance'] },
    { n: 'Intellectual Property', c: ['Patent Filing', 'Trademark', 'Copyright', 'Trade Secrets', 'IP Litigation', 'Licensing'] },
    { n: 'Litigation', c: ['Civil', 'Criminal Defense', { n: 'Family Law', c: ['Divorce', 'Custody', 'Adoption', 'Prenuptial', 'Mediation'] }, 'Personal Injury', 'Class Action', 'Employment Law'] },
    { n: 'Immigration', c: ['Work Visas', 'Green Cards', 'Citizenship', 'Asylum', 'Business Immigration', 'Student Visas'] },
    { n: 'Estate Planning', c: ['Wills', 'Trusts', 'Probate', 'Power of Attorney', 'Elder Law'] },
  ]},
  { name: 'Education', slug: 'education-training', color: '#14B8A6', tree: [
    { n: 'Online Courses', c: [{ n: 'Tech & Coding', c: ['Web Dev', 'Mobile Dev', 'Data Science', 'DevOps', 'Game Dev', 'Blockchain'] }, { n: 'Business', c: ['Entrepreneurship', 'Finance', 'Leadership', 'Strategy'] }, { n: 'Design', c: ['UI/UX', 'Graphic Design', '3D Modeling', 'Motion Graphics'] }, 'Languages', 'Music', 'Photography'] },
    { n: 'Tutoring', c: [{ n: 'K-12', c: ['Math', 'Science', 'English', 'History', 'Foreign Language'] }, { n: 'Test Prep', c: ['SAT', 'ACT', 'GRE', 'GMAT', 'LSAT', 'MCAT'] }, 'College Level', 'Special Needs', 'Homeschool Support'] },
    { n: 'Vocational', c: [{ n: 'Trade Schools', c: ['Welding', 'Electrician', 'Plumbing', 'Carpentry'] }, 'Certifications', { n: 'Healthcare Training', c: ['Nursing', 'EMT', 'Phlebotomy', 'Medical Coding'] }, 'IT Bootcamps', 'Culinary Schools'] },
    { n: 'Language Schools', c: ['English (ESL)', 'Spanish', 'Mandarin', { n: 'European', c: ['French', 'German', 'Italian', 'Portuguese'] }, { n: 'Asian', c: ['Japanese', 'Korean', 'Hindi', 'Arabic'] }] },
    { n: 'Early Childhood', c: ['Preschools', 'Daycare', 'Montessori', 'After-School Programs', 'Summer Camps', 'Nanny Services'] },
    { n: 'Higher Education', c: [{ n: 'Universities', c: ['Public', 'Private', 'Online', 'Community College'] }, 'MBA Programs', 'Law Schools', 'Medical Schools', 'Study Abroad'] },
    { n: 'Corporate Training', c: ['Leadership Development', 'Compliance Training', 'Sales Training', 'DEI Programs', 'Team Building'] },
  ]},
  { name: 'Marketing', slug: 'marketing-creative', color: '#EC4899', tree: [
    { n: 'Digital Marketing', c: [{ n: 'SEO', c: ['On-Page', 'Off-Page', 'Technical', 'Local SEO', 'E-commerce SEO', 'International'] }, { n: 'PPC', c: ['Google Ads', 'Meta Ads', 'LinkedIn Ads', 'TikTok Ads', 'Retargeting'] }, { n: 'Email Marketing', c: ['Newsletters', 'Drip Campaigns', 'Transactional', 'A/B Testing'] }, 'Affiliate', 'CRO'] },
    { n: 'Branding', c: [{ n: 'Logo Design', c: ['Wordmark', 'Lettermark', 'Icon', 'Emblem'] }, 'Brand Strategy', 'Visual Identity', { n: 'Packaging', c: ['Product', 'Retail', 'Luxury', 'Eco-Friendly'] }, 'Naming Services'] },
    { n: 'Content Creation', c: [{ n: 'Video Production', c: ['Corporate', 'Social Media', 'Animation', 'Explainer', 'Documentary'] }, { n: 'Copywriting', c: ['Website Copy', 'Blog Posts', 'Scripts', 'Technical Writing'] }, 'Photography', 'Podcasting', 'Illustration'] },
    { n: 'Social Media', c: [{ n: 'Management', c: ['Strategy', 'Scheduling', 'Engagement', 'Analytics'] }, { n: 'Influencer Marketing', c: ['Micro', 'Macro', 'Celebrity', 'B2B Influencers'] }, 'Community Building', 'UGC'] },
    { n: 'PR & Comms', c: ['Press Releases', 'Media Relations', 'Crisis Management', 'Event PR', 'Thought Leadership', 'Awards Submissions'] },
    { n: 'Web Design', c: [{ n: 'Website Design', c: ['Landing Pages', 'Corporate', 'E-commerce', 'Portfolio'] }, 'UI/UX Design', 'Webflow', 'WordPress', 'Shopify'] },
    { n: 'Growth & Analytics', c: ['Conversion Optimization', 'Marketing Automation', 'Attribution', 'Customer Journey', 'Competitive Intelligence'] },
  ]},
  { name: 'Home Services', slug: 'home-services', color: '#F59E0B', tree: [
    { n: 'Plumbing & HVAC', c: [{ n: 'Plumbing', c: ['Repairs', 'Installation', 'Drain Cleaning', 'Sewer Line', 'Water Filtration'] }, { n: 'HVAC', c: ['AC Repair', 'Heating', 'Duct Cleaning', 'Mini Splits', 'Thermostats'] }, 'Water Heaters', 'Gas Lines'] },
    { n: 'Electrical', c: [{ n: 'Residential', c: ['Wiring', 'Panel Upgrades', 'Outlets', 'Ceiling Fans'] }, 'Lighting', { n: 'Smart Home', c: ['Automation', 'Security Systems', 'Audio/Video', 'Smart Locks'] }, 'Generator Install', 'EV Chargers'] },
    { n: 'Cleaning', c: [{ n: 'Residential', c: ['Deep Clean', 'Regular', 'Move In/Out', 'Post-Construction'] }, { n: 'Commercial', c: ['Office', 'Retail', 'Medical'] }, 'Carpet Cleaning', 'Window Washing', 'Pressure Washing'] },
    { n: 'Landscaping', c: [{ n: 'Lawn Care', c: ['Mowing', 'Fertilizing', 'Aeration', 'Weed Control'] }, 'Garden Design', 'Tree Services', { n: 'Hardscaping', c: ['Patios', 'Driveways', 'Retaining Walls', 'Fencing'] }, 'Irrigation'] },
    { n: 'Moving & Storage', c: ['Local Moving', 'Long Distance', 'International', 'Packing Services', 'Self Storage', 'Climate Controlled', 'Junk Removal'] },
    { n: 'Renovation', c: [{ n: 'Kitchen', c: ['Cabinets', 'Countertops', 'Appliances', 'Layout'] }, { n: 'Bathroom', c: ['Showers', 'Tubs', 'Vanities', 'Tiles'] }, 'Basement Finishing', 'Additions', 'Roofing', 'Windows & Doors'] },
    { n: 'Pest Control', c: ['Termites', 'Rodents', 'Bed Bugs', 'Mosquitoes', 'Wildlife Removal', 'Prevention'] },
  ]},
  { name: 'Automotive', slug: 'technology-saas', color: '#6B7280', tree: [
    { n: 'Car Dealerships', c: [{ n: 'New Cars', c: ['Sedans', 'SUVs', 'Trucks', 'Electric', 'Hybrids', 'Minivans'] }, { n: 'Used Cars', c: ['Certified Pre-Owned', 'Budget', 'Classic Cars'] }, { n: 'Luxury', c: ['BMW', 'Mercedes', 'Audi', 'Tesla', 'Porsche'] }, 'Commercial Vehicles'] },
    { n: 'Auto Repair', c: [{ n: 'General Mechanics', c: ['Oil Change', 'Tune-Up', 'Inspection'] }, 'Body Shops', { n: 'Specialty', c: ['Transmission', 'Brakes', 'Suspension', 'Exhaust', 'AC Repair'] }, 'Diagnostics', 'Roadside Assistance'] },
    { n: 'Car Care', c: ['Car Wash', { n: 'Detailing', c: ['Interior', 'Exterior', 'Ceramic Coating'] }, 'Tinting', 'Paint Protection', 'Rust Proofing'] },
    { n: 'Parts & Accessories', c: ['OEM Parts', 'Aftermarket', { n: 'Performance', c: ['Turbo Kits', 'Exhaust Systems', 'Suspension Lifts'] }, 'Audio & Tech', 'Tires & Wheels'] },
    { n: 'Rentals & Leasing', c: ['Short Term', 'Long Term', 'Luxury Rentals', 'Commercial Fleet', 'RV Rentals', 'Motorcycle Rentals'] },
    { n: 'Electric Vehicles', c: ['EV Dealers', 'Charging Stations', 'EV Maintenance', 'Battery Services', 'Conversion Kits'] },
    { n: 'Motorcycle & Powersports', c: ['Dealers', 'Repair', 'Gear & Apparel', 'ATV/UTV', 'Boats & Marine'] },
  ]},
  { name: 'Beauty', slug: 'restaurants-food', color: '#D4729A', tree: [
    { n: 'Hair Salons', c: [{ n: 'Women\'s', c: ['Cut & Style', 'Coloring', 'Extensions', 'Treatments', 'Keratin'] }, { n: 'Men\'s', c: ['Fades', 'Styling', 'Color'] }, 'Kids', 'Bridal', 'Afro Textured'] },
    { n: 'Spas', c: [{ n: 'Day Spas', c: ['Couples', 'Packages', 'Aromatherapy'] }, 'Medical Spas', { n: 'Massage', c: ['Swedish', 'Deep Tissue', 'Hot Stone', 'Thai', 'Sports'] }, 'Facials', 'Body Wraps', 'Hydrotherapy'] },
    { n: 'Nail Studios', c: ['Manicure', 'Pedicure', { n: 'Gel & Acrylics', c: ['Builder Gel', 'Dip Powder', 'Polygel'] }, 'Nail Art', 'Mobile Nail Services'] },
    { n: 'Skincare', c: ['Dermatology', 'Aesthetics', { n: 'Treatments', c: ['Chemical Peels', 'Microneedling', 'Laser', 'Botox', 'Fillers', 'PRP'] }, 'Products', 'Acne Treatment'] },
    { n: 'Barbershops', c: ['Classic Cuts', 'Beard Trimming', 'Hot Towel Shave', 'Grooming', 'Straight Razor', 'Kids Cuts'] },
    { n: 'Makeup & Cosmetics', c: ['Makeup Artists', 'Bridal Makeup', 'Special FX', 'Lash Extensions', 'Microblading', 'Permanent Makeup'] },
    { n: 'Tattoo & Piercing', c: ['Tattoo Studios', 'Piercing Shops', 'Tattoo Removal', 'Henna', 'Body Art'] },
  ]},
  { name: 'Fitness', slug: 'healthcare-wellness', color: '#5CB8A2', tree: [
    { n: 'Gyms', c: [{ n: 'Full-Service', c: ['24-Hour', 'Premium', 'Budget', 'Family'] }, 'Women-Only', 'Boutique', 'University', 'Hotel Gyms', 'Outdoor Gyms'] },
    { n: 'Yoga & Pilates', c: [{ n: 'Yoga', c: ['Hot Yoga', 'Vinyasa', 'Ashtanga', 'Yin', 'Aerial Yoga'] }, { n: 'Pilates', c: ['Reformer', 'Mat', 'Clinical'] }, { n: 'Meditation', c: ['Guided', 'Silent Retreats', 'Mindfulness Apps'] }, 'Barre'] },
    { n: 'Personal Training', c: ['In-Person', 'Online Coaching', 'Group Training', { n: 'Specialized', c: ['Bodybuilding', 'Weight Loss', 'Pre/Postnatal', 'Senior Fitness'] }, 'Nutrition Plans'] },
    { n: 'Combat Sports', c: ['Boxing', 'MMA', 'Muay Thai', { n: 'Martial Arts', c: ['Karate', 'Jiu-Jitsu', 'Taekwondo', 'Krav Maga', 'Kung Fu'] }, 'Wrestling', 'Fencing'] },
    { n: 'Outdoor & Adventure', c: [{ n: 'Climbing', c: ['Indoor Walls', 'Bouldering', 'Outdoor Guides'] }, { n: 'Water Sports', c: ['Swimming', 'Surfing', 'Kayaking', 'Paddleboarding'] }, 'Running Clubs', 'Cycling', 'Hiking Groups'] },
    { n: 'Dance', c: ['Ballet', 'Hip Hop', 'Salsa', 'Contemporary', 'Pole Fitness', 'Zumba'] },
    { n: 'Sports Leagues', c: ['Soccer', 'Basketball', 'Tennis', 'Volleyball', 'Softball', 'Pickleball'] },
  ]},
  { name: 'Finance', slug: 'real-estate', color: '#D4A028', tree: [
    { n: 'Banking', c: [{ n: 'Personal', c: ['Checking', 'Savings', 'Credit Cards', 'CDs', 'Money Market'] }, { n: 'Business Banking', c: ['Business Checking', 'Merchant Services', 'Lines of Credit'] }, 'Private Banking', 'Online Banks', 'Credit Unions'] },
    { n: 'Financial Planning', c: [{ n: 'Retirement', c: ['401k', 'IRA', 'Roth IRA', 'Pension'] }, 'Estate Planning', { n: 'Investment', c: ['Stocks', 'Bonds', 'Real Estate', 'Index Funds', 'ETFs', 'Options'] }, 'Tax Planning', 'College Savings'] },
    { n: 'Crypto & Web3', c: [{ n: 'Exchanges', c: ['Centralized', 'Decentralized', 'P2P'] }, 'Wallets', { n: 'DeFi', c: ['Lending', 'Staking', 'Yield Farming'] }, { n: 'NFT', c: ['Marketplaces', 'Collections', 'Tools'] }, 'DAO Services'] },
    { n: 'Lending', c: [{ n: 'Personal Loans', c: ['Secured', 'Unsecured', 'Consolidation'] }, 'Business Loans', 'Mortgages', 'Peer-to-Peer', 'Student Loans', 'Auto Loans'] },
    { n: 'Wealth Management', c: ['Family Office', 'Asset Allocation', 'Trust Services', 'Hedge Funds', 'Private Equity', 'Philanthropy'] },
    { n: 'FinTech', c: ['Payment Processing', 'Digital Wallets', 'Neobanks', 'RegTech', 'InsurTech', 'Robo-Advisors'] },
    { n: 'Accounting & Tax', c: [{ n: 'Tax Services', c: ['Individual', 'Business', 'International', 'Tax Relief'] }, 'Bookkeeping', 'Payroll', 'Forensic Accounting', 'Advisory'] },
  ]},
]

function highlightMatch(text, query) {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark className="ns-highlight">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}

export default function LandingNav() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(-1)
  const [hoveredCat, setHoveredCat] = useState(null)
  const [activeL2, setActiveL2] = useState(0)
  const [arrowLeft, setArrowLeft] = useState('50%')
  const hoverTimeout = useRef(null)
  const catStripRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const searchRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setDrawerOpen(false)
    setSearchOpen(false)
    setQuery('')
    document.body.style.overflow = ''
  }, [location])

  // Close search on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setSearchOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [searchOpen])

  // Detect country prefix from current URL (e.g. /en-in, /en-uk, /en-eu...)
  const countryMatch = location.pathname.match(/^(\/en-(?:in|eu|au|ca|uk))/)
  const countryPrefix = countryMatch ? countryMatch[1] : ''

  const open = () => { setDrawerOpen(true); document.body.style.overflow = 'hidden' }
  const close = () => { setDrawerOpen(false); document.body.style.overflow = '' }

  const toggleSearch = (e) => {
    e.preventDefault()
    setSearchOpen(prev => !prev)
    setQuery('')
    setActiveIdx(-1)
  }

  // Filter suggestions
  const q = query.trim().toLowerCase()
  const filtered = q.length > 0
    ? allSuggestions.filter(s =>
        s.name.toLowerCase().includes(q) || s.cat.toLowerCase().includes(q)
      ).slice(0, 5)
    : []
  const matchedCats = q.length > 0
    ? categorySuggestions.filter(c => c.name.toLowerCase().includes(q)).slice(0, 3)
    : []
  const showDropdown = searchOpen
  const totalResults = filtered.length + matchedCats.length

  const handleSearch = (e) => {
    e?.preventDefault()
    if (query.trim()) {
      setSearchOpen(false)
      navigate(`${countryPrefix}/search?q=${encodeURIComponent(query)}`)
    }
  }

  const goToResult = (name) => {
    setSearchOpen(false)
    navigate(`${countryPrefix}/search?q=${encodeURIComponent(name)}`)
  }

  const goToCategory = (slug) => {
    setSearchOpen(false)
    navigate(`${countryPrefix}/search?q=${encodeURIComponent(slug)}`)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(prev => Math.min(prev + 1, totalResults - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIdx >= 0 && activeIdx < filtered.length) {
        goToResult(filtered[activeIdx].name)
      } else if (activeIdx >= filtered.length && activeIdx < totalResults) {
        goToCategory(matchedCats[activeIdx - filtered.length].slug)
      } else {
        handleSearch()
      }
    }
  }

  const handleItemMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    e.currentTarget.style.setProperty('--mx', `${x}%`)
    e.currentTarget.style.setProperty('--my', `${y}%`)
  }

  useEffect(() => { setActiveIdx(-1) }, [query])

  const enterCat = (idx, e) => {
    clearTimeout(hoverTimeout.current); setHoveredCat(idx); setActiveL2(0)
    if (e?.currentTarget && catStripRef.current) {
      const stripRect = catStripRef.current.getBoundingClientRect()
      const itemRect = e.currentTarget.getBoundingClientRect()
      const pillCenter = itemRect.left + itemRect.width / 2
      const stripCenter = stripRect.left + stripRect.width / 2
      const offset = pillCenter - stripCenter
      // Arrow rotation: points from pill toward bubble center (which is at stripCenter)
      const rot = Math.atan2(40, -offset) * (180 / Math.PI) - 90 // 40px = vertical distance to bubble
      e.currentTarget.style.setProperty('--arrow-rot', `${rot}deg`)
      setArrowLeft(`${pillCenter - stripRect.left}px`)
    }
  }
  const leaveCat = () => { hoverTimeout.current = setTimeout(() => setHoveredCat(null), 200) }
  const enterMega = () => { clearTimeout(hoverTimeout.current) }
  const leaveMega = () => { hoverTimeout.current = setTimeout(() => setHoveredCat(null), 150) }

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
        <div className="container nav-inner">
          <Link to={countryPrefix || '/'} className="nav-logo">
            <img src="/logo/infowebworld-logo.png" alt="InfoWebWorld" />
          </Link>
          <div className="nav-links">
            <div className="mega-menu-wrapper">
              <Link to={`${countryPrefix}/category`} className="nav-link nav-link--has-menu">
                Categories <svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
              </Link>
              <div className="mega-menu">
                <div className="mega-menu-inner">
                <div className="mega-head">
                  <span className="mega-head-title">Browse Categories</span>
                  <Link to={`${countryPrefix}/category`} className="mega-head-all">View all <svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg></Link>
                </div>
                <div className="mega-grid">
                  {[
                    { slug: 'technology-saas', name: 'Technology', color: '#4361EE', count: '520+' },
                    { slug: 'restaurants-food', name: 'Restaurants', color: '#E8553D', count: '480+' },
                    { slug: 'healthcare-wellness', name: 'Healthcare', color: '#2FAE6A', count: '390+' },
                    { slug: 'real-estate', name: 'Real Estate', color: '#3B82F6', count: '350+' },
                    { slug: 'legal-financial', name: 'Legal', color: '#8B5CF6', count: '310+' },
                    { slug: 'education-training', name: 'Education', color: '#14B8A6', count: '280+' },
                    { slug: 'marketing-creative', name: 'Marketing', color: '#EC4899', count: '420+' },
                    { slug: 'home-services', name: 'Home Services', color: '#F59E0B', count: '360+' },
                  ].map((c, i) => (
                    <Link key={i} to={`${countryPrefix}/category?cat=${c.slug}`} className="mega-pill" style={{ '--mc': c.color, '--md': `${i * 40}ms` }}>
                      <span className="mega-pill-badge" style={{ background: c.color }}>{c.name}</span>
                      <span className="mega-pill-count">{c.count}</span>
                    </Link>
                  ))}
                </div>
              </div>
              </div>
            </div>
            <Link to={`${countryPrefix}/best-of`} className="nav-link">Featured</Link>
            <Link to={`${countryPrefix}/news`} className="nav-link">News</Link>
            <Link to={`${countryPrefix}/pricing`} className="nav-link">Pricing</Link>
            <div className="nav-country-wrapper">
              <button className="nav-link nav-link--has-menu nav-country-btn">
                <svg className="nav-country-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                {countryPrefix === '/en-in' ? 'India' : countryPrefix === '/en-eu' ? 'Europe' : countryPrefix === '/en-au' ? 'Australia' : countryPrefix === '/en-uk' ? 'UK' : countryPrefix === '/en-ca' ? 'Canada' : 'Global'}
                <svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
              </button>
              <div className="nav-country-menu">
                <div className="nav-country-menu-inner">
                <div className="nav-country-head">
                  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                  <span>Select Region</span>
                </div>
                {[
                  { name: 'Global', path: '/', flag: '🌍', desc: 'Worldwide listings' },
                  { name: 'India', path: '/en-in', flag: '🇮🇳', desc: '2,500+ businesses' },
                  { name: 'Europe', path: '/en-eu', flag: '🇪🇺', desc: '1,800+ businesses' },
                  { name: 'Australia', path: '/en-au', flag: '🇦🇺', desc: '950+ businesses' },
                  { name: 'United Kingdom', path: '/en-uk', flag: '🇬🇧', desc: '1,200+ businesses' },
                  { name: 'Canada', path: '/en-ca', flag: '🇨🇦', desc: '780+ businesses' },
                ].map((r, i) => (
                  <Link
                    key={i}
                    to={r.path}
                    className={`nav-country-item${(countryPrefix || '/') === r.path ? ' nav-country-item--active' : ''}`}
                    style={{ '--ci': `${i * 35}ms` }}
                  >
                    <span className="nav-country-flag">{r.flag}</span>
                    <div className="nav-country-info">
                      <span className="nav-country-name">{r.name}</span>
                      <span className="nav-country-desc">{r.desc}</span>
                    </div>
                    {(countryPrefix || '/') === r.path && (
                      <svg className="nav-country-check" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4 12 14.01l-3-3" /></svg>
                    )}
                  </Link>
                ))}
              </div>
              </div>
            </div>
          </div>
          <div className="nav-right">
            <button className="nav-search-btn" aria-label="Search" onClick={toggleSearch}>
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            </button>
            <Link to={`${countryPrefix}/signin`} className="nav-signin">Sign in</Link>
            <Link to={`${countryPrefix}/submit-listing`} className="nav-cta">Get Listed</Link>
            <button className="nav-mobile-toggle" aria-label="Menu" onClick={open}><svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg></button>
          </div>
        </div>
      </nav>

      {/* ── Category strip + mega dropdown ── */}
      <div className="nav-cats" onMouseLeave={leaveCat}>
        <div className="container nav-cats-inner" ref={catStripRef}>
          {stripCats.slice(0, 10).map((cat, i) => (
            <Link
              key={cat.slug + i}
              to={`${countryPrefix}/category?cat=${cat.slug}`}
              className={`nav-cats-item${hoveredCat === i ? ' nav-cats-item--active' : ''}`}
              style={{ '--cat-bg': cat.color, '--cat-text': ['#F2C85A','#F4B4C0','#F59E0B','#D4A028'].includes(cat.color) ? '#1A1A1A' : '#fff' }}
              onMouseEnter={(e) => enterCat(i, e)}
            >
              {cat.name}
              <svg className="nav-cats-arrow" viewBox="0 0 24 24"><path d="M12 5v14" /><path d="m5 12 7 7 7-7" /></svg>
            </Link>
          ))}
        </div>

        {/* ── Mega bubble — two-pane hierarchical cascade ── */}
        {hoveredCat !== null && (() => {
          const cat = stripCats[hoveredCat]
          const l2 = cat.tree[activeL2]
          return (
            <div className="nmb" onMouseEnter={enterMega} onMouseLeave={leaveMega}>
              <div className="container nmb-wrap">
                <div className="nmb-bubble" style={{ '--nmb-arrow': arrowLeft }}>
                  {/* Header */}
                  <div className="nmb-head">
                    <span className="nmb-dot" style={{ background: cat.color }}></span>
                    <span className="nmb-title">{cat.name}</span>
                    <Link to={`${countryPrefix}/category?cat=${cat.slug}`} className="nmb-viewall">
                      View all <svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </Link>
                  </div>
                  {/* Two panes */}
                  <div className="nmb-panes">
                    {/* Left: Level 2 */}
                    <div className="nmb-l2">
                      {cat.tree.map((item, j) => (
                        <div key={j} className={`nmb-l2-item${activeL2 === j ? ' nmb-l2-item--active' : ''}`} onMouseEnter={() => setActiveL2(j)} style={{ '--lc': cat.color }}>
                          <span className="nmb-l2-name">{item.n}</span>
                          <span className="nmb-l2-count">{item.c.length}</span>
                          <svg className="nmb-l2-arrow" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></svg>
                        </div>
                      ))}
                    </div>
                    {/* Right: Level 3-5 tree */}
                    <div className="nmb-tree" key={activeL2}>
                      {l2 && l2.c.map((l3, k) => {
                        const isObj = typeof l3 === 'object'
                        return (
                          <div key={k} className="nmb-l3" style={{ '--td': `${k * 30}ms` }}>
                            <Link to={`${countryPrefix}/category?cat=${cat.slug}&sub=${encodeURIComponent(isObj ? l3.n : l3)}`} className="nmb-l3-name" style={{ '--lc': cat.color }}>
                              {isObj ? l3.n : l3}
                            </Link>
                            {isObj && l3.c && (
                              <div className="nmb-l4-wrap">
                                {l3.c.map((l4, m) => {
                                  const is4Obj = typeof l4 === 'object'
                                  return (
                                    <div key={m} className="nmb-l4">
                                      <span className="nmb-l4-name">{is4Obj ? l4.n : l4}</span>
                                      {is4Obj && l4.c && (
                                        <div className="nmb-l5-wrap">
                                          {l4.c.map((l5, p) => (
                                            <span key={p} className="nmb-l5">{l5}</span>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })()}
      </div>

      {/* ══════════════════════════════════════════════════════
          LIQUID GLASS SEARCH OVERLAY (reuses ns-* CSS from shared.css)
          ══════════════════════════════════════════════════════ */}
      <div className={`ns-overlay${searchOpen ? ' ns-overlay--open' : ''}`} />
      <div className={`ns-container${searchOpen ? ' ns-container--open' : ''}`} ref={searchRef}>
        <div className="ns-glass">
          <div className="ns-glass-refraction"></div>
          <div className="ns-glass-caustics"></div>
        </div>
        <div className="ns-inner">
          <form className="ns-input-row" onSubmit={handleSearch}>
            <div className="ns-input-icon">
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              <div className="ns-icon-ripple"><span></span><span></span></div>
            </div>
            <input
              ref={inputRef}
              type="text"
              className="ns-input"
              placeholder="Search businesses, categories, services..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
            {query && (
              <button type="button" className="ns-clear" onClick={() => { setQuery(''); inputRef.current?.focus() }}>
                <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            )}
            <button type="submit" className="ns-submit">
              <svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </button>
            <button type="button" className="ns-close" onClick={() => setSearchOpen(false)}>
              <span>ESC</span>
            </button>
          </form>
          <div className="ns-dropdown">
            {q.length === 0 && (
              <>
                <div className="ns-section">
                  <div className="ns-label">
                    <svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                    Trending Searches
                  </div>
                  <div className="ns-trending">
                    {trendingSearches.map((t, i) => (
                      <button key={i} className="ns-trending-tag" onClick={() => setQuery(t)} onMouseMove={handleItemMouse} style={{ '--delay': `${i * 40}ms` }}>
                        <svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="ns-section">
                  <div className="ns-label">
                    <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
                    Popular Categories
                  </div>
                  <div className="ns-cats-grid">
                    {categorySuggestions.slice(0, 6).map((c, i) => (
                      <div key={i} className="ns-cat-pill" onClick={() => goToCategory(c.slug)} onMouseMove={handleItemMouse} style={{ '--delay': `${i * 50}ms` }}>
                        <span className="ns-cat-dot" style={{ background: c.color }}></span>
                        <span className="ns-cat-name">{c.name}</span>
                        <svg className="ns-cat-arrow" viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            {q.length > 0 && (
              <>
                <div className="ns-status">
                  <div className="ns-status-ripple"><span></span><span></span><span></span></div>
                  <span>{totalResults > 0 ? `${totalResults} results found` : 'Searching...'}</span>
                </div>
                {filtered.length > 0 && (
                  <div className="ns-section">
                    <div className="ns-label">
                      <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" /></svg>
                      Businesses
                    </div>
                    {filtered.map((s, i) => (
                      <div key={i} className={`ns-item${activeIdx === i ? ' ns-item--active' : ''}`} onClick={() => goToResult(s.name)} onMouseEnter={() => setActiveIdx(i)} onMouseMove={handleItemMouse} style={{ '--delay': `${i * 50}ms` }}>
                        <div className="ns-item-icon" style={{ background: `color-mix(in srgb, ${s.color} 12%, transparent)` }}>
                          <svg viewBox="0 0 24 24" stroke={s.color} fill="none" strokeWidth="1.5">{s.icon}</svg>
                        </div>
                        <div className="ns-item-info">
                          <div className="ns-item-name">{highlightMatch(s.name, q)}</div>
                          <div className="ns-item-cat">{s.cat}</div>
                        </div>
                        <div className="ns-item-rating">
                          <svg viewBox="0 0 24 24" fill="var(--gold)" stroke="var(--gold)" strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                          <span>{s.rating}</span>
                        </div>
                        <svg className="ns-item-arrow" viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                      </div>
                    ))}
                  </div>
                )}
                {matchedCats.length > 0 && (
                  <div className="ns-section">
                    <div className="ns-label">
                      <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
                      Categories
                    </div>
                    {matchedCats.map((c, i) => (
                      <div key={i} className={`ns-item ns-item--cat${activeIdx === filtered.length + i ? ' ns-item--active' : ''}`} onClick={() => goToCategory(c.slug)} onMouseEnter={() => setActiveIdx(filtered.length + i)} onMouseMove={handleItemMouse} style={{ '--delay': `${(filtered.length + i) * 50}ms` }}>
                        <span className="ns-cat-dot" style={{ background: c.color }}></span>
                        <span className="ns-item-name">{highlightMatch(c.name, q)}</span>
                        <svg className="ns-item-arrow" viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                      </div>
                    ))}
                  </div>
                )}
                {totalResults === 0 && q.length > 1 && (
                  <div className="ns-empty">
                    <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
                    <span>No results for "<strong>{query}</strong>"</span>
                    <span className="ns-empty-hint">Try searching for a business name or category</span>
                  </div>
                )}
                {totalResults > 0 && (
                  <div className="ns-footer" onClick={handleSearch}>
                    <span>View all results for "<strong>{query}</strong>"</span>
                    <svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`nav-mobile-overlay${drawerOpen ? ' open' : ''}`} id="nav-overlay" onClick={close}></div>
      <div className={`nav-mobile-drawer${drawerOpen ? ' open' : ''}`} id="nav-drawer">
        <div className="nav-mobile-header">
          <Link to={countryPrefix || '/'} className="nav-logo"><img src="/logo/infowebworld-logo.png" alt="InfoWebWorld" /></Link>
          <button className="nav-mobile-close" aria-label="Close menu" onClick={close}><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>
        </div>
        <div className="nav-mobile-body">
          <button className="nav-mobile-link" onClick={toggleSearch} style={{width:'100%',textAlign:'left',background:'none',border:'none',cursor:'pointer'}}>Search</button>
          <Link to={`${countryPrefix}/best-of`} className="nav-mobile-link">Featured</Link>
          <Link to={`${countryPrefix}/news`} className="nav-mobile-link">News</Link>
          <Link to={`${countryPrefix}/pricing`} className="nav-mobile-link">Pricing</Link>
          <div className="nav-mobile-label">Browse Categories</div>
          <Link to={`${countryPrefix}/category?cat=technology-saas`} className="nav-mobile-cat"><span className="nav-mobile-cat-icon" style={{background:'rgba(108,114,241,.1)'}}><svg viewBox="0 0 24 24" stroke="var(--accent)"><path d="M16 18l6-6-6-6" /><path d="M8 6l-6 6 6 6" /></svg></span>Technology &amp; SaaS</Link>
          <Link to={`${countryPrefix}/category?cat=restaurants-food`} className="nav-mobile-cat"><span className="nav-mobile-cat-icon" style={{background:'rgba(239,107,74,.1)'}}><svg viewBox="0 0 24 24" stroke="var(--coral)"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" /></svg></span>Restaurants &amp; Food</Link>
          <Link to={`${countryPrefix}/category?cat=healthcare-wellness`} className="nav-mobile-cat"><span className="nav-mobile-cat-icon" style={{background:'rgba(47,174,106,.1)'}}><svg viewBox="0 0 24 24" stroke="var(--emerald)"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg></span>Healthcare &amp; Wellness</Link>
          <Link to={`${countryPrefix}/category?cat=real-estate`} className="nav-mobile-cat"><span className="nav-mobile-cat-icon" style={{background:'rgba(59,130,246,.1)'}}><svg viewBox="0 0 24 24" stroke="var(--azure)"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></svg></span>Real Estate &amp; Property</Link>
          <Link to={`${countryPrefix}/category?cat=legal-financial`} className="nav-mobile-cat"><span className="nav-mobile-cat-icon" style={{background:'rgba(139,92,246,.1)'}}><svg viewBox="0 0 24 24" stroke="var(--plum)"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" /></svg></span>Legal &amp; Financial</Link>
          <Link to={`${countryPrefix}/category?cat=marketing-creative`} className="nav-mobile-cat"><span className="nav-mobile-cat-icon" style={{background:'rgba(236,72,153,.1)'}}><svg viewBox="0 0 24 24" stroke="var(--rose)"><path d="M3 11l18-5v12L3 13v-2z" /></svg></span>Marketing &amp; Creative</Link>
          <Link to={`${countryPrefix}/category?cat=home-services`} className="nav-mobile-cat"><span className="nav-mobile-cat-icon" style={{background:'rgba(245,158,11,.1)'}}><svg viewBox="0 0 24 24" stroke="var(--amber)"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg></span>Home Services &amp; Trades</Link>
          <Link to={`${countryPrefix}/category?cat=education-training`} className="nav-mobile-cat"><span className="nav-mobile-cat-icon" style={{background:'rgba(20,184,166,.1)'}}><svg viewBox="0 0 24 24" stroke="var(--teal)"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg></span>Education &amp; Training</Link>
        </div>
        <div className="nav-mobile-footer">
          <Link to={`${countryPrefix}/signin`} className="nav-signin">Sign in</Link>
          <Link to={`${countryPrefix}/submit-listing`} className="nav-cta">Get Listed</Link>
        </div>
      </div>
    </>
  )
}
