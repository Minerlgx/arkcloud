-- ArkCloud 數據庫初始化腳本

-- 產品表
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  category TEXT DEFAULT 'Inference',
  description TEXT,
  gpu TEXT,
  vram TEXT,
  cpu TEXT,
  ram TEXT,
  storage TEXT,
  network TEXT,
  datacenter TEXT DEFAULT 'Taiwan (Taoyuan)',
  pricehourly DECIMAL(10,2) DEFAULT 0,
  pricemonthly DECIMAL(10,2) DEFAULT 0,
  stock INTEGER DEFAULT 10,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'ACTIVE',
  images TEXT[] DEFAULT ARRAY[]::text[],
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- 用戶表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  company TEXT,
  phone TEXT,
  role TEXT DEFAULT 'USER',
  status TEXT DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- 訂單表
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES users(id),
  totalAmount DECIMAL(10,2) DEFAULT 0,
  billingCycle TEXT DEFAULT 'HOURLY',
  status TEXT DEFAULT 'PENDING',
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- 實例表
CREATE TABLE IF NOT EXISTS instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES users(id),
  productId UUID REFERENCES products(id),
  orderId UUID REFERENCES orders(id),
  ipAddress TEXT,
  port INTEGER DEFAULT 22,
  password TEXT,
  status TEXT DEFAULT 'PENDING',
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- 網站內容表
CREATE TABLE IF NOT EXISTS site_content (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- 插入默認內容
INSERT INTO site_content (key, value) VALUES
  ('company_name', '方舟雲計算科技有限公司'),
  ('company_tax_id', '60345307'),
  ('company_representative', '週若傑'),
  ('company_address', '桃園市中壢區龍平里龍東路 116號(1樓)'),
  ('about_title', '方舟雲計算科技有限公司'),
  ('about_subtitle', '專業 AI 雲端運算服務提供商'),
  ('about_description', '專注於為台灣地區的 AI 開發者，研究機構和企業提供高效、穩定、經濟的 GPU 雲端伺服器租賃服務。'),
  ('contact_email', 'support@arkcloud.top'),
  ('contact_sales', 'sales@arkcloud.top'),
  ('contact_hours', '7x24 全年不休')
ON CONFLICT DO NOTHING;
