# Design System Audit - HBBJ Holiday

## Color Palette

### Current Colors (Tailwind Config)
```js
colors: {
  'neon-orange': '#f92300',  // Bright red-orange
  'dark-blue': '#1F2B5D',    // Deep navy blue
  'cream': '#F8FFF6',        // Off-white cream
  'dark-red': '#D70023',     // Crimson red
  'teal': '#29AFBB',         // Bright cyan-teal
  'light-blue': '#B2DCF4',   // Pale blue
  'beige': '#D0B896',        // Warm tan
}
```

### Color Usage Analysis

#### Background Colors
- **Primary BG (Light)**: `bg-white` (mix cards, playlist, search dropdown)
- **Primary BG (Dark)**: `bg-dark-blue` (layout background, mix cards dark, playlist dark)
- **Accent BG**: `bg-dark-blue bg-opacity-20` (Bio component background)

#### Text Colors
- **Primary Text (Light)**: `text-dark-blue` (body text, headings)
- **Primary Text (Dark)**: `text-cream` or `text-white` (dark mode text)
- **Accent Text**: `text-light-blue` (main titles, site header)
- **Link Color**: `text-teal` with `hover:text-light-blue`
- **Link Alternative**: `hover:text-red-400` (header navigation)

#### Border Colors
- **Primary Border**: `border-light-blue border-opacity-20` (mix cards)
- **Subtle Border**: `border-gray-200 dark:border-gray-700` (playlist sections)
- **Focus Ring**: `ring-teal dark:ring-light-blue` (search input)

### Consistency Issues Found

1. **Inconsistent Hover States**:
   - Links use: `hover:text-light-blue` (Instagram link)
   - Header uses: `hover:text-red-400` (site title)
   - No unified hover color strategy

2. **Unused Colors**:
   - `neon-orange` (#f92300) - Defined but barely used
   - `dark-red` (#D70023) - Used in CSS for mix-title but inconsistently
   - `beige` (#D0B896) - Used in CSS for dark mode mix-title

3. **Color Naming Inconsistency**:
   - Mix of semantic (`cream`, `beige`) and descriptive (`light-blue`, `dark-blue`) names
   - `neon-orange` is actually red-orange
   - `dark-red` could be confused with `neon-orange`

### Recommendations

1. **Establish Color Roles**:
   ```js
   primary: '#1F2B5D',      // dark-blue (main brand)
   accent: '#29AFBB',       // teal (CTAs, interactive)
   highlight: '#B2DCF4',    // light-blue (emphasis, headers)
   danger: '#D70023',       // dark-red (errors, alerts)
   surface: '#F8FFF6',      // cream (cards, containers)
   ```

2. **Unified Hover Strategy**:
   - Links: `hover:opacity-80` or `hover:text-teal`
   - Headers: Same as links for consistency
   - Cards: Subtle border color shift only

3. **Dark Mode Pairings**:
   - Ensure each light color has clear dark mode equivalent
   - Document dark mode color mapping

## Animation Tokens (Implemented)

### Durations
- `fast`: 150ms - Quick feedback (hovers, toggles)
- `normal`: 250ms - Standard transitions
- `slow`: 400ms - Emphasized changes

### Easing
- `smooth`: cubic-bezier(0.4, 0, 0.2, 1) - ease-out equivalent

### Usage Guidelines
1. Prefer instant color changes (no transition) for most hovers
2. Use `fast` duration only for critical interactive feedback
3. Never exceed `slow` duration for UI animations
4. Christmas lights exempt from these rules (decorative)

## Typography

### Font Families
- **Display**: Open Sans (headings, titles, navigation)
- **Body**: Merriweather (paragraphs, descriptions)

### Hierarchy
- Consistent heading sizes needed
- Current: mix of `text-4xl`, `text-2xl`, etc.
- Needs: documented scale with semantic names

## Spacing & Layout

### Current Standards
- Cards: `p-6`, `rounded-lg`
- Sections: `my-14`, `my-8`, `mb-8`
- Gaps: `gap-3`, `gap-4`

### Consistency Needed
- Standard card padding
- Standard section margins
- Consistent border radius (currently using 0.5rem)

## Next Steps

1. ✅ Remove excessive animations
2. ✅ Add animation tokens to Tailwind config
3. 🔄 Audit color system (this document)
4. ⏳ Implement refined hover states
5. ⏳ Document component patterns
6. ⏳ Test accessibility (contrast ratios)
