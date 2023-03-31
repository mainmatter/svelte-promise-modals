// Playwright CT doesn't seem to see SvelteKit's `$app/environment`
export const browser = (() => {
  try {
    return import.meta.env.SSR ?? typeof window !== 'undefined';
  } catch (e) {
    return typeof window !== 'undefined';
  }
})();
