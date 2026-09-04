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
      achievements: {
        Row: {
          achievement_type: string | null
          athlete_id: string | null
          created_at: string | null
          date: string | null
          description: string | null
          id: string
          match_id: string | null
          title: string | null
          tournament_id: string | null
          updated_at_db: string
          verified: boolean | null
          verified_by: string | null
        }
        Insert: {
          achievement_type?: string | null
          athlete_id?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          id: string
          match_id?: string | null
          title?: string | null
          tournament_id?: string | null
          updated_at_db?: string
          verified?: boolean | null
          verified_by?: string | null
        }
        Update: {
          achievement_type?: string | null
          athlete_id?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          match_id?: string | null
          title?: string | null
          tournament_id?: string | null
          updated_at_db?: string
          verified?: boolean | null
          verified_by?: string | null
        }
        Relationships: []
      }
      app_users: {
        Row: {
          auth_user_id: string | null
          city_id: string | null
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          name: string | null
          phone: string | null
          profile_image: string | null
          role: string | null
          updated_at: string | null
          updated_at_db: string
        }
        Insert: {
          auth_user_id?: string | null
          city_id?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          is_active?: boolean | null
          name?: string | null
          phone?: string | null
          profile_image?: string | null
          role?: string | null
          updated_at?: string | null
          updated_at_db?: string
        }
        Update: {
          auth_user_id?: string | null
          city_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          phone?: string | null
          profile_image?: string | null
          role?: string | null
          updated_at?: string | null
          updated_at_db?: string
        }
        Relationships: []
      }
      athletes: {
        Row: {
          age_category: string | null
          bio: string | null
          city_id: string | null
          city_name: string | null
          college_id: string | null
          college_name: string | null
          created_at: string | null
          date_of_birth: string | null
          enrollment_year: string | null
          gender: string | null
          goals: number | null
          id: string
          losses: number | null
          matches_played: number | null
          name: string | null
          position: string | null
          position_group: string | null
          primary_sport: string | null
          profile_image: string | null
          secondary_sports: Json
          skills: Json
          tournaments_played: number | null
          updated_at: string | null
          updated_at_db: string
          user_id: string | null
          verification_status: string | null
          verified_achievements_count: number | null
          wins: number | null
        }
        Insert: {
          age_category?: string | null
          bio?: string | null
          city_id?: string | null
          city_name?: string | null
          college_id?: string | null
          college_name?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          enrollment_year?: string | null
          gender?: string | null
          goals?: number | null
          id: string
          losses?: number | null
          matches_played?: number | null
          name?: string | null
          position?: string | null
          position_group?: string | null
          primary_sport?: string | null
          profile_image?: string | null
          secondary_sports?: Json
          skills?: Json
          tournaments_played?: number | null
          updated_at?: string | null
          updated_at_db?: string
          user_id?: string | null
          verification_status?: string | null
          verified_achievements_count?: number | null
          wins?: number | null
        }
        Update: {
          age_category?: string | null
          bio?: string | null
          city_id?: string | null
          city_name?: string | null
          college_id?: string | null
          college_name?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          enrollment_year?: string | null
          gender?: string | null
          goals?: number | null
          id?: string
          losses?: number | null
          matches_played?: number | null
          name?: string | null
          position?: string | null
          position_group?: string | null
          primary_sport?: string | null
          profile_image?: string | null
          secondary_sports?: Json
          skills?: Json
          tournaments_played?: number | null
          updated_at?: string | null
          updated_at_db?: string
          user_id?: string | null
          verification_status?: string | null
          verified_achievements_count?: number | null
          wins?: number | null
        }
        Relationships: []
      }
      cities: {
        Row: {
          active: boolean | null
          country: string | null
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          name: string | null
          state: string | null
          updated_at_db: string
        }
        Insert: {
          active?: boolean | null
          country?: string | null
          created_at?: string
          id: string
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          state?: string | null
          updated_at_db?: string
        }
        Update: {
          active?: boolean | null
          country?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          state?: string | null
          updated_at_db?: string
        }
        Relationships: []
      }
      college_records: {
        Row: {
          admin_verified_by: string | null
          athlete_id: string | null
          athlete_name: string | null
          college_id: string | null
          college_name: string | null
          college_verified_by: string | null
          created_at: string
          description: string | null
          event_name: string | null
          id: string
          level: string | null
          represented_for: string | null
          season: string | null
          sport_id: string | null
          sport_name: string | null
          status: string | null
          submitted_at: string | null
          title: string | null
          updated_at: string | null
          updated_at_db: string
        }
        Insert: {
          admin_verified_by?: string | null
          athlete_id?: string | null
          athlete_name?: string | null
          college_id?: string | null
          college_name?: string | null
          college_verified_by?: string | null
          created_at?: string
          description?: string | null
          event_name?: string | null
          id: string
          level?: string | null
          represented_for?: string | null
          season?: string | null
          sport_id?: string | null
          sport_name?: string | null
          status?: string | null
          submitted_at?: string | null
          title?: string | null
          updated_at?: string | null
          updated_at_db?: string
        }
        Update: {
          admin_verified_by?: string | null
          athlete_id?: string | null
          athlete_name?: string | null
          college_id?: string | null
          college_name?: string | null
          college_verified_by?: string | null
          created_at?: string
          description?: string | null
          event_name?: string | null
          id?: string
          level?: string | null
          represented_for?: string | null
          season?: string | null
          sport_id?: string | null
          sport_name?: string | null
          status?: string | null
          submitted_at?: string | null
          title?: string | null
          updated_at?: string | null
          updated_at_db?: string
        }
        Relationships: []
      }
      colleges: {
        Row: {
          city_id: string | null
          city_name: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string | null
          short_name: string | null
          sports_event_name: string | null
          updated_at: string | null
          updated_at_db: string
          user_id: string | null
          verification_status: string | null
        }
        Insert: {
          city_id?: string | null
          city_name?: string | null
          created_at?: string | null
          description?: string | null
          id: string
          name?: string | null
          short_name?: string | null
          sports_event_name?: string | null
          updated_at?: string | null
          updated_at_db?: string
          user_id?: string | null
          verification_status?: string | null
        }
        Update: {
          city_id?: string | null
          city_name?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string | null
          short_name?: string | null
          sports_event_name?: string | null
          updated_at?: string | null
          updated_at_db?: string
          user_id?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      connections: {
        Row: {
          athlete_id: string | null
          created_at: string | null
          id: string
          scout_user_id: string | null
          status: string | null
          updated_at_db: string
        }
        Insert: {
          athlete_id?: string | null
          created_at?: string | null
          id: string
          scout_user_id?: string | null
          status?: string | null
          updated_at_db?: string
        }
        Update: {
          athlete_id?: string | null
          created_at?: string | null
          id?: string
          scout_user_id?: string | null
          status?: string | null
          updated_at_db?: string
        }
        Relationships: []
      }
      field_submissions: {
        Row: {
          address: string | null
          attachment_name: string | null
          attachment_url: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          gps: string | null
          id: string
          kind: string | null
          locality: string | null
          notes: string | null
          review_note: string | null
          sport_id: string | null
          start_date: string | null
          status: string | null
          submitted_at: string | null
          title: string | null
          updated_at: string | null
          updated_at_db: string
          verified_by: string | null
          volunteer_id: string | null
          zone_id: string | null
          zone_name: string | null
        }
        Insert: {
          address?: string | null
          attachment_name?: string | null
          attachment_url?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          gps?: string | null
          id: string
          kind?: string | null
          locality?: string | null
          notes?: string | null
          review_note?: string | null
          sport_id?: string | null
          start_date?: string | null
          status?: string | null
          submitted_at?: string | null
          title?: string | null
          updated_at?: string | null
          updated_at_db?: string
          verified_by?: string | null
          volunteer_id?: string | null
          zone_id?: string | null
          zone_name?: string | null
        }
        Update: {
          address?: string | null
          attachment_name?: string | null
          attachment_url?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          gps?: string | null
          id?: string
          kind?: string | null
          locality?: string | null
          notes?: string | null
          review_note?: string | null
          sport_id?: string | null
          start_date?: string | null
          status?: string | null
          submitted_at?: string | null
          title?: string | null
          updated_at?: string | null
          updated_at_db?: string
          verified_by?: string | null
          volunteer_id?: string | null
          zone_id?: string | null
          zone_name?: string | null
        }
        Relationships: []
      }
      matches: {
        Row: {
          created_at: string | null
          id: string
          match_number: number | null
          result_status: string | null
          round: string | null
          scheduled_at: string | null
          status: string | null
          team_a_id: string | null
          team_a_score: number | null
          team_b_id: string | null
          team_b_score: number | null
          tournament_id: string | null
          updated_at: string | null
          updated_at_db: string
          venue: string | null
          winner_id: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          match_number?: number | null
          result_status?: string | null
          round?: string | null
          scheduled_at?: string | null
          status?: string | null
          team_a_id?: string | null
          team_a_score?: number | null
          team_b_id?: string | null
          team_b_score?: number | null
          tournament_id?: string | null
          updated_at?: string | null
          updated_at_db?: string
          venue?: string | null
          winner_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          match_number?: number | null
          result_status?: string | null
          round?: string | null
          scheduled_at?: string | null
          status?: string | null
          team_a_id?: string | null
          team_a_score?: number | null
          team_b_id?: string | null
          team_b_score?: number | null
          tournament_id?: string | null
          updated_at?: string | null
          updated_at_db?: string
          venue?: string | null
          winner_id?: string | null
        }
        Relationships: []
      }
      organizers: {
        Row: {
          city_id: string | null
          city_name: string | null
          created_at: string | null
          description: string | null
          email: string | null
          id: string
          logo: string | null
          organization_name: string | null
          organization_type: string | null
          phone: string | null
          tournaments_hosted: number | null
          updated_at: string | null
          updated_at_db: string
          user_id: string | null
          verification_status: string | null
        }
        Insert: {
          city_id?: string | null
          city_name?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id: string
          logo?: string | null
          organization_name?: string | null
          organization_type?: string | null
          phone?: string | null
          tournaments_hosted?: number | null
          updated_at?: string | null
          updated_at_db?: string
          user_id?: string | null
          verification_status?: string | null
        }
        Update: {
          city_id?: string | null
          city_name?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          logo?: string | null
          organization_name?: string | null
          organization_type?: string | null
          phone?: string | null
          tournaments_hosted?: number | null
          updated_at?: string | null
          updated_at_db?: string
          user_id?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      player_performances: {
        Row: {
          assists: number | null
          athlete_id: string | null
          bonus_points: number | null
          created_at: string | null
          goals: number | null
          id: string
          match_id: string | null
          performance_notes: string | null
          player_of_match: boolean | null
          points: number | null
          raid_points: number | null
          tackle_points: number | null
          team_id: string | null
          tournament_id: string | null
          updated_at_db: string
          verified: boolean | null
        }
        Insert: {
          assists?: number | null
          athlete_id?: string | null
          bonus_points?: number | null
          created_at?: string | null
          goals?: number | null
          id: string
          match_id?: string | null
          performance_notes?: string | null
          player_of_match?: boolean | null
          points?: number | null
          raid_points?: number | null
          tackle_points?: number | null
          team_id?: string | null
          tournament_id?: string | null
          updated_at_db?: string
          verified?: boolean | null
        }
        Update: {
          assists?: number | null
          athlete_id?: string | null
          bonus_points?: number | null
          created_at?: string | null
          goals?: number | null
          id?: string
          match_id?: string | null
          performance_notes?: string | null
          player_of_match?: boolean | null
          points?: number | null
          raid_points?: number | null
          tackle_points?: number | null
          team_id?: string | null
          tournament_id?: string | null
          updated_at_db?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      registrations: {
        Row: {
          athlete_id: string | null
          created_at: string
          id: string
          payment_status: string | null
          registration_date: string | null
          seed_number: number | null
          status: string | null
          team_id: string | null
          tournament_id: string | null
          updated_at_db: string
        }
        Insert: {
          athlete_id?: string | null
          created_at?: string
          id: string
          payment_status?: string | null
          registration_date?: string | null
          seed_number?: number | null
          status?: string | null
          team_id?: string | null
          tournament_id?: string | null
          updated_at_db?: string
        }
        Update: {
          athlete_id?: string | null
          created_at?: string
          id?: string
          payment_status?: string | null
          registration_date?: string | null
          seed_number?: number | null
          status?: string | null
          team_id?: string | null
          tournament_id?: string | null
          updated_at_db?: string
        }
        Relationships: []
      }
      saved_athletes: {
        Row: {
          athlete_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          athlete_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          athlete_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      sports: {
        Row: {
          active: boolean | null
          created_at: string
          icon: string | null
          id: string
          name: string | null
          updated_at_db: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          icon?: string | null
          id: string
          name?: string | null
          updated_at_db?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          icon?: string | null
          id?: string
          name?: string | null
          updated_at_db?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          captain_id: string | null
          city_id: string | null
          city_name: string | null
          coach_id: string | null
          created_at: string | null
          id: string
          logo: string | null
          name: string | null
          players: Json
          sport_id: string | null
          sport_name: string | null
          updated_at_db: string
        }
        Insert: {
          captain_id?: string | null
          city_id?: string | null
          city_name?: string | null
          coach_id?: string | null
          created_at?: string | null
          id: string
          logo?: string | null
          name?: string | null
          players?: Json
          sport_id?: string | null
          sport_name?: string | null
          updated_at_db?: string
        }
        Update: {
          captain_id?: string | null
          city_id?: string | null
          city_name?: string | null
          coach_id?: string | null
          created_at?: string | null
          id?: string
          logo?: string | null
          name?: string | null
          players?: Json
          sport_id?: string | null
          sport_name?: string | null
          updated_at_db?: string
        }
        Relationships: []
      }
      tournaments: {
        Row: {
          address: string | null
          admin_verified: boolean | null
          age_category: string | null
          banner_image: string | null
          city_id: string | null
          city_name: string | null
          created_at: string | null
          current_participants: number | null
          description: string | null
          end_date: string | null
          format: string | null
          gender_category: string | null
          id: string
          max_participants: number | null
          name: string | null
          organizer_id: string | null
          organizer_name: string | null
          prize_pool: number | null
          registration_deadline: string | null
          registration_fee: number | null
          sport_id: string | null
          sport_name: string | null
          start_date: string | null
          status: string | null
          updated_at: string | null
          updated_at_db: string
          venue: string | null
        }
        Insert: {
          address?: string | null
          admin_verified?: boolean | null
          age_category?: string | null
          banner_image?: string | null
          city_id?: string | null
          city_name?: string | null
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          end_date?: string | null
          format?: string | null
          gender_category?: string | null
          id: string
          max_participants?: number | null
          name?: string | null
          organizer_id?: string | null
          organizer_name?: string | null
          prize_pool?: number | null
          registration_deadline?: string | null
          registration_fee?: number | null
          sport_id?: string | null
          sport_name?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
          updated_at_db?: string
          venue?: string | null
        }
        Update: {
          address?: string | null
          admin_verified?: boolean | null
          age_category?: string | null
          banner_image?: string | null
          city_id?: string | null
          city_name?: string | null
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          end_date?: string | null
          format?: string | null
          gender_category?: string | null
          id?: string
          max_participants?: number | null
          name?: string | null
          organizer_id?: string | null
          organizer_name?: string | null
          prize_pool?: number | null
          registration_deadline?: string | null
          registration_fee?: number | null
          sport_id?: string | null
          sport_name?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
          updated_at_db?: string
          venue?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      verifications: {
        Row: {
          created_at: string
          id: string
          match_id: string | null
          organizer_id: string | null
          status: string | null
          tournament_id: string | null
          updated_at_db: string
          verification_note: string | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          id: string
          match_id?: string | null
          organizer_id?: string | null
          status?: string | null
          tournament_id?: string | null
          updated_at_db?: string
          verification_note?: string | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          match_id?: string | null
          organizer_id?: string | null
          status?: string | null
          tournament_id?: string | null
          updated_at_db?: string
          verification_note?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      volunteers: {
        Row: {
          city_id: string | null
          created_at: string | null
          id: string
          joined_at: string | null
          name: string | null
          phone: string | null
          updated_at: string | null
          updated_at_db: string
          user_id: string | null
          zone_id: string | null
          zone_name: string | null
        }
        Insert: {
          city_id?: string | null
          created_at?: string | null
          id: string
          joined_at?: string | null
          name?: string | null
          phone?: string | null
          updated_at?: string | null
          updated_at_db?: string
          user_id?: string | null
          zone_id?: string | null
          zone_name?: string | null
        }
        Update: {
          city_id?: string | null
          created_at?: string | null
          id?: string
          joined_at?: string | null
          name?: string | null
          phone?: string | null
          updated_at?: string | null
          updated_at_db?: string
          user_id?: string | null
          zone_id?: string | null
          zone_name?: string | null
        }
        Relationships: []
      }
      zones: {
        Row: {
          city_id: string | null
          city_name: string | null
          created_at: string
          id: string
          latitude: number | null
          localities: Json
          longitude: number | null
          name: string | null
          updated_at_db: string
        }
        Insert: {
          city_id?: string | null
          city_name?: string | null
          created_at?: string
          id: string
          latitude?: number | null
          localities?: Json
          longitude?: number | null
          name?: string | null
          updated_at_db?: string
        }
        Update: {
          city_id?: string | null
          city_name?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          localities?: Json
          longitude?: number | null
          name?: string | null
          updated_at_db?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "college"
        | "organizer"
        | "volunteer"
        | "scout"
        | "athlete"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "college",
        "organizer",
        "volunteer",
        "scout",
        "athlete",
      ],
    },
  },
} as const
