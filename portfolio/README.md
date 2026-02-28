# MAO — Developer Portfolio

A production-ready personal developer portfolio website for **Mohamed Abdelillah OURAOU**, built with pure HTML, CSS, and JavaScript — no frameworks, no build tools.

---

## Live Demo

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-0071e3?style=for-the-badge&logo=github)](https://yourusername.github.io/portfolio)

> Replace the badge URL above with your actual GitHub Pages URL after deployment.

---

## Screenshot

> _Add a screenshot of your deployed site here._
>
> Example: `![Portfolio Screenshot](screenshot.png)`

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Markup     | HTML5 (semantic elements)               |
| Styling    | CSS3 (custom properties, grid, flexbox) |
| Scripting  | Vanilla JavaScript (ES6+)               |
| Fonts      | Google Fonts — Sora + DM Mono           |
| Hosting    | GitHub Pages                            |

---

## Run Locally

No build step required. Just open the file in your browser:

```bash
# Option 1 — File system (double-click or drag into browser)
open portfolio/index.html

# Option 2 — Simple local server (recommended to avoid CORS quirks)
cd portfolio
python -m http.server 8080
# then open http://localhost:8080
```

---

## Deploy to GitHub Pages

### Step-by-step

1. **Create a GitHub repository** — name it `portfolio` (or any name you like).

2. **Push the `portfolio/` folder contents** to the repo root:
   ```bash
   cd portfolio
   git init
   git add .
   git commit -m "Initial portfolio"
   git remote add origin https://github.com/yourusername/portfolio.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to your repo on GitHub
   - Navigate to **Settings → Pages**
   - Under **Source**, select **Deploy from a branch**
   - Choose `main` branch and `/ (root)` folder
   - Click **Save**

4. **Wait ~1–2 minutes**, then your site will be live at:
   ```
   https://yourusername.github.io/portfolio
   ```

5. _(Optional)_ Add a custom domain under **Settings → Pages → Custom domain**.

---

## How to Customize

Everything you need to personalize is clearly marked with `<!-- TODO -->` comments in `index.html`. Here is a complete checklist:

### Personal information

| What to change | Where | How |
|---|---|---|
| Your full name | `index.html` — Hero `<h1>`, About section, Footer | Find `Mohamed Abdelillah OURAOU` and replace |
| Logo initials | `index.html` — `.nav__logo` and `.hero__avatar-initials` | Replace `MAO` with your initials |
| Role strings | `script.js` — `roles` array (line ~17) | Edit the 4 strings in the array |
| About paragraphs | `index.html` — About section | Edit the two `<p class="about__para">` blocks |
| Copyright year | `index.html` — Footer | Update `© 2026` |

### Skills

In `index.html`, find the three `.skills__card` articles and edit the `<li>` items inside each card to reflect your actual skills.

### Projects

Each project is an `<article class="project-card">`. For each project:
- Update the **title** in `<h3 class="project-card__title">`
- Update the **description** in `<p class="project-card__desc">`
- Update the **tags** in `<div class="project-card__tags">`
- Update the **GitHub link** in `<a href="...">` — look for `<!-- TODO: replace with your real URL -->`

### Contact links

Find the three `.contact-card` anchors in `index.html` and update:
- `href` attribute on the GitHub card → your GitHub profile URL
- `href` attribute on the LinkedIn card → your LinkedIn URL
- `href` attribute on the Email card → `mailto:your@email.com`
- The visible handle text inside each card

### Accent color

Open `style.css` and change the three accent variables at the top:

```css
--color-accent:      #0071e3;   /* main accent */
--color-accent-glow: rgba(0, 113, 227, 0.35);
--color-accent-soft: rgba(0, 113, 227, 0.12);
```

Swap in any hex color and update the matching `rgba()` values accordingly.

---

## Project Structure

```
portfolio/
├── index.html   ← All markup — sections, content, links
├── style.css    ← All styles — variables, layout, animations
├── script.js    ← All interactivity — typing, reveal, nav, menu
└── README.md    ← This file
```

---

## Accessibility

- Semantic HTML5 elements (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- `aria-label` on all icon-only buttons and links
- `aria-expanded` on the mobile burger button
- `aria-live="polite"` on the typing animation
- `prefers-reduced-motion` media query disables all animations for users who prefer it
- Keyboard navigation supported throughout (Escape closes mobile menu)
