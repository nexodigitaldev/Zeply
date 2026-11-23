import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iequlfuyagzxlpfpzjdl.supabase.co';
const supabaseKey = 'sb_publishable_ZyOJRg5Ttr05fxyAfpYFuA_VGKs8QII';

const supabase = createClient(supabaseUrl, supabaseKey);

const realStores = [
  {
    name: 'Aura Joyas & Relojes',
    slug: 'aurajoyas',
    niche: 'joyeria',
    country: 'Colombia',
    country_code: '+57',
    whatsapp: '3184804720',
    status: 'ACTIVE',
    plan: 'PRO',
    primary_color: '#0284c7',
  },
  {
    name: 'SmartPhone Store Colombia',
    slug: 'smartphonestore',
    niche: 'celulares',
    country: 'Colombia',
    country_code: '+57',
    whatsapp: '3157891234',
    status: 'ACTIVE',
    plan: 'BASIC',
    primary_color: '#0ea5e9',
  },
  {
    name: 'UrbanStyle Ropa & Moda',
    slug: 'urbanstyle',
    niche: 'ropa',
    country: 'Colombia',
    country_code: '+57',
    whatsapp: '3001234567',
    status: 'ACTIVE',
    plan: 'STARTER',
    primary_color: '#0284c7',
  },
  {
    name: 'NovaTech Gadgets',
    slug: 'novatech',
    niche: 'tecnologia',
    country: 'Colombia',
    country_code: '+57',
    whatsapp: '3159876543',
    status: 'TRIAL',
    plan: 'FREE_TRIAL',
    primary_color: '#3b82f6',
  },
  {
    name: 'Essence Perfumería Exclusiva',
    slug: 'essenceperfumes',
    niche: 'perfumeria',
    country: 'Colombia',
    country_code: '+57',
    whatsapp: '3205558899',
    status: 'ACTIVE',
    plan: 'PRO',
    primary_color: '#8b5cf6',
  },
];

async function seed() {
  console.log('🌱 Poblando tiendas reales en Supabase...');
  for (const store of realStores) {
    const { data, error } = await supabase.from('tenants').upsert(store, { onConflict: 'slug' }).select();
    if (error) {
      console.error(`Error al insertar ${store.name}:`, error.message);
    } else {
      console.log(`✅ Tienda ${store.name} registrada con éxito (ID: ${data[0]?.id})`);
    }
  }
}

seed();
