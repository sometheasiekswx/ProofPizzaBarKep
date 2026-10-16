# Proof Pizza Bar Kep

Responsive static restaurant site using the approved design and both unmodified supplied logos. No framework, dependencies, database, API keys, or paid CMS required. Node 22+ is required for building/testing. Food photography remains illustrative; replace it with approved restaurant photography before launch if desired.

## Local development

```sh
npm test
npm run build
npm run preview
```

Open http://127.0.0.1:4173. Preview serves `dist`, so rebuild after editing source. Do not open the source HTML directly: browsers restrict local JSON requests. Without `MENU_CSV_URL`, the build reads [data/menu.csv](data/menu.csv). Edit this CSV, rebuild, and push to update the menu.

## Starter menu and location

The local CSV contains 20 provisional dishes/drinks across Neapolitan pizza, Antipasti, Dolci, Cocktails, and Without spirits. The refined presentation uses warm ivory, forest green, muted brass accents, editorial typography, and a two-column text menu. Margherita, Funghi, and Frutti di Mare sit alongside six cocktails and alcohol-free options. The supplied Google Maps listing and its limited photo gallery were consulted, but no complete readable price list was available. Item names, ingredients, and prices are assumptions, not a transcription of a verified restaurant menu. The website identifies the local menu as provisional. The owner should confirm all items before treating it as the official menu. Initial riel amounts assume $1 = ៛4,000 and remain separately editable.

Photos are illustrative Unsplash images, not copied Google Maps customer photos. Items without photos use an elegant text-only presentation; failed supplied photo URLs fall back to the original alternative logo. The location embed uses coordinates from the supplied Maps listing (10.4799925, 104.293197) at Kep Beach, Krong Kaeb, Cambodia. The directions link opens the original business listing; no Maps API key is required.

## Set up the owner's Google Sheets CMS

1. In the owner's Google account, create a spreadsheet called **Proof Menu**.
2. Import [data/menu.csv](data/menu.csv) into a tab named **Menu** to keep the starter menu, or use [data/menu-template.csv](data/menu-template.csv) for a minimal template. Keep the header names and order exactly as supplied.
3. Confirm the items, ingredients, and prices before publishing. The starter menu rows are available; the minimal template examples are hidden. Connecting Sheets replaces the local CSV and removes the provisional-menu notice.
4. Choose **File → Share → Publish to web**. Select only the **Menu** tab and **Comma-separated values (.csv)**, then Publish. Keep “Automatically republish when changes are made” enabled.
5. Copy the published URL. It should resemble `https://docs.google.com/spreadsheets/d/e/…/pub?gid=0&single=true&output=csv`. A normal `/edit` sharing URL will not work.
6. In the GitHub repository, open **Settings → Secrets and variables → Actions → Variables**, and add `MENU_CSV_URL` with this URL.
7. Run **Actions → Validate and deploy → Run workflow** to publish immediately.

**Privacy:** published menu data is public. Publish only the menu tab; never include customer details, staff records, passwords, costs, or other private information. The owner needs edit access to the spreadsheet, not GitHub access, for everyday changes.

### Owner editing guide

- `id`: unique stable name, such as `margherita`.
- `name`: customer-facing dish name; Khmer and English text are supported.
- `category`: any category, such as Pizza, Drinks, or Desserts. Filter buttons are generated automatically.
- `description`: ingredients or other details. Commas and multiline text are supported.
- `price_usd`: numeric dollars without a currency symbol, such as `7.50`.
- `price_khr`: explicit whole-riel amount, such as `30000`. Both prices are maintained by the owner; there is no hidden exchange-rate conversion.
- `image_url`: optional public HTTPS direct image URL, not a Drive sharing page. Leave blank for a text-only item; failed image URLs use the original alternative logo.
- `label`: optional badge, such as Vegetarian.
- `available`: `TRUE` to show, `FALSE` to hide. Deleting a row also removes the dish.
- `sort_order`: nonnegative integer; lower numbers appear first. Blank uses row order.

Changes are picked up on the next scheduled deployment, approximately every 30 minutes. Google publishing and GitHub schedules can be delayed; this is not instantaneous live sync. GitHub may disable scheduled workflows after 60 days of inactivity in public repositories; re-enable them in Actions if needed. Manual deployments are always available.

Invalid headers, duplicate IDs, malformed prices, or invalid URLs fail the build. A failed build leaves the previous deployment intact. An intentionally empty sheet with valid headers produces the contact message. To recover, correct the spreadsheet and rerun the failed workflow. Unsetting `MENU_CSV_URL` switches back to the checked-in local CSV; an invalid configured Sheets source never silently falls back.

To build locally against the sheet:

```sh
MENU_CSV_URL='https://docs.google.com/spreadsheets/d/e/YOUR_ID/pub?output=csv' npm run build
```

## GitHub CI/CD and Pages activation

The workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml) tests and builds pull requests. Pushes to `main`, manual runs, and scheduled runs also deploy using GitHub Pages artifacts and short-lived OIDC credentials. No personal access token is stored in the project.

Repository: [sometheasiekswx/ProofPizzaBarKep](https://github.com/sometheasiekswx/ProofPizzaBarKep). During setup verification, Pages was configured for legacy branch publishing and the first Actions deploy failed with a 404. Switch Pages to Actions rather than serving the source branch, since this site requires the generated menu JSON.

1. Open [Settings → Pages](https://github.com/sometheasiekswx/ProofPizzaBarKep/settings/pages). Under **Build and deployment → Source**, select **GitHub Actions**, not **Deploy from a branch**.
2. Commit and push these local changes to `main`:

```sh
git add .
git commit -m "Add starter CSV menu and embedded location map" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
git push origin main
```

3. Open [Actions → Validate and deploy](https://github.com/sometheasiekswx/ProofPizzaBarKep/actions/workflows/deploy.yml). The push starts a run automatically; alternatively choose **Run workflow → main**. Enable Actions if prompted. Both `build` and `deploy` should succeed.
4. No secrets or variables are needed for the local CSV. Leave `MENU_CSV_URL` unset for now. Add it only when migrating to Sheets.
5. Visit [the website](https://sometheasiekswx.github.io/ProofPizzaBarKep/) after successful deployment and check menu categories, both currencies, and the embedded map. This URL is the configured destination, not a claim that the latest local changes are deployed.

I have not changed repository settings or pushed these changes automatically.

All local assets and fetch URLs are relative, so both `username.github.io` and `username.github.io/repository/` hosting work. A custom domain can be configured through GitHub Pages settings after launch.

## Structure and verification

- `index.html`: restaurant content and accessible landmarks.
- `styles.css`: approved responsive styling.
- `app.js`: safe text-based DOM rendering, category filters, loading/error/empty states.
- `scripts/menu.mjs`: CSV parser and strict menu validation.
- `scripts/build.mjs`: read the local CSV or fetch the configured published sheet, validate it, and produce deployable `dist`.
- `tests/`: Node's built-in test runner; no package installation necessary.

Original logo source: the supplied [Google Drive folder](https://drive.google.com/drive/folders/1am9SJI4nY0bsF1topK6cEXBJeV6d2SNY). Both original image files are preserved in `assets`. Font and illustrative hero photography requests use Google Fonts and Unsplash respectively; system fonts remain available if Google Fonts cannot load.
