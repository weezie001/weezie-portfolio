# Weezie UI: 35 original React components

Five components inspired by each of VibePrompts, Minimal Gallery, Kage, Refero Styles, DESIGN.md and Mobbin, plus five Skillry-inspired motion experiments. These are original implementations, not official products of those websites. No reference website source code, branded screenshots or video assets are bundled.

## Start the included gallery

Use a current Node.js LTS release (Node 22.12+ recommended).

1. Extract the ZIP into a new folder.
2. Run `npm install` in that folder.
3. Run `npm run dev` and open the local URL printed by Vite.
4. Run `npm run build` to create the standalone gallery.

## Use one component

Copy the chosen JSX file from src/components into your project. Every component is self-contained and imports only React. Tailwind CSS v4 must scan the copied files. See examples/ for all 35 usage files. Hooks-based components include the Next.js use-client directive. This package does not include authentication servers, payment processors, multiplayer infrastructure or AI APIs.

Import example:

```jsx
import ReferoTokenInspector from './components/ReferoTokenInspector'
export default function Page() { return <ReferoTokenInspector /> }
```

## Contents

- src/components/: 35 complete implementations
- examples/: one import-and-render example per component
- src/catalog.json: categories, references and descriptions
- DESIGN.md and design-tokens.json: an original starter design system
- INTEGRATION.md: callbacks, demo boundaries and delivery checklist
- LICENSE.txt: commercial-use terms
- manifest.json: file inventory and checksums

The components use a deliberate dark demo palette. Customize their literal Tailwind classes and props for your brand; the portfolio's light-preview filter is not a separate light-theme implementation. Native dialog requires a modern browser. Clipboard requires localhost or HTTPS. Content, labels and example counts are demo data.

## Catalog

- Asymmetric Bento Grid | Features | VibePrompts | src/components/BentoFeatures.jsx
- Usage Pricing Slider | Pricing | VibePrompts | src/components/UsagePricingSlider.jsx
- Verification Input | Forms & Auth | VibePrompts | src/components/OtpVerificationInput.jsx
- Feature Comparison | Pricing | VibePrompts | src/components/FeatureComparisonMatrix.jsx
- Split Auth Card | Forms & Auth | VibePrompts | src/components/SplitAuthCard.jsx
- Curation Card | Cards & Galleries | Minimal Gallery | src/components/MinimalCard.jsx
- Floating Navigation | Navigation | Minimal Gallery | src/components/MinimalNavbar.jsx
- Filter Pills | Search & Filters | Minimal Gallery | src/components/MinimalFilterBar.jsx
- Layout Switcher | Navigation | Minimal Gallery | src/components/MinimalViewToggle.jsx
- Submission Dialog | Forms & Auth | Minimal Gallery | src/components/MinimalSubmitModal.jsx
- Command Palette | Search & Filters | Kage | src/components/KageCommandPalette.jsx
- Prompt Action Bar | Developer Tools | Kage | src/components/KagePromptBar.jsx
- Presence Demo | Motion & Interaction | Kage | src/components/KageGhostCursors.jsx
- Theme Switcher | Navigation | Kage | src/components/KageThemeToggle.jsx
- Filter Drawer | Search & Filters | Kage | src/components/KageFilterDrawer.jsx
- Changing Headline | Hero & Typography | Refero Styles | src/components/ReferoRotatingHeadline.jsx
- Style Search | Search & Filters | Refero Styles | src/components/ReferoPromptSearch.jsx
- Soft Segmented Tabs | Navigation | Refero Styles | src/components/ReferoSoftTabs.jsx
- Editorial Style Card | Cards & Galleries | Refero Styles | src/components/ReferoStyleCard.jsx
- Token Inspector | Design Systems | Refero Styles | src/components/ReferoTokenInspector.jsx
- Command Snippet | Developer Tools | DESIGN.md | src/components/DesignMdCliBox.jsx
- Setup Stepper | Onboarding & Flows | DESIGN.md | src/components/DesignMdWorkflowStepper.jsx
- Design System Card | Design Systems | DESIGN.md | src/components/DesignMdTokenCard.jsx
- Style Tag Cloud | Search & Filters | DESIGN.md | src/components/DesignMdTagCloud.jsx
- Design Rules Reader | Design Systems | DESIGN.md | src/components/DesignMdReader.jsx
- App Discovery Hero | Hero & Typography | Mobbin | src/components/MobbinHeroSlots.jsx
- Mobile Device Frame | Mobile & Devices | Mobbin | src/components/MobbinDeviceFrame.jsx
- Product Flow | Onboarding & Flows | Mobbin | src/components/MobbinFlowStepper.jsx
- App Icon Grid | Cards & Galleries | Mobbin | src/components/MobbinAppIconGrid.jsx
- Screen Inspector | Mobile & Devices | Mobbin | src/components/MobbinInspectModal.jsx
- Orbital Composition | Motion & Interaction | Skillry / bonus | src/components/MotionOrbit.jsx
- Type Playground | Hero & Typography | Skillry / bonus | src/components/MotionKineticType.jsx
- Story Timeline | Motion & Interaction | Skillry / bonus | src/components/MotionSceneTimeline.jsx
- Exploded Layers | Motion & Interaction | Skillry / bonus | src/components/MotionExplodedStack.jsx
- Signal Grid | Motion & Interaction | Skillry / bonus | src/components/MotionSignalGrid.jsx

## Reference links

https://vibeprompts.dev/
https://minimal.gallery/
https://kage.design/
https://styles.refero.design/
https://designmd.ai/
https://mobbin.com/
https://skillry.dev/ai-videos/opus-5-5

Support: enang@weezie.site
