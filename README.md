# Interactive 3D Portfolio

Welcome to my personal portfolio! This project is a highly interactive, performance-focused web experience built with Next.js and standard CSS Modules. It features a unique 3D scroll-synchronized navigation reel, dynamic theming, and an immersive custom design system.

## 🌟 Architecture & Technical Decisions

Recently, I completed a major refactor of this codebase to prioritize **SOLID principles, modularity, and raw performance**. 

### 1. Migrating to Standard CSS Modules
To maintain strict separation of concerns and keep our components truly independent, I moved away from utility-based CSS frameworks (like Tailwind). Every component now has its own strictly scoped `.module.css` file. This means:
- No global class name collisions.
- Cleaner, semantic JSX.
- Components are fully portable and encapsulated.

### 2. Hardware-Accelerated 3D Scroll Synchronization
One of the core features of this site is the **3D Navigation Reel**, which renders a live miniature version of the site as you scroll. 
- To achieve buttery-smooth 60fps performance, the scroll synchronization bypasses React's render lifecycle completely. 
- A custom `useScrollSync` hook hooks into the browser's native `requestAnimationFrame` and directly updates the `translateY` transforms on the DOM nodes. 
- The 3D reel uses standard CSS `preserve-3d` and `perspective` combined with React state to handle navigation events instantly.

### 3. Dynamic "Firefly" Theming System
The site features a dynamic, glassmorphic theme switcher that alters CSS variables (`--accent-hex`, background colors, firefly particle colors) on the fly. 
- Theme selections are injected globally using React Context.
- The "fireflies" are a custom CSS animation ecosystem that drifts beautifully in the background, adapting its glow to your selected theme.

## 🛠️ Project Structure

The project is structured with scalability in mind:

- `/components`: Highly cohesive, loosely coupled React components. Each folder contains the `.tsx` file and its dedicated `.module.css`.
- `/hooks`: Custom React hooks (e.g., `useScrollSync`, `useViewportMetrics`) to keep our components clean and focus strictly on rendering.
- `/lib`: Static data sources and configuration, making content updates trivial without touching the presentation logic.
- `/types`: TypeScript interfaces ensuring type safety across the board.

## 🚀 Getting Started

If you'd like to run this locally:

1. Clone the repository.
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Run the development server:
   ```bash
   pnpm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) and enjoy the experience!

---

*Designed and engineered with a focus on aesthetics, modularity, and performance.*
