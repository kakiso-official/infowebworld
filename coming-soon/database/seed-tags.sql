-- ============================================================
-- InfoWebWorld — Tag Groups + Tags Seed
-- 6 faceted tag groups with ~106 tag values
-- Run AFTER migration-taxonomy-v3.sql
-- ============================================================

INSERT INTO tag_groups (id, name, slug, description, icon, color, sort_order) VALUES
(1, 'Industry Served', 'industry-served', 'What industry is this product/service for?', 'building', '#3B82F6', 10),
(2, 'Business Model', 'business-model', 'How does this business charge?', 'briefcase', '#8B5CF6', 20),
(3, 'Company Size', 'company-size', 'How big is this company?', 'users', '#14B8A6', 30),
(4, 'Tech Stack', 'tech-stack', 'What core technology does this use?', 'code', '#F59E0B', 40),
(5, 'Location', 'location', 'Where is this company based?', 'globe', '#E8553D', 50),
(6, 'Pricing Tier', 'pricing-tier', 'What price range does this fall into?', 'tag', '#2FAE6A', 60);

-- Industry Served (25 values)
INSERT INTO tags (id, tag_group_id, name, slug, sort_order) VALUES
(1, 1, 'Healthcare', 'healthcare', 10),
(2, 1, 'Finance', 'finance', 20),
(3, 1, 'Education', 'education', 30),
(4, 1, 'E-commerce', 'e-commerce', 40),
(5, 1, 'Manufacturing', 'manufacturing', 50),
(6, 1, 'Real Estate', 'real-estate', 60),
(7, 1, 'Legal', 'legal', 70),
(8, 1, 'Food & Hospitality', 'food-hospitality', 80),
(9, 1, 'Marketing', 'marketing', 90),
(10, 1, 'Automotive', 'automotive', 100),
(11, 1, 'Construction', 'construction', 110),
(12, 1, 'Entertainment', 'entertainment', 120),
(13, 1, 'Travel', 'travel', 130),
(14, 1, 'Agriculture', 'agriculture', 140),
(15, 1, 'Energy', 'energy', 150),
(16, 1, 'Environment', 'environment', 160),
(17, 1, 'Security', 'security', 170),
(18, 1, 'Religious', 'religious', 180),
(19, 1, 'Government', 'government', 190),
(20, 1, 'Non-Profit', 'non-profit', 200),
(21, 1, 'Media & Publishing', 'media-publishing', 210),
(22, 1, 'Telecom', 'telecom', 220),
(23, 1, 'Logistics', 'logistics', 230),
(24, 1, 'HR & Staffing', 'hr-staffing', 240),
(25, 1, 'Cross-Industry', 'cross-industry', 250);

-- Business Model (11 values)
INSERT INTO tags (id, tag_group_id, name, slug, sort_order) VALUES
(26, 2, 'Subscription / SaaS', 'subscription-saas', 10),
(27, 2, 'Freemium / Open Source', 'freemium-open-source', 20),
(28, 2, 'Pay-Per-Use', 'pay-per-use', 30),
(29, 2, 'Project-Based', 'project-based', 40),
(30, 2, 'Retainer / Hourly', 'retainer-hourly', 50),
(31, 2, 'Per-Visit / Transaction', 'per-visit-transaction', 60),
(32, 2, 'Commission-Based', 'commission-based', 70),
(33, 2, 'Marketplace', 'marketplace', 80),
(34, 2, 'Free (Ad-Supported)', 'free-ad-supported', 90),
(35, 2, 'One-Time License', 'one-time-license', 100),
(36, 2, 'Custom Enterprise', 'custom-enterprise', 110);

-- Company Size (7 values)
INSERT INTO tags (id, tag_group_id, name, slug, sort_order) VALUES
(37, 3, 'Solo (1 person)', 'solo-1-person', 10),
(38, 3, 'Small (2-10)', 'small-2-10', 20),
(39, 3, 'Small-Mid (11-50)', 'small-mid-11-50', 30),
(40, 3, 'Mid (51-200)', 'mid-51-200', 40),
(41, 3, 'Large (201-1000)', 'large-201-1000', 50),
(42, 3, 'Enterprise (1000+)', 'enterprise-1000', 60),
(43, 3, 'Any Size', 'any-size', 70);

-- Tech Stack (31 values)
INSERT INTO tags (id, tag_group_id, name, slug, sort_order) VALUES
(44, 4, 'Python', 'python', 10),
(45, 4, 'JavaScript', 'javascript', 20),
(46, 4, 'TypeScript', 'typescript', 30),
(47, 4, 'React', 'react', 40),
(48, 4, 'Angular', 'angular', 50),
(49, 4, 'Vue.js', 'vue-js', 60),
(50, 4, 'Node.js', 'node-js', 70),
(51, 4, 'Java', 'java', 80),
(52, 4, 'C# / .NET', 'c-net', 90),
(53, 4, 'PHP', 'php', 100),
(54, 4, 'Ruby', 'ruby', 110),
(55, 4, 'Go', 'go', 120),
(56, 4, 'Rust', 'rust', 130),
(57, 4, 'Swift', 'swift', 140),
(58, 4, 'Kotlin', 'kotlin', 150),
(59, 4, 'Flutter', 'flutter', 160),
(60, 4, 'React Native', 'react-native', 170),
(61, 4, 'AWS', 'aws', 180),
(62, 4, 'Google Cloud', 'google-cloud', 190),
(63, 4, 'Azure', 'azure', 200),
(64, 4, 'Docker', 'docker', 210),
(65, 4, 'Kubernetes', 'kubernetes', 220),
(66, 4, 'TensorFlow', 'tensorflow', 230),
(67, 4, 'PyTorch', 'pytorch', 240),
(68, 4, 'LLM APIs (OpenAI/Claude)', 'llm-apis-openai-claude', 250),
(69, 4, 'SQL / PostgreSQL', 'sql-postgresql', 260),
(70, 4, 'MongoDB', 'mongodb', 270),
(71, 4, 'WordPress', 'wordpress', 280),
(72, 4, 'Shopify', 'shopify', 290),
(73, 4, 'No-Code / Low-Code', 'no-code-low-code', 300),
(74, 4, 'N/A (Non-Tech)', 'n-a-non-tech', 310);

-- Location (23 values)
INSERT INTO tags (id, tag_group_id, name, slug, sort_order) VALUES
(75, 5, 'Rajkot', 'rajkot', 10),
(76, 5, 'Ahmedabad', 'ahmedabad', 20),
(77, 5, 'Surat', 'surat', 30),
(78, 5, 'Vadodara', 'vadodara', 40),
(79, 5, 'Mumbai', 'mumbai', 50),
(80, 5, 'Pune', 'pune', 60),
(81, 5, 'Bangalore', 'bangalore', 70),
(82, 5, 'Hyderabad', 'hyderabad', 80),
(83, 5, 'Chennai', 'chennai', 90),
(84, 5, 'Delhi NCR', 'delhi-ncr', 100),
(85, 5, 'Kolkata', 'kolkata', 110),
(86, 5, 'Jaipur', 'jaipur', 120),
(87, 5, 'Indore', 'indore', 130),
(88, 5, 'Lucknow', 'lucknow', 140),
(89, 5, 'Kochi', 'kochi', 150),
(90, 5, 'Chandigarh', 'chandigarh', 160),
(91, 5, 'Other India', 'other-india', 170),
(92, 5, 'USA', 'usa', 180),
(93, 5, 'UK', 'uk', 190),
(94, 5, 'Europe', 'europe', 200),
(95, 5, 'Middle East', 'middle-east', 210),
(96, 5, 'Southeast Asia', 'southeast-asia', 220),
(97, 5, 'Remote / Global', 'remote-global', 230);

-- Pricing Tier (9 values)
INSERT INTO tags (id, tag_group_id, name, slug, sort_order) VALUES
(98, 6, 'Free', 'free', 10),
(99, 6, 'Free Trial Available', 'free-trial-available', 20),
(100, 6, 'Budget (Under ₹5K/mo)', 'budget-under-5k-mo', 30),
(101, 6, 'Mid-Range (₹5K-25K/mo)', 'mid-range-5k-25k-mo', 40),
(102, 6, 'Premium (₹25K-1L/mo)', 'premium-25k-1l-mo', 50),
(103, 6, 'Enterprise (₹1L+/mo)', 'enterprise-1l-mo', 60),
(104, 6, 'Per-Project Quote', 'per-project-quote', 70),
(105, 6, 'Per-Service Pricing', 'per-service-pricing', 80),
(106, 6, 'Contact for Quote', 'contact-for-quote', 90);
