import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as WebSocket from 'ws';

// Force the existence of a global WebSocket constructor
(globalThis as unknown as { WebSocket: typeof WebSocket }).WebSocket =
  WebSocket;

type Database = any;

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient<Database, 'public', Database>;
  private supabaseAdmin: SupabaseClient<Database, 'public', Database>;

  constructor() {
    this.supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
    );
    this.supabaseAdmin = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE!,
    );
  }

  get client(): SupabaseClient {
    return this.supabase;
  }

  get adminClient(): SupabaseClient {
    return this.supabaseAdmin;
  }
}
