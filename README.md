# Proof Pizza Bar Kep

Responsive static restaurant site using the approved design and both unmodified supplied logos. No framework, dependencies, database, API keys, or paid CMS required. Node 22+ is required for building/testing. Food photography remains illustrative; replace it with approved restaurant photography before launch if desired.

## Local development

```sh
npm test
npm run build
npm run preview
```

Open http://127.0.0.1:4173. Preview serves `dist`, so rebuild after editing source. Do not open the source HTML directly: browsers restrict local JSON requests. Without a configured spreadsheet, the site displays a message directing guests to the restaurant rather than publishing invented dishes/prices.

## Set up the owner's Google Sheets CMS

1. In the owner's Google account, create a spreadsheet called **Proof Menu**.
2. Import [data/menu-template.csv](data/menu-template.csv) into a tab named **Menu**. Keep the header names and order exactly as supplied.
3. Replace the example rows with confirmed dishes. Examples start with `available=FALSE` so they will not appear publicly.
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
- `image_url`: optional public HTTPS direct image URL, not a Drive sharing page. Blank or failed images use the original alternative logo.
- `label`: optional badge, such as Vegetarian.
- `available`: `TRUE` to show, `FALSE` to hide. Deleting a row also removes the dish.
- `sort_order`: nonnegative integer; lower numbers appear first. Blank uses row order.

Changes are picked up on the next scheduled deployment, approximately every 30 minutes. Google publishing and GitHub schedules can be delayed; this is not instantaneous live sync. GitHub may disable scheduled workflows after 60 days of inactivity in public repositories; re-enable them in Actions if needed. Manual deployments are always available.

Invalid headers, duplicate IDs, malformed prices, or invalid URLs fail the build. A failed build leaves the previous deployment intact. An intentionally empty sheet with valid headers produces the contact message. To recover, correct the spreadsheet and rerun the failed workflow. Do not unset `MENU_CSV_URL` to recover: doing so deliberately builds the unconfigured/contact state.

To build locally against the sheet:

```sh
MENU_CSV_URL='https://docs.google.com/spreadsheets/d/e/YOUR_ID/pub?output=csv' npm run build
```

## GitHub CI/CD and Pages activation

The workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml) tests and builds pull requests. Pushes to `main`, manual runs, and scheduled runs also deploy using GitHub Pages artifacts and short-lived OIDC credentials. No personal access token is stored in the project.

This checkout currently has **no remote configured**. A repository and a published spreadsheet must be supplied/created by the account owner before a real deployment can be verified.

1. Create or choose the intended GitHub repository. GitHub Pages is available for public repositories on free plans; private-repository Pages requires a supporting plan. Choose visibility deliberately.
2. Add its remote, commit the project, and push `main`:

```sh
git remote add origin git@github.com:YOUR_ACCOUNT/YOUR_REPOSITORY.git
git add .
git commit -m "Build Proof Pizza Bar website" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
git push -u origin main
```

3. In **Settings → Pages → Build and deployment**, choose **GitHub Actions** as the source. Allow Actions to run if prompted.
4. Add `MENU_CSV_URL` as described above, then manually run **Validate and deploy**. If the first push failed before Pages was enabled, rerun it.
5. Open the URL shown in the successful deploy job. Test the menu filters, prices, Instagram link, and directions on a phone.

All local assets and fetch URLs are relative, so both `username.github.io` and `username.github.io/repository/` hosting work. A custom domain can be configured through GitHub Pages settings after launch.

## Structure and verification

- `index.html`: restaurant content and accessible landmarks.
- `styles.css`: approved responsive styling.
- `app.js`: safe text-based DOM rendering, category filters, loading/error/empty states.
- `scripts/menu.mjs`: CSV parser and strict menu validation.
- `scripts/build.mjs`: fetch published sheet at build time and produce deployable `dist`.
- `tests/`: Node's built-in test runner; no package installation necessary.

Original logo source: the supplied [Google Drive folder](https://drive.google.com/drive/folders/1am9SJI4nY0bsF1topK6cEXBJeV6d2SNY). Both original image files are preserved in `assets`. Font and illustrative hero photography requests use Google Fonts and Unsplash respectively; system fonts remain available if Google Fonts cannot load.
