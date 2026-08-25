import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Sozlanmagan holatda ham sayt ishlashi kerak — shuning uchun stub qaytaramiz.
 * Stub har qanday so'rovga xatoliksiz bo'sh natija beradi.
 */
function createStub(): SupabaseClient {
  const result = { data: null, error: { message: "Supabase sozlanmagan" } };
  const builder: Record<string, unknown> = {};
  const chain = () => builder as never;
  for (const key of [
    "select",
    "insert",
    "update",
    "upsert",
    "delete",
    "eq",
    "neq",
    "order",
    "limit",
    "single",
    "maybeSingle",
  ]) {
    builder[key] = chain;
  }
  builder["then"] = (resolve: (v: unknown) => unknown) => Promise.resolve(result).then(resolve);
  return {
    from: () => builder,
  } as unknown as SupabaseClient;
}

export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : createStub();
