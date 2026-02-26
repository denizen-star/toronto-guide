# Toronto Guide – Content scoop and where to add more

Quick reference for what each section uses and how to add winter, LGBTQ+, thermal baths, and more.

## What’s in the app

| Section | Route | Data source | What it is |
|--------|--------|------------|------------|
| **Day Trips** | `/day-trips` | `public/daytrips_data_enhanced.json` (from `daytrips_data.json` + `public/data/day_trips_standardized.csv`) | Day and weekend getaways: ski, spa, nature, wine, winter activities, thermal baths, etc. |
| **Happy Hours** | `/happy-hours` | `public/data/happy_hours.csv` | Drink/food deals by venue and time. |
| **Amateur Sports** | `/amateur-sports` | `public/data/amateur_sports_standardized.csv` | Leagues, drop-ins, recreational sports. |
| **Sporting Events** | `/sporting-events` | `public/data/sporting_events_standardized.csv` | Pro/major events (e.g. NHL, MLB). |
| **Scoop** | `/scoop` | `public/data/scoop_standardized.csv` | Curated mix of activities + special events (single feed). |
| **LGBTQ+ Events** | `/lgbtq-events` | `public/data/lgbt_events_standardized.csv` | Queer events (drag, parties, arts, community). Page links to **YOHOMO** (yohomo.ca) for more. |

There is no separate “Play” section; play-style content lives in **Amateur Sports**, **Day Trips**, and **Scoop**.

## What was added recently

- **Day Trips**
  - **Winter:** 35+ winter activities (ski, snowboard, tubing, skating, tobogganing, sleigh rides, ice fishing, snowshoeing, dog sledding, winter wine, Distillery Winter Village, etc.). Filter by Season > Winter.
  - **Thermal / spa:** Thermea Whitby, South-Western Bathhouse (Russian banya, hammam, sauna), Vladimirskie Bani, Hammam by Céla, Miraj Hammam, Elmwood Spa, Body Blitz, Vetta Nordic Spa, St. Anne’s Spa. Many tagged LGBTQ Friendly; search “spa” or “thermal” or filter by category.
- **LGBTQ+ Events**
  - Link to **YOHOMO** (yohomo.ca) for more queer arts, nightlife, and events.

## How to add more

- **Day trips (including winter, thermal, LGBTQ-friendly)**  
  - Add entries to `public/daytrips_data.json` (full structure) and matching rows to `public/data/day_trips_standardized.csv` (same `title` as JSON `name`).  
  - Or use: `node scripts/add-winter-activities.js` (winter), `node scripts/add-thermal-spa-daytrips.js` (thermal/spa), then `node scripts/merge-csv-to-json.js`.

- **Happy hours**  
  - Add rows to `public/data/happy_hours.csv` (format as existing rows).

- **Amateur sports / Sporting events**  
  - Add rows to `public/data/amateur_sports_standardized.csv` or `public/data/sporting_events_standardized.csv` (match existing columns).

- **Scoop**  
  - Add to `public/data/scoop_standardized.csv`; Scoop merges activity + special-event style content.

- **LGBTQ+ events**  
  - Add to `public/data/lgbt_events_standardized.csv`. For ongoing inspiration and event lists, use **YOHOMO** (yohomo.ca).

## Thermal / Russian baths / hammam / sauna

These are added as **day trips** so they appear on the Day Trips page (and in search). Venues include:

- **Thermal / Nordic:** Thermea (Whitby), Scandinave (Blue Mountain), Vetta Nordic Spa, St. Anne’s Spa.  
- **Russian banya / Turkish hammam / sauna:** South-Western Bathhouse (Mississauga/Richmond Hill), Vladimirskie Bani (Vaughan), Hammam by Céla, Miraj Hammam, Elmwood Spa, Body Blitz (women-only).

Tag with `LGBTQ Friendly` in the CSV where appropriate so they show up for queer-friendly “stuff to do” (e.g. spa day, baths).
