# One Long Thread

Testimony · Healing · Repair · Embodied Archives · Dreaming · the Sonic

The public website for a research and composition project on gynaecological racism, sound and the archive, held by the life of Anarcha. Led by Dr Nik Gre Lassiter (Studio Gre), funded by the Arts and Humanities Research Council at the University of Southampton.

Plain HTML published with GitHub Pages at https://onelongthread.com. There is no build step. The `CNAME` file holds the domain; don't delete it.

## Updating lists

Most lists on the site come from the spreadsheets in `data/`. Edit one in Excel, Google Sheets or Numbers, save it as **CSV UTF-8** with the same name, and upload it here. The site updates a minute or two later.

| File | Feeds | Notes |
|---|---|---|
| `timeline.csv` | Timeline page and homepage | `show_on_home` = yes puts a row on the homepage; `current` = yes fills its dot |
| `gatherings.csv` | Gatherings | `page` links to a page about the gathering |
| `people.csv` | People | Only add someone once they have agreed to be listed. Anyone whose role is `Steering group` or `Project Associate` appears in a centred list under the team, by name and organisation only. Write `yes` in `steering` for a team member who is also in the steering group: their name gets an asterisk |
| `publications.csv` | Publications | |
| `opera-updates.csv` | The Opera, “Notes and recordings” | |
| `screenings.csv` | The Film, “Where to see it” | |
| `archive.csv` | Archive | Each `event` becomes a photo book; rows with the same event go in the same book, in the order listed. `cover` = yes picks the cover photo. `kind` is photo, audio, video or document; `file` is a path in `images/` or a web address |
| `archive-books.csv` | Archive | One row per photo book: `event` (exactly as in `archive.csv`), `dates`, `place` and a `summary` shown at the start of the book. Separate paragraphs with a line break |

Every spreadsheet has a `show` column. Leave it blank to show a row, or write `no` to keep it in the file without showing it on the site.

**This repository is public.** A row marked `no` is hidden from the pages but anyone browsing the repository can still read it, so don’t put anything here that isn’t ready to be seen, such as people who haven’t yet agreed to be listed.

Rows appear in the order they are listed.

## Files

- `index.html` and the other `.html` files: the pages
- `assets/site.css`: the look of every page
- `assets/site.js`: the menu, footer and spreadsheet lists (edit `NAV` there to change the menu)
- `agenda-map/`: the interactive Listening Across research agenda map. It has its own spreadsheets (`cards.csv`, `links.csv`, `people.csv`, `settings.csv`) and lays itself out from them. `how-to-read.html` is its reading guide. See the Word guide “Updating the Agenda Map”
- `images/`: photographs and other media for the archive
- `fonts/`: The Neue Black by Tré Seals (Vocal Type), used for the wordmark and headings. It is free under the SIL Open Font License (`fonts/OFL.txt`). Reading text is Newsreader and labels are IBM Plex Mono, both loaded from Google Fonts
- `images/logos/`: logos in the footer and on About. Funded by: `ukri-ahrc.png` (white, on a dark backing). Hosting institution: `university-of-southampton.png`. Collaborating institutions: `university-of-edinburgh.png` and `cuny-graduate-center.png` (all on white). Each file is trimmed to its artwork with a small even margin, so they display at the same size
- `.nojekyll`: tells GitHub Pages to serve the files exactly as they are
