# THREADS

Testimony · Healing · Repair · Embodied Archives · Dreaming · Sound (working name)

The public website for a research and composition project on gynaecological racism, sound and the archive, held by the life of Anarcha. Led by Dr L. Gre (Studio Gre), funded by the Arts and Humanities Research Council at the University of Southampton.

Plain HTML published with GitHub Pages. There is no build step.

## Updating lists

Most lists on the site come from the spreadsheets in `data/`. Edit one in Excel, Google Sheets or Numbers, save it as **CSV UTF-8** with the same name, and upload it here. The site updates a minute or two later.

| File | Feeds | Notes |
|---|---|---|
| `timeline.csv` | Timeline page and homepage | `show_on_home` = yes puts a row on the homepage; `current` = yes fills its dot |
| `gatherings.csv` | Gatherings | `page` links to a page about the gathering |
| `people.csv` | People | Only add someone once they have agreed to be listed |
| `publications.csv` | Publications | |
| `opera-updates.csv` | The Opera, “Notes and recordings” | |
| `screenings.csv` | The Film, “Where to see it” | |
| `archive.csv` | Archive | `kind` is photo, audio, video or document; `file` is a path in `images/` or a web address |

Every spreadsheet has a `show` column. Leave it blank to show a row, or write `no` to keep it in the file without showing it on the site.

**This repository is public.** A row marked `no` is hidden from the pages but anyone browsing the repository can still read it, so don’t put anything here that isn’t ready to be seen, such as people who haven’t yet agreed to be listed.

Rows appear in the order they are listed.

## Files

- `index.html` and the other `.html` files: the pages
- `assets/site.css`: the look of every page
- `assets/site.js`: the menu, footer and spreadsheet lists (edit `NAV` there to change the menu)
- `images/`: photographs and other media for the archive
- `.nojekyll`: tells GitHub Pages to serve the files exactly as they are
