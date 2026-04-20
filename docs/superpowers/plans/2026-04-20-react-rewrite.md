# React Rewrite for he-calendar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the Vue 3 `he-calendar` application inside `src-app` into a React application using a 1:1 translation.

**Architecture:** We will replace the Vite + Vue 3 project with a Vite + React + TypeScript project. The single monolithic `Calendar/index.vue` will become `Calendar/index.tsx` and `Calendar.css`. The build output will continue to be copied to the Hexo plugin's `dist/` directory.

**Tech Stack:** React, Vite, TypeScript, dayjs, tyme4ts, lucide-react.

---

### Task 1: Scaffold React Project

**Files:**
- Delete: `src-app`
- Create: `src-app` (as a Vite React TS project)
- Modify: `src-app/package.json`

- [ ] **Step 1: Delete existing Vue project**
```bash
rm -rf src-app
```

- [ ] **Step 2: Scaffold Vite React TS project**
```bash
npm create vite@latest src-app -- --template react-ts
```

- [ ] **Step 3: Install dependencies**
```bash
cd src-app && npm install dayjs tyme4ts lucide-react clsx && npm install
```

- [ ] **Step 4: Commit**
```bash
git add src-app
git commit -m "chore: scaffold React project to replace Vue"
```

### Task 2: Port Styling to CSS

**Files:**
- Create: `src-app/src/Calendar.css`

- [ ] **Step 1: Create Calendar.css**
Copy the entire contents of the `<style scoped>` block from the old Vue `Calendar/index.vue` (we will extract this from Git history or an earlier reference) and place it in `src-app/src/Calendar.css`. Replace any Vue deep selectors if they exist, but generally keep it identical.

- [ ] **Step 2: Commit**
```bash
git add src-app/src/Calendar.css
git commit -m "style: port calendar styles from Vue to CSS"
```

### Task 3: Implement React Calendar Component

**Files:**
- Create: `src-app/src/Calendar/index.tsx`

- [ ] **Step 1: Create Calendar/index.tsx**
Implement the 1:1 translation of the Vue script and template.
- Use `useState` for `currentMonth`, `selectedDate`, `currentTheme`, `colorMode`.
- Use `useMemo` for generating the grid (`calendarDays`), `currentLunar`, and `currentAlmanac`.
- Use `useEffect` for URL parameter parsing (`view`, `hideHeader`, `defaultTheme`, `colorMode`) on mount.
- Bind `handleScroll`, `handlePrevMonth`, `handleNextMonth`, `handleDateClick`.
- Use `lucide-react` icons (`ChevronLeft`, `ChevronRight`, `Palette`).

- [ ] **Step 2: Commit**
```bash
git add src-app/src/Calendar/index.tsx
git commit -m "feat: implement Calendar component in React"
```

### Task 4: Wire Up App and Build

**Files:**
- Modify: `src-app/src/App.tsx`
- Modify: `src-app/src/main.tsx`
- Modify: `src-app/index.html`

- [ ] **Step 1: Update App.tsx**
```tsx
import Calendar from './Calendar';
import './Calendar.css';

function App() {
  return <Calendar />;
}

export default App;
```

- [ ] **Step 2: Update main.tsx & index.html**
Ensure `main.tsx` renders `<App />` into `document.getElementById('root')`. Update `index.html` title to `合社日历`.

- [ ] **Step 3: Test Build**
```bash
cd src-app && npm run build
```
Verify `dist/` is generated correctly.

- [ ] **Step 4: Commit**
```bash
git add src-app/src/App.tsx src-app/src/main.tsx src-app/index.html
git commit -m "chore: wire up React app entry points"
```

### Task 5: Integrate with Hexo Plugin

**Files:**
- Modify: `dist/` (Root)

- [ ] **Step 1: Copy Build Output**
```bash
rm -rf dist
cp -r src-app/dist ./dist
```

- [ ] **Step 2: Commit**
```bash
git add dist
git commit -m "build: update Hexo plugin with React build output"
```
