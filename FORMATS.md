# Formats — authoring guide

The blog has one identity and a small set of **formats**. A post declares its
format in frontmatter; the build picks the matching chrome. Six values, hard ceiling.

`format` is the **presentation** axis. `tags` is the **topical** axis. Keep them
separate — only `format` (a typed enum) fails the build on a typo.

```yaml
format: standard   # default — you can omit it
```

The golden rule: **you write markdown + a few optional frontmatter fields.** You
never learn a new markup language. The one place with an authoring convention is
`analysis` sidenotes, and the one true exception is `freeform`. Both are called
out below.

| format | what it's for | new authoring cost | view source |
|---|---|---|---|
| `standard` | the default prose article | none | yes |
| `build` | show-your-work maker posts | a few frontmatter fields | yes |
| `dispatch` | news → opinion | a few frontmatter fields | yes |
| `analysis` | explainer / music analysis | frontmatter + 1 body convention (sidenotes) | yes |
| `review` | verdict-led review | a structured frontmatter block | yes |
| `freeform` | leftfield one-offs | bespoke — hand-built page | optional |

---

## standard  *(default)*

Nothing to do. Omit `format` (or set `standard`). Plain title + date + prose.

## build

A thing you made. Everything is optional; absent fields just omit the module.

```yaml
format: build
tldr: One low-friction Obsidian → OBS capture + reel compiler.
repo: https://github.com/danialrami/portfolio-reel
stack: [Python, OBS, Bash, YAML]
```

Body is normal markdown. Fenced code blocks render as captioned figures when your
code fence carries a caption (handled by the media step); otherwise they render
as normal code. **View source works** — the body is still your markdown.

## dispatch

A timely piece pegged to the news. Proven look.

```yaml
format: dispatch
kicker: Stream 02 — AI & Music
dek: When generation is free, the scarce thing isn't taste — it's the signature.
sources:
  - { title: "404 Media — Suno scrape leak", url: "https://…", meta: "2026-07-15" }
  - { title: "Pitchfork — Lorde vs Spotify AI", url: "https://…", meta: "2026-07-16" }
```

Drop-cap, numbered section headings, byline, and the Sources block are all
automatic. Pull-quotes: use a blockquote with `class="pull"` (or the `:::pull`
directive). **View source works.**

## analysis

Figure- and note-led. Frontmatter is just `format: analysis` + optional `dek`/`kicker`.

- **Footnotes** are standard markdown: `text[^1]` … `[^1]: the note.` No new syntax.
- **Sidenotes / margin notes** are the one convention to learn. Author them with a
  directive:

  ```md
  :::note[Psychoacoustic masking]
  Hiding protective noise beneath the threshold where louder sounds mask it.
  :::
  ```

  This compiles to the sidenote markup the CSS styles (right gutter on desktop,
  inline on mobile). **Requires the `remark-directive` plugin** — see the PR notes;
  until it's wired you can drop the equivalent HTML span inline (MDX).
- **Figures** with captions: standard markdown image inside a `<figure>` / the
  `:::figure` directive.

**View source still works** — the source shows your markdown with the `:::note`
directives in place. It reads as markdown, because it is.

## review

Verdict-led. The verdict module, good/bad, and spec table come entirely from a
**structured frontmatter block** — the body is your normal prose.

```yaml
format: review
dek: Bringing broadcast-grade clock distribution to a two-rack homelab.
score: 8.2
verdict: Turns "you need a broadcast truck" into "you need a config page."
pros: ["Grandmaster/boundary/transparent in one box", "Sub-ms PTP lock"]
cons: ["Fan noise wants a closet", "Multicast defaults need tuning"]
specs:
  - { k: "Clocking", v: "PTP (IEEE 1588) — GM / BC / TC" }
  - { k: "Measured offset", v: "~0.7 ms endpoint" }
illustrative: true   # prints a "demo copy" banner; drop for a real review
```

**View source works.**

## freeform  *(the escape hatch)*

The honest exception. A `freeform` post **opts out of every template** — no
`.prose` measure, no article chrome. It renders edge-to-edge inside the site
shell (nav + brand stay) and brings its own HTML/CSS/JS. This is for a
deliberate one-off (17776 / Mystery Flesh Pit energy), and it is **hand-built,
not a plain Obsidian note**. Author it as an `.mdx`/`.astro` page.

View source is off by default here — the "source" of a bespoke page isn't the
friendly markdown the other formats keep. Rare by design; the enum value just
keeps the door open.
