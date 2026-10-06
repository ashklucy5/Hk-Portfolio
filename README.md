# Portfolio — Nuxt + Vue + Three.js + GSAP

This is the first working implementation of the portfolio concept discussed in ChatGPT.

## What is already wired

- Nuxt 4 / Vue app
- Centered floating liquid-glass navigation
- Conversational hero
- Developer × Marketing Specialist identity
- Scroll-driven Three.js background state changes
- GSAP ScrollTrigger parallax
- GitHub project feed with server-side caching
- Resume download button
- Responsive layout and reduced-motion handling

## Run locally

```bash
npm install
npm run dev
```

## Personalize

1. Edit `app/data/profile.ts`.
2. Copy `.env.example` to `.env` and set `NUXT_PUBLIC_GITHUB_USERNAME`.
3. Replace `public/resume.pdf` with your actual resume.
4. Add the `portfolio` topic to GitHub repositories you want prioritized. If none are tagged, the route falls back to your strongest recent public repos.

## Optional GitHub token

For production, set `GITHUB_TOKEN` as a server-only environment variable to raise API limits. It is never exposed to the browser.
