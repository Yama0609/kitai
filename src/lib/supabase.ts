import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// TypeScript型定義
export type Database = {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          name: string
          price: number | null
          location: string | null
          yield_rate: number | null
          property_type: string | null
          build_year: number | null
          description: string | null
          image_url: string | null
          created_at: string
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          user_message: string
          bot_response: string | null
          extracted_conditions: any | null
          matched_properties: any | null
          created_at: string
        }
        Insert: {
          user_id: string
          user_message: string
          bot_response?: string | null
          extracted_conditions?: any | null
          matched_properties?: any | null
        }
      }
    }
  }
}
