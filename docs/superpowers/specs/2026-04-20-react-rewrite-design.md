# React Rewrite for he-calendar (Hexo Plugin)

## 1. Goal
Rewrite the existing Vue 3 application (`src-app`) into a React application using a 1:1 translation approach. The output will still be bundled via Vite and injected into Hexo blogs via an iframe, meaning the Hexo plugin logic itself will not change.

## 2. Architecture & Dependencies
- **Build Tool:** Vite + React + TypeScript
- **Dependencies:** 
  - `react`, `react-dom`
  - `dayjs` (date manipulation)
  - `tyme4ts` (lunar and almanac calculations)
  - `lucide-react` (icon replacement for `lucide-vue-next`)
- **State Management:** React Hooks (`useState`, `useMemo`, `useEffect`)

## 3. Component Structure (`src/Calendar/index.tsx`)
The Vue component `Calendar/index.vue` will be translated into a single monolithic functional React component to guarantee exact DOM parity:
- **State (`useState`):** `currentMonth`, `selectedDate`, `currentTheme`, `colorMode`, `weekStartDay`, `previewTheme`.
- **Computed Properties (`useMemo`):** `calendarDays` (the grid generator), `currentLunar`, `currentAlmanac`, `todayDistance`, `visibleThemes`.
- **Side Effects (`useEffect`):**
  - Parsing URL parameters on initial mount (`view`, `hideHeader`, `defaultTheme`, `colorMode`).
  - Loading initial state from `localStorage` (`getStorageItem`).
  - Binding keyboard event listeners (`keydown` for arrow navigation).
  - Updating the DOM dataset (`data-mode`) based on the active `colorMode`.
- **Event Handlers:** Mouse wheel scrolling (`handleScroll`), month navigation, date selection.

## 4. Styling Strategy
- All scoped styles from Vue will be extracted into a plain `Calendar.css` file.
- The CSS class names (e.g., `.calendar-container`, `.day-cell`, `.almanac-panel`) will be kept exactly as they are.
- We will rely on React's `className` attribute instead of Vue's `:class`.

## 5. Hexo Plugin Integration
- No changes required to `index.js` or Hexo configuration.
- The `package.json` inside `src-app` will continue to output static assets to `src-app/dist`.
- We will rebuild and copy `dist/` to the Hexo plugin root.

## 6. Implementation Steps
1. Delete the existing Vue project inside `src-app`.
2. Scaffold a new React + TS project inside `src-app`.
3. Install dependencies (`dayjs`, `tyme4ts`, `lucide-react`).
4. Recreate `App.tsx` and `main.tsx`.
5. Rewrite `Calendar/index.vue` to `Calendar/index.tsx` + `Calendar.css`.
6. Run `npm run build` and copy the output to the root `/dist` folder.
7. Test the generated output to ensure visual and functional parity.
