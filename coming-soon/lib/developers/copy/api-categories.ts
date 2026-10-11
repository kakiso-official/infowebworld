/* ═══════════════════════════════════════════════════════════════════════
   InfoWebWorld for Developers - hand-written category intros for the free
   APIs section (spec 3.14 sub: "a hand-written 2-sentence intro per
   category, no numbers"). Each entry is exactly two plain sentences
   describing what the category covers and the kind of app it suits.
   Counts, dates and other data-derived facts are added by the page itself,
   never here.

   Keyed by the dataset's category slug (lib/developers/taxonomy.ts
   CATEGORY_ICONS / RELATED_API_CATEGORIES use the same 51 slugs).

   Pure and isomorphic (no React, no Node APIs).
   ═══════════════════════════════════════════════════════════════════════ */

import { own } from '../paths'

export const API_CATEGORY_INTROS: Readonly<Record<string, string>> = {
  'animals': 'These APIs return facts, images and breed data about animals, from household pets to wildlife. They suit fun widgets, educational apps and anything that needs a steady supply of animal content.',
  'anime': 'These APIs cover anime and manga: show and character data, schedules and artwork. They suit fan sites, watchlists and recommendation tools.',
  'anti-malware': 'These APIs check URLs, files and IP addresses against known malware, phishing and spam signals. They suit link scanners, upload checks and basic security tooling.',
  'art-and-design': 'These APIs return artwork, color palettes, museum collections and design assets. They suit creative tools, portfolio sites and anything that needs visual inspiration on demand.',
  'authentication-and-authorization': 'These APIs handle signing users in and checking what they are allowed to do, from one-tap social login to full identity platforms. They suit any app that needs secure accounts without building auth from scratch.',
  'blockchain': 'These APIs read blockchain data such as wallets, transactions and smart contracts across different networks. They suit wallets, explorers and apps that track on-chain activity.',
  'books': 'These APIs search book catalogs and return details like authors, covers, editions and summaries. They suit reading apps, library tools and recommendation engines.',
  'business': 'These APIs return company, registry and general business data for look-ups and verification. They suit CRM tools, onboarding checks and B2B directories.',
  'calendar': 'These APIs provide public holidays, working-day calculations and scheduling helpers. They suit booking systems, payroll tools and any app that needs to know which days are business days.',
  'cloud-storage-and-file-sharing': 'These APIs let an app upload, store and share files through a cloud provider instead of managing its own storage. They suit document tools, media apps and backup features.',
  'continuous-integration': 'These APIs connect to build and deployment platforms to trigger jobs or read their status. They suit dashboards, chat bots and internal tools that watch a pipeline.',
  'cryptocurrency': 'These APIs return cryptocurrency prices, market data and wallet or exchange information. They suit trackers, portfolio tools and trading dashboards.',
  'currency-exchange': 'These APIs convert between currencies using live or daily exchange rates. They suit checkout flows, invoicing tools and travel and finance apps.',
  'data-validation': 'These APIs check whether an email address, phone number, postal address or other input is real and correctly formatted. They suit sign-up forms and anywhere bad input needs to be caught early.',
  'development': 'These APIs are general-purpose developer utilities that do not fit a narrower category, such as placeholder content or testing helpers. They suit prototypes and everyday app plumbing.',
  'dictionaries': 'These APIs return word definitions, synonyms and language reference data. They suit writing tools, learning apps and anywhere text needs a quick lookup.',
  'documents-and-productivity': 'These APIs generate, convert or manage documents, spreadsheets and other office files. They suit reporting tools, invoicing systems and document pipelines.',
  'email': 'These APIs send transactional or marketing email and check whether an address is valid and deliverable. They suit sign-up flows, notifications and newsletter tools.',
  'entertainment': 'These APIs return jokes, trivia, quotes and other light content for fun. They suit chat bots, kiosks and apps that want a bit of personality.',
  'environment': 'These APIs report environmental data such as air quality, pollution and natural resource information. They suit health apps, dashboards and research tools.',
  'events': 'These APIs list concerts, meetups and other events with details like venue and date. They suit listings sites, calendars and local discovery apps.',
  'finance': 'These APIs return stock prices, market indexes and other financial market data. They suit trading tools, portfolio trackers and investing dashboards.',
  'food-and-drink': 'These APIs return recipes, nutrition facts, cocktails and other food and drink data. They suit cooking apps, menu tools and diet trackers.',
  'games-and-comics': 'These APIs return data about video games, comics and tabletop games, from release details to character information. They suit fan sites, backlog trackers and recommendation tools.',
  'geocoding': 'These APIs convert addresses to map coordinates and back, and look up places by name. They suit maps, delivery apps and anywhere a location needs to become a point on the map.',
  'government': 'These APIs expose public records and open data published by government bodies. They suit civic tech, research tools and transparency projects.',
  'health': 'These APIs return medical reference data, drug information and public health statistics. They suit health apps, research tools and clinical reference tools, though they are not a substitute for medical advice.',
  'jobs': 'These APIs search job listings and return postings with details like company, location and salary. They suit job boards, career sites and recruiting tools.',
  'machine-learning': 'These APIs run machine learning models over text, images or other data, from classic AI tasks to modern large language models. They suit chat features, content analysis and anything that needs a model instead of hand-written rules.',
  'music': 'These APIs return song, artist and album data, and in some cases streaming or playback details. They suit music apps, lyrics tools and listening trackers.',
  'news': 'These APIs return news headlines and articles from publishers around the world. They suit news readers, aggregators and research tools that need current coverage.',
  'open-data': 'These APIs expose public datasets that do not fit a narrower category, published by agencies, researchers or open data projects. They suit dashboards, research tools and civic apps.',
  'open-source-projects': 'These APIs return metadata about open source projects and their activity, such as releases and contributors. They suit developer dashboards and tools that track the health of a project.',
  'patent': 'These APIs search patent and trademark filings and return their details. They suit legal research tools, IP trackers and competitive analysis.',
  'personality': 'These APIs return personality quizzes, horoscopes and similar light, opinion-based content. They suit fun apps and features that do not need to be taken too seriously.',
  'phone': 'These APIs validate phone numbers and look up details like carrier and country. They suit sign-up forms and anywhere a phone number needs checking before it is trusted.',
  'photography': 'These APIs return stock photos, image metadata or image processing features. They suit galleries, design tools and apps that need a ready supply of images.',
  'programming': 'These APIs return programming reference material such as code snippets, language facts or developer trivia. They suit learning tools, documentation sites and developer-focused apps.',
  'science-and-math': 'These APIs return scientific data, mathematical calculations and reference facts. They suit education apps, research tools and calculators.',
  'security': 'These APIs check passwords, domains and other security-relevant data for known risks. They suit sign-up flows, security dashboards and basic risk checks.',
  'shopping': 'These APIs return product listings, prices or catalog data for shopping and retail. They suit comparison tools, price trackers and storefront features.',
  'social': 'These APIs connect to social platforms to read or post content and profile data. They suit sharing features, social logins and social media dashboards.',
  'sports-and-fitness': 'These APIs return sports scores, schedules, fitness and workout data. They suit score trackers, fan apps and fitness tools.',
  'test-data': 'These APIs generate realistic fake data such as names, addresses and placeholder text for testing. They suit demos, automated tests and anywhere real user data should not be used.',
  'text-analysis': 'These APIs analyze text for things like sentiment, language or readability. They suit moderation tools, writing assistants and content pipelines.',
  'tracking': 'These APIs track the movement of packages, vehicles or other shipments. They suit delivery apps, logistics dashboards and order-status pages.',
  'transportation': 'These APIs return public transit, flight or other transportation schedules and data. They suit travel apps, commute planners and logistics tools.',
  'url-shorteners': 'These APIs shorten long links and, in some cases, report click statistics for them. They suit sharing features and marketing tools that need tidy, trackable links.',
  'vehicle': 'These APIs look up vehicle details from identifiers such as a registration or VIN. They suit automotive marketplaces, fleet tools and insurance checks.',
  'video': 'These APIs search, host or return metadata for video content. They suit video apps, playlists and media dashboards.',
  'weather': 'These APIs return current conditions, forecasts and historical weather data for a location. They suit travel apps, dashboards and anything that reacts to the weather.',
}

/** The hand-written intro for a category slug, or null for an unknown one. */
export function apiCategoryIntro(slug: string): string | null {
  return own(API_CATEGORY_INTROS, slug) ?? null
}
