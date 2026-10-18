# Naming convention

If files are named badly, the kit is already broken. The client will pick `final-FINAL-v3.png`.

## Pattern

```
[brand]_[type]_[variant]_[color]_[bg]_[size].[ext]
```

All lowercase. Hyphens inside a token. Underscores between tokens.

| Token | Values |
|---|---|
| brand | short slug: `north`, `ashco`, `padup` |
| type | `logo` `mark` `wordmark` `icon` `pattern` `avatar` `cover` `card` `letterhead` `favicon` `og` |
| variant | `primary` `stacked` `horizontal` `compact` |
| color | `color` `black` `white` `mono` |
| bg | `on-light` `on-dark` `on-clear` |
| size | `sm` `md` `lg` `1x` `2x` or exact `1024` |

## Logo examples

```
north_logo_horizontal_color_on-light.svg
north_logo_horizontal_white_on-dark.svg
north_logo_stacked_color_on-light.svg
north_mark_color_on-clear.svg
north_mark_black_on-clear.svg
north_wordmark_color_on-light.svg
north_favicon_color_on-clear.svg
```

PNG companions sit next to SVG at `1024` and `512` for the mark:

```
north_mark_color_on-clear_1024.png
north_mark_color_on-clear_512.png
```

## Social

```
north_avatar_color_on-light_1024.png
north_cover_linkedin_color_on-dark.png
north_post_1x1_template.png
north_story_9x16_template.png
```

## Do not use

`logo(1).png` `newlogo` `Artboard 12` `ClientEdits` `WhatsApp Image 2026-10-18`

Source files (Figma, Illustrator) live in `/06-assets/_source` and are named:

```
north_identity_master.fig
north_applications_master.fig
```
