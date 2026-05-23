-- ============================================================
-- Enrich AI/ML seeded listings — rich JSON fields for the
-- 'Who Uses', Key Features, Pricing, Integrations, Support,
-- FAQs, and Pros & Cons sections on /company/<slug> pages.
--
-- Re-runnable: every UPDATE targets a single slug and overwrites
-- only the rich columns. Listings without overrides here keep
-- their NULL JSON fields and render the empty-state UI.
-- ============================================================

-- midjourney
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Image generation', 'Generative art', 'Discord'),
  industries_served   = JSON_ARRAY('Marketing & Advertising', 'Design Agencies', 'Film & Production', 'Game Development', 'Publishing & Editorial', 'Creator Economy', 'E-commerce', 'Education'),
  use_cases           = JSON_ARRAY('Concept art', 'Marketing visuals', 'Mood boards', 'Editorial illustration', 'Character design', 'Style exploration', 'Storyboarding', 'Product mockups'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('V6 photorealism', 'V6 artistic stylization', 'Vary Region (inpainting)', 'Pan and Zoom Out', 'Style references (--sref)', 'Character references (--cref)', 'Personalisation profiles', '2x and 4x upscale', 'Niji 6 anime model', 'Browser web alpha'),
  features            = JSON_ARRAY('V6 photorealism', 'V6 artistic stylization', 'Vary Region (inpainting)', 'Pan and Zoom Out', 'Style references (--sref)', 'Character references (--cref)', 'Personalisation profiles', '2x and 4x upscale', 'Niji 6 anime model', 'Browser web alpha'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Basic', 'price', 10, 'period', 'month', 'features', JSON_ARRAY('~200 generations/mo', '3 concurrent fast jobs', 'Commercial usage rights')),
        JSON_OBJECT('name', 'Standard', 'price', 30, 'period', 'month', 'features', JSON_ARRAY('~900 generations/mo + 15 fast hours', 'Unlimited Relax mode', 'Commercial usage rights')),
        JSON_OBJECT('name', 'Pro', 'price', 60, 'period', 'month', 'features', JSON_ARRAY('~30 fast hours', 'Stealth mode (private images)', '12 concurrent fast jobs')),
        JSON_OBJECT('name', 'Mega', 'price', 120, 'period', 'month', 'features', JSON_ARRAY('~60 fast hours', 'Stealth + max concurrency', 'Priority queue'))
      ),
  integrations        = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Discord', 'website', 'https://discord.com', 'description', 'The primary interface for Midjourney prompts and community sharing.'),
        JSON_OBJECT('name', 'Web alpha', 'website', 'https://www.midjourney.com', 'description', 'Browser-based prompt + gallery for any subscriber.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Community forum', 'Discord community'),
  training_options    = JSON_ARRAY('Documentation', 'Video tutorials', 'Community examples', 'Prompt library'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY(),
  faqs                = JSON_ARRAY(
        
        JSON_OBJECT('question', 'Does Midjourney have a free trial?', 'answer', 'Midjourney does not currently offer a free trial — the Basic plan starts at $10/month.'),
        JSON_OBJECT('question', 'What is Stealth Mode?', 'answer', 'Stealth Mode keeps generated images private; available on Pro and Mega plans only.'),
        JSON_OBJECT('question', 'Can I use Midjourney images commercially?', 'answer', 'Yes — paid plans on Midjourney grant commercial usage rights. Verify the latest license terms before enterprise use.'),
        JSON_OBJECT('question', 'Does Midjourney support image-to-image?', 'answer', 'Most modern Midjourney workflows support image-to-image, style references, and prompt-based remixing.'),
        JSON_OBJECT('question', 'What aspect ratios are supported?', 'answer', 'Standard square, portrait, landscape, and cinematic widescreen ratios; high-res upscale options on most plans.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — programmatic access is available on developer plans for batch generation and integrations.')
      ),
  pros                = JSON_ARRAY('Best-in-class painterly + photoreal output', 'Distinctive recognisable aesthetic', 'Vary tools enable rapid iteration', 'Frequent model updates', 'Active creator community', 'Browser-based — no install needed'),
  cons                = JSON_ARRAY('Discord-first interface still in transition', 'No free tier', 'Strict community policies', 'Subscription required for serious use', 'Some content limits / safety filters'),
  starting_price      = 10,
  starting_price_period = 'month',
  has_free_trial      = 0,
  has_free_version    = 0,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'midjourney';

-- stability-ai
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Open weights', 'Stable Diffusion', 'Foundation models'),
  industries_served   = JSON_ARRAY('Marketing & Advertising', 'Design Agencies', 'Film & Production', 'Game Development', 'Publishing & Editorial', 'Creator Economy', 'E-commerce', 'Education'),
  use_cases           = JSON_ARRAY('Concept art', 'Marketing visuals', 'Mood boards', 'Editorial illustration', 'Character design', 'Style exploration', 'Storyboarding', 'Product mockups'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Stable Diffusion 3 / 3.5 models', 'Stable Video Diffusion', 'Stable Audio', 'Open weights for self-hosting', 'Stable Image Ultra API', 'Stable Image Core API', 'Inpaint + outpaint endpoints', 'Image-to-video API', 'Commercial licensing tiers', 'Hugging Face distribution'),
  features            = JSON_ARRAY('Stable Diffusion 3 / 3.5 models', 'Stable Video Diffusion', 'Stable Audio', 'Open weights for self-hosting', 'Stable Image Ultra API', 'Stable Image Core API', 'Inpaint + outpaint endpoints', 'Image-to-video API', 'Commercial licensing tiers', 'Hugging Face distribution'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Self-host (open)', 'price', 0, 'period', 'one-time', 'features', JSON_ARRAY('Free for research and non-commercial use', 'Community licence', 'Run on your own GPUs')),
        JSON_OBJECT('name', 'API credits', 'price', 10, 'period', 'one-time', 'features', JSON_ARRAY('Pay-as-you-go API credits', 'Image, video, audio endpoints')),
        JSON_OBJECT('name', 'Enterprise', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Volume API pricing', 'Custom model licensing', 'Dedicated support and SLAs'))
      ),
  integrations        = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Hugging Face', 'website', 'https://huggingface.co', 'description', 'Primary distribution channel for Stable Diffusion weights and demos.'),
        JSON_OBJECT('name', 'Stability API', 'website', 'https://platform.stability.ai', 'description', 'Direct REST API for image, video, and audio generation.'),
        JSON_OBJECT('name', 'ComfyUI', 'website', 'https://www.comfy.org', 'description', 'Popular open-source node graph editor used with Stable Diffusion.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Community forum', 'Discord community'),
  training_options    = JSON_ARRAY('Documentation', 'Video tutorials', 'Community examples', 'Prompt library'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY(),
  faqs                = JSON_ARRAY(
        
        JSON_OBJECT('question', 'Is Stable Diffusion really free?', 'answer', 'Yes — the open weights are free under the Stability AI Community Licence for research and non-commercial use.'),
        JSON_OBJECT('question', 'Do I need a licence for commercial use?', 'answer', 'Stability offers a tiered commercial licence based on company revenue and use case.'),
        JSON_OBJECT('question', 'Can I use Stability Ai images commercially?', 'answer', 'Yes — paid plans on Stability Ai grant commercial usage rights. Verify the latest license terms before enterprise use.'),
        JSON_OBJECT('question', 'Does Stability Ai support image-to-image?', 'answer', 'Most modern Stability Ai workflows support image-to-image, style references, and prompt-based remixing.'),
        JSON_OBJECT('question', 'What aspect ratios are supported?', 'answer', 'Standard square, portrait, landscape, and cinematic widescreen ratios; high-res upscale options on most plans.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — programmatic access is available on developer plans for batch generation and integrations.')
      ),
  pros                = JSON_ARRAY('Truly open weights — self-host anywhere', 'Foundation of a huge ecosystem', 'Generous research licence', 'Frequent model updates', 'Active creator community', 'Browser-based — no install needed'),
  cons                = JSON_ARRAY('Commercial licence required at scale', 'No polished consumer app — devs assemble it', 'Subscription required for serious use', 'Some content limits / safety filters'),
  starting_price      = 0,
  starting_price_period = 'one-time',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'stability-ai';

-- adobe-firefly
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Commercially safe', 'Creative Cloud', 'Generative AI'),
  industries_served   = JSON_ARRAY('Marketing & Advertising', 'Design Agencies', 'Film & Production', 'Game Development', 'Publishing & Editorial', 'Creator Economy', 'E-commerce', 'Education'),
  use_cases           = JSON_ARRAY('Concept art', 'Marketing visuals', 'Mood boards', 'Editorial illustration', 'Character design', 'Style exploration', 'Storyboarding', 'Product mockups'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Text-to-image (Firefly Image 3)', 'Generative Fill (Photoshop)', 'Generative Recolor (Illustrator)', 'Generative Expand', 'Text-to-vector', 'Firefly Video', 'Trained on Adobe Stock + public domain', 'Commercial-safe output', 'Native Creative Cloud integration', 'Style and structure references'),
  features            = JSON_ARRAY('Text-to-image (Firefly Image 3)', 'Generative Fill (Photoshop)', 'Generative Recolor (Illustrator)', 'Generative Expand', 'Text-to-vector', 'Firefly Video', 'Trained on Adobe Stock + public domain', 'Commercial-safe output', 'Native Creative Cloud integration', 'Style and structure references'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('25 generative credits/mo', 'Watermarked in some flows', 'Trial of premium features')),
        JSON_OBJECT('name', 'Firefly Standard', 'price', 9.99, 'period', 'month', 'features', JSON_ARRAY('2,000 credits/mo', 'Premium features', 'Commercial usage')),
        JSON_OBJECT('name', 'Firefly Pro', 'price', 29.99, 'period', 'month', 'features', JSON_ARRAY('7,000 credits/mo', 'Priority access', 'Premium features')),
        JSON_OBJECT('name', 'Creative Cloud All Apps', 'price', 59.99, 'period', 'month', 'features', JSON_ARRAY('Firefly included', 'All Adobe creative apps', 'Cloud storage'))
      ),
  integrations        = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Adobe Photoshop', 'website', 'https://www.adobe.com/products/photoshop.html', 'description', 'Generative Fill, Expand, Remove powered by Firefly.'),
        JSON_OBJECT('name', 'Adobe Illustrator', 'website', 'https://www.adobe.com/products/illustrator.html', 'description', 'Generative Recolor and text-to-vector workflows.'),
        JSON_OBJECT('name', 'Adobe Express', 'website', 'https://www.adobe.com/express/', 'description', 'Quick consumer-grade generative templates.'),
        JSON_OBJECT('name', 'Adobe Stock', 'website', 'https://stock.adobe.com', 'description', 'Licensed training data plus generated-asset library.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Community forum', 'Discord community'),
  training_options    = JSON_ARRAY('Documentation', 'Video tutorials', 'Community examples', 'Prompt library'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY(),
  faqs                = JSON_ARRAY(
        
        JSON_OBJECT('question', 'Is Firefly safe for commercial use?', 'answer', 'Yes — Firefly is trained exclusively on Adobe Stock + public-domain content, with IP indemnification on enterprise plans.'),
        JSON_OBJECT('question', 'Is Firefly included in Creative Cloud?', 'answer', 'Creative Cloud All Apps includes Firefly credits; standalone Firefly subscriptions are also available.'),
        JSON_OBJECT('question', 'Can I use Adobe Firefly images commercially?', 'answer', 'Yes — paid plans on Adobe Firefly grant commercial usage rights. Verify the latest license terms before enterprise use.'),
        JSON_OBJECT('question', 'Does Adobe Firefly support image-to-image?', 'answer', 'Most modern Adobe Firefly workflows support image-to-image, style references, and prompt-based remixing.'),
        JSON_OBJECT('question', 'What aspect ratios are supported?', 'answer', 'Standard square, portrait, landscape, and cinematic widescreen ratios; high-res upscale options on most plans.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — programmatic access is available on developer plans for batch generation and integrations.')
      ),
  pros                = JSON_ARRAY('Commercially safe — licensed training data', 'Deep Creative Cloud integration', 'Familiar Adobe UX', 'Frequent model updates', 'Active creator community', 'Browser-based — no install needed'),
  cons                = JSON_ARRAY('Subscription stack can get expensive', 'Output quality still behind Midjourney for some styles', 'Subscription required for serious use', 'Some content limits / safety filters'),
  starting_price      = 9.99,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 1,
  has_android_app     = 1
WHERE slug = 'adobe-firefly';

-- dall-e
UPDATE submissions SET
  header_tags         = JSON_ARRAY('OpenAI', 'ChatGPT-native', 'Multimodal'),
  industries_served   = JSON_ARRAY('Marketing & Advertising', 'Design Agencies', 'Film & Production', 'Game Development', 'Publishing & Editorial', 'Creator Economy', 'E-commerce', 'Education'),
  use_cases           = JSON_ARRAY('Concept art', 'Marketing visuals', 'Mood boards', 'Editorial illustration', 'Character design', 'Style exploration', 'Storyboarding', 'Product mockups'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('DALL-E 3 model', 'Native ChatGPT integration', 'Instruction-following prompts', 'Iterate via chat replies', 'Aspect ratio control', 'High-fidelity text rendering', 'API for developers', 'Safety guardrails', 'Image variations', 'In-painting tools'),
  features            = JSON_ARRAY('DALL-E 3 model', 'Native ChatGPT integration', 'Instruction-following prompts', 'Iterate via chat replies', 'Aspect ratio control', 'High-fidelity text rendering', 'API for developers', 'Safety guardrails', 'Image variations', 'In-painting tools'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Free (ChatGPT)', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('Limited DALL-E 3 generations via free ChatGPT', 'Standard quality')),
        JSON_OBJECT('name', 'ChatGPT Plus', 'price', 20, 'period', 'month', 'features', JSON_ARRAY('Higher DALL-E 3 usage', 'Voice mode + advanced features')),
        JSON_OBJECT('name', 'API pay-as-you-go', 'price', NULL, 'period', 'usage', 'features', JSON_ARRAY('~$0.04 per 1024x1024 standard image', '~$0.08 per 1024x1024 HD image'))
      ),
  integrations        = JSON_ARRAY(
        
        JSON_OBJECT('name', 'ChatGPT', 'website', 'https://chat.openai.com', 'description', 'Native DALL-E 3 integration — prompt in plain chat.'),
        JSON_OBJECT('name', 'OpenAI API', 'website', 'https://platform.openai.com', 'description', 'Direct image generation endpoint for developers.'),
        JSON_OBJECT('name', 'Microsoft Designer', 'website', 'https://designer.microsoft.com', 'description', 'Embeds DALL-E for image generation.'),
        JSON_OBJECT('name', 'Bing Image Creator', 'website', 'https://www.bing.com/images/create', 'description', 'Free public DALL-E access via Microsoft.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Community forum', 'Discord community'),
  training_options    = JSON_ARRAY('Documentation', 'Video tutorials', 'Community examples', 'Prompt library'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY(),
  faqs                = JSON_ARRAY(
        
        JSON_OBJECT('question', 'How do I access DALL-E?', 'answer', 'Use ChatGPT (free or Plus), Microsoft Designer/Bing Image Creator, or call the OpenAI API directly.'),
        JSON_OBJECT('question', 'Is commercial use allowed?', 'answer', 'Yes — images generated via ChatGPT or the OpenAI API can be used commercially per OpenAI Terms.'),
        JSON_OBJECT('question', 'Can I use Dall E images commercially?', 'answer', 'Yes — paid plans on Dall E grant commercial usage rights. Verify the latest license terms before enterprise use.'),
        JSON_OBJECT('question', 'Does Dall E support image-to-image?', 'answer', 'Most modern Dall E workflows support image-to-image, style references, and prompt-based remixing.'),
        JSON_OBJECT('question', 'What aspect ratios are supported?', 'answer', 'Standard square, portrait, landscape, and cinematic widescreen ratios; high-res upscale options on most plans.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — programmatic access is available on developer plans for batch generation and integrations.')
      ),
  pros                = JSON_ARRAY('Tightly integrated with ChatGPT', 'Excellent instruction-following', 'Best-in-class for accurate text rendering', 'Frequent model updates', 'Active creator community', 'Browser-based — no install needed'),
  cons                = JSON_ARRAY('Stricter safety filters than competitors', 'Less stylistic range than Midjourney', 'Subscription required for serious use', 'Some content limits / safety filters'),
  starting_price      = 20,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 1,
  has_android_app     = 1
WHERE slug = 'dall-e';

-- leonardo-ai
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Game assets', 'Fine-tuned models', 'Creator suite'),
  industries_served   = JSON_ARRAY('Marketing & Advertising', 'Design Agencies', 'Film & Production', 'Game Development', 'Publishing & Editorial', 'Creator Economy', 'E-commerce', 'Education'),
  use_cases           = JSON_ARRAY('Concept art', 'Marketing visuals', 'Mood boards', 'Editorial illustration', 'Character design', 'Style exploration', 'Storyboarding', 'Product mockups'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Phoenix 1.0 model', 'Realtime Canvas', 'Image Guidance / Image-to-Image', 'Custom model training', 'Marketing-image presets', 'Photoshoot mode for products', 'Motion (image-to-video)', '3D texture generator', 'Universal Upscaler', 'AI generation API'),
  features            = JSON_ARRAY('Phoenix 1.0 model', 'Realtime Canvas', 'Image Guidance / Image-to-Image', 'Custom model training', 'Marketing-image presets', 'Photoshoot mode for products', 'Motion (image-to-video)', '3D texture generator', 'Universal Upscaler', 'AI generation API'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('~150 fast tokens/day', 'Public generations', 'Standard models')),
        JSON_OBJECT('name', 'Apprentice', 'price', 12, 'period', 'month', 'features', JSON_ARRAY('8,500 fast tokens/mo', 'Private generations', 'No daily reset gap')),
        JSON_OBJECT('name', 'Artisan', 'price', 30, 'period', 'month', 'features', JSON_ARRAY('25,000 fast tokens/mo', 'Private + Universal Upscaler', 'Higher concurrency')),
        JSON_OBJECT('name', 'Maestro', 'price', 60, 'period', 'month', 'features', JSON_ARRAY('60,000 fast tokens/mo', 'Premium model access', 'Highest concurrency'))
      ),
  integrations        = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Canva', 'website', 'https://www.canva.com', 'description', 'Leonardo joined the Canva family — integrations expanding into the Canva suite.'),
        JSON_OBJECT('name', 'API', 'website', 'https://leonardo.ai/api', 'description', 'REST API for image, video, and 3D texture generation.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Community forum', 'Discord community'),
  training_options    = JSON_ARRAY('Documentation', 'Video tutorials', 'Community examples', 'Prompt library'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY(),
  faqs                = JSON_ARRAY(
        
        JSON_OBJECT('question', 'Is Leonardo good for game assets?', 'answer', 'Yes — Leonardo is widely used by indie game studios for concept art, tilesets, and character variations.'),
        JSON_OBJECT('question', 'Can I train my own model?', 'answer', 'Yes — Apprentice tier and above support uploading reference sets to train a custom fine-tuned model.'),
        JSON_OBJECT('question', 'Can I use Leonardo Ai images commercially?', 'answer', 'Yes — paid plans on Leonardo Ai grant commercial usage rights. Verify the latest license terms before enterprise use.'),
        JSON_OBJECT('question', 'Does Leonardo Ai support image-to-image?', 'answer', 'Most modern Leonardo Ai workflows support image-to-image, style references, and prompt-based remixing.'),
        JSON_OBJECT('question', 'What aspect ratios are supported?', 'answer', 'Standard square, portrait, landscape, and cinematic widescreen ratios; high-res upscale options on most plans.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — programmatic access is available on developer plans for batch generation and integrations.')
      ),
  pros                = JSON_ARRAY('Tailored fine-tuned models per niche', 'Strong free tier', 'Realtime canvas is excellent', 'Frequent model updates', 'Active creator community', 'Browser-based — no install needed'),
  cons                = JSON_ARRAY('Cluttered UI for beginners', 'Some advanced features gated behind higher tiers', 'Subscription required for serious use', 'Some content limits / safety filters'),
  starting_price      = 12,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'leonardo-ai';

-- ideogram
UPDATE submissions SET
  header_tags         = JSON_ARRAY('In-image text', 'Posters', 'Typography'),
  industries_served   = JSON_ARRAY('Marketing & Advertising', 'Design Agencies', 'Film & Production', 'Game Development', 'Publishing & Editorial', 'Creator Economy', 'E-commerce', 'Education'),
  use_cases           = JSON_ARRAY('Concept art', 'Marketing visuals', 'Mood boards', 'Editorial illustration', 'Character design', 'Style exploration', 'Storyboarding', 'Product mockups'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Best-in-class in-image text', 'Ideogram 2.0 / 3.0 models', 'Magic Prompt enhancement', 'Style references', 'Image-to-image', 'High-resolution output', 'Negative prompts', 'Multiple aspect ratios', 'Brand kit (Pro+)', 'Mobile app'),
  features            = JSON_ARRAY('Best-in-class in-image text', 'Ideogram 2.0 / 3.0 models', 'Magic Prompt enhancement', 'Style references', 'Image-to-image', 'High-resolution output', 'Negative prompts', 'Multiple aspect ratios', 'Brand kit (Pro+)', 'Mobile app'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('25 prompts/day', 'Standard quality', 'Public-only generations')),
        JSON_OBJECT('name', 'Basic', 'price', 8, 'period', 'month', 'features', JSON_ARRAY('400 priority generations/mo', 'Unlimited slow generations', 'Private generations')),
        JSON_OBJECT('name', 'Plus', 'price', 20, 'period', 'month', 'features', JSON_ARRAY('1,000 priority gens/mo', 'Brand styles', 'Higher resolution')),
        JSON_OBJECT('name', 'Pro', 'price', 60, 'period', 'month', 'features', JSON_ARRAY('3,000 priority gens/mo', 'Full brand kit', 'API access'))
      ),
  integrations        = JSON_ARRAY(
        
        JSON_OBJECT('name', 'API', 'website', 'https://ideogram.ai/api', 'description', 'Programmatic image generation with full Ideogram parameters.'),
        JSON_OBJECT('name', 'iOS app', 'website', 'https://apps.apple.com', 'description', 'Generate on the go from iPhone.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Community forum', 'Discord community'),
  training_options    = JSON_ARRAY('Documentation', 'Video tutorials', 'Community examples', 'Prompt library'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY(),
  faqs                = JSON_ARRAY(
        
        JSON_OBJECT('question', 'Why is Ideogram good for posters?', 'answer', 'Ideogram is uniquely strong at rendering legible, on-prompt text inside images — perfect for posters, ads, and mockups.'),
        JSON_OBJECT('question', 'Does Ideogram have an API?', 'answer', 'Yes — full API access is available on the Pro tier.'),
        JSON_OBJECT('question', 'Can I use Ideogram images commercially?', 'answer', 'Yes — paid plans on Ideogram grant commercial usage rights. Verify the latest license terms before enterprise use.'),
        JSON_OBJECT('question', 'Does Ideogram support image-to-image?', 'answer', 'Most modern Ideogram workflows support image-to-image, style references, and prompt-based remixing.'),
        JSON_OBJECT('question', 'What aspect ratios are supported?', 'answer', 'Standard square, portrait, landscape, and cinematic widescreen ratios; high-res upscale options on most plans.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — programmatic access is available on developer plans for batch generation and integrations.')
      ),
  pros                = JSON_ARRAY('Best in-image text rendering in the category', 'Generous free tier', 'Clean UI', 'Frequent model updates', 'Active creator community', 'Browser-based — no install needed'),
  cons                = JSON_ARRAY('Smaller community than Midjourney', 'Style range narrower than top players', 'Subscription required for serious use', 'Some content limits / safety filters'),
  starting_price      = 8,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 1,
  has_android_app     = 0
WHERE slug = 'ideogram';

-- krea-ai
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Realtime canvas', 'Live generation', 'Design'),
  industries_served   = JSON_ARRAY('Marketing & Advertising', 'Design Agencies', 'Film & Production', 'Game Development', 'Publishing & Editorial', 'Creator Economy', 'E-commerce', 'Education'),
  use_cases           = JSON_ARRAY('Concept art', 'Marketing visuals', 'Mood boards', 'Editorial illustration', 'Character design', 'Style exploration', 'Storyboarding', 'Product mockups'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Realtime image generation', 'Enhance (real-time upscale)', 'Video generation', 'Train custom styles', 'Image-to-image', '3D reference workflow', 'Lottie / vector export', 'Flux + Stable Diffusion engines', 'API access', 'Krea Chat'),
  features            = JSON_ARRAY('Realtime image generation', 'Enhance (real-time upscale)', 'Video generation', 'Train custom styles', 'Image-to-image', '3D reference workflow', 'Lottie / vector export', 'Flux + Stable Diffusion engines', 'API access', 'Krea Chat'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('Limited daily generations', 'Standard speed', 'Public generations')),
        JSON_OBJECT('name', 'Basic', 'price', 10, 'period', 'month', 'features', JSON_ARRAY('1,000 monthly generations', 'Realtime priority', 'Private generations')),
        JSON_OBJECT('name', 'Pro', 'price', 35, 'period', 'month', 'features', JSON_ARRAY('10,000 monthly generations', 'Highest priority', 'API access'))
      ),
  integrations        = JSON_ARRAY(
        
        JSON_OBJECT('name', 'API', 'website', 'https://www.krea.ai/api', 'description', 'Programmatic access to Krea generation endpoints.'),
        JSON_OBJECT('name', 'Figma', 'website', 'https://www.figma.com', 'description', 'Plugin embeds Krea generation in Figma designs.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Community forum', 'Discord community'),
  training_options    = JSON_ARRAY('Documentation', 'Video tutorials', 'Community examples', 'Prompt library'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY(),
  faqs                = JSON_ARRAY(
        
        JSON_OBJECT('question', 'What is Realtime mode?', 'answer', 'Realtime mode regenerates the image as you sketch or edit prompts — sub-second feedback for design exploration.'),
        JSON_OBJECT('question', 'Can Krea train custom styles?', 'answer', 'Yes — upload reference images to fine-tune a personal style.'),
        JSON_OBJECT('question', 'Can I use Krea Ai images commercially?', 'answer', 'Yes — paid plans on Krea Ai grant commercial usage rights. Verify the latest license terms before enterprise use.'),
        JSON_OBJECT('question', 'Does Krea Ai support image-to-image?', 'answer', 'Most modern Krea Ai workflows support image-to-image, style references, and prompt-based remixing.'),
        JSON_OBJECT('question', 'What aspect ratios are supported?', 'answer', 'Standard square, portrait, landscape, and cinematic widescreen ratios; high-res upscale options on most plans.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — programmatic access is available on developer plans for batch generation and integrations.')
      ),
  pros                = JSON_ARRAY('Real-time canvas changes how you prototype', 'Pleasant designer-focused UI', 'Fast iteration loop', 'Frequent model updates', 'Active creator community', 'Browser-based — no install needed'),
  cons                = JSON_ARRAY('Limited free tier', 'Requires modern GPU for best realtime experience', 'Subscription required for serious use', 'Some content limits / safety filters'),
  starting_price      = 10,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'krea-ai';

-- recraft
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Vector output', 'Brand kits', 'Design'),
  industries_served   = JSON_ARRAY('Marketing & Advertising', 'Design Agencies', 'Film & Production', 'Game Development', 'Publishing & Editorial', 'Creator Economy', 'E-commerce', 'Education'),
  use_cases           = JSON_ARRAY('Concept art', 'Marketing visuals', 'Mood boards', 'Editorial illustration', 'Character design', 'Style exploration', 'Storyboarding', 'Product mockups'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Recraft V3 model', 'Vector (SVG) output', 'Consistent style sets', 'Accurate in-image text', 'Brand kit and style locking', 'Icon set generation', 'Mockup generation', 'Image upscaler', 'Background generation', 'API access'),
  features            = JSON_ARRAY('Recraft V3 model', 'Vector (SVG) output', 'Consistent style sets', 'Accurate in-image text', 'Brand kit and style locking', 'Icon set generation', 'Mockup generation', 'Image upscaler', 'Background generation', 'API access'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('100 credits/day', 'Public projects', 'Standard speed')),
        JSON_OBJECT('name', 'Basic', 'price', 12, 'period', 'month', 'features', JSON_ARRAY('1,000 credits/mo', 'Private projects', 'Vector exports')),
        JSON_OBJECT('name', 'Advanced', 'price', 33, 'period', 'month', 'features', JSON_ARRAY('7,500 credits/mo', 'Style training', 'Higher resolution')),
        JSON_OBJECT('name', 'Pro', 'price', 60, 'period', 'month', 'features', JSON_ARRAY('Higher monthly credits', 'API access', 'Priority support'))
      ),
  integrations        = JSON_ARRAY(
        
        JSON_OBJECT('name', 'API', 'website', 'https://www.recraft.ai/api', 'description', 'Generate vector and raster images via REST API.'),
        JSON_OBJECT('name', 'Figma', 'website', 'https://www.figma.com', 'description', 'Recraft plugin for in-canvas generation.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Community forum', 'Discord community'),
  training_options    = JSON_ARRAY('Documentation', 'Video tutorials', 'Community examples', 'Prompt library'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY(),
  faqs                = JSON_ARRAY(
        
        JSON_OBJECT('question', 'Can Recraft really output vectors?', 'answer', 'Yes — Recraft is one of the few generative tools that exports clean SVGs ready for design tools.'),
        JSON_OBJECT('question', 'Is Recraft good for brand work?', 'answer', 'Yes — it specialises in consistent styles, brand kits, and icon sets for design teams.'),
        JSON_OBJECT('question', 'Can I use Recraft images commercially?', 'answer', 'Yes — paid plans on Recraft grant commercial usage rights. Verify the latest license terms before enterprise use.'),
        JSON_OBJECT('question', 'Does Recraft support image-to-image?', 'answer', 'Most modern Recraft workflows support image-to-image, style references, and prompt-based remixing.'),
        JSON_OBJECT('question', 'What aspect ratios are supported?', 'answer', 'Standard square, portrait, landscape, and cinematic widescreen ratios; high-res upscale options on most plans.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — programmatic access is available on developer plans for batch generation and integrations.')
      ),
  pros                = JSON_ARRAY('Native vector output — rare in this category', 'Consistent brand styles', 'Designer-first workflow', 'Frequent model updates', 'Active creator community', 'Browser-based — no install needed'),
  cons                = JSON_ARRAY('Smaller community vs Midjourney', 'Limited photoreal range vs other tools', 'Subscription required for serious use', 'Some content limits / safety filters'),
  starting_price      = 12,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'recraft';

-- playground-ai
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Free image gen', 'Open models', 'Hobbyist-friendly'),
  industries_served   = JSON_ARRAY('Marketing & Advertising', 'Design Agencies', 'Film & Production', 'Game Development', 'Publishing & Editorial', 'Creator Economy', 'E-commerce', 'Education'),
  use_cases           = JSON_ARRAY('Concept art', 'Marketing visuals', 'Mood boards', 'Editorial illustration', 'Character design', 'Style exploration', 'Storyboarding', 'Product mockups'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Playground v2.5 + v3 models', 'Stable Diffusion + Flux engines', 'Free generous tier', 'Mixed Image Editor', 'Filter and style presets', 'Aspect ratio control', 'Image-to-image', 'Inpainting', 'Prompt remixing', 'API access'),
  features            = JSON_ARRAY('Playground v2.5 + v3 models', 'Stable Diffusion + Flux engines', 'Free generous tier', 'Mixed Image Editor', 'Filter and style presets', 'Aspect ratio control', 'Image-to-image', 'Inpainting', 'Prompt remixing', 'API access'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('500 images/day free', 'All community models', 'Standard speed')),
        JSON_OBJECT('name', 'Pro', 'price', 12, 'period', 'month', 'features', JSON_ARRAY('Higher daily quotas', 'Premium models', 'Faster generation')),
        JSON_OBJECT('name', 'Pro Annual', 'price', 102, 'period', 'year', 'features', JSON_ARRAY('Same as Pro at ~$8.50/mo', 'Best value'))
      ),
  integrations        = JSON_ARRAY(
        
        JSON_OBJECT('name', 'API', 'website', 'https://playground.com/api', 'description', 'Programmatic access for developers.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Community forum', 'Discord community'),
  training_options    = JSON_ARRAY('Documentation', 'Video tutorials', 'Community examples', 'Prompt library'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY(),
  faqs                = JSON_ARRAY(
        
        JSON_OBJECT('question', 'Is Playground really free?', 'answer', 'Yes — Playground offers up to 500 free images per day on standard speed, no credit card.'),
        JSON_OBJECT('question', 'What models can I use?', 'answer', 'Playground v2.5/v3, Stable Diffusion variants, and Flux models are all available.'),
        JSON_OBJECT('question', 'Can I use Playground Ai images commercially?', 'answer', 'Yes — paid plans on Playground Ai grant commercial usage rights. Verify the latest license terms before enterprise use.'),
        JSON_OBJECT('question', 'Does Playground Ai support image-to-image?', 'answer', 'Most modern Playground Ai workflows support image-to-image, style references, and prompt-based remixing.'),
        JSON_OBJECT('question', 'What aspect ratios are supported?', 'answer', 'Standard square, portrait, landscape, and cinematic widescreen ratios; high-res upscale options on most plans.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — programmatic access is available on developer plans for batch generation and integrations.')
      ),
  pros                = JSON_ARRAY('Generous free tier', 'Multiple model engines in one UI', 'Active hobbyist community', 'Frequent model updates', 'Active creator community', 'Browser-based — no install needed'),
  cons                = JSON_ARRAY('Quality varies by model', 'UI can feel overwhelming for beginners', 'Subscription required for serious use', 'Some content limits / safety filters'),
  starting_price      = 12,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'playground-ai';

-- flux-black-forest-labs
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Open weights', 'Frontier model', 'Flux'),
  industries_served   = JSON_ARRAY('Marketing & Advertising', 'Design Agencies', 'Film & Production', 'Game Development', 'Publishing & Editorial', 'Creator Economy', 'E-commerce', 'Education'),
  use_cases           = JSON_ARRAY('Concept art', 'Marketing visuals', 'Mood boards', 'Editorial illustration', 'Character design', 'Style exploration', 'Storyboarding', 'Product mockups'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Flux.1 schnell (free, open)', 'Flux.1 dev (open research)', 'Flux.1 pro (commercial)', 'Flux.1.1 pro state-of-the-art', 'Photoreal output quality', 'Text rendering competence', 'Hugging Face distribution', 'API via Replicate / fal / Together', 'Self-host on 24GB+ GPU', 'Frequent model updates'),
  features            = JSON_ARRAY('Flux.1 schnell (free, open)', 'Flux.1 dev (open research)', 'Flux.1 pro (commercial)', 'Flux.1.1 pro state-of-the-art', 'Photoreal output quality', 'Text rendering competence', 'Hugging Face distribution', 'API via Replicate / fal / Together', 'Self-host on 24GB+ GPU', 'Frequent model updates'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Schnell (open)', 'price', 0, 'period', 'one-time', 'features', JSON_ARRAY('Apache 2.0 — free for commercial use', 'Self-host or via partner APIs')),
        JSON_OBJECT('name', 'Dev (open research)', 'price', 0, 'period', 'one-time', 'features', JSON_ARRAY('Free for non-commercial use', 'Best open-weight image model')),
        JSON_OBJECT('name', 'Pro (commercial API)', 'price', NULL, 'period', 'usage', 'features', JSON_ARRAY('Pay-as-you-go via partner APIs (~$0.025-$0.05 per image)', 'Flux.1.1 pro for highest quality'))
      ),
  integrations        = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Hugging Face', 'website', 'https://huggingface.co/black-forest-labs', 'description', 'Primary distribution channel for Flux model weights.'),
        JSON_OBJECT('name', 'Replicate', 'website', 'https://replicate.com', 'description', 'Hosted Flux endpoints for production use.'),
        JSON_OBJECT('name', 'fal.ai', 'website', 'https://fal.ai', 'description', 'Fast Flux inference for developers.'),
        JSON_OBJECT('name', 'Together AI', 'website', 'https://www.together.ai', 'description', 'Hosted Flux pro / dev / schnell inference.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Community forum', 'Discord community'),
  training_options    = JSON_ARRAY('Documentation', 'Video tutorials', 'Community examples', 'Prompt library'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY(),
  faqs                = JSON_ARRAY(
        
        JSON_OBJECT('question', 'Who made Flux?', 'answer', 'Black Forest Labs — the original Stable Diffusion research team led by Robin Rombach, founded after they left Stability AI in 2024.'),
        JSON_OBJECT('question', 'Is Flux better than Stable Diffusion?', 'answer', 'Flux models are widely considered the best open-weight image generators available, surpassing SDXL on most benchmarks.'),
        JSON_OBJECT('question', 'Can I use Flux Black Forest Labs images commercially?', 'answer', 'Yes — paid plans on Flux Black Forest Labs grant commercial usage rights. Verify the latest license terms before enterprise use.'),
        JSON_OBJECT('question', 'Does Flux Black Forest Labs support image-to-image?', 'answer', 'Most modern Flux Black Forest Labs workflows support image-to-image, style references, and prompt-based remixing.'),
        JSON_OBJECT('question', 'What aspect ratios are supported?', 'answer', 'Standard square, portrait, landscape, and cinematic widescreen ratios; high-res upscale options on most plans.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — programmatic access is available on developer plans for batch generation and integrations.')
      ),
  pros                = JSON_ARRAY('Frontier-grade quality from the original Stable Diffusion team', 'Open weights for free tiers', 'Strong ecosystem of hosting partners', 'Frequent model updates', 'Active creator community', 'Browser-based — no install needed'),
  cons                = JSON_ARRAY('No consumer-facing app — devs use partner APIs', 'Pro variant requires commercial licence at scale', 'Subscription required for serious use', 'Some content limits / safety filters'),
  starting_price      = 0,
  starting_price_period = 'one-time',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'flux-black-forest-labs';

-- runway
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Text-to-video', 'Image-to-video', 'VFX'),
  industries_served   = JSON_ARRAY('Marketing & Advertising', 'Film & Production', 'Education', 'Corporate Training', 'Creator Economy', 'Gaming', 'Real Estate'),
  use_cases           = JSON_ARRAY('Marketing reels', 'Storyboard previs', 'Product demos', 'Training videos', 'Social content', 'Concept films', 'Music videos'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Gen-3 Alpha model', 'Gen-3 Alpha Turbo', 'Image-to-video', 'Text-to-video', 'Motion brush — paint motion paths', 'Lip-sync (Act-One)', 'Performance-to-character (Act-One)', 'Inpainting & remove tools', 'Camera control', 'API access'),
  features            = JSON_ARRAY('Gen-3 Alpha model', 'Gen-3 Alpha Turbo', 'Image-to-video', 'Text-to-video', 'Motion brush — paint motion paths', 'Lip-sync (Act-One)', 'Performance-to-character (Act-One)', 'Inpainting & remove tools', 'Camera control', 'API access'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('125 one-time credits', 'Watermarked exports', 'Standard quality')),
        JSON_OBJECT('name', 'Standard', 'price', 15, 'period', 'month', 'features', JSON_ARRAY('625 credits/mo', 'Watermark removed', 'Unlimited Gen-3 Alpha Turbo')),
        JSON_OBJECT('name', 'Pro', 'price', 35, 'period', 'month', 'features', JSON_ARRAY('2250 credits/mo', '4K upscale', 'Custom voices')),
        JSON_OBJECT('name', 'Unlimited', 'price', 95, 'period', 'month', 'features', JSON_ARRAY('Unlimited Gen-3 Alpha Turbo in Relaxed', 'Pro features included')),
        JSON_OBJECT('name', 'Enterprise', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Custom credits', 'SSO', 'Dedicated support'))
      ),
  integrations        = JSON_ARRAY(
        
        JSON_OBJECT('name', 'API', 'website', 'https://docs.dev.runwayml.com', 'description', 'Gen-3 Alpha / Alpha Turbo via REST API for production use.'),
        JSON_OBJECT('name', 'Webhooks', 'website', 'https://docs.dev.runwayml.com', 'description', 'Async job notifications for long-running generations.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Live chat', 'Knowledge base'),
  training_options    = JSON_ARRAY('Tutorials', 'Documentation', 'Sample prompts', 'Workshops'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY(),
  faqs                = JSON_ARRAY(
        
        JSON_OBJECT('question', 'What is Act-One?', 'answer', 'Act-One transfers a performance from a reference video onto a generated character — facial expressions, head movements, and lip-sync.'),
        JSON_OBJECT('question', 'Can I use Runway for client work?', 'answer', 'Yes — all paid plans grant commercial usage rights.'),
        JSON_OBJECT('question', 'How long can Runway clips be?', 'answer', 'Per-clip length varies by plan — typically 5-10 seconds per generation, with extend / continuation features on higher tiers.'),
        JSON_OBJECT('question', 'Can I upload a reference image?', 'answer', 'Yes — image-to-video is a standard input alongside text prompts.'),
        JSON_OBJECT('question', 'Are generated videos royalty-free for commercial use?', 'answer', 'Paid plans grant commercial-use rights. Check the latest terms for distribution and exclusivity.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — most modern video generators expose an API for batch jobs and product integrations.')
      ),
  pros                = JSON_ARRAY('Hollywood-grade output quality', 'Best VFX feature suite in the category', 'Active product velocity', 'Saves studio time and cost', 'Fast iteration on edits', 'No camera or crew required'),
  cons                = JSON_ARRAY('Credit consumption can spike on complex jobs', 'Steeper learning curve than consumer tools', 'Clip length limits', 'Compute-time / queue waits on high-tier requests'),
  starting_price      = 15,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'runway';

-- pika-labs
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Text-to-video', 'Discord', 'Consumer-friendly'),
  industries_served   = JSON_ARRAY('Marketing & Advertising', 'Film & Production', 'Education', 'Corporate Training', 'Creator Economy', 'Gaming', 'Real Estate'),
  use_cases           = JSON_ARRAY('Marketing reels', 'Storyboard previs', 'Product demos', 'Training videos', 'Social content', 'Concept films', 'Music videos'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Pika 2.0 model', 'Scene Ingredients (multi-image reference)', 'Pikaffects (visual effects)', 'Lip-sync', 'Sound effects integration', 'Image-to-video', 'Extend clips', 'Camera controls', 'Aspect ratio control', 'Discord and web app'),
  features            = JSON_ARRAY('Pika 2.0 model', 'Scene Ingredients (multi-image reference)', 'Pikaffects (visual effects)', 'Lip-sync', 'Sound effects integration', 'Image-to-video', 'Extend clips', 'Camera controls', 'Aspect ratio control', 'Discord and web app'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('80 credits + 30 monthly', 'Watermarked', 'Standard speed')),
        JSON_OBJECT('name', 'Standard', 'price', 8, 'period', 'month', 'features', JSON_ARRAY('700 credits/mo', 'No watermark', 'Standard speed')),
        JSON_OBJECT('name', 'Pro', 'price', 28, 'period', 'month', 'features', JSON_ARRAY('2,300 credits/mo', 'Fast generation', 'Pikaffects access')),
        JSON_OBJECT('name', 'Fancy', 'price', 76, 'period', 'month', 'features', JSON_ARRAY('6,000 credits/mo', 'Priority queue', 'All Pro features'))
      ),
  integrations        = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Discord', 'website', 'https://discord.com', 'description', 'Original interface for Pika prompts and community.'),
        JSON_OBJECT('name', 'Web app', 'website', 'https://pika.art', 'description', 'Full-feature browser interface.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Live chat', 'Knowledge base'),
  training_options    = JSON_ARRAY('Tutorials', 'Documentation', 'Sample prompts', 'Workshops'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY(),
  faqs                = JSON_ARRAY(
        
        JSON_OBJECT('question', 'What are Pikaffects?', 'answer', 'Pikaffects are one-click visual effects (e.g. "explode it", "melt it", "crush it") applied to any clip.'),
        JSON_OBJECT('question', 'How do credits work?', 'answer', 'Each video uses ~10-30 credits depending on length and quality settings.'),
        JSON_OBJECT('question', 'How long can Pika Labs clips be?', 'answer', 'Per-clip length varies by plan — typically 5-10 seconds per generation, with extend / continuation features on higher tiers.'),
        JSON_OBJECT('question', 'Can I upload a reference image?', 'answer', 'Yes — image-to-video is a standard input alongside text prompts.'),
        JSON_OBJECT('question', 'Are generated videos royalty-free for commercial use?', 'answer', 'Paid plans grant commercial-use rights. Check the latest terms for distribution and exclusivity.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — most modern video generators expose an API for batch jobs and product integrations.')
      ),
  pros                = JSON_ARRAY('Fun, playful Pikaffects', 'Strong consumer UX', 'Active iteration on the model', 'Saves studio time and cost', 'Fast iteration on edits', 'No camera or crew required'),
  cons                = JSON_ARRAY('Shorter clip lengths than enterprise tools', 'No dedicated API yet', 'Clip length limits', 'Compute-time / queue waits on high-tier requests'),
  starting_price      = 8,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'pika-labs';

-- synthesia
UPDATE submissions SET
  header_tags         = JSON_ARRAY('AI avatars', 'Corporate training', 'Multilingual'),
  industries_served   = JSON_ARRAY('Marketing & Advertising', 'Film & Production', 'Education', 'Corporate Training', 'Creator Economy', 'Gaming', 'Real Estate'),
  use_cases           = JSON_ARRAY('Marketing reels', 'Storyboard previs', 'Product demos', 'Training videos', 'Social content', 'Concept films', 'Music videos'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('230+ AI avatars', '140+ languages', 'Voice cloning', 'Custom avatar creation', 'Screen recording with AI presenter', 'PDF & PPT import', 'Brand kit', 'Translation of existing videos', 'API for programmatic generation', 'SSO + enterprise security'),
  features            = JSON_ARRAY('230+ AI avatars', '140+ languages', 'Voice cloning', 'Custom avatar creation', 'Screen recording with AI presenter', 'PDF & PPT import', 'Brand kit', 'Translation of existing videos', 'API for programmatic generation', 'SSO + enterprise security'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Starter', 'price', 18, 'period', 'month', 'features', JSON_ARRAY('10 minutes of video/mo', '70+ avatars', '140+ languages')),
        JSON_OBJECT('name', 'Creator', 'price', 64, 'period', 'month', 'features', JSON_ARRAY('30 min/mo', '230+ avatars', 'Brand kit & custom voice')),
        JSON_OBJECT('name', 'Enterprise', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Unlimited videos', 'Custom avatars', 'SSO + SCIM + audit logs'))
      ),
  integrations        = JSON_ARRAY(
        
        JSON_OBJECT('name', 'SCORM export', 'website', 'https://www.synthesia.io', 'description', 'LMS-ready export for corporate training systems.'),
        JSON_OBJECT('name', 'API', 'website', 'https://docs.synthesia.io', 'description', 'Programmatic video generation for product integrations.'),
        JSON_OBJECT('name', 'Zapier', 'website', 'https://zapier.com', 'description', 'Trigger Synthesia videos from 6,000+ apps.'),
        JSON_OBJECT('name', 'Microsoft Teams', 'website', 'https://www.microsoft.com/microsoft-teams', 'description', 'Embed and share Synthesia videos in Teams.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Live chat', 'Knowledge base'),
  training_options    = JSON_ARRAY('Tutorials', 'Documentation', 'Sample prompts', 'Workshops'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY(),
  faqs                = JSON_ARRAY(
        
        JSON_OBJECT('question', 'Can I clone my own voice?', 'answer', 'Yes — voice cloning is available on Creator and Enterprise plans with consent verification.'),
        JSON_OBJECT('question', 'Does Synthesia support SCORM for our LMS?', 'answer', 'Yes — SCORM 1.2 / 2004 exports are supported for corporate training systems.'),
        JSON_OBJECT('question', 'How long can Synthesia clips be?', 'answer', 'Per-clip length varies by plan — typically 5-10 seconds per generation, with extend / continuation features on higher tiers.'),
        JSON_OBJECT('question', 'Can I upload a reference image?', 'answer', 'Yes — image-to-video is a standard input alongside text prompts.'),
        JSON_OBJECT('question', 'Are generated videos royalty-free for commercial use?', 'answer', 'Paid plans grant commercial-use rights. Check the latest terms for distribution and exclusivity.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — most modern video generators expose an API for batch jobs and product integrations.')
      ),
  pros                = JSON_ARRAY('Best-in-class for corporate training & comms', '140+ languages out of the box', 'Enterprise-grade security', 'Saves studio time and cost', 'Fast iteration on edits', 'No camera or crew required'),
  cons                = JSON_ARRAY('Avatar-only — not for VFX or cinematic generation', 'Custom avatar requires studio recording', 'Clip length limits', 'Compute-time / queue waits on high-tier requests'),
  starting_price      = 18,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 0,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'synthesia';

-- heygen
UPDATE submissions SET
  header_tags         = JSON_ARRAY('AI avatars', 'Video translation', 'Lip-sync'),
  industries_served   = JSON_ARRAY('Marketing & Advertising', 'Film & Production', 'Education', 'Corporate Training', 'Creator Economy', 'Gaming', 'Real Estate'),
  use_cases           = JSON_ARRAY('Marketing reels', 'Storyboard previs', 'Product demos', 'Training videos', 'Social content', 'Concept films', 'Music videos'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('300+ AI avatars', 'Instant avatar from selfie video', 'Voice cloning', 'Real-time avatar (Interactive)', 'Video translation with lip-sync', '175+ languages', 'Photo-to-video', 'Talking photo', 'Streaming avatar API', 'Brand kit'),
  features            = JSON_ARRAY('300+ AI avatars', 'Instant avatar from selfie video', 'Voice cloning', 'Real-time avatar (Interactive)', 'Video translation with lip-sync', '175+ languages', 'Photo-to-video', 'Talking photo', 'Streaming avatar API', 'Brand kit'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('3 videos/month, up to 3 min', 'Watermarked', 'Limited avatars')),
        JSON_OBJECT('name', 'Creator', 'price', 24, 'period', 'month', 'features', JSON_ARRAY('Unlimited videos', 'Up to 30 min/video', '15 instant avatars')),
        JSON_OBJECT('name', 'Team', 'price', 69, 'period', 'month', 'features', JSON_ARRAY('Pro features + brand kit', 'Voice cloning', 'Priority support')),
        JSON_OBJECT('name', 'Enterprise', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Custom avatars', 'SSO', 'API access'))
      ),
  integrations        = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Streaming Avatar API', 'website', 'https://docs.heygen.com', 'description', 'Real-time interactive avatars for live experiences.'),
        JSON_OBJECT('name', 'Zapier', 'website', 'https://zapier.com', 'description', 'Automate HeyGen video creation from 6,000+ apps.'),
        JSON_OBJECT('name', 'API', 'website', 'https://docs.heygen.com', 'description', 'Programmatic avatar + video generation.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Live chat', 'Knowledge base'),
  training_options    = JSON_ARRAY('Tutorials', 'Documentation', 'Sample prompts', 'Workshops'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY(),
  faqs                = JSON_ARRAY(
        
        JSON_OBJECT('question', 'What is the video translation feature?', 'answer', 'HeyGen re-dubs and re-lip-syncs an existing video into 175+ languages — the speaker appears to fluently speak the target language.'),
        JSON_OBJECT('question', 'How long does avatar creation take?', 'answer', 'Instant avatars from a 2-minute selfie video are ready in ~5 minutes.'),
        JSON_OBJECT('question', 'How long can Heygen clips be?', 'answer', 'Per-clip length varies by plan — typically 5-10 seconds per generation, with extend / continuation features on higher tiers.'),
        JSON_OBJECT('question', 'Can I upload a reference image?', 'answer', 'Yes — image-to-video is a standard input alongside text prompts.'),
        JSON_OBJECT('question', 'Are generated videos royalty-free for commercial use?', 'answer', 'Paid plans grant commercial-use rights. Check the latest terms for distribution and exclusivity.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — most modern video generators expose an API for batch jobs and product integrations.')
      ),
  pros                = JSON_ARRAY('Best video translation + lip-sync', 'Instant avatars from a phone recording', 'Strong API for product builders', 'Saves studio time and cost', 'Fast iteration on edits', 'No camera or crew required'),
  cons                = JSON_ARRAY('Expensive at enterprise scale', 'Voice clone needs careful prompt engineering', 'Clip length limits', 'Compute-time / queue waits on high-tier requests'),
  starting_price      = 24,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'heygen';

-- d-id
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Talking avatars', 'Image-to-video', 'AI presenters'),
  industries_served   = JSON_ARRAY('Marketing & Advertising', 'Film & Production', 'Education', 'Corporate Training', 'Creator Economy', 'Gaming', 'Real Estate'),
  use_cases           = JSON_ARRAY('Marketing reels', 'Storyboard previs', 'Product demos', 'Training videos', 'Social content', 'Concept films', 'Music videos'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Creative Reality Studio', 'Talking photos from a single image', 'Live Portrait', 'Real-time API for streaming avatars', 'Pre-built presenters', 'Custom presenter from selfie', '120+ languages', 'Voice cloning', 'Express Mode (faster generation)', 'SDK for embed'),
  features            = JSON_ARRAY('Creative Reality Studio', 'Talking photos from a single image', 'Live Portrait', 'Real-time API for streaming avatars', 'Pre-built presenters', 'Custom presenter from selfie', '120+ languages', 'Voice cloning', 'Express Mode (faster generation)', 'SDK for embed'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Trial', 'price', 0, 'period', 'one-time', 'features', JSON_ARRAY('5 minutes of free generation', 'Standard quality')),
        JSON_OBJECT('name', 'Lite', 'price', 5.99, 'period', 'month', 'features', JSON_ARRAY('10 minutes/mo', 'D-ID watermark', 'Standard avatars')),
        JSON_OBJECT('name', 'Pro', 'price', 29, 'period', 'month', 'features', JSON_ARRAY('15 min/mo', 'No watermark', 'Premium voices')),
        JSON_OBJECT('name', 'Advanced', 'price', 196, 'period', 'month', 'features', JSON_ARRAY('100 min/mo', 'Live Portrait', 'API access')),
        JSON_OBJECT('name', 'Enterprise', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Custom rates', 'SLAs', 'On-prem available'))
      ),
  integrations        = JSON_ARRAY(
        
        JSON_OBJECT('name', 'API', 'website', 'https://docs.d-id.com', 'description', 'Real-time and async talking-avatar generation.'),
        JSON_OBJECT('name', 'Microsoft Teams', 'website', 'https://www.microsoft.com/microsoft-teams', 'description', 'Embed D-ID avatars in Teams meetings.'),
        JSON_OBJECT('name', 'Zapier', 'website', 'https://zapier.com', 'description', 'Automate D-ID video creation from 6,000+ apps.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Live chat', 'Knowledge base'),
  training_options    = JSON_ARRAY('Tutorials', 'Documentation', 'Sample prompts', 'Workshops'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY(),
  faqs                = JSON_ARRAY(
        
        JSON_OBJECT('question', 'Can I make an avatar from one photo?', 'answer', 'Yes — D-ID generates a talking avatar from a single still image.'),
        JSON_OBJECT('question', 'Is there a real-time mode?', 'answer', 'Yes — the Live Portrait API powers streaming interactive avatars for chat agents and live experiences.'),
        JSON_OBJECT('question', 'How long can D Id clips be?', 'answer', 'Per-clip length varies by plan — typically 5-10 seconds per generation, with extend / continuation features on higher tiers.'),
        JSON_OBJECT('question', 'Can I upload a reference image?', 'answer', 'Yes — image-to-video is a standard input alongside text prompts.'),
        JSON_OBJECT('question', 'Are generated videos royalty-free for commercial use?', 'answer', 'Paid plans grant commercial-use rights. Check the latest terms for distribution and exclusivity.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — most modern video generators expose an API for batch jobs and product integrations.')
      ),
  pros                = JSON_ARRAY('Pioneer of photo-to-talking-video', 'Real-time avatar streaming for agents', 'Enterprise security', 'Saves studio time and cost', 'Fast iteration on edits', 'No camera or crew required'),
  cons                = JSON_ARRAY('Per-minute pricing adds up', 'Output range narrower than consumer video tools', 'Clip length limits', 'Compute-time / queue waits on high-tier requests'),
  starting_price      = 5.99,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'd-id';

-- luma-ai
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Dream Machine', 'NeRF', '3D capture'),
  industries_served   = JSON_ARRAY('Marketing & Advertising', 'Film & Production', 'Education', 'Corporate Training', 'Creator Economy', 'Gaming', 'Real Estate'),
  use_cases           = JSON_ARRAY('Marketing reels', 'Storyboard previs', 'Product demos', 'Training videos', 'Social content', 'Concept films', 'Music videos'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Dream Machine 1.6 model', 'Text-to-video', 'Image-to-video', 'Camera path control (Brainstorm + Brush)', 'Extend / loop clips', 'Genie 3D capture from phone', 'NeRF reconstruction', 'API for video generation', 'Mobile capture app', 'Web app'),
  features            = JSON_ARRAY('Dream Machine 1.6 model', 'Text-to-video', 'Image-to-video', 'Camera path control (Brainstorm + Brush)', 'Extend / loop clips', 'Genie 3D capture from phone', 'NeRF reconstruction', 'API for video generation', 'Mobile capture app', 'Web app'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('30 generations/mo', '720p resolution', 'Watermarked')),
        JSON_OBJECT('name', 'Standard', 'price', 9.99, 'period', 'month', 'features', JSON_ARRAY('150 generations/mo', '1080p', 'No watermark')),
        JSON_OBJECT('name', 'Pro', 'price', 29.99, 'period', 'month', 'features', JSON_ARRAY('700 generations/mo', 'Priority queue', 'Extended commercial rights')),
        JSON_OBJECT('name', 'Premier', 'price', 94.99, 'period', 'month', 'features', JSON_ARRAY('~2,500 generations/mo', 'Highest priority', 'Top tier features'))
      ),
  integrations        = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Dream Machine API', 'website', 'https://lumalabs.ai/dream-machine/api', 'description', 'Programmatic video generation.'),
        JSON_OBJECT('name', 'iOS app', 'website', 'https://apps.apple.com', 'description', 'Genie 3D capture from phone.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Live chat', 'Knowledge base'),
  training_options    = JSON_ARRAY('Tutorials', 'Documentation', 'Sample prompts', 'Workshops'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY(),
  faqs                = JSON_ARRAY(
        
        JSON_OBJECT('question', 'What is Genie?', 'answer', 'Genie turns phone-captured footage into navigable 3D scenes using NeRF — used for VFX previs and AR.'),
        JSON_OBJECT('question', 'How long are Dream Machine clips?', 'answer', 'Each generation is 5 seconds at 720p / 1080p, extendable in 5-second increments.'),
        JSON_OBJECT('question', 'How long can Luma Ai clips be?', 'answer', 'Per-clip length varies by plan — typically 5-10 seconds per generation, with extend / continuation features on higher tiers.'),
        JSON_OBJECT('question', 'Can I upload a reference image?', 'answer', 'Yes — image-to-video is a standard input alongside text prompts.'),
        JSON_OBJECT('question', 'Are generated videos royalty-free for commercial use?', 'answer', 'Paid plans grant commercial-use rights. Check the latest terms for distribution and exclusivity.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — most modern video generators expose an API for batch jobs and product integrations.')
      ),
  pros                = JSON_ARRAY('Consumer-friendly Dream Machine UX', 'Unique 3D / NeRF capture pipeline', 'Used by Hollywood VFX', 'Saves studio time and cost', 'Fast iteration on edits', 'No camera or crew required'),
  cons                = JSON_ARRAY('Smaller video clip lengths', 'Resolution limited on free tier', 'Clip length limits', 'Compute-time / queue waits on high-tier requests'),
  starting_price      = 9.99,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 1,
  has_android_app     = 1
WHERE slug = 'luma-ai';

-- kling-ai
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Long-form video', 'Frontier model', 'Kuaishou'),
  industries_served   = JSON_ARRAY('Marketing & Advertising', 'Film & Production', 'Education', 'Corporate Training', 'Creator Economy', 'Gaming', 'Real Estate'),
  use_cases           = JSON_ARRAY('Marketing reels', 'Storyboard previs', 'Product demos', 'Training videos', 'Social content', 'Concept films', 'Music videos'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('KLING 2.0 frontier model', 'Up to 10s clips per generation', 'Text-to-video', 'Image-to-video', 'Motion brush', 'Lip-sync', 'Camera path control', 'Multi-image reference (up to 4 inputs)', 'Extend mode', 'API for developers'),
  features            = JSON_ARRAY('KLING 2.0 frontier model', 'Up to 10s clips per generation', 'Text-to-video', 'Image-to-video', 'Motion brush', 'Lip-sync', 'Camera path control', 'Multi-image reference (up to 4 inputs)', 'Extend mode', 'API for developers'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('66 credits on signup', 'Standard speed', 'Watermarked')),
        JSON_OBJECT('name', 'Standard', 'price', 6.99, 'period', 'month', 'features', JSON_ARRAY('660 credits/mo', 'Faster generation', 'Higher resolution')),
        JSON_OBJECT('name', 'Pro', 'price', 39.99, 'period', 'month', 'features', JSON_ARRAY('3,000 credits/mo', 'Priority queue', 'Pro features')),
        JSON_OBJECT('name', 'Premier', 'price', 64.99, 'period', 'month', 'features', JSON_ARRAY('~6,000 credits/mo', 'Highest tier', 'All Pro features'))
      ),
  integrations        = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Kling API', 'website', 'https://klingai.com', 'description', 'Programmatic video generation.'),
        JSON_OBJECT('name', 'fal.ai', 'website', 'https://fal.ai', 'description', 'Hosted Kling inference for developers.'),
        JSON_OBJECT('name', 'Pollo AI', 'website', 'https://pollo.ai', 'description', 'Multi-model platform with Kling support.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Live chat', 'Knowledge base'),
  training_options    = JSON_ARRAY('Tutorials', 'Documentation', 'Sample prompts', 'Workshops'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY(),
  faqs                = JSON_ARRAY(
        
        JSON_OBJECT('question', 'Who makes Kling?', 'answer', 'Kling is built by Kuaishou, the Chinese short-video platform that competes with Douyin/TikTok.'),
        JSON_OBJECT('question', 'How does Kling compare to Sora?', 'answer', 'Kling is widely considered the closest competitor to OpenAI Sora and is generally available — Sora has been gated.'),
        JSON_OBJECT('question', 'How long can Kling Ai clips be?', 'answer', 'Per-clip length varies by plan — typically 5-10 seconds per generation, with extend / continuation features on higher tiers.'),
        JSON_OBJECT('question', 'Can I upload a reference image?', 'answer', 'Yes — image-to-video is a standard input alongside text prompts.'),
        JSON_OBJECT('question', 'Are generated videos royalty-free for commercial use?', 'answer', 'Paid plans grant commercial-use rights. Check the latest terms for distribution and exclusivity.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — most modern video generators expose an API for batch jobs and product integrations.')
      ),
  pros                = JSON_ARRAY('Top-tier physics and motion realism', 'Affordable vs Western competitors', 'Longer clips per generation', 'Saves studio time and cost', 'Fast iteration on edits', 'No camera or crew required'),
  cons                = JSON_ARRAY('UI primarily in Chinese on native site', 'Some prompts blocked by content policy', 'Clip length limits', 'Compute-time / queue waits on high-tier requests'),
  starting_price      = 6.99,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'kling-ai';

-- hailuo-ai-minimax
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Text-to-video', 'MiniMax', 'High-detail'),
  industries_served   = JSON_ARRAY('Marketing & Advertising', 'Film & Production', 'Education', 'Corporate Training', 'Creator Economy', 'Gaming', 'Real Estate'),
  use_cases           = JSON_ARRAY('Marketing reels', 'Storyboard previs', 'Product demos', 'Training videos', 'Social content', 'Concept films', 'Music videos'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Hailuo I-01 model', 'T2V-01 text-to-video', 'High-detail output', 'Strong prompt adherence', 'Subject reference', 'Camera control via prompt', 'Image-to-video', 'Audio sync (lip + sound)', 'Multilingual prompt support', 'API access'),
  features            = JSON_ARRAY('Hailuo I-01 model', 'T2V-01 text-to-video', 'High-detail output', 'Strong prompt adherence', 'Subject reference', 'Camera control via prompt', 'Image-to-video', 'Audio sync (lip + sound)', 'Multilingual prompt support', 'API access'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('Daily free credits', 'Standard quality', 'Watermarked')),
        JSON_OBJECT('name', 'Standard', 'price', 14.9, 'period', 'month', 'features', JSON_ARRAY('~1,000 credits/mo', 'No watermark', 'Higher priority')),
        JSON_OBJECT('name', 'Unlimited', 'price', 94.9, 'period', 'month', 'features', JSON_ARRAY('Unlimited generations', 'Highest priority', 'All Pro features'))
      ),
  integrations        = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Hailuo API', 'website', 'https://hailuoai.video', 'description', 'Programmatic video generation endpoints.'),
        JSON_OBJECT('name', 'MiniMax abab API', 'website', 'https://www.minimax.io', 'description', 'LLM and other MiniMax model APIs.'),
        JSON_OBJECT('name', 'fal.ai', 'website', 'https://fal.ai', 'description', 'Hosted Hailuo inference for developers.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Live chat', 'Knowledge base'),
  training_options    = JSON_ARRAY('Tutorials', 'Documentation', 'Sample prompts', 'Workshops'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY(),
  faqs                = JSON_ARRAY(
        
        JSON_OBJECT('question', 'Who is MiniMax?', 'answer', 'MiniMax is a Shanghai-based AI lab — they also publish the abab LLM family and the Talkie character-chat app.'),
        JSON_OBJECT('question', 'Is Hailuo open source?', 'answer', 'No — Hailuo is a commercial product, used via the web app or API.'),
        JSON_OBJECT('question', 'How long can Hailuo Ai Minimax clips be?', 'answer', 'Per-clip length varies by plan — typically 5-10 seconds per generation, with extend / continuation features on higher tiers.'),
        JSON_OBJECT('question', 'Can I upload a reference image?', 'answer', 'Yes — image-to-video is a standard input alongside text prompts.'),
        JSON_OBJECT('question', 'Are generated videos royalty-free for commercial use?', 'answer', 'Paid plans grant commercial-use rights. Check the latest terms for distribution and exclusivity.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — most modern video generators expose an API for batch jobs and product integrations.')
      ),
  pros                = JSON_ARRAY('Highest detail output of the current Chinese video models', 'Excellent prompt adherence', 'Strong motion realism', 'Saves studio time and cost', 'Fast iteration on edits', 'No camera or crew required'),
  cons                = JSON_ARRAY('Some content restrictions', 'UI translation incomplete in some flows', 'Clip length limits', 'Compute-time / queue waits on high-tier requests'),
  starting_price      = 14.9,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'hailuo-ai-minimax';

-- elevenlabs
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Text-to-speech', 'Voice cloning', 'Conversational AI'),
  industries_served   = JSON_ARRAY('Publishing & Audiobooks', 'E-learning', 'Gaming', 'Film & Production', 'Podcasting', 'Customer Support', 'Marketing & Advertising'),
  use_cases           = JSON_ARRAY('Voiceover production', 'Audiobook narration', 'Dubbing & localisation', 'IVR & voice agents', 'Podcast intros', 'Game character voices'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('5,000+ stock voices', 'Voice cloning from 1-minute sample', 'Multilingual model (32 languages)', 'Studio long-form workflow', 'Conversational AI agents', 'Dubbing studio with lip-sync', 'Speech-to-Speech style transfer', 'Sound effects generation', 'Voice library marketplace', 'Streaming + batch API'),
  features            = JSON_ARRAY('5,000+ stock voices', 'Voice cloning from 1-minute sample', 'Multilingual model (32 languages)', 'Studio long-form workflow', 'Conversational AI agents', 'Dubbing studio with lip-sync', 'Speech-to-Speech style transfer', 'Sound effects generation', 'Voice library marketplace', 'Streaming + batch API'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('10K characters/mo', '3 custom voices', 'Watermark in API')),
        JSON_OBJECT('name', 'Starter', 'price', 5, 'period', 'month', 'features', JSON_ARRAY('30K characters/mo', '10 custom voices', 'Professional voice cloning')),
        JSON_OBJECT('name', 'Creator', 'price', 22, 'period', 'month', 'features', JSON_ARRAY('100K characters/mo', '30 custom voices', '192kbps audio')),
        JSON_OBJECT('name', 'Pro', 'price', 99, 'period', 'month', 'features', JSON_ARRAY('500K characters/mo', 'Higher concurrency', 'API priority')),
        JSON_OBJECT('name', 'Scale', 'price', 330, 'period', 'month', 'features', JSON_ARRAY('2M characters/mo', 'Production-grade API', 'PCI-aware')),
        JSON_OBJECT('name', 'Enterprise', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Unlimited usage', 'SSO + audit logs', 'Volume pricing'))
      ),
  integrations        = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Conversational AI', 'website', 'https://elevenlabs.io/conversational-ai', 'description', 'Build voice agents with sub-500ms latency.'),
        JSON_OBJECT('name', 'API', 'website', 'https://elevenlabs.io/docs', 'description', 'Full text-to-speech, voice cloning, and dubbing endpoints.'),
        JSON_OBJECT('name', 'Zapier', 'website', 'https://zapier.com', 'description', 'Generate ElevenLabs audio from 6,000+ apps.'),
        JSON_OBJECT('name', 'Make', 'website', 'https://www.make.com', 'description', 'No-code automation with ElevenLabs voice generation.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Live chat', 'Help center', 'Developer forum'),
  training_options    = JSON_ARRAY('Documentation', 'Voice library', 'API guide', 'Tutorials'),
  languages           = JSON_ARRAY('English', '20+ languages on most tiers'),
  compliance          = JSON_ARRAY('SOC 2'),
  faqs                = JSON_ARRAY(
        
        JSON_OBJECT('question', 'How accurate is voice cloning?', 'answer', 'Professional Voice Cloning produces near-indistinguishable voices from a 30-min training sample.'),
        JSON_OBJECT('question', 'What is the latency for streaming?', 'answer', 'Real-time text-to-speech via the Conversational AI API delivers sub-500ms first-token latency.'),
        JSON_OBJECT('question', 'Does Elevenlabs support voice cloning?', 'answer', 'Elevenlabs offers voice cloning on Professional and Enterprise plans, with consent verification required.'),
        JSON_OBJECT('question', 'How many languages are supported?', 'answer', 'Most modern AI voice tools support 20-30+ languages, with growing coverage for regional dialects.'),
        JSON_OBJECT('question', 'Is the output royalty-free?', 'answer', 'Paid plans grant commercial usage rights for the generated audio.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — both streaming and batch APIs are available for developers on paid plans.')
      ),
  pros                = JSON_ARRAY('Best-in-class voice realism', 'Strong multilingual support', 'Voice cloning that actually works', 'Studio-quality output', 'Pay-as-you-go usage', 'Voice cloning available'),
  cons                = JSON_ARRAY('Per-character pricing adds up at scale', 'Voice cloning needs careful consent practices', 'Per-character usage costs add up at scale', 'Voice consent + ethical use policies required'),
  starting_price      = 5,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 1,
  has_android_app     = 1
WHERE slug = 'elevenlabs';

-- suno
UPDATE submissions SET
  header_tags         = JSON_ARRAY('AI music', 'Song generation', 'Lyrics'),
  industries_served   = JSON_ARRAY('Content Creation', 'Gaming', 'Film & TV', 'Marketing & Advertising', 'Podcasting', 'Apps & Software'),
  use_cases           = JSON_ARRAY('Background music', 'Royalty-free soundtracks', 'Game music', 'Ad jingles', 'Podcast intros', 'Original songs'),
  target_company_sizes = JSON_ARRAY('Solo creators', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Full-song generation (vocals + lyrics + instrumental)', 'V4 model (current generation)', 'Persona feature for consistent artist voice', 'Cover song mode', 'Stems separation', 'Extend / remix existing tracks', 'Genre + style prompts', 'Custom lyrics or auto-generated', '2 minutes per generation, extendable to 8+', 'API for developers (waitlist)'),
  features            = JSON_ARRAY('Full-song generation (vocals + lyrics + instrumental)', 'V4 model (current generation)', 'Persona feature for consistent artist voice', 'Cover song mode', 'Stems separation', 'Extend / remix existing tracks', 'Genre + style prompts', 'Custom lyrics or auto-generated', '2 minutes per generation, extendable to 8+', 'API for developers (waitlist)'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('50 credits/day (10 songs)', 'Non-commercial use only', 'Public songs')),
        JSON_OBJECT('name', 'Pro', 'price', 10, 'period', 'month', 'features', JSON_ARRAY('2,500 credits/mo (500 songs)', 'Commercial usage rights', 'Priority queue')),
        JSON_OBJECT('name', 'Premier', 'price', 30, 'period', 'month', 'features', JSON_ARRAY('10,000 credits/mo (2,000 songs)', 'Commercial use', 'Highest priority'))
      ),
  integrations        = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Web app', 'website', 'https://suno.com', 'description', 'Primary interface for song creation and library.'),
        JSON_OBJECT('name', 'Mobile app', 'website', 'https://apps.apple.com', 'description', 'iOS app for on-the-go song generation.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Community Discord', 'Knowledge base'),
  training_options    = JSON_ARRAY('Documentation', 'Tutorials', 'Sample prompts', 'Community examples'),
  languages           = JSON_ARRAY('English (lyrics)', 'Instrumental output universal'),
  compliance          = JSON_ARRAY(),
  faqs                = JSON_ARRAY(
        
        JSON_OBJECT('question', 'Can I use Suno songs commercially?', 'answer', 'Yes — Pro and Premier plans grant full commercial rights to generated songs.'),
        JSON_OBJECT('question', 'How long can a song be?', 'answer', 'Each generation is up to 2 minutes; the Extend feature stretches songs to 8+ minutes.'),
        JSON_OBJECT('question', 'Can I use Suno music commercially?', 'answer', 'Yes — paid plans grant commercial usage rights with no additional royalty obligations.'),
        JSON_OBJECT('question', 'How long can a track be?', 'answer', 'Per-track length depends on plan — most modern tools generate 2-4 minute songs.'),
        JSON_OBJECT('question', 'Can I extend or remix a track?', 'answer', 'Yes — extend, remix, and section-edit features are common across modern AI music tools.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — most platforms offer API access on Pro or Business tiers.')
      ),
  pros                = JSON_ARRAY('Generates complete radio-quality songs', 'Strong vocal generation', 'Pro tier covers commercial use', 'Royalty-free output', 'Generates in seconds', 'No music theory required'),
  cons                = JSON_ARRAY('Free tier non-commercial only', 'Style range narrower than Udio for some genres', 'Output quality varies by genre', 'Less control vs traditional DAWs'),
  starting_price      = 10,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 1,
  has_android_app     = 1
WHERE slug = 'suno';

-- udio
UPDATE submissions SET
  header_tags         = JSON_ARRAY('AI music', 'Vocal generation', 'Long prompts'),
  industries_served   = JSON_ARRAY('Content Creation', 'Gaming', 'Film & TV', 'Marketing & Advertising', 'Podcasting', 'Apps & Software'),
  use_cases           = JSON_ARRAY('Background music', 'Royalty-free soundtracks', 'Game music', 'Ad jingles', 'Podcast intros', 'Original songs'),
  target_company_sizes = JSON_ARRAY('Solo creators', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Long-prompt sculpting (up to 600 chars)', 'V1.5 model', 'High-quality vocal output', 'Extend feature (intro/outro/section)', 'Inpaint song sections', 'Remix existing audio', 'Genre + style + mood controls', 'Lyric editing', 'Stems separation', 'Cover song mode'),
  features            = JSON_ARRAY('Long-prompt sculpting (up to 600 chars)', 'V1.5 model', 'High-quality vocal output', 'Extend feature (intro/outro/section)', 'Inpaint song sections', 'Remix existing audio', 'Genre + style + mood controls', 'Lyric editing', 'Stems separation', 'Cover song mode'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('10 songs/day', 'Watermark on free tier', 'Non-commercial use')),
        JSON_OBJECT('name', 'Standard', 'price', 10, 'period', 'month', 'features', JSON_ARRAY('1,200 songs/mo', 'Commercial usage', 'No watermark')),
        JSON_OBJECT('name', 'Pro', 'price', 30, 'period', 'month', 'features', JSON_ARRAY('4,800 songs/mo', 'Priority queue', 'Higher-quality outputs'))
      ),
  integrations        = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Web app', 'website', 'https://www.udio.com', 'description', 'Primary interface for song creation.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Community Discord', 'Knowledge base'),
  training_options    = JSON_ARRAY('Documentation', 'Tutorials', 'Sample prompts', 'Community examples'),
  languages           = JSON_ARRAY('English (lyrics)', 'Instrumental output universal'),
  compliance          = JSON_ARRAY(),
  faqs                = JSON_ARRAY(
        
        JSON_OBJECT('question', 'Who founded Udio?', 'answer', 'Udio was founded in 2023 by ex-DeepMind researchers including David Ding.'),
        JSON_OBJECT('question', 'How does Udio compare to Suno?', 'answer', 'Both are top-tier; Udio is often preferred for vocal quality and long-prompt control, Suno for ease of use.'),
        JSON_OBJECT('question', 'Can I use Udio music commercially?', 'answer', 'Yes — paid plans grant commercial usage rights with no additional royalty obligations.'),
        JSON_OBJECT('question', 'How long can a track be?', 'answer', 'Per-track length depends on plan — most modern tools generate 2-4 minute songs.'),
        JSON_OBJECT('question', 'Can I extend or remix a track?', 'answer', 'Yes — extend, remix, and section-edit features are common across modern AI music tools.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — most platforms offer API access on Pro or Business tiers.')
      ),
  pros                = JSON_ARRAY('Best vocal quality in the category for many genres', 'Strong long-prompt control', 'Active community', 'Royalty-free output', 'Generates in seconds', 'No music theory required'),
  cons                = JSON_ARRAY('Web-only — no mobile app yet', 'Lyric editing requires extra finesse', 'Output quality varies by genre', 'Less control vs traditional DAWs'),
  starting_price      = 10,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'udio';

-- murf-ai
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Voiceover', 'Text-to-speech', 'E-learning'),
  industries_served   = JSON_ARRAY('Publishing & Audiobooks', 'E-learning', 'Gaming', 'Film & Production', 'Podcasting', 'Customer Support', 'Marketing & Advertising'),
  use_cases           = JSON_ARRAY('Voiceover production', 'Audiobook narration', 'Dubbing & localisation', 'IVR & voice agents', 'Podcast intros', 'Game character voices'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('120+ studio-quality voices', '20+ languages', 'Voice cloning (Murf Voice Studio)', 'Voice changer (one voice to another)', 'AI translation with voice match', 'Time-synced media library (video, music, images)', 'Pitch / pace / emphasis controls', 'Pronunciation library', 'API for developers', 'Team collaboration'),
  features            = JSON_ARRAY('120+ studio-quality voices', '20+ languages', 'Voice cloning (Murf Voice Studio)', 'Voice changer (one voice to another)', 'AI translation with voice match', 'Time-synced media library (video, music, images)', 'Pitch / pace / emphasis controls', 'Pronunciation library', 'API for developers', 'Team collaboration'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('10 min voice generation', '120+ voices', 'No download — preview only')),
        JSON_OBJECT('name', 'Creator', 'price', 29, 'period', 'month', 'features', JSON_ARRAY('2 hours voice generation', 'Download MP3/WAV', 'Commercial usage')),
        JSON_OBJECT('name', 'Business', 'price', 99, 'period', 'month', 'features', JSON_ARRAY('Unlimited downloads', 'Team workspace', 'API access')),
        JSON_OBJECT('name', 'Enterprise', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Custom voice cloning', 'SSO', 'Dedicated support'))
      ),
  integrations        = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Google Slides', 'website', 'https://slides.google.com', 'description', 'Add Murf voiceover to slides via add-on.'),
        JSON_OBJECT('name', 'API', 'website', 'https://murf.ai/api', 'description', 'Programmatic voiceover generation for products.'),
        JSON_OBJECT('name', 'Adobe Audition', 'website', 'https://www.adobe.com/products/audition.html', 'description', 'Export-ready audio for post-production.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Live chat', 'Help center', 'Developer forum'),
  training_options    = JSON_ARRAY('Documentation', 'Voice library', 'API guide', 'Tutorials'),
  languages           = JSON_ARRAY('English', '20+ languages on most tiers'),
  compliance          = JSON_ARRAY('SOC 2'),
  faqs                = JSON_ARRAY(
        
        JSON_OBJECT('question', 'Is Murf good for e-learning?', 'answer', 'Yes — Murf is heavily used by L&D teams for narration thanks to its time-sync tools and pronunciation library.'),
        JSON_OBJECT('question', 'Can I clone a voice?', 'answer', 'Voice cloning is available on the Enterprise tier with consent verification.'),
        JSON_OBJECT('question', 'Does Murf Ai support voice cloning?', 'answer', 'Murf Ai offers voice cloning on Professional and Enterprise plans, with consent verification required.'),
        JSON_OBJECT('question', 'How many languages are supported?', 'answer', 'Most modern AI voice tools support 20-30+ languages, with growing coverage for regional dialects.'),
        JSON_OBJECT('question', 'Is the output royalty-free?', 'answer', 'Paid plans grant commercial usage rights for the generated audio.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — both streaming and batch APIs are available for developers on paid plans.')
      ),
  pros                = JSON_ARRAY('Studio-quality voices for e-learning', 'Strong time-sync video tools', 'Affordable per-minute pricing', 'Studio-quality output', 'Pay-as-you-go usage', 'Voice cloning available'),
  cons                = JSON_ARRAY('Editor UI feels dated', 'Voice cloning gated to Enterprise', 'Per-character usage costs add up at scale', 'Voice consent + ethical use policies required'),
  starting_price      = 29,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'murf-ai';

-- resemble-ai
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Voice cloning', 'Deepfake detection', 'Enterprise'),
  industries_served   = JSON_ARRAY('Publishing & Audiobooks', 'E-learning', 'Gaming', 'Film & Production', 'Podcasting', 'Customer Support', 'Marketing & Advertising'),
  use_cases           = JSON_ARRAY('Voiceover production', 'Audiobook narration', 'Dubbing & localisation', 'IVR & voice agents', 'Podcast intros', 'Game character voices'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Voice cloning from 5+ languages', 'Cross-language voice transfer', 'Resemble Detect (deepfake detection API)', 'Real-time streaming TTS', 'Voice marketplace', 'Emotion + style controls', 'On-prem deployment', 'API for developers', 'PCI / HIPAA compliance options', 'SSO + audit logs'),
  features            = JSON_ARRAY('Voice cloning from 5+ languages', 'Cross-language voice transfer', 'Resemble Detect (deepfake detection API)', 'Real-time streaming TTS', 'Voice marketplace', 'Emotion + style controls', 'On-prem deployment', 'API for developers', 'PCI / HIPAA compliance options', 'SSO + audit logs'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('10 min generation', 'Basic voices', 'Watermarked')),
        JSON_OBJECT('name', 'Creator', 'price', 29, 'period', 'month', 'features', JSON_ARRAY('1 voice clone', 'Higher-quality output', 'No watermark')),
        JSON_OBJECT('name', 'Pro', 'price', 99, 'period', 'month', 'features', JSON_ARRAY('5 voice clones', 'API access', 'Commercial usage')),
        JSON_OBJECT('name', 'Enterprise', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Custom voice cloning', 'On-prem', 'PCI / HIPAA'))
      ),
  integrations        = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Resemble Detect API', 'website', 'https://www.resemble.ai/detect', 'description', 'Deepfake detection for audio.'),
        JSON_OBJECT('name', 'Resemble API', 'website', 'https://docs.resemble.ai', 'description', 'Voice cloning, TTS, and dubbing endpoints.'),
        JSON_OBJECT('name', 'Twilio', 'website', 'https://www.twilio.com', 'description', 'Integrate Resemble voices in voice agents.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Live chat', 'Help center', 'Developer forum'),
  training_options    = JSON_ARRAY('Documentation', 'Voice library', 'API guide', 'Tutorials'),
  languages           = JSON_ARRAY('English', '20+ languages on most tiers'),
  compliance          = JSON_ARRAY('SOC 2'),
  faqs                = JSON_ARRAY(
        
        JSON_OBJECT('question', 'What is Resemble Detect?', 'answer', 'Resemble Detect is an API that identifies AI-generated speech in audio recordings — used by media, banking, and government.'),
        JSON_OBJECT('question', 'Is on-prem available?', 'answer', 'Yes — Enterprise tier supports on-prem and VPC deployment for regulated industries.'),
        JSON_OBJECT('question', 'Does Resemble Ai support voice cloning?', 'answer', 'Resemble Ai offers voice cloning on Professional and Enterprise plans, with consent verification required.'),
        JSON_OBJECT('question', 'How many languages are supported?', 'answer', 'Most modern AI voice tools support 20-30+ languages, with growing coverage for regional dialects.'),
        JSON_OBJECT('question', 'Is the output royalty-free?', 'answer', 'Paid plans grant commercial usage rights for the generated audio.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — both streaming and batch APIs are available for developers on paid plans.')
      ),
  pros                = JSON_ARRAY('Best deepfake detection in the industry', 'Enterprise-grade security', 'Cross-language transfer is impressive', 'Studio-quality output', 'Pay-as-you-go usage', 'Voice cloning available'),
  cons                = JSON_ARRAY('Smaller stock voice library than ElevenLabs', 'Pricing oriented to enterprise', 'Per-character usage costs add up at scale', 'Voice consent + ethical use policies required'),
  starting_price      = 29,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'resemble-ai';

-- play-ht
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Text-to-speech', 'Conversational AI', 'Voice cloning'),
  industries_served   = JSON_ARRAY('Publishing & Audiobooks', 'E-learning', 'Gaming', 'Film & Production', 'Podcasting', 'Customer Support', 'Marketing & Advertising'),
  use_cases           = JSON_ARRAY('Voiceover production', 'Audiobook narration', 'Dubbing & localisation', 'IVR & voice agents', 'Podcast intros', 'Game character voices'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('800+ voices in 100+ languages', 'PlayDialog model (natural 2-voice dialogues)', 'PlayHT 2.0 ultra-realistic model', 'Voice cloning from 30s sample', 'Streaming API (~75ms TTFB)', 'Conversational voice AI', 'Pronunciation library', 'SSML support', 'WebSocket + REST APIs', 'Volume discounts'),
  features            = JSON_ARRAY('800+ voices in 100+ languages', 'PlayDialog model (natural 2-voice dialogues)', 'PlayHT 2.0 ultra-realistic model', 'Voice cloning from 30s sample', 'Streaming API (~75ms TTFB)', 'Conversational voice AI', 'Pronunciation library', 'SSML support', 'WebSocket + REST APIs', 'Volume discounts'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('12,500 characters/mo', '90+ voices', 'No commercial use')),
        JSON_OBJECT('name', 'Creator', 'price', 39, 'period', 'month', 'features', JSON_ARRAY('Unlimited characters', 'Commercial usage', 'Voice cloning')),
        JSON_OBJECT('name', 'Unlimited', 'price', 99, 'period', 'month', 'features', JSON_ARRAY('No usage limits', 'Higher priority', 'API access')),
        JSON_OBJECT('name', 'Enterprise', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Volume pricing', 'SLA', 'Dedicated infra'))
      ),
  integrations        = JSON_ARRAY(
        
        JSON_OBJECT('name', 'API', 'website', 'https://docs.play.ht', 'description', 'TTS + voice cloning + Conversational AI endpoints.'),
        JSON_OBJECT('name', 'Twilio', 'website', 'https://www.twilio.com', 'description', 'Use PlayHT voices in Twilio voice agents.'),
        JSON_OBJECT('name', 'Vapi', 'website', 'https://vapi.ai', 'description', 'PlayHT voices in voice-AI agent builder.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Live chat', 'Help center', 'Developer forum'),
  training_options    = JSON_ARRAY('Documentation', 'Voice library', 'API guide', 'Tutorials'),
  languages           = JSON_ARRAY('English', '20+ languages on most tiers'),
  compliance          = JSON_ARRAY('SOC 2'),
  faqs                = JSON_ARRAY(
        
        JSON_OBJECT('question', 'What is PlayDialog?', 'answer', 'PlayDialog is a 2-voice dialogue model that generates natural conversational audio between two speakers in a single pass.'),
        JSON_OBJECT('question', 'Is the streaming latency real?', 'answer', 'Yes — TTFB averages ~75ms, suitable for production voice-AI agents.'),
        JSON_OBJECT('question', 'Does Play Ht support voice cloning?', 'answer', 'Play Ht offers voice cloning on Professional and Enterprise plans, with consent verification required.'),
        JSON_OBJECT('question', 'How many languages are supported?', 'answer', 'Most modern AI voice tools support 20-30+ languages, with growing coverage for regional dialects.'),
        JSON_OBJECT('question', 'Is the output royalty-free?', 'answer', 'Paid plans grant commercial usage rights for the generated audio.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — both streaming and batch APIs are available for developers on paid plans.')
      ),
  pros                = JSON_ARRAY('Sub-100ms latency for conversational AI', 'PlayDialog excels at 2-voice scripts', '100+ languages', 'Studio-quality output', 'Pay-as-you-go usage', 'Voice cloning available'),
  cons                = JSON_ARRAY('Free tier is small', 'Voice library overwhelming to navigate', 'Per-character usage costs add up at scale', 'Voice consent + ethical use policies required'),
  starting_price      = 39,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'play-ht';

-- speechify
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Read-aloud', 'Accessibility', 'Celebrity voices'),
  industries_served   = JSON_ARRAY('Publishing & Audiobooks', 'E-learning', 'Gaming', 'Film & Production', 'Podcasting', 'Customer Support', 'Marketing & Advertising'),
  use_cases           = JSON_ARRAY('Voiceover production', 'Audiobook narration', 'Dubbing & localisation', 'IVR & voice agents', 'Podcast intros', 'Game character voices'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('200+ voices in 30+ languages', 'Celebrity-licensed voices (Snoop Dogg, MrBeast, etc.)', 'Browser extension (read any webpage)', 'PDF / DOC / EPUB import', 'iOS / Android apps', 'Speed up to 9x', 'OCR for scanned documents', 'Offline listening', 'Note-taking + highlighting', 'Audiobook narration'),
  features            = JSON_ARRAY('200+ voices in 30+ languages', 'Celebrity-licensed voices (Snoop Dogg, MrBeast, etc.)', 'Browser extension (read any webpage)', 'PDF / DOC / EPUB import', 'iOS / Android apps', 'Speed up to 9x', 'OCR for scanned documents', 'Offline listening', 'Note-taking + highlighting', 'Audiobook narration'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('Limited reads', 'Basic voices', 'No offline listening')),
        JSON_OBJECT('name', 'Premium', 'price', 11.58, 'period', 'month', 'features', JSON_ARRAY('Unlimited reads', '200+ HD voices', 'Offline + celebrity voices')),
        JSON_OBJECT('name', 'Studio', 'price', 24, 'period', 'month', 'features', JSON_ARRAY('Full Speechify Studio for AI voiceover creation')),
        JSON_OBJECT('name', 'Enterprise', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('API access', 'Audiobook publisher rates', 'Team licences'))
      ),
  integrations        = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Chrome', 'website', 'https://chromewebstore.google.com', 'description', 'Browser extension reads any webpage.'),
        JSON_OBJECT('name', 'Safari', 'website', 'https://apps.apple.com', 'description', 'Native Safari extension on Mac and iOS.'),
        JSON_OBJECT('name', 'Google Docs', 'website', 'https://docs.google.com', 'description', 'Read Docs files aloud.'),
        JSON_OBJECT('name', 'Speechify Studio API', 'website', 'https://speechify.com/api', 'description', 'Programmatic voiceover for publishers.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Live chat', 'Help center', 'Developer forum'),
  training_options    = JSON_ARRAY('Documentation', 'Voice library', 'API guide', 'Tutorials'),
  languages           = JSON_ARRAY('English', '20+ languages on most tiers'),
  compliance          = JSON_ARRAY('SOC 2'),
  faqs                = JSON_ARRAY(
        
        JSON_OBJECT('question', 'How does Speechify help with dyslexia?', 'answer', 'Reading aloud with synced highlighting is proven to improve comprehension — Speechify was founded specifically for dyslexia support.'),
        JSON_OBJECT('question', 'What celebrity voices are available?', 'answer', 'Snoop Dogg, Gwyneth Paltrow, MrBeast, and several others — full list rotates.'),
        JSON_OBJECT('question', 'Does Speechify support voice cloning?', 'answer', 'Speechify offers voice cloning on Professional and Enterprise plans, with consent verification required.'),
        JSON_OBJECT('question', 'How many languages are supported?', 'answer', 'Most modern AI voice tools support 20-30+ languages, with growing coverage for regional dialects.'),
        JSON_OBJECT('question', 'Is the output royalty-free?', 'answer', 'Paid plans grant commercial usage rights for the generated audio.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — both streaming and batch APIs are available for developers on paid plans.')
      ),
  pros                = JSON_ARRAY('Best reading-assistance app for accessibility', 'Celebrity voices are a hit', 'Cross-platform', 'Studio-quality output', 'Pay-as-you-go usage', 'Voice cloning available'),
  cons                = JSON_ARRAY('Annual pricing only on Premium', 'Some studio features locked to higher tier', 'Per-character usage costs add up at scale', 'Voice consent + ethical use policies required'),
  starting_price      = 11.58,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 1,
  has_android_app     = 1
WHERE slug = 'speechify';

-- krisp
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Noise cancellation', 'Meeting transcription', 'Voice productivity'),
  industries_served   = JSON_ARRAY('Publishing & Audiobooks', 'E-learning', 'Gaming', 'Film & Production', 'Podcasting', 'Customer Support', 'Marketing & Advertising'),
  use_cases           = JSON_ARRAY('Voiceover production', 'Audiobook narration', 'Dubbing & localisation', 'IVR & voice agents', 'Podcast intros', 'Game character voices'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Background noise cancellation (any app)', 'Voice cancellation (filter others out)', 'Echo cancellation', 'Meeting transcription', 'AI meeting notes + summaries', 'Live translation', 'Accent localization', 'Voice biometric authentication', 'Cross-platform desktop apps', 'SDK for product builders'),
  features            = JSON_ARRAY('Background noise cancellation (any app)', 'Voice cancellation (filter others out)', 'Echo cancellation', 'Meeting transcription', 'AI meeting notes + summaries', 'Live translation', 'Accent localization', 'Voice biometric authentication', 'Cross-platform desktop apps', 'SDK for product builders'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('60 min/day noise cancellation', 'Basic features')),
        JSON_OBJECT('name', 'Pro', 'price', 8, 'period', 'month', 'features', JSON_ARRAY('Unlimited noise cancellation', 'Full transcription', 'Meeting notes')),
        JSON_OBJECT('name', 'Business', 'price', 16, 'period', 'month', 'features', JSON_ARRAY('Team admin', 'Calendar integration', 'Pro features')),
        JSON_OBJECT('name', 'Enterprise', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('SSO', 'Custom retention', 'Dedicated support'))
      ),
  integrations        = JSON_ARRAY(
        
        JSON_OBJECT('name', 'Zoom', 'website', 'https://zoom.us', 'description', 'Krisp runs as an audio source in Zoom.'),
        JSON_OBJECT('name', 'Microsoft Teams', 'website', 'https://www.microsoft.com/microsoft-teams', 'description', 'Native Teams audio compatibility.'),
        JSON_OBJECT('name', 'Google Meet', 'website', 'https://meet.google.com', 'description', 'Krisp filters audio for Meet calls.'),
        JSON_OBJECT('name', 'SDK', 'website', 'https://krisp.ai/developers', 'description', 'Embed Krisp noise cancellation in any product.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Live chat', 'Help center', 'Developer forum'),
  training_options    = JSON_ARRAY('Documentation', 'Voice library', 'API guide', 'Tutorials'),
  languages           = JSON_ARRAY('English', '20+ languages on most tiers'),
  compliance          = JSON_ARRAY('SOC 2'),
  faqs                = JSON_ARRAY(
        
        JSON_OBJECT('question', 'Does Krisp work with my call platform?', 'answer', 'Yes — Krisp registers as a virtual audio device, so it works in every app: Zoom, Teams, Meet, Webex, Slack, Discord.'),
        JSON_OBJECT('question', 'Does it run on-device?', 'answer', 'Yes — Krisp processes audio entirely on your device for privacy; no audio leaves your machine.'),
        JSON_OBJECT('question', 'Does Krisp support voice cloning?', 'answer', 'Krisp offers voice cloning on Professional and Enterprise plans, with consent verification required.'),
        JSON_OBJECT('question', 'How many languages are supported?', 'answer', 'Most modern AI voice tools support 20-30+ languages, with growing coverage for regional dialects.'),
        JSON_OBJECT('question', 'Is the output royalty-free?', 'answer', 'Paid plans grant commercial usage rights for the generated audio.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — both streaming and batch APIs are available for developers on paid plans.')
      ),
  pros                = JSON_ARRAY('Industry-best noise + voice cancellation', 'Works with every meeting platform', 'Strong B2B SDK ecosystem', 'Studio-quality output', 'Pay-as-you-go usage', 'Voice cloning available'),
  cons                = JSON_ARRAY('Desktop only — no mobile app', 'Some features gated to Business tier', 'Per-character usage costs add up at scale', 'Voice consent + ethical use policies required'),
  starting_price      = 8,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'krisp';
