// VFA Videos public frontend config. Safe to expose the publishable/anon key only.
// NEVER put a Supabase service-role key or Sightengine secret in this file.
window.VFA_SUPABASE_CONFIG = {
  url: "https://YOUR_PROJECT_REF.supabase.co",
  anonKey: "YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY"
};
