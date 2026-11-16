# Booklets

`PDFs/Unit N - <title>/` has five PDFs per unit:

- **Booklet**: lessons and assignments
- **Booklet - Lessons Only**: the notes and examples, the booklet students follow in class
- **Booklet - Solutions**
- **Extra Practice**
- **Extra Practice - Solutions**

## Changing a booklet (optional)

The sources are LaTeX:

- `common/preamble.tex` holds the shared styles.
- `unitN/uN_lXX.tex` holds each lesson. Its answers are in the same file, in `sol` blocks, so the solutions booklet always matches.
- `unitN/uN_epXX.tex` holds the extra practice.

To rebuild a unit's five PDFs, you need TeX Live or MacTeX (pdflatex and the usual packages). Run this from this folder:

    python3 common/make_masters.py 6 "Similarity and Scale" --build

The PDFs are written to `unit6/` (u6_book.pdf, u6_lessons_only.pdf, …). Copy them into `PDFs/` and the site's `assets/notes/` (Lessons Only) as needed.

Unit titles: 1 Unit Pricing and Currency Exchange · 2 Earning an Income · 3 Length, Area and Surface Area ·
4 Volume, Capacity, Mass and Temperature · 5 Angles, Parallel Lines and Spatial Puzzles · 6 Similarity and Scale ·
7 Right Triangles and Trigonometry.
