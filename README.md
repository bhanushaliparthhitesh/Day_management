# DayFlow

DayFlow is a mobile-first, anime protagonist HUD-styled daily productivity web app. It is designed to keep you motivated and energetic throughout the day, providing an immersive interface rather than a corporate look.

![DayFlow Screenshot](./screenshot.png)

## Features

- **Hero Clock & Day Progress**: A bold, neon-glowing digital clock with a dynamic greeting based on the time of day, and a progress bar showing how much of the day has elapsed.
- **Mission List (To-Dos)**: Add tasks with priority tags. Completing tasks gives you XP, levels you up, and triggers satisfying confetti bursts! Includes swipe-to-delete functionality and filter tabs.
- **Mind Dump (Sticky Notes)**: A grid of neon-colored sticky notes with slight random rotations for a handwritten feel. Expand to edit, change colors, and manage your thoughts effortlessly.
- **Desk Stand / Clock Mode**: A dedicated fullscreen clock mode with a screen wake lock (so your phone doesn't go to sleep) and auto-dimming features at night.
- **Local Storage Persistence**: All your tasks, notes, and XP are saved in your browser's local storage and persist across refreshes. No backend required!

## Tech Stack

- **Next.js 14** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS (v4)**
- **Framer Motion** for spring animations and interactions
- **Lucide React** for icons
- **Canvas Confetti** for celebration effects

## Getting Started

First, install the dependencies if you haven't already:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## Notes on Clock Mode

The fullscreen Clock Mode uses the `navigator.wakeLock` API to keep the screen awake. This API often requires HTTPS to function, so it will work perfectly when deployed (e.g., on Vercel), but might be restricted on some browsers when testing on HTTP `localhost`.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new). Since there is no backend database, deploying the static frontend is all you need to get DayFlow running globally!
