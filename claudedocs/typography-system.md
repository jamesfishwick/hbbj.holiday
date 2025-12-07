# Typography System Documentation

## Font Families

### Display Font: Open Sans
**Usage**: Headings, titles, navigation, UI elements
**Weights**: 400 (regular), 700 (bold), 900 (black)
**Characteristics**: Clean, modern, excellent readability

### Body Font: Merriweather
**Usage**: Paragraphs, descriptions, body text
**Weights**: 300 (light), 400 (regular), 700 (bold)
**Characteristics**: Serif font, excellent for long-form reading

---

## Semantic Heading Scale

### Utility Class System

```css
/* In future Tailwind config or custom CSS */
.heading-1 { @apply text-5xl sm:text-6xl font-black font-display leading-tight; }
.heading-2 { @apply text-4xl sm:text-5xl font-bold font-display leading-tight; }
.heading-3 { @apply text-3xl sm:text-4xl font-bold font-display leading-snug; }
.heading-4 { @apply text-2xl sm:text-3xl font-bold font-display leading-snug; }
.heading-5 { @apply text-xl sm:text-2xl font-bold font-display leading-normal; }
.heading-6 { @apply text-lg sm:text-xl font-bold font-display leading-normal; }
```

### Current Heading Mapping

| HTML Tag | Current Usage | Size (Mobile) | Size (Desktop) | Weight | Color |
|----------|---------------|---------------|----------------|--------|-------|
| h1 | Site title (large) | text-4xl | text-5xl | font-black | text-primary-light |
| h1 | Site title (small) | text-2xl | text-2xl | font-black | text-primary-light |
| h1 | Mix page title | text-4xl | text-4xl | font-bold | text-primary-light |
| h3 | Mix card titles | text-4xl | text-4xl | font-bold | text-light-blue |
| h3 | Playlist header | text-2xl | text-2xl | font-bold | text-dark-blue/cream |
| h4 | Track names | - | - | font-medium | text-dark-blue/cream |
| h4 | Search results | - | - | font-medium | text-gray-900/white |

### Recommended Usage (Future)

| Level | Purpose | Example | Tailwind Classes |
|-------|---------|---------|------------------|
| h1 | Page title | "Happy Birthday Baby Jesus" | heading-1 |
| h2 | Section heading | "Featured Mixes", "2024 Collection" | heading-2 |
| h3 | Subsection | Individual mix title | heading-3 |
| h4 | Component heading | "Tracklist", "About" | heading-4 |
| h5 | Sub-component | Track groupings | heading-5 |
| h6 | Minor heading | Metadata labels | heading-6 |

---

## Body Text Scale

### Utility Class System

```css
.text-body-lg { @apply text-xl font-body font-light leading-relaxed; }
.text-body { @apply text-lg font-body font-light leading-relaxed; }
.text-body-sm { @apply text-base font-body font-light leading-relaxed; }
.text-caption { @apply text-sm font-body font-light leading-normal; }
.text-meta { @apply text-xs font-body font-light leading-normal; }
```

### Current Body Text Usage

| Element | Size | Weight | Font | Line Height |
|---------|------|--------|------|-------------|
| Mix descriptions | text-lg | font-light | Merriweather | leading-relaxed |
| Bio text | text-base | font-light | Merriweather | leading-7 |
| Tracklist artist | text-sm | font-light | Merriweather | normal |
| Footer | text-lg | font-light | Merriweather | normal |
| Search placeholder | text-base | normal | system | normal |

---

## Color Pairing Standards

### Headings

| Level | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| h1 | text-primary-light | text-primary-light | Always light-blue |
| h2 | text-primary-light | text-primary-light | Always light-blue |
| h3 | text-primary-light | text-primary-light | Mix titles |
| h4+ | text-dark-blue | text-cream | Component headings |

### Body Text

| Context | Light Mode | Dark Mode | Opacity |
|---------|------------|-----------|---------|
| Primary | text-dark-blue | text-cream | 100% |
| Secondary | text-dark-blue | text-cream | 90% |
| Tertiary | text-gray-600 | text-gray-400 | 100% |

### Links

| State | Color | Hover | Underline |
|-------|-------|-------|-----------|
| Default | text-accent | text-accent-hover | hover:underline |
| Visited | text-accent | text-accent-hover | hover:underline |
| Active | text-accent-hover | - | underline |

---

## Spacing Guidelines

### Heading Margins

```javascript
h1: 'mb-4 mt-8'   // Large spacing for page titles
h2: 'mb-3 mt-6'   // Section headings
h3: 'mb-3 mt-4'   // Subsection headings
h4: 'mb-2 mt-3'   // Component headings
h5/h6: 'mb-2'     // Minimal spacing
```

### Paragraph Spacing

```javascript
p: 'mb-4'         // Standard paragraph spacing
p.last: 'mb-0'    // No margin on last paragraph
```

---

## Accessibility

### Contrast Requirements Met

- ✅ Light-blue (#B2DCF4) on dark-blue (#1F2B5D): 8.9:1 (AAA)
- ✅ Cream (#F8FFF6) on dark-blue (#1F2B5D): 13.8:1 (AAA)
- ✅ Teal (#29AFBB) on dark-blue (#1F2B5D): 4.7:1 (AA)
- ✅ Dark text on cream: 13.8:1 (AAA)

### Semantic Hierarchy

- Proper heading levels (h1 → h2 → h3)
- No skipped heading levels
- Heading text meaningful and descriptive
- Screen reader friendly structure

### Font Sizing

- Minimum: 16px (base text)
- Line heights sufficient for readability
- Responsive scaling with sm: breakpoints
- Large enough touch targets on headings

---

## Implementation Examples

### Page Title
```jsx
<h1 className="text-4xl sm:text-5xl font-black font-display text-primary-light mb-4">
  {pageTitle}
</h1>
```

### Section Heading
```jsx
<h2 className="text-3xl sm:text-4xl font-bold font-display text-primary-light mb-3 mt-6">
  {sectionTitle}
</h2>
```

### Mix Card Title
```jsx
<h3 className="text-4xl font-bold font-display text-light-blue mb-3">
  {mixYear}
</h3>
```

### Body Text
```jsx
<p className="text-lg text-cream text-opacity-90 leading-relaxed font-body">
  {description}
</p>
```

### Component Heading
```jsx
<h4 className="text-2xl font-bold font-display text-dark-blue dark:text-cream">
  Tracklist
</h4>
```

---

## Responsive Behavior

### Mobile (< 640px)
- Headings scale down one size
- Body text maintains 18px minimum
- Line heights optimized for smaller screens
- Touch targets minimum 44px

### Tablet (640px - 1024px)
- Standard heading sizes
- Comfortable reading width
- Appropriate line lengths

### Desktop (> 1024px)
- Full heading sizes
- Maximum content width for readability
- Enhanced spacing

---

## Best Practices

### DO:
- ✅ Use semantic heading levels (h1, h2, h3)
- ✅ Maintain heading hierarchy
- ✅ Use display font for headings
- ✅ Use body font for paragraphs
- ✅ Ensure sufficient contrast
- ✅ Scale font sizes responsively

### DON'T:
- ❌ Skip heading levels (h1 → h3)
- ❌ Use headings for styling only
- ❌ Mix font families within text
- ❌ Use font sizes below 16px for body text
- ❌ Rely on color alone for meaning

---

## Future Enhancements

### Phase 2:
- [ ] Create utility classes for heading system
- [ ] Implement component-based heading components
- [ ] Add font feature settings (ligatures, kerning)
- [ ] Optimize font loading strategy
- [ ] Add variable font support
- [ ] Implement fluid typography (clamp)

### Phase 3:
- [ ] Add type scale documentation
- [ ] Create typography playground
- [ ] Document edge cases
- [ ] Add print styles
- [ ] Optimize for performance
