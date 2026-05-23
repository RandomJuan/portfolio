# My Portfolio

This is my personal portfolio website built with **Next.js**, **React 19**, and **TypeScript**. It showcases my work, skills, and contact details in a highly engaging, custom-themed environment. The site is designed to be visually rich and interactive, featuring custom fonts, responsive layouts, a drifting particle background, and a unique anime-style text-lightning effect.

---

## Table of Contents
* [Features](#features)
* [Technologies Used](#technologies-used)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
  * [Running the Project](#running-the-project)
* [Folder Structure](#folder-structure)
* [License](#license)

---

## Features

* **⚡ Active Tab Lightning Tracing**: Uses animated SVG path stroke animations (`stroke-dasharray` and `stroke-dashoffset`) paired with dynamic noise filters (`<feTurbulence>`) to trace the actual curves of active menu letters with a lively, organic anime lightning effect.
* **✨ Ambient Particle Atmosphere**: A custom background system ("fireflies") that syncs dynamically with the active theme colors, drifting gently behind sections without affecting scrolling performance.
* **🌗 Seamless Dynamic Theming**: Allows visitors to toggle between different styling vibes instantly using a global React Context theme switcher.
* **📱 Jitter-Free Responsive Design**: Optimized across mobile, tablet, and desktop viewports. On desktop, the glassmorphic navbar sits fixed at the top, while on mobile it shifts to the bottom (`bottom: 3px`) with hardware acceleration (`transform: translateZ(0)`) to ensure comfortable thumb navigation and eliminate address bar scroll lag.
* **🎨 Clean Modular CSS**: Replaced utility-class frameworks with strictly scoped **CSS Modules** for superior component encapsulation, readable semantic JSX, and style safety.
* **🔡 Custom Typography**: Integrated local font variables via Next.js Google Fonts using `Geist` and `Geist_Mono` for clean, professional modern typography.
* **📬 Direct Mail & Social Connections**: A beautiful interactive email contact card and responsive footer social links (LinkedIn, GitHub) for effortless outreach.

---

## Technologies Used

* **Next.js 16**: The leading React framework utilizing the App Router for optimal rendering, routing, and search engine friendliness.
* **React 19**: Leverages the latest improvements in React's component model and lifecycle.
* **TypeScript**: Provides typed safety and structure across data models and layouts.
* **CSS Modules**: Scoped Vanilla CSS styling, enabling high style reusability without class collision.
* **React-Draggable**: Utilized for handling dynamic boundary and slider movements smoothly.
* **Vercel (Deployment)**: Fully optimized hosting platform with high performance and automatic SSL.

---

## Getting Started

To get a local copy of this project up and running on your system, follow these simple steps:

### Prerequisites
Before installing, make sure you have the following ready:
* **Node.js**: Download and install the latest LTS version of [Node.js](https://nodejs.org/).
* **pnpm** (Recommended): The project is pre-configured with a pnpm lockfile. You can install it globally via npm:
  ```bash
  npm install --global pnpm
  ```
  *(You can also use standard `npm` or `yarn` if preferred).*

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/RandomJuan/portfolio.git
   cd portfolio
   ```

2. **Install project dependencies**:
   ```bash
   pnpm install
   ```
   *(If using npm, run `npm install`).*

### Running the Project

To launch the project in development mode:
```bash
pnpm run dev
```
Once started, open [http://localhost:3000](http://localhost:3000) in your web browser.

To bundle the application for production deployment:
```bash
pnpm run build
```

To run the compiled production build locally:
```bash
pnpm run start
```

---

## Folder Structure

The code is clean, highly structured, and follows modern React and Next.js guidelines:

* `📁 app/`: Contains page routes, dynamic layouts, metadata settings, and global styling overrides.
* `📁 components/`: Reusable interface elements, organized by feature area (e.g. `Navigation`, `AboutSection`, `Fireflies`, `ThemeSwitcher`). Each directory houses its logic alongside a scoped `.module.css` file.
* `📁 hooks/`: Custom utility hooks that separate state management and listener processes from components.
* `📁 lib/`: Source files containing static content configurations, simplifying updates.
* `📁 types/`: Dedicated TS type interfaces to guarantee structural reliability.

---

## License

Distributed under the MIT License. See standard licenses for more information.
