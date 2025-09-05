# AfterHours HVAC UI/UX Audit Report

## 🚨 Critical Issues Found

### 1. **White Text on White Buttons (Accessibility Issue)**
**Problem**: Multiple pages have buttons with `text-white` that turn `hover:bg-white`, creating invisible text on hover.

**Affected Files**:
- `pages/services/duct-cleaning.tsx` (2 instances)
- `pages/services/ac-repair.tsx` (2 instances) 
- `pages/about.tsx` (2 instances)
- `pages/services/furnace-install.tsx` (2 instances)
- `pages/services/energy-audit.tsx` (2 instances)
- `pages/services/maintenance.tsx` (2 instances)
- `pages/reviews.tsx` (2 instances)
- `pages/service-areas.tsx` (2 instances)
- `pages/home.tsx` (2 instances)
- `pages/gallery.tsx` (1 instance)
- `components/layout/Footer.tsx` (1 instance)

**Pattern**: `className="border-white text-white hover:bg-white hover:text-blue-900"`

### 2. **Inconsistent Color Schemes**
**Problem**: Mixed use of slate colors with inconsistent contrast ratios.

**Affected Files**:
- `pages/calculators.tsx` - `border-slate-600 text-slate-300 hover:bg-slate-700`
- `pages/user-settings.tsx` - Multiple slate color combinations
- `pages/membership.tsx` - Inconsistent button styling

### 3. **Repetitive Layout Patterns**
**Problem**: Service pages have nearly identical hero sections and CTA patterns.

**Affected Pages**:
- All service pages (`/services/*`)
- Multiple pages with duplicate emergency contact sections

## 🎨 Design System Issues

### Button Variants Inconsistency
- Primary buttons: Mix of `bg-blue-600`, `bg-orange-600`, `bg-red-600`
- Outline buttons: Inconsistent border and text color combinations
- Hover states: Some use proper contrast, others create accessibility issues

### Color Palette Conflicts
- **Primary Brand**: Blue (#2563eb) and Orange (#ea580c)
- **Problem Areas**: 
  - Slate colors mixed with brand colors
  - White text on white backgrounds
  - Inconsistent emergency/danger color usage

### Typography Inconsistencies
- Heading sizes vary without clear hierarchy
- Button text sizes inconsistent across pages
- Mixed use of font weights

## 🔧 Recommended Fixes

### 1. **Standardize Button System**
```tsx
// Primary Actions
className="bg-orange-600 hover:bg-orange-700 text-white"

// Secondary Actions  
className="bg-blue-600 hover:bg-blue-700 text-white"

// Outline Buttons (on colored backgrounds)
className="border-white text-white hover:bg-white hover:text-gray-900"

// Outline Buttons (on white backgrounds)
className="border-gray-300 text-gray-700 hover:bg-gray-50"
```

### 2. **Emergency/CTA Color System**
- **Emergency**: Red (#dc2626) - for urgent actions
- **Primary CTA**: Orange (#ea580c) - main business actions
- **Secondary CTA**: Blue (#2563eb) - informational actions

### 3. **Remove Duplicate Content**
- Consolidate emergency contact sections
- Create reusable CTA components
- Standardize hero section layouts

## 📋 Implementation Priority

### High Priority (Accessibility)
1. Fix white text on white button hover states
2. Ensure minimum 4.5:1 contrast ratios
3. Standardize button variants

### Medium Priority (Consistency)
1. Unify color palette usage
2. Standardize typography scale
3. Remove duplicate layout sections

### Low Priority (Polish)
1. Optimize component reusability
2. Enhance visual hierarchy
3. Improve responsive design consistency

## 🎯 Success Metrics
- [ ] All buttons pass WCAG AA contrast requirements
- [ ] Consistent brand color usage across all pages
- [ ] Reduced code duplication in layout components
- [ ] Unified design system implementation
