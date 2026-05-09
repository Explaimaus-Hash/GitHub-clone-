# Stitch theme for Gogs

A non-invasive dark glassmorphism overlay for Gogs based on the Stitch
**DevHub Pro Portfolio** / **Midnight Elite** design system.

This theme touches **zero core files**. No Go code, no `.tmpl` core templates,
no LESS edits, no rebuild. It uses Gogs' official customisation hooks
(`custom/templates/inject/head.tmpl` and `custom/public/`).

## Layout

```
stitch-theme/
├── public/
│   └── css/
│       └── stitch-theme.css         CSS overlay (loaded after gogs.min.css)
├── templates/
│   └── inject/
│       └── head.tmpl                Injected inside <head> on every page
└── README.md
```

## Design tokens

| Token        | Value                                      |
|--------------|--------------------------------------------|
| Background   | Multi-stop indigo → midnight gradient      |
| Surface      | `rgba(20, 18, 24, 0.72)` + 24px backdrop blur |
| Primary      | `#cfbcff` on `#6750a4`                     |
| Accent (cyan)| `#38bdf8` (focus / electric border)        |
| Accent (gold)| `#e7c365` (tertiary)                       |
| Border       | `rgba(255, 255, 255, 0.08)`                |
| Radius       | 16 / 12 / 8 / 6                            |
| Sans font    | Inter                                      |
| Mono font    | JetBrains Mono                             |
| Easing       | `cubic-bezier(0.4, 0, 0.2, 1)`             |

## What gets restyled

- Top navigation bar, brand, search, dropdowns
- Footer
- Containers / segments / cards (glassmorphism)
- Buttons (primary, secondary, ghost, danger, disabled)
- Forms / inputs / checkboxes / dropdowns
- Sidebar / vertical menu (active glow rail)
- Tabular & pointing menus (tabs)
- Tables (with hover row)
- Labels / chips / sha tags
- Messages / alerts (info, warning, error, success)
- Modals, popups, dimmer (animated)
- Code, markdown, blockquotes
- Avatars
- Dashboard (`/`) — feed cards, repos sidebar, statistics
- Repository pages — header, tabs, file browser, code, diffs, issues, comments
- Explore — repository / user list cards with hover lift
- Profile / user pages
- Admin panel
- Auth pages (login, signup, forgot/reset, install) — animated card form
- Pagination
- Loading skeletons (shimmer) + empty placeholders
- Reduced-motion fallback
- Mobile responsive tweaks

## Activation

### Option A — Local binary build (`.bin/gogs.exe`)

From the repo root:

```powershell
# 1. Make sure Gogs has run once and created custom/
.\.bin\gogs.exe web        # then stop with Ctrl+C

# 2. Copy theme assets into custom/
Copy-Item -Recurse -Force .\stitch-theme\public\*    .\.bin\custom\public\
Copy-Item -Recurse -Force .\stitch-theme\templates\* .\.bin\custom\templates\

# 3. Restart Gogs (template injection requires a restart)
.\.bin\gogs.exe web
```

Open `http://localhost:3000/` and hard-reload (`Ctrl+F5`).
Subsequent edits to `stitch-theme.css` are picked up live (no restart needed),
but you must re-copy the file into `.bin/custom/public/css/`.

### Option B — Docker container (`local-gogs` from the repo's Dockerfile.next)

The container reads custom assets from `/data/gogs/` (env `GOGS_CUSTOM`).
With your existing volume `local-gogs-data`:

```powershell
# Copy theme assets into the running container's data volume
docker cp .\stitch-theme\public\css\stitch-theme.css `
    local-gogs:/data/gogs/public/css/stitch-theme.css

docker cp .\stitch-theme\templates\inject\head.tmpl `
    local-gogs:/data/gogs/templates/inject/head.tmpl

# Template injection requires a restart
docker restart local-gogs
```

Then visit `http://localhost:10880/` and hard-reload.

### Option C — Bind-mount during `docker run` (cleanest for development)

```powershell
docker run --name local-gogs `
  -p 10022:2222 `
  -p 10880:3000 `
  -v local-gogs-data:/data `
  -v ${PWD}\stitch-theme\public\css\stitch-theme.css:/data/gogs/public/css/stitch-theme.css:ro `
  -v ${PWD}\stitch-theme\templates\inject\head.tmpl:/data/gogs/templates/inject/head.tmpl:ro `
  local-gogs
```

CSS edits on the host are reflected immediately after a browser refresh.

## Reverting

To remove the theme:

```powershell
Remove-Item .\.bin\custom\public\css\stitch-theme.css
Remove-Item .\.bin\custom\templates\inject\head.tmpl
```

Or stop bind-mounting the files and recreate the container.
Gogs falls back to the default Semantic UI styling automatically.

## Architecture notes

- Loaded **after** `gogs.min.css` and `semantic-2.4.2.min.css`, so it wins
  CSS specificity ties through cascade order, not `!important` spam.
  `!important` is used only where Semantic UI itself uses `!important`.
- All design tokens live in `:root` CSS custom properties. Tweak the palette
  by editing the variables at the top of `stitch-theme.css`.
- The fonts (Inter, JetBrains Mono) load from Google Fonts. If you run
  Gogs offline, host them locally under `custom/public/fonts/` and adjust
  `head.tmpl` accordingly.
- The theme respects `prefers-reduced-motion`.
- No new dependencies are added to Gogs.

## Roadmap (optional polish, not yet applied)

- Localise fonts under `custom/public/fonts/` for offline-first installs
- Add a `light` mode variant via `prefers-color-scheme: light`
- Per-repo accent colour driven by repo metadata
