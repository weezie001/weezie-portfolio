# Integration and handover

## Backend boundaries

OTP and sign-in components demonstrate UI, not authentication. Connect callbacks to your own service, handle server errors and never keep secrets in browser code. Pricing sliders are estimators, not payment checkout. Presence cursors are a simulation. Submission previews are local UI, not website scraping. Motion scenes are interactive browser compositions, not downloadable video renders.

## Common callbacks

- ReferoPromptSearch: onSearch(query)
- ReferoSoftTabs: onChange(item)
- ReferoStyleCard / DesignMdTokenCard: onSave(boolean)
- DesignMdTagCloud: onChange(selectedTags)
- MobbinHeroSlots / MobbinAppIconGrid: onSelect(item)
- MobbinFlowStepper: onComplete()
- MinimalSubmitModal: onSubmit({url,title,category}), onClose(), isOpen
- KageFilterDrawer: onApply(selectedTags), onReset()
- KageCommandPalette: onSelect(item), onClose(), isOpen

For other props, read the destructured parameters at the top of each component. Full source is included. Default examples run without API keys.

## Before shipping your product

Replace demo text and numbers. Check narrow screens, long labels, empty states and your real content. Connect backend operations, loading and error states. Verify keyboard navigation, focus return and contrast with your brand colors. Include reduced-motion rules from src/style.css. Dynamic dialogs and global keyboard shortcuts should only be mounted when needed. If embedding multiple examples, unmount inactive ones to avoid competing shortcuts.

## Delivery checklist

- Working starter and all 35 source files included
- Example imports and category inventory included
- Commercial-use license and reference attribution included
- No customer data, environment secrets or site admin code included
- Automated rendering and representative DOM interactions checked
- Manual visual and assistive-technology review remains recommended before customer-specific integration
