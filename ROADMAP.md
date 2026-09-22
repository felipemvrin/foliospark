# FolioSpark Roadmap

## Strategic objective
Build a premium portfolio platform that feels like a high-end agency site while staying fast, flexible, and trustworthy for individual creators, studios, and product-minded founders.

## Phase 1 — Foundation and premium positioning
Status: Completed

- React + TypeScript + Vite setup
- Editorial landing page and premium visual language
- Theme system and editor workflows
- Portfolio data model and structured content editing
- Public preview and published view architecture
- SEO, canonical metadata, sitemap, and robots generation
- GitHub + Behance showcase integration

## Phase 2 — Trust and commercial clarity
Status: In progress

### High priority
- Stronger final call-to-action section for lead capture — completed in phase 25
- Proof and credibility layer with outcomes, clients, and trust points — completed in phase 25
- FAQ section to address decision friction — completed in phase 25
- Security hardening around URL validation, imported data checks, and deploy-level protections — completed in phase 26
- Clearer service packaging and offer framing for conversion — completed in phase 24

### Medium priority
- Case study deep dives with measurable story arcs — in progress in phase 27
- Resume / CV section for recruiters and agency partners — in progress in phase 28
- Stronger editorial brand storytelling and narrative structure
- More precise lead qualification flows — completed in phase 29
- Visual audit and interaction modernization — completed in phase 30

## Phase 3 — Site administration and full customization
Status: In progress

### Phase 35 — Site Settings Foundation
Status: In progress

- Separate presentation settings from portfolio content
- Persist `SiteSettings` with legacy portfolio compatibility
- Define defaults for title, description, logo, navigation, footer, and sections
- Keep settings safe for import, preview, publishing, and reset flows

### Phase 36 — Navigation Builder
Status: In progress

- Edit navigation labels and targets — completed
- Show or hide navigation items — completed
- Configure the primary navigation CTA — completed
- Preserve stable anchor IDs for existing shared links
- Prevent duplicate or invalid navigation targets
- Add accessible reordering only after visibility controls are stable

### Phase 37 — Section Visibility and Ordering
Status: In progress

- Show or hide public sections — completed
- Keep essential conversion sections enabled — completed
- Reorder sections from the editor with accessible move controls — completed
- Render the configured page order publicly — completed
- Protect essential publishing sections such as hero and contact
- Add accessible drag and drop only when the basic toggles are stable

### Phase 38 — Branding, Title, Metadata, and Favicon
Status: Completed in phase 38

- Edit site title and description — completed
- Edit logo text and logo mark — completed
- Generate a customizable SVG favicon from the logo mark and accent token — completed
- Update document title, canonical metadata, and social metadata — completed
- Validate favicon URLs and imported branding values — completed

### Phase 39 — Footer Builder
Status: In progress

- Edit copyright and tagline — completed
- Show or hide location — completed
- Show or hide social links — completed
- Add optional legal and custom links — completed
- Control footer visibility and preview it live — completed
- Add footer link ordering and layout presets

### Phase 40 — Admin Route and Administration UI System
Status: In progress

- Separate the public `/` route from the `/admin` administration route — completed
- Keep public preview and published views readonly — completed
- Distinguish `public`, `preview`, `published`, and `admin` analytics modes — completed
- Add internal administration navigation for Site, Sections, Navigation, Profile, Content, Appearance, and Publishing — completed
- Add server-side authentication and authorization for `/admin` when a backend exists
- Split the editor into Site, Navigation, Sections, Content, Appearance, and Publishing panels
- Add collapsible groups and mobile-friendly editor navigation
- Add inline validation and saved-state feedback
- Keep the public portfolio visually distinct from the administration surface
- Use accessible primitives instead of a second visual system

### Phase 41 — Editor productivity
Status: Planned

- Auto-save status
- Undo and redo
- Draft and published state clarity
- Preview persistence
- Confirmations for destructive reset or delete actions

### Phase 42 — Visual QA and publishing confidence
Status: Planned

- Responsive checks at 320, 375, 768, 1024, and 1440 pixels
- Public preview and published-view regression coverage
- Keyboard and reduced-motion checks
- Lighthouse and bundle review
- Empty, loading, validation, and error states for administration

### Lower priority
- CMS-like editing improvements for advanced portfolio management
- Analytics dashboard and retention reporting
- Expanded integrations and exports
- More niche examples and vertical-specific templates

## Security and quality checklist
- Validate all external URLs before exposing links
- Sanitize imported portfolio JSON before use
- Keep publishing/authentication endpoints server-side
- Use deployment headers such as CSP, Referrer-Policy, and X-Content-Type-Options
- Prefer privacy-first analytics and respect Do Not Track settings
- Keep the client-side experience transparent and safe for public preview shares

## Priority order for next steps
1. Complete phase 39 with footer link ordering and layout presets
2. Complete phase 40 with the administration panel system and production authentication boundary
3. Resume metadata and document export
4. Advanced analytics and publishing dashboard

## Administration decisions

- Keep `Portfolio` for professional content and `SiteSettings` for presentation and site chrome.
- Keep the current React, TypeScript, Vite, Tailwind v4, Zustand, and Framer Motion stack.
- Prefer Radix primitives with shadcn/ui-owned components for tabs, switches, selects, dialogs, tooltips, and separators if the editor needs them.
- Add `@dnd-kit` only when section ordering reaches phase 37 and basic visibility controls are validated.
- Do not introduce AdminJS, Refine, Material UI, or Ant Design for this local portfolio editor.
- Preserve public anchor IDs, published URLs, import compatibility, and existing analytics field names.
- Treat `/admin` as a UI boundary only until server-side authentication and authorization are available.

## Phase reporting protocol

Every implementation update must state:

1. The active phase and its goal.
2. What was completed in that phase.
3. What remains before the phase is complete.
4. Validation results.
5. The next recommended phase.

## Notes
This roadmap is intentionally sequenced to maximize business value before purely decorative enhancements. The aim is to keep the product premium, credible, and conversion-ready without sacrificing maintainability or production safety.
