// ============================================================
// HARDCODED MOCK DATA — replaces Supabase DB calls
// ============================================================

export type DbEvent = {
  id: string;
  title: string;
  title_ar: string | null;
  description: string | null;
  event_date: string;
  start_time: string;
  end_time: string;
  location_name: string;
  location_name_ar: string | null;
  ticket_price: number;
  currency: string;
  total_seats: number;
  seats_remaining: number;
  organizer_name: string | null;
};

export type DbLocation = {
  id: string;
  name: string;
  name_ar: string | null;
  latitude: number;
  longitude: number;
  category: string;
  description: string | null;
  description_ar: string | null;
  primary_image_url: string | null;
  extra_images: string[];
};

export const MOCK_EVENTS: DbEvent[] = [
  {
    id: "evt-001",
    title: "Palestinian Embroidery & Tatreez Workshop",
    title_ar: "ورشة التطريز الفلسطيني",
    description:
      "Join us for a hands-on workshop exploring the rich tradition of Palestinian tatreez embroidery. Learn the symbolic patterns passed down through generations and create your own piece to take home. All materials provided.",
    event_date: "2026-05-10",
    start_time: "10:00:00",
    end_time: "13:00:00",
    location_name: "Palestinian Cultural Centre, London",
    location_name_ar: "المركز الثقافي الفلسطيني، لندن",
    ticket_price: 15,
    currency: "GBP",
    total_seats: 30,
    seats_remaining: 8,
    organizer_name: "Athar Heritage Foundation",
  },
  {
    id: "evt-002",
    title: "London Palestinian Book Fair 2026",
    title_ar: "معرض الكتاب الفلسطيني في لندن ٢٠٢٦",
    description:
      "A celebration of Palestinian literature, poetry, and storytelling. Browse hundreds of titles, meet authors, and attend readings throughout the day. Free entry for all.",
    event_date: "2026-05-17",
    start_time: "09:00:00",
    end_time: "18:00:00",
    location_name: "Southbank Centre, London",
    location_name_ar: "مركز ساوثبانك، لندن",
    ticket_price: 0,
    currency: "GBP",
    total_seats: 500,
    seats_remaining: 342,
    organizer_name: "Palestine Book Awards",
  },
  {
    id: "evt-003",
    title: "Heritage Photography Exhibition: Remembering Palestine",
    title_ar: "معرض صور التراث: تذكّر فلسطين",
    description:
      "A curated exhibition of archival and contemporary photographs documenting Palestinian villages, landscapes, and daily life from 1900 to the present day.",
    event_date: "2026-06-01",
    start_time: "11:00:00",
    end_time: "20:00:00",
    location_name: "Rich Mix Cultural Foundation, London",
    location_name_ar: "مؤسسة ريتش ميكس الثقافية، لندن",
    ticket_price: 8,
    currency: "GBP",
    total_seats: 120,
    seats_remaining: 55,
    organizer_name: "Visualising Palestine",
  },
  {
    id: "evt-004",
    title: "Dabke Dance Performance & Community Evening",
    title_ar: "عرض الدبكة وأمسية مجتمعية",
    description:
      "An evening of traditional Palestinian Dabke dance performances by local youth groups, followed by a communal dinner featuring traditional Palestinian cuisine.",
    event_date: "2026-06-14",
    start_time: "18:00:00",
    end_time: "22:00:00",
    location_name: "The Mosaic Rooms, London",
    location_name_ar: "قاعة موزاييك، لندن",
    ticket_price: 12,
    currency: "GBP",
    total_seats: 80,
    seats_remaining: 23,
    organizer_name: "Athar Heritage Foundation",
  },
];

export const MOCK_LOCATIONS: DbLocation[] = [
  {
    id: "loc-001",
    name: "Al-Aqsa Mosque",
    name_ar: "المسجد الأقصى",
    latitude: 31.7781,
    longitude: 35.2359,
    category: "mosque",
    description:
      "Al-Aqsa Mosque is one of the oldest mosques in the world and the third holiest site in Islam. Located in the Old City of Jerusalem, it has been a centre of Islamic worship and Palestinian cultural identity for over 1,300 years.",
    description_ar:
      "المسجد الأقصى المبارك هو ثالث الحرمين الشريفين وأحد أعرق المساجد في العالم.",
    primary_image_url: null,
    extra_images: [],
  },
  {
    id: "loc-002",
    name: "Church of the Nativity",
    name_ar: "كنيسة المهد",
    latitude: 31.7044,
    longitude: 35.2077,
    category: "church",
    description:
      "The Church of the Nativity in Bethlehem is one of the oldest continuously operating churches in the world, built over the site traditionally believed to be the birthplace of Jesus. It is a UNESCO World Heritage Site.",
    description_ar:
      "كنيسة المهد في بيت لحم هي من أقدم الكنائس في العالم وموقع مسجّل على قائمة التراث العالمي لليونسكو.",
    primary_image_url: null,
    extra_images: [],
  },
  {
    id: "loc-003",
    name: "Palestinian Museum",
    name_ar: "المتحف الفلسطيني",
    latitude: 31.9074,
    longitude: 35.2058,
    category: "museum",
    description:
      "Located in Birzeit, the Palestinian Museum is dedicated to Palestinian history, society, and culture. It holds rotating exhibitions exploring Palestinian identity and heritage through art, artefacts, and archives.",
    description_ar:
      "المتحف الفلسطيني في بيرزيت مؤسسة ثقافية مستقلة تعكف على صون التراث الفلسطيني وإبرازه للعالم.",
    primary_image_url: null,
    extra_images: [],
  },
  {
    id: "loc-004",
    name: "Hisham's Palace",
    name_ar: "قصر هشام",
    latitude: 31.8997,
    longitude: 35.4358,
    category: "historical",
    description:
      "Hisham's Palace (Khirbat al-Mafjar) is an 8th-century Umayyad archaeological site near Jericho, renowned for its intricate mosaic floors and elaborate stucco decorations — among the finest examples of early Islamic art.",
    description_ar:
      "قصر هشام أو خربة المفجر أثر أموي يعود للقرن الثامن الميلادي، يشتهر بفسيفسائه الرائعة وزخارفه الجصية الفريدة.",
    primary_image_url: null,
    extra_images: [],
  },
  {
    id: "loc-005",
    name: "Nablus Old City",
    name_ar: "البلدة القديمة في نابلس",
    latitude: 32.2218,
    longitude: 35.2611,
    category: "historical",
    description:
      "The Old City of Nablus is home to ancient souqs, Ottoman-era hammams, and historic mosques. Known for its traditional soap-making industry and the famous Nabulsi cheese, it remains a living testament to Palestinian urban heritage.",
    description_ar:
      "تزخر البلدة القديمة في نابلس بأسواقها العريقة وحماماتها العثمانية ومساجدها التاريخية، وتشتهر بصناعة الصابون والجبن النابلسي.",
    primary_image_url: null,
    extra_images: [],
  },
  {
    id: "loc-006",
    name: "Khalil al-Sakakini Cultural Centre",
    name_ar: "مركز خليل السكاكيني الثقافي",
    latitude: 31.9067,
    longitude: 35.2147,
    category: "museum",
    description:
      "Based in Ramallah, this cultural centre promotes Palestinian arts and culture through exhibitions, performances, residencies, and community programmes. It is housed in a restored Ottoman-era mansion.",
    description_ar:
      "مركز ثقافي في رام الله يحتضن المبادرات الفنية والثقافية الفلسطينية في مبنى أثري مُرمَّم.",
    primary_image_url: null,
    extra_images: [],
  },
];

// In-memory saved events (resets on page refresh — no DB needed)
const _savedEventIds = new Set<string>();

export function getSavedEventIds(): string[] {
  return Array.from(_savedEventIds);
}

export function toggleSavedEventLocal(eventId: string, wasSaved: boolean) {
  if (wasSaved) {
    _savedEventIds.delete(eventId);
  } else {
    _savedEventIds.add(eventId);
  }
}

export function getEventById(id: string): DbEvent | null {
  return MOCK_EVENTS.find((e) => e.id === id) ?? null;
}

export function getLocationById(id: string): DbLocation | null {
  return MOCK_LOCATIONS.find((l) => l.id === id) ?? null;
}
