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


-- ============================================================
-- GROUP: LLMs & CHAT ASSISTANTS (8 listings)
-- ============================================================

-- mistral-ai
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Open-weight models', 'European AI', 'Codestral'),
  industries_served   = JSON_ARRAY('SaaS & Software', 'Research & Education', 'Financial Services', 'Healthcare', 'Legal', 'Customer Support', 'Government', 'Defence'),
  use_cases           = JSON_ARRAY('Enterprise chat assistants', 'Code generation', 'Document summarization', 'Multilingual translation', 'On-prem LLM hosting', 'RAG pipelines', 'Domain-specific fine-tuning', 'Multilingual reasoning'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Mistral Large 2 (123B)', 'Mistral Small + Nemo', 'Codestral (code model)', 'Pixtral (multimodal vision)', 'Mixtral 8x22B (MoE)', 'Open weights for self-host', 'La Plateforme API', 'Le Chat consumer app', 'Function calling + JSON mode', 'EU GDPR-native hosting'),
  features            = JSON_ARRAY('Mistral Large 2 (123B)', 'Mistral Small + Nemo', 'Codestral (code model)', 'Pixtral (multimodal vision)', 'Mixtral 8x22B (MoE)', 'Open weights for self-host', 'La Plateforme API', 'Le Chat consumer app', 'Function calling + JSON mode', 'EU GDPR-native hosting'),
  pricing_model       = 'usage',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free Le Chat', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('Consumer Le Chat access', 'Daily message cap', 'Mistral Large model')),
        JSON_OBJECT('name', 'Pro Le Chat', 'price', 14.99, 'period', 'month', 'features', JSON_ARRAY('Unlimited messages', 'Priority access', 'Higher rate limits')),
        JSON_OBJECT('name', 'API pay-as-you-go', 'price', NULL, 'period', 'usage', 'features', JSON_ARRAY('~$2/M input + $6/M output (Large 2)', 'Codestral $0.20/M in / $0.60/M out', 'Embeddings + fine-tuning')),
        JSON_OBJECT('name', 'Enterprise', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('On-prem deployment', 'Custom SLAs', 'Dedicated support'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'La Plateforme API', 'website', 'https://docs.mistral.ai', 'description', 'Direct REST API for chat, code, embeddings, and fine-tuning.'),
        JSON_OBJECT('name', 'Le Chat', 'website', 'https://chat.mistral.ai', 'description', 'Consumer-facing chat assistant interface.'),
        JSON_OBJECT('name', 'AWS Bedrock', 'website', 'https://aws.amazon.com/bedrock/', 'description', 'Mistral models hosted natively on Amazon Bedrock.'),
        JSON_OBJECT('name', 'Azure AI Studio', 'website', 'https://ai.azure.com', 'description', 'Microsoft Azure-managed Mistral inference.'),
        JSON_OBJECT('name', 'Hugging Face', 'website', 'https://huggingface.co/mistralai', 'description', 'Open-weight model distribution and inference.')
      ),
  support_channels    = JSON_ARRAY('API documentation', 'Email support', 'Help center', 'Community forum'),
  training_options    = JSON_ARRAY('Documentation', 'Cookbook recipes', 'API guides', 'Tutorials'),
  languages           = JSON_ARRAY('English', 'French', 'German', 'Spanish', 'Italian', 'Portuguese', '20+ languages supported'),
  compliance          = JSON_ARRAY('GDPR', 'SOC 2'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'Are Mistral models really open-weight?', 'answer', 'Yes — Mistral 7B, Mixtral 8x7B/22B, Codestral Mamba, Pixtral, and others are published under Apache 2.0 or Mistral research licences. Mistral Large is API-only.'),
        JSON_OBJECT('question', 'Can I self-host Mistral models?', 'answer', 'Open-weight models run on your own GPUs. Mistral Large is available via La Plateforme API and partner clouds (Azure, AWS, GCP).'),
        JSON_OBJECT('question', 'Does Mistral support function calling?', 'answer', 'Yes — Mistral Large and Small support function calling, JSON mode, and structured outputs for production agents.'),
        JSON_OBJECT('question', 'How does Mistral compare to GPT-4o and Claude?', 'answer', 'Mistral Large 2 scores competitively on MMLU, HumanEval, and multilingual benchmarks. Codestral leads many open-source code benchmarks.'),
        JSON_OBJECT('question', 'Where does Mistral store data?', 'answer', 'EU-based infrastructure with strict GDPR compliance. Enterprise customers can opt into dedicated regions.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — La Plateforme (api.mistral.ai) covers chat, code, embeddings, fine-tuning, and agents.')
      ),
  pros                = JSON_ARRAY('Open-weight strategy unmatched in frontier AI', 'EU sovereignty + GDPR-native', 'Codestral is a top-tier code model', 'Strong multilingual performance', 'Active model release cadence', 'Multiple deployment options (cloud, on-prem)'),
  cons                = JSON_ARRAY('Smaller ecosystem than OpenAI / Anthropic', 'Some best models still API-only', 'Less brand recognition outside EU', 'Per-token pricing requires careful monitoring'),
  starting_price      = 0,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'mistral-ai';

-- cohere
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Enterprise LLMs', 'RAG-first', 'On-prem ready'),
  industries_served   = JSON_ARRAY('Financial Services', 'Healthcare', 'Government', 'Legal', 'SaaS & Software', 'Customer Support', 'Telecom', 'Insurance'),
  use_cases           = JSON_ARRAY('Retrieval-augmented generation', 'Enterprise search', 'Document Q&A', 'Multilingual customer support', 'Knowledge-base assistants', 'Document classification', 'Semantic search', 'Reranking pipelines'),
  target_company_sizes = JSON_ARRAY('Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Command R+ (104B)', 'Command R (35B)', 'Embed v3 multilingual', 'Rerank v3 reranker', 'Aya 23 (multilingual)', 'Tool use + function calling', 'On-prem + VPC deployment', '128k context window', 'Built-in RAG citations', '100+ languages on Embed'),
  features            = JSON_ARRAY('Command R+ (104B)', 'Command R (35B)', 'Embed v3 multilingual', 'Rerank v3 reranker', 'Aya 23 (multilingual)', 'Tool use + function calling', 'On-prem + VPC deployment', '128k context window', 'Built-in RAG citations', '100+ languages on Embed'),
  pricing_model       = 'usage',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Trial', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('Free API key for prototyping', 'Rate-limited', 'All models available')),
        JSON_OBJECT('name', 'Production', 'price', NULL, 'period', 'usage', 'features', JSON_ARRAY('Command R+ ~$2.5/M in + $10/M out', 'Command R ~$0.50/M in + $1.50/M out', 'Embed v3 ~$0.10/M tokens', 'Rerank ~$2 per 1k searches')),
        JSON_OBJECT('name', 'Enterprise', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('VPC + on-prem deployment', 'Custom fine-tuning', 'Dedicated SLAs', 'Multi-cloud (AWS, Azure, OCI)'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'Cohere API', 'website', 'https://docs.cohere.com', 'description', 'Chat, embed, rerank, classify, and fine-tuning endpoints.'),
        JSON_OBJECT('name', 'AWS Bedrock', 'website', 'https://aws.amazon.com/bedrock/', 'description', 'Cohere Command R+ and Embed v3 hosted on AWS Bedrock.'),
        JSON_OBJECT('name', 'Oracle Cloud Infrastructure', 'website', 'https://www.oracle.com/artificial-intelligence/generative-ai/', 'description', 'Cohere models offered as managed generative AI service on OCI.'),
        JSON_OBJECT('name', 'Snowflake Cortex', 'website', 'https://www.snowflake.com/en/data-cloud/cortex/', 'description', 'Cohere models accessible inside Snowflake data warehouses.'),
        JSON_OBJECT('name', 'LangChain + LlamaIndex', 'website', 'https://python.langchain.com', 'description', 'Native integration in popular LLM orchestration frameworks.')
      ),
  support_channels    = JSON_ARRAY('API documentation', 'Email support', 'Slack community', 'Enterprise CSM'),
  training_options    = JSON_ARRAY('Documentation', 'Cookbook recipes', 'Notebooks', 'Webinars'),
  languages           = JSON_ARRAY('100+ languages on Embed', 'English, French, German, Spanish, Italian, Japanese on Command'),
  compliance          = JSON_ARRAY('SOC 2 Type II', 'HIPAA-eligible', 'GDPR', 'ISO 27001'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'Why is Cohere "enterprise-first"?', 'answer', 'Cohere ships VPC and on-prem deployments out of the box, builds RAG primitives (citations, grounding) into the API, and has SOC 2 + HIPAA-eligible infrastructure for regulated industries.'),
        JSON_OBJECT('question', 'What is Rerank?', 'answer', 'Rerank v3 is a small, fast model that re-orders documents by relevance to a query — drops in front of any keyword or vector search to improve top-k results.'),
        JSON_OBJECT('question', 'Is Cohere on AWS / Azure?', 'answer', 'Yes — Cohere Command R+ and Embed v3 are first-class on AWS Bedrock and Azure AI Studio. Oracle and Snowflake partnerships also live.'),
        JSON_OBJECT('question', 'Does Cohere have a free tier?', 'answer', 'A free trial API key is available for prototyping with rate limits. Production usage is pay-as-you-go.'),
        JSON_OBJECT('question', 'What about fine-tuning?', 'answer', 'Fine-tuning is supported on Command R, Command R+, and Embed models via the API or dedicated training endpoints.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — api.cohere.com covers chat, embed, rerank, classify, and fine-tuning endpoints.')
      ),
  pros                = JSON_ARRAY('Built ground-up for enterprise + RAG', 'Strong multilingual embeddings (100+ languages)', 'On-prem + VPC deployment first-class', 'Rerank is a unique competitive moat', 'Compliance posture suits regulated industries', 'Tight cloud-marketplace integrations'),
  cons                = JSON_ARRAY('Less consumer brand recognition than OpenAI', 'Command R+ trails GPT-4o / Claude on some benchmarks', 'Pricing requires negotiation at enterprise scale', 'Smaller community than open-weight ecosystems'),
  starting_price      = 0,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'cohere';

-- xai-grok
UPDATE submissions SET
  header_tags         = JSON_ARRAY('X-integrated', 'Real-time web', 'Aurora image gen'),
  industries_served   = JSON_ARRAY('Marketing & Advertising', 'Media & Publishing', 'Research & Education', 'SaaS & Software', 'E-commerce', 'Entertainment', 'Financial Services', 'Consumer Tech'),
  use_cases           = JSON_ARRAY('Real-time news + social Q&A', 'Conversational AI', 'Content drafting', 'Code generation', 'Image understanding', 'Personal assistant', 'X-platform research', 'Image generation (Aurora)'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Grok-2 model', 'Grok-2 mini (fast)', 'Real-time X (Twitter) access', 'Aurora image generation', 'Multimodal vision input', 'Tool use + function calling', 'Native in X app', 'grok.com web access', 'iOS + Android apps', 'Less restricted style than peers'),
  features            = JSON_ARRAY('Grok-2 model', 'Grok-2 mini (fast)', 'Real-time X (Twitter) access', 'Aurora image generation', 'Multimodal vision input', 'Tool use + function calling', 'Native in X app', 'grok.com web access', 'iOS + Android apps', 'Less restricted style than peers'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free (X)', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('Limited Grok-2 mini in X', 'Slow responses', 'Public X integration')),
        JSON_OBJECT('name', 'X Premium', 'price', 8, 'period', 'month', 'features', JSON_ARRAY('Grok-2 access', 'Standard limits', 'Verified perks')),
        JSON_OBJECT('name', 'X Premium+', 'price', 16, 'period', 'month', 'features', JSON_ARRAY('Higher Grok limits', 'No ads', 'Premium X features')),
        JSON_OBJECT('name', 'SuperGrok', 'price', 30, 'period', 'month', 'features', JSON_ARRAY('Highest Grok-2 limits', 'Aurora image generation', 'Voice mode')),
        JSON_OBJECT('name', 'API', 'price', NULL, 'period', 'usage', 'features', JSON_ARRAY('~$2/M input + $10/M output (Grok-2)', 'Grok-2-mini cheaper', '128k context'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'X platform', 'website', 'https://x.com', 'description', 'Native Grok integration inside X (Twitter).'),
        JSON_OBJECT('name', 'xAI API', 'website', 'https://docs.x.ai', 'description', 'OpenAI-compatible developer API.'),
        JSON_OBJECT('name', 'grok.com', 'website', 'https://grok.com', 'description', 'Standalone Grok web app.'),
        JSON_OBJECT('name', 'iOS + Android apps', 'website', 'https://x.ai', 'description', 'Native mobile apps for Grok chat.')
      ),
  support_channels    = JSON_ARRAY('Help center', 'Community via X', 'In-app feedback'),
  training_options    = JSON_ARRAY('Documentation', 'API examples', 'X-based community'),
  languages           = JSON_ARRAY('English', 'Multilingual'),
  compliance          = JSON_ARRAY(),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What makes Grok different?', 'answer', 'Grok has real-time access to the X (Twitter) firehose and a less restrictive style than mainstream LLMs — designed for current-events Q&A and humour.'),
        JSON_OBJECT('question', 'How do I access Grok?', 'answer', 'Either via X Premium ($8+/mo), the standalone grok.com web app, the iOS / Android apps, or the xAI API.'),
        JSON_OBJECT('question', 'What is Aurora?', 'answer', 'Aurora is xAI''s image generation model bundled inside Grok — text-to-image with fewer content restrictions than DALL-E or Midjourney.'),
        JSON_OBJECT('question', 'Does Grok have an API?', 'answer', 'Yes — the xAI API at docs.x.ai supports Grok-2 and Grok-2-mini with OpenAI-compatible endpoints.'),
        JSON_OBJECT('question', 'Is Grok open-source?', 'answer', 'Grok-1 was open-weighted under Apache 2.0. Grok-2 is API-only.'),
        JSON_OBJECT('question', 'Where is xAI based?', 'answer', 'xAI is headquartered in the San Francisco Bay Area with infrastructure in Memphis (Colossus supercomputer).')
      ),
  pros                = JSON_ARRAY('Real-time access to X content is unique', 'Less censorious than mainstream LLMs', 'Image generation bundled (Aurora)', 'Bundled with X subscription', 'Strong on internet-current topics', 'Massive compute (Colossus 100k+ H100s)'),
  cons                = JSON_ARRAY('Smaller ecosystem than OpenAI / Anthropic', 'Trails leaders on most academic benchmarks', 'X-tied distribution limits enterprise adoption', 'Less restrictive style is double-edged'),
  starting_price      = 8,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 1,
  has_android_app     = 1
WHERE slug = 'xai-grok';

-- character-ai
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Role-play AI', 'Character chat', 'Community-built'),
  industries_served   = JSON_ARRAY('Entertainment', 'Consumer Tech', 'Creator Economy', 'Education', 'Gaming', 'Mental Wellness', 'Roleplay', 'Fan Communities'),
  use_cases           = JSON_ARRAY('Role-play conversations', 'Companion / friend chat', 'Language practice', 'Creative writing partner', 'Interactive fiction', 'Character-based learning', 'Voice chat with characters', 'Custom character creation'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses'),
  key_features        = JSON_ARRAY('18M+ user-created characters', 'Custom character creator', 'Voice calls with characters', 'Group chats with multiple characters', 'Image generation in chat', 'Character chat persistence', 'Definition + persona editing', 'Teen Experience safety mode', 'iOS + Android apps', 'Pinned messages + chat sharing'),
  features            = JSON_ARRAY('18M+ user-created characters', 'Custom character creator', 'Voice calls with characters', 'Group chats with multiple characters', 'Image generation in chat', 'Character chat persistence', 'Definition + persona editing', 'Teen Experience safety mode', 'iOS + Android apps', 'Pinned messages + chat sharing'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('Unlimited chats with any character', 'Standard model + queue', 'Character creation')),
        JSON_OBJECT('name', 'c.ai+', 'price', 9.99, 'period', 'month', 'features', JSON_ARRAY('Priority access (no waits)', 'Faster responses', 'Early features', 'Exclusive community'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'iOS app', 'website', 'https://apps.apple.com/app/character-ai/id1666563158', 'description', 'Native iOS experience with voice chat.'),
        JSON_OBJECT('name', 'Android app', 'website', 'https://play.google.com/store/apps/details?id=ai.character.app', 'description', 'Native Android app with full features.'),
        JSON_OBJECT('name', 'character.ai web', 'website', 'https://character.ai', 'description', 'Browser-based access for desktop users.')
      ),
  support_channels    = JSON_ARRAY('Help center', 'Discord community', 'Email support'),
  training_options    = JSON_ARRAY('Help articles', 'Character creator guides', 'Community examples'),
  languages           = JSON_ARRAY('English', 'Multilingual (community-driven)'),
  compliance          = JSON_ARRAY(),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'Are the characters real people?', 'answer', 'No — Character.AI characters are fictional personas, including historical figures, lookalikes of celebrities, fictional characters from media, and original creations by users.'),
        JSON_OBJECT('question', 'Is Character.AI safe for teens?', 'answer', 'Character.AI has a Teen Experience (under 18) with stricter content filters. The platform is designed for 16+ in the US and 18+ in some regions.'),
        JSON_OBJECT('question', 'Can I make my own character?', 'answer', 'Yes — the Character creator lets anyone define a personality, greeting, example dialogues, and visual style. Many become community favourites.'),
        JSON_OBJECT('question', 'Does Character.AI have voice chat?', 'answer', 'Yes — voice calls with characters are available with custom voices, including in mobile apps.'),
        JSON_OBJECT('question', 'Is there adult content?', 'answer', 'No — Character.AI does not allow explicit sexual content. Safety filters apply to all chats.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'No public API at this time — Character.AI is consumer-only.')
      ),
  pros                = JSON_ARRAY('18M+ community-created characters', 'Voice chat + group chat features', 'Free tier is genuinely usable', 'Strong creative writing partner', 'Active community + character marketplace', 'Excellent mobile apps'),
  cons                = JSON_ARRAY('Frequent queues on free tier (peak hours)', 'Content filters frustrate some users', 'No public API for builders', 'Memory limited per chat session'),
  starting_price      = 9.99,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 1,
  has_android_app     = 1
WHERE slug = 'character-ai';

-- inflection-ai
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Personal AI', 'Empathetic chat', 'Pi assistant'),
  industries_served   = JSON_ARRAY('Consumer Tech', 'Mental Wellness', 'Education', 'Personal Productivity', 'Healthcare', 'Coaching', 'Companionship', 'Lifestyle'),
  use_cases           = JSON_ARRAY('Personal coach / sounding board', 'Daily journaling', 'Emotional support conversations', 'Casual knowledge Q&A', 'Goal setting + reflection', 'Decision-making partner', 'Habit tracking conversations', 'Voice-first interaction'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Pi (Personal AI)', 'Inflection-2.5 model', '8 human-like voices', 'Voice-first conversation', 'Empathetic persona by design', 'Web, iOS, Android', 'WhatsApp + iMessage', 'Free with no upsell', 'Conversation memory across sessions', 'Inflection-3 for enterprise'),
  features            = JSON_ARRAY('Pi (Personal AI)', 'Inflection-2.5 model', '8 human-like voices', 'Voice-first conversation', 'Empathetic persona by design', 'Web, iOS, Android', 'WhatsApp + iMessage', 'Free with no upsell', 'Conversation memory across sessions', 'Inflection-3 for enterprise'),
  pricing_model       = 'free',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('Unlimited Pi conversations', '8 voice options', 'iOS + Android + Web + Messaging', 'Inflection-2.5 model')),
        JSON_OBJECT('name', 'Inflection Enterprise', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Inflection-3 for business', 'On-prem / VPC deployment', 'Custom personalities', 'Dedicated support'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'iOS app', 'website', 'https://apps.apple.com/app/pi-your-personal-ai/id6445815935', 'description', 'Native iOS with voice-first Pi experience.'),
        JSON_OBJECT('name', 'Android app', 'website', 'https://play.google.com/store/apps/details?id=ai.inflection.pi', 'description', 'Native Android app with voice + text.'),
        JSON_OBJECT('name', 'Web (pi.ai)', 'website', 'https://pi.ai', 'description', 'Browser-based Pi chat.'),
        JSON_OBJECT('name', 'WhatsApp', 'website', 'https://pi.ai', 'description', 'Chat with Pi via WhatsApp messages.'),
        JSON_OBJECT('name', 'iMessage', 'website', 'https://pi.ai', 'description', 'Chat with Pi via iMessage on iPhone.')
      ),
  support_channels    = JSON_ARRAY('Help center', 'Email support', 'In-app feedback'),
  training_options    = JSON_ARRAY('Conversational onboarding', 'Pi tips inside chat'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY(),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Pi?', 'answer', 'Pi (Personal AI) is a chat assistant designed for empathetic, friendly conversation — designed to feel like talking to a thoughtful friend, not a productivity tool.'),
        JSON_OBJECT('question', 'Is Pi really free?', 'answer', 'Yes — Pi is free for personal use. Inflection''s revenue model now centres on its enterprise offering (Inflection-3).'),
        JSON_OBJECT('question', 'What happened to Inflection in 2024?', 'answer', 'Microsoft hired most of Inflection''s leadership and engineering team in March 2024. The Pi product continues to operate under remaining staff and a partnership structure.'),
        JSON_OBJECT('question', 'Can Pi help with work tasks?', 'answer', 'Pi can answer questions and brainstorm, but it''s tuned for conversational, life-coaching style use — not code generation or detailed knowledge work.'),
        JSON_OBJECT('question', 'Is there a Pi API?', 'answer', 'No public API — Pi is consumer-focused. Inflection Enterprise (Inflection-3) is sold to businesses.'),
        JSON_OBJECT('question', 'Does Pi remember past chats?', 'answer', 'Yes — Pi maintains conversation memory across sessions for personalised, continuous dialogue.')
      ),
  pros                = JSON_ARRAY('Genuinely empathetic conversational style', '8 natural human voices', 'Truly free with no upsell', 'Multi-platform (Web, iOS, Android, Messaging)', 'Excellent for journaling + reflection', 'No login required for first chat'),
  cons                = JSON_ARRAY('Not great for code or productivity tasks', 'Smaller model than frontier LLMs', 'Microsoft acquihire raised uncertainty', 'No API for builders'),
  starting_price      = 0,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 1,
  has_android_app     = 1
WHERE slug = 'inflection-ai';

-- you-com
UPDATE submissions SET
  header_tags         = JSON_ARRAY('AI search', 'Multi-model assistants', 'Smart mode'),
  industries_served   = JSON_ARRAY('Research & Education', 'Marketing & Advertising', 'SaaS & Software', 'Journalism', 'Financial Services', 'Legal', 'Consumer Tech', 'Knowledge Work'),
  use_cases           = JSON_ARRAY('AI-powered web search', 'Research with citations', 'Custom AI agents', 'Multi-model comparison', 'Cited Q&A', 'Quick fact lookup', 'Image generation', 'Coding help'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Smart, Genius, Research modes', 'Multi-model picker (Claude, GPT, Gemini, Llama, Mistral)', 'Real-time web citations', 'YouAgent custom assistants', 'YouImagine image gen', 'Code Mode (Python interpreter)', 'File upload + analysis', 'API access for developers', 'No-tracking mode', 'Personalisation toggles'),
  features            = JSON_ARRAY('Smart, Genius, Research modes', 'Multi-model picker (Claude, GPT, Gemini, Llama, Mistral)', 'Real-time web citations', 'YouAgent custom assistants', 'YouImagine image gen', 'Code Mode (Python interpreter)', 'File upload + analysis', 'API access for developers', 'No-tracking mode', 'Personalisation toggles'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('Limited Smart Mode queries', 'Basic citations', 'No-tracking search')),
        JSON_OBJECT('name', 'You Pro', 'price', 15, 'period', 'month', 'features', JSON_ARRAY('Unlimited Smart Mode', 'GPT-4o, Claude Sonnet, Gemini Pro', 'Genius + Research modes', 'File uploads')),
        JSON_OBJECT('name', 'You Team', 'price', 24, 'period', 'month', 'features', JSON_ARRAY('Pro features for teams', 'Admin controls', 'Shared custom agents')),
        JSON_OBJECT('name', 'API + Enterprise', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('API access (web search + RAG)', 'Volume discounts', 'Custom integrations'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'You.com API', 'website', 'https://api.you.com', 'description', 'Web search + RAG snippets + chat completions for developers.'),
        JSON_OBJECT('name', 'Browser extension', 'website', 'https://you.com/extension', 'description', 'Side-by-side search results in any browser.'),
        JSON_OBJECT('name', 'iOS app', 'website', 'https://apps.apple.com/app/you-com-ai-search-engine/id1614153499', 'description', 'Native iOS app for You.com AI search.'),
        JSON_OBJECT('name', 'Android app', 'website', 'https://play.google.com/store/apps/details?id=com.you.browser', 'description', 'Native Android app with You.com search.'),
        JSON_OBJECT('name', 'LangChain + LlamaIndex', 'website', 'https://docs.you.com', 'description', 'Native LangChain / LlamaIndex retrievers.')
      ),
  support_channels    = JSON_ARRAY('Help center', 'Email support', 'Discord community'),
  training_options    = JSON_ARRAY('Documentation', 'Tutorials', 'YouTube channel'),
  languages           = JSON_ARRAY('English', 'Multilingual via underlying LLMs'),
  compliance          = JSON_ARRAY('SOC 2'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'Is You.com a search engine or chatbot?', 'answer', 'Both — You.com started as a privacy-focused search engine and pivoted into an AI-first assistant with web access. Smart Mode is the AI; "Web" tab is classic search.'),
        JSON_OBJECT('question', 'Which AI models can I use?', 'answer', 'You Pro gives access to GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro, Llama, Mistral Large, and more — switchable mid-chat.'),
        JSON_OBJECT('question', 'What is YouAgent?', 'answer', 'YouAgent lets users build custom AI assistants with their own personality, knowledge sources, and tools — like custom GPTs but multi-model.'),
        JSON_OBJECT('question', 'Does You.com track me?', 'answer', 'You.com has a privacy-first stance — incognito mode and no-personalisation toggles are default options.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — api.you.com offers web search, RAG-ready snippets, and chat completions for developers building grounded AI.'),
        JSON_OBJECT('question', 'Who founded You.com?', 'answer', 'Richard Socher (former Chief Scientist at Salesforce) co-founded You.com in 2020 with Bryan McCann.')
      ),
  pros                = JSON_ARRAY('Multi-model access in one subscription', 'Cited web-grounded answers', 'YouAgent builder is genuinely powerful', 'Privacy-respecting search', 'Strong API for builders', 'Custom agents + image gen included'),
  cons                = JSON_ARRAY('Smaller user base than Perplexity', 'UI can feel cluttered with all modes', 'Free tier limits arrive quickly', 'Some custom agent features still maturing'),
  starting_price      = 15,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 1,
  has_android_app     = 1
WHERE slug = 'you-com';

-- poe
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Multi-model chat', 'Quora-owned', 'Bot marketplace'),
  industries_served   = JSON_ARRAY('Consumer Tech', 'Research & Education', 'Marketing & Advertising', 'Creative Writing', 'SaaS & Software', 'Knowledge Work', 'Productivity', 'Hobbyist AI'),
  use_cases           = JSON_ARRAY('Try multiple LLMs in one place', 'Bot exploration', 'Cost-efficient AI usage', 'Custom bot creation', 'Image generation', 'Code generation', 'Creative writing', 'Daily AI assistant'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies'),
  key_features        = JSON_ARRAY('Access to Claude, GPT, Gemini, Llama, Mistral, Grok', 'Image gen (DALL-E, FLUX, Imagen)', 'Video gen (Runway, Pika)', 'Music gen (Suno, Udio)', 'Custom bot builder with prompts', 'Bot marketplace + creator monetisation', 'Apps & Canvases', '128k context bots', 'iOS + Android + Web + Mac + Windows', 'Compute Points system'),
  features            = JSON_ARRAY('Access to Claude, GPT, Gemini, Llama, Mistral, Grok', 'Image gen (DALL-E, FLUX, Imagen)', 'Video gen (Runway, Pika)', 'Music gen (Suno, Udio)', 'Custom bot builder with prompts', 'Bot marketplace + creator monetisation', 'Apps & Canvases', '128k context bots', 'iOS + Android + Web + Mac + Windows', 'Compute Points system'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('Daily compute points allowance', 'All bot types accessible', 'Limited heavy-bot usage')),
        JSON_OBJECT('name', 'Premium', 'price', 19.99, 'period', 'month', 'features', JSON_ARRAY('1M compute points/mo', 'Higher daily limits', 'All bots available', 'Creator monetisation eligible')),
        JSON_OBJECT('name', 'Annual', 'price', 200, 'period', 'year', 'features', JSON_ARRAY('12M compute points/year', 'Same as Premium', 'Effective ~$16.67/mo'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'iOS app', 'website', 'https://apps.apple.com/app/poe-fast-ai-chat/id1640745955', 'description', 'Native iOS app with all bots.'),
        JSON_OBJECT('name', 'Android app', 'website', 'https://play.google.com/store/apps/details?id=com.poe.android', 'description', 'Native Android app.'),
        JSON_OBJECT('name', 'macOS + Windows apps', 'website', 'https://poe.com/download', 'description', 'Native desktop apps for Mac and Windows.'),
        JSON_OBJECT('name', 'Poe Server Bot API', 'website', 'https://creator.poe.com', 'description', 'Build and host custom bots that plug into Poe.')
      ),
  support_channels    = JSON_ARRAY('Help center', 'Community forum', 'Email support'),
  training_options    = JSON_ARRAY('Help articles', 'Bot creator guides', 'Marketplace examples'),
  languages           = JSON_ARRAY('English', 'Multilingual via underlying models'),
  compliance          = JSON_ARRAY(),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Poe?', 'answer', 'Poe is Quora''s multi-model AI chat platform — try GPT, Claude, Gemini, Llama, and dozens of community bots in one subscription.'),
        JSON_OBJECT('question', 'What are compute points?', 'answer', 'Each bot consumes a different amount of compute points per message. Premium gives ~1M points/mo; heavier bots (e.g. Claude Opus, FLUX-Pro) cost more.'),
        JSON_OBJECT('question', 'Can I make money on Poe?', 'answer', 'Yes — Poe''s Creator Monetisation pays bot makers based on subscriber engagement with their bots.'),
        JSON_OBJECT('question', 'Are conversations private?', 'answer', 'Poe encrypts conversations and does not train on user data without consent. Bot creators can see their bot''s message counts but not content.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Poe has a Server Bot API for developers to host their own bot logic and plug it into the Poe interface.'),
        JSON_OBJECT('question', 'Why use Poe over ChatGPT directly?', 'answer', 'Single subscription for multiple models, image / video / music generators included, plus community bots with custom prompts and tools.')
      ),
  pros                = JSON_ARRAY('Multiple frontier models for one subscription', 'Excellent native apps on every platform', 'Bot marketplace + creator economy', 'Image, video, music gen all included', 'Creator monetisation programme', 'Compute Points let heavy users tune spend'),
  cons                = JSON_ARRAY('Compute Points model takes some learning', 'Limits on heaviest bots even on Premium', 'No team / enterprise tier yet', 'Bot quality varies widely on marketplace'),
  starting_price      = 19.99,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 1,
  has_android_app     = 1
WHERE slug = 'poe';

-- huggingchat
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Open-source LLMs', 'Free chat', 'Community-built'),
  industries_served   = JSON_ARRAY('Open Source', 'Research & Education', 'SaaS & Software', 'Hobbyist AI', 'Privacy-Focused Users', 'Academia', 'Developers', 'Tinkerers'),
  use_cases           = JSON_ARRAY('Try open-weight models', 'Privacy-respecting chat', 'Tool use experiments', 'Model comparison', 'Custom assistants (no code)', 'Free AI access', 'Research prompts', 'Quick code Q&A'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses'),
  key_features        = JSON_ARRAY('Free access to Llama, Mistral, Qwen, Gemma, DeepSeek', 'Web search tool', 'Tool use (calculator, image gen, etc.)', 'Custom Assistants with system prompts', 'Multi-model conversation', 'No login required for try-out', 'Open-source UI (chat-ui)', 'Multimodal models supported', 'Conversation sharing', 'Community-created assistants'),
  features            = JSON_ARRAY('Free access to Llama, Mistral, Qwen, Gemma, DeepSeek', 'Web search tool', 'Tool use (calculator, image gen, etc.)', 'Custom Assistants with system prompts', 'Multi-model conversation', 'No login required for try-out', 'Open-source UI (chat-ui)', 'Multimodal models supported', 'Conversation sharing', 'Community-created assistants'),
  pricing_model       = 'free',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('Unlimited chat with all available models', 'Tools + web search', 'Custom Assistants', 'No paid tier')),
        JSON_OBJECT('name', 'Hugging Face Pro', 'price', 9, 'period', 'month', 'features', JSON_ARRAY('Higher rate limits on Hub', 'ZeroGPU access for Spaces', 'Not required for HuggingChat'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'huggingface.co/chat', 'website', 'https://huggingface.co/chat', 'description', 'Primary web interface for HuggingChat.'),
        JSON_OBJECT('name', 'Hugging Face Hub', 'website', 'https://huggingface.co', 'description', 'Hub of 1M+ open-source models, datasets, and demos.'),
        JSON_OBJECT('name', 'Inference API', 'website', 'https://huggingface.co/inference-api', 'description', 'Pay-as-you-go API to any model on the Hub.'),
        JSON_OBJECT('name', 'chat-ui (GitHub)', 'website', 'https://github.com/huggingface/chat-ui', 'description', 'Open-source frontend you can self-host.')
      ),
  support_channels    = JSON_ARRAY('Hugging Face forums', 'Discord community', 'GitHub issues'),
  training_options    = JSON_ARRAY('Documentation', 'Spaces examples', 'Model cards'),
  languages           = JSON_ARRAY('English', 'Multilingual via Qwen, Mistral, and other models'),
  compliance          = JSON_ARRAY(),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'Is HuggingChat really free?', 'answer', 'Yes — HuggingChat is free with no rate limits per individual user. It''s a community demo of open-source LLMs, not a commercial product.'),
        JSON_OBJECT('question', 'Which models can I use?', 'answer', 'Open-weight models including Llama 3.3, Qwen 2.5, Mistral, Gemma 2, DeepSeek, Phi, and others. The list updates as new releases arrive.'),
        JSON_OBJECT('question', 'Can I use my own data?', 'answer', 'HuggingChat doesn''t train on conversations. For data isolation, run the open-source chat-ui yourself with the Inference API or local models.'),
        JSON_OBJECT('question', 'What are Assistants?', 'answer', 'Custom assistants are bots with a system prompt, default model, and optional tools. Anyone can build and publish them.'),
        JSON_OBJECT('question', 'Is the code open?', 'answer', 'Yes — HuggingChat''s frontend (chat-ui) is open-source on GitHub. You can self-host with any compatible model backend.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'The Hugging Face Inference API is the closest equivalent — pay-as-you-go inference for any model on the Hub.')
      ),
  pros                = JSON_ARRAY('Truly free with no upsell pressure', 'Best window into open-source frontier models', 'Open-source UI you can self-host', 'No login required to try', 'Custom assistants without subscription', 'Active community + frequent model additions'),
  cons                = JSON_ARRAY('Performance varies by host load (free service)', 'Smaller context windows on some models', 'No mobile apps', 'Some advanced features absent'),
  starting_price      = 0,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'huggingchat';


-- ============================================================
-- GROUP: CODING & DEV TOOLS (10 listings)
-- ============================================================

-- github-copilot
UPDATE submissions SET
  header_tags         = JSON_ARRAY('GitHub-native', 'Multi-IDE', 'Copilot Chat'),
  industries_served   = JSON_ARRAY('Software Development', 'SaaS & Software', 'Enterprises', 'Startups', 'Education', 'Government', 'Financial Services', 'Healthcare'),
  use_cases           = JSON_ARRAY('Inline code completion', 'Chat-based code Q&A', 'Test generation', 'Refactoring suggestions', 'Pull-request summaries', 'CLI command help', 'Codebase Q&A (workspace chat)', 'Documentation generation'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Inline code completion', 'Copilot Chat (in-IDE)', 'Multi-model picker (GPT, Claude, Gemini)', 'Workspace + codebase context', 'Copilot Workspace (beta)', 'Slash commands (/fix, /tests, /doc)', 'Pull request summaries', 'CLI assistant (gh copilot)', 'VS Code, Visual Studio, JetBrains, Neovim, Xcode', 'Enterprise indexing + policy controls'),
  features            = JSON_ARRAY('Inline code completion', 'Copilot Chat (in-IDE)', 'Multi-model picker (GPT, Claude, Gemini)', 'Workspace + codebase context', 'Copilot Workspace (beta)', 'Slash commands (/fix, /tests, /doc)', 'Pull request summaries', 'CLI assistant (gh copilot)', 'VS Code, Visual Studio, JetBrains, Neovim, Xcode', 'Enterprise indexing + policy controls'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('2,000 completions + 50 chat messages/mo', 'Code completion + chat', 'Limited model choice')),
        JSON_OBJECT('name', 'Pro', 'price', 10, 'period', 'month', 'features', JSON_ARRAY('Unlimited completions + chat', 'Multi-model picker', 'Workspace context', 'Priority access')),
        JSON_OBJECT('name', 'Business', 'price', 19, 'period', 'month', 'features', JSON_ARRAY('Pro features + admin', 'IP indemnity', 'Code referencing', 'Audit logs')),
        JSON_OBJECT('name', 'Enterprise', 'price', 39, 'period', 'month', 'features', JSON_ARRAY('Codebase indexing', 'Custom models / fine-tune', 'GitHub Knowledge Bases', 'SSO + audit'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'VS Code', 'website', 'https://code.visualstudio.com', 'description', 'Official VS Code extension — most-used Copilot surface.'),
        JSON_OBJECT('name', 'Visual Studio', 'website', 'https://visualstudio.microsoft.com', 'description', 'Built-in Copilot for Microsoft Visual Studio.'),
        JSON_OBJECT('name', 'JetBrains IDEs', 'website', 'https://plugins.jetbrains.com/plugin/17718-github-copilot', 'description', 'All JetBrains IDEs — IntelliJ, PyCharm, GoLand, WebStorm, etc.'),
        JSON_OBJECT('name', 'Neovim', 'website', 'https://github.com/github/copilot.vim', 'description', 'Official Neovim plugin.'),
        JSON_OBJECT('name', 'Xcode', 'website', 'https://github.com/github/CopilotForXcode', 'description', 'Copilot for Xcode (Swift/iOS development).'),
        JSON_OBJECT('name', 'GitHub.com + Mobile', 'website', 'https://github.com/features/copilot', 'description', 'Copilot Chat in GitHub.com and GitHub Mobile.')
      ),
  support_channels    = JSON_ARRAY('GitHub Support', 'Documentation', 'Community forum', 'Enterprise CSM'),
  training_options    = JSON_ARRAY('Documentation', 'Skills tutorials', 'GitHub Universe sessions', 'Sample repos'),
  languages           = JSON_ARRAY('English', 'Multiple natural languages for chat'),
  compliance          = JSON_ARRAY('SOC 2 Type II', 'ISO 27001', 'GDPR', 'HIPAA-eligible (Enterprise)'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'Does Copilot work in my IDE?', 'answer', 'Yes — VS Code, Visual Studio, all JetBrains IDEs, Neovim, Xcode, Eclipse, and Azure Data Studio. GitHub Mobile also has Copilot Chat.'),
        JSON_OBJECT('question', 'Which AI models power Copilot?', 'answer', 'GPT-4o and o1 (OpenAI), Claude 3.5 Sonnet (Anthropic), and Gemini 1.5 Pro (Google) — switchable per task.'),
        JSON_OBJECT('question', 'Does Copilot train on my code?', 'answer', 'No — Copilot does not train on your private code. Enterprise has additional data controls.'),
        JSON_OBJECT('question', 'What is Copilot Workspace?', 'answer', 'Workspace turns a GitHub issue into a structured plan → edits → PR — an agent-style coding flow in technical preview.'),
        JSON_OBJECT('question', 'Is there a free tier?', 'answer', 'Yes — Copilot Free gives 2,000 completions and 50 chat messages monthly for individuals.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Copilot is delivered through the official extensions in supported IDEs; programmatic API access is limited to Enterprise scenarios.')
      ),
  pros                = JSON_ARRAY('Tightest integration with GitHub workflows', 'Multi-model picker (GPT, Claude, Gemini)', 'Strongest IDE coverage in the category', 'Enterprise-grade compliance', 'Pull request summaries save reviewer time', 'IP indemnity on Business+'),
  cons                = JSON_ARRAY('Closed product — no on-prem option', 'Per-seat pricing adds up at scale', 'Workspace agent is still beta', 'Less aggressive code edits than Cursor / Windsurf'),
  starting_price      = 0,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 1,
  has_android_app     = 1
WHERE slug = 'github-copilot';

-- cursor
UPDATE submissions SET
  header_tags         = JSON_ARRAY('AI-first IDE', 'Composer agent', 'VS Code fork'),
  industries_served   = JSON_ARRAY('Software Development', 'SaaS & Software', 'Startups', 'Indie Developers', 'Tech Agencies', 'Game Development', 'Web Development', 'Enterprises'),
  use_cases           = JSON_ARRAY('Multi-file code edits', 'Codebase chat with context', 'Inline code completion', 'Refactoring via Composer', 'Agent-style coding tasks', 'Documentation generation', 'Test generation', 'Code understanding'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Cursor Tab (multi-line completion)', 'Composer (multi-file agent edits)', 'Chat with codebase context (@symbols)', 'Apply Changes one-click', 'Multi-model picker (Claude, GPT, o1)', 'Privacy mode (no training on code)', 'VS Code fork — full extension compatibility', 'Background composer (agent runs)', 'Web search in chat', 'Codebase indexing'),
  features            = JSON_ARRAY('Cursor Tab (multi-line completion)', 'Composer (multi-file agent edits)', 'Chat with codebase context (@symbols)', 'Apply Changes one-click', 'Multi-model picker (Claude, GPT, o1)', 'Privacy mode (no training on code)', 'VS Code fork — full extension compatibility', 'Background composer (agent runs)', 'Web search in chat', 'Codebase indexing'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Hobby', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('2,000 completions/mo', 'Limited slow chat requests', 'Privacy mode included')),
        JSON_OBJECT('name', 'Pro', 'price', 20, 'period', 'month', 'features', JSON_ARRAY('Unlimited completions', '500 fast premium requests/mo', 'Unlimited slow requests', 'Composer + Tab')),
        JSON_OBJECT('name', 'Business', 'price', 40, 'period', 'month', 'features', JSON_ARRAY('Pro features + admin', 'SSO', 'Privacy mode enforced', 'Centralised billing'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'VS Code extensions', 'website', 'https://www.cursor.com', 'description', 'Full VS Code extension marketplace compatibility.'),
        JSON_OBJECT('name', 'GitHub', 'website', 'https://github.com', 'description', 'Repository sync + PR workflows.'),
        JSON_OBJECT('name', 'Anthropic + OpenAI', 'website', 'https://www.cursor.com', 'description', 'Built-in Claude 3.5 Sonnet, GPT-4o, and o1 access.'),
        JSON_OBJECT('name', 'Linear', 'website', 'https://linear.app', 'description', 'Optional task integration for project workflows.')
      ),
  support_channels    = JSON_ARRAY('Documentation', 'Community forum', 'Email support', 'Discord'),
  training_options    = JSON_ARRAY('Docs', 'YouTube tutorials', 'Sample workflows', 'Community examples'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY('SOC 2 (in progress)'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'Is Cursor a VS Code extension or its own IDE?', 'answer', 'Cursor is a standalone IDE built on a fork of VS Code — full extension compatibility, but with deeper AI integration than any extension can offer.'),
        JSON_OBJECT('question', 'What is Composer?', 'answer', 'Composer takes a high-level instruction and edits across multiple files in your project — closer to an agent than a completion tool.'),
        JSON_OBJECT('question', 'What is Tab?', 'answer', 'Cursor Tab is a multi-line, multi-cursor completion that predicts the next several edits (not just the next line) based on your context.'),
        JSON_OBJECT('question', 'Can I use my own API keys?', 'answer', 'Yes — Pro users can bring their own OpenAI / Anthropic keys to bypass Cursor''s rate limits on the underlying providers.'),
        JSON_OBJECT('question', 'Is my code private?', 'answer', 'Privacy mode (toggle in settings) guarantees Cursor never stores or trains on your code. Recommended for proprietary repos.'),
        JSON_OBJECT('question', 'Does Cursor work offline?', 'answer', 'No — completion and chat require the cloud model providers.')
      ),
  pros                = JSON_ARRAY('Composer for multi-file agent edits is best-in-class', 'Cursor Tab feels magical for everyday coding', 'Full VS Code extension compatibility', 'Multi-model picker (Claude, GPT-4o, o1)', 'Privacy mode for sensitive code', 'Strong developer community and momentum'),
  cons                = JSON_ARRAY('Separate install from VS Code (no zero-config swap)', 'Premium request limits on Pro can pinch heavy users', 'Some VS Code settings need re-configuring', 'No on-prem deployment'),
  starting_price      = 20,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'cursor';

-- codeium-windsurf
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Windsurf Editor', 'Cascade agent', 'Free tier'),
  industries_served   = JSON_ARRAY('Software Development', 'SaaS & Software', 'Startups', 'Enterprises', 'Education', 'Tech Agencies', 'Open Source', 'Game Development'),
  use_cases           = JSON_ARRAY('Multi-file code edits with Cascade', 'Inline code completion', 'Chat-based code Q&A', 'Self-hosted enterprise AI coding', 'Semantic code search', 'Test generation', 'Refactoring', 'Code reviews'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Windsurf Editor (AI-native IDE)', 'Cascade — agent-style multi-file edits', 'Supercomplete (multi-line completion)', 'In-editor chat with context', '70+ programming languages', 'Self-hosted / on-prem deployment', 'Free unlimited individual tier', 'JetBrains, VS Code, Vim, Neovim plugins', 'Custom model fine-tuning (Enterprise)', 'Codeium Search (semantic codebase)'),
  features            = JSON_ARRAY('Windsurf Editor (AI-native IDE)', 'Cascade — agent-style multi-file edits', 'Supercomplete (multi-line completion)', 'In-editor chat with context', '70+ programming languages', 'Self-hosted / on-prem deployment', 'Free unlimited individual tier', 'JetBrains, VS Code, Vim, Neovim plugins', 'Custom model fine-tuning (Enterprise)', 'Codeium Search (semantic codebase)'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('Unlimited code completion + chat', 'All Codeium plugins', 'Personal use')),
        JSON_OBJECT('name', 'Pro', 'price', 15, 'period', 'month', 'features', JSON_ARRAY('Higher chat limits', 'Faster models', 'Priority support', 'Cascade flow (Windsurf)')),
        JSON_OBJECT('name', 'Teams', 'price', 35, 'period', 'month', 'features', JSON_ARRAY('Pro features + admin', 'SSO', 'Centralised billing')),
        JSON_OBJECT('name', 'Enterprise', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Self-hosted / on-prem', 'Fine-tuning on your codebase', 'SAML SSO', 'Dedicated support'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'VS Code', 'website', 'https://codeium.com/vscode_tutorial', 'description', 'Official Codeium extension for VS Code.'),
        JSON_OBJECT('name', 'JetBrains IDEs', 'website', 'https://codeium.com/jetbrains_tutorial', 'description', 'Codeium plugin for IntelliJ, PyCharm, WebStorm, etc.'),
        JSON_OBJECT('name', 'Visual Studio', 'website', 'https://codeium.com/visual_studio_tutorial', 'description', 'Codeium for Microsoft Visual Studio.'),
        JSON_OBJECT('name', 'Vim / Neovim', 'website', 'https://codeium.com/vim_tutorial', 'description', 'First-class support for Vim and Neovim users.'),
        JSON_OBJECT('name', 'Jupyter', 'website', 'https://codeium.com/jupyter_tutorial', 'description', 'Codeium completions inside Jupyter notebooks.')
      ),
  support_channels    = JSON_ARRAY('Documentation', 'Community forum', 'Email support', 'Enterprise CSM'),
  training_options    = JSON_ARRAY('Docs', 'YouTube tutorials', 'Onboarding playbook', 'Community examples'),
  languages           = JSON_ARRAY('70+ programming languages'),
  compliance          = JSON_ARRAY('SOC 2 Type II'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is the difference between Codeium and Windsurf?', 'answer', 'Codeium is the underlying AI coding platform with IDE extensions; Windsurf is Codeium''s standalone AI-native editor with Cascade (agent flow) built-in.'),
        JSON_OBJECT('question', 'Is Windsurf free?', 'answer', 'Windsurf Editor has a generous free tier. Pro and Teams are paid for higher limits and team features.'),
        JSON_OBJECT('question', 'What is Cascade?', 'answer', 'Cascade is Windsurf''s agent-style multi-file edit flow — it can plan, edit, run terminals, and iterate based on output.'),
        JSON_OBJECT('question', 'Can I self-host?', 'answer', 'Yes — Codeium offers a self-hosted Enterprise option, including air-gapped deployments for regulated industries.'),
        JSON_OBJECT('question', 'Which IDEs are supported?', 'answer', 'VS Code, JetBrains (IntelliJ, PyCharm, etc.), Visual Studio, Vim, Neovim, Eclipse, Sublime, Jupyter, and Codeium''s Windsurf editor.'),
        JSON_OBJECT('question', 'Is my code used for training?', 'answer', 'No — Codeium does not train on your code. Enterprise data stays in your environment when self-hosted.')
      ),
  pros                = JSON_ARRAY('Generous free tier — best in category', 'Self-hosted / on-prem available', 'Cascade rivals Composer for agent flows', 'Wide IDE coverage', '70+ languages supported', 'Enterprise fine-tuning on your codebase'),
  cons                = JSON_ARRAY('Two products (Codeium + Windsurf) can confuse', 'Windsurf is newer — less mature than VS Code', 'Free tier model is less capable than premium tiers', 'Brand transition (Codeium → Windsurf) in progress'),
  starting_price      = 0,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'codeium-windsurf';

-- tabnine
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Self-hosted AI', 'Enterprise coding', 'Privacy-first'),
  industries_served   = JSON_ARRAY('Enterprises', 'Financial Services', 'Healthcare', 'Government', 'Defence', 'SaaS & Software', 'Education', 'Manufacturing'),
  use_cases           = JSON_ARRAY('Inline code completion', 'On-prem AI coding', 'Air-gapped development', 'Test generation', 'Documentation generation', 'Code explanations', 'Refactoring suggestions', 'Custom-model fine-tuning'),
  target_company_sizes = JSON_ARRAY('Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Self-hosted / on-prem deployment', 'Air-gapped option', 'Custom model fine-tuning per team', 'Inline completion + chat', 'AI Agents for testing, docs, Jira', 'No training on user code', 'Switch underlying models (Claude, Tabnine Protected)', '80+ IDE / language combinations', 'SOC 2 + ISO 27001 compliance', 'Code provenance + zero data retention'),
  features            = JSON_ARRAY('Self-hosted / on-prem deployment', 'Air-gapped option', 'Custom model fine-tuning per team', 'Inline completion + chat', 'AI Agents for testing, docs, Jira', 'No training on user code', 'Switch underlying models (Claude, Tabnine Protected)', '80+ IDE / language combinations', 'SOC 2 + ISO 27001 compliance', 'Code provenance + zero data retention'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Dev', 'price', 9, 'period', 'month', 'features', JSON_ARRAY('Code completion + chat', 'All IDE plugins', 'Standard model')),
        JSON_OBJECT('name', 'Enterprise', 'price', 39, 'period', 'month', 'features', JSON_ARRAY('On-prem / VPC option', 'Custom fine-tuning', 'SAML SSO', 'Air-gapped support', 'Dedicated CSM'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'VS Code', 'website', 'https://www.tabnine.com/install', 'description', 'Official VS Code extension.'),
        JSON_OBJECT('name', 'JetBrains', 'website', 'https://www.tabnine.com/install', 'description', 'All JetBrains IDEs supported.'),
        JSON_OBJECT('name', 'Visual Studio', 'website', 'https://www.tabnine.com/install', 'description', 'Tabnine for Microsoft Visual Studio.'),
        JSON_OBJECT('name', 'Eclipse', 'website', 'https://www.tabnine.com/install', 'description', 'First-class support for Eclipse IDE.'),
        JSON_OBJECT('name', 'Atlassian Jira', 'website', 'https://www.tabnine.com', 'description', 'Tabnine AI agents that operate on Jira tickets.')
      ),
  support_channels    = JSON_ARRAY('Documentation', 'Email + ticket support', 'Enterprise CSM', 'Community forum'),
  training_options    = JSON_ARRAY('Docs', 'Webinars', 'Onboarding workshops', 'Best-practice guides'),
  languages           = JSON_ARRAY('80+ programming languages'),
  compliance          = JSON_ARRAY('SOC 2 Type II', 'ISO 27001', 'GDPR'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'How is Tabnine different from Copilot or Cursor?', 'answer', 'Tabnine''s differentiation is enterprise — self-hosted / air-gapped deployment, zero data retention, and custom model fine-tuning per team.'),
        JSON_OBJECT('question', 'Can I run Tabnine on-prem?', 'answer', 'Yes — Enterprise customers can deploy fully on-prem, including air-gapped environments with no external connectivity.'),
        JSON_OBJECT('question', 'Does Tabnine train on my code?', 'answer', 'No — Tabnine''s "Protected" models are trained only on permissively-licensed code. Your code is never used for model training.'),
        JSON_OBJECT('question', 'What models does Tabnine use?', 'answer', 'Tabnine''s own protected model plus Claude 3.5 Sonnet and Tabnine Protected for organisations needing audit-grade provenance.'),
        JSON_OBJECT('question', 'How does fine-tuning work?', 'answer', 'Enterprise can fine-tune Tabnine''s base model on the team''s own codebase, producing suggestions that match team conventions.'),
        JSON_OBJECT('question', 'Which IDEs are supported?', 'answer', 'VS Code, all JetBrains IDEs, Visual Studio, Eclipse, Vim, Neovim, Jupyter, Sublime Text, Android Studio, and more.')
      ),
  pros                = JSON_ARRAY('Strongest privacy + compliance posture in the category', 'Self-hosted / air-gapped for regulated industries', 'Custom fine-tuning on your codebase', 'Wide IDE coverage', 'Tabnine Protected = audit-grade code provenance', 'SOC 2 + ISO 27001 + GDPR'),
  cons                = JSON_ARRAY('Less impressive than Cursor / Copilot on consumer benchmarks', 'No big-name model brand on consumer tier', 'Premium per-seat pricing is enterprise-tier', 'Enterprise setup more involved'),
  starting_price      = 9,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 0,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'tabnine';

-- replit
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Cloud IDE', 'Replit Agent', 'Browser-based'),
  industries_served   = JSON_ARRAY('Education', 'Software Development', 'Startups', 'Indie Developers', 'Hackathons', 'Web Development', 'Game Development', 'Open Source'),
  use_cases           = JSON_ARRAY('Browser-based coding', 'Build apps from natural-language prompts', 'Inline code completion', 'Chat with codebase', 'Hosted deployments', 'Teaching + learning programming', 'Prototyping web apps', 'Collaborative coding'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies'),
  key_features        = JSON_ARRAY('Replit Agent (build apps from prompts)', 'Replit AI (inline + chat)', 'Browser-based IDE — zero install', 'One-click deployments + custom domains', 'Multiplayer editing (collab)', '50+ languages with native runners', 'Built-in database (Replit DB)', 'Bounties marketplace', 'Mobile apps for editing', 'Replit Teams for education'),
  features            = JSON_ARRAY('Replit Agent (build apps from prompts)', 'Replit AI (inline + chat)', 'Browser-based IDE — zero install', 'One-click deployments + custom domains', 'Multiplayer editing (collab)', '50+ languages with native runners', 'Built-in database (Replit DB)', 'Bounties marketplace', 'Mobile apps for editing', 'Replit Teams for education'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Starter', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('Public Repls', 'Basic AI', 'Replit Agent limited')),
        JSON_OBJECT('name', 'Replit Core', 'price', 25, 'period', 'month', 'features', JSON_ARRAY('Unlimited AI (Replit Agent + AI)', 'Private Repls', 'Deployments + custom domain', 'Higher resource limits')),
        JSON_OBJECT('name', 'Teams', 'price', 40, 'period', 'month', 'features', JSON_ARRAY('Team management', 'Shared workspaces', 'Collaborative deployments', 'Centralised billing'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'GitHub', 'website', 'https://github.com', 'description', 'Import / sync repos to Replit.'),
        JSON_OBJECT('name', 'Replit Mobile', 'website', 'https://replit.com/mobile', 'description', 'iOS + Android apps for coding on the go.'),
        JSON_OBJECT('name', 'PostgreSQL hosting', 'website', 'https://replit.com', 'description', 'Managed PostgreSQL alongside Replit projects.'),
        JSON_OBJECT('name', 'Custom domains', 'website', 'https://replit.com', 'description', 'Map your domain to a Replit deployment.'),
        JSON_OBJECT('name', 'OpenAI / Anthropic / Stripe', 'website', 'https://replit.com', 'description', 'Secret store for popular API integrations.')
      ),
  support_channels    = JSON_ARRAY('Help center', 'Community forum', 'Discord', 'Email'),
  training_options    = JSON_ARRAY('Replit Docs', 'Tutorials', 'Replit Universe', 'YouTube channel'),
  languages           = JSON_ARRAY('50+ programming languages'),
  compliance          = JSON_ARRAY('SOC 2 (in progress)'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Replit Agent?', 'answer', 'Replit Agent takes a natural-language description ("build me a habit tracker with login") and generates the code, sets up the database, and deploys it.'),
        JSON_OBJECT('question', 'Do I need to install anything?', 'answer', 'No — Replit runs entirely in your browser. Mobile apps let you edit on the go.'),
        JSON_OBJECT('question', 'Can I deploy my project?', 'answer', 'Yes — Replit Deployments serve your project on a custom domain with autoscaling. Always-On Repls keep services running.'),
        JSON_OBJECT('question', 'Is Replit good for learning?', 'answer', 'Yes — Replit is the world''s most-used platform for learning to code, with classroom features for educators.'),
        JSON_OBJECT('question', 'Does Replit support my language?', 'answer', 'Yes — 50+ languages including Python, JavaScript, TypeScript, Rust, Go, C/C++, Java, Ruby, PHP, and more.'),
        JSON_OBJECT('question', 'Can I host a database?', 'answer', 'Yes — Replit DB is built-in, plus PostgreSQL hosting and integration with any external database.')
      ),
  pros                = JSON_ARRAY('Replit Agent is closest to one-shot app generation', 'Zero install — works in browser', 'One-click deployment with custom domain', 'Best platform for teaching coding', 'Mobile apps for editing on the go', 'Strong community + bounties marketplace'),
  cons                = JSON_ARRAY('Browser-based IDE less powerful than local', 'Compute / memory limits on free tier', 'Always-On Repls extra cost', 'Best for web/scripts — limited for native dev'),
  starting_price      = 0,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 1,
  has_android_app     = 1
WHERE slug = 'replit';

-- v0-by-vercel
UPDATE submissions SET
  header_tags         = JSON_ARRAY('UI generator', 'shadcn/ui', 'Vercel-powered'),
  industries_served   = JSON_ARRAY('Software Development', 'SaaS & Software', 'Startups', 'Design Agencies', 'Marketing & Advertising', 'Web Development', 'E-commerce', 'Indie Developers'),
  use_cases           = JSON_ARRAY('Generate React UI from prompts', 'Build landing pages', 'Rapid prototyping', 'Component generation', 'Form + dashboard scaffolds', 'Convert mockups to code', 'Iterative UI refinement', 'One-click Vercel deploy'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies'),
  key_features        = JSON_ARRAY('Generate React + Tailwind UI from prompts', 'Uses shadcn/ui components by default', 'Multi-iteration refinement chat', 'Forks + variations per generation', 'Import Figma screenshots', 'One-click deploy to Vercel', 'Project files explorer', 'API access for programmatic generation', 'Image input (sketch → UI)', 'Custom blocks library'),
  features            = JSON_ARRAY('Generate React + Tailwind UI from prompts', 'Uses shadcn/ui components by default', 'Multi-iteration refinement chat', 'Forks + variations per generation', 'Import Figma screenshots', 'One-click deploy to Vercel', 'Project files explorer', 'API access for programmatic generation', 'Image input (sketch → UI)', 'Custom blocks library'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('Limited monthly credits', 'Community generations', 'Public projects')),
        JSON_OBJECT('name', 'Premium', 'price', 20, 'period', 'month', 'features', JSON_ARRAY('Higher credit allowance', 'Faster generation', 'Priority queue', 'Private projects')),
        JSON_OBJECT('name', 'Team', 'price', 30, 'period', 'month', 'features', JSON_ARRAY('Premium features for teams', 'Shared projects', 'Centralised billing'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'Vercel deploy', 'website', 'https://vercel.com', 'description', 'One-click deploy of v0 projects to Vercel.'),
        JSON_OBJECT('name', 'Next.js + React', 'website', 'https://nextjs.org', 'description', 'Output is production-ready Next.js + React code.'),
        JSON_OBJECT('name', 'shadcn/ui', 'website', 'https://ui.shadcn.com', 'description', 'Default component library used in v0 generations.'),
        JSON_OBJECT('name', 'Tailwind CSS', 'website', 'https://tailwindcss.com', 'description', 'Styling system used throughout v0 output.'),
        JSON_OBJECT('name', 'Figma import', 'website', 'https://v0.dev', 'description', 'Paste Figma screenshots and generate matching React UI.')
      ),
  support_channels    = JSON_ARRAY('Documentation', 'Community forum', 'Discord', 'Email support'),
  training_options    = JSON_ARRAY('Docs', 'Vercel YouTube channel', 'Sample prompts', 'Community gallery'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY('SOC 2 (via Vercel)'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is v0?', 'answer', 'v0 is Vercel''s generative UI tool — describe what you want, get React + Tailwind code using shadcn/ui components, deploy with one click.'),
        JSON_OBJECT('question', 'Do I need to know React?', 'answer', 'No — v0 generates the code for you. But basic web knowledge helps when iterating or integrating outputs.'),
        JSON_OBJECT('question', 'Can I import a design?', 'answer', 'Yes — paste a Figma screenshot or any image and v0 will generate React UI matching it.'),
        JSON_OBJECT('question', 'What component library does v0 use?', 'answer', 'Vercel''s own shadcn/ui (built on Radix + Tailwind) — high quality, accessible, and free to copy.'),
        JSON_OBJECT('question', 'Can I deploy without Vercel?', 'answer', 'You can copy the code into any React project. Vercel deploy is one-click but optional.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — v0 has a developer API for programmatic UI generation, in beta.')
      ),
  pros                = JSON_ARRAY('Best-in-class UI generation quality', 'shadcn/ui output is production-ready', 'Iteration chat keeps designs improving', 'One-click Vercel deploy', 'Image / sketch → UI is genuinely magical', 'Active product roadmap'),
  cons                = JSON_ARRAY('Tied to React + Tailwind (no Vue / Svelte support)', 'Credit limits arrive quickly on Free', 'Best for new components — less for editing legacy code', 'Premium for serious daily use'),
  starting_price      = 20,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'v0-by-vercel';

-- devin-cognition-labs
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Autonomous engineer', 'Agent platform', 'Cognition AI'),
  industries_served   = JSON_ARRAY('Software Development', 'SaaS & Software', 'Startups', 'Enterprises', 'Tech Agencies', 'Open Source', 'Education', 'Research & Education'),
  use_cases           = JSON_ARRAY('Autonomous bug fixes', 'Pull request generation', 'Feature implementation from tickets', 'Code migrations', 'Test generation + execution', 'Documentation updates', 'Repository understanding', 'Onboarding new repos'),
  target_company_sizes = JSON_ARRAY('Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Slack-based interaction', 'Browser, terminal, code editor — full dev environment', 'Repository indexing + understanding', 'Long-running autonomous tasks', 'Iterates on its own based on test runs', 'GitHub PR creation + review responses', 'Workspaces with sandboxed VMs', 'Memory across sessions', 'Devin API for programmatic use', 'Devin Search (codebase Q&A)'),
  features            = JSON_ARRAY('Slack-based interaction', 'Browser, terminal, code editor — full dev environment', 'Repository indexing + understanding', 'Long-running autonomous tasks', 'Iterates on its own based on test runs', 'GitHub PR creation + review responses', 'Workspaces with sandboxed VMs', 'Memory across sessions', 'Devin API for programmatic use', 'Devin Search (codebase Q&A)'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Team', 'price', 500, 'period', 'month', 'features', JSON_ARRAY('250 ACU credits (~10h compute)', 'Slack + GitHub integration', 'Devin Search included', 'Team-level workspace')),
        JSON_OBJECT('name', 'Enterprise', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Volume ACU pricing', 'Self-hosted option', 'Custom integrations', 'SLA + dedicated support'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'Slack', 'website', 'https://slack.com', 'description', 'Primary interface — DM Devin or assign tickets.'),
        JSON_OBJECT('name', 'GitHub', 'website', 'https://github.com', 'description', 'Devin clones repos, makes branches, opens PRs, and responds to reviews.'),
        JSON_OBJECT('name', 'Linear', 'website', 'https://linear.app', 'description', 'Assign Linear tickets directly to Devin.'),
        JSON_OBJECT('name', 'Jira', 'website', 'https://www.atlassian.com/software/jira', 'description', 'Assign Jira tickets to Devin for autonomous work.'),
        JSON_OBJECT('name', 'Sentry', 'website', 'https://sentry.io', 'description', 'Devin investigates Sentry errors and proposes fixes.')
      ),
  support_channels    = JSON_ARRAY('Documentation', 'Slack-based support', 'Email', 'Enterprise SE'),
  training_options    = JSON_ARRAY('Docs', 'Onboarding workshops', 'Sample projects'),
  languages           = JSON_ARRAY('Polyglot — Python, TypeScript, Rust, Go, Java, and more'),
  compliance          = JSON_ARRAY('SOC 2 Type II'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Devin?', 'answer', 'Devin from Cognition Labs is an autonomous software engineer — you assign it a task in Slack or GitHub, and Devin plans, codes, tests, and opens a PR.'),
        JSON_OBJECT('question', 'How does Devin work?', 'answer', 'Devin gets its own sandboxed VM with a browser, terminal, and code editor. It clones your repo, makes changes, runs tests, and iterates based on results.'),
        JSON_OBJECT('question', 'What is an ACU?', 'answer', 'Agent Compute Unit — Devin''s billing unit. The Team plan includes 250 ACUs ($500/mo); roughly 10 hours of autonomous work.'),
        JSON_OBJECT('question', 'Where do I assign Devin tasks?', 'answer', 'Via Slack DMs, Linear/Jira tickets (with Devin assigned), or directly inside GitHub PRs.'),
        JSON_OBJECT('question', 'Can Devin self-host?', 'answer', 'Enterprise plans support self-hosted deployment for compliance-sensitive customers.'),
        JSON_OBJECT('question', 'Is Devin truly autonomous?', 'answer', 'Devin can complete many tasks fully autonomously, but mid-task questions and review steps keep humans in the loop on complex work.')
      ),
  pros                = JSON_ARRAY('Most ambitious autonomy of any coding tool', 'Slack-native interaction model', 'Excellent for bug fixes and small features', 'Built-in browser + terminal for real-world tasks', 'Repository indexing scales to large monorepos', 'Active Cognition product team'),
  cons                = JSON_ARRAY('Expensive at $500/mo starting', 'Some tasks still require human iteration', 'ACU consumption hard to predict upfront', 'Limited maturity on truly novel work'),
  starting_price      = 500,
  starting_price_period = 'month',
  has_free_trial      = 0,
  has_free_version    = 0,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'devin-cognition-labs';

-- bolt-new-stackblitz
UPDATE submissions SET
  header_tags         = JSON_ARRAY('In-browser apps', 'WebContainers', 'Full-stack'),
  industries_served   = JSON_ARRAY('Software Development', 'Startups', 'Indie Developers', 'Design Agencies', 'Marketing & Advertising', 'SaaS & Software', 'Education', 'Hackathons'),
  use_cases           = JSON_ARRAY('Build full-stack web apps from prompts', 'Prototype landing pages', 'Generate scaffolds + database wiring', 'Real-time preview', 'Deploy to Netlify / Cloudflare', 'Edit AI-generated code in-place', 'Quick demo apps', 'Learn modern web stacks'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies'),
  key_features        = JSON_ARRAY('Runs Node.js in the browser (WebContainers)', 'Full-stack generation (frontend + backend + DB)', 'Real-time iframe preview', 'Edit code directly in the IDE', 'GitHub sync', 'Netlify + Cloudflare deploy from chat', 'Multi-step refinement', 'Multi-model AI (Claude, GPT)', 'Supabase + Stripe integrations', 'Mobile-friendly editor'),
  features            = JSON_ARRAY('Runs Node.js in the browser (WebContainers)', 'Full-stack generation (frontend + backend + DB)', 'Real-time iframe preview', 'Edit code directly in the IDE', 'GitHub sync', 'Netlify + Cloudflare deploy from chat', 'Multi-step refinement', 'Multi-model AI (Claude, GPT)', 'Supabase + Stripe integrations', 'Mobile-friendly editor'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('~1M tokens/day', 'Public projects', 'Basic models')),
        JSON_OBJECT('name', 'Pro', 'price', 20, 'period', 'month', 'features', JSON_ARRAY('10M tokens/mo', 'Private projects', 'Faster models', 'Rollovers')),
        JSON_OBJECT('name', 'Pro 50', 'price', 50, 'period', 'month', 'features', JSON_ARRAY('26M tokens/mo', 'Daily Bolt user tier')),
        JSON_OBJECT('name', 'Pro 100', 'price', 100, 'period', 'month', 'features', JSON_ARRAY('55M tokens/mo')),
        JSON_OBJECT('name', 'Teams', 'price', 30, 'period', 'month', 'features', JSON_ARRAY('Team workspace', 'Centralised billing', 'Sharing'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'Supabase', 'website', 'https://supabase.com', 'description', 'Automatic Supabase wiring for auth and database.'),
        JSON_OBJECT('name', 'Stripe', 'website', 'https://stripe.com', 'description', 'Stripe checkout integration from natural-language prompts.'),
        JSON_OBJECT('name', 'Netlify', 'website', 'https://www.netlify.com', 'description', 'One-click deployment to Netlify from chat.'),
        JSON_OBJECT('name', 'Cloudflare Pages', 'website', 'https://pages.cloudflare.com', 'description', 'Alternate one-click deploy target.'),
        JSON_OBJECT('name', 'GitHub', 'website', 'https://github.com', 'description', 'Sync Bolt projects to and from GitHub repositories.')
      ),
  support_channels    = JSON_ARRAY('Documentation', 'Discord community', 'Email support', 'Community forum'),
  training_options    = JSON_ARRAY('Docs', 'YouTube tutorials', 'Templates gallery', 'Example apps'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY('SOC 2 (StackBlitz)'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Bolt.new?', 'answer', 'Bolt.new from StackBlitz is a prompt-to-app builder — describe what you want, and Bolt scaffolds, runs, and deploys a full-stack web app in your browser.'),
        JSON_OBJECT('question', 'What are WebContainers?', 'answer', 'StackBlitz''s technology that runs Node.js inside the browser — Bolt apps run live without sending code to a remote server.'),
        JSON_OBJECT('question', 'Can I deploy my Bolt app?', 'answer', 'Yes — Bolt can deploy directly to Netlify or Cloudflare Pages from inside the chat.'),
        JSON_OBJECT('question', 'Can I integrate a database?', 'answer', 'Yes — Bolt wires Supabase for database + auth automatically when the prompt requests it.'),
        JSON_OBJECT('question', 'How is Bolt different from v0?', 'answer', 'v0 generates UI snippets / React components. Bolt builds full-stack apps with backend logic, databases, and deployments.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'StackBlitz''s broader API exists; Bolt itself is consumer / browser-only.')
      ),
  pros                = JSON_ARRAY('Full-stack generation (not just UI)', 'Browser-based with live preview', 'Deploy to Netlify / Cloudflare in one click', 'Supabase + Stripe auto-wiring', 'Multi-step refinement keeps improving the output', 'Strong community + template gallery'),
  cons                = JSON_ARRAY('Token economy can run out fast', 'Best for new projects — limited for editing existing repos', 'Browser-only — less flexible than local IDE', 'Subscription needed for serious daily use'),
  starting_price      = 20,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'bolt-new-stackblitz';

-- lovable
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Prompt-to-app', 'Full-stack AI builder', 'Supabase-powered'),
  industries_served   = JSON_ARRAY('Startups', 'Software Development', 'Indie Developers', 'Design Agencies', 'Marketing & Advertising', 'E-commerce', 'SaaS & Software', 'Solopreneurs'),
  use_cases           = JSON_ARRAY('Build full-stack apps from natural language', 'Rapid SaaS prototypes', 'Landing pages with backend', 'Internal tools', 'MVPs for testing ideas', 'Database-backed web apps', 'No-code-style React apps', 'Deploy to Lovable hosting'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies'),
  key_features        = JSON_ARRAY('Prompt → full-stack React + Supabase app', 'Live preview iframe', 'Visual select-to-edit', 'Built-in Supabase auth + database', 'GitHub sync', 'One-click deploy', 'Custom domains', 'Stripe + Resend integrations', 'Multi-file edits with refinement chat', 'Templates library'),
  features            = JSON_ARRAY('Prompt → full-stack React + Supabase app', 'Live preview iframe', 'Visual select-to-edit', 'Built-in Supabase auth + database', 'GitHub sync', 'One-click deploy', 'Custom domains', 'Stripe + Resend integrations', 'Multi-file edits with refinement chat', 'Templates library'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('5 messages/day', '30 messages/mo', 'Public projects')),
        JSON_OBJECT('name', 'Starter', 'price', 20, 'period', 'month', 'features', JSON_ARRAY('100 messages/mo', 'Private projects', 'Custom domains')),
        JSON_OBJECT('name', 'Launch', 'price', 50, 'period', 'month', 'features', JSON_ARRAY('250 messages/mo', 'Priority support')),
        JSON_OBJECT('name', 'Scale 1', 'price', 100, 'period', 'month', 'features', JSON_ARRAY('500 messages/mo')),
        JSON_OBJECT('name', 'Teams', 'price', 30, 'period', 'month', 'features', JSON_ARRAY('Team workspace', 'Shared projects'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'Supabase', 'website', 'https://supabase.com', 'description', 'Built-in auth and database for every generated app.'),
        JSON_OBJECT('name', 'Stripe', 'website', 'https://stripe.com', 'description', 'Wire payments via natural-language prompts.'),
        JSON_OBJECT('name', 'Resend', 'website', 'https://resend.com', 'description', 'Email integration for transactional sends.'),
        JSON_OBJECT('name', 'GitHub', 'website', 'https://github.com', 'description', 'Bi-directional sync — own your code.'),
        JSON_OBJECT('name', 'Custom domains', 'website', 'https://lovable.dev', 'description', 'Connect your own domain to Lovable deploys.')
      ),
  support_channels    = JSON_ARRAY('Documentation', 'Discord community', 'Email', 'Community forum'),
  training_options    = JSON_ARRAY('Docs', 'YouTube tutorials', 'Templates', 'Showcase'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY('GDPR'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Lovable?', 'answer', 'Lovable (formerly GPT Engineer) is a prompt-to-app builder that generates React + Supabase full-stack apps and deploys them.'),
        JSON_OBJECT('question', 'Do I need to code?', 'answer', 'No — Lovable is designed for non-developers. You can refine apps through chat. Developers can edit code via GitHub sync.'),
        JSON_OBJECT('question', 'How is Lovable different from Bolt.new?', 'answer', 'Both build full-stack apps from prompts. Lovable focuses on Supabase + production-ready apps; Bolt.new runs apps in WebContainers in-browser.'),
        JSON_OBJECT('question', 'Can I integrate Stripe?', 'answer', 'Yes — Lovable can wire Stripe checkout and Resend email into your generated app via natural-language prompts.'),
        JSON_OBJECT('question', 'Can I deploy to my own domain?', 'answer', 'Yes — custom domains are supported on Starter+ plans.'),
        JSON_OBJECT('question', 'Is the code mine?', 'answer', 'Yes — you can sync to GitHub and own the code in full. Lovable doesn''t lock you in.')
      ),
  pros                = JSON_ARRAY('Genuinely no-code feel for full-stack apps', 'Supabase + Stripe + Resend pre-wired', 'GitHub sync = code ownership', 'Custom domain support', 'Active product velocity', 'Strong showcase of real apps shipped'),
  cons                = JSON_ARRAY('Per-message limits create friction for big projects', 'Best for new projects — less for migrations', 'Tied to React + Supabase stack', 'Less flexibility than a full IDE'),
  starting_price      = 20,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'lovable';

-- aider
UPDATE submissions SET
  header_tags         = JSON_ARRAY('CLI coding agent', 'Open source', 'Git-native'),
  industries_served   = JSON_ARRAY('Software Development', 'Open Source', 'Startups', 'Indie Developers', 'SaaS & Software', 'Education', 'Research & Education', 'Engineering Teams'),
  use_cases           = JSON_ARRAY('Pair programming from the terminal', 'Multi-file code edits', 'Git-native AI coding', 'Refactoring with diff review', 'Bug fixes via chat', 'Test generation', 'Adding features to existing code', 'Local-only coding workflow'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies'),
  key_features        = JSON_ARRAY('CLI tool — runs in any terminal', 'Edits files in place + auto-commits to Git', 'Works with Claude, GPT, Gemini, DeepSeek, local LLMs', 'Repository map for codebase context', 'Voice mode (talk to Aider)', 'Web mode for browser interaction', 'Architect / editor model split for accuracy', 'Linting + test integration', 'Open source (Apache 2.0)', 'Bring your own LLM key'),
  features            = JSON_ARRAY('CLI tool — runs in any terminal', 'Edits files in place + auto-commits to Git', 'Works with Claude, GPT, Gemini, DeepSeek, local LLMs', 'Repository map for codebase context', 'Voice mode (talk to Aider)', 'Web mode for browser interaction', 'Architect / editor model split for accuracy', 'Linting + test integration', 'Open source (Apache 2.0)', 'Bring your own LLM key'),
  pricing_model       = 'free',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Aider (open source)', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('Aider itself is free + open-source', 'All features unlocked', 'Self-hosted by definition')),
        JSON_OBJECT('name', 'LLM API costs', 'price', NULL, 'period', 'usage', 'features', JSON_ARRAY('Pay your LLM provider per token', '~$1-5/day Claude Sonnet intensive use', 'Local LLMs (Ollama, etc.) are free'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'Anthropic Claude', 'website', 'https://www.anthropic.com', 'description', 'Strongest LLM pairing for Aider editing accuracy.'),
        JSON_OBJECT('name', 'OpenAI', 'website', 'https://openai.com', 'description', 'GPT-4o and o1 supported as editor + architect models.'),
        JSON_OBJECT('name', 'DeepSeek', 'website', 'https://www.deepseek.com', 'description', 'Best value LLM for cost-sensitive Aider users.'),
        JSON_OBJECT('name', 'Ollama (local)', 'website', 'https://ollama.com', 'description', 'Free local LLM runner — pairs with Aider offline.'),
        JSON_OBJECT('name', 'Git', 'website', 'https://git-scm.com', 'description', 'Aider auto-commits each edit — Git-native workflow.')
      ),
  support_channels    = JSON_ARRAY('GitHub issues', 'Discord community', 'Documentation'),
  training_options    = JSON_ARRAY('Docs', 'YouTube tutorials', 'GitHub examples', 'Subreddit community'),
  languages           = JSON_ARRAY('Polyglot — supports any language the LLM understands'),
  compliance          = JSON_ARRAY(),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'Is Aider free?', 'answer', 'Yes — Aider itself is free and open source (Apache 2.0). You pay your chosen LLM provider for tokens.'),
        JSON_OBJECT('question', 'Which LLM should I use with Aider?', 'answer', 'Claude 3.5 Sonnet and GPT-4o are the strongest for coding. DeepSeek is the best value. Ollama runs local LLMs for free.'),
        JSON_OBJECT('question', 'How does Aider handle Git?', 'answer', 'Aider auto-commits each AI edit to Git — every change is reviewable, revertible, and traceable.'),
        JSON_OBJECT('question', 'What is the architect / editor split?', 'answer', 'Architect mode lets a stronger reasoning model (e.g. o1) plan, while a faster model (e.g. Sonnet) executes the edits — improves accuracy on complex tasks.'),
        JSON_OBJECT('question', 'Can Aider work with my codebase?', 'answer', 'Yes — Aider builds a repository map and adds the relevant files to context based on your chat.'),
        JSON_OBJECT('question', 'Is Aider better than Cursor?', 'answer', 'Aider trades a GUI for terminal-native workflow and bring-your-own-LLM. Power users + open-source devs love it; UI-first devs prefer Cursor.')
      ),
  pros                = JSON_ARRAY('Truly free — pay only your LLM costs', 'Open source — fully auditable', 'Git-native — every edit is a commit', 'Works with any LLM (Claude, GPT, local Ollama)', 'CLI workflow integrates with existing tooling', 'Architect/editor mode is uniquely effective'),
  cons                = JSON_ARRAY('Terminal-only — no GUI', 'Less polished than commercial tools', 'Setup involves picking + paying for an LLM', 'No central support — community-driven'),
  starting_price      = 0,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'aider';


-- ============================================================
-- GROUP: AI AGENTS & AUTOMATION (6 listings)
-- ============================================================

-- autogpt
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Open source agent', 'Autonomous tasks', 'Self-host'),
  industries_served   = JSON_ARRAY('Open Source', 'Software Development', 'Research & Education', 'SaaS & Software', 'Marketing & Advertising', 'Operations', 'Startups', 'Hobbyist AI'),
  use_cases           = JSON_ARRAY('Autonomous web research', 'Multi-step task chains', 'Data extraction pipelines', 'Workflow automation', 'Agent prototyping', 'Self-hosted AI workforce', 'Marketing automation', 'Content generation pipelines'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies'),
  key_features        = JSON_ARRAY('Open-source autonomous agent framework', 'AutoGPT Platform (no-code builder)', 'Block-based agent composition', 'Self-hosted Docker deployment', 'Hosted cloud (beta)', 'OpenAI, Anthropic, Groq, Llama support', 'Marketplace of community agents', 'Scheduled agent runs', 'Web search + file I/O tools', 'Python SDK for custom blocks'),
  features            = JSON_ARRAY('Open-source autonomous agent framework', 'AutoGPT Platform (no-code builder)', 'Block-based agent composition', 'Self-hosted Docker deployment', 'Hosted cloud (beta)', 'OpenAI, Anthropic, Groq, Llama support', 'Marketplace of community agents', 'Scheduled agent runs', 'Web search + file I/O tools', 'Python SDK for custom blocks'),
  pricing_model       = 'free',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Open Source', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('Self-host the AutoGPT Platform', 'Pay only your LLM API costs', 'MIT licence', 'Full source on GitHub')),
        JSON_OBJECT('name', 'Cloud (beta waitlist)', 'price', NULL, 'period', 'usage', 'features', JSON_ARRAY('Hosted AutoGPT Platform', 'Pay-as-you-go pricing', 'Pre-built agent marketplace'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'OpenAI', 'website', 'https://openai.com', 'description', 'GPT-4o and o1 as agent reasoning engines.'),
        JSON_OBJECT('name', 'Anthropic', 'website', 'https://www.anthropic.com', 'description', 'Claude as agent reasoning engine.'),
        JSON_OBJECT('name', 'GitHub', 'website', 'https://github.com/Significant-Gravitas/AutoGPT', 'description', 'Source repo with 150k+ stars.'),
        JSON_OBJECT('name', 'Docker', 'website', 'https://www.docker.com', 'description', 'Recommended self-host deployment path.'),
        JSON_OBJECT('name', 'Python SDK', 'website', 'https://docs.agpt.co', 'description', 'Build custom blocks and tools for agents.')
      ),
  support_channels    = JSON_ARRAY('GitHub issues', 'Discord community', 'Documentation'),
  training_options    = JSON_ARRAY('Docs', 'YouTube tutorials', 'Community examples', 'Marketplace agents'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY(),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is AutoGPT?', 'answer', 'AutoGPT is an open-source autonomous AI agent framework — give it a goal, it plans the steps, calls tools, and iterates until done. The AutoGPT Platform adds a no-code builder.'),
        JSON_OBJECT('question', 'Is AutoGPT free?', 'answer', 'Yes — the open-source platform is free under MIT licence. You pay only your LLM provider for tokens used during agent runs.'),
        JSON_OBJECT('question', 'How is AutoGPT Platform different from the old AutoGPT?', 'answer', 'The 2023 "AutoGPT" was a single Python script. The Platform is a no-code builder with blocks, scheduled runs, and a marketplace — built on the same autonomous principles.'),
        JSON_OBJECT('question', 'What LLMs does AutoGPT support?', 'answer', 'OpenAI (GPT-4o, o1), Anthropic (Claude), Groq, Llama via Ollama, and others — switchable per agent.'),
        JSON_OBJECT('question', 'Can I share my agent?', 'answer', 'Yes — the AutoGPT Marketplace lets creators publish agents others can run, with optional monetisation in the roadmap.'),
        JSON_OBJECT('question', 'How do I self-host?', 'answer', 'Clone the GitHub repo and run docker compose up — full instructions in the docs at docs.agpt.co.')
      ),
  pros                = JSON_ARRAY('Open source — the original autonomous agent project', 'No-code AutoGPT Platform broadens accessibility', 'Marketplace of community-built agents', 'Self-host = full data control', 'Active maintenance and roadmap', 'Strong community of 150k+ GitHub stars'),
  cons                = JSON_ARRAY('Self-hosted setup non-trivial for non-devs', 'Cloud platform still in beta', 'Some old "AutoGPT" memes from 2023 are misleading', 'LLM API costs add up on long runs'),
  starting_price      = 0,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'autogpt';

-- multion
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Browser agent', 'Agent Q', 'API for builders'),
  industries_served   = JSON_ARRAY('SaaS & Software', 'E-commerce', 'Marketing & Advertising', 'Operations', 'Research & Education', 'Recruiting', 'Customer Support', 'Startups'),
  use_cases           = JSON_ARRAY('Browser automation', 'Web research at scale', 'Lead enrichment', 'E-commerce ordering', 'Form filling', 'Booking flights / hotels', 'Comparison shopping', 'Automated workflows'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Agent Q (next-gen browser agent)', 'Cloud-hosted browser sessions', 'Browser-control via natural language', 'Multi-step task execution', 'Headless and headful modes', 'API for developers', 'Authenticated session handling', 'Custom workflows recording', 'Built on MCTS planning', 'Retina (vision-grounded browsing)'),
  features            = JSON_ARRAY('Agent Q (next-gen browser agent)', 'Cloud-hosted browser sessions', 'Browser-control via natural language', 'Multi-step task execution', 'Headless and headful modes', 'API for developers', 'Authenticated session handling', 'Custom workflows recording', 'Built on MCTS planning', 'Retina (vision-grounded browsing)'),
  pricing_model       = 'usage',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('Limited free monthly steps', 'API access for prototyping', 'Community Discord support')),
        JSON_OBJECT('name', 'Pro', 'price', NULL, 'period', 'usage', 'features', JSON_ARRAY('Pay-per-agent-step pricing', 'Higher rate limits', 'Faster execution', 'Email support')),
        JSON_OBJECT('name', 'Enterprise', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Volume pricing', 'Dedicated infra', 'SLA + dedicated support'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'MultiOn API', 'website', 'https://docs.multion.ai', 'description', 'Developer API for embedding the agent into your product.'),
        JSON_OBJECT('name', 'Python SDK', 'website', 'https://docs.multion.ai', 'description', 'Official Python SDK for agent orchestration.'),
        JSON_OBJECT('name', 'TypeScript SDK', 'website', 'https://docs.multion.ai', 'description', 'First-class TS / JS SDK.'),
        JSON_OBJECT('name', 'Zapier', 'website', 'https://zapier.com', 'description', 'Trigger MultiOn from 6,000+ apps via Zapier.')
      ),
  support_channels    = JSON_ARRAY('API documentation', 'Discord community', 'Email support'),
  training_options    = JSON_ARRAY('Docs', 'Sample agents', 'Cookbook recipes'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY(),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is MultiOn?', 'answer', 'MultiOn is an AI agent that controls a web browser to complete multi-step tasks — ordering food, booking flights, scraping data, filling forms — via natural-language instructions.'),
        JSON_OBJECT('question', 'What is Agent Q?', 'answer', 'Agent Q is MultiOn''s next-gen agent that combines Monte Carlo Tree Search planning with vision grounding for more reliable autonomous browsing.'),
        JSON_OBJECT('question', 'Is MultiOn an API or a product?', 'answer', 'Both — MultiOn ships consumer agents and the MultiOn API for developers to embed agents into their own products.'),
        JSON_OBJECT('question', 'Can MultiOn handle logins?', 'answer', 'Yes — MultiOn supports authenticated sessions; you can configure persistent sessions or pass credentials securely.'),
        JSON_OBJECT('question', 'How is MultiOn billed?', 'answer', 'By agent steps (each browser action is a step). Pricing scales with usage; volume discounts on Enterprise.'),
        JSON_OBJECT('question', 'Is there an SDK?', 'answer', 'Yes — Python and TypeScript SDKs are official; community SDKs exist for other languages.')
      ),
  pros                = JSON_ARRAY('Genuinely autonomous browser control', 'Agent Q + Retina = state-of-art research', 'Strong developer API', 'Authenticated sessions handled cleanly', 'Per-step billing scales naturally', 'Solid SDK + documentation'),
  cons                = JSON_ARRAY('Step pricing can spike on complex tasks', 'Newer agent paradigm — site changes can break flows', 'Less mature ecosystem than Browser-Use / Playwright', 'Best results require careful prompting'),
  starting_price      = 0,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'multion';

-- adept
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Computer-use AI', 'ACT-2 model', 'Enterprise workflows'),
  industries_served   = JSON_ARRAY('Enterprises', 'Financial Services', 'Insurance', 'Healthcare', 'Government', 'Operations', 'SaaS & Software', 'Knowledge Work'),
  use_cases           = JSON_ARRAY('Software UI automation', 'Customer service workflows', 'Claims processing', 'Underwriting automation', 'Multi-app data entry', 'Enterprise productivity', 'Repetitive task elimination', 'Knowledge worker copilot'),
  target_company_sizes = JSON_ARRAY('Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('ACT-2 (Action Transformer 2) model', 'Multimodal UI understanding (screen + text)', 'Adept Workflows product', 'Natural-language commands across apps', 'No-screen-scraping — visual UI grounding', 'Persistent workflow recording', 'Enterprise SSO + audit', 'Fuyu open-source models (vision LLMs)', 'API for embedded automation', 'On-prem deployment available'),
  features            = JSON_ARRAY('ACT-2 (Action Transformer 2) model', 'Multimodal UI understanding (screen + text)', 'Adept Workflows product', 'Natural-language commands across apps', 'No-screen-scraping — visual UI grounding', 'Persistent workflow recording', 'Enterprise SSO + audit', 'Fuyu open-source models (vision LLMs)', 'API for embedded automation', 'On-prem deployment available'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Enterprise', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Adept Workflows licensing', 'Multimodal UI agent', 'SSO + audit + governance', 'Dedicated support'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'Salesforce', 'website', 'https://www.salesforce.com', 'description', 'Adept automates flows inside Salesforce UI.'),
        JSON_OBJECT('name', 'SAP', 'website', 'https://www.sap.com', 'description', 'Adept operates SAP screens for enterprise workflows.'),
        JSON_OBJECT('name', 'ServiceNow', 'website', 'https://www.servicenow.com', 'description', 'Workflow automation inside ServiceNow.'),
        JSON_OBJECT('name', 'Microsoft 365', 'website', 'https://www.microsoft.com/microsoft-365', 'description', 'Office and Teams workflows.'),
        JSON_OBJECT('name', 'Custom internal apps', 'website', 'https://www.adept.ai', 'description', 'Works on any UI without API — perfect for legacy software.')
      ),
  support_channels    = JSON_ARRAY('Dedicated CSM', 'Email support', 'Enterprise SE', 'Documentation'),
  training_options    = JSON_ARRAY('Onboarding workshops', 'Custom training', 'Documentation', 'Workflow templates'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY('SOC 2', 'GDPR'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Adept?', 'answer', 'Adept builds a multimodal AI agent that operates software UIs as a human would — see the screen, click buttons, type — guided by natural language.'),
        JSON_OBJECT('question', 'What happened with Amazon in 2024?', 'answer', 'In June 2024 Amazon licensed Adept''s technology and hired most of its team. Adept continues as an independent product brand focused on enterprise.'),
        JSON_OBJECT('question', 'What is ACT-2?', 'answer', 'ACT-2 is Adept''s Action Transformer 2 — a foundation model trained to ground natural-language tasks into pixel-level UI actions.'),
        JSON_OBJECT('question', 'How is Adept different from RPA?', 'answer', 'Traditional RPA (UiPath, Automation Anywhere) records hard-coded scripts. Adept uses a vision-language model that handles UI changes and ambiguity.'),
        JSON_OBJECT('question', 'Is Adept open-source?', 'answer', 'Adept''s Fuyu vision-language family of models was open-sourced. ACT-2 + Workflows is enterprise-only.'),
        JSON_OBJECT('question', 'Can Adept run on-prem?', 'answer', 'Yes — Enterprise customers can deploy on-prem or in VPC for regulated industries.')
      ),
  pros                = JSON_ARRAY('Visual UI grounding works on any software', 'No screen-scraping or brittle scripts', 'Excellent for legacy enterprise software', 'Open-source Fuyu models contributed back', 'Compliance posture for regulated industries', 'Foundation-model team (now Amazon-linked)'),
  cons                = JSON_ARRAY('Enterprise-only — no self-serve product', 'Amazon licensing reshaped the team in 2024', 'Pricing requires sales conversation', 'Smaller community than UiPath / RPA ecosystem'),
  starting_price      = NULL,
  starting_price_period = 'custom',
  has_free_trial      = 0,
  has_free_version    = 0,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'adept';

-- lindy-ai
UPDATE submissions SET
  header_tags         = JSON_ARRAY('No-code AI agents', 'Workflow automation', 'Business assistants'),
  industries_served   = JSON_ARRAY('SaaS & Software', 'Sales', 'Customer Support', 'Marketing & Advertising', 'Recruiting', 'Operations', 'Real Estate', 'Professional Services'),
  use_cases           = JSON_ARRAY('Sales follow-ups', 'Meeting scheduling', 'Email triage', 'Lead qualification', 'Customer support automation', 'Calendar management', 'Phone agent (Lindy Phone)', 'Cross-app workflow automation'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('No-code agent builder', 'Trigger → Action flows', '4,000+ integrations (via Composio + native)', 'Lindy Phone (voice agents)', 'Lindy Email (inbox handler)', 'Lindy Meet (meeting notetaker + actions)', 'Multi-step LLM reasoning per node', 'Conditional logic + loops', 'Knowledge bases per Lindy', 'Embed agent webhook in any app'),
  features            = JSON_ARRAY('No-code agent builder', 'Trigger → Action flows', '4,000+ integrations (via Composio + native)', 'Lindy Phone (voice agents)', 'Lindy Email (inbox handler)', 'Lindy Meet (meeting notetaker + actions)', 'Multi-step LLM reasoning per node', 'Conditional logic + loops', 'Knowledge bases per Lindy', 'Embed agent webhook in any app'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('400 tasks/mo', 'Unlimited Lindies', 'All core features')),
        JSON_OBJECT('name', 'Pro', 'price', 49.99, 'period', 'month', 'features', JSON_ARRAY('5,000 tasks/mo', 'Phone calls included', 'Email support')),
        JSON_OBJECT('name', 'Business', 'price', 299.99, 'period', 'month', 'features', JSON_ARRAY('30,000 tasks/mo', '600 phone-call credits', 'Priority support')),
        JSON_OBJECT('name', 'Enterprise', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Custom volume', 'SSO + audit', 'Dedicated CSM'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'Gmail + Outlook', 'website', 'https://www.lindy.ai', 'description', 'Native email handling for triage and replies.'),
        JSON_OBJECT('name', 'Google Calendar', 'website', 'https://workspace.google.com/products/calendar/', 'description', 'Scheduling agent operates real-time calendars.'),
        JSON_OBJECT('name', 'Slack', 'website', 'https://slack.com', 'description', 'Trigger Lindies from Slack messages or DM Lindies.'),
        JSON_OBJECT('name', 'HubSpot + Salesforce', 'website', 'https://www.lindy.ai', 'description', 'Native CRM sync for sales workflows.'),
        JSON_OBJECT('name', 'Twilio (phone)', 'website', 'https://www.twilio.com', 'description', 'Backbone for Lindy Phone voice agents.'),
        JSON_OBJECT('name', 'Zapier + Composio', 'website', 'https://zapier.com', 'description', '4,000+ app integrations via partner platforms.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Slack community', 'Dedicated CSM (Enterprise)'),
  training_options    = JSON_ARRAY('Templates gallery', 'YouTube tutorials', 'Onboarding videos', 'Documentation'),
  languages           = JSON_ARRAY('English', 'Multilingual via underlying LLMs'),
  compliance          = JSON_ARRAY('SOC 2 Type II', 'GDPR'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Lindy?', 'answer', 'Lindy is a no-code AI agent builder — chain triggers (email arrived, calendar event, webhook) to actions (LLM reason, send email, update CRM) to automate business workflows.'),
        JSON_OBJECT('question', 'What is Lindy Phone?', 'answer', 'Lindy Phone gives your Lindies a phone number; they can make calls, take calls, transcribe, and act on the conversation.'),
        JSON_OBJECT('question', 'How is Lindy different from Zapier?', 'answer', 'Zapier wires apps via deterministic triggers. Lindy puts an LLM at each node — agents can reason, choose actions, and handle ambiguity.'),
        JSON_OBJECT('question', 'How many integrations?', 'answer', 'Native integrations cover the major SaaS apps (Gmail, Slack, HubSpot, Salesforce, etc.). 4,000+ more via Composio and Zapier partnerships.'),
        JSON_OBJECT('question', 'Is there a free tier?', 'answer', 'Yes — 400 tasks/mo with unlimited Lindies for individuals. Pro starts at $49.99/mo with 5,000 tasks.'),
        JSON_OBJECT('question', 'Can Lindies talk to each other?', 'answer', 'Yes — Lindies can call other Lindies as sub-agents for delegated workflows.')
      ),
  pros                = JSON_ARRAY('Lowest-friction agent builder in the market', '4,000+ integrations bridge any SaaS', 'Lindy Phone is a unique voice-agent capability', 'Templates gallery accelerates first agent', 'Strong sales + support agent use cases', 'Active product velocity'),
  cons                = JSON_ARRAY('Task pricing requires monitoring at scale', 'Phone-call credits separate from task counts', 'Some advanced flows still need workarounds', 'No on-prem deployment'),
  starting_price      = 49.99,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'lindy-ai';

-- relevance-ai
UPDATE submissions SET
  header_tags         = JSON_ARRAY('AI Workforce', 'Pre-built agents', 'Multi-model'),
  industries_served   = JSON_ARRAY('Sales', 'Marketing & Advertising', 'Customer Support', 'SaaS & Software', 'Operations', 'Recruiting', 'Financial Services', 'E-commerce'),
  use_cases           = JSON_ARRAY('AI sales reps (Bosh)', 'Lead enrichment + research', 'Inbound qualification', 'Customer support automation', 'Content generation pipelines', 'Email outreach', 'Recruitment screening', 'Onboarding automation'),
  target_company_sizes = JSON_ARRAY('Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Pre-built AI workers (Bosh, Lima, Apla)', 'Custom agent builder', 'Multi-model orchestration (GPT, Claude, Llama)', 'Knowledge base + RAG built-in', 'Tool use across 100+ integrations', 'Long-running async jobs', 'Slack + email + Twilio triggers', 'Sub-agent delegation', 'Workflow + form-based UIs', 'Embed agents in your product'),
  features            = JSON_ARRAY('Pre-built AI workers (Bosh, Lima, Apla)', 'Custom agent builder', 'Multi-model orchestration (GPT, Claude, Llama)', 'Knowledge base + RAG built-in', 'Tool use across 100+ integrations', 'Long-running async jobs', 'Slack + email + Twilio triggers', 'Sub-agent delegation', 'Workflow + form-based UIs', 'Embed agents in your product'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('10k credits/mo', 'Unlimited agents', 'All core integrations')),
        JSON_OBJECT('name', 'Pro', 'price', 19, 'period', 'month', 'features', JSON_ARRAY('100k credits/mo', 'Pro models', 'Custom domains')),
        JSON_OBJECT('name', 'Team', 'price', 199, 'period', 'month', 'features', JSON_ARRAY('400k credits/mo', 'Team workspace', 'Priority support')),
        JSON_OBJECT('name', 'Business', 'price', 599, 'period', 'month', 'features', JSON_ARRAY('1.2M credits/mo', 'SSO', 'Advanced governance')),
        JSON_OBJECT('name', 'Enterprise', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Custom volume', 'Dedicated CSM', 'On-prem available'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'HubSpot + Salesforce', 'website', 'https://relevanceai.com', 'description', 'Native CRM sync for AI sales reps.'),
        JSON_OBJECT('name', 'Slack', 'website', 'https://slack.com', 'description', 'Trigger and chat with agents inside Slack.'),
        JSON_OBJECT('name', 'Apollo + LinkedIn', 'website', 'https://relevanceai.com', 'description', 'Lead research and enrichment via Apollo / LinkedIn data.'),
        JSON_OBJECT('name', 'Gmail + Outlook', 'website', 'https://relevanceai.com', 'description', 'Native email handling for outreach agents.'),
        JSON_OBJECT('name', 'Zapier', 'website', 'https://zapier.com', 'description', 'Bridge to 6,000+ additional apps.'),
        JSON_OBJECT('name', 'Twilio', 'website', 'https://www.twilio.com', 'description', 'Voice and SMS for phone agents.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Slack community', 'Dedicated CSM (Enterprise)'),
  training_options    = JSON_ARRAY('Templates library', 'YouTube tutorials', 'Documentation', 'Onboarding sessions'),
  languages           = JSON_ARRAY('English', 'Multilingual via underlying LLMs'),
  compliance          = JSON_ARRAY('SOC 2 Type II', 'GDPR'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is the AI Workforce?', 'answer', 'Relevance AI sells "AI workers" — pre-built agents with names like Bosh (BDR), Lima (recruiter), and Apla (data analyst) that handle full job functions, not just single tasks.'),
        JSON_OBJECT('question', 'Can I build custom agents?', 'answer', 'Yes — Relevance has a no-code agent builder with tools, knowledge bases, sub-agents, and integrations.'),
        JSON_OBJECT('question', 'How is Relevance different from Lindy?', 'answer', 'Both build no-code AI agents. Relevance emphasises pre-built "AI workers" by job role; Lindy emphasises trigger-action flows + phone agents.'),
        JSON_OBJECT('question', 'Which LLMs does Relevance support?', 'answer', 'GPT-4o, Claude, Llama, Gemini, and others — orchestrated per task within an agent.'),
        JSON_OBJECT('question', 'What are credits?', 'answer', 'Credits are the billing unit for LLM calls and tool actions. Heavier models / longer runs consume more credits.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — Relevance agents can be triggered via REST API, webhooks, or embedded in your product.')
      ),
  pros                = JSON_ARRAY('Pre-built AI workers shortcut to value', 'Strong sales + recruitment agent positioning', 'Custom builder is genuinely flexible', 'Multi-model orchestration native', '100+ integrations covered out of the box', 'Embed agents in your own product'),
  cons                = JSON_ARRAY('Credit pricing complex at scale', 'Higher per-month cost than Lindy at low end', 'Pre-built workers need calibration to your data', 'Smaller community than horizontal automation tools'),
  starting_price      = 19,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'relevance-ai';

-- crewai
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Multi-agent framework', 'Open source', 'CrewAI Studio'),
  industries_served   = JSON_ARRAY('Software Development', 'Open Source', 'SaaS & Software', 'Research & Education', 'Operations', 'Enterprises', 'Tech Agencies', 'Startups'),
  use_cases           = JSON_ARRAY('Multi-agent system orchestration', 'Role-based agent teams', 'Research pipelines', 'Content generation crews', 'Code review agents', 'Customer support orchestration', 'Data analysis automation', 'Hierarchical task delegation'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Python open-source framework (Apache 2.0)', 'Role + goal + backstory per agent', 'Sequential and hierarchical processes', 'Tools per agent (web search, files, code, custom)', 'CrewAI Studio (visual builder)', 'CrewAI Plus (hosted)', 'CrewAI Enterprise (managed)', 'LangChain + LiteLLM compatible', 'Memory and reflection primitives', 'Templates library and community crews'),
  features            = JSON_ARRAY('Python open-source framework (Apache 2.0)', 'Role + goal + backstory per agent', 'Sequential and hierarchical processes', 'Tools per agent (web search, files, code, custom)', 'CrewAI Studio (visual builder)', 'CrewAI Plus (hosted)', 'CrewAI Enterprise (managed)', 'LangChain + LiteLLM compatible', 'Memory and reflection primitives', 'Templates library and community crews'),
  pricing_model       = 'free',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Open Source', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('Free framework, Apache 2.0', 'Run on your own infra', 'Pay LLM costs only', 'Full Python SDK')),
        JSON_OBJECT('name', 'CrewAI+', 'price', NULL, 'period', 'usage', 'features', JSON_ARRAY('Hosted CrewAI Studio (visual builder)', 'Run crews in the cloud', 'Pay-per-execution pricing', 'Templates and monitoring')),
        JSON_OBJECT('name', 'Enterprise', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Managed deployment', 'On-prem available', 'SSO + audit', 'Dedicated support'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'OpenAI / Anthropic / Groq', 'website', 'https://docs.crewai.com', 'description', 'LLM-agnostic — pick any provider per agent.'),
        JSON_OBJECT('name', 'LangChain', 'website', 'https://www.langchain.com', 'description', 'Compatible with LangChain tools and chains.'),
        JSON_OBJECT('name', 'LlamaIndex', 'website', 'https://www.llamaindex.ai', 'description', 'Use LlamaIndex retrievers as agent tools.'),
        JSON_OBJECT('name', 'GitHub', 'website', 'https://github.com/crewAIInc/crewAI', 'description', 'Source repo with 25k+ stars.'),
        JSON_OBJECT('name', 'CrewAI Studio', 'website', 'https://www.crewai.com', 'description', 'Visual no-code builder for crews.')
      ),
  support_channels    = JSON_ARRAY('GitHub issues', 'Discord community', 'Documentation', 'Enterprise CSM'),
  training_options    = JSON_ARRAY('Documentation', 'YouTube tutorials', 'DeepLearning.AI course', 'Community examples'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY('SOC 2 (CrewAI Enterprise)'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is CrewAI?', 'answer', 'CrewAI is an open-source Python framework for orchestrating teams of AI agents — each with a role, goal, and tools — working together on complex tasks.'),
        JSON_OBJECT('question', 'How is CrewAI different from LangChain?', 'answer', 'LangChain is a general LLM orchestration library. CrewAI specifically models multi-agent role-based crews with sequential / hierarchical processes — higher level abstraction.'),
        JSON_OBJECT('question', 'Is CrewAI free?', 'answer', 'Yes — the framework is free + open source. CrewAI+ (hosted) and Enterprise are paid offerings.'),
        JSON_OBJECT('question', 'Which LLMs work with CrewAI?', 'answer', 'Any LLM accessible via LiteLLM — OpenAI, Anthropic, Groq, local models via Ollama, Azure, Bedrock, and dozens more.'),
        JSON_OBJECT('question', 'What is CrewAI Studio?', 'answer', 'A visual no-code builder where you define agents, tools, and processes graphically — translates to CrewAI Python under the hood.'),
        JSON_OBJECT('question', 'Is there a course?', 'answer', 'Yes — DeepLearning.AI''s "Multi AI Agent Systems with crewAI" is the recommended starting point.')
      ),
  pros                = JSON_ARRAY('Cleanest abstraction for multi-agent systems', 'Open source + Apache 2.0', 'Vibrant Python ecosystem (25k+ GitHub stars)', 'LLM-agnostic via LiteLLM', 'Visual Studio for non-coders', 'Excellent documentation + tutorials'),
  cons                = JSON_ARRAY('Python framework — non-devs need Studio', 'Multi-agent overhead vs single-agent flows', 'Newer than LangChain — smaller ecosystem of tools', 'Production observability still maturing'),
  starting_price      = 0,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'crewai';


-- ============================================================
-- GROUP: WRITING & PRODUCTIVITY (8 listings)
-- ============================================================

-- jasper
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Marketing copy AI', 'Brand voice', 'Campaign workflows'),
  industries_served   = JSON_ARRAY('Marketing & Advertising', 'E-commerce', 'Publishing', 'Agencies', 'SaaS & Software', 'Retail', 'Financial Services', 'Travel & Hospitality'),
  use_cases           = JSON_ARRAY('Blog posts + long-form articles', 'Ad copy + social campaigns', 'Email marketing', 'Product descriptions', 'SEO content briefs', 'Brand voice templates', 'Campaign brainstorming', 'Translations + transcreations'),
  target_company_sizes = JSON_ARRAY('Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Brand Voice — train Jasper on your brand', 'Knowledge Base — facts Jasper memorises', 'Jasper Chat', 'Templates for 50+ marketing assets', 'Jasper Art (image generation)', 'Campaigns (multi-asset workflows)', 'Browser extension for any web app', 'SEO mode powered by Surfer SEO', 'API for programmatic generation', 'Team workspaces with shared assets'),
  features            = JSON_ARRAY('Brand Voice — train Jasper on your brand', 'Knowledge Base — facts Jasper memorises', 'Jasper Chat', 'Templates for 50+ marketing assets', 'Jasper Art (image generation)', 'Campaigns (multi-asset workflows)', 'Browser extension for any web app', 'SEO mode powered by Surfer SEO', 'API for programmatic generation', 'Team workspaces with shared assets'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Creator', 'price', 39, 'period', 'month', 'features', JSON_ARRAY('1 user, 1 brand voice', 'Templates + Chat', 'Browser extension', 'Jasper Art (limited)')),
        JSON_OBJECT('name', 'Pro', 'price', 59, 'period', 'month', 'features', JSON_ARRAY('5 users, 3 brand voices', 'Campaigns', 'Collaboration', 'Higher Art limits')),
        JSON_OBJECT('name', 'Business', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Unlimited users', 'Unlimited brand voices', 'API access', 'SSO + dedicated CSM'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'Surfer SEO', 'website', 'https://surferseo.com', 'description', 'Native SEO scoring + content brief integration.'),
        JSON_OBJECT('name', 'Grammarly', 'website', 'https://www.grammarly.com', 'description', 'Browser extension chains nicely with Grammarly proofing.'),
        JSON_OBJECT('name', 'Webflow', 'website', 'https://webflow.com', 'description', 'Push generated copy directly to Webflow CMS.'),
        JSON_OBJECT('name', 'HubSpot', 'website', 'https://www.hubspot.com', 'description', 'Integrated marketing workflow with HubSpot CMS.'),
        JSON_OBJECT('name', 'Jasper API', 'website', 'https://www.jasper.ai/api', 'description', 'Programmatic generation for product integrations.'),
        JSON_OBJECT('name', 'Zapier', 'website', 'https://zapier.com', 'description', 'Connect Jasper to 6,000+ apps.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Live chat', 'Dedicated CSM (Business)'),
  training_options    = JSON_ARRAY('Jasper Academy', 'Templates library', 'Webinars', 'YouTube tutorials'),
  languages           = JSON_ARRAY('English', '30+ languages supported'),
  compliance          = JSON_ARRAY('SOC 2 Type II', 'GDPR'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Brand Voice?', 'answer', 'Brand Voice ingests examples of your writing and generates new copy that mirrors your tone, vocabulary, and style guide — repeatable across writers.'),
        JSON_OBJECT('question', 'How does Jasper compare to ChatGPT?', 'answer', 'Jasper layers Brand Voice, Knowledge Base, marketing templates, Campaigns workflow, and team features on top of underlying LLMs — purpose-built for marketing teams.'),
        JSON_OBJECT('question', 'Which LLMs power Jasper?', 'answer', 'Jasper orchestrates GPT-4, Claude, and other models behind the scenes — users see one Jasper interface.'),
        JSON_OBJECT('question', 'Is there a free trial?', 'answer', 'Yes — 7-day free trial across all plans, no credit card prompt for the first day on most regions.'),
        JSON_OBJECT('question', 'Can Jasper generate images?', 'answer', 'Yes — Jasper Art is bundled, generating marketing-appropriate visuals with commercial-use rights.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — Business-tier customers get API access for programmatic content generation.')
      ),
  pros                = JSON_ARRAY('Brand Voice + Knowledge Base ahead of generic LLMs', 'Templates speed up marketing teams', 'Campaigns workflow for multi-asset projects', 'SEO mode via Surfer integration', 'Browser extension fits any tool', 'Strong enterprise + compliance posture'),
  cons                = JSON_ARRAY('Higher cost than commodity LLM access', 'Best for marketing — overkill for general writing', 'Templates can feel formulaic without prompt engineering', 'Free trial only — no permanent free tier'),
  starting_price      = 39,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 0,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'jasper';

-- copy-ai
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Workflow automation', 'GTM AI', 'Sales + marketing'),
  industries_served   = JSON_ARRAY('Marketing & Advertising', 'Sales', 'E-commerce', 'SaaS & Software', 'Agencies', 'Customer Support', 'Real Estate', 'Financial Services'),
  use_cases           = JSON_ARRAY('Cold email writing', 'Account research workflows', 'Sales call prep', 'Blog post outlines', 'Ad copy generation', 'Product descriptions', 'Pipeline enrichment', 'Multi-step content automation'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Workflows (multi-step automation)', '90+ marketing copywriting templates', 'GTM AI Platform for sales teams', 'Account research agent', 'Brand voice settings', 'Multi-language outputs (95+)', 'Chrome + Edge extensions', 'API + Zapier integration', 'Team workspaces', 'Bulk content generation'),
  features            = JSON_ARRAY('Workflows (multi-step automation)', '90+ marketing copywriting templates', 'GTM AI Platform for sales teams', 'Account research agent', 'Brand voice settings', 'Multi-language outputs (95+)', 'Chrome + Edge extensions', 'API + Zapier integration', 'Team workspaces', 'Bulk content generation'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('2,000 words/mo', 'Chat + 90 templates', '1 user')),
        JSON_OBJECT('name', 'Starter', 'price', 49, 'period', 'month', 'features', JSON_ARRAY('Unlimited words', 'Brand voice', 'Workflows (limited)', '5 brand voices')),
        JSON_OBJECT('name', 'Advanced', 'price', 249, 'period', 'month', 'features', JSON_ARRAY('Unlimited workflows', '15k credits/mo', 'API access', 'Up to 25 users')),
        JSON_OBJECT('name', 'Enterprise', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Custom volume', 'SSO + audit', 'Dedicated CSM'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'HubSpot + Salesforce', 'website', 'https://www.copy.ai', 'description', 'Native CRM sync for sales workflows.'),
        JSON_OBJECT('name', 'Clay + Apollo', 'website', 'https://www.copy.ai', 'description', 'Lead enrichment pipeline integrations.'),
        JSON_OBJECT('name', 'Slack', 'website', 'https://slack.com', 'description', 'Trigger workflows or chat with Copy.ai inside Slack.'),
        JSON_OBJECT('name', 'Chrome / Edge extensions', 'website', 'https://www.copy.ai/extensions', 'description', 'Generate copy inside any web app.'),
        JSON_OBJECT('name', 'Zapier + API', 'website', 'https://www.copy.ai/api', 'description', 'Bridge Copy.ai workflows to 6,000+ apps.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Live chat (paid plans)', 'Dedicated CSM (Enterprise)'),
  training_options    = JSON_ARRAY('Copy.ai Academy', 'Templates library', 'Webinars', 'YouTube channel'),
  languages           = JSON_ARRAY('95+ languages'),
  compliance          = JSON_ARRAY('SOC 2 Type II', 'GDPR'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'How has Copy.ai evolved?', 'answer', 'Copy.ai started as a marketing copy generator in 2020 and has expanded into a GTM AI Platform — workflows that run sales + marketing automation, not just one-off copy.'),
        JSON_OBJECT('question', 'What are Workflows?', 'answer', 'Workflows are multi-step Copy.ai pipelines — pull data from a CRM, enrich with web research, draft personalised outreach, and write the result back. Chains LLMs + tools.'),
        JSON_OBJECT('question', 'Is there a free tier?', 'answer', 'Yes — 2,000 words/mo with 90+ templates and chat. No card required.'),
        JSON_OBJECT('question', 'How is Copy.ai different from Jasper?', 'answer', 'Both started in marketing copy. Copy.ai now leans into GTM workflows + sales agents; Jasper leans into Brand Voice + content campaigns.'),
        JSON_OBJECT('question', 'Can it write in my brand voice?', 'answer', 'Yes — Starter+ plans support multiple saved brand voices that govern tone across generations.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — Advanced and Enterprise plans include API access for programmatic generation.')
      ),
  pros                = JSON_ARRAY('GTM AI Workflows are unique in the category', 'Generous free tier with full template access', 'Strong CRM + enrichment integrations', '95+ output languages', 'Chrome / Edge extensions for any tool', 'Active product pivot to GTM teams'),
  cons                = JSON_ARRAY('Workflow setup has a learning curve', 'Higher-tier pricing for full workflows', 'Two product personas (copy vs GTM) can confuse', 'Less brand voice depth than Jasper'),
  starting_price      = 49,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'copy-ai';

-- writesonic
UPDATE submissions SET
  header_tags         = JSON_ARRAY('SEO writing', 'Chatsonic', 'AI article writer'),
  industries_served   = JSON_ARRAY('Marketing & Advertising', 'SEO Agencies', 'E-commerce', 'Publishing', 'Bloggers', 'SaaS & Software', 'Affiliate Marketing', 'Content Studios'),
  use_cases           = JSON_ARRAY('SEO blog posts', 'Article rewriting', 'Ad copy + landing pages', 'Product descriptions', 'Bulk content generation', 'Real-time research with Chatsonic', 'Content briefs', 'Translations'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Agencies'),
  key_features        = JSON_ARRAY('AI Article Writer 6.0 (SEO-optimised)', 'Chatsonic (web-connected chat)', 'Photosonic (image gen)', 'Bulk article generation (CSV)', 'Bypass AI detection mode', 'Keyword research integration', 'Surfer SEO integration', 'Botsonic (custom chatbots)', 'WordPress + Shopify publishing', 'API + Zapier'),
  features            = JSON_ARRAY('AI Article Writer 6.0 (SEO-optimised)', 'Chatsonic (web-connected chat)', 'Photosonic (image gen)', 'Bulk article generation (CSV)', 'Bypass AI detection mode', 'Keyword research integration', 'Surfer SEO integration', 'Botsonic (custom chatbots)', 'WordPress + Shopify publishing', 'API + Zapier'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('25 monthly credits', 'Chatsonic + Photosonic limited', '1 user')),
        JSON_OBJECT('name', 'Individual', 'price', 20, 'period', 'month', 'features', JSON_ARRAY('100 quality articles', 'Brand voice', 'Bulk gen', 'AI detector bypass')),
        JSON_OBJECT('name', 'Standard', 'price', 99, 'period', 'month', 'features', JSON_ARRAY('300 articles/mo', '20 brand voices', 'Botsonic', 'Higher Photosonic limits')),
        JSON_OBJECT('name', 'Professional', 'price', 249, 'period', 'month', 'features', JSON_ARRAY('Unlimited articles', 'Enterprise integrations', 'API', 'Multi-user')),
        JSON_OBJECT('name', 'Advanced', 'price', 499, 'period', 'month', 'features', JSON_ARRAY('Custom volume', 'Priority support', 'Whitelabel options'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'WordPress', 'website', 'https://wordpress.org', 'description', 'Publish Writesonic articles directly to WordPress.'),
        JSON_OBJECT('name', 'Shopify', 'website', 'https://www.shopify.com', 'description', 'Generate and publish product descriptions.'),
        JSON_OBJECT('name', 'Surfer SEO', 'website', 'https://surferseo.com', 'description', 'SEO scoring inside Writesonic articles.'),
        JSON_OBJECT('name', 'Semrush', 'website', 'https://www.semrush.com', 'description', 'Keyword research data inside article briefs.'),
        JSON_OBJECT('name', 'API + Zapier', 'website', 'https://writesonic.com/api', 'description', 'Programmatic generation + 6,000+ app connections.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Live chat', 'Community Slack'),
  training_options    = JSON_ARRAY('Writesonic Academy', 'YouTube tutorials', 'Webinars', 'Templates'),
  languages           = JSON_ARRAY('25+ languages'),
  compliance          = JSON_ARRAY('SOC 2 (in progress)', 'GDPR'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Chatsonic?', 'answer', 'Chatsonic is Writesonic''s chat interface with real-time web access — like ChatGPT plus live search results and citations.'),
        JSON_OBJECT('question', 'Does Writesonic bypass AI detection?', 'answer', 'There''s an "anti-AI detector" mode that rewrites for more human-like phrasing. Note that detector tools improve constantly — claim is approximate.'),
        JSON_OBJECT('question', 'How is Writesonic different from Jasper / Copy.ai?', 'answer', 'Writesonic emphasises SEO long-form articles and bulk publishing pipelines, with stronger WordPress / Shopify integrations.'),
        JSON_OBJECT('question', 'What is Botsonic?', 'answer', 'Botsonic builds custom AI chatbots trained on your data for your website or product — no-code, with embed scripts.'),
        JSON_OBJECT('question', 'Can I generate bulk content?', 'answer', 'Yes — upload a CSV of keywords and Writesonic generates an article per row, with brand voice and SEO settings applied.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — Professional+ plans include the Writesonic API.')
      ),
  pros                = JSON_ARRAY('AI Article Writer is genuinely strong for SEO', 'Chatsonic adds real-time web access', 'Photosonic image gen + Botsonic chatbots in one suite', 'Bulk article generation via CSV', 'WordPress + Shopify publishing', 'Generous free tier'),
  cons                = JSON_ARRAY('Aggressive marketing language sometimes overpromises', 'Quality articles still need editing', '"Bypass AI detection" claim is fragile', 'Multiple sub-products add complexity'),
  starting_price      = 20,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'writesonic';

-- rytr
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Budget AI writer', '40+ use cases', 'Browser extension'),
  industries_served   = JSON_ARRAY('Freelancers', 'Bloggers', 'E-commerce', 'Marketing & Advertising', 'Small Businesses', 'Solopreneurs', 'Students', 'Authors'),
  use_cases           = JSON_ARRAY('Short-form copy', 'Blog post outlines', 'Social media captions', 'Email writing', 'Product descriptions', 'Story plotting', 'Translations', 'Idea generation'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses'),
  key_features        = JSON_ARRAY('40+ writing use cases', '30+ languages', '20+ tones', 'Browser extension', 'Plagiarism checker', 'Document editor', 'Generated image creator', 'Custom tones from samples', 'Team workspaces', 'API access'),
  features            = JSON_ARRAY('40+ writing use cases', '30+ languages', '20+ tones', 'Browser extension', 'Plagiarism checker', 'Document editor', 'Generated image creator', 'Custom tones from samples', 'Team workspaces', 'API access'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('10k characters/mo', 'All 40+ use cases', '5 generated images/mo')),
        JSON_OBJECT('name', 'Unlimited', 'price', 9, 'period', 'month', 'features', JSON_ARRAY('Unlimited characters', 'Custom use cases', '20 images/mo', 'Plagiarism checks')),
        JSON_OBJECT('name', 'Premium', 'price', 29, 'period', 'month', 'features', JSON_ARRAY('Premium features', 'Priority support', 'Higher image limits', 'Premium community'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'Chrome extension', 'website', 'https://chrome.google.com/webstore', 'description', 'Generate copy inside any web app.'),
        JSON_OBJECT('name', 'Rytr API', 'website', 'https://rytr.me/api', 'description', 'Programmatic generation for developers.'),
        JSON_OBJECT('name', 'WordPress', 'website', 'https://wordpress.org', 'description', 'Push generated copy directly into WordPress.'),
        JSON_OBJECT('name', 'Zapier', 'website', 'https://zapier.com', 'description', 'Connect Rytr to 6,000+ apps.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Premium community'),
  training_options    = JSON_ARRAY('Use case library', 'Tutorials', 'YouTube videos'),
  languages           = JSON_ARRAY('30+ languages'),
  compliance          = JSON_ARRAY('GDPR'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'Is Rytr really $9/mo for unlimited?', 'answer', 'Yes — the Unlimited tier at $9/mo has no character cap. Premium adds priority support and higher image limits.'),
        JSON_OBJECT('question', 'How does Rytr compare to Jasper?', 'answer', 'Rytr is significantly cheaper and simpler. Jasper offers Brand Voice + Knowledge Base + workflows that Rytr doesn''t. Rytr is right for solo writers + budget needs.'),
        JSON_OBJECT('question', 'Does Rytr support my language?', 'answer', 'Yes — 30+ languages including Spanish, French, German, Japanese, Chinese, Hindi, Arabic, and more.'),
        JSON_OBJECT('question', 'Is there a free tier?', 'answer', 'Yes — 10k characters/mo with full feature access. No card required.'),
        JSON_OBJECT('question', 'What is a "use case"?', 'answer', 'A pre-built template for a specific writing task (blog idea, AIDA copy, cover letter, etc.) — Rytr ships 40+ out of the box.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — Rytr offers an API for developers integrating writing assistance.')
      ),
  pros                = JSON_ARRAY('Cheapest serious AI writer in the market', '40+ use cases out of the box', 'Generous free tier', '30+ output languages', 'Chrome extension for any tool', 'Bundled plagiarism + image gen'),
  cons                = JSON_ARRAY('No advanced Brand Voice like Jasper', 'Less suitable for long-form SEO than Writesonic', 'Output quality varies vs frontier LLMs', 'No enterprise / SSO tier'),
  starting_price      = 9,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'rytr';

-- notion-ai
UPDATE submissions SET
  header_tags         = JSON_ARRAY('In-Notion AI', 'Q&A on workspace', 'AI writing'),
  industries_served   = JSON_ARRAY('SaaS & Software', 'Marketing & Advertising', 'Startups', 'Education', 'Operations', 'Consulting', 'Knowledge Work', 'Project Management'),
  use_cases           = JSON_ARRAY('Q&A across your Notion workspace', 'Summarising long pages', 'Drafting docs + meeting notes', 'Translating content', 'Brainstorming + outlines', 'Action item extraction', 'Database AI fills (auto-summary, classify, translate)', 'Email + slogan generation'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Notion AI Q&A across workspace', 'AI Connectors (Slack, Google Drive, GitHub)', 'AI database properties (auto-fill summaries, translations)', 'Writing assistant in any page', 'Summarise long meeting notes', 'Generate action items from notes', 'Brainstorm with chat', 'Multilingual translations', 'Custom AI blocks per page', 'Workspace-wide search + answer'),
  features            = JSON_ARRAY('Notion AI Q&A across workspace', 'AI Connectors (Slack, Google Drive, GitHub)', 'AI database properties (auto-fill summaries, translations)', 'Writing assistant in any page', 'Summarise long meeting notes', 'Generate action items from notes', 'Brainstorm with chat', 'Multilingual translations', 'Custom AI blocks per page', 'Workspace-wide search + answer'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Notion AI add-on', 'price', 10, 'period', 'month', 'features', JSON_ARRAY('Add-on to any Notion plan', 'Unlimited Notion AI usage', 'AI Connectors', 'Notion Q&A')),
        JSON_OBJECT('name', 'Business + AI bundle', 'price', NULL, 'period', 'month', 'features', JSON_ARRAY('Notion Business + AI included', '$20/user/mo effective', 'SAML SSO'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'Slack Connector', 'website', 'https://www.notion.so/product/ai', 'description', 'Notion AI Q&A across linked Slack channels.'),
        JSON_OBJECT('name', 'Google Drive', 'website', 'https://www.notion.so/product/ai', 'description', 'Q&A across linked Google Docs and Sheets.'),
        JSON_OBJECT('name', 'GitHub', 'website', 'https://www.notion.so/product/ai', 'description', 'Q&A across PRs and issues linked to your workspace.'),
        JSON_OBJECT('name', 'Notion API', 'website', 'https://developers.notion.com', 'description', 'Programmatic access to AI-enriched data.'),
        JSON_OBJECT('name', 'Zapier', 'website', 'https://zapier.com', 'description', 'Trigger Notion AI workflows from 6,000+ apps.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Community forum', 'Twitter support'),
  training_options    = JSON_ARRAY('Notion Academy', 'Templates gallery', 'YouTube tutorials', 'Webinars'),
  languages           = JSON_ARRAY('15+ languages'),
  compliance          = JSON_ARRAY('SOC 2 Type II', 'GDPR', 'ISO 27001'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Notion AI?', 'answer', 'Notion AI is an add-on layer that adds writing assistance, summarisation, Q&A across your workspace, and AI database properties — all within Notion.'),
        JSON_OBJECT('question', 'Does Notion AI cost extra?', 'answer', 'Yes — $10/user/mo on top of any Notion plan. Some plans bundle it (e.g. Business + AI = $20/user/mo).'),
        JSON_OBJECT('question', 'What is Notion Q&A?', 'answer', 'Q&A is a chat interface that answers questions using your entire Notion workspace as context — useful for "what did we decide about X" queries.'),
        JSON_OBJECT('question', 'Which AI model powers Notion AI?', 'answer', 'Notion uses Claude (Anthropic) and GPT (OpenAI) under the hood, orchestrated for different tasks.'),
        JSON_OBJECT('question', 'Is my data used for training?', 'answer', 'No — Notion does not train models on your workspace data. Standard SOC 2 + GDPR protections apply.'),
        JSON_OBJECT('question', 'Can it connect to Slack / Drive?', 'answer', 'Yes — AI Connectors extend Q&A to linked Slack channels, Google Drive, GitHub, and more sources.')
      ),
  pros                = JSON_ARRAY('Lives where your team already works', 'Best workspace Q&A on the market', 'AI Connectors broaden context to Slack / Drive / GitHub', 'AI database properties save real work', 'Strong compliance posture', 'Unlimited usage at flat $10/user'),
  cons                = JSON_ARRAY('Only useful if your team uses Notion already', '$10/user adds up at scale', 'Less powerful than dedicated content tools (Jasper) for marketing', 'Q&A quality depends on workspace cleanliness'),
  starting_price      = 10,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 0,
  has_ios_app         = 1,
  has_android_app     = 1
WHERE slug = 'notion-ai';

-- sudowrite
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Fiction writing AI', 'Story development', 'Author tool'),
  industries_served   = JSON_ARRAY('Authors', 'Publishing', 'Creative Writing', 'Self-Publishing', 'Hobbyists', 'Screenwriters', 'Game Writers', 'Education'),
  use_cases           = JSON_ARRAY('Novel writing assistance', 'Story brainstorming', 'Plot development', 'Character voice exploration', 'Description expansion', 'Beat sheet generation', 'Editing + rewriting', 'Worldbuilding notes'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses'),
  key_features        = JSON_ARRAY('Write — continue your story in voice', 'Rewrite — expand, shorten, intensify, etc.', 'Describe — sense-based scene expansion', 'Brainstorm — plot points and twists', 'Canvas — long-form whiteboard for novels', 'Story Bible (characters, world, beats)', 'First Draft (chapter generation)', 'Visualise scenes with image gen', 'No content restrictions for fiction', 'Custom prose styles per project'),
  features            = JSON_ARRAY('Write — continue your story in voice', 'Rewrite — expand, shorten, intensify, etc.', 'Describe — sense-based scene expansion', 'Brainstorm — plot points and twists', 'Canvas — long-form whiteboard for novels', 'Story Bible (characters, world, beats)', 'First Draft (chapter generation)', 'Visualise scenes with image gen', 'No content restrictions for fiction', 'Custom prose styles per project'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Hobby & Student', 'price', 19, 'period', 'month', 'features', JSON_ARRAY('225k AI credits/mo', 'All core features', 'Best for casual writing')),
        JSON_OBJECT('name', 'Professional', 'price', 29, 'period', 'month', 'features', JSON_ARRAY('1M AI credits/mo', 'Priority support', 'Higher Visualise limits')),
        JSON_OBJECT('name', 'Max', 'price', 59, 'period', 'month', 'features', JSON_ARRAY('2M AI credits/mo', 'Best for full-time novelists', 'Priority queue'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'Sudowrite web app', 'website', 'https://www.sudowrite.com', 'description', 'Primary writing environment.'),
        JSON_OBJECT('name', 'Story Bible', 'website', 'https://www.sudowrite.com', 'description', 'Native worldbuilding + character bible feature.'),
        JSON_OBJECT('name', 'Visualise (image gen)', 'website', 'https://www.sudowrite.com', 'description', 'Bundled image generation for scene visualisation.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Discord community', 'Help center'),
  training_options    = JSON_ARRAY('Documentation', 'YouTube tutorials', 'Author webinars', 'Discord workshops'),
  languages           = JSON_ARRAY('English', 'Multilingual via underlying LLMs'),
  compliance          = JSON_ARRAY(),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Sudowrite?', 'answer', 'Sudowrite is an AI writing partner built specifically for fiction authors — it helps with prose continuation, scene expansion, brainstorming, and editing.'),
        JSON_OBJECT('question', 'How is Sudowrite different from ChatGPT?', 'answer', 'Sudowrite is purpose-built for fiction craft — Story Bible, character voice, Visualise, no content restrictions on dark / mature fiction themes (within ToS).'),
        JSON_OBJECT('question', 'What is Story Bible?', 'answer', 'Story Bible is Sudowrite''s structured workspace for characters, world, beats, and notes that the AI references when generating prose.'),
        JSON_OBJECT('question', 'Does Sudowrite write the whole book?', 'answer', 'Sudowrite is a copilot, not a ghostwriter — it''s most powerful when you provide the spine and use it for expansion, rewriting, and brainstorming.'),
        JSON_OBJECT('question', 'Are credits enough for a novel?', 'answer', 'Hobby gets ~225k credits/mo (~45k AI words). Professional and Max scale for full-time novelists.'),
        JSON_OBJECT('question', 'Is my writing private?', 'answer', 'Yes — Sudowrite does not train on user writing. Your work stays yours.')
      ),
  pros                = JSON_ARRAY('Purpose-built for fiction craft', 'Story Bible is unique in the category', 'Excellent Rewrite + Describe controls', 'Visualise (image gen) included', 'No content restrictions on mature fiction', 'Strong author community + workshops'),
  cons                = JSON_ARRAY('Niche for fiction — not general writing', 'Credit limits arrive on heavy days', 'Best at sentence-by-sentence collaboration, not whole-novel generation', 'Higher cost than generic LLM access'),
  starting_price      = 19,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 0,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'sudowrite';

-- wordtune-ai21-labs
UPDATE submissions SET
  header_tags         = JSON_ARRAY('AI rewriter', 'AI21 Labs', 'Jamba model'),
  industries_served   = JSON_ARRAY('Education', 'Marketing & Advertising', 'Publishing', 'Consulting', 'Legal', 'Financial Services', 'SaaS & Software', 'Authors'),
  use_cases           = JSON_ARRAY('Rewrite + paraphrase', 'Tone shifts (formal / casual)', 'Shorten + expand text', 'Translation', 'Email replies', 'Document summarisation', 'AI writing assistance', 'Reading-comprehension tools'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Rewrite mode (paraphrase any text)', 'Casual / Formal / Shorten / Expand', 'Wordtune Editor', 'Browser extension (Chrome, Edge, Safari)', 'Wordtune Read (summarise PDFs)', 'Spices (jokes, facts, examples)', 'AI21 Studio API (Jamba models)', 'Multi-language support', 'Word + Outlook plugins', 'Custom tone settings'),
  features            = JSON_ARRAY('Rewrite mode (paraphrase any text)', 'Casual / Formal / Shorten / Expand', 'Wordtune Editor', 'Browser extension (Chrome, Edge, Safari)', 'Wordtune Read (summarise PDFs)', 'Spices (jokes, facts, examples)', 'AI21 Studio API (Jamba models)', 'Multi-language support', 'Word + Outlook plugins', 'Custom tone settings'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('10 rewrites/day', '3 AI prompts/day', 'Browser extension')),
        JSON_OBJECT('name', 'Plus', 'price', 9.99, 'period', 'month', 'features', JSON_ARRAY('Unlimited rewrites', '30 AI prompts/day', 'Wordtune Read', 'Spices')),
        JSON_OBJECT('name', 'Unlimited', 'price', 14.99, 'period', 'month', 'features', JSON_ARRAY('Unlimited everything', 'Higher priority', 'All features')),
        JSON_OBJECT('name', 'Business', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Team management', 'SSO', 'Centralised billing'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'Chrome / Edge / Safari', 'website', 'https://www.wordtune.com/extensions', 'description', 'Browser extensions for in-page rewriting.'),
        JSON_OBJECT('name', 'Microsoft Word', 'website', 'https://www.wordtune.com', 'description', 'Word plugin for in-doc rewriting.'),
        JSON_OBJECT('name', 'Outlook', 'website', 'https://www.wordtune.com', 'description', 'Email rewriting in Outlook.'),
        JSON_OBJECT('name', 'AI21 Studio API', 'website', 'https://www.ai21.com/studio', 'description', 'Direct API to AI21''s Jamba and Jurassic models.'),
        JSON_OBJECT('name', 'AWS Bedrock', 'website', 'https://aws.amazon.com/bedrock/', 'description', 'AI21 Jamba models hosted on AWS Bedrock.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Live chat (paid)', 'Enterprise CSM'),
  training_options    = JSON_ARRAY('Help articles', 'YouTube tutorials', 'Wordtune Academy'),
  languages           = JSON_ARRAY('English', 'Spanish', 'French', 'German', '10+ more'),
  compliance          = JSON_ARRAY('SOC 2 Type II', 'GDPR'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Wordtune?', 'answer', 'Wordtune is an AI writing assistant from AI21 Labs that specialises in rewriting + paraphrasing — different tones, shorter, longer, more formal, etc.'),
        JSON_OBJECT('question', 'Who is AI21 Labs?', 'answer', 'AI21 Labs is the Israeli AI lab behind the Jurassic and Jamba foundation models — Wordtune is their consumer product showcase.'),
        JSON_OBJECT('question', 'Is Wordtune free?', 'answer', 'Yes — Free tier gives 10 rewrites/day. Plus ($9.99/mo) and Unlimited ($14.99/mo) remove limits.'),
        JSON_OBJECT('question', 'What are Spices?', 'answer', 'Spices add specific flavours to your writing — a counterargument, an example, a joke, a definition, a fact — on demand.'),
        JSON_OBJECT('question', 'Does it work in Word / Outlook?', 'answer', 'Yes — first-class plugins for Microsoft Word and Outlook, plus browser extensions for any web app.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — AI21 Studio gives developers direct API access to Jamba (their long-context Mamba/transformer hybrid model).')
      ),
  pros                = JSON_ARRAY('Best-in-class rewrite + paraphrase quality', 'Spices add unique value-add to drafts', 'First-class Word + Outlook plugins', 'AI21 Jamba long-context backbone', 'Wordtune Read is genuinely useful for PDFs', 'Generous free tier'),
  cons                = JSON_ARRAY('Less ambitious than generative LLMs for long-form', 'Brand split (Wordtune vs AI21 Studio) confuses some', 'Daily rate limits on Free + Plus', 'Smaller market presence than Grammarly'),
  starting_price      = 9.99,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 1,
  has_android_app     = 1
WHERE slug = 'wordtune-ai21-labs';

-- grammarly
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Writing assistant', 'Grammar + tone', 'Generative AI'),
  industries_served   = JSON_ARRAY('Education', 'Professional Services', 'Marketing & Advertising', 'Customer Support', 'Sales', 'SaaS & Software', 'Government', 'Financial Services'),
  use_cases           = JSON_ARRAY('Grammar + spelling checks', 'Tone detection + suggestions', 'Generative rewrites + drafts', 'Email replies', 'Style guide enforcement', 'Plagiarism detection', 'Clarity + conciseness', 'Multilingual writing assistance'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Grammar + spelling + punctuation', 'Tone detection across 9 tones', 'Generative AI (drafts, rewrites, ideas)', 'Browser extensions for every browser', 'Microsoft Word + Outlook integration', 'Google Docs integration', 'Native macOS + Windows apps', 'iOS + Android keyboards', 'Plagiarism checker (Premium)', 'Custom style guide (Business)'),
  features            = JSON_ARRAY('Grammar + spelling + punctuation', 'Tone detection across 9 tones', 'Generative AI (drafts, rewrites, ideas)', 'Browser extensions for every browser', 'Microsoft Word + Outlook integration', 'Google Docs integration', 'Native macOS + Windows apps', 'iOS + Android keyboards', 'Plagiarism checker (Premium)', 'Custom style guide (Business)'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('Grammar + spelling + basic suggestions', 'All apps + extensions', '100 generative AI prompts/mo')),
        JSON_OBJECT('name', 'Pro', 'price', 12, 'period', 'month', 'features', JSON_ARRAY('1,000+ generative prompts/mo', 'Advanced tone + clarity', 'Plagiarism detection', 'Citation generator')),
        JSON_OBJECT('name', 'Business', 'price', 15, 'period', 'month', 'features', JSON_ARRAY('Custom style guide', 'Brand tones', 'SAML SSO', 'Centralised billing + admin'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'Microsoft Word + Outlook', 'website', 'https://www.grammarly.com/office-addin', 'description', 'Native plugins for Microsoft 365.'),
        JSON_OBJECT('name', 'Google Docs', 'website', 'https://workspace.google.com/marketplace', 'description', 'Native Google Docs integration.'),
        JSON_OBJECT('name', 'Browser extensions', 'website', 'https://www.grammarly.com/browser', 'description', 'Chrome, Edge, Firefox, Safari.'),
        JSON_OBJECT('name', 'macOS + Windows desktop', 'website', 'https://www.grammarly.com/desktop', 'description', 'Native desktop app overlays for any text app.'),
        JSON_OBJECT('name', 'iOS + Android keyboards', 'website', 'https://www.grammarly.com/mobile', 'description', 'Grammarly keyboard for mobile devices.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Live chat (Premium+)', 'Dedicated CSM (Business)'),
  training_options    = JSON_ARRAY('Grammarly Academy', 'Help articles', 'Blog + style guides', 'Webinars'),
  languages           = JSON_ARRAY('English (US, UK, AU, CA, IN)', 'Multilingual generative AI (45+ languages)'),
  compliance          = JSON_ARRAY('SOC 2 Type II', 'GDPR', 'HIPAA-eligible (Business)', 'ISO 27001'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'Is Grammarly more than grammar?', 'answer', 'Yes — beyond grammar, Grammarly does tone detection, clarity + conciseness suggestions, generative drafts + rewrites, and (Business tier) style guide enforcement.'),
        JSON_OBJECT('question', 'How is Grammarly different from a free spell-checker?', 'answer', 'Grammarly catches contextual errors (their / there / they''re), style issues (passive voice, wordiness), and offers generative assistance — far beyond spell-check.'),
        JSON_OBJECT('question', 'What is GrammarlyGO?', 'answer', 'GrammarlyGO is the generative AI brand — drafts, rewrites, ideation. Included with Pro + Business plans.'),
        JSON_OBJECT('question', 'Does Grammarly train on my writing?', 'answer', 'No — Grammarly does not use customer writing to train models. Strong privacy commitments + audit-grade compliance.'),
        JSON_OBJECT('question', 'Is there a free version?', 'answer', 'Yes — Free Grammarly gives grammar / spelling / basic suggestions + 100 generative prompts/mo. Pro and Business unlock advanced suggestions and custom style guides.'),
        JSON_OBJECT('question', 'Does it work in Word / Google Docs?', 'answer', 'Yes — native plugins for Microsoft Word + Outlook, Google Docs integration, browser extensions, desktop apps, and mobile keyboards.')
      ),
  pros                = JSON_ARRAY('Most polished cross-app writing experience', 'Best free tier in the category', 'Tone detection genuinely useful', 'Custom style guide on Business is enterprise-class', 'Grammarly Keyboard on mobile is best-in-class', 'Strong compliance posture'),
  cons                = JSON_ARRAY('Less powerful for generative drafting vs Jasper / ChatGPT', 'Premium for full generative limits', 'Custom style guide locked to Business tier', 'Some users dislike persistent suggestion overlays'),
  starting_price      = 12,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 1,
  has_android_app     = 1
WHERE slug = 'grammarly';


-- ============================================================
-- GROUP: RESEARCH & ACADEMIC TOOLS (6 listings)
-- ============================================================

-- consensus
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Scientific consensus', 'Evidence-based Q&A', 'Peer-reviewed sources'),
  industries_served   = JSON_ARRAY('Academia', 'Healthcare', 'Pharma', 'Research & Education', 'Journalism', 'Think Tanks', 'Policy', 'Legal'),
  use_cases           = JSON_ARRAY('Literature review', 'Evidence-based decision making', 'Health and medical Q&A', 'Policy research', 'Clinical evidence summarisation', 'Quick fact-checking from papers', 'Citation generation', 'Research planning'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Search across 200M+ scientific papers', 'Consensus Meter (do papers agree?)', 'Yes / No / Possibly summary verdict', 'GPT-4 summaries grounded in papers', 'Study Snapshots (sample size, journal)', 'Save searches + reading lists', 'Copilot Q&A across a paper set', 'Filters by study type, year, citations', 'Export bibliography (RIS, BibTeX)', 'No paywall on indexed papers'),
  features            = JSON_ARRAY('Search across 200M+ scientific papers', 'Consensus Meter (do papers agree?)', 'Yes / No / Possibly summary verdict', 'GPT-4 summaries grounded in papers', 'Study Snapshots (sample size, journal)', 'Save searches + reading lists', 'Copilot Q&A across a paper set', 'Filters by study type, year, citations', 'Export bibliography (RIS, BibTeX)', 'No paywall on indexed papers'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('Unlimited searches', '20 AI credits/mo', 'Consensus Meter on top results')),
        JSON_OBJECT('name', 'Premium', 'price', 11.99, 'period', 'month', 'features', JSON_ARRAY('Unlimited AI credits', 'GPT-4 summaries on every paper', 'Copilot Q&A', 'Bookmarks + lists')),
        JSON_OBJECT('name', 'Enterprise', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Team accounts', 'Custom integrations', 'API access'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'consensus.app', 'website', 'https://consensus.app', 'description', 'Primary search interface.'),
        JSON_OBJECT('name', 'GPT Store', 'website', 'https://chatgpt.com', 'description', 'Consensus is available as a featured GPT in ChatGPT.'),
        JSON_OBJECT('name', 'Zotero / Mendeley', 'website', 'https://www.zotero.org', 'description', 'Export citations to popular reference managers.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Twitter support'),
  training_options    = JSON_ARRAY('Help articles', 'Tutorial videos', 'Blog research guides'),
  languages           = JSON_ARRAY('English (papers indexed in any language; results in English)'),
  compliance          = JSON_ARRAY(),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Consensus?', 'answer', 'Consensus is an AI-powered scientific research engine — it searches 200M+ peer-reviewed papers and answers questions with summaries grounded in the literature.'),
        JSON_OBJECT('question', 'What is the Consensus Meter?', 'answer', 'For yes/no scientific questions, Consensus aggregates findings across papers and shows whether the literature agrees, disagrees, or is mixed.'),
        JSON_OBJECT('question', 'How is Consensus different from Google Scholar?', 'answer', 'Google Scholar is a search index. Consensus reads the papers and answers your question with cited summaries — much closer to a research assistant.'),
        JSON_OBJECT('question', 'Is medical advice reliable?', 'answer', 'Consensus surfaces peer-reviewed evidence but is not a substitute for medical advice. Always consult a qualified professional for clinical decisions.'),
        JSON_OBJECT('question', 'Does it cover all journals?', 'answer', 'Consensus indexes Semantic Scholar''s corpus of 200M+ papers — broad but not 100% complete. Paywalled papers show abstracts.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Enterprise plans include API access; the consumer product is web-only.')
      ),
  pros                = JSON_ARRAY('Best AI tool for peer-reviewed Q&A', 'Consensus Meter is uniquely useful for yes/no questions', 'Generous free tier with unlimited searches', '200M+ paper index', 'Featured GPT in ChatGPT GPT Store', 'Strong filters for evidence quality'),
  cons                = JSON_ARRAY('English-only summaries', 'Paywalled papers limited to abstract data', 'AI credits cap on Free tier', 'Not a substitute for clinical/medical judgement'),
  starting_price      = 11.99,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'consensus';

-- elicit
UPDATE submissions SET
  header_tags         = JSON_ARRAY('AI research assistant', 'Systematic review', 'Paper extraction'),
  industries_served   = JSON_ARRAY('Academia', 'Pharma', 'Healthcare', 'Research & Education', 'Policy', 'Think Tanks', 'Government', 'Biotech'),
  use_cases           = JSON_ARRAY('Literature review automation', 'Systematic review screening', 'Meta-analysis prep', 'Extracting tables of findings', 'Paper screening at scale', 'Comparing methodology across studies', 'Research question exploration', 'PRISMA workflow support'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Semantic search across 125M+ papers', 'Find paper extraction (auto-fill columns)', 'Custom extraction columns', 'Reasoning + summary across papers', 'Systematic review workflow', 'Filter by study design + RCT only', 'Reference + citation extraction', 'PRISMA-friendly export', 'API for batch processing (Pro+)', 'Team workspace for collaborative review'),
  features            = JSON_ARRAY('Semantic search across 125M+ papers', 'Find paper extraction (auto-fill columns)', 'Custom extraction columns', 'Reasoning + summary across papers', 'Systematic review workflow', 'Filter by study design + RCT only', 'Reference + citation extraction', 'PRISMA-friendly export', 'API for batch processing (Pro+)', 'Team workspace for collaborative review'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('5,000 credits/mo', 'Find papers + summary', 'Limited extraction')),
        JSON_OBJECT('name', 'Plus', 'price', 12, 'period', 'month', 'features', JSON_ARRAY('12,000 credits/mo', 'Unlimited PDF chat', 'Higher extraction limits')),
        JSON_OBJECT('name', 'Pro', 'price', 49, 'period', 'month', 'features', JSON_ARRAY('30,000 credits/mo', 'Systematic review mode', 'API access', 'Priority support')),
        JSON_OBJECT('name', 'Team', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Shared workspaces', 'Centralised billing', 'Volume credits'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'Semantic Scholar', 'website', 'https://www.semanticscholar.org', 'description', 'Backbone index of 125M+ academic papers.'),
        JSON_OBJECT('name', 'Zotero', 'website', 'https://www.zotero.org', 'description', 'Export to Zotero reference library.'),
        JSON_OBJECT('name', 'EndNote', 'website', 'https://endnote.com', 'description', 'Export to EndNote for systematic reviews.'),
        JSON_OBJECT('name', 'Elicit API', 'website', 'https://elicit.com/api', 'description', 'Batch processing for large systematic reviews.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Community forum', 'Slack (Team+)'),
  training_options    = JSON_ARRAY('Help articles', 'YouTube tutorials', 'Webinars', 'Research workflows guide'),
  languages           = JSON_ARRAY('English (papers indexed in any language)'),
  compliance          = JSON_ARRAY(),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Elicit?', 'answer', 'Elicit is an AI research assistant built for academic literature review — it finds papers, extracts data into tables, and summarises across studies.'),
        JSON_OBJECT('question', 'How does it differ from Consensus?', 'answer', 'Consensus is best for quick yes/no answers from the literature. Elicit specialises in deep extraction and systematic review workflows.'),
        JSON_OBJECT('question', 'What is paper extraction?', 'answer', 'Define columns (sample size, methodology, key finding, etc.) and Elicit auto-fills them across dozens of papers — saving hours of manual extraction.'),
        JSON_OBJECT('question', 'Is it good for systematic reviews?', 'answer', 'Yes — Elicit''s systematic review mode supports PRISMA-style screening, inclusion/exclusion criteria, and team review.'),
        JSON_OBJECT('question', 'Are AI summaries accurate?', 'answer', 'Elicit grounds all summaries in cited paper text and shows the source. Reviewers should still verify on critical claims.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — Pro and Team plans include the Elicit API for batch processing.')
      ),
  pros                = JSON_ARRAY('Best AI tool for systematic literature review', 'Paper extraction saves hours of manual work', 'Strong PRISMA workflow support', '125M+ paper index via Semantic Scholar', 'Team workspaces for collaborative research', 'Generous free tier'),
  cons                = JSON_ARRAY('Credit-based pricing requires monitoring', 'English-only output', 'Paywalled paper extraction limited to abstracts', 'Learning curve for systematic review mode'),
  starting_price      = 12,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'elicit';

-- scispace
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Paper Q&A copilot', '270M+ papers', 'Multilingual research'),
  industries_served   = JSON_ARRAY('Academia', 'Research & Education', 'Pharma', 'Healthcare', 'Engineering', 'Biotech', 'Policy', 'Students'),
  use_cases           = JSON_ARRAY('Paper search + summarisation', 'Read-along Q&A on PDFs', 'Find supporting papers', 'Quick literature review', 'Extracting tables and figures', 'Citation generation', 'Multi-paper synthesis', 'Translate + simplify dense papers'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies'),
  key_features        = JSON_ARRAY('Semantic search across 270M+ papers', 'Copilot AI per paper (Q&A)', 'Highlight any text → AI explains', 'Find Supporting / Contradicting Papers', 'AI Detector + paraphraser', 'Citation generator (APA, MLA, Chicago)', 'Multilingual support (75+ languages)', 'Chrome extension', 'AI Notes (research notebook)', 'Bulk paper extraction'),
  features            = JSON_ARRAY('Semantic search across 270M+ papers', 'Copilot AI per paper (Q&A)', 'Highlight any text → AI explains', 'Find Supporting / Contradicting Papers', 'AI Detector + paraphraser', 'Citation generator (APA, MLA, Chicago)', 'Multilingual support (75+ languages)', 'Chrome extension', 'AI Notes (research notebook)', 'Bulk paper extraction'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('Limited monthly Copilot questions', 'Basic search + summaries', 'Chrome extension')),
        JSON_OBJECT('name', 'Premium', 'price', 20, 'period', 'month', 'features', JSON_ARRAY('Unlimited Copilot Q&A', 'Higher extraction limits', 'Priority support', 'No ads'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'typeset.io', 'website', 'https://typeset.io', 'description', 'Main SciSpace web interface.'),
        JSON_OBJECT('name', 'Chrome extension', 'website', 'https://chrome.google.com/webstore', 'description', 'AI Copilot on any web-hosted PDF.'),
        JSON_OBJECT('name', 'Zotero / Mendeley', 'website', 'https://www.zotero.org', 'description', 'Citation export to reference managers.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Live chat'),
  training_options    = JSON_ARRAY('Help articles', 'YouTube tutorials', 'Blog research guides'),
  languages           = JSON_ARRAY('75+ languages'),
  compliance          = JSON_ARRAY(),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is SciSpace?', 'answer', 'SciSpace (typeset.io) is an AI research copilot — search across 270M+ papers and chat with any paper to ask questions, get explanations, and find related work.'),
        JSON_OBJECT('question', 'What is Copilot?', 'answer', 'SciSpace Copilot is an AI assistant attached to each paper — highlight text and Copilot explains, summarises, or finds supporting/contradicting evidence.'),
        JSON_OBJECT('question', 'How is SciSpace different from Elicit / Consensus?', 'answer', 'SciSpace emphasises read-along Q&A on individual papers (Copilot) + multilingual support. Elicit emphasises systematic review extraction. Consensus emphasises yes/no questions.'),
        JSON_OBJECT('question', 'Does it support non-English papers?', 'answer', 'Yes — 75+ languages supported for search, summarisation, and Q&A.'),
        JSON_OBJECT('question', 'Can I use my own PDFs?', 'answer', 'Yes — upload any PDF and Copilot will Q&A against it.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'No public consumer API at this time — enterprise inquiries are handled directly.')
      ),
  pros                = JSON_ARRAY('Excellent Copilot for read-along Q&A', '270M+ paper index (largest in category)', '75+ language support is unique', 'Chrome extension Q&A on any PDF', 'Find Supporting / Contradicting Papers feature', 'Strong free tier'),
  cons                = JSON_ARRAY('Less depth for systematic reviews than Elicit', 'Premium tier needed for serious daily use', 'Multilingual quality varies', 'No native team workspace yet'),
  starting_price      = 20,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'scispace';

-- andi
UPDATE submissions SET
  header_tags         = JSON_ARRAY('AI search', 'No ads', 'Friendly conversation'),
  industries_served   = JSON_ARRAY('Consumer Tech', 'Research & Education', 'Journalism', 'Students', 'Knowledge Work', 'Privacy-Focused Users', 'Hobbyists', 'Education'),
  use_cases           = JSON_ARRAY('Conversational web search', 'Quick fact lookup', 'Privacy-respecting research', 'Daily news + summaries', 'Coding questions', 'Travel + product research', 'Citation-grounded answers', 'No-tracking browsing'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses'),
  key_features        = JSON_ARRAY('Conversational AI search', 'No ads + no tracking', 'Friendly assistant persona', 'Visual carousel results', 'Multi-source citations', 'Quick summaries before clicks', 'Snippet previews of source pages', 'Voice search', 'Browser extensions', 'Free to use'),
  features            = JSON_ARRAY('Conversational AI search', 'No ads + no tracking', 'Friendly assistant persona', 'Visual carousel results', 'Multi-source citations', 'Quick summaries before clicks', 'Snippet previews of source pages', 'Voice search', 'Browser extensions', 'Free to use'),
  pricing_model       = 'free',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('Unlimited AI search', 'No ads', 'Voice + visual results', 'Browser extensions'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'andisearch.com', 'website', 'https://andisearch.com', 'description', 'Main web search interface.'),
        JSON_OBJECT('name', 'Chrome extension', 'website', 'https://chrome.google.com/webstore', 'description', 'Search Andi directly from your browser.'),
        JSON_OBJECT('name', 'iOS app', 'website', 'https://apps.apple.com', 'description', 'Native iOS app for Andi search.'),
        JSON_OBJECT('name', 'Android app', 'website', 'https://play.google.com/store', 'description', 'Native Android app.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Twitter support', 'Help center'),
  training_options    = JSON_ARRAY('Help articles', 'Blog posts'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY('GDPR'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Andi?', 'answer', 'Andi is a privacy-first AI search engine — conversational answers grounded in web sources, with zero ads and zero tracking.'),
        JSON_OBJECT('question', 'How does Andi make money?', 'answer', 'Andi is currently free and supported by its founders + investors. No ads + no data sale by design.'),
        JSON_OBJECT('question', 'How is Andi different from Perplexity?', 'answer', 'Both are AI search engines. Andi leans into a friendly, privacy-first consumer experience and visual results. Perplexity is more research-oriented.'),
        JSON_OBJECT('question', 'Does Andi track me?', 'answer', 'No — Andi does not store search history, does not use trackers, and does not sell data.'),
        JSON_OBJECT('question', 'Is there a Pro tier?', 'answer', 'Not at the moment — Andi is free for all users. Future paid tiers may add advanced features.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'No public API at this time — Andi is consumer-focused.')
      ),
  pros                = JSON_ARRAY('Genuinely free + ad-free experience', 'Privacy-first by design', 'Friendly conversational interface', 'Visual + voice search bundled', 'Citation-grounded answers', 'Browser + iOS + Android apps'),
  cons                = JSON_ARRAY('Smaller index than Google / Bing', 'Less powerful than Perplexity for deep research', 'No team / enterprise tier', 'No API for builders'),
  starting_price      = 0,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 1,
  has_android_app     = 1
WHERE slug = 'andi';

-- researchrabbit
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Citation graph', 'Visual literature map', 'Free for researchers'),
  industries_served   = JSON_ARRAY('Academia', 'Research & Education', 'Pharma', 'Biotech', 'Healthcare', 'Engineering', 'Think Tanks', 'Students'),
  use_cases           = JSON_ARRAY('Citation network exploration', 'Visual literature mapping', 'Discovering related papers', 'Tracking new papers per topic', 'Building reading lists', 'Mapping research timelines', 'Author collaboration networks', 'Untracked literature discovery'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses'),
  key_features        = JSON_ARRAY('Citation network visualisation', 'Similar Work / Earlier Work / Later Work explorers', 'Author collaboration graphs', 'Topic-based collections', 'Email alerts on new related papers', 'Zotero sync', 'Collaborative collections (shared)', 'Timeline view of research progression', 'Tagging + notes per paper', 'Truly free for individual researchers'),
  features            = JSON_ARRAY('Citation network visualisation', 'Similar Work / Earlier Work / Later Work explorers', 'Author collaboration graphs', 'Topic-based collections', 'Email alerts on new related papers', 'Zotero sync', 'Collaborative collections (shared)', 'Timeline view of research progression', 'Tagging + notes per paper', 'Truly free for individual researchers'),
  pricing_model       = 'free',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('Unlimited collections + papers', 'Visual citation maps', 'Zotero sync', 'Email alerts'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'Zotero', 'website', 'https://www.zotero.org', 'description', 'Native bidirectional sync.'),
        JSON_OBJECT('name', 'Semantic Scholar', 'website', 'https://www.semanticscholar.org', 'description', 'Citation graph backbone.'),
        JSON_OBJECT('name', 'PubMed', 'website', 'https://pubmed.ncbi.nlm.nih.gov', 'description', 'Biomedical literature coverage.'),
        JSON_OBJECT('name', 'researchrabbit.ai', 'website', 'https://www.researchrabbit.ai', 'description', 'Web app for visual discovery.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Twitter support'),
  training_options    = JSON_ARRAY('YouTube tutorials', 'Help articles', 'Blog research guides'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY('GDPR'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is ResearchRabbit?', 'answer', 'ResearchRabbit is a visual literature discovery tool — start with one paper and explore the citation network: earlier work, later work, similar work, and author collaborations.'),
        JSON_OBJECT('question', 'Is it really free?', 'answer', 'Yes — ResearchRabbit is free for individual researchers and remains committed to a free tier indefinitely.'),
        JSON_OBJECT('question', 'How is it different from Elicit / Consensus?', 'answer', 'ResearchRabbit is for visual discovery — exploring the graph of papers around a topic. Elicit and Consensus are for Q&A and extraction from papers.'),
        JSON_OBJECT('question', 'Does it work with Zotero?', 'answer', 'Yes — full bi-directional sync with Zotero collections.'),
        JSON_OBJECT('question', 'Can I share collections?', 'answer', 'Yes — collaborative collections let teams build a shared reading list and discovery space.'),
        JSON_OBJECT('question', 'How does it choose related papers?', 'answer', 'ResearchRabbit uses citation network analysis (Semantic Scholar backbone) + textual similarity to surface relevant papers.')
      ),
  pros                = JSON_ARRAY('Best visual citation discovery tool', 'Genuinely free for researchers', 'Zotero sync is rock solid', 'Strong PubMed / biomedical coverage', 'Email alerts keep you current', 'Collaborative collections for teams'),
  cons                = JSON_ARRAY('Visual maps less useful for systematic review', 'No Q&A or extraction features', 'Smaller team / no enterprise tier', 'Discovery quality varies by topic novelty'),
  starting_price      = 0,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'researchrabbit';

-- chatpdf
UPDATE submissions SET
  header_tags         = JSON_ARRAY('PDF Q&A', 'Document chat', 'Study assistant'),
  industries_served   = JSON_ARRAY('Education', 'Legal', 'Research & Education', 'Healthcare', 'Financial Services', 'Real Estate', 'Consulting', 'Government'),
  use_cases           = JSON_ARRAY('Chat with any PDF', 'Summarise long documents', 'Extract specific information', 'Study from textbooks', 'Read contracts faster', 'Research paper Q&A', 'Compliance document review', 'Multi-PDF workspace'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies'),
  key_features        = JSON_ARRAY('Upload + chat with PDF', 'Multi-PDF folder workspaces', 'Cited page-level answers', 'Highlight + ask follow-up', 'OCR for scanned PDFs', 'Up to 2,000 pages per PDF', 'Browser extension', 'API for developers', 'Multi-language support', 'Saved chat history'),
  features            = JSON_ARRAY('Upload + chat with PDF', 'Multi-PDF folder workspaces', 'Cited page-level answers', 'Highlight + ask follow-up', 'OCR for scanned PDFs', 'Up to 2,000 pages per PDF', 'Browser extension', 'API for developers', 'Multi-language support', 'Saved chat history'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('3 PDFs/day', '50 messages/day', '120 pages per PDF')),
        JSON_OBJECT('name', 'Plus', 'price', 20, 'period', 'month', 'features', JSON_ARRAY('Unlimited PDFs', '2,000 pages per PDF', '50MB file size', 'GPT-4 backend')),
        JSON_OBJECT('name', 'API', 'price', NULL, 'period', 'usage', 'features', JSON_ARRAY('Pay-as-you-go API access', 'Volume discounts', 'Custom rate limits'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'chatpdf.com', 'website', 'https://www.chatpdf.com', 'description', 'Main web upload + chat interface.'),
        JSON_OBJECT('name', 'Chrome extension', 'website', 'https://chrome.google.com/webstore', 'description', 'Add ChatPDF chat to any web-hosted PDF.'),
        JSON_OBJECT('name', 'ChatPDF API', 'website', 'https://www.chatpdf.com/docs/api/backend', 'description', 'Programmatic PDF chat for developers.'),
        JSON_OBJECT('name', 'Zapier', 'website', 'https://zapier.com', 'description', 'Trigger ChatPDF flows from 6,000+ apps.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Twitter support'),
  training_options    = JSON_ARRAY('Help articles', 'YouTube tutorials', 'Sample prompts'),
  languages           = JSON_ARRAY('Multilingual — PDFs + questions in any language'),
  compliance          = JSON_ARRAY('GDPR'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is ChatPDF?', 'answer', 'ChatPDF lets you upload any PDF and chat with it — ask questions and get answers grounded in the document with page-level citations.'),
        JSON_OBJECT('question', 'How big a PDF can I upload?', 'answer', 'Free: 120 pages / 10MB. Plus: up to 2,000 pages / 50MB. OCR supported for scanned PDFs.'),
        JSON_OBJECT('question', 'Does ChatPDF work with non-English documents?', 'answer', 'Yes — you can upload PDFs in any language and chat in your preferred language.'),
        JSON_OBJECT('question', 'Are my PDFs private?', 'answer', 'PDFs are stored privately on ChatPDF servers. They are not used for model training. Delete anytime.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — ChatPDF API exposes upload + chat endpoints for developers (pay-per-usage).'),
        JSON_OBJECT('question', 'How is ChatPDF different from Claude / ChatGPT file upload?', 'answer', 'Both work for individual PDFs. ChatPDF specialises with persistent workspaces, page citations, multi-PDF folders, and a cheap API for builders.')
      ),
  pros                = JSON_ARRAY('Best dedicated PDF chat experience', '2,000 pages per PDF on Plus', 'Page-level citations every answer', 'Multilingual support', 'Cheap API for developers', 'Browser extension for hosted PDFs'),
  cons                = JSON_ARRAY('Single-purpose — only PDFs', 'Free tier limits arrive quickly', 'OCR quality varies on scanned docs', 'No team workspace yet'),
  starting_price      = 20,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'chatpdf';


-- ============================================================
-- GROUP: MEETINGS, NOTES & KNOWLEDGE (8 listings)
-- ============================================================

-- otter-ai
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Meeting transcription', 'AI Chat with notes', 'OtterPilot'),
  industries_served   = JSON_ARRAY('Sales', 'Customer Support', 'Education', 'Consulting', 'Software Development', 'Marketing & Advertising', 'Healthcare', 'Legal'),
  use_cases           = JSON_ARRAY('Live meeting transcription', 'Automated meeting notes + summaries', 'Action item extraction', 'Sales call analysis', 'Lecture transcription', 'Interview transcription', 'Asynchronous meeting catch-up', 'Multi-meeting Q&A'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('OtterPilot auto-joins meetings', 'Real-time transcription', 'Speaker identification', 'Automated meeting summary', 'Action items extraction', 'Otter AI Chat (Q&A across all meetings)', 'CRM auto-write (Salesforce, HubSpot)', 'Slack + Notion + email integration', 'Live audio capture (mobile)', 'Custom vocabulary'),
  features            = JSON_ARRAY('OtterPilot auto-joins meetings', 'Real-time transcription', 'Speaker identification', 'Automated meeting summary', 'Action items extraction', 'Otter AI Chat (Q&A across all meetings)', 'CRM auto-write (Salesforce, HubSpot)', 'Slack + Notion + email integration', 'Live audio capture (mobile)', 'Custom vocabulary'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Basic', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('300 min/mo transcription', '30 min per meeting', '3 imports of audio/video files', 'OtterPilot for 3 meetings/mo')),
        JSON_OBJECT('name', 'Pro', 'price', 16.99, 'period', 'month', 'features', JSON_ARRAY('1,200 min/mo', '90 min per meeting', 'Custom vocabulary', 'Advanced search')),
        JSON_OBJECT('name', 'Business', 'price', 30, 'period', 'month', 'features', JSON_ARRAY('6,000 min/mo', '4-hour meeting limit', 'CRM integrations', 'Admin controls')),
        JSON_OBJECT('name', 'Enterprise', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Unlimited usage', 'SSO + audit', 'Dedicated CSM', 'Custom contracts'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'Zoom', 'website', 'https://zoom.us', 'description', 'OtterPilot joins Zoom meetings as a participant.'),
        JSON_OBJECT('name', 'Google Meet', 'website', 'https://meet.google.com', 'description', 'Native Google Meet integration via OtterPilot.'),
        JSON_OBJECT('name', 'Microsoft Teams', 'website', 'https://www.microsoft.com/microsoft-teams', 'description', 'OtterPilot joins Teams meetings.'),
        JSON_OBJECT('name', 'Salesforce + HubSpot', 'website', 'https://otter.ai', 'description', 'Auto-write call notes to CRM records.'),
        JSON_OBJECT('name', 'Slack + Notion', 'website', 'https://otter.ai', 'description', 'Share notes + summaries to team channels.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Live chat (Business+)', 'Dedicated CSM (Enterprise)'),
  training_options    = JSON_ARRAY('Otter Academy', 'Help articles', 'Webinars', 'YouTube tutorials'),
  languages           = JSON_ARRAY('English (US, UK, AU)', 'Spanish', 'French'),
  compliance          = JSON_ARRAY('SOC 2 Type II', 'GDPR', 'HIPAA-eligible'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is OtterPilot?', 'answer', 'OtterPilot is Otter''s AI assistant that auto-joins your Zoom, Meet, or Teams meetings, transcribes in real time, and shares notes with attendees.'),
        JSON_OBJECT('question', 'How accurate is the transcription?', 'answer', 'Otter consistently scores 90%+ accuracy in good audio conditions. Custom vocabulary (Pro+) improves accuracy for industry terms.'),
        JSON_OBJECT('question', 'What is Otter AI Chat?', 'answer', 'AI Chat lets you ask questions across all your past meetings — "what did the customer say about pricing?" — with cited answers.'),
        JSON_OBJECT('question', 'Does Otter work with Zoom?', 'answer', 'Yes — first-class Zoom integration. OtterPilot joins automatically based on your calendar.'),
        JSON_OBJECT('question', 'Is my meeting data private?', 'answer', 'Yes — Otter does not train models on customer audio. SOC 2 Type II + GDPR + HIPAA-eligible.'),
        JSON_OBJECT('question', 'Can it write to my CRM?', 'answer', 'Yes — Business+ plans auto-write call summaries to Salesforce and HubSpot records.')
      ),
  pros                = JSON_ARRAY('Most polished meeting transcription experience', 'OtterPilot auto-join is genuinely magical', 'AI Chat across all meetings is unique', 'Strong CRM auto-write on Business', '90%+ transcription accuracy', 'Mobile app for in-person recordings'),
  cons                = JSON_ARRAY('Free tier limits arrive quickly', 'English-first — limited other languages', 'CRM integrations require Business tier', 'Meeting length caps below Enterprise'),
  starting_price      = 16.99,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 1,
  has_android_app     = 1
WHERE slug = 'otter-ai';

-- fireflies-ai
UPDATE submissions SET
  header_tags         = JSON_ARRAY('AI notetaker', 'Conversation intelligence', 'CRM-native'),
  industries_served   = JSON_ARRAY('Sales', 'Customer Support', 'Recruiting', 'Software Development', 'Consulting', 'Marketing & Advertising', 'Education', 'Customer Success'),
  use_cases           = JSON_ARRAY('Meeting transcription + notes', 'Sales conversation intelligence', 'CRM auto-logging', 'Action item tracking', 'Coaching with smart filters', 'Topic + sentiment analysis', 'Interview transcription', 'Search across all meetings'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Fred AI assistant joins meetings', 'AI-generated meeting summaries', 'Soundbites (notable clips)', 'Smart Search across meetings', 'Topic tracker (custom keywords)', 'Sentiment + speaker analysis', '50+ CRM + tool integrations', 'AskFred chat across all meetings', 'Conversation intelligence dashboards', 'API + webhooks'),
  features            = JSON_ARRAY('Fred AI assistant joins meetings', 'AI-generated meeting summaries', 'Soundbites (notable clips)', 'Smart Search across meetings', 'Topic tracker (custom keywords)', 'Sentiment + speaker analysis', '50+ CRM + tool integrations', 'AskFred chat across all meetings', 'Conversation intelligence dashboards', 'API + webhooks'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('Unlimited transcription', 'Limited AI summaries', '800 min storage', 'Basic integrations')),
        JSON_OBJECT('name', 'Pro', 'price', 18, 'period', 'month', 'features', JSON_ARRAY('Unlimited AI summaries', '8,000 min storage', 'CRM integrations', 'Smart Search')),
        JSON_OBJECT('name', 'Business', 'price', 29, 'period', 'month', 'features', JSON_ARRAY('Unlimited storage', 'Conversation intelligence', 'Custom topic tracking', 'Video recording')),
        JSON_OBJECT('name', 'Enterprise', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('SSO + audit', 'Dedicated CSM', 'Custom contracts'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'Zoom + Google Meet + Teams', 'website', 'https://fireflies.ai', 'description', 'Fred joins meetings on any major platform.'),
        JSON_OBJECT('name', 'Salesforce + HubSpot', 'website', 'https://fireflies.ai/integrations', 'description', 'Auto-log meetings to CRM with action items.'),
        JSON_OBJECT('name', 'Slack + Notion + Asana', 'website', 'https://fireflies.ai/integrations', 'description', 'Share summaries and action items to productivity tools.'),
        JSON_OBJECT('name', 'Fireflies API', 'website', 'https://fireflies.ai/integrations', 'description', 'Programmatic access to meetings, summaries, and search.'),
        JSON_OBJECT('name', 'Zapier', 'website', 'https://zapier.com', 'description', 'Bridge Fireflies to 6,000+ apps via Zapier.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Live chat', 'Dedicated CSM (Enterprise)'),
  training_options    = JSON_ARRAY('Fireflies Academy', 'Help articles', 'YouTube tutorials', 'Webinars'),
  languages           = JSON_ARRAY('70+ languages'),
  compliance          = JSON_ARRAY('SOC 2 Type II', 'GDPR', 'HIPAA-eligible'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Fireflies.ai?', 'answer', 'Fireflies is an AI notetaker — Fred, the AI assistant, joins your meetings, transcribes, generates summaries, extracts action items, and syncs everything to your CRM.'),
        JSON_OBJECT('question', 'What is AskFred?', 'answer', 'AskFred is a conversational AI that answers questions across all your meeting transcripts — perfect for "did anyone mention pricing last quarter" style queries.'),
        JSON_OBJECT('question', 'How is Fireflies different from Otter?', 'answer', 'Both transcribe meetings. Fireflies leans heavily into conversation intelligence (topic tracker, sentiment, coaching) and stronger CRM auto-logging.'),
        JSON_OBJECT('question', 'Does Fireflies support 70+ languages?', 'answer', 'Yes — Fireflies transcribes in 70+ languages, with summaries in English (additional languages rolling out).'),
        JSON_OBJECT('question', 'Is the free tier real?', 'answer', 'Yes — unlimited transcription on Free, with limited AI summaries and storage.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — Business+ plans include API access for programmatic meeting analysis.')
      ),
  pros                = JSON_ARRAY('Generous free tier with unlimited transcription', '70+ language transcription', 'Strong conversation intelligence (Business)', '50+ CRM + tool integrations', 'AskFred is uniquely useful for sales review', 'Lower pricing than Gong for similar features'),
  cons                = JSON_ARRAY('AI summary quality varies by industry', 'Conversation intelligence locked to Business', 'CRM auto-log requires Pro+', 'Some sales features less mature than Gong'),
  starting_price      = 18,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 1,
  has_android_app     = 1
WHERE slug = 'fireflies-ai';

-- read-ai
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Meeting insights', 'Camera-aware analysis', 'Productivity reports'),
  industries_served   = JSON_ARRAY('Sales', 'Customer Support', 'HR & Recruiting', 'Consulting', 'Education', 'Customer Success', 'Marketing & Advertising', 'Software Development'),
  use_cases           = JSON_ARRAY('Meeting transcription + summaries', 'Engagement + sentiment analysis', 'Speaker dynamics insights', 'Async meeting catch-up', 'Read AI Copilot in inbox', 'Meeting effectiveness scoring', 'Action item assignment', 'Smart Composer (email drafts)'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Auto-join Zoom, Meet, Teams meetings', 'Engagement + sentiment scoring', 'Meeting effectiveness score', 'Speaker dynamics + interruption tracking', 'Camera analysis (engagement, optional)', 'AI Copilot for email + chat', 'Smart Composer (draft emails)', 'Meeting playback + smart highlights', 'Universal search across meetings + emails', 'Workspace integrations (Slack, Notion, etc.)'),
  features            = JSON_ARRAY('Auto-join Zoom, Meet, Teams meetings', 'Engagement + sentiment scoring', 'Meeting effectiveness score', 'Speaker dynamics + interruption tracking', 'Camera analysis (engagement, optional)', 'AI Copilot for email + chat', 'Smart Composer (draft emails)', 'Meeting playback + smart highlights', 'Universal search across meetings + emails', 'Workspace integrations (Slack, Notion, etc.)'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('5 meetings/mo with full insights', 'Basic transcription', 'Standard integrations')),
        JSON_OBJECT('name', 'Pro', 'price', 19.75, 'period', 'month', 'features', JSON_ARRAY('Unlimited meetings', 'Smart Composer', 'AI Copilot', 'All insights')),
        JSON_OBJECT('name', 'Enterprise', 'price', 29.75, 'period', 'month', 'features', JSON_ARRAY('All Pro features', 'SSO', 'Admin controls', 'Custom retention'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'Zoom', 'website', 'https://zoom.us', 'description', 'Auto-join Zoom meetings with full insights.'),
        JSON_OBJECT('name', 'Google Meet', 'website', 'https://meet.google.com', 'description', 'Native Google Meet integration.'),
        JSON_OBJECT('name', 'Microsoft Teams', 'website', 'https://www.microsoft.com/microsoft-teams', 'description', 'Read joins Teams meetings.'),
        JSON_OBJECT('name', 'Slack + Notion + Asana', 'website', 'https://www.read.ai', 'description', 'Share insights and action items.'),
        JSON_OBJECT('name', 'Salesforce + HubSpot', 'website', 'https://www.read.ai', 'description', 'CRM logging for sales teams.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Dedicated CSM (Enterprise)'),
  training_options    = JSON_ARRAY('Help articles', 'YouTube tutorials', 'Onboarding emails'),
  languages           = JSON_ARRAY('English', 'Spanish', 'French', '20+ more'),
  compliance          = JSON_ARRAY('SOC 2 Type II', 'GDPR'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Read AI?', 'answer', 'Read AI is a meeting + email assistant that joins your calls, transcribes, and adds analytics — engagement scoring, sentiment, speaker dynamics, and meeting effectiveness.'),
        JSON_OBJECT('question', 'What is meeting effectiveness?', 'answer', 'Read scores each meeting on engagement, sentiment, and outcomes — helps teams identify which meetings are productive vs which could be an email.'),
        JSON_OBJECT('question', 'How is Read different from Otter / Fireflies?', 'answer', 'Read adds camera-aware engagement analysis + email + meeting effectiveness scoring on top of transcription — broader productivity layer.'),
        JSON_OBJECT('question', 'Does it use my camera?', 'answer', 'Camera analysis (engagement) is opt-in per meeting. Audio-only operation is also available.'),
        JSON_OBJECT('question', 'Is there a free tier?', 'answer', 'Yes — 5 meetings/mo with full insights for individuals.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'API access is available for Enterprise customers.')
      ),
  pros                = JSON_ARRAY('Most extensive meeting + email analytics suite', 'Engagement + effectiveness scoring is unique', 'Smart Composer drafts emails from context', 'Strong workspace integrations', 'Generous Free tier with full insights', 'AI Copilot in inbox bonus'),
  cons                = JSON_ARRAY('Camera analysis some find intrusive', 'Heavier UI than minimalist alternatives', 'Limited multi-language support', 'Insights vary in usefulness by team'),
  starting_price      = 19.75,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 1,
  has_android_app     = 1
WHERE slug = 'read-ai';

-- granola
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Local-first notes', 'No bots in meetings', 'Mac native'),
  industries_served   = JSON_ARRAY('Software Development', 'Sales', 'Consulting', 'Startups', 'Customer Success', 'Marketing & Advertising', 'Knowledge Work', 'Operations'),
  use_cases           = JSON_ARRAY('Personal meeting notes', 'No-bot transcription (Mac mic)', 'AI-summarised meeting recaps', 'Quick action items', 'Async daily logs', 'Pre-meeting agenda + notes', 'Personal CRM-light tracking', 'Voice memos'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies'),
  key_features        = JSON_ARRAY('Mac-native app (no bot joins call)', 'Personal note-taking during meeting', 'AI enhances your notes post-meeting', 'Custom templates per meeting type', 'Action items + follow-ups', 'Folder organisation', 'Speaker labelling', 'Quick share to Slack / email', 'AI chat across all notes', 'Privacy-first (audio stays local)'),
  features            = JSON_ARRAY('Mac-native app (no bot joins call)', 'Personal note-taking during meeting', 'AI enhances your notes post-meeting', 'Custom templates per meeting type', 'Action items + follow-ups', 'Folder organisation', 'Speaker labelling', 'Quick share to Slack / email', 'AI chat across all notes', 'Privacy-first (audio stays local)'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('25 AI-enhanced meetings', 'Mac app', 'All features unlocked')),
        JSON_OBJECT('name', 'Personal', 'price', 14, 'period', 'month', 'features', JSON_ARRAY('Unlimited meetings', 'AI Chat across notes', 'Custom templates', 'Folders')),
        JSON_OBJECT('name', 'Business', 'price', 25, 'period', 'month', 'features', JSON_ARRAY('Team workspaces', 'Shared meeting library', 'Admin controls', 'Centralised billing'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'Mac native app', 'website', 'https://www.granola.ai', 'description', 'macOS app — captures system audio without joining calls as a bot.'),
        JSON_OBJECT('name', 'Slack', 'website', 'https://slack.com', 'description', 'Share polished notes directly to Slack.'),
        JSON_OBJECT('name', 'Notion', 'website', 'https://www.notion.so', 'description', 'Export notes to Notion pages.'),
        JSON_OBJECT('name', 'Linear', 'website', 'https://linear.app', 'description', 'Create Linear issues from action items.'),
        JSON_OBJECT('name', 'HubSpot', 'website', 'https://www.hubspot.com', 'description', 'Log meetings to HubSpot CRM.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Slack community'),
  training_options    = JSON_ARRAY('Help articles', 'Template library', 'YouTube tutorials'),
  languages           = JSON_ARRAY('English', 'Multilingual transcription'),
  compliance          = JSON_ARRAY('SOC 2 (in progress)'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Granola?', 'answer', 'Granola is a Mac-native AI meeting notetaker — you take notes during the call, and Granola enhances them post-meeting using audio captured locally on your Mac.'),
        JSON_OBJECT('question', 'Why no bot joining the call?', 'answer', 'Granola captures system audio directly from your Mac, so no bot joins meetings — less disruptive to attendees, more private, and works in any meeting platform.'),
        JSON_OBJECT('question', 'How is it different from Otter / Fireflies?', 'answer', 'Otter / Fireflies join meetings as a bot. Granola is local-first, Mac-native, and centres on enhancing your own notes (not auto-summarising a transcript).'),
        JSON_OBJECT('question', 'Is it Mac-only?', 'answer', 'Currently yes — Granola is macOS native. Windows version reportedly in development.'),
        JSON_OBJECT('question', 'Is my audio private?', 'answer', 'Audio is processed in the cloud for AI enhancement but not retained beyond the immediate enhancement step. Local-first architecture.'),
        JSON_OBJECT('question', 'Is there a free tier?', 'answer', 'Yes — 25 AI-enhanced meetings free. Paid tiers unlock unlimited usage + AI chat across notes.')
      ),
  pros                = JSON_ARRAY('No-bot architecture is uniquely respectful', 'Mac-native = fast + battery-friendly', 'Best for personal note-takers (not just AI summary)', 'Templates per meeting type save time', 'Clean Slack + Notion sharing', 'Strong design + UX'),
  cons                = JSON_ARRAY('Mac-only — no Windows or web yet', 'Requires user to take notes (not full auto)', 'No team conversation intelligence layer', 'No CRM auto-logging at depth of Gong / Fireflies'),
  starting_price      = 14,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'granola';

-- reflect-notes
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Networked notes', 'Encrypted', 'Daily journal'),
  industries_served   = JSON_ARRAY('Knowledge Work', 'Software Development', 'Consulting', 'Education', 'Creative Writing', 'Personal Productivity', 'Research & Education', 'Coaching'),
  use_cases           = JSON_ARRAY('Daily journaling', 'Networked thought (Roam-style)', 'Meeting + project notes', 'Personal knowledge management', 'Reading highlights collection', 'Voice notes capture', 'Backlink-based note linking', 'Encrypted private notes'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses'),
  key_features        = JSON_ARRAY('End-to-end encryption', 'Daily notes + backlinks (Roam-style)', 'AI assistant inside notes', 'GPT-4 chat across notes', 'Voice transcription notes', 'Custom prompts library', 'Calendar + meeting integration', 'Browser highlighter (Reflect Web Clipper)', 'iOS app + Mac app + Web', 'Offline-first sync'),
  features            = JSON_ARRAY('End-to-end encryption', 'Daily notes + backlinks (Roam-style)', 'AI assistant inside notes', 'GPT-4 chat across notes', 'Voice transcription notes', 'Custom prompts library', 'Calendar + meeting integration', 'Browser highlighter (Reflect Web Clipper)', 'iOS app + Mac app + Web', 'Offline-first sync'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Personal Pro', 'price', 10, 'period', 'month', 'features', JSON_ARRAY('End-to-end encryption', 'AI assistant unlimited', 'iOS + Mac + Web apps', 'Voice notes'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'iOS app', 'website', 'https://apps.apple.com', 'description', 'Native iOS app with voice notes.'),
        JSON_OBJECT('name', 'macOS app', 'website', 'https://reflect.app', 'description', 'Native macOS app with offline sync.'),
        JSON_OBJECT('name', 'Web', 'website', 'https://reflect.app', 'description', 'Browser-based web app.'),
        JSON_OBJECT('name', 'Web Clipper', 'website', 'https://reflect.app', 'description', 'Save highlights from any web page.'),
        JSON_OBJECT('name', 'Google + Apple Calendar', 'website', 'https://reflect.app', 'description', 'Daily notes auto-populate with your meetings.'),
        JSON_OBJECT('name', 'Readwise', 'website', 'https://readwise.io', 'description', 'Import reading highlights into Reflect.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Community forum'),
  training_options    = JSON_ARRAY('Help articles', 'Tutorial videos', 'Templates'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY('GDPR'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Reflect?', 'answer', 'Reflect is an encrypted, networked notes app — daily notes + backlinks (Roam Research-style) with an AI assistant for journaling, summaries, and brainstorming.'),
        JSON_OBJECT('question', 'How is Reflect different from Notion or Obsidian?', 'answer', 'Reflect emphasises daily-note + backlink workflows + end-to-end encryption + bundled AI. Notion is database-heavy; Obsidian is local-file based.'),
        JSON_OBJECT('question', 'Is it encrypted?', 'answer', 'Yes — Reflect uses end-to-end encryption, meaning even Reflect''s servers cannot read your notes.'),
        JSON_OBJECT('question', 'Does the AI see my notes?', 'answer', 'AI features are opt-in per note and use a privacy-preserving flow — notes are not used for model training.'),
        JSON_OBJECT('question', 'Is there a free tier?', 'answer', 'No permanent free tier — Reflect offers a free trial of Personal Pro ($10/mo).'),
        JSON_OBJECT('question', 'Can I import from Roam / Obsidian?', 'answer', 'Yes — Reflect supports markdown import from Roam, Obsidian, and other tools.')
      ),
  pros                = JSON_ARRAY('Best encrypted notes app with AI built-in', 'Daily-note + backlink workflow is unmatched', 'Apple ecosystem app quality', 'Voice notes + Web Clipper bundled', 'Privacy-first architecture', 'Custom prompts library for repeat workflows'),
  cons                = JSON_ARRAY('Single subscription tier — less flexibility', 'No Windows app', 'Encryption means no full-text search server-side', 'Smaller community than Notion / Obsidian'),
  starting_price      = 10,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 0,
  has_ios_app         = 1,
  has_android_app     = 0
WHERE slug = 'reflect-notes';

-- mem
UPDATE submissions SET
  header_tags         = JSON_ARRAY('AI-native notes', 'Self-organising', 'Mem X'),
  industries_served   = JSON_ARRAY('Knowledge Work', 'Consulting', 'Software Development', 'Marketing & Advertising', 'Sales', 'Personal Productivity', 'Education', 'Research & Education'),
  use_cases           = JSON_ARRAY('Self-organising notes', 'Daily journaling', 'Meeting + project notes', 'AI-powered search', 'Smart writing assistance', 'Auto-tagging', 'AI chat over personal knowledge', 'iOS quick capture'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies'),
  key_features        = JSON_ARRAY('AI auto-organises notes', 'Mem Chat (AI across your notes)', 'Smart Write assistant', 'Related notes surfacing', 'Auto-tagging', 'iOS app + Web', 'Mem Spaces for teams', 'Voice notes', 'Email-to-Mem', 'API for integration'),
  features            = JSON_ARRAY('AI auto-organises notes', 'Mem Chat (AI across your notes)', 'Smart Write assistant', 'Related notes surfacing', 'Auto-tagging', 'iOS app + Web', 'Mem Spaces for teams', 'Voice notes', 'Email-to-Mem', 'API for integration'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('Unlimited notes', 'Basic AI features', 'iOS + Web')),
        JSON_OBJECT('name', 'Mem X', 'price', 14.99, 'period', 'month', 'features', JSON_ARRAY('Unlimited Mem Chat', 'Smart Write', 'Mem Editor AI', 'Higher limits')),
        JSON_OBJECT('name', 'Teams', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Mem Spaces (team workspaces)', 'Shared knowledge', 'Admin controls'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'iOS app', 'website', 'https://apps.apple.com', 'description', 'Native iOS app for quick capture.'),
        JSON_OBJECT('name', 'mem.ai web', 'website', 'https://mem.ai', 'description', 'Main web app.'),
        JSON_OBJECT('name', 'Email-to-Mem', 'website', 'https://mem.ai', 'description', 'Forward emails to capture them in Mem.'),
        JSON_OBJECT('name', 'Twitter / X bookmarks', 'website', 'https://mem.ai', 'description', 'Import Twitter bookmarks as notes.'),
        JSON_OBJECT('name', 'Mem API', 'website', 'https://mem.ai/api', 'description', 'Programmatic capture + retrieval.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Discord community'),
  training_options    = JSON_ARRAY('Help articles', 'YouTube tutorials', 'Templates'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY('SOC 2', 'GDPR'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Mem?', 'answer', 'Mem is an AI-native notes app that auto-organises your notes — no folders or tags required. Mem Chat lets you ask questions across all your notes.'),
        JSON_OBJECT('question', 'How does auto-organisation work?', 'answer', 'Mem''s AI surfaces related notes, auto-tags content, and lets you search by meaning rather than keywords — no manual folder organisation needed.'),
        JSON_OBJECT('question', 'What is Mem X?', 'answer', 'Mem X is the paid tier ($14.99/mo) that unlocks unlimited Mem Chat, Smart Write, and the full AI editor.'),
        JSON_OBJECT('question', 'Is there a team tier?', 'answer', 'Yes — Mem Spaces is the team product with shared workspaces and admin controls.'),
        JSON_OBJECT('question', 'Can it summarise meetings?', 'answer', 'Mem doesn''t join calls itself, but you can paste transcripts and use Mem Chat / Smart Write for summarisation.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — Mem API lets developers capture and retrieve notes programmatically.')
      ),
  pros                = JSON_ARRAY('Best AI-native auto-organising notes', 'Mem Chat across personal knowledge', 'Email-to-Mem capture is elegant', 'iOS app polished for quick capture', 'Strong design + UX', 'Smart Write inside notes'),
  cons                = JSON_ARRAY('iOS-only mobile (no Android)', 'Auto-organisation feels opaque to some users', 'Free tier limited AI', 'Smaller community than Notion / Obsidian'),
  starting_price      = 14.99,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 1,
  has_android_app     = 0
WHERE slug = 'mem';

-- tana
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Outliner + database', 'Supertags', 'Tana AI'),
  industries_served   = JSON_ARRAY('Knowledge Work', 'Software Development', 'Research & Education', 'Consulting', 'Project Management', 'Operations', 'Marketing & Advertising', 'Personal Productivity'),
  use_cases           = JSON_ARRAY('Networked outline notes', 'Custom databases via supertags', 'Project + task management', 'Daily notes with structure', 'CRM-light tracking', 'Reading highlights with structure', 'Voice memo to structured note', 'AI-powered note expansion'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies'),
  key_features        = JSON_ARRAY('Outliner + nested blocks', 'Supertags (database with fields)', 'Live queries across notes', 'Tana AI (GPT-4 inside outline)', 'Email-to-Tana inbox', 'iOS app with voice memos', 'Calendar integration', 'Quotes for AI auto-fill', 'Custom templates', 'Backlinks + bi-directional links'),
  features            = JSON_ARRAY('Outliner + nested blocks', 'Supertags (database with fields)', 'Live queries across notes', 'Tana AI (GPT-4 inside outline)', 'Email-to-Tana inbox', 'iOS app with voice memos', 'Calendar integration', 'Quotes for AI auto-fill', 'Custom templates', 'Backlinks + bi-directional links'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('Single workspace', 'Core outliner features', 'Limited AI credits')),
        JSON_OBJECT('name', 'Plus', 'price', 14, 'period', 'month', 'features', JSON_ARRAY('Unlimited workspaces', 'Tana AI included', 'Voice memos', 'Email-to-Tana')),
        JSON_OBJECT('name', 'Pro', 'price', 28, 'period', 'month', 'features', JSON_ARRAY('Higher AI limits', 'Priority support', 'Power-user features'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'iOS app', 'website', 'https://apps.apple.com', 'description', 'Native iOS app with voice memo capture.'),
        JSON_OBJECT('name', 'tana.inc web', 'website', 'https://tana.inc', 'description', 'Main web app for desktop.'),
        JSON_OBJECT('name', 'Email-to-Tana', 'website', 'https://tana.inc', 'description', 'Forward emails to your Tana inbox.'),
        JSON_OBJECT('name', 'Google + Apple Calendar', 'website', 'https://tana.inc', 'description', 'Daily notes pull in calendar events.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Slack community', 'Help center', 'YouTube channel'),
  training_options    = JSON_ARRAY('Tana University', 'YouTube tutorials', 'Community templates', 'Office hours'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY('GDPR'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Tana?', 'answer', 'Tana is an outliner + database hybrid — like Roam Research''s outline with Notion''s structured fields, plus AI for expansion and querying.'),
        JSON_OBJECT('question', 'What are supertags?', 'answer', 'Supertags turn any node into a typed database entry with fields, queries, and templates — like Notion databases but inside a flexible outliner.'),
        JSON_OBJECT('question', 'How is Tana different from Roam / Notion?', 'answer', 'Tana combines Roam''s outliner flow with Notion''s structured databases (via supertags) and adds AI throughout — a hybrid that''s polarising but powerful for power users.'),
        JSON_OBJECT('question', 'Is there a free tier?', 'answer', 'Yes — Free supports a single workspace with core features. Plus ($14/mo) unlocks unlimited workspaces and Tana AI.'),
        JSON_OBJECT('question', 'How does Tana AI work?', 'answer', 'AI commands live as supertags — you can attach an AI prompt to any node to auto-expand, summarise, or generate from context.'),
        JSON_OBJECT('question', 'Is there a desktop app?', 'answer', 'Tana is web-first and works as a PWA. Native macOS app available.')
      ),
  pros                = JSON_ARRAY('Most ambitious outliner + database hybrid', 'Supertags are uniquely powerful', 'Tana AI integrated with structure', 'Voice memos → structured notes is magical', 'Strong power-user community', 'Email-to-Tana for capture'),
  cons                = JSON_ARRAY('Steep learning curve for non-Roam users', 'iOS-only mobile (no Android)', 'Subscription required for serious use', 'Performance occasionally lags on big graphs'),
  starting_price      = 14,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 1,
  has_android_app     = 0
WHERE slug = 'tana';

-- lex
UPDATE submissions SET
  header_tags         = JSON_ARRAY('AI writing app', 'Long-form writers', 'Distraction-free'),
  industries_served   = JSON_ARRAY('Authors', 'Marketing & Advertising', 'Publishing', 'Consulting', 'Education', 'Bloggers', 'Newsletter Writers', 'Knowledge Work'),
  use_cases           = JSON_ARRAY('Essay + long-form drafting', 'Newsletter writing', 'Book chapters', 'Brainstorming', 'Outlining + structure', 'Editing + rewriting', 'Title + headline generation', 'Distraction-free writing'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses'),
  key_features        = JSON_ARRAY('Distraction-free writing UI', 'AI write-along (continue, expand, rephrase)', 'Ask Lex (Q&A on your draft)', 'Multi-model picker (GPT, Claude, Gemini)', 'Markdown export + publishing', 'Custom Voice + Style', 'Doc-by-doc privacy', 'Comments + collaboration', 'Outline mode', 'Web + Mac app'),
  features            = JSON_ARRAY('Distraction-free writing UI', 'AI write-along (continue, expand, rephrase)', 'Ask Lex (Q&A on your draft)', 'Multi-model picker (GPT, Claude, Gemini)', 'Markdown export + publishing', 'Custom Voice + Style', 'Doc-by-doc privacy', 'Comments + collaboration', 'Outline mode', 'Web + Mac app'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('Limited AI prompts/mo', 'All editor features', 'Markdown export')),
        JSON_OBJECT('name', 'Premium', 'price', 24, 'period', 'month', 'features', JSON_ARRAY('Unlimited AI prompts', 'GPT-4 + Claude + Gemini', 'Custom voice + style', 'Priority support'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'lex.page', 'website', 'https://lex.page', 'description', 'Main web editor.'),
        JSON_OBJECT('name', 'macOS app', 'website', 'https://lex.page', 'description', 'Native Mac app.'),
        JSON_OBJECT('name', 'Markdown export', 'website', 'https://lex.page', 'description', 'Export to any markdown destination (Substack, Ghost, etc.).')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Slack community'),
  training_options    = JSON_ARRAY('Tutorial videos', 'Help articles', 'Sample documents'),
  languages           = JSON_ARRAY('English', 'Multilingual via underlying LLMs'),
  compliance          = JSON_ARRAY('GDPR'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Lex?', 'answer', 'Lex (lex.page) is an AI-powered writing app for long-form writers — distraction-free editor + multi-model AI for expansion, rewriting, and Q&A on your draft.'),
        JSON_OBJECT('question', 'Who founded Lex?', 'answer', 'Nathan Baschez (formerly of Every and Substack) founded Lex with a focus on serious writers.'),
        JSON_OBJECT('question', 'How is Lex different from Notion / Google Docs?', 'answer', 'Lex is purpose-built for long-form writing — no databases, no clutter. AI is woven in for write-along, Q&A, and editing.'),
        JSON_OBJECT('question', 'Which AI models can I use?', 'answer', 'GPT-4o, Claude 3.5 Sonnet, and Gemini 1.5 Pro — switchable per session.'),
        JSON_OBJECT('question', 'Is there a free tier?', 'answer', 'Yes — Free includes limited AI usage with the full editor. Premium ($24/mo) unlocks unlimited AI and premium models.'),
        JSON_OBJECT('question', 'Can I publish from Lex?', 'answer', 'Lex exports Markdown — paste into Substack, Ghost, Medium, or any blog platform.')
      ),
  pros                = JSON_ARRAY('Best long-form writing experience with AI', 'Multi-model picker without paying multiple subs', 'Custom Voice + Style for repeat work', 'Distraction-free design', 'Strong writer community', 'Ask Lex Q&A on your draft is unique'),
  cons                = JSON_ARRAY('No mobile app', 'No team / workspace tier', 'Premium for full daily use', 'Niche for long-form — overkill for short notes'),
  starting_price      = 24,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'lex';


-- ============================================================
-- GROUP: SALES, MARKETING & SUPPORT (12 listings)
-- ============================================================

-- lavender
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Sales email AI', 'Reply-rate coach', 'Real-time scoring'),
  industries_served   = JSON_ARRAY('Sales', 'SaaS & Software', 'Recruiting', 'Financial Services', 'Marketing & Advertising', 'Real Estate', 'B2B Services', 'Agencies'),
  use_cases           = JSON_ARRAY('Cold email writing', 'Real-time email coaching', 'Personalised outreach', 'Email A/B testing', 'Prospect research baked into email', 'Reply-rate optimisation', 'Email tone + length analysis', 'Multi-account team coaching'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Real-time email score (Lavender Score)', 'AI-suggested rewrites + personalisation', 'Prospect data alongside the email', 'Gmail + Outlook integration', 'Browser extension for any send tool', 'Team coaching dashboards', 'Email A/B testing', 'Personalisation suggestions from social data', 'Subject-line + opener tester', 'CRM sync (Salesforce, HubSpot)'),
  features            = JSON_ARRAY('Real-time email score (Lavender Score)', 'AI-suggested rewrites + personalisation', 'Prospect data alongside the email', 'Gmail + Outlook integration', 'Browser extension for any send tool', 'Team coaching dashboards', 'Email A/B testing', 'Personalisation suggestions from social data', 'Subject-line + opener tester', 'CRM sync (Salesforce, HubSpot)'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Basic', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('5 email assists/mo', 'Lavender Score', 'Gmail extension')),
        JSON_OBJECT('name', 'Starter', 'price', 29, 'period', 'month', 'features', JSON_ARRAY('Unlimited email assists', 'Personalisation', 'Coaching insights')),
        JSON_OBJECT('name', 'Individual Pro', 'price', 59, 'period', 'month', 'features', JSON_ARRAY('Pro coaching', 'A/B testing', 'CRM sync', 'Priority support')),
        JSON_OBJECT('name', 'Teams', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Team coaching dashboards', 'Manager visibility', 'SSO + admin'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'Gmail', 'website', 'https://www.lavender.ai', 'description', 'Native Chrome extension for Gmail.'),
        JSON_OBJECT('name', 'Outlook', 'website', 'https://www.lavender.ai', 'description', 'Outlook add-in for Microsoft 365.'),
        JSON_OBJECT('name', 'Salesforce', 'website', 'https://www.salesforce.com', 'description', 'Native Salesforce CRM sync.'),
        JSON_OBJECT('name', 'HubSpot', 'website', 'https://www.hubspot.com', 'description', 'HubSpot CRM + Sales Hub integration.'),
        JSON_OBJECT('name', 'Outreach + Salesloft', 'website', 'https://www.lavender.ai', 'description', 'Score and coach emails inside major sequencing tools.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Slack community', 'Dedicated CSM (Teams)'),
  training_options    = JSON_ARRAY('Lavender Academy', 'YouTube tutorials', 'Webinars', 'Templates library'),
  languages           = JSON_ARRAY('English', 'Multilingual scoring (40+ languages)'),
  compliance          = JSON_ARRAY('SOC 2 Type II', 'GDPR'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Lavender?', 'answer', 'Lavender is an AI sales email coach — real-time scoring of your drafts plus personalisation suggestions based on prospect data, designed to boost reply rates.'),
        JSON_OBJECT('question', 'What is the Lavender Score?', 'answer', 'A 0-100 score for an email draft based on length, sentiment, complexity, tone, and personalisation — calibrated against reply-rate data.'),
        JSON_OBJECT('question', 'Does it work in Gmail / Outlook?', 'answer', 'Yes — Gmail Chrome extension and Outlook add-in. Also works in Outreach, Salesloft, and HubSpot Sequences.'),
        JSON_OBJECT('question', 'How is it different from Grammarly?', 'answer', 'Grammarly focuses on grammar and tone. Lavender focuses on reply-rate optimisation for sales emails specifically — personalisation, length, hooks, and CTAs.'),
        JSON_OBJECT('question', 'Can managers see team emails?', 'answer', 'Teams tier gives managers coaching dashboards aggregating scores + reply rates — without exposing individual email content.'),
        JSON_OBJECT('question', 'Is there a free tier?', 'answer', 'Yes — 5 email assists/mo on Basic with Lavender Score and Gmail extension.')
      ),
  pros                = JSON_ARRAY('Best-in-class sales email coaching', 'Real-time scoring drives behaviour change', 'Personalisation suggestions are unique', 'Native in every major SEP', 'Team coaching dashboards for managers', 'Strong founder + content community'),
  cons                = JSON_ARRAY('Per-seat pricing adds up on large teams', 'Coaching depth requires Individual Pro tier', 'Best for B2B cold email — less for transactional', 'Score is opinionated — not every team agrees'),
  starting_price      = 29,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'lavender';

-- apollo-io
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Sales platform', 'B2B database', 'AI sequences'),
  industries_served   = JSON_ARRAY('Sales', 'Marketing & Advertising', 'SaaS & Software', 'Recruiting', 'B2B Services', 'Real Estate', 'Agencies', 'Financial Services'),
  use_cases           = JSON_ARRAY('Lead generation', 'Cold email + multi-channel sequencing', 'Prospect data enrichment', 'Account-based marketing', 'AI-personalised outreach', 'Email + phone + LinkedIn workflows', 'Pipeline management', 'Sales analytics + reporting'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('275M+ contact database', 'Multi-channel sequencer (email, calls, LinkedIn)', 'AI Power-Ups for personalisation', 'Buying intent signals', 'Account-based prospecting', 'Conversation intelligence', 'CRM-light + Salesforce / HubSpot sync', 'Dialer + voicemail drop', 'Meeting scheduler', 'Workflow automations'),
  features            = JSON_ARRAY('275M+ contact database', 'Multi-channel sequencer (email, calls, LinkedIn)', 'AI Power-Ups for personalisation', 'Buying intent signals', 'Account-based prospecting', 'Conversation intelligence', 'CRM-light + Salesforce / HubSpot sync', 'Dialer + voicemail drop', 'Meeting scheduler', 'Workflow automations'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('60 mobile + 120 export credits', 'Basic sequencer', 'LinkedIn extension')),
        JSON_OBJECT('name', 'Basic', 'price', 59, 'period', 'month', 'features', JSON_ARRAY('900 mobile credits', 'Advanced filters', 'Email open tracking')),
        JSON_OBJECT('name', 'Professional', 'price', 99, 'period', 'month', 'features', JSON_ARRAY('2,400 credits', 'Conversation intelligence', 'AI workflows', 'Power-Ups')),
        JSON_OBJECT('name', 'Organization', 'price', 149, 'period', 'month', 'features', JSON_ARRAY('3,600 credits + buying intent', 'SSO', 'Custom reporting'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'Salesforce', 'website', 'https://www.salesforce.com', 'description', 'Bi-directional Salesforce sync.'),
        JSON_OBJECT('name', 'HubSpot', 'website', 'https://www.hubspot.com', 'description', 'Native HubSpot CRM sync.'),
        JSON_OBJECT('name', 'Gmail + Outlook', 'website', 'https://www.apollo.io', 'description', 'Email send + tracking integration.'),
        JSON_OBJECT('name', 'LinkedIn extension', 'website', 'https://www.apollo.io', 'description', 'Find emails + add to sequences from LinkedIn.'),
        JSON_OBJECT('name', 'Zapier', 'website', 'https://zapier.com', 'description', 'Bridge Apollo to 6,000+ apps.'),
        JSON_OBJECT('name', 'Apollo API', 'website', 'https://docs.apollo.io', 'description', 'Programmatic access to data + sequences.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Live chat', 'Dedicated CSM (Organization)'),
  training_options    = JSON_ARRAY('Apollo Academy', 'YouTube tutorials', 'Webinars', 'Templates library'),
  languages           = JSON_ARRAY('English', 'Multilingual sequencing'),
  compliance          = JSON_ARRAY('SOC 2 Type II', 'GDPR', 'CCPA'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Apollo.io?', 'answer', 'Apollo is an end-to-end sales platform — B2B contact database (275M+), multi-channel sequencer, AI personalisation, conversation intelligence, and CRM-light all in one.'),
        JSON_OBJECT('question', 'How accurate is the data?', 'answer', 'Apollo claims 90%+ email accuracy. Free verification credits help users validate before sending. Mobile numbers are separately credit-priced.'),
        JSON_OBJECT('question', 'What are AI Power-Ups?', 'answer', 'Power-Ups are AI agents that research prospects and personalise emails at scale — running across hundreds or thousands of leads in a sequence.'),
        JSON_OBJECT('question', 'How is Apollo different from ZoomInfo / Outreach?', 'answer', 'Apollo bundles data + sequencer + dialer in one tool with strong free tier. ZoomInfo is data-only; Outreach is sequencer-only. Apollo competes by integrating everything.'),
        JSON_OBJECT('question', 'Is there a free tier?', 'answer', 'Yes — 60 mobile + 120 export credits/mo. Most teams adopt Basic ($59/mo) or Professional ($99/mo) for serious use.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — Apollo API exposes data, sequences, and CRM endpoints.')
      ),
  pros                = JSON_ARRAY('Best-in-class data + sequencer bundle', '275M+ contact database', 'AI Power-Ups for personalisation at scale', 'Strong free tier for early-stage teams', 'Native CRM + LinkedIn integrations', 'Conversation intelligence included on Professional'),
  cons                = JSON_ARRAY('Credit system requires careful monitoring', 'Bigger learning curve than single-purpose tools', 'Data accuracy varies by region', 'UI can feel busy with everything bundled'),
  starting_price      = 59,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 1,
  has_android_app     = 1
WHERE slug = 'apollo-io';

-- clay
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Data enrichment', 'AI research', 'GTM workflows'),
  industries_served   = JSON_ARRAY('Sales', 'Marketing & Advertising', 'B2B Services', 'Agencies', 'SaaS & Software', 'Recruiting', 'Financial Services', 'Operations'),
  use_cases           = JSON_ARRAY('Lead enrichment at scale', 'Account research workflows', 'Custom data column generation', 'Account-based marketing', 'Personalisation at scale', 'AI-powered outreach', 'Sales pipeline data ops', 'GTM agency workflows'),
  target_company_sizes = JSON_ARRAY('Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Spreadsheet-style data ops UI', '75+ data providers (Clearbit, Apollo, ZoomInfo, etc.)', 'Claygent (AI research agent)', 'Custom columns powered by GPT-4 / Claude', 'Conditional waterfall enrichment', 'CRM sync (Salesforce, HubSpot, Outreach)', 'Web scraping primitives', 'API + Webhooks', 'Templates marketplace', 'AI message writer per row'),
  features            = JSON_ARRAY('Spreadsheet-style data ops UI', '75+ data providers (Clearbit, Apollo, ZoomInfo, etc.)', 'Claygent (AI research agent)', 'Custom columns powered by GPT-4 / Claude', 'Conditional waterfall enrichment', 'CRM sync (Salesforce, HubSpot, Outreach)', 'Web scraping primitives', 'API + Webhooks', 'Templates marketplace', 'AI message writer per row'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('100 credits/mo', 'Core enrichment', 'Limited integrations')),
        JSON_OBJECT('name', 'Starter', 'price', 149, 'period', 'month', 'features', JSON_ARRAY('2,000 credits/mo', 'All data providers', 'Claygent enabled')),
        JSON_OBJECT('name', 'Explorer', 'price', 349, 'period', 'month', 'features', JSON_ARRAY('10,000 credits/mo', 'CRM integrations', 'API + webhooks')),
        JSON_OBJECT('name', 'Pro', 'price', 800, 'period', 'month', 'features', JSON_ARRAY('50,000 credits/mo', 'Higher-volume use', 'Priority support')),
        JSON_OBJECT('name', 'Enterprise', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Custom volume', 'SSO + SAML', 'Dedicated CSM'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'Clearbit + ZoomInfo + Apollo', 'website', 'https://www.clay.com', 'description', 'Waterfall enrichment across 75+ data providers.'),
        JSON_OBJECT('name', 'Salesforce + HubSpot', 'website', 'https://www.clay.com', 'description', 'Bi-directional CRM sync.'),
        JSON_OBJECT('name', 'Outreach + Salesloft', 'website', 'https://www.clay.com', 'description', 'Push enriched contacts directly into sequences.'),
        JSON_OBJECT('name', 'OpenAI + Anthropic', 'website', 'https://www.clay.com', 'description', 'Bring-your-own LLM keys or Clay-managed.'),
        JSON_OBJECT('name', 'Clay API + Webhooks', 'website', 'https://docs.clay.com', 'description', 'Programmatic access for custom workflows.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Slack community', 'Help center', 'Dedicated CSM (Pro+)'),
  training_options    = JSON_ARRAY('Clay University', 'YouTube tutorials', 'Templates marketplace', 'Office hours'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY('SOC 2 Type II', 'GDPR'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Clay?', 'answer', 'Clay is a GTM data platform — a spreadsheet-style UI that runs waterfall enrichment across 75+ providers and lets you generate custom data columns using AI.'),
        JSON_OBJECT('question', 'What is Claygent?', 'answer', 'Claygent is Clay''s AI research agent — describe what you need ("find their tech stack from the website") and it researches per-row across hundreds of contacts.'),
        JSON_OBJECT('question', 'How is Clay different from Apollo or ZoomInfo?', 'answer', 'Apollo + ZoomInfo are data providers. Clay aggregates 75+ providers in waterfall + adds AI research on top — much more flexible for custom workflows.'),
        JSON_OBJECT('question', 'Is there a free tier?', 'answer', 'Yes — 100 credits/mo on Free. Most teams adopt Starter ($149/mo) or higher for serious use.'),
        JSON_OBJECT('question', 'Can it write personalised emails?', 'answer', 'Yes — AI message writer generates per-row personalisation using all the enriched fields, ready to push to your SEP.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — Explorer+ plans include Clay API + webhooks for custom workflows.')
      ),
  pros                = JSON_ARRAY('Most flexible GTM data platform on the market', 'Waterfall enrichment across 75+ providers', 'Claygent AI research is genuinely novel', 'Templates marketplace accelerates onboarding', 'Strong community + Clay University', 'CRM + SEP integrations built-in'),
  cons                = JSON_ARRAY('Expensive at higher tiers', 'Steep learning curve for non-power-users', 'Credit system requires careful management', 'Best for agencies + ops teams, less for individual sellers'),
  starting_price      = 149,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'clay';

-- salesforce-einstein
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Salesforce-native AI', 'Einstein Copilot', 'Agentforce'),
  industries_served   = JSON_ARRAY('Sales', 'Customer Support', 'Marketing & Advertising', 'Financial Services', 'Healthcare', 'Retail', 'Manufacturing', 'Public Sector'),
  use_cases           = JSON_ARRAY('Sales Cloud AI assistance', 'Service Cloud agent automation', 'Marketing personalisation', 'Predictive lead scoring', 'Opportunity insights', 'Email + call summarisation', 'Custom AI workflows (Prompt Builder)', 'Multi-agent automation (Agentforce)'),
  target_company_sizes = JSON_ARRAY('Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Einstein Copilot (conversational AI)', 'Agentforce (autonomous AI agents)', 'Einstein Generative AI inside every cloud', 'Prompt Builder + Model Builder', 'Einstein Trust Layer (data privacy)', 'BYO LLM (Anthropic, OpenAI, etc.)', 'Predictive scoring + recommendations', 'Einstein Bots for service', 'Einstein Voice + email automation', 'Data Cloud as AI grounding source'),
  features            = JSON_ARRAY('Einstein Copilot (conversational AI)', 'Agentforce (autonomous AI agents)', 'Einstein Generative AI inside every cloud', 'Prompt Builder + Model Builder', 'Einstein Trust Layer (data privacy)', 'BYO LLM (Anthropic, OpenAI, etc.)', 'Predictive scoring + recommendations', 'Einstein Bots for service', 'Einstein Voice + email automation', 'Data Cloud as AI grounding source'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Einstein 1 Sales Edition', 'price', 500, 'period', 'month', 'features', JSON_ARRAY('Sales Cloud + Einstein bundled', 'Per-user pricing', 'Annual contract')),
        JSON_OBJECT('name', 'Einstein 1 Service Edition', 'price', 500, 'period', 'month', 'features', JSON_ARRAY('Service Cloud + Einstein bundled', 'Per-user pricing', 'Includes Agentforce')),
        JSON_OBJECT('name', 'Agentforce', 'price', 2, 'period', 'usage', 'features', JSON_ARRAY('$2 per agent conversation', 'Volume discounts', 'Outcome-based pricing'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'Salesforce CRM (all clouds)', 'website', 'https://www.salesforce.com', 'description', 'Native to Sales, Service, Marketing, Commerce, and all Salesforce clouds.'),
        JSON_OBJECT('name', 'Data Cloud', 'website', 'https://www.salesforce.com/products/data', 'description', 'AI grounded in your unified customer data.'),
        JSON_OBJECT('name', 'AppExchange', 'website', 'https://appexchange.salesforce.com', 'description', '7,000+ apps with Einstein integrations.'),
        JSON_OBJECT('name', 'Anthropic + OpenAI + Google', 'website', 'https://www.salesforce.com', 'description', 'BYO LLM via Einstein Model Builder.'),
        JSON_OBJECT('name', 'Slack (Salesforce)', 'website', 'https://slack.com', 'description', 'Einstein Copilot inside Slack channels.')
      ),
  support_channels    = JSON_ARRAY('Premier Support', 'Trailhead Academy', 'Dedicated CSM', 'Help docs'),
  training_options    = JSON_ARRAY('Trailhead', 'Webinars', 'Dreamforce sessions', 'Partner training'),
  languages           = JSON_ARRAY('English', 'Spanish', 'French', 'German', '30+ more'),
  compliance          = JSON_ARRAY('SOC 2 Type II', 'HIPAA', 'GDPR', 'ISO 27001', 'FedRAMP'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Einstein?', 'answer', 'Einstein is Salesforce''s AI brand — predictive ML inside every cloud since 2016, plus generative AI features and now Agentforce autonomous agents.'),
        JSON_OBJECT('question', 'What is Agentforce?', 'answer', 'Agentforce is Salesforce''s autonomous AI agent platform — pre-built and customisable AI agents for sales, service, and marketing tasks, with outcome-based pricing.'),
        JSON_OBJECT('question', 'What is the Trust Layer?', 'answer', 'The Einstein Trust Layer enforces data privacy + governance for AI usage — your customer data is not used to train models, and you control PII masking.'),
        JSON_OBJECT('question', 'Can I bring my own LLM?', 'answer', 'Yes — Einstein 1 supports BYO models from Anthropic, OpenAI, Google, and others via Einstein Model Builder.'),
        JSON_OBJECT('question', 'How is it priced?', 'answer', 'Bundled with Sales/Service Cloud Einstein 1 editions ($500/user/mo annual). Agentforce uses outcome-based pricing ($2 per conversation).'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — Einstein features are accessible via Salesforce REST + SOAP APIs and the Einstein Platform Services.')
      ),
  pros                = JSON_ARRAY('Tightest integration with Salesforce data', 'Trust Layer enterprise-grade governance', 'Agentforce is leading the agentic CRM shift', 'BYO LLM flexibility', 'FedRAMP + HIPAA + global compliance', 'Massive partner + Trailhead ecosystem'),
  cons                = JSON_ARRAY('Only useful if you''re on Salesforce', 'Expensive — Einstein 1 Edition starts $500/user/mo', 'Complex licensing across clouds', 'Outcome-based pricing requires modeling spend'),
  starting_price      = 500,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 0,
  has_ios_app         = 1,
  has_android_app     = 1
WHERE slug = 'salesforce-einstein';

-- hubspot-breeze
UPDATE submissions SET
  header_tags         = JSON_ARRAY('HubSpot-native AI', 'Breeze Copilot', 'Breeze Agents'),
  industries_served   = JSON_ARRAY('Marketing & Advertising', 'Sales', 'Customer Support', 'SaaS & Software', 'E-commerce', 'Agencies', 'Education', 'Real Estate'),
  use_cases           = JSON_ARRAY('Marketing content generation', 'Sales email + sequence drafting', 'Customer support automation', 'Knowledge base Q&A', 'Pipeline insights', 'CRM data enrichment', 'Reporting + analytics summarisation', 'AI website builder'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Breeze Copilot (in-CRM assistant)', 'Breeze Agents (Prospecting, Content, Customer)', 'AI content remix', 'Smart CRM auto-enrichment', 'AI-powered chatbot', 'Email content generation', 'Forecasting + deal insights', 'Knowledge base AI search', 'Breeze Intelligence (data enrichment)', 'No-code agent customisation'),
  features            = JSON_ARRAY('Breeze Copilot (in-CRM assistant)', 'Breeze Agents (Prospecting, Content, Customer)', 'AI content remix', 'Smart CRM auto-enrichment', 'AI-powered chatbot', 'Email content generation', 'Forecasting + deal insights', 'Knowledge base AI search', 'Breeze Intelligence (data enrichment)', 'No-code agent customisation'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free CRM', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('Free HubSpot CRM', 'Basic Breeze Copilot', 'Limited AI usage')),
        JSON_OBJECT('name', 'Starter', 'price', 20, 'period', 'month', 'features', JSON_ARRAY('Starter Hub features', 'AI assistance included', 'Per-seat pricing')),
        JSON_OBJECT('name', 'Professional', 'price', 100, 'period', 'month', 'features', JSON_ARRAY('Pro Hub features', 'Breeze Agents available', 'Advanced AI workflows')),
        JSON_OBJECT('name', 'Enterprise', 'price', 150, 'period', 'month', 'features', JSON_ARRAY('Enterprise Hubs', 'All Breeze Agents', 'Custom AI models'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'HubSpot CRM (all hubs)', 'website', 'https://www.hubspot.com', 'description', 'Breeze is native across Marketing, Sales, Service, Content, and Operations Hubs.'),
        JSON_OBJECT('name', 'App Marketplace', 'website', 'https://ecosystem.hubspot.com/marketplace/apps', 'description', '1,500+ apps with Breeze integrations.'),
        JSON_OBJECT('name', 'Gmail + Outlook', 'website', 'https://www.hubspot.com', 'description', 'Breeze Copilot inside your inbox.'),
        JSON_OBJECT('name', 'Salesforce', 'website', 'https://www.hubspot.com', 'description', 'Bi-directional sync for hybrid setups.'),
        JSON_OBJECT('name', 'Slack', 'website', 'https://slack.com', 'description', 'Breeze Copilot in Slack channels.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Phone support (paid)', 'Dedicated CSM (Enterprise)'),
  training_options    = JSON_ARRAY('HubSpot Academy', 'Webinars', 'Inbound conference', 'Certifications'),
  languages           = JSON_ARRAY('English', 'Spanish', 'French', 'German', '6+ more'),
  compliance          = JSON_ARRAY('SOC 2 Type II', 'GDPR', 'ISO 27001'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Breeze?', 'answer', 'Breeze is HubSpot''s AI suite — bundled across all hubs and includes Breeze Copilot (assistant), Breeze Agents (autonomous workers), and Breeze Intelligence (enrichment).'),
        JSON_OBJECT('question', 'What are Breeze Agents?', 'answer', 'Breeze Agents are autonomous AI workers — Prospecting Agent, Content Agent, Customer Agent — each focused on a specific HubSpot workflow.'),
        JSON_OBJECT('question', 'Is Breeze included in HubSpot?', 'answer', 'Yes — Breeze is bundled with HubSpot hub licences. Higher tiers unlock more advanced Breeze Agents and AI workflows.'),
        JSON_OBJECT('question', 'How does Breeze compare to Salesforce Einstein?', 'answer', 'Both are CRM-native AI. Breeze is bundled by default in HubSpot tiers (no separate license); Einstein is sold as a separate edition or per-conversation Agentforce.'),
        JSON_OBJECT('question', 'Can I use my own LLM?', 'answer', 'HubSpot uses Anthropic + OpenAI models behind Breeze. BYO LLM not currently available.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — HubSpot''s extensive APIs cover all data + workflows; Breeze AI features are accessible to API users.')
      ),
  pros                = JSON_ARRAY('Bundled in every HubSpot tier — no extra fee', 'Breeze Agents are easy to enable', 'Tight integration across all hubs', 'Strong free tier for small teams', 'HubSpot Academy training is best in class', 'Strong compliance posture'),
  cons                = JSON_ARRAY('Only useful if you''re on HubSpot', 'Less depth than Salesforce Einstein for enterprise', 'BYO LLM not available', 'Agent customisation more limited than Agentforce'),
  starting_price      = 0,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 1,
  has_android_app     = 1
WHERE slug = 'hubspot-breeze';

-- gong
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Revenue intelligence', 'Conversation analytics', 'Deal insights'),
  industries_served   = JSON_ARRAY('Sales', 'Customer Success', 'SaaS & Software', 'Financial Services', 'Healthcare', 'Manufacturing', 'B2B Services', 'Marketing & Advertising'),
  use_cases           = JSON_ARRAY('Sales call recording + analysis', 'Deal risk scoring', 'Pipeline reviews', 'Coaching + onboarding new reps', 'Forecasting accuracy', 'Competitor mention tracking', 'Customer health monitoring', 'Marketing message testing'),
  target_company_sizes = JSON_ARRAY('Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Call + meeting recording (Zoom, Teams, dialers)', 'AI-powered call transcription + analytics', 'Deal intelligence + forecasting', 'Topic + competitor mention tracking', 'Coaching dashboards', 'Sentiment + talk-ratio analysis', 'Email + Slack analysis', 'Gong Engage (sequencing)', 'Forecasting + deal warnings', 'Smart Trackers (custom keywords)'),
  features            = JSON_ARRAY('Call + meeting recording (Zoom, Teams, dialers)', 'AI-powered call transcription + analytics', 'Deal intelligence + forecasting', 'Topic + competitor mention tracking', 'Coaching dashboards', 'Sentiment + talk-ratio analysis', 'Email + Slack analysis', 'Gong Engage (sequencing)', 'Forecasting + deal warnings', 'Smart Trackers (custom keywords)'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Standard', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Per-seat pricing (typically $100-150/user/mo)', 'Annual contract', 'Platform fee separate')),
        JSON_OBJECT('name', 'Enterprise', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('All add-ons (Engage, Forecast, etc.)', 'SSO + custom security', 'Dedicated CSM'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'Salesforce', 'website', 'https://www.salesforce.com', 'description', 'Deep Salesforce CRM integration.'),
        JSON_OBJECT('name', 'HubSpot', 'website', 'https://www.hubspot.com', 'description', 'Native HubSpot CRM sync.'),
        JSON_OBJECT('name', 'Zoom + Teams + Webex', 'website', 'https://zoom.us', 'description', 'Records and analyses every major meeting platform.'),
        JSON_OBJECT('name', 'Outreach + Salesloft', 'website', 'https://www.gong.io', 'description', 'Analyses email + sequence performance.'),
        JSON_OBJECT('name', 'Slack', 'website', 'https://slack.com', 'description', 'Deal alerts + coaching nudges in Slack.'),
        JSON_OBJECT('name', 'Gong API', 'website', 'https://www.gong.io/api', 'description', 'Programmatic access to calls + insights.')
      ),
  support_channels    = JSON_ARRAY('Dedicated CSM', 'Email support', 'Live chat', 'Premier support (Enterprise)'),
  training_options    = JSON_ARRAY('Gong Labs', 'Webinars', 'Onboarding workshops', 'Certifications'),
  languages           = JSON_ARRAY('English (primary)', '10+ languages supported'),
  compliance          = JSON_ARRAY('SOC 2 Type II', 'GDPR', 'HIPAA-eligible', 'ISO 27001'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Gong?', 'answer', 'Gong is the leading revenue intelligence platform — it records every customer call, transcribes, and surfaces insights about deals, coaching opportunities, and forecast accuracy.'),
        JSON_OBJECT('question', 'How is Gong priced?', 'answer', 'Gong is custom-priced via sales conversation. Typical seats run $100-150/user/mo on annual contracts, with platform fees on top.'),
        JSON_OBJECT('question', 'What is Gong Engage?', 'answer', 'Engage is Gong''s sales engagement add-on — sequences + dialer that''s informed by Gong''s call analytics for personalisation.'),
        JSON_OBJECT('question', 'How is Gong different from Otter / Fireflies?', 'answer', 'Otter / Fireflies are productivity tools for transcripts + notes. Gong is enterprise revenue intelligence — deal risk, pipeline reviews, manager coaching, forecast accuracy.'),
        JSON_OBJECT('question', 'Can Gong forecast my deals?', 'answer', 'Yes — Gong Forecast uses call + email + CRM data to flag at-risk deals and project pipeline accuracy.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — Gong API exposes calls, insights, and deal data for custom integrations.')
      ),
  pros                = JSON_ARRAY('Industry-leading revenue intelligence', 'Deal warnings flag risks early', 'Coaching dashboards for managers', 'Strong forecasting accuracy', 'Enterprise compliance posture', 'Engage add-on rounds out the GTM stack'),
  cons                = JSON_ARRAY('Expensive — enterprise-only pricing', 'Custom contracts require sales process', 'Heavy adoption work to extract full value', 'Overkill for SMB sales teams'),
  starting_price      = NULL,
  starting_price_period = 'custom',
  has_free_trial      = 0,
  has_free_version    = 0,
  has_ios_app         = 1,
  has_android_app     = 1
WHERE slug = 'gong';

-- drift-salesloft
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Conversational marketing', 'Sales engagement', 'Salesloft acquired'),
  industries_served   = JSON_ARRAY('Sales', 'Marketing & Advertising', 'SaaS & Software', 'B2B Services', 'Financial Services', 'Real Estate', 'Education', 'Healthcare'),
  use_cases           = JSON_ARRAY('AI website chatbot', 'Conversational sales pipelines', 'ABM-targeted engagement', 'Inbound qualification', 'Sales sequencing', 'Conversation intelligence', 'Account-based marketing', 'Marketing-to-sales handoffs'),
  target_company_sizes = JSON_ARRAY('Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Drift AI chatbot (conversational marketing)', 'Live chat + video meetings', 'Conversational Marketing Cloud', 'Salesloft Rhythm (signal-based actions)', 'Cadences (multi-channel sequences)', 'Conversation intelligence (formerly Outreach Drift)', 'Forecast + Deals', 'CRM sync (Salesforce, HubSpot)', 'Salesloft Dialer + meetings', 'AI email writer + summary'),
  features            = JSON_ARRAY('Drift AI chatbot (conversational marketing)', 'Live chat + video meetings', 'Conversational Marketing Cloud', 'Salesloft Rhythm (signal-based actions)', 'Cadences (multi-channel sequences)', 'Conversation intelligence (formerly Outreach Drift)', 'Forecast + Deals', 'CRM sync (Salesforce, HubSpot)', 'Salesloft Dialer + meetings', 'AI email writer + summary'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Salesloft Essentials', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Cadences + dialer', 'Per-seat (typically $75-125)', 'Annual contract')),
        JSON_OBJECT('name', 'Salesloft Advanced', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Conversation intelligence', 'Rhythm signals', 'Forecast included')),
        JSON_OBJECT('name', 'Premier', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('All features', 'Deals + forecasting', 'Dedicated CSM'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'Salesforce', 'website', 'https://www.salesforce.com', 'description', 'Deep Salesforce CRM integration.'),
        JSON_OBJECT('name', 'HubSpot', 'website', 'https://www.hubspot.com', 'description', 'Native HubSpot CRM sync.'),
        JSON_OBJECT('name', 'Drift chatbot widget', 'website', 'https://www.drift.com', 'description', 'JavaScript snippet on any website.'),
        JSON_OBJECT('name', 'Gmail + Outlook', 'website', 'https://salesloft.com', 'description', 'Cadence steps + email tracking.'),
        JSON_OBJECT('name', '6sense + Demandbase', 'website', 'https://salesloft.com', 'description', 'ABM intent data integration.'),
        JSON_OBJECT('name', 'Salesloft API', 'website', 'https://developers.salesloft.com', 'description', 'Programmatic access for custom workflows.')
      ),
  support_channels    = JSON_ARRAY('Dedicated CSM', 'Email support', 'Live chat', 'Premier support'),
  training_options    = JSON_ARRAY('Salesloft University', 'Webinars', 'Onboarding workshops', 'Certifications'),
  languages           = JSON_ARRAY('English', '10+ languages supported'),
  compliance          = JSON_ARRAY('SOC 2 Type II', 'GDPR', 'ISO 27001'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'Is Drift still a product?', 'answer', 'Salesloft acquired Drift in February 2024. Drift continues as the conversational marketing arm of the combined Salesloft platform.'),
        JSON_OBJECT('question', 'What is Rhythm?', 'answer', 'Salesloft Rhythm is signal-based prioritisation — surfacing the right action for the right buyer at the right time based on engagement signals.'),
        JSON_OBJECT('question', 'How is Salesloft different from Outreach?', 'answer', 'Salesloft and Outreach are the two leading sales engagement platforms. Salesloft post-Drift owns the conversational marketing layer; Outreach acquired Drift competitor Sense.'),
        JSON_OBJECT('question', 'Is there a free tier?', 'answer', 'No — Salesloft is enterprise-priced via sales conversation. Annual contracts required.'),
        JSON_OBJECT('question', 'Does Drift still have an AI chatbot?', 'answer', 'Yes — Drift''s AI chatbot remains the conversational marketing front door inside Salesloft''s product portfolio.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — Salesloft API covers cadences, calls, emails, and CRM-like data.')
      ),
  pros                = JSON_ARRAY('Industry-leading sales engagement platform', 'Drift adds conversational marketing front-end', 'Rhythm signal-based prioritisation is novel', 'Conversation intelligence built-in', 'Strong Salesforce + HubSpot integrations', 'Enterprise compliance posture'),
  cons                = JSON_ARRAY('Expensive enterprise pricing', 'Drift + Salesloft integration ongoing', 'Heavy adoption work to extract value', 'No mid-market self-serve option'),
  starting_price      = NULL,
  starting_price_period = 'custom',
  has_free_trial      = 0,
  has_free_version    = 0,
  has_ios_app         = 1,
  has_android_app     = 1
WHERE slug = 'drift-salesloft';

-- outreach
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Sales engagement platform', 'Sequences + dialer', 'Conversation AI'),
  industries_served   = JSON_ARRAY('Sales', 'Customer Success', 'SaaS & Software', 'B2B Services', 'Financial Services', 'Manufacturing', 'Healthcare', 'Real Estate'),
  use_cases           = JSON_ARRAY('Multi-channel sales sequences', 'Sales dialer + voicemail drops', 'Pipeline + deal management', 'Email + call analytics', 'Account-based prospecting', 'Coaching + onboarding', 'Forecasting', 'Conversation intelligence'),
  target_company_sizes = JSON_ARRAY('Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Sequences (multi-channel cadences)', 'Outreach Dialer + Voice', 'Conversation Intelligence (Sense, Insights)', 'Outreach Mutual Action Plans', 'Deals + Pipeline AI', 'Smart Account Plan', 'Outreach Kaia AI sales assistant', 'CRM sync (Salesforce, MS Dynamics)', 'Buyer Sentiment + Health Scoring', 'AI-generated email drafts'),
  features            = JSON_ARRAY('Sequences (multi-channel cadences)', 'Outreach Dialer + Voice', 'Conversation Intelligence (Sense, Insights)', 'Outreach Mutual Action Plans', 'Deals + Pipeline AI', 'Smart Account Plan', 'Outreach Kaia AI sales assistant', 'CRM sync (Salesforce, MS Dynamics)', 'Buyer Sentiment + Health Scoring', 'AI-generated email drafts'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Standard', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Per-seat pricing (typically $100-150)', 'Annual contract', 'Sequences + dialer')),
        JSON_OBJECT('name', 'Professional', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Conversation intelligence', 'Deals + forecasting', 'Higher AI limits')),
        JSON_OBJECT('name', 'Enterprise', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('All add-ons', 'SSO + audit', 'Dedicated CSM'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'Salesforce', 'website', 'https://www.salesforce.com', 'description', 'Deep Salesforce CRM integration — Outreach''s primary CRM.'),
        JSON_OBJECT('name', 'Microsoft Dynamics 365', 'website', 'https://dynamics.microsoft.com', 'description', 'Native Dynamics integration for enterprise.'),
        JSON_OBJECT('name', 'Gmail + Outlook', 'website', 'https://www.outreach.io', 'description', 'Native email send + tracking.'),
        JSON_OBJECT('name', 'Slack + Teams', 'website', 'https://slack.com', 'description', 'Notifications + deal alerts.'),
        JSON_OBJECT('name', 'LinkedIn Sales Navigator', 'website', 'https://business.linkedin.com', 'description', 'LinkedIn touches inside sequences.'),
        JSON_OBJECT('name', 'Outreach API', 'website', 'https://api.outreach.io', 'description', 'Programmatic access for custom workflows.')
      ),
  support_channels    = JSON_ARRAY('Dedicated CSM', 'Email support', 'Live chat', 'Premier support'),
  training_options    = JSON_ARRAY('Outreach University', 'Webinars', 'Onboarding workshops', 'Certifications'),
  languages           = JSON_ARRAY('English', '10+ languages supported'),
  compliance          = JSON_ARRAY('SOC 2 Type II', 'GDPR', 'ISO 27001'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Outreach?', 'answer', 'Outreach is a leading sales engagement platform — multi-channel sequences, dialer, conversation intelligence, and deal management — used by enterprise sales orgs.'),
        JSON_OBJECT('question', 'What is Kaia?', 'answer', 'Kaia is Outreach''s AI sales assistant — joins calls, transcribes, surfaces talking points, and generates follow-up emails automatically.'),
        JSON_OBJECT('question', 'How is Outreach different from Salesloft?', 'answer', 'Both are leading sales engagement platforms. Salesloft now bundles Drift (conversational marketing); Outreach has the deal management + Kaia AI tighter.'),
        JSON_OBJECT('question', 'How is Outreach priced?', 'answer', 'Custom enterprise pricing — typically $100-150/user/mo on annual contracts, with feature tier add-ons.'),
        JSON_OBJECT('question', 'Does Outreach work with Microsoft Dynamics?', 'answer', 'Yes — Outreach has first-class Dynamics 365 integration alongside Salesforce.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — Outreach API exposes sequences, prospects, calls, and email data.')
      ),
  pros                = JSON_ARRAY('Industry-leading sales engagement platform', 'Kaia AI assistant is genuinely useful', 'Strong deal + pipeline management', 'First-class Microsoft Dynamics integration', 'Mature conversation intelligence', 'Enterprise compliance posture'),
  cons                = JSON_ARRAY('Expensive enterprise pricing', 'Annual contracts only — no self-serve', 'Steep adoption learning curve', 'Best for large sales orgs (50+ reps)'),
  starting_price      = NULL,
  starting_price_period = 'custom',
  has_free_trial      = 0,
  has_free_version    = 0,
  has_ios_app         = 1,
  has_android_app     = 1
WHERE slug = 'outreach';

-- intercom-fin
UPDATE submissions SET
  header_tags         = JSON_ARRAY('AI customer support', 'Fin AI Agent', 'Pay-per-resolution'),
  industries_served   = JSON_ARRAY('SaaS & Software', 'E-commerce', 'Customer Support', 'Financial Services', 'Education', 'Healthcare', 'Marketing & Advertising', 'Consumer Tech'),
  use_cases           = JSON_ARRAY('AI customer support deflection', 'Help center Q&A grounded in docs', 'Live chat + ticketing', 'Outbound product tours', 'Inbox AI assistant for agents', 'Macros + workflows automation', 'Customer onboarding', 'Multi-channel support (chat, email, WhatsApp)'),
  target_company_sizes = JSON_ARRAY('Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Fin AI Agent (autonomous support)', 'Trained on your help center + chat history', 'Pay-per-resolution pricing ($0.99)', 'Custom guidance + answer steering', 'Multi-language support (45+)', 'Live chat + tickets + email + WhatsApp', 'Fin AI Copilot (agent-assist)', 'Help Center + Workflows', 'Customer Data Platform', 'API + Slack + Outlook integrations'),
  features            = JSON_ARRAY('Fin AI Agent (autonomous support)', 'Trained on your help center + chat history', 'Pay-per-resolution pricing ($0.99)', 'Custom guidance + answer steering', 'Multi-language support (45+)', 'Live chat + tickets + email + WhatsApp', 'Fin AI Copilot (agent-assist)', 'Help Center + Workflows', 'Customer Data Platform', 'API + Slack + Outlook integrations'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Essential', 'price', 29, 'period', 'month', 'features', JSON_ARRAY('Inbox + Help Center', 'Per-seat pricing', 'Email + chat support')),
        JSON_OBJECT('name', 'Advanced', 'price', 85, 'period', 'month', 'features', JSON_ARRAY('Workflows + Reporting', 'Multi-team inbox', 'AI Copilot included')),
        JSON_OBJECT('name', 'Expert', 'price', 132, 'period', 'month', 'features', JSON_ARRAY('Advanced security', 'SSO + audit', 'SLAs')),
        JSON_OBJECT('name', 'Fin AI Agent', 'price', 0.99, 'period', 'usage', 'features', JSON_ARRAY('Pay-per-resolution', 'Volume discounts', 'Outcome-based pricing'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'Salesforce + HubSpot', 'website', 'https://www.intercom.com/integrations', 'description', 'CRM sync for customer context.'),
        JSON_OBJECT('name', 'Slack + Teams', 'website', 'https://slack.com', 'description', 'Notifications + agent-to-agent chat.'),
        JSON_OBJECT('name', 'Shopify', 'website', 'https://www.shopify.com', 'description', 'E-commerce order context for support.'),
        JSON_OBJECT('name', 'WhatsApp + Instagram + SMS', 'website', 'https://www.intercom.com', 'description', 'Multi-channel customer reach.'),
        JSON_OBJECT('name', 'Intercom API', 'website', 'https://developers.intercom.com', 'description', 'Programmatic access to messages + users.'),
        JSON_OBJECT('name', '300+ App Store apps', 'website', 'https://www.intercom.com/app-store', 'description', 'Built-in marketplace of integrations.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Live chat (in-app)', 'Dedicated CSM (Expert)'),
  training_options    = JSON_ARRAY('Intercom Academy', 'Webinars', 'Onboarding workshops', 'Certifications'),
  languages           = JSON_ARRAY('45+ languages'),
  compliance          = JSON_ARRAY('SOC 2 Type II', 'GDPR', 'HIPAA-eligible', 'ISO 27001'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Fin?', 'answer', 'Fin is Intercom''s AI Agent — it autonomously resolves customer support questions using your help center + chat history, charged on a pay-per-resolution basis.'),
        JSON_OBJECT('question', 'How does pay-per-resolution work?', 'answer', '$0.99 per successfully resolved conversation. Definitions of "resolved" are configurable. Volume discounts available.'),
        JSON_OBJECT('question', 'How is Fin different from a chatbot?', 'answer', 'Traditional chatbots run scripted flows. Fin uses GPT-4 reasoning on your knowledge — handles ambiguity, asks clarifying questions, and admits when it doesn''t know.'),
        JSON_OBJECT('question', 'What is Fin Copilot?', 'answer', 'Copilot is the agent-assist layer — drafts replies, summarises tickets, and surfaces relevant articles inside the Intercom inbox.'),
        JSON_OBJECT('question', 'Does Fin work in my language?', 'answer', 'Yes — 45+ languages supported with automatic detection.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — Intercom API covers users, conversations, articles, and AI features for custom workflows.')
      ),
  pros                = JSON_ARRAY('Best AI support deflection on the market', 'Pay-per-resolution aligns vendor + customer', '45+ language support', 'Tight inbox + ticket + chat integration', 'Strong compliance posture', 'Active product roadmap'),
  cons                = JSON_ARRAY('Resolution definitions need careful tuning', 'Inbox per-seat + Fin per-resolution = complex pricing', 'Best ROI only with strong help center docs', 'Expensive at high resolution volumes'),
  starting_price      = 29,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 0,
  has_ios_app         = 1,
  has_android_app     = 1
WHERE slug = 'intercom-fin';

-- ada
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Enterprise AI agent', 'No-code chatbot', 'Multi-language'),
  industries_served   = JSON_ARRAY('Customer Support', 'E-commerce', 'Financial Services', 'Telecom', 'Travel & Hospitality', 'Healthcare', 'Insurance', 'Retail'),
  use_cases           = JSON_ARRAY('Customer support automation', 'Account self-service', 'Order tracking + returns', 'FAQ deflection', 'Identity verification flows', 'Voice agent (phone)', 'Multi-language support', 'Agent-to-agent escalation'),
  target_company_sizes = JSON_ARRAY('Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('AI Agent platform (Ada Reasoning Engine)', 'No-code drag-and-drop builder', '50+ language support', 'Voice + chat + SMS + email channels', 'Backend system integrations (Stripe, Shopify, etc.)', 'Custom guidance + behaviour controls', 'Agent-to-agent handoff', 'Ada Coach (training + optimisation)', 'Analytics + auto-resolution scoring', 'API + SDK + webhooks'),
  features            = JSON_ARRAY('AI Agent platform (Ada Reasoning Engine)', 'No-code drag-and-drop builder', '50+ language support', 'Voice + chat + SMS + email channels', 'Backend system integrations (Stripe, Shopify, etc.)', 'Custom guidance + behaviour controls', 'Agent-to-agent handoff', 'Ada Coach (training + optimisation)', 'Analytics + auto-resolution scoring', 'API + SDK + webhooks'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Generative', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Per-resolution or annual contract', 'AI Reasoning Engine', 'Multi-channel + multi-language', 'Dedicated CSM'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'Salesforce + Zendesk + HubSpot', 'website', 'https://www.ada.cx', 'description', 'CRM + support ticket integration.'),
        JSON_OBJECT('name', 'Shopify + Stripe', 'website', 'https://www.ada.cx', 'description', 'E-commerce + payment context for orders.'),
        JSON_OBJECT('name', 'Slack + Teams', 'website', 'https://slack.com', 'description', 'Agent escalation + notifications.'),
        JSON_OBJECT('name', 'WhatsApp + Messenger + SMS', 'website', 'https://www.ada.cx', 'description', 'Multi-channel deployment.'),
        JSON_OBJECT('name', 'Ada API', 'website', 'https://developers.ada.cx', 'description', 'Programmatic access for custom flows.'),
        JSON_OBJECT('name', 'Twilio (voice)', 'website', 'https://www.twilio.com', 'description', 'Voice channel backbone.')
      ),
  support_channels    = JSON_ARRAY('Dedicated CSM', 'Email support', 'Live chat', 'Premier support'),
  training_options    = JSON_ARRAY('Ada Academy', 'Webinars', 'Onboarding workshops', 'Certifications'),
  languages           = JSON_ARRAY('50+ languages'),
  compliance          = JSON_ARRAY('SOC 2 Type II', 'GDPR', 'HIPAA-eligible', 'ISO 27001'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Ada?', 'answer', 'Ada is an enterprise AI customer service platform — no-code AI agents that handle support inquiries across chat, voice, SMS, email, and messaging in 50+ languages.'),
        JSON_OBJECT('question', 'How is Ada different from Intercom Fin?', 'answer', 'Both deploy AI support agents. Ada is enterprise-only, multi-channel native (voice + chat + SMS), and emphasises custom workflows + backend system integration.'),
        JSON_OBJECT('question', 'Does Ada have voice agents?', 'answer', 'Yes — Ada Voice runs AI phone agents with low-latency voice + interruption handling, built on Ada''s reasoning engine.'),
        JSON_OBJECT('question', 'How is Ada priced?', 'answer', 'Custom enterprise pricing via sales conversation. Typically per-resolution or annual contract with platform fees.'),
        JSON_OBJECT('question', 'Can Ada integrate with my backend?', 'answer', 'Yes — Ada integrates with order systems, payment platforms, identity providers, and any REST API. No-code mapping in the builder.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — Ada API + SDK + webhooks for deep custom integration.')
      ),
  pros                = JSON_ARRAY('Best multi-channel enterprise AI agent platform', '50+ language support is industry-leading', 'Voice + chat + SMS + email in one product', 'Strong backend system integrations', 'Mature for regulated industries', 'No-code builder + custom flows'),
  cons                = JSON_ARRAY('Enterprise-only — no SMB self-serve', 'Custom pricing requires sales conversation', 'Implementation timeline measured in months', 'Less out-of-the-box for new entrants'),
  starting_price      = NULL,
  starting_price_period = 'custom',
  has_free_trial      = 0,
  has_free_version    = 0,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'ada';

-- forethought
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Support AI', 'Solve + Triage + Assist', 'Generative SupportGPT'),
  industries_served   = JSON_ARRAY('Customer Support', 'E-commerce', 'SaaS & Software', 'Financial Services', 'Travel & Hospitality', 'Healthcare', 'Retail', 'Telecom'),
  use_cases           = JSON_ARRAY('Ticket auto-resolution', 'Ticket triage + routing', 'Agent assist (reply suggestions)', 'Knowledge base discovery', 'Sentiment + priority detection', 'Multi-language support', 'Workflow automation', 'Voice of customer analysis'),
  target_company_sizes = JSON_ARRAY('Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Solve (autonomous ticket resolution)', 'Triage (auto-classification + routing)', 'Assist (agent reply suggestions)', 'Discover (analytics + insights)', 'SupportGPT (proprietary fine-tuned model)', 'No-code workflow builder', 'Sentiment + intent detection', 'Multi-language support', 'CRM + helpdesk integrations', 'API + SDK'),
  features            = JSON_ARRAY('Solve (autonomous ticket resolution)', 'Triage (auto-classification + routing)', 'Assist (agent reply suggestions)', 'Discover (analytics + insights)', 'SupportGPT (proprietary fine-tuned model)', 'No-code workflow builder', 'Sentiment + intent detection', 'Multi-language support', 'CRM + helpdesk integrations', 'API + SDK'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Enterprise', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Per-seat or per-resolution', 'Annual contract', 'All Forethought products', 'Dedicated CSM'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'Zendesk', 'website', 'https://www.zendesk.com', 'description', 'Native Zendesk integration — primary helpdesk.'),
        JSON_OBJECT('name', 'Salesforce Service Cloud', 'website', 'https://www.salesforce.com', 'description', 'Native Salesforce support integration.'),
        JSON_OBJECT('name', 'Freshdesk + Kustomer', 'website', 'https://forethought.ai', 'description', 'Helpdesk integrations for mid-market.'),
        JSON_OBJECT('name', 'Slack + Teams', 'website', 'https://slack.com', 'description', 'Internal escalation + notifications.'),
        JSON_OBJECT('name', 'Forethought API', 'website', 'https://docs.forethought.ai', 'description', 'Programmatic access for custom flows.')
      ),
  support_channels    = JSON_ARRAY('Dedicated CSM', 'Email support', 'Live chat', 'Premier support'),
  training_options    = JSON_ARRAY('Forethought University', 'Webinars', 'Onboarding workshops'),
  languages           = JSON_ARRAY('English (primary)', '12+ languages supported'),
  compliance          = JSON_ARRAY('SOC 2 Type II', 'GDPR', 'HIPAA-eligible'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Forethought?', 'answer', 'Forethought is an AI customer support platform — Solve (auto-resolution), Triage (classification + routing), Assist (agent reply suggestions), and Discover (analytics).'),
        JSON_OBJECT('question', 'What is SupportGPT?', 'answer', 'SupportGPT is Forethought''s proprietary LLM fine-tuned on support conversations — grounded in your help center for accurate, brand-safe replies.'),
        JSON_OBJECT('question', 'How is Forethought different from Intercom Fin?', 'answer', 'Both deflect tickets. Forethought is helpdesk-native (Zendesk-first) and includes triage + assist + analytics modules; Fin is Intercom-native with pay-per-resolution.'),
        JSON_OBJECT('question', 'Is Forethought free?', 'answer', 'No — Forethought is enterprise-priced via sales conversation, with per-seat or per-resolution models.'),
        JSON_OBJECT('question', 'Does it work in Zendesk?', 'answer', 'Yes — Zendesk is Forethought''s primary supported helpdesk with deep native integration.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — Forethought API exposes intent + reply suggestions for custom workflows.')
      ),
  pros                = JSON_ARRAY('Solve + Triage + Assist covers the full support funnel', 'Tight Zendesk + Salesforce integration', 'Strong analytics with Discover module', 'SupportGPT model is support-domain optimised', 'Mature for regulated industries', 'Strong compliance posture'),
  cons                = JSON_ARRAY('Enterprise-only — no SMB self-serve', 'Best ROI requires strong existing helpdesk data', 'Multi-module pricing complex', 'Implementation timeline measured in months'),
  starting_price      = NULL,
  starting_price_period = 'custom',
  has_free_trial      = 0,
  has_free_version    = 0,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'forethought';

-- tidio-lyro
UPDATE submissions SET
  header_tags         = JSON_ARRAY('SMB chatbot', 'Lyro AI', 'E-commerce'),
  industries_served   = JSON_ARRAY('E-commerce', 'Customer Support', 'Marketing & Advertising', 'SaaS & Software', 'Travel & Hospitality', 'Real Estate', 'Education', 'Retail'),
  use_cases           = JSON_ARRAY('Website chatbot', 'E-commerce support automation', 'Live chat + tickets', 'Cart recovery + product Q&A', 'Lead capture forms', 'Multi-channel inbox (chat, email, FB, IG)', 'FAQ deflection', 'Order tracking automation'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies'),
  key_features        = JSON_ARRAY('Lyro AI Agent (powered by Claude)', 'Trained on your FAQs + product catalog', 'Live chat + ticketing', 'Multi-channel inbox', 'Visual chatbot builder', 'Shopify + WooCommerce + WordPress', 'AI Reply Assistant for agents', 'Cart recovery flows', 'Analytics + reporting', '180+ languages'),
  features            = JSON_ARRAY('Lyro AI Agent (powered by Claude)', 'Trained on your FAQs + product catalog', 'Live chat + ticketing', 'Multi-channel inbox', 'Visual chatbot builder', 'Shopify + WooCommerce + WordPress', 'AI Reply Assistant for agents', 'Cart recovery flows', 'Analytics + reporting', '180+ languages'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('50 livechat conversations/mo', '100 chatbot triggers/mo', 'Limited Lyro')),
        JSON_OBJECT('name', 'Starter', 'price', 29, 'period', 'month', 'features', JSON_ARRAY('100 livechat convos', 'Tickets included', 'Analytics')),
        JSON_OBJECT('name', 'Growth', 'price', 59, 'period', 'month', 'features', JSON_ARRAY('Higher limits', 'Permissions + roles', 'Custom branding')),
        JSON_OBJECT('name', 'Plus', 'price', 749, 'period', 'month', 'features', JSON_ARRAY('Unlimited conversations', 'Priority support', 'Custom integrations')),
        JSON_OBJECT('name', 'Lyro AI add-on', 'price', NULL, 'period', 'usage', 'features', JSON_ARRAY('50 free conversations/mo', 'Then $0.50 per AI conversation', 'Volume discounts'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'Shopify', 'website', 'https://www.shopify.com', 'description', 'Native Shopify app — product catalog sync.'),
        JSON_OBJECT('name', 'WordPress + WooCommerce', 'website', 'https://wordpress.org', 'description', 'Plugin for WordPress sites.'),
        JSON_OBJECT('name', 'Wix + Squarespace', 'website', 'https://www.tidio.com/integrations', 'description', 'Website builder integrations.'),
        JSON_OBJECT('name', 'Messenger + Instagram', 'website', 'https://www.tidio.com', 'description', 'Multi-channel inbox.'),
        JSON_OBJECT('name', 'Mailchimp + HubSpot', 'website', 'https://www.tidio.com/integrations', 'description', 'Marketing automation sync.'),
        JSON_OBJECT('name', 'Zapier', 'website', 'https://zapier.com', 'description', 'Bridge to 6,000+ apps.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Live chat', 'Phone (paid plans)'),
  training_options    = JSON_ARRAY('Tidio Academy', 'YouTube tutorials', 'Webinars', 'Templates library'),
  languages           = JSON_ARRAY('180+ languages'),
  compliance          = JSON_ARRAY('SOC 2 Type II', 'GDPR'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Lyro?', 'answer', 'Lyro is Tidio''s AI chatbot — powered by Claude (Anthropic), trained on your FAQ + product catalog to autonomously resolve customer questions.'),
        JSON_OBJECT('question', 'How is Tidio + Lyro priced?', 'answer', 'Tidio (live chat + tickets) starts free with paid tiers from $29/mo. Lyro AI is an add-on with 50 free AI conversations/mo, then ~$0.50 each.'),
        JSON_OBJECT('question', 'Is Tidio good for Shopify?', 'answer', 'Yes — Tidio has a top-rated Shopify app with product catalog sync and order context for Lyro.'),
        JSON_OBJECT('question', 'How is Tidio different from Intercom?', 'answer', 'Tidio focuses on SMB e-commerce + small business. Intercom targets mid-market and enterprise. Tidio is more affordable + e-commerce-tuned.'),
        JSON_OBJECT('question', 'Does Lyro support my language?', 'answer', 'Yes — Lyro supports 180+ languages, automatically detected from customer messages.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — Tidio API + webhook integrations for custom flows.')
      ),
  pros                = JSON_ARRAY('Best AI chatbot + live chat bundle for SMB', 'Free tier is genuinely usable', 'Shopify + WooCommerce native integrations', 'Lyro powered by Claude (Anthropic)', '180+ language support', 'Multi-channel inbox bundled'),
  cons                = JSON_ARRAY('Lyro AI add-on cost separate from base plan', 'Less depth than Intercom for mid-market', 'Plus tier expensive jump from Growth', 'Some flows still require manual builder work'),
  starting_price      = 29,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 1,
  has_android_app     = 1
WHERE slug = 'tidio-lyro';


-- ============================================================
-- GROUP: IMAGE UTILITIES & ENHANCEMENT (6 listings)
-- ============================================================

-- photoroom
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Background removal', 'Product photos', 'E-commerce AI'),
  industries_served   = JSON_ARRAY('E-commerce', 'Photography', 'Marketing & Advertising', 'Design Agencies', 'Retail', 'Creator Economy', 'Real Estate', 'Publishing'),
  use_cases           = JSON_ARRAY('Background removal', 'Product photography on white', 'AI shadows + reflections', 'Batch processing thousands of SKUs', 'Studio-quality product shots from phone', 'Mockups + marketing visuals', 'Catalogue prep', 'Social media e-commerce posts'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('AI background remover (best-in-class)', 'AI Shadows + Reflections', 'Magic Studio (AI scenes)', 'Batch processor (bulk edits)', 'AI Backgrounds (generate scene)', 'Photoroom API', 'Templates for e-commerce platforms', 'Brand kit + color presets', 'Object removal + retouch', 'Native iOS + Android + Web'),
  features            = JSON_ARRAY('AI background remover (best-in-class)', 'AI Shadows + Reflections', 'Magic Studio (AI scenes)', 'Batch processor (bulk edits)', 'AI Backgrounds (generate scene)', 'Photoroom API', 'Templates for e-commerce platforms', 'Brand kit + color presets', 'Object removal + retouch', 'Native iOS + Android + Web'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('Background removal', 'Watermarked exports', 'Standard templates')),
        JSON_OBJECT('name', 'Pro', 'price', 9.99, 'period', 'month', 'features', JSON_ARRAY('No watermark', 'HD exports', 'Magic Studio AI', 'Batch processor (limited)')),
        JSON_OBJECT('name', 'Business', 'price', 19.99, 'period', 'month', 'features', JSON_ARRAY('Pro features per user', 'Brand kit + templates', 'Centralised billing')),
        JSON_OBJECT('name', 'API', 'price', NULL, 'period', 'usage', 'features', JSON_ARRAY('Pay-per-image API', 'Volume discounts', 'Async + sync endpoints'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'iOS app', 'website', 'https://apps.apple.com', 'description', 'Native iOS — the #1 photo editing app for e-commerce.'),
        JSON_OBJECT('name', 'Android app', 'website', 'https://play.google.com', 'description', 'Native Android with full feature parity.'),
        JSON_OBJECT('name', 'photoroom.com web', 'website', 'https://www.photoroom.com', 'description', 'Full-featured browser editor.'),
        JSON_OBJECT('name', 'Photoroom API', 'website', 'https://www.photoroom.com/api', 'description', 'Programmatic background removal + scene generation.'),
        JSON_OBJECT('name', 'Shopify + Amazon', 'website', 'https://www.photoroom.com', 'description', 'Built-in templates for marketplaces.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'In-app chat (Pro+)', 'Community forum'),
  training_options    = JSON_ARRAY('Help articles', 'YouTube tutorials', 'Templates library', 'Photoroom Academy'),
  languages           = JSON_ARRAY('English', 'Spanish', 'French', 'German', '12+ more'),
  compliance          = JSON_ARRAY('GDPR'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Photoroom?', 'answer', 'Photoroom is an AI photo editor focused on background removal and product photography — a phone-friendly studio for e-commerce sellers.'),
        JSON_OBJECT('question', 'How is background removal quality?', 'answer', 'Photoroom is widely considered best-in-class for hair, fur, and complex edges — its AI is trained specifically on product + portrait imagery.'),
        JSON_OBJECT('question', 'What is Magic Studio?', 'answer', 'Magic Studio is Photoroom''s suite of AI generators — backgrounds, shadows, scenes — that turn a raw cut-out into a studio-quality product shot.'),
        JSON_OBJECT('question', 'Can I process bulk images?', 'answer', 'Yes — Pro+ tiers include batch processor for hundreds of images. Business + API plans handle thousands.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — Photoroom API exposes background removal, scene generation, and batch endpoints. Pay-per-image with volume discounts.'),
        JSON_OBJECT('question', 'Does it work for portraits?', 'answer', 'Yes — Photoroom handles portraits well, including LinkedIn-style headshot background swaps.')
      ),
  pros                = JSON_ARRAY('Best-in-class AI background removal', 'Mobile-first — magic from your phone', 'Magic Studio scene generation is genuinely useful', 'Strong batch processor for e-commerce', 'Photoroom API for developers', 'Generous free tier for individuals'),
  cons                = JSON_ARRAY('Watermark on free exports', 'Magic Studio AI gen credits limited per tier', 'No desktop apps (web-only)', 'Pro for full daily use'),
  starting_price      = 9.99,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 1,
  has_android_app     = 1
WHERE slug = 'photoroom';

-- topaz-labs
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Photo + video upscaling', 'AI noise reduction', 'Pro photo enhancement'),
  industries_served   = JSON_ARRAY('Photography', 'Film & Production', 'Marketing & Advertising', 'Publishing', 'Real Estate', 'Game Development', 'Wedding Photography', 'Stock Imagery'),
  use_cases           = JSON_ARRAY('Image upscaling (Gigapixel)', 'Photo denoising + sharpening', 'Video upscaling to 4K / 8K', 'Old / archival footage restoration', 'Frame interpolation (slow motion)', 'Stabilisation', 'Wedding + portrait retouching', 'VFX prep'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Topaz Photo AI (denoise + sharpen + upscale)', 'Topaz Video AI (4K/8K upscale, slow-mo, stabilisation)', 'Gigapixel AI (image upscaling)', 'Sharpen AI / DeNoise AI / Gigapixel as standalone apps', 'Local processing (no upload required)', 'Photoshop + Lightroom plugins', 'Batch processing', 'GPU-accelerated', 'One-time license + annual update plan', 'Free trial of all apps'),
  features            = JSON_ARRAY('Topaz Photo AI (denoise + sharpen + upscale)', 'Topaz Video AI (4K/8K upscale, slow-mo, stabilisation)', 'Gigapixel AI (image upscaling)', 'Sharpen AI / DeNoise AI / Gigapixel as standalone apps', 'Local processing (no upload required)', 'Photoshop + Lightroom plugins', 'Batch processing', 'GPU-accelerated', 'One-time license + annual update plan', 'Free trial of all apps'),
  pricing_model       = 'one-time',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Topaz Photo AI', 'price', 199, 'period', 'one-time', 'features', JSON_ARRAY('Denoise + sharpen + upscale', '1 year of updates', 'Photoshop + Lightroom plugins')),
        JSON_OBJECT('name', 'Topaz Video AI', 'price', 299, 'period', 'one-time', 'features', JSON_ARRAY('Video upscaling + slow-mo', 'Stabilisation + restoration', '1 year of updates')),
        JSON_OBJECT('name', 'Gigapixel AI', 'price', 99, 'period', 'one-time', 'features', JSON_ARRAY('Standalone image upscaler', '1 year of updates', 'Batch processing')),
        JSON_OBJECT('name', 'Update Plan', 'price', 79, 'period', 'year', 'features', JSON_ARRAY('Continued model + app updates after first year', 'Per product'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'Adobe Photoshop', 'website', 'https://www.adobe.com/products/photoshop.html', 'description', 'Native Photoshop plugin.'),
        JSON_OBJECT('name', 'Adobe Lightroom', 'website', 'https://www.adobe.com/products/photoshop-lightroom.html', 'description', 'Native Lightroom Classic plugin.'),
        JSON_OBJECT('name', 'Capture One', 'website', 'https://www.captureone.com', 'description', 'Plugin for Capture One pros.'),
        JSON_OBJECT('name', 'Standalone Mac + Windows apps', 'website', 'https://www.topazlabs.com', 'description', 'Native desktop apps for serious workflows.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Community forum', 'YouTube channel'),
  training_options    = JSON_ARRAY('Documentation', 'YouTube tutorials', 'Sample images', 'Webinars'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY(),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Topaz Labs?', 'answer', 'Topaz Labs makes Photo AI + Video AI + Gigapixel — desktop apps for AI-powered upscaling, denoising, sharpening, and video restoration.'),
        JSON_OBJECT('question', 'Does it process locally?', 'answer', 'Yes — all Topaz apps process on your local GPU. No cloud upload, full privacy.'),
        JSON_OBJECT('question', 'How does the licence work?', 'answer', 'One-time purchase grants you the app + 1 year of updates. Optional Update Plan ($79/year) extends update access; the app keeps working forever even without updates.'),
        JSON_OBJECT('question', 'How is Photo AI different from Gigapixel?', 'answer', 'Photo AI is the bundled flagship (denoise + sharpen + upscale). Gigapixel is the upscaling-only legacy product, kept for users who want just that.'),
        JSON_OBJECT('question', 'Does Video AI handle 4K → 8K?', 'answer', 'Yes — Video AI upscales to 8K and adds slow-motion, frame interpolation, and stabilisation.'),
        JSON_OBJECT('question', 'Is there a Mac version?', 'answer', 'Yes — full Mac + Windows desktop apps with Apple Silicon support.')
      ),
  pros                = JSON_ARRAY('Industry standard for AI photo / video enhancement', 'Local processing — full privacy + no upload limits', 'One-time purchase model (no subscription)', 'Photoshop + Lightroom plugins for pro workflows', 'Strong batch processing performance', 'Best-in-class denoising'),
  cons                = JSON_ARRAY('No subscription — higher upfront cost', 'GPU-heavy — slow on low-spec machines', 'Three separate products to choose from', 'Annual update plans cost extra'),
  starting_price      = 99,
  starting_price_period = 'one-time',
  has_free_trial      = 1,
  has_free_version    = 0,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'topaz-labs';

-- remove-bg-kaleido-ai
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Background removal API', 'Kaleido AI', 'Canva-owned'),
  industries_served   = JSON_ARRAY('E-commerce', 'Photography', 'Marketing & Advertising', 'Design Agencies', 'Real Estate', 'Publishing', 'Retail', 'Creator Economy'),
  use_cases           = JSON_ARRAY('Background removal at scale', 'Product photo prep', 'Profile photo backgrounds', 'Catalog image batch processing', 'Photoshop / Figma plugin removal', 'Bulk processing via API', 'Marketing image prep', 'Designer workflow acceleration'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('AI background removal (web + API)', 'Preview free, pay for HD downloads', 'Photoshop + Figma + GIMP plugins', 'Bulk web editor', 'API with sync + async endpoints', 'Volume credit packages', 'Sub-second processing time', 'PNG with transparent background', 'Foreground + alpha matte', '100M+ image precision'),
  features            = JSON_ARRAY('AI background removal (web + API)', 'Preview free, pay for HD downloads', 'Photoshop + Figma + GIMP plugins', 'Bulk web editor', 'API with sync + async endpoints', 'Volume credit packages', 'Sub-second processing time', 'PNG with transparent background', 'Foreground + alpha matte', '100M+ image precision'),
  pricing_model       = 'usage',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free preview', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('Unlimited low-res previews', 'Web + plugin access', 'API trial credits')),
        JSON_OBJECT('name', 'Credit packs', 'price', 9, 'period', 'one-time', 'features', JSON_ARRAY('40 credits for $9 (HD images)', '200 credits for $39', 'Larger packs to 100,000 credits')),
        JSON_OBJECT('name', 'Subscription', 'price', 9, 'period', 'month', 'features', JSON_ARRAY('40 images/mo from $9', '200/mo from $39', '1000/mo from $99', 'Cheaper per image vs packs')),
        JSON_OBJECT('name', 'Enterprise', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Volume API pricing', 'On-prem available', 'Custom SLAs'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'remove.bg API', 'website', 'https://www.remove.bg/api', 'description', 'Best-known background removal API.'),
        JSON_OBJECT('name', 'Photoshop plugin', 'website', 'https://www.remove.bg/photoshop', 'description', 'Native Photoshop extension.'),
        JSON_OBJECT('name', 'Figma plugin', 'website', 'https://www.remove.bg/figma', 'description', 'Remove backgrounds inside Figma.'),
        JSON_OBJECT('name', 'GIMP + Sketch + Affinity', 'website', 'https://www.remove.bg', 'description', 'Plugins for popular design tools.'),
        JSON_OBJECT('name', 'Zapier', 'website', 'https://zapier.com', 'description', 'Bridge to 6,000+ apps.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Community forum'),
  training_options    = JSON_ARRAY('API documentation', 'Sample code', 'Tutorials'),
  languages           = JSON_ARRAY('English', '15+ languages on UI'),
  compliance          = JSON_ARRAY('GDPR'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'Is remove.bg owned by Canva?', 'answer', 'Yes — Kaleido AI (remove.bg + Unscreen) was acquired by Canva in 2021. remove.bg continues as a standalone product.'),
        JSON_OBJECT('question', 'How is pricing?', 'answer', 'Preview is free. HD downloads cost credits — buy as packs ($9 for 40 credits) or subscribe for cheaper rates.'),
        JSON_OBJECT('question', 'Does remove.bg have an API?', 'answer', 'Yes — the remove.bg API is one of the most widely-used background removal APIs in production, with sync + async endpoints.'),
        JSON_OBJECT('question', 'How does it compare to Photoroom?', 'answer', 'remove.bg is API-first and simpler — best for developers + designers. Photoroom is product-first with scenes + studio features beyond just background removal.'),
        JSON_OBJECT('question', 'What about hair + fur edges?', 'answer', 'remove.bg handles fine details well — it''s built on years of model iteration. Photoroom is competitive on this front too.'),
        JSON_OBJECT('question', 'Can I use it commercially?', 'answer', 'Yes — all paid downloads grant commercial use rights.')
      ),
  pros                = JSON_ARRAY('Best-known background removal API', 'Sub-second processing', 'Strong plugin ecosystem (Photoshop, Figma, etc.)', 'Generous free preview tier', 'Canva backing = product stability', 'Flexible pricing (packs + subs)'),
  cons                = JSON_ARRAY('Credit / pack pricing confusing for newcomers', 'No bundled scene generation (unlike Photoroom)', 'Watermark / low-res on free tier', 'Pricing more complex than competitors'),
  starting_price      = 9,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 1,
  has_android_app     = 1
WHERE slug = 'remove-bg-kaleido-ai';

-- picsart
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Photo + video editor', 'AI tools', 'Social creators'),
  industries_served   = JSON_ARRAY('Creator Economy', 'Marketing & Advertising', 'E-commerce', 'Social Media', 'Photography', 'Design Agencies', 'Consumer Tech', 'Hobbyists'),
  use_cases           = JSON_ARRAY('Social media photo editing', 'AI image generation', 'Background remover + replace', 'Video editing + reels', 'Product photo enhancement', 'Sticker + collage creation', 'Selfie retouching', 'Bulk image processing'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('AI image generator (text-to-image)', 'AI background remover + replace', 'AI photo enhancer + upscaler', 'AI avatar generator', 'AI sketch / cartoon styles', 'Video editor with AI', 'Sticker maker + collage', 'Picsart API + SDK for developers', 'Templates library', 'Marketplace of community content'),
  features            = JSON_ARRAY('AI image generator (text-to-image)', 'AI background remover + replace', 'AI photo enhancer + upscaler', 'AI avatar generator', 'AI sketch / cartoon styles', 'Video editor with AI', 'Sticker maker + collage', 'Picsart API + SDK for developers', 'Templates library', 'Marketplace of community content'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('Basic editing', 'Limited AI tools', 'Watermarked outputs')),
        JSON_OBJECT('name', 'Plus', 'price', 5, 'period', 'month', 'features', JSON_ARRAY('All AI tools', 'No watermarks', 'HD exports')),
        JSON_OBJECT('name', 'Pro', 'price', 7, 'period', 'month', 'features', JSON_ARRAY('Higher AI limits', 'Brand kit', 'Premium templates')),
        JSON_OBJECT('name', 'Business', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Team workspaces', 'API access', 'SSO + admin'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'iOS app', 'website', 'https://apps.apple.com', 'description', 'Native iOS — most-downloaded photo app on App Store.'),
        JSON_OBJECT('name', 'Android app', 'website', 'https://play.google.com', 'description', 'Native Android with full features.'),
        JSON_OBJECT('name', 'picsart.com web', 'website', 'https://picsart.com', 'description', 'Browser editor for desktop.'),
        JSON_OBJECT('name', 'Picsart API', 'website', 'https://picsart.io', 'description', 'Developer API for image effects + AI.'),
        JSON_OBJECT('name', 'Shopify', 'website', 'https://www.shopify.com', 'description', 'Picsart for Shopify product photos.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'In-app chat', 'Community forum'),
  training_options    = JSON_ARRAY('Picsart Academy', 'YouTube tutorials', 'Templates gallery', 'Community challenges'),
  languages           = JSON_ARRAY('30+ languages'),
  compliance          = JSON_ARRAY('SOC 2 (in progress)', 'GDPR'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Picsart?', 'answer', 'Picsart is one of the most-used photo + video editing apps in the world — bundles AI tools (gen, upscale, removal) with traditional editing and social-friendly stickers/collages.'),
        JSON_OBJECT('question', 'Is Picsart free?', 'answer', 'Yes — Free tier with basic editing + limited AI. Plus ($5/mo) and Pro ($7/mo) unlock full AI tools and remove watermarks.'),
        JSON_OBJECT('question', 'How is Picsart different from Photoroom?', 'answer', 'Photoroom is e-commerce + product-focused. Picsart is broader — photo editing, video, AI gen, stickers, collages — for creators + social.'),
        JSON_OBJECT('question', 'Does Picsart have an API?', 'answer', 'Yes — Picsart API offers programmatic access to editing + AI features for developers.'),
        JSON_OBJECT('question', 'Can I sell content created with Picsart?', 'answer', 'Yes — paid plans grant commercial usage rights for AI-generated and edited content.'),
        JSON_OBJECT('question', 'Is the AI gen safe for commercial use?', 'answer', 'Picsart''s AI image generator is bundled with commercial licence on paid tiers.')
      ),
  pros                = JSON_ARRAY('Broadest AI photo + video toolkit in one app', '#1 Photo App on iOS in many regions', 'Generous free tier', 'Lowest paid tier price in the category ($5/mo)', 'Strong API for developers', '30+ language UI support'),
  cons                = JSON_ARRAY('Quality varies vs specialised tools', 'Free tier has watermarks', 'UI can feel cluttered with everything bundled', 'API pricing separate from app subscription'),
  starting_price      = 5,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 1,
  has_android_app     = 1
WHERE slug = 'picsart';

-- cleanup-pictures
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Object removal', 'AI retouch', 'Photo cleanup'),
  industries_served   = JSON_ARRAY('Photography', 'Real Estate', 'E-commerce', 'Marketing & Advertising', 'Travel & Hospitality', 'Personal Productivity', 'Wedding Photography', 'Hobbyists'),
  use_cases           = JSON_ARRAY('Remove unwanted objects from photos', 'Erase tourists from travel pics', 'Clean up real estate photos', 'Remove watermarks (own photos)', 'Erase blemishes + clutter', 'Wedding photo touch-up', 'Product photo cleanup', 'Old photo restoration'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies'),
  key_features        = JSON_ARRAY('Brush over objects → AI removes', 'Built on LaMa inpainting model', 'HD output (paid)', 'Free unlimited use at low res', 'Pro subscription unlocks HD', 'Web-only (no install)', 'Works on any photo', 'Fast — sub-second results', 'Mobile-friendly UI', 'No login for free tier'),
  features            = JSON_ARRAY('Brush over objects → AI removes', 'Built on LaMa inpainting model', 'HD output (paid)', 'Free unlimited use at low res', 'Pro subscription unlocks HD', 'Web-only (no install)', 'Works on any photo', 'Fast — sub-second results', 'Mobile-friendly UI', 'No login for free tier'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('Unlimited use', 'Output capped at 720p', 'No login required')),
        JSON_OBJECT('name', 'Pro', 'price', 5, 'period', 'month', 'features', JSON_ARRAY('HD output (full resolution)', 'Higher quality engine', 'Cleanup API access', 'Priority processing'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'cleanup.pictures web', 'website', 'https://cleanup.pictures', 'description', 'Single-purpose web tool — no install.'),
        JSON_OBJECT('name', 'Cleanup API', 'website', 'https://cleanup.pictures/api', 'description', 'API for programmatic object removal.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center'),
  training_options    = JSON_ARRAY('Tutorials', 'Sample images'),
  languages           = JSON_ARRAY('English', 'Multilingual UI'),
  compliance          = JSON_ARRAY('GDPR'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Cleanup.pictures?', 'answer', 'Cleanup.pictures is a single-purpose web tool that removes unwanted objects from photos — brush over the object, AI inpaints the background.'),
        JSON_OBJECT('question', 'How does it work?', 'answer', 'Cleanup.pictures runs the open-source LaMa inpainting model (Samsung Research) in production — one of the strongest open inpainting algorithms.'),
        JSON_OBJECT('question', 'Is it free?', 'answer', 'Yes — Free is unlimited at 720p resolution. Pro ($5/mo) unlocks full HD output and the higher-quality engine.'),
        JSON_OBJECT('question', 'Is my photo private?', 'answer', 'Yes — Cleanup.pictures does not store uploaded photos. Free service uses no login.'),
        JSON_OBJECT('question', 'How is it different from Photoshop''s remove tool?', 'answer', 'Photoshop''s tools are powerful but require the full Photoshop app. Cleanup.pictures is free, instant, and works in any browser.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — Cleanup API (Pro tier) for programmatic object removal in your own apps.')
      ),
  pros                = JSON_ARRAY('Best free single-purpose object remover', 'Instant browser use — no install or login', 'LaMa model is genuinely strong', 'Sub-second results', 'Affordable Pro for HD output', 'Cleanup API for developers'),
  cons                = JSON_ARRAY('Free tier capped at 720p', 'Single-purpose — no broader editing', 'Free tier sees ads / promo', 'API priced separately from web Pro'),
  starting_price      = 5,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'cleanup-pictures';

-- lensa-ai
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Selfie magic', 'Photo retouch', 'AI portraits'),
  industries_served   = JSON_ARRAY('Consumer Tech', 'Social Media', 'Creator Economy', 'Photography', 'Hobbyists', 'Personal Productivity', 'Dating Apps', 'Online Identity'),
  use_cases           = JSON_ARRAY('Selfie retouching', 'AI portrait generation (Magic Avatars)', 'Background blur + replace', 'Face + skin smoothing', 'Eye color + makeup AI', 'Profile picture creation', 'Old photo restoration', 'Travel + lifestyle photo enhancement'),
  target_company_sizes = JSON_ARRAY('Freelancers'),
  key_features        = JSON_ARRAY('Magic Avatars (AI portrait gen)', 'Face retouch + skin smoothing', 'Background blur / replace', 'Eye + makeup + lip AI', 'Auto-corrections', 'Old photo restoration', 'Pet portraits + Magic Avatars Pets', 'iOS + Android apps', 'Pre-set styles + filters', 'Video portrait mode'),
  features            = JSON_ARRAY('Magic Avatars (AI portrait gen)', 'Face retouch + skin smoothing', 'Background blur / replace', 'Eye + makeup + lip AI', 'Auto-corrections', 'Old photo restoration', 'Pet portraits + Magic Avatars Pets', 'iOS + Android apps', 'Pre-set styles + filters', 'Video portrait mode'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free trial', 'price', 0, 'period', 'one-time', 'features', JSON_ARRAY('7-day trial of Premium', 'All features unlocked', 'Mobile-only')),
        JSON_OBJECT('name', 'Premium Yearly', 'price', 39.99, 'period', 'year', 'features', JSON_ARRAY('All retouch features', 'Magic Avatars credits', 'No watermarks')),
        JSON_OBJECT('name', 'Magic Avatars (one-off)', 'price', 3.99, 'period', 'one-time', 'features', JSON_ARRAY('50 AI portraits per pack', 'Available without subscription', 'Various style packs'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'iOS app', 'website', 'https://apps.apple.com', 'description', 'Primary platform — Lensa is mobile-first.'),
        JSON_OBJECT('name', 'Android app', 'website', 'https://play.google.com', 'description', 'Native Android with feature parity.'),
        JSON_OBJECT('name', 'Prisma Labs', 'website', 'https://prisma-ai.com', 'description', 'Parent company of Lensa + Prisma.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'In-app feedback'),
  training_options    = JSON_ARRAY('Help articles', 'Style examples', 'YouTube tutorials'),
  languages           = JSON_ARRAY('English', '15+ languages'),
  compliance          = JSON_ARRAY('GDPR'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Lensa?', 'answer', 'Lensa is a mobile photo editor from Prisma Labs — best known for Magic Avatars (AI-generated portraits from your selfies) and one-tap selfie retouching.'),
        JSON_OBJECT('question', 'What are Magic Avatars?', 'answer', 'Magic Avatars are AI-generated portrait packs created from 10-20 selfies you upload. 50 portraits in various styles cost $3.99-7.99 as one-off, or included with Premium.'),
        JSON_OBJECT('question', 'Is Lensa free?', 'answer', 'Lensa offers a free 7-day trial. Beyond that, Premium ($39.99/year) is required for retouch features. Magic Avatars sold as separate packs.'),
        JSON_OBJECT('question', 'How is my photo data handled?', 'answer', 'Lensa''s privacy policy states photos uploaded for Magic Avatars are deleted after model training. Standard retouch is processed locally on-device.'),
        JSON_OBJECT('question', 'How is Lensa different from FaceApp?', 'answer', 'Both apply AI to selfies. Lensa adds Magic Avatars (multi-style portrait packs) and stronger retouch tools; FaceApp focuses on age/gender transformations.'),
        JSON_OBJECT('question', 'Is there a desktop version?', 'answer', 'No — Lensa is iOS + Android only.')
      ),
  pros                = JSON_ARRAY('Magic Avatars went viral — best portrait gen on mobile', 'One-tap selfie retouching that looks natural', 'Affordable Premium yearly subscription', 'Strong style variety in Magic Avatars', 'Privacy-friendly local processing for retouch', 'Pet portraits add fun value'),
  cons                = JSON_ARRAY('Mobile-only — no desktop or web', 'Magic Avatars cost extra even on Premium', 'Some artistic styles can over-stylise faces', 'Annual subscription only — no monthly'),
  starting_price      = 39.99,
  starting_price_period = 'year',
  has_free_trial      = 1,
  has_free_version    = 0,
  has_ios_app         = 1,
  has_android_app     = 1
WHERE slug = 'lensa-ai';


-- ============================================================
-- GROUP: MUSIC GENERATION (4 listings)
-- ============================================================

-- aiva
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Symphonic AI', 'Composer', 'Classical + cinematic'),
  industries_served   = JSON_ARRAY('Film & Production', 'Game Development', 'Advertising', 'Content Creators', 'Composers', 'Education', 'Podcasting', 'Marketing'),
  use_cases           = JSON_ARRAY('Cinematic film scores', 'Game soundtracks', 'Ad music', 'Classical-style compositions', 'Custom-style composition', 'Editing in built-in DAW', 'Exporting stems for production', 'Personal music creation'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies'),
  key_features        = JSON_ARRAY('Compose from style preset (rock, jazz, classical, etc.)', 'Compose from chord progression', 'Compose from influence (your own audio reference)', 'Edit in built-in DAW (notes-level)', 'Multi-format export (MP3, WAV, MIDI, MusicXML, stems)', 'Custom Style training', 'Up to 5.5 minute tracks', 'Commercial-use licensing', 'AIVA API for partners', 'Composer accreditation flexibility'),
  features            = JSON_ARRAY('Compose from style preset (rock, jazz, classical, etc.)', 'Compose from chord progression', 'Compose from influence (your own audio reference)', 'Edit in built-in DAW (notes-level)', 'Multi-format export (MP3, WAV, MIDI, MusicXML, stems)', 'Custom Style training', 'Up to 5.5 minute tracks', 'Commercial-use licensing', 'AIVA API for partners', 'Composer accreditation flexibility'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('3 downloads/mo', 'MP3 only', 'AIVA credited as composer', 'Personal use')),
        JSON_OBJECT('name', 'Standard', 'price', 15, 'period', 'month', 'features', JSON_ARRAY('15 downloads/mo', 'MP3 + WAV', 'Commercial use (monetised content)', 'Up to 3 min tracks')),
        JSON_OBJECT('name', 'Pro', 'price', 49, 'period', 'month', 'features', JSON_ARRAY('300 downloads/mo', 'All formats (MIDI, MusicXML, stems)', 'Up to 5:30 tracks', 'Full ownership + copyright'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'aiva.ai web', 'website', 'https://www.aiva.ai', 'description', 'Primary composer interface.'),
        JSON_OBJECT('name', 'AIVA API', 'website', 'https://www.aiva.ai/business', 'description', 'Partner API for integrating AIVA into your product.'),
        JSON_OBJECT('name', 'MIDI export', 'website', 'https://www.aiva.ai', 'description', 'Export to any DAW (Logic, Ableton, FL Studio, etc.).'),
        JSON_OBJECT('name', 'MusicXML', 'website', 'https://www.aiva.ai', 'description', 'Export to notation software (Sibelius, MuseScore, etc.).')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Discord community'),
  training_options    = JSON_ARRAY('YouTube tutorials', 'Documentation', 'Sample tracks', 'Community examples'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY('GDPR'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is AIVA?', 'answer', 'AIVA is an AI composer focused on cinematic, symphonic, and classical music — known for its multi-format export (MIDI, stems, MusicXML) and DAW-editable output.'),
        JSON_OBJECT('question', 'Can I own the music I create?', 'answer', 'Yes — Pro plan grants full copyright ownership. Standard grants commercial use rights. Free plan keeps AIVA credited as the composer.'),
        JSON_OBJECT('question', 'Does it export stems?', 'answer', 'Yes — Pro tier exports individual instrument stems for further mixing in your DAW.'),
        JSON_OBJECT('question', 'How is AIVA different from Suno / Udio?', 'answer', 'Suno + Udio focus on song generation (vocals + production). AIVA focuses on instrumental, score-style composition with editable MIDI + stems for film/game composers.'),
        JSON_OBJECT('question', 'Can I edit the notes?', 'answer', 'Yes — AIVA''s built-in DAW lets you edit notes, change instruments, and re-export.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — AIVA Business API for partner integrations.')
      ),
  pros                = JSON_ARRAY('Best AI tool for cinematic + classical composition', 'Multi-format export including stems + MIDI', 'Editable in built-in DAW + your favourite tool', 'Full copyright ownership on Pro', 'Custom Style training for unique sound', 'European GDPR-native'),
  cons                = JSON_ARRAY('Niche for film/game composers — not for vocals', 'Quality varies by style', 'Pro tier required for full export formats', 'Smaller community than Suno / Udio'),
  starting_price      = 15,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'aiva';

-- soundraw
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Royalty-free music', 'Creator-tuned', 'Customisable AI tracks'),
  industries_served   = JSON_ARRAY('Content Creators', 'YouTubers', 'Podcasting', 'Film & Production', 'Marketing & Advertising', 'Game Development', 'Education', 'Social Media'),
  use_cases           = JSON_ARRAY('YouTube background music', 'Podcast intros + transitions', 'Social media reel music', 'Marketing video soundtracks', 'Twitch streaming music', 'Film + ad background', 'Game ambient music', 'Educational video music'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Generate by mood + genre + length', 'Edit AI track length + structure', 'Customise instruments + energy', 'Royalty-free for paid users', 'Unlimited downloads (paid)', 'Stems export (Artist + Business)', 'Browser-only — no install', 'Templates per platform (YouTube, TikTok, etc.)', 'Library of 1000s of generated samples', 'API for partners (Business)'),
  features            = JSON_ARRAY('Generate by mood + genre + length', 'Edit AI track length + structure', 'Customise instruments + energy', 'Royalty-free for paid users', 'Unlimited downloads (paid)', 'Stems export (Artist + Business)', 'Browser-only — no install', 'Templates per platform (YouTube, TikTok, etc.)', 'Library of 1000s of generated samples', 'API for partners (Business)'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('Unlimited generation', 'No download allowed', 'Preview before paying')),
        JSON_OBJECT('name', 'Creator', 'price', 16.99, 'period', 'month', 'features', JSON_ARRAY('Unlimited downloads', 'Royalty-free licence', 'YouTube + Twitch + podcast OK', 'MP3 + WAV')),
        JSON_OBJECT('name', 'Artist', 'price', 26.99, 'period', 'month', 'features', JSON_ARRAY('Creator features + stems', 'TV / film / ad licensing', 'Higher commercial scope')),
        JSON_OBJECT('name', 'Business', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Multi-seat team', 'API access', 'Custom licensing'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'soundraw.io web', 'website', 'https://soundraw.io', 'description', 'Browser-based music generator.'),
        JSON_OBJECT('name', 'Adobe Premiere Pro', 'website', 'https://www.adobe.com/products/premiere.html', 'description', 'Soundraw plugin for video editors.'),
        JSON_OBJECT('name', 'DaVinci Resolve', 'website', 'https://www.blackmagicdesign.com/products/davinciresolve', 'description', 'Native DaVinci Resolve integration.'),
        JSON_OBJECT('name', 'Soundraw API', 'website', 'https://soundraw.io/business', 'description', 'Business API for partner integrations.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'In-app chat'),
  training_options    = JSON_ARRAY('Help articles', 'YouTube tutorials', 'Templates library'),
  languages           = JSON_ARRAY('English', 'Japanese', 'Spanish', 'French'),
  compliance          = JSON_ARRAY('GDPR'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Soundraw?', 'answer', 'Soundraw is an AI music generator focused on creators — generate royalty-free background music for YouTube, podcasts, social, and films, fully customisable per track.'),
        JSON_OBJECT('question', 'Is the music really royalty-free?', 'answer', 'Yes — paid plans grant royalty-free licensing including YouTube Content ID safety, Twitch monetisation, and podcast use.'),
        JSON_OBJECT('question', 'How is it different from Suno / Udio?', 'answer', 'Suno + Udio focus on song generation (vocals + production). Soundraw focuses on creator-friendly instrumental tracks with structure customisation + clear licensing.'),
        JSON_OBJECT('question', 'Can I edit the AI tracks?', 'answer', 'Yes — adjust length, energy, intensity, and instruments per section to match your video pacing.'),
        JSON_OBJECT('question', 'Do I get stems?', 'answer', 'Artist tier and above export individual stems for further mixing.'),
        JSON_OBJECT('question', 'Is there an API?', 'answer', 'Yes — Business tier includes API access for partners building music-powered apps.')
      ),
  pros                = JSON_ARRAY('Best AI music for content creators', 'Unlimited downloads on paid plans', 'Clear royalty-free licensing (YouTube + Twitch + podcast OK)', 'Track structure customisation per section', 'Adobe Premiere + DaVinci plugins', 'Stems on Artist tier'),
  cons                = JSON_ARRAY('No vocals — instrumental only', 'Free tier offers preview but no download', 'Per-section editing has learning curve', 'Style options narrower than song-gen tools'),
  starting_price      = 16.99,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 0,
  has_android_app     = 0
WHERE slug = 'soundraw';

-- boomy
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Make + release songs', 'Streaming royalties', 'Beginner-friendly'),
  industries_served   = JSON_ARRAY('Hobbyist Musicians', 'Content Creators', 'Aspiring Artists', 'Education', 'Podcasting', 'Independent Music', 'Streamers', 'Bedroom Producers'),
  use_cases           = JSON_ARRAY('Quick AI song creation', 'Release tracks to streaming services', 'Beginner music making', 'Personal music creation', 'Background tracks for video', 'Practice + experiment with genres', 'Sample creation', 'Educational music exploration'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses'),
  key_features        = JSON_ARRAY('One-click AI song generation', 'Edit tempo + key + instruments', 'Release to Spotify / Apple Music / 40+ DSPs', 'Earn streaming royalties from your AI music', 'Genre + style picker', 'Mobile + web apps', 'Free unlimited creation', 'Boomy library + remix community', 'Templates for podcasts + reels', 'Add vocals + record yourself'),
  features            = JSON_ARRAY('One-click AI song generation', 'Edit tempo + key + instruments', 'Release to Spotify / Apple Music / 40+ DSPs', 'Earn streaming royalties from your AI music', 'Genre + style picker', 'Mobile + web apps', 'Free unlimited creation', 'Boomy library + remix community', 'Templates for podcasts + reels', 'Add vocals + record yourself'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('25 saves', 'Limited downloads', 'Limited releases')),
        JSON_OBJECT('name', 'Creator', 'price', 9.99, 'period', 'month', 'features', JSON_ARRAY('500 saves', '100 releases/year', 'MP3 downloads', 'Royalty earnings')),
        JSON_OBJECT('name', 'Pro', 'price', 29.99, 'period', 'month', 'features', JSON_ARRAY('Unlimited saves + releases', 'WAV downloads', 'Stems', 'Priority support'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'boomy.com web', 'website', 'https://boomy.com', 'description', 'Primary music creation interface.'),
        JSON_OBJECT('name', 'iOS app', 'website', 'https://apps.apple.com', 'description', 'Native iOS for quick creation.'),
        JSON_OBJECT('name', 'Android app', 'website', 'https://play.google.com', 'description', 'Native Android app.'),
        JSON_OBJECT('name', 'Spotify + Apple Music + Amazon Music', 'website', 'https://boomy.com', 'description', 'Direct release to 40+ streaming DSPs.'),
        JSON_OBJECT('name', 'TikTok + Instagram + YouTube', 'website', 'https://boomy.com', 'description', 'Social-friendly licensing.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Discord community'),
  training_options    = JSON_ARRAY('Tutorials', 'YouTube channel', 'Community examples'),
  languages           = JSON_ARRAY('English'),
  compliance          = JSON_ARRAY('GDPR'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Boomy?', 'answer', 'Boomy is an AI music app focused on beginners — generate songs in seconds, customise, and release to Spotify + 40+ streaming services to earn royalties.'),
        JSON_OBJECT('question', 'Can I really earn money on Spotify?', 'answer', 'Yes — Boomy distributes your AI-generated music to DSPs and shares streaming royalties. Note that some platforms have restricted AI-only releases at times.'),
        JSON_OBJECT('question', 'How is Boomy different from Suno?', 'answer', 'Both generate songs from prompts. Boomy emphasises beginner UX + direct DSP distribution for royalties. Suno emphasises song quality + creative exploration.'),
        JSON_OBJECT('question', 'Do I own the music I make?', 'answer', 'Yes — paid plans grant ownership rights including royalty earnings from streaming.'),
        JSON_OBJECT('question', 'Can I add my voice?', 'answer', 'Yes — Boomy lets you record vocals over generated tracks for a hybrid AI + human song.'),
        JSON_OBJECT('question', 'Is there a free tier?', 'answer', 'Yes — Free includes 25 saves + limited downloads. Creator ($9.99/mo) and Pro ($29.99/mo) unlock more.')
      ),
  pros                = JSON_ARRAY('Easiest entry point for AI music creation', 'Direct distribution to Spotify + 40 DSPs', 'Royalty sharing — earn from your AI music', 'Generous free tier', 'Mobile + web apps polished', 'Community remix culture'),
  cons                = JSON_ARRAY('AI-only releases get scrutiny on some DSPs', 'Track quality less polished than Suno/Udio', 'Royalty rates modest for AI-generated music', 'Less editable than DAW-style tools'),
  starting_price      = 9.99,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 1,
  has_android_app     = 1
WHERE slug = 'boomy';

-- mubert
UPDATE submissions SET
  header_tags         = JSON_ARRAY('Generative music API', 'Royalty-free', 'Apps + streaming'),
  industries_served   = JSON_ARRAY('Content Creators', 'Game Development', 'Marketing & Advertising', 'Apps & Products', 'Fitness Apps', 'Meditation Apps', 'Brand Stores', 'Film & Production'),
  use_cases           = JSON_ARRAY('Royalty-free background music for videos', 'Real-time generative music for apps', 'Brand music streams (retail / fitness)', 'Game soundtracks', 'Meditation + study music', 'Podcast intros', 'API-integrated music in products', 'Custom-mood music for marketing'),
  target_company_sizes = JSON_ARRAY('Freelancers', 'Small businesses', 'Midsize companies', 'Enterprises'),
  key_features        = JSON_ARRAY('Text-to-music (Mubert Render)', 'Real-time streaming radio (Mubert Play)', 'Genre + mood + duration controls', 'Mubert API + SDK for apps', 'Brand customisation (Mubert for Studios)', 'Mubert for Apps (in-product music)', 'Stems for paid plans', 'Royalty-free licensing', 'iOS + Android + Web', 'Generative tags (relaxing, focus, etc.)'),
  features            = JSON_ARRAY('Text-to-music (Mubert Render)', 'Real-time streaming radio (Mubert Play)', 'Genre + mood + duration controls', 'Mubert API + SDK for apps', 'Brand customisation (Mubert for Studios)', 'Mubert for Apps (in-product music)', 'Stems for paid plans', 'Royalty-free licensing', 'iOS + Android + Web', 'Generative tags (relaxing, focus, etc.)'),
  pricing_model       = 'subscription',
  pricing_tiers       = JSON_ARRAY(

        JSON_OBJECT('name', 'Free', 'price', 0, 'period', 'month', 'features', JSON_ARRAY('25 tracks/mo', 'Watermarked downloads', 'Personal use only')),
        JSON_OBJECT('name', 'Creator', 'price', 14, 'period', 'month', 'features', JSON_ARRAY('500 generations/mo', 'Royalty-free for content', 'No watermarks', 'MP3 + WAV')),
        JSON_OBJECT('name', 'Pro', 'price', 29, 'period', 'month', 'features', JSON_ARRAY('Unlimited tracks', 'Stems export', 'Commercial film + ads licensing', 'Higher quality')),
        JSON_OBJECT('name', 'Business / API', 'price', NULL, 'period', 'custom', 'features', JSON_ARRAY('Mubert API + SDK', 'Real-time generative music in apps', 'Custom branding', 'Volume pricing'))
      ),
  integrations        = JSON_ARRAY(

        JSON_OBJECT('name', 'Mubert API', 'website', 'https://mubert.com/business', 'description', 'Developer API for generative music in apps + products.'),
        JSON_OBJECT('name', 'Mubert iOS app', 'website', 'https://apps.apple.com', 'description', 'Generative music radio app.'),
        JSON_OBJECT('name', 'Mubert Android app', 'website', 'https://play.google.com', 'description', 'Native Android app.'),
        JSON_OBJECT('name', 'Adobe + Final Cut', 'website', 'https://mubert.com', 'description', 'Plugins for major video editors.'),
        JSON_OBJECT('name', 'Mubert Studio', 'website', 'https://mubert.com', 'description', 'Brand music for retail + fitness + venues.')
      ),
  support_channels    = JSON_ARRAY('Email support', 'Help center', 'Live chat (Business)'),
  training_options    = JSON_ARRAY('API documentation', 'Sample code', 'YouTube tutorials', 'Templates'),
  languages           = JSON_ARRAY('English', 'Spanish', 'Russian', '8+ more'),
  compliance          = JSON_ARRAY('GDPR'),
  faqs                = JSON_ARRAY(

        JSON_OBJECT('question', 'What is Mubert?', 'answer', 'Mubert is a generative music platform — text-to-music for creators (Mubert Render), real-time generative radio (Mubert Play), and an API for embedding music in apps.'),
        JSON_OBJECT('question', 'How is Mubert different from Soundraw / Boomy?', 'answer', 'Soundraw + Boomy are creator-first products. Mubert leans into the API + real-time generative music for apps (fitness, meditation, game soundtracks) alongside its creator products.'),
        JSON_OBJECT('question', 'Is the music royalty-free?', 'answer', 'Yes — paid plans grant royalty-free licensing for content. Higher tiers extend to film + ad + commercial use.'),
        JSON_OBJECT('question', 'What is Mubert Play?', 'answer', 'Mubert Play is a streaming radio of always-different generative music — great for focus, study, sleep, meditation, etc.'),
        JSON_OBJECT('question', 'Does Mubert have an API?', 'answer', 'Yes — Mubert Business API + SDK lets apps generate music dynamically based on user state or content.'),
        JSON_OBJECT('question', 'Can I export stems?', 'answer', 'Pro tier exports individual stems for further mixing.')
      ),
  pros                = JSON_ARRAY('Strongest API + SDK for embedded generative music', 'Mubert Play streaming radio is uniquely useful', 'Adobe + Final Cut plugins for video editors', 'Wide use case range (content + apps + brand)', 'Stems on Pro tier', 'Royalty-free licensing on paid plans'),
  cons                = JSON_ARRAY('Three product layers (Render, Play, API) confuses some', 'Free tier watermark + personal-use only', 'Quality varies vs song-gen tools', 'Custom branding requires Business contract'),
  starting_price      = 14,
  starting_price_period = 'month',
  has_free_trial      = 1,
  has_free_version    = 1,
  has_ios_app         = 1,
  has_android_app     = 1
WHERE slug = 'mubert';
