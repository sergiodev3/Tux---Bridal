/**
 * Replace this file with generated types after linking your Supabase project:
 *
 *   npx supabase gen types typescript --project-id <id> > src/types/database.ts
 *
 * Or use the Supabase CLI linked to a local project.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
