/* ==========================================================================
   ÉLAN PARFUMS — Single Product Data Source
   Used by: shop cards, search, product detail, cart, wishlist.
   Change a name/price/image here and it updates everywhere.
   ========================================================================== */
// Central product data source.
// Shop, search, product detail, cart and wishlist
// should reference the same product IDs.
window.ELAN_PRODUCTS = [
  {
    id: 'santal-no03',
    name: 'SANTAL NO.03',
    number: 'N°03',
    type: 'EAU DE PARFUM 50ML',
    family: 'Woody / Amber',
    price: 120,
    priceDisplay: '$120.00',
    image: 'Images/elan-hero.jpg',
    gallery: ['Images/elan-hero.jpg', 'Images/brand-story.jpg'],
    badge: 'BESTSELLER',
    popularity: 1,
    added: 2,
    tags: 'unisex woody bestsellers edp eau de parfum santal amber sandalwood cardamom',
    description: 'Creamy sandalwood, cardamom and warm amber. Our quiet icon.',
    longDescription: 'Santal No.03 opens with dry cardamom over creamy Mysore-style sandalwood, settling into a warm amber skin-scent. Composed for close presence — felt, never announced.',
    notes: ['Sandalwood', 'Cardamom', 'Warm Amber']
  },
  {
    id: 'noir-no07',
    name: 'NOIR NO.07',
    number: 'N°07',
    type: 'EAU DE PARFUM 50ML',
    family: 'Woody / Spicy',
    price: 135,
    priceDisplay: '$135.00',
    image: 'Images/elan-noir.jpg',
    gallery: ['Images/elan-noir.jpg', 'Images/elan-presence.jpg'],
    badge: 'NEW',
    popularity: 4,
    added: 5,
    tags: 'men woody new arrivals edp eau de parfum noir cedar pepper vanilla spicy',
    description: 'Smoked cedar, black pepper and dark vanilla. After hours.',
    longDescription: 'Noir No.07 is the evening scent — smoked cedar and black pepper over dark vanilla. Deep, tailored and quietly magnetic.',
    notes: ['Smoked Cedar', 'Black Pepper', 'Dark Vanilla']
  },
  {
    id: 'eclat-no05',
    name: 'ÉCLAT NO.05',
    number: 'N°05',
    type: 'EAU DE PARFUM 50ML',
    family: 'Floral / Musk',
    price: 110,
    priceDisplay: '$110.00',
    image: 'Images/elan-eclat.jpg',
    gallery: ['Images/elan-eclat.jpg', 'Images/FLEUR BLANCHE NO.02.jpeg'],
    badge: 'BESTSELLER',
    popularity: 2,
    added: 4,
    tags: 'women floral fresh bestsellers edp eau de parfum eclat petals musk radiant',
    description: 'White petals, dewy musk and morning light. Radiant.',
    longDescription: 'Éclat No.05 captures morning light — white petals and dewy musk over a clean radiant base. Luminous and weightless.',
    notes: ['White Petals', 'Dewy Musk', 'Morning Light']
  },
  {
    id: 'ambre-no01',
    name: 'AMBRE NO.01',
    number: 'N°01',
    type: 'EAU DE PARFUM 50ML',
    family: 'Amber / Cashmere',
    price: 145,
    priceDisplay: '$145.00',
    image: 'Images/brand-story.jpg',
    gallery: ['Images/brand-story.jpg', 'Images/elan-hero.jpg'],
    badge: 'ICONIC',
    popularity: 3,
    added: 1,
    tags: 'unisex woody amber cashmere edp eau de parfum ambre iconic',
    description: 'Golden amber wrapped in cashmere woods. The first house signature.',
    longDescription: 'The first house signature. Golden amber wrapped in cashmere woods — warm, enveloping and unmistakably ÉLAN.',
    notes: ['Golden Amber', 'Cashmere Woods', 'Soft Resin']
  },
  {
    id: 'royal-oud-no09',
    name: 'ROYAL OUD NO.09',
    number: 'N°09',
    type: 'EAU DE PARFUM 50ML',
    family: 'Oud / Smoked Resin',
    price: 160,
    priceDisplay: '$160.00',
    image: 'Images/parallax-bg.jpg',
    gallery: ['Images/parallax-bg.jpg', 'Images/elan-presence.jpg'],
    badge: 'RARE',
    popularity: 6,
    added: 7,
    tags: 'men oud woody edp eau de parfum royal resin leather rare',
    description: 'Laotian oud, smoked resin and leather. Rare and resonant.',
    longDescription: 'Royal Oud No.09 pairs rare Laotian oud with smoked resin and supple leather. Resonant, precious, unforgettable.',
    notes: ['Laotian Oud', 'Smoked Resin', 'Leather']
  },
  {
    id: 'fleur-blanche-no02',
    name: 'FLEUR BLANCHE NO.02',
    number: 'N°02',
    type: 'EAU DE PARFUM 50ML',
    family: 'Floral / Radiant',
    price: 115,
    priceDisplay: '$115.00',
    image: 'Images/FLEUR BLANCHE NO.02.jpeg',
    gallery: ['Images/FLEUR BLANCHE NO.02.jpeg', 'Images/elan-eclat.jpg'],
    badge: '',
    popularity: 8,
    added: 8,
    tags: 'women floral fresh new arrivals edp eau de parfum fleur blanche blossom tea',
    description: 'Orange blossom, white tea and soft woods. Pure light.',
    longDescription: 'Fleur Blanche No.02 is pure light — orange blossom and white tea over soft woods. Clean and radiant.',
    notes: ['Orange Blossom', 'White Tea', 'Soft Woods']
  },
  {
    id: 'vetiver-pur-no04',
    name: 'VÉTIVER PUR NO.04',
    number: 'N°04',
    type: 'EAU DE PARFUM 50ML',
    family: 'Fresh / Citrus Cedar',
    price: 125,
    priceDisplay: '$125.00',
    image: 'Images/1.jpeg',
    gallery: ['Images/1.jpeg', 'Images/home.jpg'],
    badge: '',
    popularity: 9,
    added: 3,
    tags: 'men fresh woody edp eau de parfum vetiver bergamot cedar citrus',
    description: 'Haitian vétiver, bergamot and dry cedar. Crisp tailoring.',
    longDescription: 'Vétiver Pur No.04 tailors Haitian vétiver with bergamot and dry cedar. Crisp, green and impeccably clean.',
    notes: ['Haitian Vétiver', 'Bergamot', 'Dry Cedar']
  },
  {
    id: 'cuir-intense-no08',
    name: 'CUIR INTENSE NO.08',
    number: 'N°08',
    type: 'EAU DE PARFUM 50ML',
    family: 'Leather / Saffron Oud',
    price: 150,
    priceDisplay: '$150.00',
    image: 'Images/elan-presence.jpg',
    gallery: ['Images/elan-presence.jpg', 'Images/parallax-bg.jpg'],
    badge: 'LIMITED',
    popularity: 7,
    added: 6,
    tags: 'unisex oud woody leather edp eau de parfum cuir saffron limited',
    description: 'Supple leather, saffron and oud. Magnetic intensity.',
    longDescription: 'Cuir Intense No.08 blends supple leather with saffron and oud. Magnetic intensity in a limited composition.',
    notes: ['Supple Leather', 'Saffron', 'Oud']
  },
  {
    id: 'discovery-atelier-set',
    name: 'DISCOVERY ATELIER SET',
    number: 'ATELIER',
    type: '4 × 2ML',
    family: 'Discovery Set',
    price: 48,
    priceDisplay: '$48.00',
    image: 'Images/Luxury_perfume.jpeg',
    gallery: ['Images/Luxury_perfume.jpeg', 'Images/Perfume.jpg'],
    badge: 'DISCOVERY',
    popularity: 5,
    added: 9,
    tags: 'unisex discovery sets new arrivals bestsellers edp santal noir eclat ambre miniature',
    description: 'Four miniatures — Santal, Noir, Éclat and Ambre. Find your signature.',
    longDescription: 'Four 2ml miniatures of our most coveted fragrances — Santal, Noir, Éclat and Ambre. The ritual for finding your signature.',
    notes: ['Santal No.03', 'Noir No.07', 'Éclat No.05', 'Ambre No.01']
  },
  {
    id: 'les-iconiques-set',
    name: 'LES ICONIQUES SET',
    number: 'ICONIQUES',
    type: '4 × 2ML',
    family: 'Discovery Set / Oud',
    price: 58,
    priceDisplay: '$58.00',
    image: 'Images/homepage.jpeg',
    gallery: ['Images/homepage.jpeg', 'Images/test.jpg'],
    badge: 'DISCOVERY',
    popularity: 10,
    added: 10,
    tags: 'unisex discovery sets oud edp oud cuir ambre vetiver miniature dark icons',
    description: 'Oud, cuir, ambre and vétiver in miniature. The dark icons.',
    longDescription: 'The dark icons in miniature — oud, cuir, ambre and vétiver. Four 2ml flacons for evenings and deep presence.',
    notes: ['Royal Oud', 'Cuir Intense', 'Ambre No.01', 'Vétiver Pur']
  }
];

window.ELAN_PRODUCT_MAP = {};
window.ELAN_PRODUCTS.forEach(function (p) { window.ELAN_PRODUCT_MAP[p.id] = p; });

window.elanGetProduct = function (id) {
  if (!id) return null;
  id = String(id).toLowerCase().trim();
  return window.ELAN_PRODUCT_MAP[id] || null;
};
