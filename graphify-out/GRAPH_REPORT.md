# Graph Report - ProofPizzaBarKep  (2026-10-17)

## Corpus Check
- Corpus is ~13,677 words - fits in a single context window. You may not need a graph.

## Summary
- 67 nodes · 80 edges · 8 communities (6 shown, 2 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Deployment & CMS Config
- Project Config
- Menu Frontend
- Build & CSV Pipeline
- Brand & Visual Identity
- Test Suite
- Dev Server
- Reviews Section

## God Nodes (most connected - your core abstractions)
1. `Proof Pizza Bar Kep — Project Overview` - 7 edges
2. `scripts` - 5 edges
3. `menuFromCSV()` - 4 edges
4. `Validate and Deploy GitHub Actions Workflow` - 4 edges
5. `element()` - 3 edges
6. `render()` - 3 edges
7. `loadMenu()` - 3 edges
8. `parseCSV()` - 3 edges
9. `validateSheetURL()` - 3 edges
10. `Build Job (npm test + npm run build)` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Proof Alternative Logo (JPG) — nav brand image` --conceptually_related_to--> `Neapolitan Pizza & Cocktail Bar Brand Identity`  [INFERRED]
  assets/proof-alternative.jpg → index.html
- `Proof Original Logo (PNG) — restaurant name wordmark` --conceptually_related_to--> `Neapolitan Pizza & Cocktail Bar Brand Identity`  [INFERRED]
  assets/proof-original.png → index.html
- `Graphify Instructions for Repo Navigation` --rationale_for--> `Proof Pizza Bar Kep — Project Overview`  [INFERRED]
  .github/copilot-instructions.md → README.md
- `Our Place / Story Section` --references--> `Proof Original Logo (PNG) — restaurant name wordmark`  [EXTRACTED]
  index.html → assets/proof-original.png
- `Navigation Header with brand logo and nav links` --references--> `Proof Alternative Logo (JPG) — nav brand image`  [EXTRACTED]
  index.html → assets/proof-alternative.jpg

## Import Cycles
- None detected.

## Communities (8 total, 2 thin omitted)

### Community 0 - "Deployment & CMS Config"
Cohesion: 0.17
Nodes (16): Kep, Cambodia — restaurant physical location (10.4799925, 104.293197), Provisional Menu Notice (starter prices awaiting owner confirmation), Graphify Instructions for Repo Navigation, Build Job (npm test + npm run build), Deploy Job (GitHub Pages), MENU_CSV_URL GitHub Actions Variable, Validate and Deploy GitHub Actions Workflow, app.js script reference (deferred) (+8 more)

### Community 1 - "Project Config"
Cohesion: 0.17
Nodes (11): engines, node, name, private, scripts, build, dev, preview (+3 more)

### Community 2 - "Menu Frontend"
Cohesion: 0.27
Nodes (9): element(), filters, grid, items, loadMenu(), money, render(), riel (+1 more)

### Community 3 - "Build & CSV Pipeline"
Cohesion: 0.36
Nodes (6): configured, items, columns, menuFromCSV(), parseCSV(), validateSheetURL()

### Community 4 - "Brand & Visual Identity"
Cohesion: 0.40
Nodes (6): Proof Alternative Logo (JPG) — nav brand image, Proof Original Logo (PNG) — restaurant name wordmark, Neapolitan Pizza & Cocktail Bar Brand Identity, Hero Section — Neapolitan pizza, cocktails, coastal evening, Navigation Header with brand logo and nav links, Our Place / Story Section

### Community 6 - "Dev Server"
Cohesion: 0.33
Nodes (3): root, server, types

## Knowledge Gaps
- **8 isolated node(s):** `./scripts/build.mjs`, `Graphify Instructions for Repo Navigation`, `Hero Section — Neapolitan pizza, cocktails, coastal evening`, `Our Place / Story Section`, `Visit / Find Us Section with embedded Google Map` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 31 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `./scripts/build.mjs`, `Graphify Instructions for Repo Navigation`, `Hero Section — Neapolitan pizza, cocktails, coastal evening` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._