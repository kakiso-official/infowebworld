-- ============================================================
-- InfoWebWorld - TEST local-business company (Yelp-style /profile preview)
--
-- Inserts ONE active company in the local-businesses sector
-- (restaurants-food-drink > fast-food-restaurants) so /profile/<slug> renders
-- the new Yelp-style LocalBusinessProfilePage. Real fields below drive the
-- header/about/contact; the Yelp-only surfaces (photos, hours, amenities,
-- menu, map, reviews) are sample data inside the component for now.
--
-- This is a TEST row. It is status='active', so it IS publicly visible
-- (category pages read the live DB). DELETE it when you're done (re-run this
-- file's DELETE, or the cleanup line at the bottom).
--
-- After loading: restart `npm run dev`, then open /profile/mason-street-subs
-- (restart picks it up in generateStaticParams).
-- ============================================================

SET @free_plan := (SELECT id FROM plans WHERE is_active = 1 ORDER BY price ASC LIMIT 1);
SET @us        := (SELECT id FROM countries WHERE code = 'US' LIMIT 1);
SET @lb_sector := (SELECT id FROM categories WHERE slug = 'local-businesses' AND level = 1 LIMIT 1);

DELETE FROM submissions WHERE slug = 'mason-street-subs';

INSERT INTO submissions (
  uuid, company_name, slug, contact_name, email, phone_code, phone, website,
  category_id, country_id, city, state, hq_location,
  tagline, description, logo_url, founded_year, team_size,
  listing_mode, is_hiring, header_tags, verified, verified_at,
  lb_price_range, lb_hours, lb_amenities, lb_menu, lb_photos, lb_videos, lb_lat, lb_lng,
  status, payment_status, plan_id, user_id, created_at, updated_at
)
SELECT
  UUID(), 'Mason Street Subs', 'mason-street-subs', 'Mason Street Subs Team',
  'hello@masonstreetsubs.com', '+1', '415 685 2455', 'https://masonstreetsubs.com',
  COALESCE((SELECT id FROM categories WHERE slug = 'fast-food-restaurants' LIMIT 1), @lb_sector),
  @us, 'San Francisco', 'CA', '1480 Mason St, San Francisco, CA 94133',
  'Fresh-made subs, salads and wraps in San Francisco''s North Beach - fast, friendly, made to order.',
  'Mason Street Subs is a neighborhood sandwich shop in San Francisco''s North Beach serving fresh-baked bread, hot and cold subs, crisp salads and wraps. Everything is made to order with quality ingredients, and the counter moves fast for the lunch rush. Dine in, grab takeout, or order delivery.',
  'https://www.google.com/s2/favicons?domain=subway.com&sz=256',
  2014, '11-50',
  'company', 0, '["Sandwiches","Fast Food","Salads"]', 1, NOW(),
  '$',
  '[{"day":"Mon","time":"8:00 AM - 10:00 PM"},{"day":"Tue","time":"8:00 AM - 10:00 PM"},{"day":"Wed","time":"8:00 AM - 10:00 PM"},{"day":"Thu","time":"8:00 AM - 10:00 PM"},{"day":"Fri","time":"8:00 AM - 11:00 PM"},{"day":"Sat","time":"9:00 AM - 11:00 PM"},{"day":"Sun","time":"9:00 AM - 9:00 PM"}]',
  '["takeout","delivery","credit_cards","wifi","vegetarian"]',
  '[{"name":"Italian B.M.T.","price":"$6.49","description":"Genoa salami, spicy pepperoni and Black Forest ham on freshly baked bread.","photo":"https://picsum.photos/seed/lb-m1/240/180"},{"name":"Turkey Breast","price":"$5.99","description":"Sliced turkey breast piled high with your choice of veggies.","photo":"https://picsum.photos/seed/lb-m2/240/180"},{"name":"Veggie Delite","price":"$5.49","description":"Lettuce, tomatoes, green peppers, cucumbers and onions.","photo":"https://picsum.photos/seed/lb-m3/240/180"},{"name":"Meatball Marinara","price":"$5.99","description":"Italian meatballs in marinara sauce, topped with parmesan.","photo":"https://picsum.photos/seed/lb-m4/240/180"}]',
  '["https://picsum.photos/seed/lb-1/360/270","https://picsum.photos/seed/lb-2/360/270","https://picsum.photos/seed/lb-3/360/270","https://picsum.photos/seed/lb-4/360/270","https://picsum.photos/seed/lb-5/360/270","https://picsum.photos/seed/lb-6/360/270"]',
  '[{"url":"https://www.youtube.com/watch?v=ScMzIvxBSi4","title":"Inside Mason Street Subs"}]',
  37.8003, -122.4106,
  'active', 'unpaid', @free_plan, NULL, NOW(), NOW();

-- ── Cleanup when you're done testing (uncomment + run) ──
-- DELETE FROM submissions WHERE slug = 'mason-street-subs';
