/**
 * types/database.types.ts
 *
 * Supabase Database type definitions — matches the MVP schema.
 *
 * ⚠️ THIS FILE SHOULD BE RE-GENERATED when the database schema changes:
 *
 *   npx supabase gen types typescript --project-id <id> > types/database.types.ts
 *
 * The current version was hand-written to match:
 *   supabase/migrations/20260619000000_create_mvp_schema.sql
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          student_id: string | null
          role: Database["public"]["Enums"]["user_role"]
          program_study: string | null
          faculty: string | null
          avatar_url: string | null
          is_locked: boolean
          locked_until: string | null
          hide_leaderboard: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string
          student_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          program_study?: string | null
          faculty?: string | null
          avatar_url?: string | null
          is_locked?: boolean
          locked_until?: string | null
          hide_leaderboard?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          student_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          program_study?: string | null
          faculty?: string | null
          avatar_url?: string | null
          is_locked?: boolean
          locked_until?: string | null
          hide_leaderboard?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          id: string
          title: string
          description: string | null
          program_study: string | null
          faculty: string | null
          invite_code: string
          start_date: string
          end_date: string
          max_participants: number | null
          is_active: boolean
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          program_study?: string | null
          faculty?: string | null
          invite_code: string
          start_date: string
          end_date: string
          max_participants?: number | null
          is_active?: boolean
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          program_study?: string | null
          faculty?: string | null
          invite_code?: string
          start_date?: string
          end_date?: string
          max_participants?: number | null
          is_active?: boolean
          created_by?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      session_participants: {
        Row: {
          id: string
          session_id: string
          user_id: string
          joined_at: string
        }
        Insert: {
          id?: string
          session_id: string
          user_id: string
          joined_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          user_id?: string
          joined_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      passages: {
        Row: {
          id: string
          title: string
          content: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "passages_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          theme: Database["public"]["Enums"]["theme_preference"]
          language: Database["public"]["Enums"]["language_preference"]
          email_notifications: boolean
          inapp_notifications: boolean
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          theme?: Database["public"]["Enums"]["theme_preference"]
          language?: Database["public"]["Enums"]["language_preference"]
          email_notifications?: boolean
          inapp_notifications?: boolean
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          theme?: Database["public"]["Enums"]["theme_preference"]
          language?: Database["public"]["Enums"]["language_preference"]
          email_notifications?: boolean
          inapp_notifications?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: Database["public"]["Enums"]["notification_type"]
          is_read: boolean
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: Database["public"]["Enums"]["notification_type"]
          is_read?: boolean
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: Database["public"]["Enums"]["notification_type"]
          is_read?: boolean
          metadata?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_analyses: {
        Row: {
          id: string
          user_id: string
          attempt_id: string | null
          practice_attempt_id: string | null
          analysis_type: Database["public"]["Enums"]["analysis_type"]
          weakness_areas: Json | null
          strengths: Json | null
          recommendations: Json | null
          full_analysis: string
          model_used: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          attempt_id?: string | null
          practice_attempt_id?: string | null
          analysis_type: Database["public"]["Enums"]["analysis_type"]
          weakness_areas?: Json | null
          strengths?: Json | null
          recommendations?: Json | null
          full_analysis: string
          model_used: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          attempt_id?: string | null
          practice_attempt_id?: string | null
          analysis_type?: Database["public"]["Enums"]["analysis_type"]
          weakness_areas?: Json | null
          strengths?: Json | null
          recommendations?: Json | null
          full_analysis?: string
          model_used?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_analyses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_analyses_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "test_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_analyses_practice_attempt_id_fkey"
            columns: ["practice_attempt_id"]
            isOneToOne: false
            referencedRelation: "practice_attempts"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_attempts: {
        Row: {
          id: string
          user_id: string
          section: Database["public"]["Enums"]["question_section"]
          status: Database["public"]["Enums"]["practice_status"]
          total_questions: number
          correct_count: number | null
          score_percentage: number | null
          started_at: string
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          section: Database["public"]["Enums"]["question_section"]
          status?: Database["public"]["Enums"]["practice_status"]
          total_questions: number
          correct_count?: number | null
          score_percentage?: number | null
          started_at?: string
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          section?: Database["public"]["Enums"]["question_section"]
          status?: Database["public"]["Enums"]["practice_status"]
          total_questions?: number
          correct_count?: number | null
          score_percentage?: number | null
          started_at?: string
          completed_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "practice_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_answers: {
        Row: {
          id: string
          practice_attempt_id: string
          question_id: string
          selected_answer: string | null
          is_correct: boolean | null
          answered_at: string | null
        }
        Insert: {
          id?: string
          practice_attempt_id: string
          question_id: string
          selected_answer?: string | null
          is_correct?: boolean | null
          answered_at?: string | null
        }
        Update: {
          id?: string
          practice_attempt_id?: string
          question_id?: string
          selected_answer?: string | null
          is_correct?: boolean | null
          answered_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "practice_answers_practice_attempt_id_fkey"
            columns: ["practice_attempt_id"]
            isOneToOne: false
            referencedRelation: "practice_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "practice_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      listening_groups: {
        Row: {
          id: string
          part: Database["public"]["Enums"]["listening_part"]
          title: string | null
          transcript: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          part: Database["public"]["Enums"]["listening_part"]
          title?: string | null
          transcript?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          part?: Database["public"]["Enums"]["listening_part"]
          title?: string | null
          transcript?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "listening_groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          id: string
          section: Database["public"]["Enums"]["question_section"]
          question_text: string | null
          audio_url: string | null
          passage_id: string | null
          group_id: string | null
          order_in_group: number | null
          options: Json
          correct_answer: string
          explanation: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"] | null
          tags: string[] | null
          is_active: boolean
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          section: Database["public"]["Enums"]["question_section"]
          question_text?: string | null
          audio_url?: string | null
          passage_id?: string | null
          group_id?: string | null
          order_in_group?: number | null
          options?: Json
          correct_answer: string
          explanation?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          tags?: string[] | null
          is_active?: boolean
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          section?: Database["public"]["Enums"]["question_section"]
          question_text?: string | null
          audio_url?: string | null
          passage_id?: string | null
          group_id?: string | null
          order_in_group?: number | null
          options?: Json
          correct_answer?: string
          explanation?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          tags?: string[] | null
          is_active?: boolean
          created_by?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_passage_id_fkey"
            columns: ["passage_id"]
            isOneToOne: false
            referencedRelation: "passages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "listening_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      test_attempts: {
        Row: {
          id: string
          user_id: string
          session_id: string | null
          status: Database["public"]["Enums"]["test_status"]
          current_section: Database["public"]["Enums"]["question_section"] | null
          listening_started_at: string | null
          structure_started_at: string | null
          reading_started_at: string | null
          listening_raw: number | null
          structure_raw: number | null
          reading_raw: number | null
          listening_converted: number | null
          structure_converted: number | null
          reading_converted: number | null
          total_score: number | null
          violation_type: string | null
          started_at: string
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_id?: string | null
          status?: Database["public"]["Enums"]["test_status"]
          current_section?: Database["public"]["Enums"]["question_section"] | null
          listening_started_at?: string | null
          structure_started_at?: string | null
          reading_started_at?: string | null
          listening_raw?: number | null
          structure_raw?: number | null
          reading_raw?: number | null
          listening_converted?: number | null
          structure_converted?: number | null
          reading_converted?: number | null
          total_score?: number | null
          violation_type?: string | null
          started_at?: string
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_id?: string | null
          status?: Database["public"]["Enums"]["test_status"]
          current_section?: Database["public"]["Enums"]["question_section"] | null
          listening_started_at?: string | null
          structure_started_at?: string | null
          reading_started_at?: string | null
          listening_raw?: number | null
          structure_raw?: number | null
          reading_raw?: number | null
          listening_converted?: number | null
          structure_converted?: number | null
          reading_converted?: number | null
          total_score?: number | null
          violation_type?: string | null
          started_at?: string
          completed_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_attempts_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      test_answers: {
        Row: {
          id: string
          attempt_id: string
          question_id: string
          selected_answer: string | null
          is_correct: boolean | null
          answered_at: string | null
        }
        Insert: {
          id?: string
          attempt_id: string
          question_id: string
          selected_answer?: string | null
          is_correct?: boolean | null
          answered_at?: string | null
        }
        Update: {
          id?: string
          attempt_id?: string
          question_id?: string
          selected_answer?: string | null
          is_correct?: boolean | null
          answered_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_answers_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "test_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "student"
      question_section: "listening" | "structure" | "reading"
      difficulty_level: "easy" | "medium" | "hard"
      test_status: "in_progress" | "completed" | "violated"
      listening_part: "A" | "B" | "C"
      practice_status: "in_progress" | "completed"
      analysis_type: "simulation" | "practice"
      notification_type:
        | "session_invite"
        | "result_ready"
        | "ai_ready"
        | "account_locked"
        | "account_unlocked"
        | "reminder"
        | "system"
      theme_preference: "light" | "dark" | "system"
      language_preference: "id" | "en"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// ---------------------------------------------------------------------------
// Convenience type aliases — use these in components and server code
// ---------------------------------------------------------------------------

/** Shorthand to access any table's Row type */
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]

/** Shorthand to access any table's Insert type */
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]

/** Shorthand to access any table's Update type */
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]

/** Shorthand to access any enum type */
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T]
