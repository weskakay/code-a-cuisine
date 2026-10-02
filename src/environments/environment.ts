/** Connection to the database and the workflow. All values are meant to be public. */
export const environment = {
  supabaseUrl: 'https://vmyxyvqbmbgmmwydklff.supabase.co',
  supabaseKey: 'sb_publishable_DLb8gSUKqrdtixzSK9kJwA_FINRRJj6',
  webhookUrl: 'http://localhost:5678/webhook/generate-recipes',
  /** The workflow is reachable, so the generator is switched on. */
  generation: true,
};
