-- ============================================================
-- InfoWebWorld — Local Businesses Taxonomy v2 Migration
-- Rebuilds the Local Businesses sector with 872 hierarchical
-- categories across 3 nested levels (DB L2..L4 under existing
-- 'local-businesses' L1).
--
-- Source: Local_Business_Structure v1.xlsx
-- Run each section IN ORDER in phpMyAdmin.
-- ============================================================

-- ═══ Section A: Safety ═════════════════════════════════════════
SET FOREIGN_KEY_CHECKS = 0;

-- ═══ Section B: Disconnect existing local-businesses submissions ═══
UPDATE submissions
   SET category_id = NULL, listing_type_id = NULL
 WHERE category_id IN (
   SELECT id FROM (
     SELECT c.id FROM categories c
      LEFT JOIN categories p   ON p.id   = c.parent_id
      LEFT JOIN categories gp  ON gp.id  = p.parent_id
      LEFT JOIN categories ggp ON ggp.id = gp.parent_id
      WHERE c.parent_id  = (SELECT id FROM categories WHERE slug='local-businesses' AND level=1)
         OR p.parent_id  = (SELECT id FROM categories WHERE slug='local-businesses' AND level=1)
         OR gp.parent_id = (SELECT id FROM categories WHERE slug='local-businesses' AND level=1)
         OR ggp.parent_id = (SELECT id FROM categories WHERE slug='local-businesses' AND level=1)
   ) AS lb_ids
 );

-- ═══ Section C: Delete old local-businesses dependents + categories ═══

-- C.1: SEO content
DELETE sc FROM category_seo_content sc
  JOIN categories c ON c.id = sc.category_id
  LEFT JOIN categories p  ON p.id  = c.parent_id
  LEFT JOIN categories gp ON gp.id = p.parent_id
 WHERE c.parent_id  = (SELECT id FROM categories WHERE slug='local-businesses' AND level=1)
    OR p.parent_id  = (SELECT id FROM categories WHERE slug='local-businesses' AND level=1)
    OR gp.parent_id = (SELECT id FROM categories WHERE slug='local-businesses' AND level=1);

-- C.2: listing_types
DELETE lt FROM listing_types lt
  JOIN categories c ON c.id = lt.category_id
  LEFT JOIN categories p ON p.id = c.parent_id
 WHERE c.parent_id = (SELECT id FROM categories WHERE slug='local-businesses' AND level=1)
    OR p.parent_id = (SELECT id FROM categories WHERE slug='local-businesses' AND level=1);

-- C.3: L3 categories (JOIN-based)
DELETE c FROM categories c
  JOIN categories p  ON p.id  = c.parent_id
  JOIN categories gp ON gp.id = p.parent_id
 WHERE c.level = 3 AND gp.slug = 'local-businesses' AND gp.level = 1;

-- C.4: L2 categories
DELETE c FROM categories c
  JOIN categories p ON p.id = c.parent_id
 WHERE c.level = 2 AND p.slug = 'local-businesses' AND p.level = 1;

-- ═══ Section D.1: Insert 17 new L2 categories ═══
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Restaurants, Food & Drink', 'restaurants-food-drink', 2, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'local-businesses' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Home Services & Contractors', 'home-services-contractors', 2, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'local-businesses' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Health & Medical', 'health-medical', 2, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'local-businesses' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Automotive', 'automotive', 2, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'local-businesses' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Beauty & Personal Care', 'beauty-personal-care', 2, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'local-businesses' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Shopping & Retail', 'shopping-retail', 2, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'local-businesses' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Active Life & Fitness', 'active-life-fitness', 2, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'local-businesses' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pets & Animals', 'pets-animals', 2, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'local-businesses' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Education & Childcare', 'education-childcare', 2, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'local-businesses' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Event Services & Planning', 'event-services-planning', 2, id, '#F59E0B', 1, 1, 1, 100
  FROM categories WHERE slug = 'local-businesses' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Entertainment & Arts', 'entertainment-arts', 2, id, '#F59E0B', 1, 1, 1, 110
  FROM categories WHERE slug = 'local-businesses' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Travel, Hotels & Transportation', 'travel-hotels-transportation', 2, id, '#F59E0B', 1, 1, 1, 120
  FROM categories WHERE slug = 'local-businesses' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate', 'real-estate', 2, id, '#F59E0B', 1, 1, 1, 130
  FROM categories WHERE slug = 'local-businesses' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Religious, Community & Public', 'religious-community-public', 2, id, '#F59E0B', 1, 1, 1, 140
  FROM categories WHERE slug = 'local-businesses' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Financial & Insurance', 'financial-insurance', 2, id, '#F59E0B', 1, 1, 1, 150
  FROM categories WHERE slug = 'local-businesses' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Media, Printing & Signage', 'media-printing-signage', 2, id, '#F59E0B', 1, 1, 1, 160
  FROM categories WHERE slug = 'local-businesses' AND level = 1 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Funeral & End-of-Life Services', 'funeral-end-of-life-services', 2, id, '#F59E0B', 1, 1, 1, 170
  FROM categories WHERE slug = 'local-businesses' AND level = 1 LIMIT 1;

-- ═══ Section D.2: Insert 94 new L3 categories ═══
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Restaurants by Cuisine', 'restaurants-by-cuisine', 3, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'restaurants-food-drink' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Restaurants by Meal Type', 'restaurants-by-meal-type', 3, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'restaurants-food-drink' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fast Food & Quick Service', 'fast-food-quick-service', 3, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'restaurants-food-drink' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Healthy & Specialty Diets', 'healthy-specialty-diets', 3, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'restaurants-food-drink' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Specialty Restaurants', 'specialty-restaurants', 3, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'restaurants-food-drink' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cafes & Coffee', 'cafes-coffee', 3, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'restaurants-food-drink' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bakeries & Desserts', 'bakeries-desserts', 3, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'restaurants-food-drink' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bars, Pubs & Nightlife', 'bars-pubs-nightlife', 3, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'restaurants-food-drink' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Food Delivery & Catering', 'food-delivery-catering', 3, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'restaurants-food-drink' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Plumbing', 'plumbing', 3, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'home-services-contractors' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Electrical', 'electrical', 3, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'home-services-contractors' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'HVAC & Climate Control', 'hvac-climate-control', 3, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'home-services-contractors' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cleaning Services', 'cleaning-services', 3, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'home-services-contractors' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pest & Wildlife Control', 'pest-wildlife-control', 3, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'home-services-contractors' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Landscaping & Lawn Care', 'landscaping-lawn-care', 3, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'home-services-contractors' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Roofing & Exterior', 'roofing-exterior', 3, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'home-services-contractors' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Construction & Remodeling', 'construction-remodeling', 3, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'home-services-contractors' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Interior Specialists', 'interior-specialists', 3, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'home-services-contractors' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Handyman & Repairs', 'handyman-repairs', 3, id, '#F59E0B', 1, 1, 1, 100
  FROM categories WHERE slug = 'home-services-contractors' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Restoration & Damage', 'restoration-damage', 3, id, '#F59E0B', 1, 1, 1, 110
  FROM categories WHERE slug = 'home-services-contractors' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pool & Outdoor', 'pool-outdoor', 3, id, '#F59E0B', 1, 1, 1, 120
  FROM categories WHERE slug = 'home-services-contractors' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Doctors & Clinics', 'doctors-clinics', 3, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'health-medical' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Specialists', 'specialists', 3, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'health-medical' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dental', 'dental', 3, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'health-medical' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vision & Eye Care', 'vision-eye-care', 3, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'health-medical' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mental Health & Therapy', 'mental-health-therapy', 3, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'health-medical' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Alternative & Holistic Care', 'alternative-holistic-care', 3, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'health-medical' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Physical Therapy & Rehab', 'physical-therapy-rehab', 3, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'health-medical' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hospitals & Facilities', 'hospitals-facilities', 3, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'health-medical' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pharmacy & Supplies', 'pharmacy-supplies', 3, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'health-medical' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Senior & Home Care', 'senior-home-care', 3, id, '#F59E0B', 1, 1, 1, 100
  FROM categories WHERE slug = 'health-medical' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Weight Loss & Wellness', 'weight-loss-wellness', 3, id, '#F59E0B', 1, 1, 1, 110
  FROM categories WHERE slug = 'health-medical' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Auto Repair', 'auto-repair', 3, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'automotive' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Car Dealers', 'car-dealers', 3, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'automotive' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Auto Services', 'auto-services', 3, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'automotive' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Auto Rental & Sharing', 'auto-rental-sharing', 3, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'automotive' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Auto Parts & Accessories', 'auto-parts-accessories', 3, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'automotive' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fuel & Charging', 'fuel-charging', 3, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'automotive' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hair Salons', 'hair-salons', 3, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'beauty-personal-care' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Barbershops', 'barbershops', 3, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'beauty-personal-care' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Nail Salons', 'nail-salons', 3, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'beauty-personal-care' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Skincare & Facials', 'skincare-facials', 3, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'beauty-personal-care' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Spas & Massage', 'spas-massage', 3, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'beauty-personal-care' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Specialty Beauty', 'specialty-beauty', 3, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'beauty-personal-care' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Apparel & Accessories', 'apparel-accessories', 3, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'shopping-retail' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Department & General', 'department-general', 3, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'shopping-retail' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Grocery & Food Shopping', 'grocery-food-shopping', 3, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'shopping-retail' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Home & Furniture', 'home-furniture', 3, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'shopping-retail' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Home Improvement', 'home-improvement', 3, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'shopping-retail' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Electronics & Tech', 'electronics-tech', 3, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'shopping-retail' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hobby & Specialty', 'hobby-specialty', 3, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'shopping-retail' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Gyms & Fitness Centers', 'gyms-fitness-centers', 3, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'active-life-fitness' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Studios & Classes', 'studios-classes', 3, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'active-life-fitness' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Personal Training', 'personal-training', 3, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'active-life-fitness' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sports & Recreation', 'sports-recreation', 3, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'active-life-fitness' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Outdoor Adventure', 'outdoor-adventure', 3, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'active-life-fitness' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Veterinary Care', 'veterinary-care', 3, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'pets-animals' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pet Services', 'pet-services', 3, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'pets-animals' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pet Retail', 'pet-retail', 3, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'pets-animals' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Animal Welfare', 'animal-welfare', 3, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'pets-animals' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Childcare', 'childcare', 3, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'education-childcare' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'K-12 Schools', 'k-12-schools', 3, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'education-childcare' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tutoring & Test Prep', 'tutoring-test-prep', 3, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'education-childcare' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Arts & Music Lessons', 'arts-music-lessons', 3, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'education-childcare' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Specialty Schools', 'specialty-schools', 3, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'education-childcare' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Libraries & Centers', 'libraries-centers', 3, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'education-childcare' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Event Planners', 'event-planners', 3, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'event-services-planning' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Venues', 'venues', 3, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'event-services-planning' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Photography & Video', 'photography-video', 3, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'event-services-planning' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Music & Entertainment', 'music-entertainment', 3, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'event-services-planning' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Rentals & Decor', 'rentals-decor', 3, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'event-services-planning' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Movies & Theater', 'movies-theater', 3, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'entertainment-arts' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Museums & Galleries', 'museums-galleries', 3, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'entertainment-arts' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Family Entertainment', 'family-entertainment', 3, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'entertainment-arts' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Live Music & Venues', 'live-music-venues', 3, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'entertainment-arts' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Gambling & Casino', 'gambling-casino', 3, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'entertainment-arts' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lodging', 'lodging', 3, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'travel-hotels-transportation' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Travel Services', 'travel-services', 3, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'travel-hotels-transportation' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Public Transportation', 'public-transportation', 3, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'travel-hotels-transportation' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Moving & Storage', 'moving-storage', 3, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'travel-hotels-transportation' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Buying & Selling', 'buying-selling', 3, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'real-estate' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Renting & Leasing', 'renting-leasing', 3, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'real-estate' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Services', 'real-estate-services-local', 3, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'real-estate' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Places of Worship', 'places-of-worship', 3, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'religious-community-public' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Government Offices', 'government-offices', 3, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'religious-community-public' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Public Safety', 'public-safety', 3, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'religious-community-public' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Community Services', 'community-services', 3, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'religious-community-public' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Banks & Credit Unions', 'banks-credit-unions', 3, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'financial-insurance' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Insurance', 'insurance', 3, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'financial-insurance' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lending & Loans', 'lending-loans', 3, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'financial-insurance' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Printing', 'printing', 3, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'media-printing-signage' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Signage', 'signage', 3, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'media-printing-signage' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Local Media', 'local-media', 3, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'media-printing-signage' AND level = 2 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Funeral Services', 'funeral-services', 3, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'funeral-end-of-life-services' AND level = 2 LIMIT 1;

-- ═══ Section D.3: Insert 761 new L4 categories ═══
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'American Restaurants', 'american-restaurants', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'restaurants-by-cuisine' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mexican Restaurants', 'mexican-restaurants', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'restaurants-by-cuisine' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Italian Restaurants', 'italian-restaurants', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'restaurants-by-cuisine' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Chinese Restaurants', 'chinese-restaurants', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'restaurants-by-cuisine' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Japanese Restaurants', 'japanese-restaurants', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'restaurants-by-cuisine' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Thai Restaurants', 'thai-restaurants', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'restaurants-by-cuisine' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Indian Restaurants', 'indian-restaurants', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'restaurants-by-cuisine' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vietnamese Restaurants', 'vietnamese-restaurants', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'restaurants-by-cuisine' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Korean Restaurants', 'korean-restaurants', 4, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'restaurants-by-cuisine' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mediterranean Restaurants', 'mediterranean-restaurants', 4, id, '#F59E0B', 1, 1, 1, 100
  FROM categories WHERE slug = 'restaurants-by-cuisine' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Greek Restaurants', 'greek-restaurants', 4, id, '#F59E0B', 1, 1, 1, 110
  FROM categories WHERE slug = 'restaurants-by-cuisine' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Middle Eastern Restaurants', 'middle-eastern-restaurants', 4, id, '#F59E0B', 1, 1, 1, 120
  FROM categories WHERE slug = 'restaurants-by-cuisine' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'French Restaurants', 'french-restaurants', 4, id, '#F59E0B', 1, 1, 1, 130
  FROM categories WHERE slug = 'restaurants-by-cuisine' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Spanish & Tapas Restaurants', 'spanish-tapas-restaurants', 4, id, '#F59E0B', 1, 1, 1, 140
  FROM categories WHERE slug = 'restaurants-by-cuisine' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Latin American Restaurants', 'latin-american-restaurants', 4, id, '#F59E0B', 1, 1, 1, 150
  FROM categories WHERE slug = 'restaurants-by-cuisine' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Caribbean Restaurants', 'caribbean-restaurants', 4, id, '#F59E0B', 1, 1, 1, 160
  FROM categories WHERE slug = 'restaurants-by-cuisine' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Filipino Restaurants', 'filipino-restaurants', 4, id, '#F59E0B', 1, 1, 1, 170
  FROM categories WHERE slug = 'restaurants-by-cuisine' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Ethiopian & African Restaurants', 'ethiopian-african-restaurants', 4, id, '#F59E0B', 1, 1, 1, 180
  FROM categories WHERE slug = 'restaurants-by-cuisine' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Turkish Restaurants', 'turkish-restaurants', 4, id, '#F59E0B', 1, 1, 1, 190
  FROM categories WHERE slug = 'restaurants-by-cuisine' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'German Restaurants', 'german-restaurants', 4, id, '#F59E0B', 1, 1, 1, 200
  FROM categories WHERE slug = 'restaurants-by-cuisine' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Brazilian Steakhouses', 'brazilian-steakhouses', 4, id, '#F59E0B', 1, 1, 1, 210
  FROM categories WHERE slug = 'restaurants-by-cuisine' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Breakfast & Brunch Restaurants', 'breakfast-brunch-restaurants', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'restaurants-by-meal-type' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lunch Spots', 'lunch-spots', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'restaurants-by-meal-type' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dinner Restaurants', 'dinner-restaurants', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'restaurants-by-meal-type' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Late Night Restaurants', 'late-night-restaurants', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'restaurants-by-meal-type' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Buffet Restaurants', 'buffet-restaurants', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'restaurants-by-meal-type' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fine Dining Restaurants', 'fine-dining-restaurants', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'restaurants-by-meal-type' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Family Restaurants', 'family-restaurants', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'restaurants-by-meal-type' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fast Food Restaurants', 'fast-food-restaurants', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'fast-food-quick-service' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Burger Restaurants', 'burger-restaurants', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'fast-food-quick-service' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pizza Restaurants', 'pizza-restaurants', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'fast-food-quick-service' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sandwich Shops', 'sandwich-shops', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'fast-food-quick-service' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sub & Deli Shops', 'sub-deli-shops', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'fast-food-quick-service' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hot Dog Restaurants', 'hot-dog-restaurants', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'fast-food-quick-service' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Chicken Wing Restaurants', 'chicken-wing-restaurants', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'fast-food-quick-service' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Taco Restaurants', 'taco-restaurants', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'fast-food-quick-service' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Burrito Restaurants', 'burrito-restaurants', 4, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'fast-food-quick-service' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Food Trucks', 'food-trucks', 4, id, '#F59E0B', 1, 1, 1, 100
  FROM categories WHERE slug = 'fast-food-quick-service' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Diners', 'diners', 4, id, '#F59E0B', 1, 1, 1, 110
  FROM categories WHERE slug = 'fast-food-quick-service' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vegan Restaurants', 'vegan-restaurants', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'healthy-specialty-diets' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vegetarian Restaurants', 'vegetarian-restaurants', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'healthy-specialty-diets' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Gluten-Free Restaurants', 'gluten-free-restaurants', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'healthy-specialty-diets' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Healthy Food Restaurants', 'healthy-food-restaurants', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'healthy-specialty-diets' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Salad Restaurants', 'salad-restaurants', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'healthy-specialty-diets' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Acai Bowl Shops', 'acai-bowl-shops', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'healthy-specialty-diets' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Halal Restaurants', 'halal-restaurants', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'healthy-specialty-diets' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Kosher Restaurants', 'kosher-restaurants', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'healthy-specialty-diets' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Seafood Restaurants', 'seafood-restaurants', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'specialty-restaurants' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Steakhouses', 'steakhouses', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'specialty-restaurants' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sushi Restaurants', 'sushi-restaurants', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'specialty-restaurants' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Ramen Restaurants', 'ramen-restaurants', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'specialty-restaurants' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'BBQ Restaurants', 'bbq-restaurants', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'specialty-restaurants' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Soul Food Restaurants', 'soul-food-restaurants', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'specialty-restaurants' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cajun & Creole Restaurants', 'cajun-creole-restaurants', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'specialty-restaurants' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Asian Fusion Restaurants', 'asian-fusion-restaurants', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'specialty-restaurants' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hot Pot Restaurants', 'hot-pot-restaurants', 4, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'specialty-restaurants' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dim Sum Restaurants', 'dim-sum-restaurants', 4, id, '#F59E0B', 1, 1, 1, 100
  FROM categories WHERE slug = 'specialty-restaurants' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pho Restaurants', 'pho-restaurants', 4, id, '#F59E0B', 1, 1, 1, 110
  FROM categories WHERE slug = 'specialty-restaurants' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Poke Bowls', 'poke-bowls', 4, id, '#F59E0B', 1, 1, 1, 120
  FROM categories WHERE slug = 'specialty-restaurants' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hibachi Restaurants', 'hibachi-restaurants', 4, id, '#F59E0B', 1, 1, 1, 130
  FROM categories WHERE slug = 'specialty-restaurants' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Coffee Shops', 'coffee-shops', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'cafes-coffee' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Coffee Roasters', 'coffee-roasters', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'cafes-coffee' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tea Houses & Bubble Tea', 'tea-houses-bubble-tea', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'cafes-coffee' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cafes & Bistros', 'cafes-bistros', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'cafes-coffee' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Juice & Smoothie Bars', 'juice-smoothie-bars', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'cafes-coffee' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bakeries', 'bakeries', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'bakeries-desserts' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cake Shops', 'cake-shops', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'bakeries-desserts' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cupcake Shops', 'cupcake-shops', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'bakeries-desserts' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Donut Shops', 'donut-shops', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'bakeries-desserts' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Ice Cream Shops', 'ice-cream-shops', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'bakeries-desserts' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Frozen Yogurt Shops', 'frozen-yogurt-shops', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'bakeries-desserts' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Gelato Shops', 'gelato-shops', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'bakeries-desserts' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Chocolatiers & Candy Shops', 'chocolatiers-candy-shops', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'bakeries-desserts' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dessert Shops', 'dessert-shops', 4, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'bakeries-desserts' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pie Shops', 'pie-shops', 4, id, '#F59E0B', 1, 1, 1, 100
  FROM categories WHERE slug = 'bakeries-desserts' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Patisseries', 'patisseries', 4, id, '#F59E0B', 1, 1, 1, 110
  FROM categories WHERE slug = 'bakeries-desserts' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bars & Lounges', 'bars-lounges', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'bars-pubs-nightlife' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pubs & Taverns', 'pubs-taverns', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'bars-pubs-nightlife' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sports Bars', 'sports-bars', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'bars-pubs-nightlife' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wine Bars', 'wine-bars', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'bars-pubs-nightlife' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cocktail Bars', 'cocktail-bars', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'bars-pubs-nightlife' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Breweries & Beer Gardens', 'breweries-beer-gardens', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'bars-pubs-nightlife' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Brewpubs', 'brewpubs', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'bars-pubs-nightlife' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wineries & Tasting Rooms', 'wineries-tasting-rooms', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'bars-pubs-nightlife' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Distilleries', 'distilleries', 4, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'bars-pubs-nightlife' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Nightclubs', 'nightclubs', 4, id, '#F59E0B', 1, 1, 1, 100
  FROM categories WHERE slug = 'bars-pubs-nightlife' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Karaoke Bars', 'karaoke-bars', 4, id, '#F59E0B', 1, 1, 1, 110
  FROM categories WHERE slug = 'bars-pubs-nightlife' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hookah Lounges', 'hookah-lounges', 4, id, '#F59E0B', 1, 1, 1, 120
  FROM categories WHERE slug = 'bars-pubs-nightlife' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Caterers', 'caterers', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'food-delivery-catering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wedding Caterers', 'wedding-caterers', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'food-delivery-catering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Personal Chefs', 'personal-chefs', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'food-delivery-catering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Meal Prep Services', 'meal-prep-services', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'food-delivery-catering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Food Delivery Services', 'food-delivery-services', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'food-delivery-catering' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Plumbers', 'plumbers', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'plumbing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Emergency Plumbing Services', 'emergency-plumbing-services', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'plumbing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Water Heater Repair', 'water-heater-repair', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'plumbing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Drain Cleaning Services', 'drain-cleaning-services', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'plumbing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Septic Tank Services', 'septic-tank-services', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'plumbing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Well Drilling Contractors', 'well-drilling-contractors', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'plumbing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Electricians', 'electricians', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Emergency Electrical Services', 'emergency-electrical-services', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Electrical Repair Services', 'electrical-repair-services', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Generator Installation & Repair', 'generator-installation-repair', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'EV Charger Installation', 'ev-charger-installation', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Solar Panel Installation', 'solar-panel-installation', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lighting Contractors', 'lighting-contractors', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'electrical' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'HVAC Contractors', 'hvac-contractors', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'hvac-climate-control' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Air Conditioning Repair', 'air-conditioning-repair', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'hvac-climate-control' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Heating & Furnace Repair', 'heating-furnace-repair', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'hvac-climate-control' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Duct Cleaning Services', 'duct-cleaning-services', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'hvac-climate-control' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Insulation Contractors', 'insulation-contractors', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'hvac-climate-control' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'House Cleaning Services', 'house-cleaning-services', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'cleaning-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Maid Services', 'maid-services', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'cleaning-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Carpet Cleaning Services', 'carpet-cleaning-services', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'cleaning-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Upholstery Cleaning', 'upholstery-cleaning', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'cleaning-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Window Cleaning Services', 'window-cleaning-services', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'cleaning-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pressure Washing Services', 'pressure-washing-services', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'cleaning-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Gutter Cleaning Services', 'gutter-cleaning-services', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'cleaning-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Chimney Sweeps', 'chimney-sweeps', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'cleaning-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Move-Out Cleaning Services', 'move-out-cleaning-services', 4, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'cleaning-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Post-Construction Cleaning', 'post-construction-cleaning', 4, id, '#F59E0B', 1, 1, 1, 100
  FROM categories WHERE slug = 'cleaning-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pest Control Services', 'pest-control-services', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'pest-wildlife-control' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Termite Control Services', 'termite-control-services', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'pest-wildlife-control' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bed Bug Extermination', 'bed-bug-extermination', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'pest-wildlife-control' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Rodent Removal Services', 'rodent-removal-services', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'pest-wildlife-control' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wildlife Removal Services', 'wildlife-removal-services', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'pest-wildlife-control' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bee & Wasp Removal', 'bee-wasp-removal', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'pest-wildlife-control' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Landscaping Companies', 'landscaping-companies', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'landscaping-lawn-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lawn Care Services', 'lawn-care-services', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'landscaping-lawn-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lawn Mowing Services', 'lawn-mowing-services', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'landscaping-lawn-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tree Services', 'tree-services', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'landscaping-lawn-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Arborists', 'arborists', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'landscaping-lawn-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tree Removal Services', 'tree-removal-services', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'landscaping-lawn-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Irrigation & Sprinkler Systems', 'irrigation-sprinkler-systems', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'landscaping-lawn-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Landscape Designers', 'landscape-designers', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'landscaping-lawn-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hardscaping Contractors', 'hardscaping-contractors', 4, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'landscaping-lawn-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Snow Removal Services', 'snow-removal-services', 4, id, '#F59E0B', 1, 1, 1, 100
  FROM categories WHERE slug = 'landscaping-lawn-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Garden Centers & Nurseries', 'garden-centers-nurseries', 4, id, '#F59E0B', 1, 1, 1, 110
  FROM categories WHERE slug = 'landscaping-lawn-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Roofing Contractors', 'roofing-contractors', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'roofing-exterior' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Roof Repair Services', 'roof-repair-services', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'roofing-exterior' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Roof Inspection Services', 'roof-inspection-services', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'roofing-exterior' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Siding Contractors', 'siding-contractors', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'roofing-exterior' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Gutter Installation Services', 'gutter-installation-services', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'roofing-exterior' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Exterior Painting Services', 'exterior-painting-services', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'roofing-exterior' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'General Contractors', 'general-contractors', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'construction-remodeling' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Home Builders', 'home-builders', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'construction-remodeling' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Custom Home Builders', 'custom-home-builders', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'construction-remodeling' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Home Remodeling Contractors', 'home-remodeling-contractors', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'construction-remodeling' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Kitchen Remodeling Contractors', 'kitchen-remodeling-contractors', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'construction-remodeling' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bathroom Remodeling Contractors', 'bathroom-remodeling-contractors', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'construction-remodeling' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Basement Finishing', 'basement-finishing', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'construction-remodeling' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Room Addition Contractors', 'room-addition-contractors', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'construction-remodeling' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Concrete Contractors', 'concrete-contractors', 4, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'construction-remodeling' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Masonry Contractors', 'masonry-contractors', 4, id, '#F59E0B', 1, 1, 1, 100
  FROM categories WHERE slug = 'construction-remodeling' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Excavating Contractors', 'excavating-contractors', 4, id, '#F59E0B', 1, 1, 1, 110
  FROM categories WHERE slug = 'construction-remodeling' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Foundation Repair', 'foundation-repair', 4, id, '#F59E0B', 1, 1, 1, 120
  FROM categories WHERE slug = 'construction-remodeling' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Demolition Contractors', 'demolition-contractors', 4, id, '#F59E0B', 1, 1, 1, 130
  FROM categories WHERE slug = 'construction-remodeling' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Painters', 'painters', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'interior-specialists' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Drywall Contractors', 'drywall-contractors', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'interior-specialists' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Carpenters', 'carpenters', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'interior-specialists' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Flooring Contractors', 'flooring-contractors', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'interior-specialists' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tile Installation Services', 'tile-installation-services', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'interior-specialists' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hardwood Floor Refinishing', 'hardwood-floor-refinishing', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'interior-specialists' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Carpet Installation', 'carpet-installation', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'interior-specialists' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cabinet Makers', 'cabinet-makers', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'interior-specialists' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Countertop Installation', 'countertop-installation', 4, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'interior-specialists' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Window Installation', 'window-installation', 4, id, '#F59E0B', 1, 1, 1, 100
  FROM categories WHERE slug = 'interior-specialists' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Door Installation Services', 'door-installation-services', 4, id, '#F59E0B', 1, 1, 1, 110
  FROM categories WHERE slug = 'interior-specialists' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Interior Designers', 'interior-designers', 4, id, '#F59E0B', 1, 1, 1, 120
  FROM categories WHERE slug = 'interior-specialists' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Handyman Services', 'handyman-services', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'handyman-repairs' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Appliance Repair Services', 'appliance-repair-services', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'handyman-repairs' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Washer & Dryer Repair', 'washer-dryer-repair', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'handyman-repairs' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Refrigerator Repair', 'refrigerator-repair', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'handyman-repairs' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Locksmiths', 'locksmiths', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'handyman-repairs' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Garage Door Repair', 'garage-door-repair', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'handyman-repairs' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fence Contractors', 'fence-contractors', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'handyman-repairs' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Deck Builders', 'deck-builders', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'handyman-repairs' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Patio & Pergola Contractors', 'patio-pergola-contractors', 4, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'handyman-repairs' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Water Damage Restoration', 'water-damage-restoration', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'restoration-damage' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fire Damage Restoration', 'fire-damage-restoration', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'restoration-damage' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mold Remediation Services', 'mold-remediation-services', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'restoration-damage' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Asbestos Removal', 'asbestos-removal', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'restoration-damage' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Storm Damage Restoration', 'storm-damage-restoration', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'restoration-damage' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Swimming Pool Builders', 'swimming-pool-builders', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'pool-outdoor' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pool Cleaning Services', 'pool-cleaning-services', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'pool-outdoor' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pool Repair Services', 'pool-repair-services', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'pool-outdoor' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hot Tub Sales & Repair', 'hot-tub-sales-repair', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'pool-outdoor' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Family Medicine Doctors', 'family-medicine-doctors', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'doctors-clinics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'General Practitioners', 'general-practitioners', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'doctors-clinics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Internal Medicine Doctors', 'internal-medicine-doctors', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'doctors-clinics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pediatricians', 'pediatricians', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'doctors-clinics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Walk-In Clinics', 'walk-in-clinics', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'doctors-clinics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Urgent Care Centers', 'urgent-care-centers', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'doctors-clinics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Medical Centers', 'medical-centers', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'doctors-clinics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Telehealth Clinics', 'telehealth-clinics', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'doctors-clinics' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cardiologists', 'cardiologists', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'specialists' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dermatologists', 'dermatologists', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'specialists' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Endocrinologists', 'endocrinologists', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'specialists' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Gastroenterologists', 'gastroenterologists', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'specialists' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Neurologists', 'neurologists', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'specialists' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'OB/GYN Doctors', 'ob-gyn-doctors', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'specialists' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Oncologists', 'oncologists', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'specialists' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Ophthalmologists', 'ophthalmologists', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'specialists' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Orthopedic Surgeons', 'orthopedic-surgeons', 4, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'specialists' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'ENT Specialists', 'ent-specialists', 4, id, '#F59E0B', 1, 1, 1, 100
  FROM categories WHERE slug = 'specialists' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Plastic Surgeons', 'plastic-surgeons', 4, id, '#F59E0B', 1, 1, 1, 110
  FROM categories WHERE slug = 'specialists' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Podiatrists', 'podiatrists', 4, id, '#F59E0B', 1, 1, 1, 120
  FROM categories WHERE slug = 'specialists' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Psychiatrists', 'psychiatrists', 4, id, '#F59E0B', 1, 1, 1, 130
  FROM categories WHERE slug = 'specialists' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pulmonologists', 'pulmonologists', 4, id, '#F59E0B', 1, 1, 1, 140
  FROM categories WHERE slug = 'specialists' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Urologists', 'urologists', 4, id, '#F59E0B', 1, 1, 1, 150
  FROM categories WHERE slug = 'specialists' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Rheumatologists', 'rheumatologists', 4, id, '#F59E0B', 1, 1, 1, 160
  FROM categories WHERE slug = 'specialists' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Allergists', 'allergists', 4, id, '#F59E0B', 1, 1, 1, 170
  FROM categories WHERE slug = 'specialists' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Nephrologists', 'nephrologists', 4, id, '#F59E0B', 1, 1, 1, 180
  FROM categories WHERE slug = 'specialists' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pain Management Specialists', 'pain-management-specialists', 4, id, '#F59E0B', 1, 1, 1, 190
  FROM categories WHERE slug = 'specialists' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sports Medicine Physicians', 'sports-medicine-physicians', 4, id, '#F59E0B', 1, 1, 1, 200
  FROM categories WHERE slug = 'specialists' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dentists', 'dentists', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'dental' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pediatric Dentists', 'pediatric-dentists', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'dental' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cosmetic Dentists', 'cosmetic-dentists', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'dental' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Orthodontists', 'orthodontists', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'dental' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Periodontists', 'periodontists', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'dental' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Endodontists', 'endodontists', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'dental' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Oral Surgeons', 'oral-surgeons', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'dental' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Emergency Dentists', 'emergency-dentists', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'dental' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dental Implant Providers', 'dental-implant-providers', 4, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'dental' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Optometrists', 'optometrists', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'vision-eye-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Eye Doctors', 'eye-doctors', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'vision-eye-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Eyewear Stores & Opticians', 'eyewear-stores-opticians', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'vision-eye-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'LASIK Eye Surgery Centers', 'lasik-eye-surgery-centers', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'vision-eye-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Therapists & Counselors', 'therapists-counselors', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'mental-health-therapy' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Psychologists', 'psychologists', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'mental-health-therapy' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marriage Counselors', 'marriage-counselors', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'mental-health-therapy' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Family Counselors', 'family-counselors', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'mental-health-therapy' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mental Health Clinics', 'mental-health-clinics', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'mental-health-therapy' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Addiction Treatment Centers', 'addiction-treatment-centers', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'mental-health-therapy' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Eating Disorder Clinics', 'eating-disorder-clinics', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'mental-health-therapy' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Chiropractors', 'chiropractors', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'alternative-holistic-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Acupuncturists', 'acupuncturists', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'alternative-holistic-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Naturopaths', 'naturopaths', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'alternative-holistic-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Holistic Medicine Practitioners', 'holistic-medicine-practitioners', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'alternative-holistic-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Homeopaths', 'homeopaths', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'alternative-holistic-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Reiki Therapists', 'reiki-therapists', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'alternative-holistic-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Ayurvedic Clinics', 'ayurvedic-clinics', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'alternative-holistic-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Massage Therapists', 'massage-therapists', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'alternative-holistic-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Physical Therapists', 'physical-therapists', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'physical-therapy-rehab' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Occupational Therapists', 'occupational-therapists', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'physical-therapy-rehab' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Speech Therapists', 'speech-therapists', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'physical-therapy-rehab' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Rehabilitation Centers', 'rehabilitation-centers', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'physical-therapy-rehab' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sports Injury Clinics', 'sports-injury-clinics', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'physical-therapy-rehab' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hospitals', 'hospitals', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'hospitals-facilities' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Children''s Hospitals', 'children-s-hospitals', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'hospitals-facilities' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Surgical Centers', 'surgical-centers', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'hospitals-facilities' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Emergency Rooms', 'emergency-rooms', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'hospitals-facilities' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Medical Laboratories', 'medical-laboratories', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'hospitals-facilities' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Diagnostic Imaging Centers', 'diagnostic-imaging-centers', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'hospitals-facilities' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dialysis Centers', 'dialysis-centers', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'hospitals-facilities' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Blood Donation Centers', 'blood-donation-centers', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'hospitals-facilities' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fertility Clinics', 'fertility-clinics', 4, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'hospitals-facilities' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Birth Centers', 'birth-centers', 4, id, '#F59E0B', 1, 1, 1, 100
  FROM categories WHERE slug = 'hospitals-facilities' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pharmacies & Drug Stores', 'pharmacies-drug-stores', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'pharmacy-supplies' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Medical Supply Stores', 'medical-supply-stores', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'pharmacy-supplies' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hearing Aid Stores', 'hearing-aid-stores', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'pharmacy-supplies' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vitamin & Supplement Stores', 'vitamin-supplement-stores', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'pharmacy-supplies' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cannabis Dispensaries', 'cannabis-dispensaries', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'pharmacy-supplies' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Home Health Care Services', 'home-health-care-services', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'senior-home-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hospice Services', 'hospice-services', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'senior-home-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Assisted Living Facilities', 'assisted-living-facilities', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'senior-home-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Nursing Homes', 'nursing-homes', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'senior-home-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Senior Care Services', 'senior-care-services', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'senior-home-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Adult Day Care Centers', 'adult-day-care-centers', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'senior-home-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Retirement Communities', 'retirement-communities', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'senior-home-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Memory Care Facilities', 'memory-care-facilities', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'senior-home-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Weight Loss Centers', 'weight-loss-centers', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'weight-loss-wellness' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Nutritionists & Dietitians', 'nutritionists-dietitians', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'weight-loss-wellness' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wellness Centers', 'wellness-centers', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'weight-loss-wellness' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bariatric Surgeons', 'bariatric-surgeons', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'weight-loss-wellness' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Auto Repair Shops', 'auto-repair-shops', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'auto-repair' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mechanics', 'mechanics', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'auto-repair' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Brake Shops', 'brake-shops', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'auto-repair' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Transmission Repair Shops', 'transmission-repair-shops', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'auto-repair' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Muffler & Exhaust Shops', 'muffler-exhaust-shops', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'auto-repair' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tire Shops', 'tire-shops', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'auto-repair' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Oil Change Services', 'oil-change-services', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'auto-repair' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Auto Body Shops', 'auto-body-shops', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'auto-repair' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Auto Glass Repair', 'auto-glass-repair', 4, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'auto-repair' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Windshield Replacement Services', 'windshield-replacement-services', 4, id, '#F59E0B', 1, 1, 1, 100
  FROM categories WHERE slug = 'auto-repair' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Auto Electrical Services', 'auto-electrical-services', 4, id, '#F59E0B', 1, 1, 1, 110
  FROM categories WHERE slug = 'auto-repair' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Diesel Engine Repair Shops', 'diesel-engine-repair-shops', 4, id, '#F59E0B', 1, 1, 1, 120
  FROM categories WHERE slug = 'auto-repair' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'RV Repair Shops', 'rv-repair-shops', 4, id, '#F59E0B', 1, 1, 1, 130
  FROM categories WHERE slug = 'auto-repair' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Motorcycle Repair Shops', 'motorcycle-repair-shops', 4, id, '#F59E0B', 1, 1, 1, 140
  FROM categories WHERE slug = 'auto-repair' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'ATV Repair Shops', 'atv-repair-shops', 4, id, '#F59E0B', 1, 1, 1, 150
  FROM categories WHERE slug = 'auto-repair' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Car Dealerships', 'car-dealerships', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'car-dealers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Used Car Dealerships', 'used-car-dealerships', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'car-dealers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Truck Dealerships', 'truck-dealerships', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'car-dealers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Motorcycle Dealerships', 'motorcycle-dealerships', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'car-dealers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'RV Dealerships', 'rv-dealerships', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'car-dealers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Boat Dealerships', 'boat-dealerships', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'car-dealers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Auto Auctions', 'auto-auctions', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'car-dealers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Auto Detailing Services', 'auto-detailing-services', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'auto-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Car Washes', 'car-washes', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'auto-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Window Tinting Services', 'window-tinting-services', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'auto-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vehicle Wraps', 'vehicle-wraps', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'auto-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Towing Services', 'towing-services', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'auto-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Roadside Assistance', 'roadside-assistance', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'auto-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Auto Inspection Stations', 'auto-inspection-stations', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'auto-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Smog Check Stations', 'smog-check-stations', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'auto-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Car Rental Agencies', 'car-rental-agencies', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'auto-rental-sharing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Truck Rental Services', 'truck-rental-services', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'auto-rental-sharing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Van Rental Agencies', 'van-rental-agencies', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'auto-rental-sharing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Limousine & Chauffeur Services', 'limousine-chauffeur-services', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'auto-rental-sharing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Taxi Services', 'taxi-services', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'auto-rental-sharing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Airport Shuttle Services', 'airport-shuttle-services', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'auto-rental-sharing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Auto Parts Stores', 'auto-parts-stores', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'auto-parts-accessories' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Auto Accessories Stores', 'auto-accessories-stores', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'auto-parts-accessories' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wheels & Rims Stores', 'wheels-rims-stores', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'auto-parts-accessories' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Car Stereo Stores', 'car-stereo-stores', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'auto-parts-accessories' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Used Auto Parts Stores', 'used-auto-parts-stores', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'auto-parts-accessories' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Auto Salvage Yards', 'auto-salvage-yards', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'auto-parts-accessories' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Gas Stations', 'gas-stations', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'fuel-charging' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'EV Charging Stations', 'ev-charging-stations', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'fuel-charging' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Propane & LPG Stations', 'propane-lpg-stations', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'fuel-charging' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Alternative Fuel Stations', 'alternative-fuel-stations', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'fuel-charging' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hair Salons', 'hair-salons-2', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'hair-salons' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Beauty Salons', 'beauty-salons', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'hair-salons' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hair Stylists', 'hair-stylists', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'hair-salons' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hair Extensions Salons', 'hair-extensions-salons', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'hair-salons' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hair Coloring Salons', 'hair-coloring-salons', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'hair-salons' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Blow Dry Bars', 'blow-dry-bars', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'hair-salons' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hair Replacement Services', 'hair-replacement-services', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'hair-salons' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Barbershops', 'barbershops-2', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'barbershops' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Men''s Grooming Services', 'men-s-grooming-services', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'barbershops' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Beard Care Services', 'beard-care-services', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'barbershops' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Nail Salons', 'nail-salons-2', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'nail-salons' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Manicure & Pedicure Services', 'manicure-pedicure-services', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'nail-salons' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Acrylic Nail Salons', 'acrylic-nail-salons', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'nail-salons' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Nail Art Salons', 'nail-art-salons', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'nail-salons' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Skincare Clinics', 'skincare-clinics', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'skincare-facials' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Facial Spas', 'facial-spas', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'skincare-facials' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Medical Spas', 'medical-spas', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'skincare-facials' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Aesthetician Services', 'aesthetician-services', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'skincare-facials' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Botox & Filler Clinics', 'botox-filler-clinics', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'skincare-facials' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Laser Hair Removal Clinics', 'laser-hair-removal-clinics', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'skincare-facials' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Electrolysis Hair Removal', 'electrolysis-hair-removal', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'skincare-facials' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Waxing Salons', 'waxing-salons', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'skincare-facials' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Eyebrow Threading & Waxing', 'eyebrow-threading-waxing', 4, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'skincare-facials' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Day Spas', 'day-spas', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'spas-massage' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Massage Spas', 'massage-spas', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'spas-massage' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Thai Massage Therapists', 'thai-massage-therapists', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'spas-massage' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hot Stone Massage', 'hot-stone-massage', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'spas-massage' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Couples Massage Services', 'couples-massage-services', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'spas-massage' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Korean Spas & Saunas', 'korean-spas-saunas', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'spas-massage' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hammams & Bathhouses', 'hammams-bathhouses', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'spas-massage' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Eyelash Extensions & Lash Bars', 'eyelash-extensions-lash-bars', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'specialty-beauty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Microblading & Permanent Makeup', 'microblading-permanent-makeup', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'specialty-beauty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Makeup Artists', 'makeup-artists', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'specialty-beauty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wedding Makeup Artists', 'wedding-makeup-artists', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'specialty-beauty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Teeth Whitening Services', 'teeth-whitening-services', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'specialty-beauty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tattoo Shops', 'tattoo-shops', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'specialty-beauty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tattoo Removal Services', 'tattoo-removal-services', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'specialty-beauty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Body Piercing Shops', 'body-piercing-shops', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'specialty-beauty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tanning Salons', 'tanning-salons', 4, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'specialty-beauty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Spray Tan Services', 'spray-tan-services', 4, id, '#F59E0B', 1, 1, 1, 100
  FROM categories WHERE slug = 'specialty-beauty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Clothing Stores', 'clothing-stores', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'apparel-accessories' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Women''s Clothing Stores', 'women-s-clothing-stores', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'apparel-accessories' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Men''s Clothing Stores', 'men-s-clothing-stores', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'apparel-accessories' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Children''s Clothing Stores', 'children-s-clothing-stores', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'apparel-accessories' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Baby Clothing Stores', 'baby-clothing-stores', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'apparel-accessories' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Maternity Stores', 'maternity-stores', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'apparel-accessories' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Plus Size Clothing Stores', 'plus-size-clothing-stores', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'apparel-accessories' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bridal Shops', 'bridal-shops', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'apparel-accessories' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tuxedo Rental Shops', 'tuxedo-rental-shops', 4, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'apparel-accessories' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vintage & Thrift Stores', 'vintage-thrift-stores', 4, id, '#F59E0B', 1, 1, 1, 100
  FROM categories WHERE slug = 'apparel-accessories' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Consignment Shops', 'consignment-shops', 4, id, '#F59E0B', 1, 1, 1, 110
  FROM categories WHERE slug = 'apparel-accessories' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Shoe Stores', 'shoe-stores', 4, id, '#F59E0B', 1, 1, 1, 120
  FROM categories WHERE slug = 'apparel-accessories' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Boot Stores', 'boot-stores', 4, id, '#F59E0B', 1, 1, 1, 130
  FROM categories WHERE slug = 'apparel-accessories' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Athletic Apparel Stores', 'athletic-apparel-stores', 4, id, '#F59E0B', 1, 1, 1, 140
  FROM categories WHERE slug = 'apparel-accessories' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Surf & Skate Shops', 'surf-skate-shops', 4, id, '#F59E0B', 1, 1, 1, 150
  FROM categories WHERE slug = 'apparel-accessories' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lingerie Stores', 'lingerie-stores', 4, id, '#F59E0B', 1, 1, 1, 160
  FROM categories WHERE slug = 'apparel-accessories' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Jewelry Stores', 'jewelry-stores', 4, id, '#F59E0B', 1, 1, 1, 170
  FROM categories WHERE slug = 'apparel-accessories' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Watch Stores & Repair', 'watch-stores-repair', 4, id, '#F59E0B', 1, 1, 1, 180
  FROM categories WHERE slug = 'apparel-accessories' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Handbag & Leather Goods Stores', 'handbag-leather-goods-stores', 4, id, '#F59E0B', 1, 1, 1, 190
  FROM categories WHERE slug = 'apparel-accessories' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sunglasses Stores', 'sunglasses-stores', 4, id, '#F59E0B', 1, 1, 1, 200
  FROM categories WHERE slug = 'apparel-accessories' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Costume Stores', 'costume-stores', 4, id, '#F59E0B', 1, 1, 1, 210
  FROM categories WHERE slug = 'apparel-accessories' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Department Stores', 'department-stores', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'department-general' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Discount Stores', 'discount-stores', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'department-general' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dollar Stores', 'dollar-stores', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'department-general' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Outlet Stores', 'outlet-stores', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'department-general' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Warehouse Clubs', 'warehouse-clubs', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'department-general' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Convenience Stores', 'convenience-stores', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'department-general' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Shopping Malls', 'shopping-malls', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'department-general' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Grocery Stores', 'grocery-stores', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'grocery-food-shopping' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Supermarkets', 'supermarkets', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'grocery-food-shopping' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Organic & Health Food Stores', 'organic-health-food-stores', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'grocery-food-shopping' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Farmers Markets', 'farmers-markets', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'grocery-food-shopping' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Asian Grocery Stores', 'asian-grocery-stores', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'grocery-food-shopping' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Indian Grocery Stores', 'indian-grocery-stores', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'grocery-food-shopping' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mexican Grocery Stores', 'mexican-grocery-stores', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'grocery-food-shopping' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Butcher Shops', 'butcher-shops', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'grocery-food-shopping' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Seafood Markets', 'seafood-markets', 4, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'grocery-food-shopping' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cheese Shops', 'cheese-shops', 4, id, '#F59E0B', 1, 1, 1, 100
  FROM categories WHERE slug = 'grocery-food-shopping' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Liquor Stores', 'liquor-stores', 4, id, '#F59E0B', 1, 1, 1, 110
  FROM categories WHERE slug = 'grocery-food-shopping' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wine Stores', 'wine-stores', 4, id, '#F59E0B', 1, 1, 1, 120
  FROM categories WHERE slug = 'grocery-food-shopping' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Beer Stores', 'beer-stores', 4, id, '#F59E0B', 1, 1, 1, 130
  FROM categories WHERE slug = 'grocery-food-shopping' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Specialty Food Stores', 'specialty-food-stores', 4, id, '#F59E0B', 1, 1, 1, 140
  FROM categories WHERE slug = 'grocery-food-shopping' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Furniture Stores', 'furniture-stores', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'home-furniture' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mattress Stores', 'mattress-stores', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'home-furniture' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bedroom Furniture Stores', 'bedroom-furniture-stores', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'home-furniture' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Office Furniture Stores', 'office-furniture-stores', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'home-furniture' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Outdoor Furniture Stores', 'outdoor-furniture-stores', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'home-furniture' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Home Goods Stores', 'home-goods-stores', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'home-furniture' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Home Decor Stores', 'home-decor-stores', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'home-furniture' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Kitchen Supply Stores', 'kitchen-supply-stores', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'home-furniture' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bedding & Linen Stores', 'bedding-linen-stores', 4, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'home-furniture' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lighting Stores', 'lighting-stores', 4, id, '#F59E0B', 1, 1, 1, 100
  FROM categories WHERE slug = 'home-furniture' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Rug Stores', 'rug-stores', 4, id, '#F59E0B', 1, 1, 1, 110
  FROM categories WHERE slug = 'home-furniture' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Appliance Stores', 'appliance-stores', 4, id, '#F59E0B', 1, 1, 1, 120
  FROM categories WHERE slug = 'home-furniture' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hardware Stores', 'hardware-stores', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'home-improvement' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Home Improvement Stores', 'home-improvement-stores', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'home-improvement' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Building Materials Suppliers', 'building-materials-suppliers', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'home-improvement' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Lumber Yards', 'lumber-yards', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'home-improvement' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Plumbing Supply Stores', 'plumbing-supply-stores', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'home-improvement' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Electrical Supply Stores', 'electrical-supply-stores', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'home-improvement' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Paint Stores', 'paint-stores', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'home-improvement' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Flooring Stores', 'flooring-stores', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'home-improvement' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tile Stores', 'tile-stores', 4, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'home-improvement' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cabinet Stores', 'cabinet-stores', 4, id, '#F59E0B', 1, 1, 1, 100
  FROM categories WHERE slug = 'home-improvement' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Retail Garden Centers', 'retail-garden-centers', 4, id, '#F59E0B', 1, 1, 1, 110
  FROM categories WHERE slug = 'home-improvement' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Electronics Stores', 'electronics-stores', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'electronics-tech' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cell Phone Stores', 'cell-phone-stores', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'electronics-tech' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mobile Phone Repair Shops', 'mobile-phone-repair-shops', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'electronics-tech' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Computer Stores', 'computer-stores', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'electronics-tech' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Computer Repair Services', 'computer-repair-services', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'electronics-tech' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Video Game Stores', 'video-game-stores', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'electronics-tech' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Camera & Photo Stores', 'camera-photo-stores', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'electronics-tech' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Audio & Stereo Stores', 'audio-stereo-stores', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'electronics-tech' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sporting Goods Stores', 'sporting-goods-stores', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'hobby-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bike Shops', 'bike-shops', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'hobby-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bike Repair Shops', 'bike-repair-shops', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'hobby-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hunting & Fishing Stores', 'hunting-fishing-stores', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'hobby-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Gun Shops', 'gun-shops', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'hobby-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Music Stores', 'music-stores', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'hobby-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Musical Instrument Stores', 'musical-instrument-stores', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'hobby-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Record Stores', 'record-stores', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'hobby-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Book Stores', 'book-stores', 4, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'hobby-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Comic Book Stores', 'comic-book-stores', 4, id, '#F59E0B', 1, 1, 1, 100
  FROM categories WHERE slug = 'hobby-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hobby & Craft Stores', 'hobby-craft-stores', 4, id, '#F59E0B', 1, 1, 1, 110
  FROM categories WHERE slug = 'hobby-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Art Supply Stores', 'art-supply-stores', 4, id, '#F59E0B', 1, 1, 1, 120
  FROM categories WHERE slug = 'hobby-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Toy Stores', 'toy-stores', 4, id, '#F59E0B', 1, 1, 1, 130
  FROM categories WHERE slug = 'hobby-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Game Stores & Board Game Shops', 'game-stores-board-game-shops', 4, id, '#F59E0B', 1, 1, 1, 140
  FROM categories WHERE slug = 'hobby-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Antique Stores', 'antique-stores', 4, id, '#F59E0B', 1, 1, 1, 150
  FROM categories WHERE slug = 'hobby-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Collectibles Stores', 'collectibles-stores', 4, id, '#F59E0B', 1, 1, 1, 160
  FROM categories WHERE slug = 'hobby-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Florists', 'florists', 4, id, '#F59E0B', 1, 1, 1, 170
  FROM categories WHERE slug = 'hobby-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Gift Shops', 'gift-shops', 4, id, '#F59E0B', 1, 1, 1, 180
  FROM categories WHERE slug = 'hobby-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Candy Stores', 'candy-stores', 4, id, '#F59E0B', 1, 1, 1, 190
  FROM categories WHERE slug = 'hobby-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cigar & Smoke Shops', 'cigar-smoke-shops', 4, id, '#F59E0B', 1, 1, 1, 200
  FROM categories WHERE slug = 'hobby-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pawn Shops', 'pawn-shops', 4, id, '#F59E0B', 1, 1, 1, 210
  FROM categories WHERE slug = 'hobby-specialty' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Gyms', 'gyms', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'gyms-fitness-centers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fitness Centers', 'fitness-centers', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'gyms-fitness-centers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT '24-Hour Gyms', '24-hour-gyms', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'gyms-fitness-centers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Women''s Gyms', 'women-s-gyms', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'gyms-fitness-centers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'CrossFit Gyms', 'crossfit-gyms', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'gyms-fitness-centers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Boxing Gyms', 'boxing-gyms', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'gyms-fitness-centers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Muay Thai Gyms', 'muay-thai-gyms', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'gyms-fitness-centers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Climbing Gyms', 'climbing-gyms', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'gyms-fitness-centers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Yoga Studios', 'yoga-studios', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'studios-classes' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pilates Studios', 'pilates-studios', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'studios-classes' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Barre Studios', 'barre-studios', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'studios-classes' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Indoor Cycling Studios', 'indoor-cycling-studios', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'studios-classes' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dance Studios', 'dance-studios', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'studios-classes' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Ballet Schools', 'ballet-schools', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'studios-classes' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Salsa & Latin Dance Classes', 'salsa-latin-dance-classes', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'studios-classes' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Martial Arts Schools', 'martial-arts-schools', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'studios-classes' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Karate Schools', 'karate-schools', 4, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'studios-classes' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Taekwondo Schools', 'taekwondo-schools', 4, id, '#F59E0B', 1, 1, 1, 100
  FROM categories WHERE slug = 'studios-classes' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Jiu-Jitsu Schools', 'jiu-jitsu-schools', 4, id, '#F59E0B', 1, 1, 1, 110
  FROM categories WHERE slug = 'studios-classes' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Personal Trainers', 'personal-trainers', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'personal-training' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sports Coaches', 'sports-coaches', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'personal-training' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Boot Camps', 'boot-camps', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'personal-training' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Nutrition Coaches', 'nutrition-coaches-local', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'personal-training' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bowling Alleys', 'bowling-alleys', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'sports-recreation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Golf Courses', 'golf-courses', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'sports-recreation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Golf Driving Ranges', 'golf-driving-ranges', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'sports-recreation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mini Golf Courses', 'mini-golf-courses', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'sports-recreation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tennis Clubs & Courts', 'tennis-clubs-courts', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'sports-recreation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pickleball Courts', 'pickleball-courts', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'sports-recreation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Basketball Courts', 'basketball-courts', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'sports-recreation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Skating Rinks', 'skating-rinks', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'sports-recreation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Ice Skating Rinks', 'ice-skating-rinks', 4, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'sports-recreation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Public Swimming Pools', 'public-swimming-pools', 4, id, '#F59E0B', 1, 1, 1, 100
  FROM categories WHERE slug = 'sports-recreation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Batting Cages', 'batting-cages', 4, id, '#F59E0B', 1, 1, 1, 110
  FROM categories WHERE slug = 'sports-recreation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Archery Ranges', 'archery-ranges', 4, id, '#F59E0B', 1, 1, 1, 120
  FROM categories WHERE slug = 'sports-recreation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Shooting Ranges', 'shooting-ranges', 4, id, '#F59E0B', 1, 1, 1, 130
  FROM categories WHERE slug = 'sports-recreation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Paintball & Airsoft Fields', 'paintball-airsoft-fields', 4, id, '#F59E0B', 1, 1, 1, 140
  FROM categories WHERE slug = 'sports-recreation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Trampoline Parks', 'trampoline-parks', 4, id, '#F59E0B', 1, 1, 1, 150
  FROM categories WHERE slug = 'sports-recreation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hiking Trails', 'hiking-trails', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'outdoor-adventure' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Parks', 'parks', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'outdoor-adventure' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Beaches', 'beaches', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'outdoor-adventure' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Campgrounds', 'campgrounds', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'outdoor-adventure' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Ski Resorts', 'ski-resorts', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'outdoor-adventure' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marinas', 'marinas', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'outdoor-adventure' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Boat Rentals', 'boat-rentals', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'outdoor-adventure' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Kayak & Canoe Rentals', 'kayak-canoe-rentals', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'outdoor-adventure' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fishing Charters', 'fishing-charters', 4, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'outdoor-adventure' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Horseback Riding', 'horseback-riding', 4, id, '#F59E0B', 1, 1, 1, 100
  FROM categories WHERE slug = 'outdoor-adventure' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bike Rentals', 'bike-rentals', 4, id, '#F59E0B', 1, 1, 1, 110
  FROM categories WHERE slug = 'outdoor-adventure' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Scuba Diving Centers', 'scuba-diving-centers', 4, id, '#F59E0B', 1, 1, 1, 120
  FROM categories WHERE slug = 'outdoor-adventure' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Surf Schools', 'surf-schools', 4, id, '#F59E0B', 1, 1, 1, 130
  FROM categories WHERE slug = 'outdoor-adventure' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Veterinarians', 'veterinarians', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'veterinary-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Animal Hospitals', 'animal-hospitals', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'veterinary-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Emergency Veterinary Services', 'emergency-veterinary-services', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'veterinary-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mobile Vet Services', 'mobile-vet-services', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'veterinary-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Veterinary Pharmacies', 'veterinary-pharmacies', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'veterinary-care' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pet Groomers', 'pet-groomers', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'pet-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dog Groomers', 'dog-groomers', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'pet-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dog Walkers', 'dog-walkers', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'pet-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pet Sitters', 'pet-sitters', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'pet-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dog Boarding Services', 'dog-boarding-services', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'pet-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cat Boarding Services', 'cat-boarding-services', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'pet-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Doggy Day Care', 'doggy-day-care', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'pet-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dog Trainers', 'dog-trainers', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'pet-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pet Cemeteries & Cremation', 'pet-cemeteries-cremation', 4, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'pet-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pet Stores & Supply Shops', 'pet-stores-supply-shops', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'pet-retail' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pet Food Stores', 'pet-food-stores', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'pet-retail' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Aquarium & Fish Stores', 'aquarium-fish-stores', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'pet-retail' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Reptile Stores', 'reptile-stores', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'pet-retail' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bird Stores', 'bird-stores', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'pet-retail' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Animal Shelters', 'animal-shelters', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'animal-welfare' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pet Adoption Centers', 'pet-adoption-centers', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'animal-welfare' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Animal Rescue Organizations', 'animal-rescue-organizations', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'animal-welfare' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Daycare Centers', 'daycare-centers', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'childcare' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Preschools', 'preschools', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'childcare' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Montessori Schools', 'montessori-schools', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'childcare' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Kindergartens', 'kindergartens', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'childcare' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Babysitters & Nannies', 'babysitters-nannies', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'childcare' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'After-School Programs', 'after-school-programs', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'childcare' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Summer Camps', 'summer-camps', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'childcare' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Elementary Schools', 'elementary-schools', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'k-12-schools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Middle Schools', 'middle-schools', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'k-12-schools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'High Schools', 'high-schools', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'k-12-schools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Private Schools', 'private-schools', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'k-12-schools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Charter Schools', 'charter-schools', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'k-12-schools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Religious Schools', 'religious-schools', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'k-12-schools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Boarding Schools', 'boarding-schools', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'k-12-schools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Special Education Schools', 'special-education-schools', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'k-12-schools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tutoring Services', 'tutoring-services', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'tutoring-test-prep' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Math Tutors', 'math-tutors', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'tutoring-test-prep' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Reading & Writing Tutors', 'reading-writing-tutors', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'tutoring-test-prep' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'SAT & ACT Prep Centers', 'sat-act-prep-centers', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'tutoring-test-prep' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Online Tutoring Services', 'online-tutoring-services', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'tutoring-test-prep' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Music Lesson Schools', 'music-lesson-schools', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'arts-music-lessons' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Piano Lessons', 'piano-lessons', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'arts-music-lessons' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Guitar Lessons', 'guitar-lessons', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'arts-music-lessons' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Voice & Vocal Lessons', 'voice-vocal-lessons', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'arts-music-lessons' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Drum Lessons', 'drum-lessons', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'arts-music-lessons' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Art Classes & Schools', 'art-classes-schools', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'arts-music-lessons' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cooking Classes', 'cooking-classes', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'arts-music-lessons' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pottery Classes', 'pottery-classes', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'arts-music-lessons' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Driving Schools', 'driving-schools', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'specialty-schools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Motorcycle Driving Schools', 'motorcycle-driving-schools', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'specialty-schools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Flight Schools', 'flight-schools', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'specialty-schools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Language Schools', 'language-schools', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'specialty-schools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'ESL Schools', 'esl-schools', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'specialty-schools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Beauty Schools', 'beauty-schools', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'specialty-schools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cosmetology Schools', 'cosmetology-schools', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'specialty-schools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Trade Schools', 'trade-schools', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'specialty-schools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vocational Schools', 'vocational-schools', 4, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'specialty-schools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Culinary Schools', 'culinary-schools', 4, id, '#F59E0B', 1, 1, 1, 100
  FROM categories WHERE slug = 'specialty-schools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Massage Therapy Schools', 'massage-therapy-schools', 4, id, '#F59E0B', 1, 1, 1, 110
  FROM categories WHERE slug = 'specialty-schools' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Public Libraries', 'public-libraries', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'libraries-centers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Community Centers', 'community-centers', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'libraries-centers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Learning Centers', 'learning-centers', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'libraries-centers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Educational Consultants', 'educational-consultants', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'libraries-centers' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Event Planners', 'event-planners-2', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'event-planners' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wedding Planners', 'wedding-planners', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'event-planners' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Party Planners', 'party-planners', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'event-planners' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Corporate Event Planners', 'corporate-event-planners-local', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'event-planners' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wedding Officiants', 'wedding-officiants', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'event-planners' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Marriage Celebrants', 'marriage-celebrants', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'event-planners' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wedding Venues', 'wedding-venues', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'venues' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Banquet Halls', 'banquet-halls', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'venues' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Event Venues', 'event-venues', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'venues' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wedding Chapels', 'wedding-chapels', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'venues' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Conference & Convention Centers', 'conference-convention-centers', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'venues' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Reception Halls', 'reception-halls', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'venues' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Outdoor & Garden Venues', 'outdoor-garden-venues', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'venues' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wedding Photographers', 'wedding-photographers', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'photography-video' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Event Photographers', 'event-photographers', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'photography-video' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Portrait Photographers', 'portrait-photographers', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'photography-video' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Family Photographers', 'family-photographers', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'photography-video' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wedding Videographers', 'wedding-videographers', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'photography-video' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Photo Booth Rentals', 'photo-booth-rentals', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'photography-video' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Aerial & Drone Photographers', 'aerial-drone-photographers', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'photography-video' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'DJ Services', 'dj-services', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'music-entertainment' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wedding Bands & Musicians', 'wedding-bands-musicians', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'music-entertainment' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Magicians', 'magicians', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'music-entertainment' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Clowns & Entertainers', 'clowns-entertainers', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'music-entertainment' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Balloon Artists', 'balloon-artists', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'music-entertainment' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Face Painters', 'face-painters', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'music-entertainment' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Party Rental Services', 'party-rental-services', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'rentals-decor' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tent Rental Services', 'tent-rental-services', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'rentals-decor' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bouncy Castle Rentals', 'bouncy-castle-rentals', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'rentals-decor' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wedding Decor Rentals', 'wedding-decor-rentals', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'rentals-decor' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Linen & Table Rentals', 'linen-table-rentals', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'rentals-decor' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Equipment Rental Services', 'equipment-rental-services', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'rentals-decor' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Movie Theaters', 'movie-theaters', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'movies-theater' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Drive-In Movie Theaters', 'drive-in-movie-theaters', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'movies-theater' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Performing Arts Theaters', 'performing-arts-theaters', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'movies-theater' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Comedy Clubs', 'comedy-clubs', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'movies-theater' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Opera Houses', 'opera-houses', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'movies-theater' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dinner Theaters', 'dinner-theaters', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'movies-theater' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Art Museums', 'art-museums', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'museums-galleries' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'History Museums', 'history-museums', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'museums-galleries' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Science Museums', 'science-museums', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'museums-galleries' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Children''s Museums', 'children-s-museums', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'museums-galleries' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Art Galleries', 'art-galleries', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'museums-galleries' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Planetariums', 'planetariums', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'museums-galleries' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Aquariums', 'aquariums', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'museums-galleries' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Zoos & Wildlife Parks', 'zoos-wildlife-parks', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'museums-galleries' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Botanical Gardens', 'botanical-gardens', 4, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'museums-galleries' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Amusement Parks', 'amusement-parks', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'family-entertainment' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Water Parks', 'water-parks', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'family-entertainment' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Arcades', 'arcades', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'family-entertainment' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Escape Rooms', 'escape-rooms', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'family-entertainment' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Laser Tag Centers', 'laser-tag-centers', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'family-entertainment' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Go-Kart Tracks', 'go-kart-tracks', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'family-entertainment' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Children''s Amusement Centers', 'children-s-amusement-centers', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'family-entertainment' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Live Music Venues', 'live-music-venues-2', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'live-music-venues' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Concert Halls', 'concert-halls', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'live-music-venues' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Jazz Clubs', 'jazz-clubs', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'live-music-venues' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Music Festivals', 'music-festivals', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'live-music-venues' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Casinos', 'casinos', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'gambling-casino' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bingo Halls', 'bingo-halls', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'gambling-casino' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pool Halls & Billiards', 'pool-halls-billiards', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'gambling-casino' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hotels', 'hotels', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'lodging' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Motels', 'motels', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'lodging' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Resorts', 'resorts', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'lodging' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bed & Breakfasts', 'bed-breakfasts', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'lodging' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Inns', 'inns', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'lodging' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hostels', 'hostels', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'lodging' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vacation Rentals', 'vacation-rentals', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'lodging' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cabin Rentals', 'cabin-rentals', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'lodging' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Holiday Homes & Villas', 'holiday-homes-villas', 4, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'lodging' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Travel Agencies', 'travel-agencies', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'travel-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Tour Operators', 'tour-operators', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'travel-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sightseeing Tour Companies', 'sightseeing-tour-companies', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'travel-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bus Tour Companies', 'bus-tour-companies', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'travel-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cruise Booking Agencies', 'cruise-booking-agencies', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'travel-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Passport & Visa Services', 'passport-visa-services', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'travel-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bus Stations', 'bus-stations', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'public-transportation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Train Stations', 'train-stations', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'public-transportation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Subway Stations', 'subway-stations', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'public-transportation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Airports', 'airports', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'public-transportation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Ferry Terminals', 'ferry-terminals', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'public-transportation' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Moving Companies', 'moving-companies', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'moving-storage' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Long-Distance Movers', 'long-distance-movers', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'moving-storage' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Self-Storage Facilities', 'self-storage-facilities', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'moving-storage' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Moving Supply Stores', 'moving-supply-stores', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'moving-storage' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Junk Removal Services', 'junk-removal-services', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'moving-storage' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Dumpster Rental Services', 'dumpster-rental-services', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'moving-storage' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Shredding Services', 'shredding-services', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'moving-storage' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Agencies', 'real-estate-agencies', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'buying-selling' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Agents', 'real-estate-agents', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'buying-selling' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Brokers', 'real-estate-brokers', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'buying-selling' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Realtors', 'realtors', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'buying-selling' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Commercial Real Estate Agencies', 'commercial-real-estate-agencies', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'buying-selling' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Auctioneers', 'real-estate-auctioneers', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'buying-selling' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'FSBO Listing Services', 'fsbo-listing-services', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'buying-selling' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Apartment Rental Agencies', 'apartment-rental-agencies', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'renting-leasing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Apartment Buildings', 'apartment-buildings', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'renting-leasing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Condominium Complexes', 'condominium-complexes', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'renting-leasing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Short-Term Apartment Rentals', 'short-term-apartment-rentals', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'renting-leasing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Property Management Companies', 'property-management-companies-local', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'renting-leasing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mobile Home Parks', 'mobile-home-parks', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'renting-leasing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Appraisers', 'real-estate-appraisers-local', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'real-estate-services-local' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Home Inspectors', 'home-inspectors-local', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'real-estate-services-local' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mortgage Lenders', 'mortgage-lenders', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'real-estate-services-local' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mortgage Brokers', 'mortgage-brokers', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'real-estate-services-local' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Title Companies', 'title-companies-local', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'real-estate-services-local' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Escrow Services', 'escrow-services', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'real-estate-services-local' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Real Estate Photographers', 'real-estate-photographers', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'real-estate-services-local' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Home Staging Companies', 'home-staging-companies', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'real-estate-services-local' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Churches', 'churches', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'places-of-worship' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Catholic Churches', 'catholic-churches', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'places-of-worship' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Baptist Churches', 'baptist-churches', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'places-of-worship' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Methodist Churches', 'methodist-churches', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'places-of-worship' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Pentecostal Churches', 'pentecostal-churches', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'places-of-worship' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Christian Churches', 'christian-churches', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'places-of-worship' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mosques', 'mosques', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'places-of-worship' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Synagogues', 'synagogues', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'places-of-worship' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Hindu Temples', 'hindu-temples', 4, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'places-of-worship' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Buddhist Temples', 'buddhist-temples', 4, id, '#F59E0B', 1, 1, 1, 100
  FROM categories WHERE slug = 'places-of-worship' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sikh Gurudwaras', 'sikh-gurudwaras', 4, id, '#F59E0B', 1, 1, 1, 110
  FROM categories WHERE slug = 'places-of-worship' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Jain Temples', 'jain-temples', 4, id, '#F59E0B', 1, 1, 1, 120
  FROM categories WHERE slug = 'places-of-worship' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Religious Organizations', 'religious-organizations', 4, id, '#F59E0B', 1, 1, 1, 130
  FROM categories WHERE slug = 'places-of-worship' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Religious Goods Stores', 'religious-goods-stores', 4, id, '#F59E0B', 1, 1, 1, 140
  FROM categories WHERE slug = 'places-of-worship' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'City Government Offices', 'city-government-offices', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'government-offices' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'County Government Offices', 'county-government-offices', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'government-offices' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'State Government Offices', 'state-government-offices', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'government-offices' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Federal Government Offices', 'federal-government-offices', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'government-offices' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'DMV Offices', 'dmv-offices', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'government-offices' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Post Offices', 'post-offices', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'government-offices' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Courthouses', 'courthouses', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'government-offices' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Social Security Offices', 'social-security-offices', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'government-offices' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Voter Registration Offices', 'voter-registration-offices', 4, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'government-offices' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Embassies & Consulates', 'embassies-consulates', 4, id, '#F59E0B', 1, 1, 1, 100
  FROM categories WHERE slug = 'government-offices' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Police Stations', 'police-stations', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'public-safety' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Fire Stations', 'fire-stations', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'public-safety' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sheriff''s Departments', 'sheriff-s-departments', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'public-safety' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Bail Bonds Services', 'bail-bonds-services', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'public-safety' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Non-Profit Organizations', 'non-profit-organizations', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'community-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Charity & Donation Centers', 'charity-donation-centers', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'community-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Food Banks', 'food-banks', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'community-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Homeless Shelters', 'homeless-shelters', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'community-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Women''s Shelters', 'women-s-shelters', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'community-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Soup Kitchens', 'soup-kitchens', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'community-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Adoption Agencies', 'adoption-agencies', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'community-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Foster Care Services', 'foster-care-services', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'community-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Veterans Organizations', 'veterans-organizations', 4, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'community-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Youth Organizations', 'youth-organizations', 4, id, '#F59E0B', 1, 1, 1, 100
  FROM categories WHERE slug = 'community-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Senior Citizen Centers', 'senior-citizen-centers', 4, id, '#F59E0B', 1, 1, 1, 110
  FROM categories WHERE slug = 'community-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Banks', 'banks', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'banks-credit-unions' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Credit Unions', 'credit-unions', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'banks-credit-unions' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'ATM Locations', 'atm-locations', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'banks-credit-unions' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Currency Exchange Services', 'currency-exchange-services', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'banks-credit-unions' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Money Transfer Services', 'money-transfer-services', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'banks-credit-unions' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Check Cashing Services', 'check-cashing-services', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'banks-credit-unions' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Auto Insurance Agencies', 'auto-insurance-agencies', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'insurance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Home Insurance Agencies', 'home-insurance-agencies', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'insurance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Life Insurance Agencies', 'life-insurance-agencies', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'insurance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Health Insurance Agencies', 'health-insurance-agencies', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'insurance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Renter''s Insurance Agencies', 'renter-s-insurance-agencies', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'insurance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Insurance Brokers', 'insurance-brokers-local', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'insurance' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Loan Agencies', 'loan-agencies', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'lending-loans' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Auto Loan Providers', 'auto-loan-providers', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'lending-loans' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Personal Loan Providers', 'personal-loan-providers', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'lending-loans' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Payday Loan Stores', 'payday-loan-stores', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'lending-loans' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Print Shops', 'print-shops', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'printing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Commercial Printers', 'commercial-printers', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'printing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Copy & Print Centers', 'copy-print-centers', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'printing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Digital Printing Services', 'digital-printing-services', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'printing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Custom T-Shirt Printing', 'custom-t-shirt-printing', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'printing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Embroidery Shops', 'embroidery-shops', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'printing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Screen Printing Shops', 'screen-printing-shops', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'printing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Promotional Products Suppliers', 'promotional-products-suppliers', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'printing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Invitation Printing Services', 'invitation-printing-services', 4, id, '#F59E0B', 1, 1, 1, 90
  FROM categories WHERE slug = 'printing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Wedding Invitation Designers', 'wedding-invitation-designers', 4, id, '#F59E0B', 1, 1, 1, 100
  FROM categories WHERE slug = 'printing' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Sign Shops', 'sign-shops', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'signage' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Vinyl Sign Makers', 'vinyl-sign-makers', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'signage' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Neon Sign Makers', 'neon-sign-makers', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'signage' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Banner Shops', 'banner-shops', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'signage' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Newspaper Publishers', 'newspaper-publishers', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'local-media' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Radio Stations', 'radio-stations', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'local-media' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Television Stations', 'television-stations', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'local-media' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Book Publishers', 'book-publishers', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'local-media' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Funeral Homes', 'funeral-homes', 4, id, '#F59E0B', 1, 1, 1, 10
  FROM categories WHERE slug = 'funeral-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cremation Services', 'cremation-services', 4, id, '#F59E0B', 1, 1, 1, 20
  FROM categories WHERE slug = 'funeral-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Mortuary Services', 'mortuary-services', 4, id, '#F59E0B', 1, 1, 1, 30
  FROM categories WHERE slug = 'funeral-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Cemeteries', 'cemeteries', 4, id, '#F59E0B', 1, 1, 1, 40
  FROM categories WHERE slug = 'funeral-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Memorial Parks', 'memorial-parks', 4, id, '#F59E0B', 1, 1, 1, 50
  FROM categories WHERE slug = 'funeral-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Casket & Coffin Suppliers', 'casket-coffin-suppliers', 4, id, '#F59E0B', 1, 1, 1, 60
  FROM categories WHERE slug = 'funeral-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Monument Makers', 'monument-makers', 4, id, '#F59E0B', 1, 1, 1, 70
  FROM categories WHERE slug = 'funeral-services' AND level = 3 LIMIT 1;
INSERT INTO categories (name, slug, level, parent_id, color, is_active, is_launched, is_navigation, sort_order)
SELECT 'Funeral Celebrants', 'funeral-celebrants', 4, id, '#F59E0B', 1, 1, 1, 80
  FROM categories WHERE slug = 'funeral-services' AND level = 3 LIMIT 1;

-- ═══ Section E: Re-enable FKs ═════════════════════════════════
SET FOREIGN_KEY_CHECKS = 1;

-- ═══ Section F: (no live listings to re-attach) ═══════════════
-- The inspect script found 0 submissions under local-businesses.
