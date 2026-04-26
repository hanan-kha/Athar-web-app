import newsAqsa from "@/assets/news-aqsa.jpg";
import newsNablus from "@/assets/news-nablus.jpg";
import eventHeritage from "@/assets/event-heritage.jpg";
import eventEmbroidery from "@/assets/event-embroidery.jpg";
import eventBookfair from "@/assets/event-bookfair.jpg";

export const news = [
  {
    id: "n1",
    title: "Heritage volunteers protect ancient manuscripts in Old City",
    author: "Layla Hassan",
    timeAgo: "15m ago",
    image: newsAqsa,
  },
  {
    id: "n2",
    title: "Nablus old city restoration efforts gain international support",
    author: "Omar Khalil",
    timeAgo: "42m ago",
    image: newsNablus,
  },
  {
    id: "n3",
    title: "Gaza museum reopens select galleries to the public",
    author: "Sara Mansour",
    timeAgo: "1h ago",
    image: eventBookfair,
  },
];

export const events = [
  {
    id: "e1",
    title: "Palestinian Heritage Exhibition",
    titleAr: "معرض التراث الفلسطيني",
    image: eventHeritage,
    date: "Sunday, March 15, 2026",
    time: "10:00 AM – 6:00 PM",
    location: "British Museum, London",
    locationAr: "المتحف البريطاني، لندن",
    price: "£12",
    seats: 42,
    totalSeats: 200,
    organizer: "Palestinian Heritage Society",
    limited: true,
    description:
      "An immersive exhibition celebrating Palestinian craft, embroidery, ceramics and oral history — featuring artifacts loaned from family archives across the diaspora.",
  },
  {
    id: "e2",
    title: "Gaza Art & Culture Book Fair",
    titleAr: "معرض غزة للكتاب والفن",
    image: eventBookfair,
    date: "Sunday, April 5, 2026",
    time: "All Day",
    location: "Online",
    locationAr: "عبر الإنترنت",
    price: "Free",
    seats: 950,
    totalSeats: 1000,
    organizer: "Cultural Memory Initiative",
    limited: false,
    description: "A virtual fair connecting publishers, authors and readers across the region.",
  },
  {
    id: "e3",
    title: "Traditional Embroidery Workshop",
    titleAr: "ورشة التطريز التقليدي",
    image: eventEmbroidery,
    date: "Saturday, May 10, 2026",
    time: "2:00 PM – 5:00 PM",
    location: "Berlin, Germany",
    locationAr: "برلين، ألمانيا",
    price: "€20",
    seats: 8,
    totalSeats: 25,
    organizer: "Tatreez Collective",
    limited: true,
    description: "Hands-on tatreez workshop guided by master embroiderers from the West Bank.",
  },
];

export const charities = [
  { id: "c1", name: "Gaza Relief Fund", goal: 500000, raised: 312400 },
  { id: "c2", name: "Palestinian Heritage Preservation Society", goal: 200000, raised: 87650 },
  { id: "c3", name: "Children of Palestine Foundation", goal: 300000, raised: 198320 },
];

export const mapLocations = [
  { id: 1, name: "Al-Aqsa Mosque", nameAr: "المسجد الأقصى", lat: 31.7763, lng: 35.2357, category: "Religious" },
  { id: 2, name: "Church of the Nativity", nameAr: "كنيسة المهد", lat: 31.7042, lng: 35.2073, category: "Heritage" },
  { id: 3, name: "Ibrahimi Mosque", nameAr: "الحرم الإبراهيمي", lat: 31.5253, lng: 35.11, category: "Heritage" },
  { id: 4, name: "Gaza Archaeological Museum", nameAr: "متحف غزة الأثري", lat: 31.5017, lng: 34.4668, category: "Museum" },
  { id: 5, name: "Nablus Old City", nameAr: "البلدة القديمة في نابلس", lat: 32.2211, lng: 35.2544, category: "Historical" },
];

export const archives = [
  { id: "a1", title: "Grandfather's land deeds (1948)", count: 12, status: "Approved" as const, when: "2 days ago" },
  { id: "a2", title: "Family wedding photos — Jaffa", count: 24, status: "Pending" as const, when: "5 hours ago" },
  { id: "a3", title: "Olive grove documentation", count: 8, status: "Approved" as const, when: "1 week ago" },
  { id: "a4", title: "Oral history recordings — Teta Salma", count: 6, status: "Rejected" as const, when: "3 weeks ago" },
];
