export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      accounts: {
        Row: {
          access_token: string | null
          expires_at: number | null
          id: string
          id_token: string | null
          provider: string | null
          provider_account_id: string | null
          refresh_token: string | null
          scope: string | null
          session_state: string | null
          token_type: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          access_token?: string | null
          expires_at?: number | null
          id: string
          id_token?: string | null
          provider?: string | null
          provider_account_id?: string | null
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          access_token?: string | null
          expires_at?: number | null
          id?: string
          id_token?: string | null
          provider?: string | null
          provider_account_id?: string | null
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type?: string | null
          user_id?: string | null
        }
      }
      purchases: {
        Row: {
          created_at: string | null
          credit_amount: number | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          credit_amount?: number | null
          id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          credit_amount?: number | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
      }
      sessions: {
        Row: {
          expires: string | null
          id: string
          session_token: string | null
          user_id: string | null
        }
        Insert: {
          expires?: string | null
          id: string
          session_token?: string | null
          user_id?: string | null
        }
        Update: {
          expires?: string | null
          id?: string
          session_token?: string | null
          user_id?: string | null
        }
      }
      users: {
        Row: {
          created_at: string
          credits: number
          email: string
          id: string
          location: string | null
          name: string
        }
        Insert: {
          created_at?: string
          credits?: number
          email: string
          id?: string
          location?: string | null
          name: string
        }
        Update: {
          created_at?: string
          credits?: number
          email?: string
          id?: string
          location?: string | null
          name?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
