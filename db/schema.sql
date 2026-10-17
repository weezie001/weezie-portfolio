-- ============================================================
-- Cloudflare D1 Schema for weezie.site
-- Run with: npx wrangler d1 execute weezie-db --file=./db/schema.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  source TEXT NOT NULL DEFAULT 'contact', -- 'contact' | 'brief' | 'freebie' | 'store' | 'ai_tool'
  status TEXT NOT NULL DEFAULT 'New',     -- 'New' | 'Contacted' | 'Quoted' | 'Won' | 'Archived'
  plan TEXT DEFAULT '',
  budget TEXT DEFAULT '',
  currency TEXT DEFAULT 'USD',
  estimated_total TEXT DEFAULT '',
  discount_code TEXT DEFAULT '',
  message TEXT DEFAULT '',
  brief_json TEXT DEFAULT '{}',
  subscribed INTEGER NOT NULL DEFAULT 1,
  notes TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- 'Landing Pages' | 'Components' | 'AI Prompts & Agents' | 'Workflows' | 'UI/UX Systems' | 'Freebies'
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  price_ngn INTEGER NOT NULL DEFAULT 0,
  price_usd INTEGER NOT NULL DEFAULT 0,
  is_freebie INTEGER NOT NULL DEFAULT 0,
  badge TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',
  preview_url TEXT DEFAULT '',
  file_url TEXT DEFAULT '',
  features_json TEXT DEFAULT '[]',
  active INTEGER NOT NULL DEFAULT 1,
  downloads_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference TEXT NOT NULL UNIQUE,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  item_type TEXT NOT NULL DEFAULT 'product', -- 'product' | 'ai_unlock'
  item_id TEXT NOT NULL,
  item_title TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  amount INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'paid', -- 'pending' | 'paid' | 'failed'
  download_url TEXT DEFAULT '',
  ai_run_id INTEGER DEFAULT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(buyer_email);

CREATE TABLE IF NOT EXISTS emails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER DEFAULT NULL,
  from_email TEXT NOT NULL,
  to_email TEXT NOT NULL,
  recipient_name TEXT DEFAULT '',
  subject TEXT NOT NULL,
  body_text TEXT NOT NULL,
  email_type TEXT NOT NULL DEFAULT 'direct', -- 'direct' | 'broadcast' | 'cold' | 'followup' | 'automated'
  attachment_name TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'sent',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS inbox_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mailbox TEXT NOT NULL DEFAULT 'enang@weezie.site', -- 'enang@weezie.site' | 'hello@weezie.site'
  from_email TEXT NOT NULL,
  from_name TEXT DEFAULT '',
  subject TEXT NOT NULL,
  body_text TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_inbox_mailbox ON inbox_messages(mailbox);

CREATE TABLE IF NOT EXISTS cold_prospects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  business TEXT DEFAULT '',
  website TEXT DEFAULT '',
  niche TEXT DEFAULT '',
  custom_opener TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending' | 'Sent' | 'Follow-up 1' | 'Follow-up 2' | 'Replied' | 'Unsubscribed'
  followup_count INTEGER NOT NULL DEFAULT 0,
  last_contacted_at TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_cold_status ON cold_prospects(status);

CREATE TABLE IF NOT EXISTS uploaded_files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file_key TEXT NOT NULL UNIQUE,
  filename TEXT NOT NULL,
  mime_type TEXT NOT NULL DEFAULT 'application/octet-stream',
  size_bytes INTEGER NOT NULL DEFAULT 0,
  base64_data TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS ai_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tool TEXT NOT NULL, -- 'audit' | 'architect'
  visitor_email TEXT DEFAULT '',
  input_text TEXT NOT NULL,
  preview_json TEXT NOT NULL,
  full_report_md TEXT NOT NULL,
  unlocked INTEGER NOT NULL DEFAULT 0,
  order_reference TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
