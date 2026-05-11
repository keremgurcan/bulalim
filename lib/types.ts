export type ItemType = "lost" | "found"
export type ItemStatus = "active" | "matched" | "resolved" | "expired"
export type ItemCategory =
  | "electronics"
  | "wallet_card"
  | "keys"
  | "bag_luggage"
  | "jewelry"
  | "documents"
  | "clothing"
  | "pet"
  | "other"

export const CATEGORY_LABELS: Record<ItemCategory, string> = {
  electronics: "Elektronik",
  wallet_card: "Cüzdan / Kart",
  keys: "Anahtar",
  bag_luggage: "Çanta / Bavul",
  jewelry: "Mücevher",
  documents: "Belge",
  clothing: "Giyim",
  pet: "Evcil Hayvan",
  other: "Diğer",
}

export const CATEGORY_ICONS: Record<ItemCategory, string> = {
  electronics: "💻",
  wallet_card: "💳",
  keys: "🔑",
  bag_luggage: "👜",
  jewelry: "💍",
  documents: "📄",
  clothing: "👕",
  pet: "🐾",
  other: "📦",
}

export const TR_CITIES = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray", "Amasya", "Ankara",
  "Antalya", "Ardahan", "Artvin", "Aydın", "Balıkesir", "Bartın", "Batman",
  "Bayburt", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa",
  "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Düzce", "Edirne",
  "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun",
  "Gümüşhane", "Hakkari", "Hatay", "Iğdır", "Isparta", "İstanbul", "İzmir",
  "Kahramanmaraş", "Karabük", "Karaman", "Kars", "Kastamonu", "Kayseri",
  "Kilis", "Kırıkkale", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya",
  "Malatya", "Manisa", "Mardin", "Mersin", "Muğla", "Muş", "Nevşehir", "Niğde",
  "Ordu", "Osmaniye", "Rize", "Sakarya", "Samsun", "Şanlıurfa", "Siirt",
  "Sinop", "Şırnak", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli",
  "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak",
]

export interface Profile {
  id: string
  phone: string
  full_name: string
  username: string
  avatar_url: string | null
  bio: string | null
  city: string | null
  points: number
  rank: string
  is_verified: boolean
  created_at: string
}

export interface Item {
  id: string
  user_id: string
  type: ItemType
  title: string
  description: string
  category: ItemCategory
  photo_urls: string[]
  lat: number
  lng: number
  location_text: string
  city: string
  date_lost_or_found: string
  status: ItemStatus
  view_count: number
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  read_at: string | null
  created_at: string
}

export interface Conversation {
  id: string
  item_id: string
  initiator_id: string
  owner_id: string
  last_message_at: string
  created_at: string
  items?: Item
  initiator?: Profile
  owner?: Profile
  messages?: Message[]
}
