// Custom types to replace Supabase SDK types
export interface AuthUser {
  id: string
  email?: string
  created_at?: string
  user_metadata?: Record<string, any>
}

export interface Profile {
  id: string
  user_id: string
  first_name?: string
  last_name?: string
  age?: number
  gender?: string
  height_cm?: number
  weight_kg?: number
  activity_level?: string
  created_at?: string
  updated_at?: string
}

export interface Goals {
  id: string
  user_id: string
  daily_calories: number
  daily_protein_g: number
  daily_carbs_g: number
  daily_fat_g: number
  created_at?: string
  updated_at?: string
}
