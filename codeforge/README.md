# CodeForge — from-scratch frontend for Gogs

A drop-in `custom/` overlay that replaces the entire Gogs UI with a fresh
**CodeForge**-branded design built on the Stitch DevHub Pro / Midnight Elite
design system. The Go backend is **untouched** — no rebuilds, no source
changes, fully reversible.

> Plan tracker: `C:\Users\pc\.windsurf\plans\codeforge-from-scratch-d7ca25.md`
> Phase progress: see `progress.txt` in this folder.

## Layout

```
codeforge/
├── public/
│   ├── css/codeforge.css              From-scratch design system + SUI shim
│   ├── js/codeforge.js                Drawer, toasts, copy, theme toggle
│   └── img/codeforge-mark.svg         Logo
├── templates/
│   ├── base/{head,footer}.tmpl        Replaces Gogs base chrome
│   └── inject/{head,footer}.tmpl      No-op overrides (legacy clear)
├── conf/                              (Phase 13) BRAND_NAME + locale strings
└── README.md
```

## Activation against the running Docker container

The `local-gogs` container reads custom assets from `/data/gogs/` (env
`GOGS_CUSTOM`). The deployment is automated by phase, but the same commands
work manually:

```powershell
# Copy static assets (no restart needed)
docker cp .\codeforge\public\css\codeforge.css local-gogs:/data/gogs/public/css/codeforge.css
docker cp .\codeforge\public\js\codeforge.js   local-gogs:/data/gogs/public/js/codeforge.js
docker cp .\codeforge\public\img\codeforge-mark.svg local-gogs:/data/gogs/public/img/codeforge-mark.svg
docker cp .\codeforge\public\img\codeforge-wordmark.svg local-gogs:/data/gogs/public/img/codeforge-wordmark.svg

# Copy templates (restart needed for template changes to take effect)
docker exec local-gogs sh -c "mkdir -p /data/gogs/templates/base /data/gogs/templates/inject"
docker cp .\codeforge\templates\base\head.tmpl     local-gogs:/data/gogs/templates/base/head.tmpl
docker cp .\codeforge\templates\base\footer.tmpl   local-gogs:/data/gogs/templates/base/footer.tmpl
docker cp .\codeforge\templates\inject\head.tmpl   local-gogs:/data/gogs/templates/inject/head.tmpl
docker cp .\codeforge\templates\inject\footer.tmpl local-gogs:/data/gogs/templates/inject/footer.tmpl

docker restart local-gogs
```

Open `http://localhost:10880/` and hard-reload.

## Reverting

```powershell
docker exec local-gogs sh -c "rm -rf /data/gogs/public/css/codeforge.css /data/gogs/public/js/codeforge.js /data/gogs/templates/base /data/gogs/templates/inject"
docker restart local-gogs
```

Gogs falls back to the embedded templates and default styling.

## Design system

See the plan file for the full token table. Quick reference:

- Dark glassmorphism, indigo→midnight backdrop
- Primary lavender `#cfbcff`, cyan focus `#38bdf8`, gold tertiary `#e7c365`
- Inter (UI), JetBrains Mono (code)
- Radius 16/12/8/6, easing `cubic-bezier(0.4, 0, 0.2, 1)`
- Light variant via `[data-theme="light"]` (theme toggle in topbar)
