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
Status: Planned

- Edit navigation labels and targets
- Show or hide navigation items
- Configure the primary navigation CTA
- Preserve stable anchor IDs for existing shared links
- Prevent duplicate or invalid navigation targets

### Phase 37 — Section Visibility and Ordering
Status: Planned

- Show or hide public sections
- Reorder sections from the editor
- Preview the resulting page order
- Protect essential publishing sections such as hero and contact
- Add accessible drag and drop only when the basic toggles are stable

### Phase 38 — Branding, Title, Metadata, and Favicon
Status: Planned

- Edit site title and description
- Edit logo text and logo mark
- Generate a customizable SVG favicon from the logo mark and accent token
- Update document title, canonical metadata, and social metadata
- Validate favicon URLs and imported branding values

### Phase 39 — Footer Builder
Status: Planned

- Edit copyright and tagline
- Show or hide location
- Show or hide social links
- Add optional legal links
- Control footer visibility and preview it live

### Phase 40 — Administration UI System
Status: Planned

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
1. Complete phase 35 with the Site Settings editor panel
2. Build phase 36 navigation administration
3. Build phase 37 section visibility and ordering
4. Build phase 38 branding, metadata, and favicon controls
5. Build phase 39 footer administration
6. Build phase 40 administration UI system
7. Resume metadata and document export
8. Advanced analytics and publishing dashboard

## Administration decisions

- Keep `Portfolio` for professional content and `SiteSettings` for presentation and site chrome.
- Keep the current React, TypeScript, Vite, Tailwind v4, Zustand, and Framer Motion stack.
- Prefer Radix primitives with shadcn/ui-owned components for tabs, switches, selects, dialogs, tooltips, and separators if the editor needs them.
- Add `@dnd-kit` only when section ordering reaches phase 37 and basic visibility controls are validated.
- Do not introduce AdminJS, Refine, Material UI, or Ant Design for this local portfolio editor.
- Preserve public anchor IDs, published URLs, import compatibility, and existing analytics field names.

## Phase reporting protocol

Every implementation update must state:

1. The active phase and its goal.
2. What was completed in that phase.
3. What remains before the phase is complete.
4. Validation results.
5. The next recommended phase.

## Notes
This roadmap is intentionally sequenced to maximize business value before purely decorative enhancements. The aim is to keep the product premium, credible, and conversion-ready without sacrificing maintainability or production safety.
