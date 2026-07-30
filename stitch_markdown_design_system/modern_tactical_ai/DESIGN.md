---
name: Modern Tactical AI
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363940'
  surface-container-lowest: '#0b0e14'
  surface-container-low: '#191c22'
  surface-container: '#1d2026'
  surface-container-high: '#272a31'
  surface-container-highest: '#32353c'
  on-surface: '#e1e2eb'
  on-surface-variant: '#c6c5d7'
  inverse-surface: '#e1e2eb'
  inverse-on-surface: '#2e3037'
  outline: '#8f8fa0'
  outline-variant: '#454655'
  surface-tint: '#bec2ff'
  primary: '#bec2ff'
  on-primary: '#000da4'
  primary-container: '#5865f2'
  on-primary-container: '#fffdff'
  inverse-primary: '#3f4cda'
  secondary: '#c0c1ff'
  on-secondary: '#1000a9'
  secondary-container: '#3131c0'
  on-secondary-container: '#b0b2ff'
  tertiary: '#b6c4ff'
  on-tertiary: '#092977'
  tertiary-container: '#5a71c0'
  on-tertiary-container: '#fffdff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e0e0ff'
  primary-fixed-dim: '#bec2ff'
  on-primary-fixed: '#000569'
  on-primary-fixed-variant: '#222fc2'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#dce1ff'
  tertiary-fixed-dim: '#b6c4ff'
  on-tertiary-fixed: '#00164f'
  on-tertiary-fixed-variant: '#28418e'
  background: '#10131a'
  on-background: '#e1e2eb'
  surface-variant: '#32353c'
  discord-blurple: '#5865F2'
  indigo-glow: '#6366f1'
  success-grounded: '#2ECC71'
  warning-caution: '#FEE75C'
  danger-alert: '#ED4245'
  surface-glass: rgba(22, 27, 34, 0.75)
  border-subtle: rgba(255, 255, 255, 0.1)
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
  code-block:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 1.5rem
  margin-mobile: 1rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style

The design system is built for the "AI Thực Chiến" (Tactical AI) persona: a digital assistant that is professional, humble, and transparent. It is designed to serve the "Silent Majority"—students who need quick, accurate technical answers without the friction of human intervention—while providing TAs with a high-density oversight environment.

The aesthetic follows a **Modern Dark Glassmorphism** movement. It leverages deep background values, layered translucency, and vibrant "Indigo Glow" accents to create a high-tech, futuristic atmosphere. The visual language prioritizes "Trust Architecture," where information hierarchy and color-coded confidence scores are more critical than decorative elements. The overall feel is focused, precise, and developer-centric.

## Colors

The color system is divided into two functional tiers: **Discord Native Status** and **Web Admin UI**.

### Discord Functional Palette
Colors are mapped to system confidence and status.
*   **Success/Grounded (#2ECC71):** Used for answers with ≥ 90% confidence.
*   **Escalation/Warning (#FEE75C):** Used for low confidence (< 75%) and TA alerts.
*   **Rate Limit/Alert (#ED4245):** Used for anti-spam and error states.
*   **System Onboarding (#5865F2):** The "Blurple" primary brand color for welcome flows.

### Web Dashboard Palette
The web interface uses a "Modern Dark" foundation.
*   **Primary Background:** `#0b0e14` provides a deep, ink-like canvas.
*   **Surface:** `rgba(22, 27, 34, 0.75)` with backdrop blurs creates the glass effect.
*   **Accents:** `Indigo Glow (#6366f1)` is used for interactive elements and data highlights.

## Typography

This design system uses **Inter** for all primary interface text to ensure maximum legibility and a modern, neutral feel. For technical data, confidence scores, and code snippets, **JetBrains Mono** is employed to signal precision and developer-friendliness.

### Hierarchy Rules
- **Web Admin:** Headlines use tight letter spacing and bold weights to stand out against glassmorphic backgrounds.
- **Discord Native:** Formatting is restricted to Discord's Markdown. Use **Bold** for headers, `Blockquotes` for citations (RAG source material), and `Monospace Blocks` for technical commands (Git/SSH) to ensure accuracy.
- **Micro-copy:** Timestamps and confidence metrics (e.g., "Độ khớp: 96%") should use `label-md` or the smallest available system text size.

## Layout & Spacing

### Discord Interface
Layout is vertical and strictly ordered to minimize "chat clutter." Responses are capped at 2–4 lines of body text.
1. **Header:** Status icon + Bold Title.
2. **Body:** Concise AI response.
3. **Citation:** Blockquote with source link.
4. **Footer:** Confidence metric + Timestamp.
5. **Action Row:** Max 3 buttons.

### Web Admin Dashboard
The dashboard uses a **fixed grid** approach with a 1280px max-width container. 
- **Top Row:** 4-column metrics overview.
- **Middle Row:** 2-column layout (70% Charts / 30% Recent Escalation Feed).
- **Bottom Row:** Full-width document and knowledge base manager.
- **Spacing Rhythm:** Uses an 8px base grid. Content padding is consistently `1.5rem` (24px) for cards.

## Elevation & Depth

The design system utilizes **Tonal Layering** combined with **Glassmorphism** to establish hierarchy in the Dark Mode environment.

1.  **Background Layer:** The base layer is `#0b0e14`.
2.  **Surface Layer (Cards/Panels):** Uses `rgba(22, 27, 34, 0.75)` with a `16px` backdrop blur. This creates a "frosted" effect that allows background glows to peak through.
3.  **Outlines:** Instead of heavy shadows, elements are defined by `1px` solid borders of `rgba(255, 255, 255, 0.1)`.
4.  **Shadows:** When needed for modals or floating menus, use a deep, diffused ambient shadow: `0 8px 32px 0 rgba(0, 0, 0, 0.4)`.
5.  **Accent Glows:** Primary buttons and active states feature a soft outer glow (`drop-shadow`) using the Indigo color to simulate a neon light effect.

## Shapes

The design system uses a **Rounded** shape language to balance the technical nature of the product with a friendly, approachable assistant persona.

- **Cards & Major Panels:** `1rem` (rounded-lg) for a substantial, containerized feel.
- **Buttons & Inputs:** `0.5rem` (base) for a standard interactive feel.
- **Status Tags/Badges:** Pill-shaped (fully rounded) to distinguish them from interactive buttons.
- **Discord Embeds:** Follows Discord's internal border-radius (roughly 4px-8px) but maintains the 4px vertical accent bar on the left edge.

## Components

### Discord Rich Embeds
- **Status Indicators:** Use the mapped status colors (#2ECC71, #FEE75C, etc.) for the left border of the embed.
- **Buttons:** 
  - *Primary (Blurple):* "Create Support Ticket" or "Main Action."
  - *Success (Green):* "Helpful" feedback.
  - *Danger (Red):* "Not Helpful" or "Report."
  - *Link:* Link to GitHub/Documentation.

### Web Dashboard Components
- **Glass Cards:** Must include the 16px blur and 1px white-alpha border. Header text inside cards should be uppercase `label-md`.
- **Status Chips:** High-contrast text on a low-opacity background of the status color (e.g., Green text on 10% opacity green background).
- **Charts:** Use "Indigo Glow" for primary data lines. Use a gradient area fill that fades to 0% opacity at the baseline.
- **Input Fields:** Darker than the surface (`#0b0e14`), with an `indigo-glow` border-bottom or full border on focus.
- **Interactive Metrics:** Large numeric values in `headline-lg` (Inter) with a `label-sm` (JetBrains Mono) description underneath.