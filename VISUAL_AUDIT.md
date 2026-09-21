# FolioSpark Visual Audit

Date: 2026-09-21
Scope: public portfolio, editor-adjacent visual system, responsive behavior, motion, accessibility, and conversion surfaces.
Reference: TasteSkill v2 and redesign-skill principles, adapted to the existing FolioSpark stack.

## Design read

Reading this as: a premium creative portfolio for clients, collaborators, and recruiters, with an editorial and motion-led language, leaning toward Tailwind CSS tokens plus Motion-style interaction patterns.

Recommended working dials:

- `DESIGN_VARIANCE: 8`: enough asymmetry and composition variety to feel authored.
- `MOTION_INTENSITY: 6`: meaningful reveals and tactile feedback, with reduced-motion fallbacks.
- `VISUAL_DENSITY: 4`: spacious enough for premium storytelling while preserving useful portfolio detail.

## Current design system

### Direction

FolioSpark currently reads as warm editorial minimalism with a single clay accent, large sans-serif display type, rounded surfaces, photography, and restrained motion.

### Tokens

- Background: `#f7f5f1` and `#f3f1ec`.
- Foreground: `#171717`.
- Accent: `#d4a373`.
- Surfaces: white and near-black.
- Shape language: large rounded cards, rounded inputs, and pill actions.
- Shadow language: large, low-opacity warm-neutral shadows.
- Type stack: Inter for body, Arial fallback for display.

### Preserve

- Warm neutral palette and clay accent.
- Editorial portfolio structure.
- Data-first content model.
- Case study expansion pattern.
- Public preview and published view behavior.
- Privacy-first analytics and safe URL handling.
- Reduced-motion support.

### Modernize carefully

- Typography character and font loading.
- Layout variety between sections.
- CTA intent consistency.
- Navigation scroll behavior.
- Accessibility focus states and semantic labels.
- Dark-mode strategy if a second theme is introduced.

## Findings

### P0: release blockers

No functional blockers were identified in this visual audit. Build and lint status should remain CI-driven, and the public workflow currently presents meaningful loading, error, and fallback states.

### P1: high-value improvements

#### 1. Replace the raw navigation scroll listener

Evidence: `NavBar` uses `window.addEventListener('scroll', ...)` to toggle the scrolled state.

Risk: this is a continuous event path that TasteSkill explicitly flags as a performance trap. It is not currently a confirmed bug, but it is unnecessary work for a simple threshold state.

Recommendation: replace it with an `IntersectionObserver` sentinel or a CSS-supported sticky state pattern. Keep the existing sticky navigation and anchor IDs unchanged.

#### 2. Reduce repeated eyebrow labels

Evidence: most sections use a small uppercase label above the headline, for example `Services`, `Proof`, `FAQ`, `Resume`, and `Contact`.

Risk: the rhythm becomes predictable and less editorial. TasteSkill recommends using these labels sparingly instead of above every section.

Recommendation: keep labels for `Work`, `Services`, and `Contact`; remove or convert the others to sentence-case supporting copy. This is a visual refinement, not an information architecture change.

#### 3. Unify CTA language by intent

Evidence: the page currently uses `Book a call`, `Start a project`, `Email the studio`, `Send inquiry`, and `Start a project` again.

Risk: users receive several labels for the same conversion goal. This weakens the primary action hierarchy and makes analytics less comparable.

Recommendation: use one primary intent label, `Start a project`, across hero, navigation, final CTA, and contact entry points. Keep `Send inquiry` only for the form submission action.

#### 4. Audit section background contrast

Evidence: the page alternates between warm backgrounds, white surfaces, and a dark `surface-strong` section.

Risk: the dark Resume and Contact sections can feel like separate visual products rather than a deliberate theme lock.

Recommendation: choose one of two explicit directions:

- Light editorial page with darker tonal bands using the same warm family.
- Deliberate single transition into a dark conversion chapter, with clear narrative framing.

Do not remove the dark sections blindly. Decide their role first and validate the whole page at desktop and mobile widths.

#### 5. Improve font character without adding a heavy dependency

Evidence: body uses Inter and display falls back to Arial.

Risk: this is functional but generic for a creative portfolio, and it is one of the strongest visual opportunities identified by TasteSkill.

Recommendation: adopt one self-hosted or repository-served display sans and keep a readable body sans. Do not link remote Google Fonts from the page. Validate font loading, fallback metrics, and layout shift before replacing the current stack.

### P2: medium-value improvements

#### 6. Add one signature interaction to the work section

Recommendation: add a spotlight border or cursor-aware image treatment to project cards. It should communicate focus and not run continuously. Use Motion values rather than React state for pointer coordinates, and disable it under reduced motion or coarse pointers.

#### 7. Give the case study transition more narrative weight

Current state: the details expand inline with a simple conditional render.

Recommendation: use a layout-aware height and opacity transition, preserving the current inline disclosure and keyboard behavior. The interaction should explain the relationship between summary and proof, not become a modal.

#### 8. Diversify section composition

Current state: several sections use a heading followed by repeated cards or rows.

Recommendation: reserve card grids for work and services. Present process as a timeline, proof as a metric band, journal as an editorial rail, and resume as a document-like two-column layout. Do not add more card types without a clear content reason.

#### 9. Strengthen focus-visible states

Recommendation: define one global focus-visible ring using the accent token and verify it against light, dark, and surface-strong backgrounds. Existing hover styling should remain secondary to keyboard focus.

#### 10. Review fake precision in sample metrics

The sample content includes outcome figures in case studies and trust metrics. Mark any illustrative values as sample content in the editor or replace them with verified project data before production publishing.

### P3: optional polish

- Add a subtle spotlight treatment to the main CTA only.
- Add `text-wrap: balance` and `text-wrap: pretty` where headings currently risk orphan words.
- Add tabular numerals to portfolio metrics and case study values.
- Add a branded favicon and verify social preview image behavior.
- Add a dedicated visual QA checklist for 320px, 768px, 1024px, and 1440px widths.

## Motion audit

### Keep

- Hero entrance sequence: communicates hierarchy.
- `whileInView` section reveals: communicates narrative progression.
- Button hover and press states: communicate feedback.
- FAQ and case study disclosure: communicate state transition.
- Reduced-motion CSS fallback.

### Change

- Replace continuous scroll listener in navigation.
- Avoid adding perpetual loops to informational sections.
- Prefer transform and opacity over layout properties.
- Add pointer-driven effects only to desktop fine pointers.
- Keep GSAP out unless a genuine pinned or scrubbed story requires it. Motion is already sufficient for the current product.

## Accessibility and responsive audit

- Preserve all existing anchor IDs and navigation labels.
- Confirm every icon-only control has an accessible name.
- Add `:focus-visible` styles globally.
- Verify mobile menu focus order and Escape behavior.
- Verify all CTA labels remain on one line at desktop widths.
- Verify case study disclosures work with keyboard and screen readers.
- Verify reduced motion disables ambient movement and decorative transitions.
- Test the public page at 320px, 375px, 768px, 1024px, and 1440px.
- Test the print resume path separately from the interactive page.

## Recommended implementation order

1. Replace navigation scroll listener with an observer-based state.
2. Normalize primary CTA copy and remove redundant eyebrows.
3. Add global focus-visible tokens and run keyboard QA.
4. Refresh display typography with a locally served font.
5. Add one controlled spotlight interaction to project cards.
6. Improve the case study disclosure transition.
7. Decide and document the page-wide light/dark composition.
8. Run visual regression and performance checks.

## Explicit non-recommendations

- Do not install multiple design systems. Tailwind v4 plus the existing component patterns are sufficient.
- Do not migrate from `framer-motion` to `motion/react` solely because TasteSkill recommends the newer import. Consider it during a dependency maintenance phase.
- Do not replace Lucide across the application just to satisfy a generic skill rule. It is already an established dependency and changing icon families would add visual and code churn.
- Do not add sticky stacks, horizontal scroll hijacks, marquees, parallax, and magnetic buttons in the same phase.
- Do not introduce glassmorphism as a default surface treatment.

## Preflight result

- Brief inferred: pass.
- Existing stack respected: pass.
- Public conversion path identified: pass.
- Reduced-motion support exists: pass, with more component-level QA needed.
- Full dark-mode parity: not complete.
- Global focus-visible system: not complete.
- Navigation scroll listener: improvement required.
- Typography refresh: improvement recommended.
- No destructive redesign required: pass.

## Success criteria for the next visual phase

- No change to public route structure or anchor IDs.
- No regression in import, preview, publishing, or analytics behavior.
- One meaningful interaction added to project cards.
- Keyboard focus is visible across interactive controls.
- Navigation state no longer depends on a raw scroll event listener.
- Full tests, lint, build, and responsive visual checks pass.
