---
name: Coreserve Facilities Group
description: Calm, operational property care with one dependable point of contact.
colors:
  operational-navy: "#10243a"
  deep-navy: "#0b1a2a"
  mid-navy: "#173650"
  service-teal: "#19b5a5"
  bright-teal: "#54d8ca"
  deep-teal: "#087f76"
  ink: "#182a3b"
  muted: "#5f7080"
  pale-surface: "#f2f7f8"
  pale-teal: "#e5f1f1"
  white: "#ffffff"
  line: "#dce6e9"
typography:
  display:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(3.15rem, 6.2vw, 5.9rem)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(2.25rem, 4vw, 3.7rem)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Manrope, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 750
    lineHeight: 1.08
  body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 800
    lineHeight: 1.4
rounded:
  control: "9px"
  button: "10px"
  mark: "12px"
  card: "18px"
  feature: "22px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "20px"
  lg: "32px"
  section: "108px"
components:
  button-primary:
    backgroundColor: "{colors.service-teal}"
    textColor: "{colors.deep-navy}"
    rounded: "{rounded.button}"
    padding: "12px 20px"
    height: "50px"
  button-dark:
    backgroundColor: "{colors.operational-navy}"
    textColor: "{colors.white}"
    rounded: "{rounded.button}"
    padding: "12px 20px"
    height: "50px"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "11px 13px"
    height: "48px"
  service-card:
    backgroundColor: "{colors.pale-surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "36px"
---

# Design System: Coreserve Facilities Group

## Overview

**Creative North Star: "The Calm Operations Desk"**

Coreserve should feel like a well-run property-services desk: composed, direct, and quietly capable. Deep navy creates authority, teal signals progress and availability, and pale technical surfaces keep long service information easy to scan.

The visual system is modern without feeling like a generic technology product. Its character comes from decisive type, practical service rows, clear operational language, and measured circular geometry rather than decorative imagery.

**Key Characteristics:**

- Decisive navy first viewports with a single teal action colour.
- Editorial service lists instead of interchangeable card grids.
- Clear, high-contrast type and generous vertical rhythm.
- Restrained motion that communicates coordination, never spectacle.

## Colors

The palette pairs dependable dark blue with a limited, purposeful teal accent and cool, low-contrast surfaces.

### Primary

- **Operational Navy:** The main authority colour for hero fields, dark actions, headings, and brand structure.
- **Deep Navy:** Footer and deepest background layer.
- **Mid Navy:** Secondary dark surfaces and CTA bands.

### Secondary

- **Service Teal:** Primary actions, progress cues, and active affordances.
- **Bright Teal:** Highlight text and status details on dark surfaces.
- **Deep Teal:** Accessible links and icons on light surfaces.

### Neutral

- **Ink:** Long-form text with strong readability.
- **Muted:** Supporting copy and descriptive text.
- **Pale Surface:** Alternating sections and form context.
- **Pale Teal:** Feature diagrams and icon containers.
- **White:** Main canvas and high-contrast text.
- **Line:** Dividers, field strokes, and structural boundaries.

**The Teal Means Action Rule.** Reserve teal for action, status, and helpful emphasis; it should never become a large decorative wash.

## Typography

**Display Font:** Manrope (sans-serif fallback)  
**Body Font:** DM Sans (sans-serif fallback)

**Character:** Manrope gives service headings compact authority while DM Sans keeps operational details friendly and legible. The pairing is confident, not corporate-heavy.

### Hierarchy

- **Display:** Extra-bold, fluid sizing and tight tracking; reserved for one page-level statement.
- **Headline:** Extra-bold and balanced; used for major section propositions.
- **Title:** Bold and compact; used for service and process names.
- **Body:** Regular with generous line height; keep paragraphs focused and comfortably scannable.
- **Label:** Bold and concise; use for field labels and functional metadata, not repeated decorative kickers.

**The One Statement Rule.** Each section earns one strong heading; avoid stacking uppercase eyebrow text above every heading.

## Layout

Content sits in a centred 1160px shell with 24px desktop side gutters and 16px mobile gutters. Major sections use a generous 108px vertical rhythm, reducing to 76px on small screens. Two-column compositions collapse below 980px; navigation, forms, service details, and CTA groups become single-column below 720px.

Use asymmetrical splits when one side explains and the other demonstrates. Service inventories should remain linear, numbered, and easy to scan. Preserve visible action affordances at every breakpoint and never introduce horizontal overflow.

## Elevation & Depth

The system is tonal and bordered by default. Shadows appear only on elements that genuinely float: the hero service board, quote form, orbit labels, and mobile action bar.

### Shadow Vocabulary

- **Ambient lift:** `0 18px 52px rgba(16, 36, 58, 0.11)` for forms and important floating panels.
- **Deep board:** `0 30px 70px rgba(3, 13, 24, 0.28)` for the hero operations board on navy.
- **Micro lift:** `0 9px 28px rgba(16, 36, 58, 0.1)` for small floating labels.

**The Structural Shadow Rule.** A shadow must explain layering or interactivity; section separation comes from tone, whitespace, or a fine line.

## Shapes

Controls use gently rounded 9–10px corners. Cards use 16–22px radii, while statuses and mobile utility elements may use pills. Circular icon fields and the rotated diamond inside the logo are the signature geometry. Borders are fine and cool-toned; avoid heavy outlines.

## Components

### Buttons

- **Shape:** Gently rounded rectangle with a 50px minimum height.
- **Primary:** Service teal with deep-navy text and compact, bold labelling.
- **Hover / Focus:** Lift 2px on hover; use a 3px teal focus ring with a 4px offset.
- **Dark / Ghost:** Navy on light surfaces; translucent white border on dark surfaces.

### Cards / Containers

- **Corner Style:** 16–22px depending on prominence.
- **Background:** White, pale surface, or mid navy according to hierarchy.
- **Shadow Strategy:** Flat by default; use ambient lift only for floating forms and operational boards.
- **Border:** One-pixel cool line or low-opacity white on dark fields.
- **Internal Padding:** 24–38px, reducing on mobile.

### Inputs / Fields

- **Style:** White background, one-pixel cool border, 9px radius, visible labels, and strong placeholder contrast.
- **Focus:** Deep-teal border plus a soft translucent teal ring.
- **Validation:** Native required and input-type validation remains visible and keyboard accessible.

### Navigation

Desktop navigation is quiet and text-led, with a teal underline that draws from right to left on hover. Mobile navigation uses a 44px menu control, a full-width dropdown panel, and persistent call/WhatsApp actions at the bottom of the viewport.

### Service Row

The canonical service collection is a full-width numbered row with an icon mark, title, summary, and circular arrow. The entire row is keyboard-focusable; hover and focus add a white surface and horizontal inset while the arrow inverts to navy.

### Operations Board

The hero board is a compact navy panel that presents the four key quotation details as an active plan. Keep its structure factual and operational; never use it as a testimonial or fabricated live-data widget.

## Do's and Don'ts

### Do:

- **Do** preserve the navy, teal, pale blue-grey, and white colour relationship.
- **Do** keep specialist cleaning language factual and avoid unverified guarantees or credentials.
- **Do** use full-row interaction, visible keyboard focus, reduced-motion support, and persistent mobile affordances.
- **Do** favour linear editorial lists and clear process steps for operational content.

### Don't:

- **Don't** add unverified accreditations, testimonials, logos, or performance claims.
- **Don't** repeat uppercase eyebrow labels above every heading.
- **Don't** use teal as a large decorative background or add unrelated accent colours.
- **Don't** hide a service-row action on mobile or rotate readable text with decorative motion.
