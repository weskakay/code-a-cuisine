/** Connection used by the hosted version. All values are meant to be public. */
export const environment = {
  supabaseUrl: 'https://vmyxyvqbmbgmmwydklff.supabase.co',
  supabaseKey: 'sb_publishable_DLb8gSUKqrdtixzSK9kJwA_FINRRJj6',
  webhookUrl: 'https://rockey107.app.n8n.cloud/webhook/generate-recipes',
  /** The workflow runs on n8n Cloud, so the hosted page can generate too. */
  generation: true,
};
