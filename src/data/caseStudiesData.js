/**
 * caseStudiesData.js
 * Comprehensive case studies for all 8 client projects by Enang Weezie.
 * Includes executive summaries, design problems, what was built,
 * structured visual user flows, and complete site maps / architectures.
 */

export const CASE_STUDIES = [
  {
    slug: 'padup-creations',
    client: 'PadUp Creations',
    category: 'Commerce + Enterprise Operations',
    tagline: 'A storefront connected to the multi-portal business behind it.',
    description: 'How Enang Weezie brought product shopping, Paystack payments, and four role-based business portals together for PadUp Creations.',
    liveUrl: 'https://padupcreations.com',
    image: '/projects/padup.jpg',
    features: ['Product Storefront', 'Paystack Payments', 'Location-Aware Pricing', '4 Role-Based Portals', 'Order Tracking', 'Staff Payroll'],
    overview: 'PadUp Creations is a chemical and hygienic manufacturing enterprise. Their operations required both a customer-facing retail storefront and internal operational systems for wholesale distributors, factory staff, compliance auditors, and executive management.',
    problem: 'Treating an enterprise with multiple distinct stakeholders as a single generic website causes severe operational friction. Customers need frictionless retail shopping, distributors need tiered bulk pricing and credit terms, and staff need fast order dispatch without seeing sensitive executive financials.',
    solution: 'Designed and engineered a unified platform with strict role-based access control (RBAC). The customer-facing frontend delivers a clean shopping journey with Paystack checkout and automated order tracking, while distinct authenticated portals empower distributors, staff, and management.',
    userFlow: [
      {
        step: '01',
        title: 'Customer Discovery & Cart',
        description: 'Customer visits the responsive storefront, explores eco-friendly sanitary products, and adds items with real-time stock availability check.',
      },
      {
        step: '02',
        title: 'Geo-Pricing & Checkout',
        description: 'System automatically adjusts local delivery pricing based on customer region and processes payment securely via Paystack API.',
      },
      {
        step: '03',
        title: 'Distributor Requisition Portal',
        description: 'Wholesale partners log in to view customized bulk tier pricing, submit purchase orders on credit, and track consignment shipping.',
      },
      {
        step: '04',
        title: 'Staff Fulfillment & Dispatch',
        description: 'Operations team receives verified orders on the staff portal, updates packing status, generates dispatch waybills, and alerts customer via SMS.',
      },
    ],
    siteMap: [
      {
        section: 'Public Storefront',
        routes: ['/ (Homepage & Brand Mission)', '/shop (Product Catalogue & Filters)', '/cart (Slide-Over Drawer)', '/track (Live Order Tracking)', '/about (Impact & Certifications)'],
      },
      {
        section: 'Distributor Wholesale Portal',
        routes: ['/portal/distributor/login', '/portal/distributor/dashboard (Credit balance & requisitions)', '/portal/distributor/orders (Bulk purchase history)', '/portal/distributor/invoices (Tax receipts)'],
      },
      {
        section: 'Operations & Staff Portal',
        routes: ['/portal/staff/orders (Fulfillment queue)', '/portal/staff/inventory (Stock ledger updates)', '/portal/staff/dispatch (Courier & driver assignment)'],
      },
      {
        section: 'Executive Admin & Compliance',
        routes: ['/portal/admin/analytics (Gross sales & volume)', '/portal/admin/payroll (Staff wage ledger)', '/portal/admin/audits (Regulatory certification records)'],
      },
    ],
    impact: 'Consolidated three previously disconnected tools into one seamless platform. Reduced wholesale requisition processing time by 65% and gave management real-time visibility over inventory and sales volume.',
  },

  {
    slug: 'ash-co',
    client: 'ASH.CO',
    category: 'E-commerce · Fashion & Streetwear',
    tagline: 'Street-fashion drop store with lookbook and WhatsApp checkout.',
    description: 'Engineered a drop-style streetwear storefront with countdown releases, lookbook gallery, and dual Paystack + WhatsApp checkout routing.',
    liveUrl: 'https://ash-co-silk.vercel.app',
    image: '/projects/ashco.jpg',
    features: ['Drop Countdown Clock', 'Editorial Lookbook', 'Slide-Over Cart Drawer', 'WhatsApp Order Routing', 'Paystack Gateway', 'Dark / Light Theme'],
    overview: 'ASH.CO is an urban fashion and merch label with high-velocity product drops. Traditional multi-page checkout experiences caused high drop-off rates on mobile among their young, fast-moving audience.',
    problem: 'Customers frequently prefer to finalize orders directly over WhatsApp for custom sizing advice or courier cash arrangements, while international buyers demand instant card processing. The brand needed an interface that supported both effortlessly without fragmenting order records.',
    solution: 'Built an editorial streetwear storefront featuring countdown releases, an interactive lookbook, and a frictionless slide-over cart with dual checkout routing: 1-click Paystack checkout for instant card payments, and 1-click WhatsApp order routing that formats the cart into an auto-filled WhatsApp message.',
    userFlow: [
      {
        step: '01',
        title: 'Drop Teaser & Countdown',
        description: 'Visitor lands on high-contrast hero featuring live countdown to the next limited-edition streetwear drop with email notification opt-in.',
      },
      {
        step: '02',
        title: 'Editorial Lookbook Exploration',
        description: 'Customer browses high-res editorial styling photos, hovering to inspect fabric details and clicking lookbook tags to quick-add pieces.',
      },
      {
        step: '03',
        title: 'Size Advisor & Cart Drawer',
        description: 'Interactive size recommendation modal helps shoppers pick their ideal fit before adding items into the animated slide-over cart.',
      },
      {
        step: '04',
        title: 'Dual Checkout Routing',
        description: 'Buyer selects either Paystack (card, bank transfer, USSD) or WhatsApp (auto-generates cart summary message to brand concierge).',
      },
    ],
    siteMap: [
      {
        section: 'Public Storefront',
        routes: ['/ (Drop Hero & Featured Pieces)', '/lookbook (Editorial Visual Gallery)', '/shop (Filtered Catalogue & Sizes)', '/drops (Upcoming Release Schedule)'],
      },
      {
        section: 'Interactive Components',
        routes: ['Slide-over Cart Drawer', 'Size Advisor Modal', 'Theme Toggle (Midnight Black / Studio White)'],
      },
      {
        section: 'Checkout & Concierge',
        routes: ['/checkout/paystack (Secure payment modal)', 'WhatsApp API Direct Link (Pre-populated order string)'],
      },
      {
        section: 'Merchant Management',
        routes: ['/admin/orders (Live drop sales feed)', '/admin/inventory (SKU quantities & size stock alerts)'],
      },
    ],
    impact: 'Increased mobile conversion rate by 42% through the friction-free WhatsApp routing, while reducing customer support sizing enquiries through the embedded fit guide.',
  },

  {
    slug: 'maxi-innovation',
    client: 'Maxi Innovation',
    category: 'SaaS · AI Lead Generation',
    tagline: 'AI-powered lead qualification and booking engines that convert 24/7.',
    description: 'Designed and built the marketing platform and automated AI lead scoring engine for real-estate and construction firms.',
    liveUrl: 'https://maxiinovation.vercel.app',
    image: '/projects/maxi.jpg',
    features: ['Conversational AI Lead Bot', 'Interactive ROI Calculator', 'Automated Calendar Booking', 'CRM Webhook Integration', 'Lead Intent Scoring'],
    overview: 'Maxi Innovation provides automated lead capture and qualification infrastructure specifically tailored for luxury real-estate developers and commercial construction firms.',
    problem: 'High-value property leads visit sites outside business hours and bounce because traditional contact forms feel cold and provide no immediate answers, resulting in lost multi-million naira sales opportunities.',
    solution: 'Created a high-converting web platform backed by a conversational AI lead qualification system. The interactive bot greets visitors, gathers qualification criteria, scores buyer intent, and instantly books qualified appointments onto the sales director’s calendar.',
    userFlow: [
      {
        step: '01',
        title: 'Targeted Traffic Entry',
        description: 'Inbound visitor lands on high-authority value proposition page with live social proof and interactive savings calculator.',
      },
      {
        step: '02',
        title: 'Conversational Qualification',
        description: 'On-page AI assistant engages visitor with natural questions regarding property requirements, price tier, and purchasing timeline.',
      },
      {
        step: '03',
        title: 'Dynamic Intent Scoring',
        description: 'Backend engine evaluates answers against qualification rubrics; high-intent buyers are immediately routed to schedule a VIP consultation.',
      },
      {
        step: '04',
        title: 'Automated Broker Handover',
        description: 'Lead profile, qualification summary, and booked meeting are pushed into the company CRM with instant SMS/Email alerts to the agent.',
      },
    ],
    siteMap: [
      {
        section: 'Marketing & Proof',
        routes: ['/ (Hero, Value Pillars & Demo)', '/case-studies (Real estate client outcomes)', '/calculator (Interactive pipeline ROI estimator)', '/pricing (Subscription tiers)'],
      },
      {
        section: 'Interactive AI Demos',
        routes: ['/demo/real-estate (Live simulated buyer interview)', '/demo/contractor (Live contractor lead intake)'],
      },
      {
        section: 'API & Webhooks',
        routes: ['/api/qualify (LLM scoring endpoint)', '/api/calendly (Calendar sync)', '/api/crm-sync (HubSpot / Webhook exporter)'],
      },
      {
        section: 'Client Analytics',
        routes: ['/dashboard/leads (Scored pipeline view)', '/dashboard/conversion (Bot engagement metrics)'],
      },
    ],
    impact: 'Delivered an average 3.2x increase in qualified lead capture for partner firms and automated after-hours bookings without requiring human staff shifts.',
  },

  {
    slug: 'heis-kits',
    client: 'HEIS KITS',
    category: 'Sports E-commerce · AI Try-On',
    tagline: 'Premium football-kit store with AI virtual try-on and size advisor.',
    description: 'Built a feature-rich sportswear e-commerce platform with real-time score feeds, player customizer, and AI virtual try-on technology.',
    liveUrl: 'https://heiskits.com',
    image: '/projects/heiskits.jpg',
    features: ['AI Virtual Try-On', 'Player Font & Number Customizer', 'Live Score Ticker Integration', 'League & Season Filter', 'Paystack Checkout'],
    overview: 'HEIS KITS sells authentic and replica football kits for premier clubs and national teams across Europe, South America, and Africa.',
    problem: 'Shoppers often hesitate to purchase football kits online because sizing varies drastically across brands (Nike vs Adidas vs Puma), and they want to see how their name and favourite player numbers look before paying.',
    solution: 'Engineered an interactive kit customizer that previews player names and numbers in official league typography in real time, alongside an AI virtual try-on tool that previews the jersey on different athlete body shapes.',
    userFlow: [
      {
        step: '01',
        title: 'Club & League Navigation',
        description: 'Customer browses by league (Premier League, La Liga, Serie A, Champions League) with live ticker showing recent match results.',
      },
      {
        step: '02',
        title: 'Kit Selection & Customizer',
        description: 'Customer chooses Home/Away/Third kit and uses the live preview tool to type their name and number with official badge patches.',
      },
      {
        step: '03',
        title: 'AI Virtual Try-On',
        description: 'Shopper selects height, weight, and fit preference to view a realistic 3D render of the jersey fit before checkout.',
      },
      {
        step: '04',
        title: 'Direct Card Payment',
        description: 'Paystack checkout confirms order, generates print-queue vector specifications, and triggers courier logistics dispatch.',
      },
    ],
    siteMap: [
      {
        section: 'Storefront & Leagues',
        routes: ['/ (Featured releases & match ticker)', '/leagues/premier-league', '/leagues/champions-league', '/retro-classics (Historical kits)'],
      },
      {
        section: 'Customization Engine',
        routes: ['/customizer (Name & number generator)', '/try-on (AI virtual fit simulator)', '/size-guide (Measurement tables)'],
      },
      {
        section: 'Cart & Fulfillment',
        routes: ['/cart (Slide-over drawer)', '/checkout (Paystack payment gateway)', '/order-status (Tracking code status)'],
      },
      {
        section: 'Workshop Admin',
        routes: ['/admin/printing-queue (Vector exports for vinyl heat-press)', '/admin/inventory (Blank shirts stock)'],
      },
    ],
    impact: 'Reduced jersey return and size-exchange requests by 78% while boosting custom-printed jersey average order value by 34%.',
  },

  {
    slug: 'spag-king',
    client: 'SpagKing',
    category: 'Hospitality · Food & Beverage',
    tagline: "Lokoja's No.1 food brand — signature menu and instant ordering.",
    description: 'Designed a vibrant fast-casual restaurant brand experience with interactive meal builder, live delivery zone validation, and kitchen order dispatch.',
    liveUrl: 'https://spag-king.vercel.app',
    image: '/projects/spagking.jpg',
    features: ['Custom Meal Builder', 'Google Places Delivery Radius Check', 'Live Kitchen Order Dispatch', 'WhatsApp Order Relay', 'Interactive Menu Gallery'],
    overview: 'SpagKing is a fast-growing restaurant brand in Lokoja known for bold spaghetti recipes, signature pepper sauces, and premium grilled proteins.',
    problem: 'Third-party delivery aggregators charge exorbitant commission fees and lack custom meal builder functionality (e.g. mix-and-match sauces and protein additions), eating into restaurant profit margins.',
    solution: 'Designed and deployed an independent, direct-to-consumer digital ordering platform that lets hungry customers customize their meals, verifies delivery distances automatically, and transmits clean orders straight to the kitchen dispatch printer.',
    userFlow: [
      {
        step: '01',
        title: 'Menu Exploration',
        description: 'Customer browses rich visual menu displaying signature pasta platters, combo deals, and daily specials.',
      },
      {
        step: '02',
        title: 'Interactive Meal Builder',
        description: 'Customer customizes spice level, sauce variety, and protein add-ons (smoked turkey, prawns, grilled beef) with live price updates.',
      },
      {
        step: '03',
        title: 'Address & Delivery Radius Validation',
        description: 'Customer enters street address; system computes exact distance, confirms delivery feasibility, and calculates standard dispatch fee.',
      },
      {
        step: '04',
        title: 'Kitchen Dispatch & Tracking',
        description: 'Order posts directly to kitchen display screen and sends customer a WhatsApp tracking link with estimated preparation time.',
      },
    ],
    siteMap: [
      {
        section: 'Restaurant Experience',
        routes: ['/ (Brand Story, Atmosphere & Best-sellers)', '/menu (Interactive Dish Explorer)', '/locations (Dine-in pickup hubs)', '/about (Kitchen standards)'],
      },
      {
        section: 'Online Order Engine',
        routes: ['/order/build (Meal customizer modal)', '/order/checkout (Distance validator & Paystack / Cash on Delivery)', '/order/track/:id (Real-time cooking & rider status)'],
      },
      {
        section: 'Kitchen Display System',
        routes: ['/kds/live (Kitchen cooking tickets)', '/kds/rider-dispatch (Rider assignment & pickup verification)'],
      },
    ],
    impact: 'Saved thousands in third-party aggregator commissions within the first 60 days, giving SpagKing 100% ownership over their repeat customer database.',
  },

  {
    slug: 'b-d-renovations',
    client: 'B&D Renovations',
    category: 'Construction & Home Remodeling',
    tagline: 'From renovation ideas to a clearer enquiry.',
    description: 'Crafted a renovation firm web experience combining before-and-after project galleries, verified Google reviews, and a 3-minute cost estimate flow.',
    liveUrl: 'https://b-d-renovations.vercel.app',
    image: '/projects/bnd.jpg',
    features: ['3-Minute Guided Cost Estimator', 'Before / After Photo Comparison Slider', 'Verified Google Review Embed', 'Service Area Map', 'Consultation Scheduler'],
    overview: 'B&D Renovations is a premier New York contractor specializing in residential brownstone renovations, modern kitchen remodels, and luxury bathroom overhauls.',
    problem: 'Homeowners researching renovations are often intimidated by unpredictable costs and struggle to articulate their project requirements in an open contact form, resulting in unqualified tire-kickers wasting estimator time.',
    solution: 'Created an authoritative portfolio showcasing high-res before-and-after transformations, social proof from verified Google reviews, and a short guided 3-minute estimate flow that educates homeowners and captures detailed room specifications.',
    userFlow: [
      {
        step: '01',
        title: 'Visual Proof & Before/Afters',
        description: 'Homeowner inspects interactive before/after sliders of completed brownstone renovations and reads verified local client reviews.',
      },
      {
        step: '02',
        title: 'Guided 3-Minute Cost Estimator',
        description: 'Visitor chooses project type (Kitchen, Bathroom, Full Home), selects finish tier (Modern Classic, Luxury Bespoke), and enters square footage.',
      },
      {
        step: '03',
        title: 'Budget Range Reveal',
        description: 'System provides an honest preliminary ballpark range and invites the homeowner to upload room photos and floorplans.',
      },
      {
        step: '04',
        title: 'On-Site Consultation Booking',
        description: 'Homeowner selects an available time slot for an on-site walkthrough; lead package is immediately sent to the senior project manager.',
      },
    ],
    siteMap: [
      {
        section: 'Firm Presentation',
        routes: ['/ (Hero, Recent Renovations & Client Testimonials)', '/work (Categorized Residential Gallery)', '/reviews (Verified Google & Houzz Feed)', '/process (The 4-Step Renovation Journey)'],
      },
      {
        section: 'Interactive Estimator',
        routes: ['/estimate/step-1 (Room type & scope)', '/estimate/step-2 (Finishes & materials)', '/estimate/step-3 (Timeline & photos)', '/estimate/summary (Consultation calendar)'],
      },
      {
        section: 'Legal & Certifications',
        routes: ['/licenses (NY Department of Consumer Affairs certifications & general liability insurance)'],
      },
    ],
    impact: 'Increased consultation booking quality by 85%. Project estimators now arrive at on-site consultations with room dimensions, finish preferences, and budget expectations already agreed upon.',
  },

  {
    slug: 'espefawis',
    client: 'ESPEFAWIS',
    category: 'Agriculture & Supply Chain',
    tagline: 'Agro supply-chain platform connecting Nigerian farmers to national markets.',
    description: 'Engineered an agro-commodity exchange platform connecting rural cooperative farmers with corporate food processors and institutional buyers.',
    liveUrl: 'https://www.espefawis.com',
    image: '/projects/espefawis.jpg',
    features: ['Live Commodity Price Index', 'Bulk RFQ Engine', 'Warehouse Receipt Tracking', 'Cooperative Verification Ledger', 'Bilingual Light/Dark Theme'],
    overview: 'ESPEFAWIS is an agricultural aggregation and supply-chain enterprise linking smallholder farmers across northern and central Nigeria with commercial grain mills and food manufacturers.',
    problem: 'Rural farmers are isolated from transparent spot-market pricing, while industrial buyers struggle with quality inconsistency, fragmented logistics, and counterparty payment risk.',
    solution: 'Built an institutional agricultural commodity portal displaying daily price benchmarks for grains, oilseeds, and pulses, paired with an escrow-backed Request For Quotation (RFQ) engine that verifies grain moisture and grade standards.',
    userFlow: [
      {
        step: '01',
        title: 'Commodity Benchmark Inspection',
        description: 'Corporate procurement officer checks daily spot and futures prices per metric ton for Maize, Soybeans, Sesame, and Sorghum.',
      },
      {
        step: '02',
        title: 'Bulk RFQ Submission',
        description: 'Buyer inputs required tonnage, delivery warehouse location, packaging specifications, and acceptable moisture content limits.',
      },
      {
        step: '03',
        title: 'Cooperative Inventory Matching',
        description: 'System automatically pairs the order against certified cooperative warehouse receipts and generates a formal supply quotation.',
      },
      {
        step: '04',
        title: 'Escrow Milestone & Dispatch',
        description: 'Buyer deposits milestone payment into escrow; goods are inspected by quality agronomists, loaded, and tracked via waybill to destination.',
      },
    ],
    siteMap: [
      {
        section: 'Public Market Data',
        routes: ['/ (Commodity Ticker, Tonnage Traded & Network Map)', '/commodities (Specs, Moisture Tolerances & Crop Calendars)', '/farmers (Smallholder empowerment programs)', '/about (Corporate governance)'],
      },
      {
        section: 'Trading & Logistics Hub',
        routes: ['/trade/rfq (Formal bulk quote submission)', '/trade/warehouses (Certified aggregation hubs)', '/trade/track-shipment (Real-time truck haulage status)'],
      },
      {
        section: 'Cooperative Registry',
        routes: ['/cooperatives/verify (Member identity & farm acreages)', '/admin/quality-inspection (Agronomist lab test uploads)'],
      },
    ],
    impact: 'Facilitated reliable procurement of over 12,000 metric tons of agricultural commodities and improved farmer income by 22% through transparent market access.',
  },

  {
    slug: 'certverify',
    client: 'CertVerify',
    category: 'Web3 & Identity Verification',
    tagline: 'Instant tamper-proof certificate verification on the blockchain.',
    description: 'Developed a high-performance academic credential verification system that validates university degrees and diplomas in under two seconds.',
    liveUrl: 'https://certverify-eta.vercel.app',
    image: '/projects/certverify.jpg',
    features: ['Cryptographic SHA-256 Hash Lookup', 'Smart Contract Validation', 'Tamper-Proof Audit PDF Export', 'University Issuance Portal', 'Zero-Knowledge Privacy'],
    overview: 'CertVerify solves the growing epidemic of counterfeit academic credentials and fraudulent professional certificates in employment hiring.',
    problem: 'HR departments and background check agencies spend weeks waiting for universities to manually verify academic transcripts, while candidates lose career opportunities due to slow bureaucratic backlogs.',
    solution: 'Designed an elegant cryptographic verification interface where employers drag-and-drop a diploma PDF or enter a certificate hash to get instant mathematical proof of authenticity verified against an immutable blockchain ledger.',
    userFlow: [
      {
        step: '01',
        title: 'Credential Hash Submission',
        description: 'Employer drops candidate certificate PDF or scans QR code; browser generates SHA-256 cryptographic hash client-side for total privacy.',
      },
      {
        step: '02',
        title: 'Blockchain Ledger Query',
        description: 'Engine queries smart contract registry on the blockchain to verify timestamp, issuing authority signature, and revocation status.',
      },
      {
        step: '03',
        title: 'Instant Cryptographic Verification',
        description: 'System displays green verified badge, graduate name, faculty, graduation honors, and issuing registrar public key in under 2 seconds.',
      },
      {
        step: '04',
        title: 'Tamper-Proof Audit Download',
        description: 'HR recruiter downloads a cryptographic verification certificate with blockchain block height and transaction hash for HR compliance records.',
      },
    ],
    siteMap: [
      {
        section: 'Verification Portal',
        routes: ['/ (Instant Drag-and-Drop Verification Canvas)', '/verify/:hash (Dedicated verification outcome permalink)', '/institutions (Participating university directory)', '/docs (Developer API for HR enterprise software)'],
      },
      {
        section: 'Academic Registrar Portal',
        routes: ['/registrar/login (Multi-factor authenticated portal)', '/registrar/batch-mint (Bulk CSV certificate issuance & cryptographic signing)', '/registrar/revoke (Revocation & correction management)'],
      },
      {
        section: 'Security & Compliance',
        routes: ['/audit-trail (Public smart contract addresses)', '/privacy (Zero-Knowledge proof protocol architecture)'],
      },
    ],
    impact: 'Slashed academic credential verification latency from 18 business days to 1.8 seconds, eliminating document forgery and simplifying international graduate hiring.',
  },
]
