-- Seed settings table with site config defaults
-- Run once in phpMyAdmin after schema.sql

INSERT INTO settings (key_name, value) VALUES
  ('pioneerJoined', '15'),
  ('pioneerTotal', '200'),
  ('totalSpots', '5000'),
  ('statWaitlist', '10,000+'),
  ('statListings', '500+'),
  ('statIndustries', '80+'),
  ('statCountries', '12'),
  ('statLanguages', '8'),
  ('launchDate', '2026-04-25T00:00:00'),
  ('foundingPrice', '240'),
  ('earlyAdopterPrice', '99'),
  ('standardPrice', '240'),
  ('useRealData', 'false')
ON DUPLICATE KEY UPDATE value = VALUES(value);
