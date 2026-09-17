/**
 * Single source of truth for everything that appears in more than one place:
 * brand strings, contacts, navigation, legal. Nothing here is duplicated in a
 * component — pages read from this module so a phone number is changed once.
 *
 * NOTE: contact details below are placeholders. Replace them with the real
 * TochkaComp address, phone, INN and opening hours before going live.
 */

export const siteConfig = {
  name: 'TochkaComp',
  legalName: 'ООО «Точка Комп»',
  tagline: 'Точка сборки',
  description:
    'Магазин компьютерной техники в Махачкале. Комплектующие, готовые сборки, ноутбуки и периферия — с проверкой на стенде, гарантией и сервисом в своём городе.',
  locale: 'ru_RU',
  lang: 'ru',
  city: 'Махачкала',
  region: 'Республика Дагестан',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tochkacomp.ru',
  ogImage: '/opengraph-image',
} as const;

export const contacts = {
  phone: '+7 (8722) 55-14-90',
  phoneHref: 'tel:+78722551490',
  whatsapp: 'https://wa.me/79280000000',
  telegram: 'https://t.me/tochkacomp',
  email: 'shop@tochkacomp.ru',
  emailHref: 'mailto:shop@tochkacomp.ru',
  address: {
    street: 'пр. Имама Шамиля, 48',
    city: 'Махачкала',
    region: 'Республика Дагестан',
    postalCode: '367000',
    country: 'RU',
  },
  geo: { latitude: 42.9764, longitude: 47.5024 },
  hours: [
    { days: 'Пн — Пт', time: '10:00 — 20:00' },
    { days: 'Сб — Вс', time: '10:00 — 18:00' },
  ],
  /** Schema.org openingHours notation. */
  openingHoursSpec: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '10:00', closes: '20:00' },
    { days: ['Saturday', 'Sunday'], opens: '10:00', closes: '18:00' },
  ],
} as const;

export const social = [
  { label: 'Telegram', href: contacts.telegram },
  { label: 'WhatsApp', href: contacts.whatsapp },
  { label: 'VK', href: 'https://vk.com/tochkacomp' },
] as const;

export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

export const primaryNav: readonly NavItem[] = [
  { label: 'Каталог', href: '/catalog', description: 'Все комплектующие и техника' },
  { label: 'Сборки', href: '/pc-builder', description: 'Конфигуратор с проверкой совместимости' },
  { label: 'Акции', href: '/deals', description: 'Скидки недели и уценка' },
  { label: 'Бренды', href: '/brands', description: '24 производителя' },
  { label: 'Сервис', href: '/service', description: 'Ремонт, апгрейд, диагностика' },
] as const;

export const footerNav: readonly { title: string; items: readonly NavItem[] }[] = [
  {
    title: 'Магазин',
    items: [
      { label: 'Каталог', href: '/catalog' },
      { label: 'Акции', href: '/deals' },
      { label: 'Бренды', href: '/brands' },
      { label: 'Конфигуратор ПК', href: '/pc-builder' },
      { label: 'Сравнение', href: '/compare' },
    ],
  },
  {
    title: 'Компания',
    items: [
      { label: 'О нас', href: '/about' },
      { label: 'Сервисный центр', href: '/service' },
      { label: 'Контакты', href: '/contacts' },
    ],
  },
  {
    title: 'Клиенту',
    items: [
      { label: 'Корзина', href: '/cart' },
      { label: 'Избранное', href: '/wishlist' },
      { label: 'Личный кабинет', href: '/account' },
      { label: 'Доставка и оплата', href: '/about#delivery' },
      { label: 'Гарантия', href: '/service#warranty' },
    ],
  },
] as const;

/** Displayed under the fold and in JSON-LD. */
export const legal = {
  inn: '0570000000',
  ogrn: '1230500000000',
  since: 2014,
} as const;
