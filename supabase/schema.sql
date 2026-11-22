-- ==============================================================================
-- ZEPLY - MULTI-TENANT E-COMMERCE PLATFORM SCHEMA
-- Database Schema for Supabase (PostgreSQL with Row Level Security)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TENANTS (Tiendas Online)
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,                       -- Subdominio o identificador (ej: 'mystore')
    name TEXT NOT NULL,                             -- Nombre comercial
    niche TEXT NOT NULL,                            -- Categoría/nicho: ropa, joyeria, tecnologia, perfumeria, etc.
    country TEXT NOT NULL DEFAULT 'Colombia',
    country_code TEXT NOT NULL DEFAULT '+57',
    whatsapp TEXT NOT NULL,                         -- Número oficial para pedidos
    currency TEXT NOT NULL DEFAULT 'COP',
    currency_symbol TEXT NOT NULL DEFAULT '$',
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'TRIAL', 'SUSPENDED', 'EXPIRED')),
    plan TEXT NOT NULL DEFAULT 'STARTER' CHECK (plan IN ('FREE_TRIAL', 'STARTER', 'PRO', 'ENTERPRISE')),
    
    -- Branding y Personalización Estilo Shopify
    logo_url TEXT,
    banner_url TEXT,
    primary_color TEXT DEFAULT '#0284c7',           -- Azul Shopify / Celeste comercial
    accent_color TEXT DEFAULT '#0f172a',
    font_family TEXT DEFAULT 'Inter',
    instagram TEXT,
    facebook TEXT,
    tiktok TEXT,
    
    -- Configuración de Catálogo Revista PDF
    catalog_title TEXT DEFAULT 'Catálogo Oficial',
    catalog_description TEXT DEFAULT 'Encuentra las mejores ofertas y haz tu pedido al instante.',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PERFILES DE USUARIOS (Vinculados a Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'TENANT_OWNER' CHECK (role IN ('SUPERADMIN', 'TENANT_OWNER', 'TENANT_STAFF')),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CATEGORÍAS POR TIENDA
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (tenant_id, slug)
);

-- 5. PRODUCTOS
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    price NUMERIC(14, 2) NOT NULL DEFAULT 0,
    compare_at_price NUMERIC(14, 2),                -- Precio anterior / descuento tachado
    cost_price NUMERIC(14, 2),                      -- Para cálculo de márgenes
    sku TEXT,
    stock INT NOT NULL DEFAULT 0,
    images JSONB DEFAULT '[]'::jsonb,              -- Array de URLs ['https://...']
    variations JSONB DEFAULT '[]'::jsonb,          -- Tallas, colores, etc.
    is_featured BOOLEAN DEFAULT FALSE,              -- Destacado en carrusel
    is_active BOOLEAN DEFAULT TRUE,
    views_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (tenant_id, slug)
);

-- 6. PEDIDOS & INTENCIONES DE WHATSAPP / PDF
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    order_number SERIAL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_city TEXT,
    customer_address TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,      -- [{ productId, name, price, qty, variant }]
    subtotal NUMERIC(14, 2) NOT NULL DEFAULT 0,
    shipping_cost NUMERIC(14, 2) NOT NULL DEFAULT 0,
    total NUMERIC(14, 2) NOT NULL DEFAULT 0,
    payment_method TEXT DEFAULT 'WHATSAPP_CONTRAENTREGA',
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED')),
    source TEXT NOT NULL DEFAULT 'STOREFRONT_WEB' CHECK (source IN ('STOREFRONT_WEB', 'PDF_CATALOG', 'MANUAL')),
    whatsapp_message TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. ÍNDICES DE ALTO RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON public.tenants(slug);
CREATE INDEX IF NOT EXISTS idx_products_tenant ON public.products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_tenant ON public.orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_categories_tenant ON public.categories(tenant_id);

-- 8. ROW LEVEL SECURITY (RLS) - AISLAMIENTO MULTI-TENANT ESTRICTO
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Funciones Auxiliares para RLS
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.current_user_tenant()
RETURNS UUID AS $$
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- POLÍTICAS: TENANTS
-- Tiendas públicas visibles para clientes
CREATE POLICY "Public tenants are viewable by everyone"
ON public.tenants FOR SELECT
USING (status IN ('ACTIVE', 'TRIAL'));

-- Superadmin tiene acceso total
CREATE POLICY "Superadmin full access to tenants"
ON public.tenants FOR ALL
USING (public.current_user_role() = 'SUPERADMIN');

-- Tenant Owner puede editar solo su tienda
CREATE POLICY "Tenant owner can update own store"
ON public.tenants FOR UPDATE
USING (id = public.current_user_tenant());

-- POLÍTICAS: PRODUCTOS
-- Clientes pueden ver productos de tiendas activas
CREATE POLICY "Public products viewable"
ON public.products FOR SELECT
USING (
    is_active = TRUE 
    AND EXISTS (
        SELECT 1 FROM public.tenants 
        WHERE tenants.id = products.tenant_id 
        AND tenants.status IN ('ACTIVE', 'TRIAL')
    )
);

-- Superadmin full access
CREATE POLICY "Superadmin full access to products"
ON public.products FOR ALL
USING (public.current_user_role() = 'SUPERADMIN');

-- Tenant Owners y Staff solo gestionan sus productos
CREATE POLICY "Tenant manage own products"
ON public.products FOR ALL
USING (tenant_id = public.current_user_tenant());

-- POLÍTICAS: PEDIDOS
-- Inserción pública (cuando el cliente genera orden en Storefront o Catálogo PDF)
CREATE POLICY "Public can insert orders"
ON public.orders FOR INSERT
WITH CHECK (TRUE);

-- Superadmin full access
CREATE POLICY "Superadmin full access to orders"
ON public.orders FOR ALL
USING (public.current_user_role() = 'SUPERADMIN');

-- Tenant Owners ven únicamente los pedidos de su tienda
CREATE POLICY "Tenant view own orders"
ON public.orders FOR SELECT
USING (tenant_id = public.current_user_tenant());

CREATE POLICY "Tenant update own orders"
ON public.orders FOR UPDATE
USING (tenant_id = public.current_user_tenant());
