# How to Load New Data – Step-by-Step

This guide explains how to add or update data for each section of the Toronto Guide app. No agents or automation scripts are required; follow these steps and use the listed files and scripts.

---

## Where each section gets its data

| Section | Route | Data file | Delimiter |
|--------|--------|-----------|------------|
| The Scoop | `/scoop` | `public/data/scoop_standardized.csv` | Comma (`,`) |
| Day Trips | `/day-trips` | `public/data/day_trips_standardized.csv` + `public/daytrips_data_enhanced.json` | Pipe (`\|`) |
| Happy Hours | `/happy-hours` | `public/data/happy_hours.csv` | Comma (`,`) |
| Amateur Sports | `/amateur-sports` | `public/data/amateur_sports_standardized.csv` | Pipe (`\|`) |
| Sporting Events | `/sporting-events` | `public/data/sporting_events_standardized.csv` | Pipe (`\|`) |
| LGBTQ+ Events | `/lgbtq-events` | `public/data/lgbt_events_standardized.csv` | Pipe (`\|`) |

---

## 1. The Scoop (activities and special events)

**File:** `public/data/scoop_standardized.csv`  
**Format:** Comma-delimited (`,`). Quote any field that contains a comma, newline, or double-quote; double any internal quotes.

### Column order (exactly)

```
id, title, description, image, location, type, startDate, endDate, registrationDeadline, duration, activityDetails, cost, website, travelTime, googleMapLink, lgbtqFriendly, tags, lastUpdated, category, eventType, neighborhood, season, priceRange, source
```

### Steps to add new Scoop events

1. **Choose a new ID**  
   Use a unique id (e.g. `sc2026_39`, `sc2026_40` if continuing the 2026 batch, or another prefix + number). Do not reuse existing ids.

2. **Build one row per event**  
   Fill each column. Required: `id`, `title`, `description`, `location`, `startDate`, `endDate`, `cost`, `website`, `tags`, `lastUpdated`, `category`, `eventType`, `neighborhood`, `season`, `priceRange`, `source`.  
   - `lastUpdated`: use current date in ISO format (e.g. `2026-02-26T12:00:00.000Z`).  
   - `category`: use one of the filter values the app expects: `art`, `music`, `theater`, `food`, `festival`, `cultural`, `museum`, `outdoor`, `activity`.  
   - `eventType`: e.g. `concert`, `performance`, `exhibition`, `festival`, `activity`.  
   - `source`: `special_event` for one-off events, `activity` for recurring.  
   - `lgbtqFriendly`: `true` or `false`.  
   - For empty optional fields use nothing or a single space as needed so column count matches the header.

3. **Append rows to the CSV**  
   Add new lines at the end of `scoop_standardized.csv`. Keep the header as the first line. Do not add an extra header in the middle of the file.

4. **Optional: use the existing script for a batch**  
   To add a fixed list of events (like the 2026 Mar–May set), you can extend and run:
   ```bash
   node scripts/add-toronto-events-2026-mar-may.js
   ```
   Edit the `events` array in that script to add or change events, then run again. Do not run it twice without changing ids or you will duplicate rows.

5. **Verify**  
   Run the app (`npm start`), open `/scoop`, and confirm new events appear and sort correctly (newest by `lastUpdated` first). Items with id like `sc2026_*` will show a “Just added” badge for a while.

---

## 2. Day Trips

**Files:**  
- `public/data/day_trips_standardized.csv` (pipe-delimited)  
- `public/daytrips_data.json` (or source for enhanced JSON)  
- `public/daytrips_data_enhanced.json` (used by the app; built from JSON + CSV)

### Steps to add new day trips

1. **Add the full day trip** to `public/daytrips_data.json` (structure with name, description, location, etc.).

2. **Add a matching row** to `public/data/day_trips_standardized.csv` with the same `title` as the `name` in the JSON. Use pipe (`|`) as delimiter. Match the column order of the existing CSV (check the header row).

3. **Run the merge script** so the enhanced JSON is updated:
   ```bash
   node scripts/merge-csv-to-json.js
   ```

4. **Optional scripts for specific batches**  
   - Winter activities: `node scripts/add-winter-activities.js`  
   - Thermal/spa: `node scripts/add-thermal-spa-daytrips.js`  
   Then run `node scripts/merge-csv-to-json.js`.

5. **Verify**  
   Open `/day-trips` and confirm the new trip appears.

---

## 3. Happy Hours

**File:** `public/data/happy_hours.csv`  
**Format:** Comma-delimited.

### Column order (check header in file)

Typical columns include: `id`, `location_id`, `day_of_week`, `start_time`, `end_time`, `offerings`, `description`, `lastUpdated`. Confirm against the first line of `happy_hours.csv`.

### Steps to add new happy hours

1. **Choose a new `id`** (unique number or identifier).

2. **Add one row per deal** with the same columns as existing rows. Match delimiter (comma) and quoting.

3. **Save the file.** No script is required.

4. **Verify**  
   Open `/happy-hours` and confirm the new row appears.

---

## 4. Amateur Sports

**File:** `public/data/amateur_sports_standardized.csv`  
**Format:** Pipe-delimited (`|`).

### Steps to add new amateur sports

1. **Open** `public/data/amateur_sports_standardized.csv` and check the header row for exact column order (e.g. `id`, `title`, `description`, `image`, `location`, `eventType`, `skillLevel`, `startDate`, `endDate`, …).

2. **Choose a new `id`** (e.g. `as{N}` to follow existing pattern).

3. **Add one row** with all required columns. Use pipe as separator; if a value contains a pipe, quote the field and escape quotes inside it.

4. **Save the file.** No script is required for simple adds.

5. **Verify**  
   Open `/amateur-sports` and confirm the new entry appears.

---

## 5. Sporting Events

**File:** `public/data/sporting_events_standardized.csv`  
**Format:** Pipe-delimited (`|`).

### Steps to add new sporting events

1. **Open** `public/data/sporting_events_standardized.csv` and check the header for column order (e.g. `id`, `title`, `description`, `image`, `location`, `type`, `skillLevel`, `startDate`, `endDate`, …).

2. **Choose a new `id`** (e.g. `se{N}` to follow existing pattern).

3. **Add one row** with the same columns. Use pipe as delimiter; quote and escape any value containing a pipe.

4. **Save the file.**

5. **Verify**  
   Open `/sporting-events` and confirm the new event appears.

---

## 6. LGBTQ+ Events

**File:** `public/data/lgbt_events_standardized.csv`  
**Format:** Pipe-delimited (`|`). Column set includes `eventType`, `subcategory`, and other LGBTQ+-specific fields.

### Steps to add new LGBTQ+ events

1. **Open** `public/data/lgbt_events_standardized.csv` and copy the header row. Use the exact same column order for new rows.

2. **Choose a new `id`** (e.g. next numeric id or a unique string).

3. **Add one row per event.** Use pipe as delimiter. For fields with JSON or pipes inside, quote and escape appropriately.

4. **Save the file.**

5. **Verify**  
   Open `/lgbtq-events` and confirm the new event appears.

---

## General rules

- **Back up before big edits**  
  Copy the CSV (or JSON) file before you add or change many rows (e.g. `cp scoop_standardized.csv scoop_standardized.csv.bak`).

- **Encoding**  
  Save all CSVs as **UTF-8** so special characters display correctly.

- **Ids**  
  Keep ids unique per file. Do not reuse an id that already exists in that CSV.

- **Dates**  
  Use ISO date format (e.g. `YYYY-MM-DD` or full ISO timestamp for `lastUpdated`) so sorting and filters work correctly.

- **Testing**  
  After loading new data, run the app and check the relevant section and any filters or search that use the new fields.

---

## Quick reference: scripts mentioned

| Script | Purpose |
|--------|--------|
| `node scripts/add-toronto-events-2026-mar-may.js` | Append a fixed list of events to Scoop CSV (edit the script to change the list). |
| `node scripts/merge-csv-to-json.js` | Rebuild day trips enhanced JSON from CSV + daytrips_data.json. |
| `node scripts/add-winter-activities.js` | Add winter day trip activities. |
| `node scripts/add-thermal-spa-daytrips.js` | Add thermal/spa day trips. |

For more on what each app section is and where to add content, see [SCOOP_CONTENT_GUIDE.md](SCOOP_CONTENT_GUIDE.md).
