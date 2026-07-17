# Portfolio

Ross Carhart's personal portfolio website, live at `https://rosscarhart.com`. GitHub: `rcarhart/portfolio` (renamed from `rcarhart.github.io` 2026-07-17). Static site — no build process, no framework, no backend.

Served by **Cloudflare Pages** (project `rcarhart-github-io`, same CF account as pittsburghdivorce). GitHub Pages hosting at rcarhart.github.io was retired 2026-07-17 — that URL no longer serves the site.

## Tech Stack

- Vanilla HTML/CSS/JavaScript (no framework)
- particles.js v2.0.0 — animated particle background
- Font Awesome 6.5.1 (CDN)
- Google Fonts (Lato)
- Web3Forms — contact form submissions
- hCaptcha — spam protection on contact form
- Google Analytics GA4 (ID: `G-MC536JMFYS`)

## Running Locally

```bash
# Python
python -m http.server 8000

# Node
npx http-server
```

Then open `http://localhost:8000`.

## Git workflow

**A push to `main` IS a production deploy** (Cloudflare Pages auto-deploys it to rosscarhart.com). `main` is branch-protected: direct pushes are blocked, a PR is required.

1. Every change starts on a feature branch: `feat/<name>` or `fix/<name>`
2. Push the branch and open a PR (`gh pr create`); Cloudflare Pages builds a branch preview (`<hash>.rcarhart-github-io.pages.dev`) — test there or locally with `python -m http.server 8000`
3. Ross approves and merges the PR on GitHub
4. The merge itself deploys prod. After merging, verify https://rosscarhart.com (see `/ship`)

## Deployment

Cloudflare Pages auto-deploys `main` (renamed from `master` 2026-07-17) to https://rosscarhart.com via the GitHub integration. DNS: `rosscarhart.com` CNAME → `rcarhart-github-io.pages.dev`. The rosscarhart.com zone also carries `recipes.`/`photos.` tunnel subdomains and Cloudflare Email Routing MX — do not touch those records.

## Directory Structure

```
rcarhart.github.io/
├── index.html                  # Main portfolio page
├── resume.html                 # Standalone resume page
├── resources/
│   ├── particles.json          # Particle animation config
│   ├── js/
│   │   ├── app.js              # Dynamic subtitle cycling animation
│   │   ├── script.js           # Nav, form validation, scroll effects
│   │   ├── carousel.js         # References carousel
│   │   ├── contactform.js      # Form submission (mostly commented out)
│   │   └── particles.js        # Particle library
│   ├── css/
│   │   ├── style.css           # Main stylesheet (dark theme, responsive)
│   │   ├── grid.css            # Responsive grid system
│   │   └── images/             # Project screenshots and profile photos
│   └── docs/
│       └── Ross_Carhart_Resume.pdf
└── vendors/
    └── fonts/fontawesome-free-6.5.1-web/
```

## Page Sections (index.html)

1. Header — animated particles background, hamburger nav, dynamic subtitle cycling through "Data Visualization", "Data Engineering", "Analytics Engineering"
2. About — bio + horizontal career timeline (TruFoodMfg → GNC → Doner Media → Abercrombie & Fitch)
3. Stats banner — $5M+ cost savings, 200% subscription growth, 30% pipeline reduction, 8+ years experience
4. Visualizations — grid gallery of Tableau dashboards with screenshots
5. References — carousel with two testimonials (Pete Lawson, Nicole Peduto)
6. Contact — Web3Forms + hCaptcha form
7. Footer — GitHub, LinkedIn, Tableau, email links

## Styling Notes

- Dark theme: `#282525` background, `#eb0909` red accent
- Mobile breakpoint at 480px (hamburger menu, stacked layout)
- Responsive grid in `grid.css`; main styles in `style.css`

## External Services

| Service | Location | Purpose |
|---|---|---|
| Web3Forms | `index.html` line ~315 | Contact form submissions |
| hCaptcha | `index.html` | Bot protection on contact form |
| Google Analytics | Both HTML files | GA4 pageview tracking |
| Google Fonts | CDN in `<head>` | Lato font |
| Font Awesome | CDN in `<head>` | Icons |

## Key Behaviors

- `app.js` — fades the subtitle text in/out through a list of specialties on a timer
- `script.js` — handles hamburger toggle, smooth scroll-to-anchor, contact form captcha validation
- `particles.json` — controls particle density, speed, hover repulse, and click push effects; tweak this to change the header animation
