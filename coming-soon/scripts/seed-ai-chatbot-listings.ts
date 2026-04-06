/**
 * Seed 5 real AI Assistants & Chatbots listings — direct DB insert
 * Run: npx tsx scripts/seed-ai-chatbot-listings.ts
 */

const API_BASE = 'http://localhost:3099'

const listings = [
  {
    companyName: 'ChatGPT by OpenAI',
    contactName: 'OpenAI Team',
    email: 'support@openai.com',
    country: 'United States',
    city: 'San Francisco',
    state: 'California',
    tagline: 'AI assistant for writing, analysis, coding, math, and creative tasks',
    description: 'ChatGPT is a conversational AI assistant built by OpenAI that can help with writing, brainstorming, coding, data analysis, learning, and productivity. Powered by GPT-4o and GPT-4.5, it understands context, follows complex instructions, and generates human-quality responses across virtually any domain. Over 200 million weekly active users rely on ChatGPT for everything from drafting emails to debugging code to summarizing research papers. Available as a web app, mobile app, desktop app, and API — making it one of the most versatile AI assistants on the market.',
    website: 'https://chat.openai.com',
    categorySlug: 'ai-assistants-chatbots',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/512px-ChatGPT_logo.svg.png',
    screenshots: ['https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/ChatGPT_screenshot.png/800px-ChatGPT_screenshot.png'],
    features: ['Natural language conversations', 'Code generation and debugging', 'Document analysis and summarization', 'Image generation with DALL-E', 'Web browsing and real-time search', 'Data analysis with file uploads', 'Custom GPTs and plugin ecosystem', 'Voice conversations', 'Multi-modal input (text, images, files)', 'API access for developers'],
    integrations: ['Slack', 'Zapier', 'Microsoft Teams', 'Google Workspace', 'Notion', 'Salesforce', 'GitHub', 'VS Code', 'Apple Shortcuts', 'REST API'],
    pricingModel: 'freemium',
    pricingTiers: [{ name: 'Free', price: '$0', period: 'forever' }, { name: 'Plus', price: '$20', period: 'month' }, { name: 'Pro', price: '$200', period: 'month' }, { name: 'Team', price: '$25/seat', period: 'month' }, { name: 'Enterprise', price: 'Custom', period: 'annual' }],
    founded: 2015, employees: '4500+', funding: '$13.3B+ total funding', hqLocation: 'San Francisco, CA, USA',
    linkedin: 'https://www.linkedin.com/company/openai', twitter: 'https://x.com/OpenAI',
    faqs: [{ question: 'Is ChatGPT free to use?', answer: 'Yes, ChatGPT has a free tier with access to GPT-4o mini. Paid plans unlock GPT-4o, GPT-4.5, higher usage limits, and advanced features like image generation and data analysis.' }, { question: 'What can ChatGPT do for businesses?', answer: 'ChatGPT helps businesses with content creation, customer support automation, code generation, data analysis, research, and building custom AI assistants via the GPT API.' }, { question: 'How does ChatGPT compare to Google Gemini?', answer: 'ChatGPT generally excels at creative writing, coding, and complex reasoning. Gemini has stronger integration with Google services. Both are competitive for general-purpose AI assistance.' }],
    plan: '1',
    paypalOrderId: 'SEED-REAL-LISTING',
  },
  {
    companyName: 'Intercom',
    contactName: 'Intercom Sales',
    email: 'sales@intercom.com',
    country: 'United States',
    city: 'San Francisco',
    state: 'California',
    tagline: 'AI-first customer service platform with Fin AI Agent',
    description: "Intercom is an AI-first customer service platform that combines a powerful AI agent (Fin), help desk, and proactive messaging into one unified workspace. Fin AI Agent resolves up to 50% of support conversations instantly using your existing help center content — no training required. For the conversations that need a human, Intercom's shared inbox brings together chat, email, phone, and social into a single view with AI-powered suggestions, macros, and workflows. Used by over 25,000 businesses including Shopify, Amazon, and Microsoft.",
    website: 'https://www.intercom.com',
    categorySlug: 'ai-assistants-chatbots',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Intercom_logo.svg/512px-Intercom_logo.svg.png',
    screenshots: [],
    features: ['Fin AI Agent (auto-resolves 50% of queries)', 'Shared inbox (chat, email, phone, social)', 'Customizable Messenger widget', 'Help center and knowledge base', 'Workflow automation builder', 'Proactive messaging and tours', 'Real-time visitor tracking', 'Custom bots with branching logic', 'Reporting and CSAT dashboards', 'Multi-language support (45+ languages)'],
    integrations: ['Salesforce', 'Slack', 'HubSpot', 'Shopify', 'Stripe', 'Jira', 'GitHub', 'Zendesk', 'Segment', 'Zapier'],
    pricingModel: 'per-seat',
    pricingTiers: [{ name: 'Essential', price: '$29/seat', period: 'month' }, { name: 'Advanced', price: '$85/seat', period: 'month' }, { name: 'Expert', price: '$132/seat', period: 'month' }],
    founded: 2011, employees: '1800+', funding: '$240M+ total funding', hqLocation: 'San Francisco, CA, USA',
    linkedin: 'https://www.linkedin.com/company/intercom', twitter: 'https://x.com/intercom',
    faqs: [{ question: 'What is Fin AI Agent?', answer: "Fin is Intercom's AI-powered agent that automatically resolves customer questions using your help center content. It handles up to 50% of conversations without human intervention." }, { question: 'How much does Intercom cost?', answer: 'Plans start at $29/seat/month for Essential. Fin AI resolutions are billed separately at $0.99 per resolution. Most mid-size teams spend $200-500/month total.' }, { question: 'Can Intercom replace Zendesk?', answer: 'Yes — many companies switch from Zendesk to Intercom for its modern UI, built-in AI agent, and unified messaging approach.' }],
    plan: '1',
    paypalOrderId: 'SEED-REAL-LISTING',
  },
  {
    companyName: 'Tidio',
    contactName: 'Tidio Sales',
    email: 'support@tidio.com',
    country: 'United States',
    city: 'San Francisco',
    state: 'California',
    tagline: 'Live chat and AI chatbot platform for SMBs and e-commerce',
    description: "Tidio is a customer service platform built for small and mid-size businesses, combining live chat, AI chatbots (Lyro), and a visual automation builder (Flows) in one tool. Lyro, Tidio's AI assistant, learns from your FAQ content and resolves up to 70% of routine customer questions without human involvement. Particularly popular among Shopify and WooCommerce store owners, with over 300,000 businesses using the platform. Setup takes under 5 minutes.",
    website: 'https://www.tidio.com',
    categorySlug: 'ai-assistants-chatbots',
    logoUrl: 'https://tidio.com/wp-content/uploads/2024/08/tidio-icon.svg',
    screenshots: [],
    features: ['Lyro AI chatbot (learns from FAQs)', 'Visual Flows automation builder', 'Live chat with canned responses', 'Shopify and WooCommerce integration', 'Visitor tracking and analytics', 'Multi-channel (web, email, Messenger, Instagram)', 'Customizable chat widget', 'Ticketing system', 'Chatbot templates library (35+)', 'Mobile app for on-the-go support'],
    integrations: ['Shopify', 'WooCommerce', 'WordPress', 'Wix', 'BigCommerce', 'Squarespace', 'Mailchimp', 'HubSpot', 'Google Analytics', 'Zapier'],
    pricingModel: 'freemium',
    pricingTiers: [{ name: 'Free', price: '$0', period: 'forever' }, { name: 'Starter', price: '$29', period: 'month' }, { name: 'Growth', price: '$59', period: 'month' }, { name: 'Tidio+', price: '$749', period: 'month' }, { name: 'Lyro AI', price: '$39', period: 'month (add-on)' }],
    founded: 2013, employees: '180+', funding: '$25M Series B', hqLocation: 'San Francisco, CA & Szczecin, Poland',
    linkedin: 'https://www.linkedin.com/company/tidio-ltd', twitter: 'https://x.com/tidaborr',
    faqs: [{ question: 'Is Tidio free?', answer: 'Yes, Tidio has a generous free plan with live chat for up to 50 conversations/month. Lyro AI and Flows automation are available as paid add-ons starting at $29/month.' }, { question: 'How does Lyro AI work?', answer: 'Lyro learns from your FAQ content and knowledge base. You upload your support docs, and Lyro generates answers based on that content. No training or coding required.' }, { question: 'Is Tidio good for Shopify stores?', answer: 'Tidio is one of the most popular chat solutions for Shopify with a native integration. It can pull order data, recommend products in chat, and automate post-purchase flows.' }],
    plan: '1',
    paypalOrderId: 'SEED-REAL-LISTING',
  },
  {
    companyName: 'Ada',
    contactName: 'Ada Sales Team',
    email: 'sales@ada.cx',
    country: 'Canada',
    city: 'Toronto',
    state: 'Ontario',
    tagline: 'Enterprise AI agent that resolves 70%+ of customer service conversations',
    description: "Ada is an AI-powered customer service platform purpose-built for enterprise teams handling high conversation volumes. Unlike chatbots that follow scripted decision trees, Ada's AI agent reasons through customer problems using your knowledge base, back-end systems, and business rules — then takes action to resolve issues end-to-end. Companies like Meta, Shopify, Square, and Verizon use Ada to automate 70%+ of customer service conversations while maintaining high CSAT scores. Supports 50+ languages out of the box.",
    website: 'https://www.ada.cx',
    categorySlug: 'ai-assistants-chatbots',
    logoUrl: 'https://ada.cx/wp-content/uploads/2024/01/ada-logo.svg',
    screenshots: [],
    features: ['Autonomous AI agent (not scripted bots)', 'Reasoning engine for multi-step resolution', 'Back-end system integrations (CRM, billing, orders)', 'Automated actions (refunds, account updates, escalations)', 'Knowledge base ingestion and learning', '50+ language support', 'Analytics and resolution quality scoring', 'Handoff to human agents with full context', 'A/B testing for conversation flows', 'Enterprise security (SOC 2, GDPR, HIPAA)'],
    integrations: ['Salesforce', 'Zendesk', 'Shopify', 'Oracle', 'SAP', 'Twilio', 'Contentful', 'Snowflake', 'Segment', 'Custom APIs'],
    pricingModel: 'custom-pricing',
    pricingTiers: [{ name: 'Growth', price: 'Custom', period: 'annual' }, { name: 'Enterprise', price: 'Custom', period: 'annual' }],
    founded: 2016, employees: '485+', funding: '$200M total ($130M Series C at $1.2B valuation)', hqLocation: 'Toronto, Ontario, Canada',
    linkedin: 'https://www.linkedin.com/company/ada-support', twitter: 'https://x.com/ada_cx',
    faqs: [{ question: 'How is Ada different from regular chatbots?', answer: 'Ada uses an AI reasoning engine — not scripted decision trees. It understands context, connects to your backend systems, and takes real actions like processing refunds or updating orders.' }, { question: "What is Ada's pricing?", answer: "Ada doesn't publish pricing publicly. It targets mid-market to enterprise. Expect $1,000-10,000+/month depending on volume and integrations." }, { question: 'What languages does Ada support?', answer: "Ada supports 50+ languages out of the box with automatic translation. The AI agent detects the customer's language and responds natively without separate training." }],
    plan: '1',
    paypalOrderId: 'SEED-REAL-LISTING',
  },
  {
    companyName: 'Botpress',
    contactName: 'Botpress Team',
    email: 'hello@botpress.com',
    country: 'Canada',
    city: 'Quebec City',
    state: 'Quebec',
    tagline: 'Open-source AI chatbot builder with visual flow designer and LLM integration',
    description: "Botpress is an open-source conversational AI platform that lets developers and non-technical teams build sophisticated AI chatbots using a visual flow editor combined with LLM-powered autonomous nodes. The platform blends structured logic (decision trees, conditions, API calls) with generative AI — so your bot can follow strict business rules when needed and use natural language understanding when the conversation goes off-script. With nearly 1 million free users and 3,000 paying customers, Botpress has become one of the most popular open-source chatbot platforms.",
    website: 'https://botpress.com',
    categorySlug: 'ai-assistants-chatbots',
    logoUrl: 'https://avatars.githubusercontent.com/u/23510677',
    screenshots: [],
    features: ['Visual flow builder (drag-and-drop)', 'Autonomous AI nodes (LLM-powered)', 'Knowledge base ingestion (websites, docs, PDFs)', 'Multi-channel deployment (web, WhatsApp, Slack, etc.)', 'Custom code execution within flows', 'Human handoff with context transfer', 'Built-in analytics and conversation logs', 'Tables for structured data management', 'Webhook and API integrations', 'Self-hosted or cloud deployment options'],
    integrations: ['WhatsApp', 'Slack', 'Instagram', 'Facebook Messenger', 'Telegram', 'Microsoft Teams', 'Zendesk', 'Salesforce', 'Zapier', 'REST API / Webhooks'],
    pricingModel: 'freemium',
    pricingTiers: [{ name: 'Free', price: '$0', period: 'forever' }, { name: 'Plus', price: '$79', period: 'month' }, { name: 'Team', price: '$495', period: 'month' }, { name: 'Enterprise', price: 'Custom', period: 'annual' }],
    founded: 2017, employees: '60+', funding: '$40M total funding', hqLocation: 'Quebec City, Quebec, Canada',
    linkedin: 'https://www.linkedin.com/company/botpress', twitter: 'https://x.com/getbotpress',
    faqs: [{ question: 'Is Botpress really open source?', answer: 'Yes, Botpress core is open source under MIT license. You can self-host it for free. The cloud version adds managed infrastructure and analytics at paid tiers.' }, { question: 'Do I need coding skills to use Botpress?', answer: 'No — the visual flow builder is no-code. Developers can add custom JavaScript/TypeScript actions within flows for advanced logic.' }, { question: 'How does Botpress compare to Dialogflow?', answer: 'Botpress is more flexible and open-source, with better LLM integration. Dialogflow is tightly coupled to Google Cloud. Botpress gives you more control.' }],
    plan: '1',
    paypalOrderId: 'SEED-REAL-LISTING',
  },
]

async function seedListings() {
  console.log('Seeding 5 AI Assistants & Chatbots listings...\n')

  for (let i = 0; i < listings.length; i++) {
    const listing = listings[i]
    try {
      const res = await fetch(`${API_BASE}/api/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-For': `10.0.0.${100 + i}`,
        },
        body: JSON.stringify(listing),
      })

      const data = await res.json()

      if (data.ok) {
        console.log(`  ✓ ${listing.companyName} → slug: ${data.slug}`)
      } else {
        console.log(`  ✗ ${listing.companyName} → ${data.error || JSON.stringify(data)}`)
      }
    } catch (err) {
      console.log(`  ✗ ${listing.companyName} → ${err}`)
    }

    await new Promise(r => setTimeout(r, 300))
  }

  console.log('\nDone! Now activate them:')
  console.log('Go to /iww-hq/submissions → set status to "active" for each listing')
}

seedListings()
