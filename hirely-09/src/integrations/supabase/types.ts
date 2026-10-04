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
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          organization: string | null
          profile_id: string
          start_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          organization?: string | null
          profile_id: string
          start_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          organization?: string | null
          profile_id?: string
          start_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      awards: {
        Row: {
          award_date: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          organization: string | null
          profile_id: string
          updated_at: string
        }
        Insert: {
          award_date?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          organization?: string | null
          profile_id: string
          updated_at?: string
        }
        Update: {
          award_date?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          organization?: string | null
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "awards_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          certificate_path: string | null
          created_at: string
          credential_id: string | null
          credential_url: string | null
          expiration_date: string | null
          id: string
          issue_date: string | null
          issuing_organization: string | null
          name: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          certificate_path?: string | null
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          expiration_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_organization?: string | null
          name: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          certificate_path?: string | null
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          expiration_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_organization?: string | null
          name?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "certifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          certificate_path: string | null
          created_at: string
          description: string | null
          duration: string | null
          end_date: string | null
          id: string
          institution: string | null
          name: string
          profile_id: string
          start_date: string | null
          updated_at: string
        }
        Insert: {
          certificate_path?: string | null
          created_at?: string
          description?: string | null
          duration?: string | null
          end_date?: string | null
          id?: string
          institution?: string | null
          name: string
          profile_id: string
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          certificate_path?: string | null
          created_at?: string
          description?: string | null
          duration?: string | null
          end_date?: string | null
          id?: string
          institution?: string | null
          name?: string
          profile_id?: string
          start_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cv_imports: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          extracted_data: Json | null
          id: string
          profile_id: string
          resume_id: string | null
          started_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          extracted_data?: Json | null
          id?: string
          profile_id: string
          resume_id?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          extracted_data?: Json | null
          id?: string
          profile_id?: string
          resume_id?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cv_imports_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cv_imports_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      education: {
        Row: {
          achievements: string | null
          created_at: string
          degree: string | null
          description: string | null
          end_date: string | null
          id: string
          institution: string
          level: string | null
          profile_id: string
          program: string | null
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          achievements?: string | null
          created_at?: string
          degree?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          institution: string
          level?: string | null
          profile_id: string
          program?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          achievements?: string | null
          created_at?: string
          degree?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          institution?: string
          level?: string | null
          profile_id?: string
          program?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      languages: {
        Row: {
          certification: string | null
          certification_date: string | null
          created_at: string
          id: string
          language: string
          overall_level: string | null
          profile_id: string
          reading_level: string | null
          speaking_level: string | null
          updated_at: string
          writing_level: string | null
        }
        Insert: {
          certification?: string | null
          certification_date?: string | null
          created_at?: string
          id?: string
          language: string
          overall_level?: string | null
          profile_id: string
          reading_level?: string | null
          speaking_level?: string | null
          updated_at?: string
          writing_level?: string | null
        }
        Update: {
          certification?: string | null
          certification_date?: string | null
          created_at?: string
          id?: string
          language?: string
          overall_level?: string | null
          profile_id?: string
          reading_level?: string | null
          speaking_level?: string | null
          updated_at?: string
          writing_level?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "languages_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      preferred_work_locations: {
        Row: {
          city: string
          country: string | null
          created_at: string
          id: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          city: string
          country?: string | null
          created_at?: string
          id?: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          city?: string
          country?: string | null
          created_at?: string
          id?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "preferred_work_locations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_experience_areas: {
        Row: {
          area: string
          created_at: string
          id: string
          profile_id: string
          updated_at: string
          years_experience: number | null
        }
        Insert: {
          area: string
          created_at?: string
          id?: string
          profile_id: string
          updated_at?: string
          years_experience?: number | null
        }
        Update: {
          area?: string
          created_at?: string
          id?: string
          profile_id?: string
          updated_at?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_experience_areas_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_skills: {
        Row: {
          created_at: string
          description: string | null
          id: string
          proficiency_level: string | null
          profile_id: string
          skill_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          proficiency_level?: string | null
          profile_id: string
          skill_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          proficiency_level?: string | null
          profile_id?: string
          skill_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_skills_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_versions: {
        Row: {
          created_at: string
          id: string
          profile_id: string
          snapshot: Json
          source: string
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id: string
          snapshot: Json
          source?: string
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string
          snapshot?: Json
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_versions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          available_from: string | null
          avatar_path: string | null
          birth_city: string | null
          birth_country: string | null
          birth_date: string | null
          career_objective: string | null
          contract_type: string | null
          created_at: string
          current_city: string | null
          current_country: string | null
          current_occupation: string | null
          desired_area: string | null
          desired_position: string | null
          document_number: string | null
          document_type: string | null
          first_name: string | null
          headline: string | null
          id: string
          last_name: string | null
          linkedin_url: string | null
          nationality: string | null
          onboarding_completed: boolean
          phone: string | null
          phone_secondary: string | null
          portfolio_url: string | null
          professional_summary: string | null
          salary_currency: string | null
          salary_expectation: number | null
          schedule_availability: string | null
          updated_at: string
          user_id: string
          website_url: string | null
          willing_to_relocate: boolean
          willing_to_travel: boolean
          work_modality: string | null
          work_schedule: string | null
          years_experience: number | null
        }
        Insert: {
          address?: string | null
          available_from?: string | null
          avatar_path?: string | null
          birth_city?: string | null
          birth_country?: string | null
          birth_date?: string | null
          career_objective?: string | null
          contract_type?: string | null
          created_at?: string
          current_city?: string | null
          current_country?: string | null
          current_occupation?: string | null
          desired_area?: string | null
          desired_position?: string | null
          document_number?: string | null
          document_type?: string | null
          first_name?: string | null
          headline?: string | null
          id?: string
          last_name?: string | null
          linkedin_url?: string | null
          nationality?: string | null
          onboarding_completed?: boolean
          phone?: string | null
          phone_secondary?: string | null
          portfolio_url?: string | null
          professional_summary?: string | null
          salary_currency?: string | null
          salary_expectation?: number | null
          schedule_availability?: string | null
          updated_at?: string
          user_id: string
          website_url?: string | null
          willing_to_relocate?: boolean
          willing_to_travel?: boolean
          work_modality?: string | null
          work_schedule?: string | null
          years_experience?: number | null
        }
        Update: {
          address?: string | null
          available_from?: string | null
          avatar_path?: string | null
          birth_city?: string | null
          birth_country?: string | null
          birth_date?: string | null
          career_objective?: string | null
          contract_type?: string | null
          created_at?: string
          current_city?: string | null
          current_country?: string | null
          current_occupation?: string | null
          desired_area?: string | null
          desired_position?: string | null
          document_number?: string | null
          document_type?: string | null
          first_name?: string | null
          headline?: string | null
          id?: string
          last_name?: string | null
          linkedin_url?: string | null
          nationality?: string | null
          onboarding_completed?: boolean
          phone?: string | null
          phone_secondary?: string | null
          portfolio_url?: string | null
          professional_summary?: string | null
          salary_currency?: string | null
          salary_expectation?: number | null
          schedule_availability?: string | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
          willing_to_relocate?: boolean
          willing_to_travel?: boolean
          work_modality?: string | null
          work_schedule?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          achievements: string | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          name: string
          organization: string | null
          profile_id: string
          role: string | null
          start_date: string | null
          technologies: string | null
          updated_at: string
          url: string | null
        }
        Insert: {
          achievements?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          organization?: string | null
          profile_id: string
          role?: string | null
          start_date?: string | null
          technologies?: string | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          achievements?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          organization?: string | null
          profile_id?: string
          role?: string | null
          start_date?: string | null
          technologies?: string | null
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      publications: {
        Row: {
          created_at: string
          description: string | null
          id: string
          profile_id: string
          publication_date: string | null
          publisher: string | null
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          profile_id: string
          publication_date?: string | null
          publisher?: string | null
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          profile_id?: string
          publication_date?: string | null
          publisher?: string | null
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "publications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      references: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          organization: string | null
          phone: string | null
          position: string | null
          profile_id: string
          relationship: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          organization?: string | null
          phone?: string | null
          position?: string | null
          profile_id: string
          relationship?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          organization?: string | null
          phone?: string | null
          position?: string | null
          profile_id?: string
          relationship?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "references_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      resumes: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          profile_id: string
          source: string
          status: string
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          profile_id: string
          source?: string
          status?: string
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          profile_id?: string
          source?: string
          status?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "resumes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      support_requests: {
        Row: {
          created_at: string
          id: string
          message: string
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          accent_color: string
          created_at: string
          id: string
          theme_mode: string
          updated_at: string
          user_id: string
        }
        Insert: {
          accent_color?: string
          created_at?: string
          id?: string
          theme_mode?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          accent_color?: string
          created_at?: string
          id?: string
          theme_mode?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      volunteering: {
        Row: {
          achievements: string | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          organization: string
          profile_id: string
          role: string | null
          start_date: string | null
          updated_at: string
        }
        Insert: {
          achievements?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          organization: string
          profile_id: string
          role?: string | null
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          achievements?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          organization?: string
          profile_id?: string
          role?: string | null
          start_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteering_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      work_experience: {
        Row: {
          achievements: string | null
          area: string | null
          city: string | null
          company: string
          contract_type: string | null
          country: string | null
          created_at: string
          currently_working: boolean
          description: string | null
          end_date: string | null
          id: string
          position: string
          profile_id: string
          responsibilities: string | null
          start_date: string | null
          updated_at: string
        }
        Insert: {
          achievements?: string | null
          area?: string | null
          city?: string | null
          company: string
          contract_type?: string | null
          country?: string | null
          created_at?: string
          currently_working?: boolean
          description?: string | null
          end_date?: string | null
          id?: string
          position: string
          profile_id: string
          responsibilities?: string | null
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          achievements?: string | null
          area?: string | null
          city?: string | null
          company?: string
          contract_type?: string | null
          country?: string | null
          created_at?: string
          currently_working?: boolean
          description?: string | null
          end_date?: string | null
          id?: string
          position?: string
          profile_id?: string
          responsibilities?: string | null
          start_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_experience_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      owns_profile: { Args: { _profile_id: string }; Returns: boolean }
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
