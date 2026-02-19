# Lalo The Cat

Virtual pet game with 20 levels. Built with [Diorama](https://gitlab.com/teabo/Diorama).

## Deploy on Vercel

To avoid **404 NOT_FOUND** (white screen), set the **Root Directory** to `dist`:

1. Vercel Dashboard → your project → **Settings** → **General**
2. **Root Directory** → set to `dist` (or enable and type `dist`)
3. Save and **Redeploy**

The app entry point is `dist/index.html`; without this, Vercel serves the repo root where there is no `index.html`.