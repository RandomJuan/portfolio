# Welcome to My Portfolio!

I built this project to give you a clear look at my background and the tech stack I work with. The goal from day one was to keep the codebase clean and simple under the hood, while delivering a sleek, cutting-edge technical aesthetic on the surface.



---

## Technologies Used

* **Next.js**: The framework that powers the website and handles routing.
* **React**: Used to build all the interactive pieces (components) of the site.
* **TypeScript**: Helps catch errors early by adding strict types to JavaScript.
* **CSS Modules**: Keeps the CSS organized and prevents styles from conflicting with each other.
* **Vercel**: The platform where the website is hosted and deployed online.

---

## Getting Started

If you want to try it out on your own computer, just follow these steps:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your computer.

I recommend using `pnpm` to install the project packages. You can get it by running:
```bash
npm install --global pnpm
```

### Installation

1. **Download the code**:
   ```bash
   git clone https://github.com/RandomJuan/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Start the website**:
   ```bash
   pnpm run dev
   ```

That's it! Now just open your browser and go to [http://localhost:3000](http://localhost:3000) to see it in action.

---

## Folder Structure

I tried to keep the folder structure clean and easy to navigate:

* `📁 app/`: This is where the main pages and overall settings live.
* `📁 components/`: The visual building blocks of the website. Each piece of the site has its own folder with its code and styles:
  * `Navigation/`: The menu bar.
  * `PresentationSection/`: The welcome area at the very top of the page.
  * `AboutSection/`: The section that details my background.
  * `ExperienceSection/`: My work history timeline.
  * `ContactSection/`: Where you can find my email and social links.
  * `Fireflies/`: The code for the floating background particles.
  * `ThemeSwitcher/` & `ThemeProvider/`: The buttons and logic that handle switching the color themes.
* `📁 hooks/`: Helper functions to manage the site's state (like figuring out which section you're currently viewing).
* `📁 lib/`: All the text and data (like my work experience or 'about me' text) lives here. This makes it easy to update the portfolio content without touching the visual code.
* `📁 types/`: The TypeScript rules that keep the code predictable and safe.

---

## License

This project is open-source and available under the MIT License. Feel free to explore the code, learn from it, or use it as inspiration!
