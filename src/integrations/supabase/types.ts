export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      archive_documents: {
        Row: {
          file_name: string
          file_path: string
          file_size_bytes: number | null
          file_type: string
          id: string
          record_id: string
          uploaded_at: string
        }
        Insert: {
          file_name: string
          file_path: string
          file_size_bytes?: number | null
          file_type: string
          id?: string
          record_id: string
          uploaded_at?: string
        }
        Update: {
          file_name?: string
          file_path?: string
          file_size_bytes?: number | null
          file_type?: string
          id?: string
          record_id?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "archive_documents_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "archive_records"
            referencedColumns: ["id"]
          },
        ]
      }
      archive_images: {
        Row: {
          file_name: string
          file_path: string
          file_size_bytes: number | null
          id: string
          record_id: string
          uploaded_at: string
        }
        Insert: {
          file_name: string
          file_path: string
          file_size_bytes?: number | null
          id?: string
          record_id: string
          uploaded_at?: string
        }
        Update: {
          file_name?: string
          file_path?: string
          file_size_bytes?: number | null
          id?: string
          record_id?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "archive_images_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "archive_records"
            referencedColumns: ["id"]
          },
        ]
      }
      archive_records: {
        Row: {
          created_at: string
          description: string | null
          id: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submitted_at: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      event_bookings: {
        Row: {
          attendee_email: string | null
          attendee_name: string | null
          attendee_phone: string | null
          booked_at: string
          event_id: string
          id: string
          payment_method: string | null
          payment_reference: string | null
          payment_status: string
          receipt_url: string | null
          ticket_qr_code: string | null
          ticket_quantity: number
          total_amount: number
          user_id: string
        }
        Insert: {
          attendee_email?: string | null
          attendee_name?: string | null
          attendee_phone?: string | null
          booked_at?: string
          event_id: string
          id?: string
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string
          receipt_url?: string | null
          ticket_qr_code?: string | null
          ticket_quantity?: number
          total_amount: number
          user_id: string
        }
        Update: {
          attendee_email?: string | null
          attendee_name?: string | null
          attendee_phone?: string | null
          booked_at?: string
          event_id?: string
          id?: string
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string
          receipt_url?: string | null
          ticket_qr_code?: string | null
          ticket_quantity?: number
          total_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          currency: string
          description: string | null
          end_time: string
          event_date: string
          id: string
          image_url: string | null
          location_name: string
          location_name_ar: string | null
          organizer_id: string | null
          organizer_name: string | null
          seats_remaining: number
          start_time: string
          status: string
          ticket_price: number
          title: string
          title_ar: string | null
          total_seats: number
        }
        Insert: {
          created_at?: string
          currency?: string
          description?: string | null
          end_time: string
          event_date: string
          id?: string
          image_url?: string | null
          location_name: string
          location_name_ar?: string | null
          organizer_id?: string | null
          organizer_name?: string | null
          seats_remaining: number
          start_time: string
          status?: string
          ticket_price?: number
          title: string
          title_ar?: string | null
          total_seats: number
        }
        Update: {
          created_at?: string
          currency?: string
          description?: string | null
          end_time?: string
          event_date?: string
          id?: string
          image_url?: string | null
          location_name?: string
          location_name_ar?: string | null
          organizer_id?: string | null
          organizer_name?: string | null
          seats_remaining?: number
          start_time?: string
          status?: string
          ticket_price?: number
          title?: string
          title_ar?: string | null
          total_seats?: number
        }
        Relationships: []
      }
      location_archive_links: {
        Row: {
          archive_record_id: string
          created_at: string
          id: string
          location_id: string
        }
        Insert: {
          archive_record_id: string
          created_at?: string
          id?: string
          location_id: string
        }
        Update: {
          archive_record_id?: string
          created_at?: string
          id?: string
          location_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "location_archive_links_archive_record_id_fkey"
            columns: ["archive_record_id"]
            isOneToOne: false
            referencedRelation: "archive_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "location_archive_links_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "map_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      location_artifacts: {
        Row: {
          artifact_name: string
          artifact_name_ar: string | null
          description: string | null
          id: string
          image_url: string | null
          location_id: string
        }
        Insert: {
          artifact_name: string
          artifact_name_ar?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          location_id: string
        }
        Update: {
          artifact_name?: string
          artifact_name_ar?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          location_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "location_artifacts_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "map_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      location_media: {
        Row: {
          after_image_url: string | null
          before_image_url: string | null
          caption: string | null
          id: string
          location_id: string
          year_after: number | null
          year_before: number | null
        }
        Insert: {
          after_image_url?: string | null
          before_image_url?: string | null
          caption?: string | null
          id?: string
          location_id: string
          year_after?: number | null
          year_before?: number | null
        }
        Update: {
          after_image_url?: string | null
          before_image_url?: string | null
          caption?: string | null
          id?: string
          location_id?: string
          year_after?: number | null
          year_before?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "location_media_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "map_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      map_locations: {
        Row: {
          category: string
          created_at: string
          description: string | null
          description_ar: string | null
          extra_images: string[]
          id: string
          is_active: boolean
          latitude: number
          longitude: number
          name: string
          name_ar: string | null
          primary_image_url: string | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          description_ar?: string | null
          extra_images?: string[]
          id?: string
          is_active?: boolean
          latitude: number
          longitude: number
          name: string
          name_ar?: string | null
          primary_image_url?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          description_ar?: string | null
          extra_images?: string[]
          id?: string
          is_active?: boolean
          latitude?: number
          longitude?: number
          name?: string
          name_ar?: string | null
          primary_image_url?: string | null
        }
        Relationships: []
      }
      saved_events: {
        Row: {
          event_id: string
          id: string
          saved_at: string
          user_id: string
        }
        Insert: {
          event_id: string
          id?: string
          saved_at?: string
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          saved_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_events_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      vault_family_members: {
        Row: {
          access_level: string
          id: string
          invited_at: string
          member_user_id: string
          vault_id: string
        }
        Insert: {
          access_level?: string
          id?: string
          invited_at?: string
          member_user_id: string
          vault_id: string
        }
        Update: {
          access_level?: string
          id?: string
          invited_at?: string
          member_user_id?: string
          vault_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vault_family_members_vault_id_fkey"
            columns: ["vault_id"]
            isOneToOne: false
            referencedRelation: "vaults"
            referencedColumns: ["id"]
          },
        ]
      }
      vaults: {
        Row: {
          created_at: string
          family_access_code: string | null
          id: string
          locked_until: string | null
          pin_attempts: number
          pin_hash: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          family_access_code?: string | null
          id?: string
          locked_until?: string | null
          pin_attempts?: number
          pin_hash: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          family_access_code?: string | null
          id?: string
          locked_until?: string | null
          pin_attempts?: number
          pin_hash?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
