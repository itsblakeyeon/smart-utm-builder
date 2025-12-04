# Concepts Dictionary

> Detailed explanations of concepts used in the project.
> For quick lookups, check [Quick Reference](quick-reference.md) first.

## Table of Contents

- [React Core](#react-core)
- [React Advanced Patterns](#react-advanced-patterns)
- [State Management Patterns](#state-management-patterns)
- [Local Storage](#local-storage)
- [Keyboard Interactions](#keyboard-interactions)
- [CSS & Styling](#css--styling)
- [Browser APIs](#browser-apis)
- [React Router](#react-router)
- [JavaScript Core](#javascript-core)
- [Code Structure & Patterns](#code-structure--patterns)
- [Build Tools](#build-tools)

---

## React Core

### useState

**One-line summary**: A React Hook for managing mutable state within components

**Project example**: [useToast.js:7](../src/hooks/useToast.js#L7)

```javascript
// Managing toast notification state
const [toast, setToast] = useState(null);

// Updating state
setToast({ message: "Saved successfully!", type: "success" });
```

**Key points**:
- Returns `[stateValue, setStateFunction]`
- Component re-renders when state changes
- Initial value is only used on first render

**Related concepts**: [useReducer](#usereducer), [Custom Hooks](#custom-hooks)

---

### useEffect

**One-line summary**: A Hook for handling component lifecycle and side effects (data fetching, subscriptions, DOM manipulation, etc.)

**Project example**: [useLocalStorage.js:22-28](../src/hooks/useLocalStorage.js#L22-L28)

```javascript
// Auto-save to localStorage whenever value changes
useEffect(() => {
  try {
    window.localStorage.setItem(key, JSON.stringify(storedValue));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}, [key, storedValue]); // Dependency array: run only when these change
```

**Key points**:
- Empty dependency array (`[]`) runs once on mount
- With dependencies, runs when those values change
- Return cleanup function runs on unmount (e.g., remove event listeners)

**Project example 2**: [BuilderTab.jsx:354-360](../src/components/BuilderTab.jsx#L354-L360) (Debouncing)

```javascript
// Debounce: save after 500ms (save only the last input)
useEffect(() => {
  const timer = setTimeout(() => {
    localStorage.setItem(STORAGE_KEYS.ROWS, JSON.stringify(rows));
  }, DEBOUNCE_DELAY);

  return () => clearTimeout(timer); // Cleanup: cancel previous timer
}, [rows]);
```

**Related concepts**: [Debouncing](#debouncing), [localStorage](#localstorage)

---

### useRef

**One-line summary**: A Hook for persisting values across renders or accessing DOM elements directly

**Project example**: [UTMTableInput.jsx:24-26](../src/components/UTMTableInput.jsx#L24-L26)

```javascript
const divRef = useRef(null);
const inputRef = useRef(null);

// Direct DOM access
useEffect(() => {
  if (isCellSelected && divRef.current) {
    divRef.current.focus(); // Focus directly
  }
}, [isCellSelected]);

// Connect ref in JSX
<input ref={inputRef} ... />
```

**Key points**:
- Access value via `.current` property
- Changes don't trigger re-renders
- Use cases: DOM element refs, storing previous values, timer IDs

**Project example 2**: [useCellSelection.js:15-20](../src/hooks/useCellSelection.js#L15-L20) (Value persistence)

```javascript
const selectedCellRangeRef = useRef(selectedCellRange);

// Keep latest value reference (solves closure issues in event handlers)
useEffect(() => {
  selectedCellRangeRef.current = selectedCellRange;
}, [selectedCellRange]);
```

**Related concepts**: [Focus Management](#focus-management), [Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)

---

### useReducer

**One-line summary**: A Hook for managing complex state logic with reducer functions (similar to Redux)

**Project example**: [useHistory.js:16-70](../src/hooks/useHistory.js#L16-L70)

```javascript
// Reducer function: (current state, action) => new state
const historyReducer = (state, action) => {
  switch (action.type) {
    case "UNDO":
      const previous = state.past[state.past.length - 1];
      return {
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future],
      };
    case "REDO":
      // ...
    default:
      return state;
  }
};

// Usage
const [state, dispatch] = useReducer(historyReducer, initialState);
dispatch({ type: "UNDO" });
```

**Key points**:
- Better for complex state with multiple sub-values
- Action objects clearly express intent (via `type` field)
- Separates state update logic from components

**Related concepts**: [Undo/Redo](#undo-redo), [useState](#usestate)

---

### useCallback

**One-line summary**: A Hook for memoizing functions to prevent unnecessary recreation

**Project example**: [BuilderTab.jsx:177-189](../src/components/BuilderTab.jsx#L177-L189)

```javascript
// Keep same function reference if dependencies don't change
const handleUndo = useCallback(() => {
  undo();
  setSelectedCell(null);
  setSelectedCellRange(null);
  setSelectedRowIndex(null);
  setSelectedRange(null);
}, [undo, setSelectedCell, setSelectedCellRange, setSelectedRowIndex, setSelectedRange]);
```

**Key points**:
- Useful when passing functions to child components as props
- Function recreated only when dependencies change
- Overuse can hurt performance (memoization has costs)

**Related concepts**: [React.memo](https://react.dev/reference/react/memo), [useMemo](https://react.dev/reference/react/useMemo)

---

### Custom Hooks

**One-line summary**: Extract reusable logic into Hooks to share across multiple components

**Project example**: [useLocalStorage.js](../src/hooks/useLocalStorage.js), [useToast.js](../src/hooks/useToast.js)

```javascript
// Custom Hook: state synced with localStorage
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

// Usage
const [rows, setRows] = useLocalStorage("rows", []);
```

**Key points**:
- Name must start with `use` (Hook rules)
- Compose other Hooks together
- Separates UI rendering from state management logic

**Project's Custom Hooks**:
- `useLocalStorage`: Auto-sync with localStorage
- `useToast`: Toast notification management
- `useHistory`: Undo/Redo functionality
- `useKeyboardNavigation`: Keyboard navigation
- `useCellSelection`: Cell selection logic
- `useRowSelection`: Row selection logic

**Related concepts**: [Separation of Concerns](#separation-of-concerns)

---

### Props

**One-line summary**: A mechanism for passing data from parent to child components

**Project example**: [BuilderTab.jsx:474-495](../src/components/BuilderTab.jsx#L474-L495)

```javascript
// Parent: BuilderTab
<UTMTableRow
  row={row}
  index={index}
  editingCell={editingCell}
  onToggleSelect={toggleSelect}
  onChange={handleChange}
  onKeyDown={handleKeyDown}
/>

// Child: UTMTableRow.jsx
function UTMTableRow({ row, index, editingCell, onToggleSelect, onChange, onKeyDown }) {
  // Use props
  return <tr>...</tr>;
}
```

**Key points**:
- Unidirectional data flow (parent → child)
- Children should only read props, not modify them
- Functions can also be passed as props (event handlers)

**Related concepts**: [Component Structure](#component-structure)

---

### Conditional Rendering

**One-line summary**: A pattern for rendering different UI based on conditions

**Project example**: [UTMTableInput.jsx:43-57](../src/components/UTMTableInput.jsx#L43-L57)

```javascript
// Render div in cell selection mode, input in edit mode
if (isCellSelected) {
  return <div>{value}</div>;
}

return <input value={value} />;
```

**Other patterns**:

```javascript
// 1. Ternary operator
{allSelected ? "Deselect All" : "Select All"}

// 2. && operator (render only if true)
{toast && <Toast message={toast.message} />}

// 3. disabled attribute
<button disabled={!hasSelectedRows}>Save Selected</button>
```

**Related concepts**: [Props](#props)

---

## React Advanced Patterns

### Separation of Concerns

**One-line summary**: Separate UI rendering logic from business logic to improve code reusability and testability

**Project example**: [BuilderTab.jsx](../src/components/BuilderTab.jsx) vs [useKeyboardNavigation.js](../src/hooks/useKeyboardNavigation.js)

```javascript
// ❌ Bad: All logic in component
function BuilderTab() {
  const [rows, setRows] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);

  const handleKeyDown = (e) => {
    // 100 lines of keyboard logic...
  };

  return <table>...</table>;
}

// ✅ Good: Logic extracted to Hook
function BuilderTab() {
  const [rows, setRows] = useState([]);

  // Keyboard logic separated into Hook
  const { selectedCell, handleKeyDown } = useKeyboardNavigation(rows, setRows);

  return <table>...</table>;
}
```

**Project's separation examples**:
- `BuilderTab.jsx`: UI rendering only
- `useKeyboardNavigation.js`: Keyboard navigation logic
- `useCellSelection.js`: Cell selection/copy-paste logic
- `useRowSelection.js`: Row selection/copy-paste logic
- `urlBuilder.js`: UTM URL generation logic (pure functions)

**Related concepts**: [Custom Hooks](#custom-hooks), [Utility Functions](#utility-functions)

---

### flushSync

**One-line summary**: Force React to apply state updates synchronously so DOM updates immediately

**Project example**: [useKeyboardNavigation.js:243-252](../src/hooks/useKeyboardNavigation.js#L243-L252)

```javascript
import { flushSync } from "react-dom";

// Last row + Enter → Add new row and focus immediately
if (rowIndex === rows.length - 1) {
  // Synchronously update state (DOM immediately reflects)
  flushSync(() => {
    const newRow = createEmptyRow();
    setRows((prevRows) => [...prevRows, newRow]);
  });

  // DOM already updated, can focus immediately
  requestAnimationFrame(() => {
    focusCell(rowIndex + 1, field);
  });
}
```

**Key points**:
- By default, React batches state updates (async)
- `flushSync` forces immediate DOM update so next line of code sees latest DOM
- Overuse hurts performance (bypasses React's optimizations)

**Related concepts**: [requestAnimationFrame](#requestanimationframe)

---

### requestAnimationFrame

**One-line summary**: Execute a function aligned with the browser's next rendering cycle (usually 60fps, every 16.67ms)

**Project example**: [useKeyboardNavigation.js:88-93](../src/hooks/useKeyboardNavigation.js#L88-L93)

```javascript
// Wait for DOM to render after state update, then focus
setSelectedRowIndex(rowIndex);

requestAnimationFrame(() => {
  const rowElement = document.querySelector(`tr[data-row-index="${rowIndex}"]`);
  if (rowElement) {
    rowElement.focus();
  }
});
```

**Key points**:
- Executes DOM manipulation aligned with rendering cycle to prevent flickering
- Smoother animations and UI updates than `setTimeout(fn, 0)`
- Browser executes when ready to render

**Use cases**:
- Focus after state change
- Implement animations
- Adjust scroll position

**Related concepts**: [flushSync](#flushsync), [useEffect](#useeffect)

---

### structuredClone

**One-line summary**: Browser API for safely performing deep clones of objects

**Project example**: [useHistory.js:87-89](../src/hooks/useHistory.js#L87-L89)

```javascript
// Deep clone needed to save state in history for Undo/Redo
const cloneState = useCallback((state) => {
  return structuredClone(state);
}, []);
```

**Key points**:
- Safer than `JSON.parse(JSON.stringify(obj))` (supports Date, Map, Set, etc.)
- Handles circular references
- Cannot clone functions, DOM nodes, symbols

**Comparison**:

```javascript
// ❌ Shallow copy: nested objects share references
const shallow = { ...original };

// ❌ JSON method: loses Date, Map, Set, etc.
const json = JSON.parse(JSON.stringify(original));

// ✅ Deep clone: copies all nested objects
const deep = structuredClone(original);
```

**Related concepts**: [Spread Operator](#spread-operator), [Undo/Redo](#undo-redo)

---

### Debouncing

**One-line summary**: Delay consecutive events to process only the last one for performance optimization

**Project example**: [BuilderTab.jsx:354-360](../src/components/BuilderTab.jsx#L354-L360)

```javascript
// Saving to localStorage on every keystroke is inefficient
// → Save only when there's no additional input for 500ms
useEffect(() => {
  const timer = setTimeout(() => {
    localStorage.setItem(STORAGE_KEYS.ROWS, JSON.stringify(rows));
  }, 500);

  // Cleanup: cancel previous timer when new input comes
  return () => clearTimeout(timer);
}, [rows]);
```

**Key points**:
- Used for frequent events: input fields, scroll, resize
- Implemented with `setTimeout` + cleanup pattern
- Delay time depends on UX (typically 300-500ms)

**Comparison: Throttling vs Debouncing**:
- **Debouncing**: Process only the last event (search input)
- **Throttling**: Process at regular intervals (scroll events)

**Related concepts**: [useEffect](#useeffect), [localStorage](#localstorage)

---

## State Management Patterns

### Undo/Redo

**One-line summary**: Save past states in a stack to implement undo/redo functionality

**Project example**: [useHistory.js](../src/hooks/useHistory.js)

```javascript
// State structure: { past: [], present: {}, future: [] }
const historyReducer = (state, action) => {
  switch (action.type) {
    case "UNDO":
      if (state.past.length === 0) return state;

      const previous = state.past[state.past.length - 1];
      return {
        past: state.past.slice(0, -1),         // Remove last
        present: previous,                     // Restore previous state
        future: [state.present, ...state.future], // Add current to future
      };

    case "REDO":
      if (state.future.length === 0) return state;

      const next = state.future[0];
      return {
        past: [...state.past, state.present],  // Add current to past
        present: next,                         // Move to future state
        future: state.future.slice(1),         // Remove first
      };
  }
};
```

**Key points**:
- Manage 3 stacks: past, present, future
- Undo: present → future, last of past → present
- Redo: present → past, first of future → present
- New action clears future

**Project example**: [BuilderTab.jsx:384-401](../src/components/BuilderTab.jsx#L384-L401) (Keyboard shortcuts)

```javascript
// Cmd+Z: Undo
if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
  e.preventDefault();
  if (canUndo) handleUndo();
}

// Cmd+Shift+Z: Redo
if ((e.metaKey || e.ctrlKey) && e.key === "z" && e.shiftKey) {
  e.preventDefault();
  if (canRedo) handleRedo();
}
```

**Related concepts**: [useReducer](#usereducer), [structuredClone](#structuredclone)

---

### History Stack

**One-line summary**: Manage past/present/future states in arrays for time travel capability

**Project example**: [useHistory.js:77-81](../src/hooks/useHistory.js#L77-L81)

```javascript
const [state, dispatch] = useReducer(historyReducer, {
  past: [],                  // Previous states
  present: initialState,     // Current state
  future: [],                // Undone states
});
```

**History flow**:

```javascript
// 1. Initial state
{ past: [], present: A, future: [] }

// 2. New action (A → B)
{ past: [A], present: B, future: [] }

// 3. Undo (B → A)
{ past: [], present: A, future: [B] }

// 4. New action (A → C) → future cleared!
{ past: [A], present: C, future: [] }
```

**Max history limit**: [useHistory.js:26-30](../src/hooks/useHistory.js#L26-L30)

```javascript
case "RECORD": {
  const newPast = [...state.past, action.payload];
  if (newPast.length > maxHistory) {
    newPast.shift(); // Remove oldest state
  }
  return { past: newPast, present: state.present, future: [] };
}
```

**Related concepts**: [Undo/Redo](#undo-redo)

---

### Optimistic Updates

**One-line summary**: Update UI immediately without waiting for server response for fast UX (rollback on failure)

**Project example**: [BuilderTab.jsx:317-323](../src/components/BuilderTab.jsx#L317-L323)

```javascript
// Copy URL: Clipboard API is async but show toast immediately
const copyUrl = (row) => {
  const url = buildUTMUrl(row);
  if (url) {
    navigator.clipboard.writeText(url); // Async
    showToast("URL copied to clipboard!", "success"); // Show immediately
  }
};
```

**General pattern**:

```javascript
// 1. Update UI immediately (optimistic)
setRows((prev) => prev.filter((row) => row.id !== deletedId));
showToast("Deleted successfully!", "success");

// 2. Server request
try {
  await api.deleteRow(deletedId);
} catch (error) {
  // 3. Rollback on failure
  setRows(originalRows);
  showToast("Delete failed!", "error");
}
```

**Key points**:
- Users experience instant feedback
- Smooth UX even with network latency
- Must handle failure cases

**Related concepts**: [useState](#usestate), [Undo/Redo](#undo-redo)

---

## Local Storage

### localStorage

**One-line summary**: Store key-value pairs as strings in the browser (persists across page refreshes)

**Project example**: [useLocalStorage.js:11-18](../src/hooks/useLocalStorage.js#L11-L18)

```javascript
// Save (strings only)
localStorage.setItem("rows", JSON.stringify([{ id: 1, name: "test" }]));

// Read
const item = localStorage.getItem("rows");
const rows = item ? JSON.parse(item) : [];

// Delete
localStorage.removeItem("rows");
localStorage.clear(); // Clear all
```

**Key points**:
- Isolated per domain (other sites can't access)
- Storage limit: typically 5-10MB
- Synchronous API (can block main thread)
- Only strings allowed → convert objects with JSON

**Security notes**:
- Don't store sensitive data (passwords, tokens)
- Vulnerable to XSS attacks (accessible via JavaScript)

**Related concepts**: [JSON.stringify/parse](#json-methods), [useLocalStorage Hook](#custom-hooks)

---

### JSON Methods

**One-line summary**: Convert between JavaScript objects and JSON strings

**Project example**: [useLocalStorage.js](../src/hooks/useLocalStorage.js)

```javascript
// Object → JSON string
const obj = { id: 1, name: "test" };
const json = JSON.stringify(obj);
// → '{"id":1,"name":"test"}'

// JSON string → Object
const parsed = JSON.parse(json);
// → { id: 1, name: "test" }
```

**Error handling**:

```javascript
try {
  const item = localStorage.getItem("rows");
  return item ? JSON.parse(item) : initialValue;
} catch (error) {
  // JSON parse failed (invalid format)
  console.error("Error parsing JSON:", error);
  return initialValue;
}
```

**Key points**:
- `JSON.stringify`: Object → string
- `JSON.parse`: String → object
- Cannot convert: functions, undefined, Symbol
- Date becomes string (caution)

**Related concepts**: [localStorage](#localstorage)

---

## Keyboard Interactions

### onKeyDown

**One-line summary**: Event handler for keyboard input events

**Project example**: [useKeyboardNavigation.js:112-289](../src/hooks/useKeyboardNavigation.js#L112-L289)

```javascript
const handleKeyDown = (e, rowIndex, field) => {
  // Detect specific keys
  if (e.key === "Enter") {
    e.preventDefault();
    focusCell(rowIndex + 1, field);
  }

  // Modifier key combinations
  if ((e.metaKey || e.ctrlKey) && e.key === "z") {
    e.preventDefault();
    undo();
  }

  // Shift combinations
  if (e.shiftKey && e.key === "ArrowDown") {
    e.preventDefault();
    // Range selection...
  }
};
```

**Common key values**:
- Arrow keys: `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`
- Special keys: `Enter`, `Escape`, `Tab`, `Backspace`, `Delete`
- Character keys: `a`, `b`, `1`, `2`, etc. (length 1)
- Modifier checks: `e.ctrlKey`, `e.metaKey`, `e.shiftKey`, `e.altKey`

**Key points**:
- `e.preventDefault()`: Prevent browser default behavior
- `e.stopPropagation()`: Stop event bubbling
- macOS uses `e.metaKey` (Cmd), Windows/Linux uses `e.ctrlKey`

**Related concepts**: [Composition Events](#composition-events), [Selection API](#selection-api)

---

### Selection API

**One-line summary**: Control cursor position and selection range in input/textarea elements

**Project example**: [useKeyboardNavigation.js:117-118](../src/hooks/useKeyboardNavigation.js#L117-L118)

```javascript
const input = e.target;
const cursorAtStart = input.selectionStart === 0;
const cursorAtEnd = input.selectionStart === input.value.length;

// Move to right cell only when cursor is at end
if (e.key === "ArrowRight" && cursorAtEnd) {
  e.preventDefault();
  focusCell(rowIndex, fields[currentFieldIndex + 1]);
}
```

**Key properties**:
- `selectionStart`: Selection start position (cursor position)
- `selectionEnd`: Selection end position
- `selectionDirection`: Selection direction ("forward" | "backward")

**Methods**:

```javascript
// Set cursor position
input.setSelectionRange(0, 0); // Move to start
input.setSelectionRange(length, length); // Move to end

// Select all
input.select();
```

**Project example**: [BuilderTab.jsx:374](../src/components/BuilderTab.jsx#L374)

```javascript
// Move cursor to end after Undo/Redo
const length = input.value?.length ?? 0;
input.setSelectionRange(length, length);
```

**Related concepts**: [onKeyDown](#onkeydown), [Focus Management](#focus-management)

---

### Composition Events

**One-line summary**: Track IME (Input Method Editor) composition state for Korean, Japanese, Chinese input

**Project example**: [useKeyboardNavigation.js:30](../src/hooks/useKeyboardNavigation.js#L30), [BuilderTab.jsx:489-490](../src/components/BuilderTab.jsx#L489-L490)

```javascript
const [isComposing, setIsComposing] = useState(false);

// Ignore Enter during Korean composition (prevent treating composition as action)
if (e.key === "Enter") {
  if (isComposing) return; // Ignore during composition
  e.preventDefault();
  focusCell(rowIndex + 1, field);
}

// JSX
<input
  onCompositionStart={() => setIsComposing(true)}
  onCompositionEnd={() => setIsComposing(false)}
/>
```

**Event sequence**:

```
Korean input: "안녕" + Enter
1. compositionstart (ㅇ)
2. keydown (ㅇ)
3. compositionupdate (안)
4. compositionend (안녕)
5. keydown (Enter) ← Process only when isComposing is false
```

**Key points**:
- Enter during Korean input just completes composition, not an action
- Track composition state with `isComposing` flag
- Ignore arrow keys, Enter during composition

**Related concepts**: [onKeyDown](#onkeydown)

---

### Focus Management

**One-line summary**: Programmatically control focus on DOM elements

**Project example**: [UTMTableInput.jsx:28-40](../src/components/UTMTableInput.jsx#L28-L40)

```javascript
const inputRef = useRef(null);

// Auto-focus in edit mode
useEffect(() => {
  if (isEditing && inputRef.current) {
    inputRef.current.focus();
  }
}, [isEditing]);

// JSX
<input ref={inputRef} />
```

**Project example 2**: [useKeyboardNavigation.js:39-49](../src/hooks/useKeyboardNavigation.js#L39-L49) (querySelector approach)

```javascript
const focusCell = (rowIndex, field) => {
  const selector = `input[data-row-index="${rowIndex}"][data-field="${field}"]`;
  const nextInput = document.querySelector(selector);

  if (nextInput) {
    nextInput.focus();
    nextInput.select(); // Select all after focus
  }
};
```

**Key points**:
- `ref.current.focus()`: Focus via ref
- `document.querySelector().focus()`: Focus via DOM query
- Use `requestAnimationFrame` to focus after DOM rendering

**Related concepts**: [useRef](#useref), [requestAnimationFrame](#requestanimationframe)

---

## CSS & Styling

### Tailwind CSS

**One-line summary**: Utility-first CSS framework for styling with classes only

**Project example**: [BuilderTab.jsx:424-430](../src/components/BuilderTab.jsx#L424-L430)

```javascript
<button
  onClick={handleReset}
  className="border border-gray-600 text-gray-400 hover:bg-gray-800 hover:text-gray-300 px-4 py-2 rounded font-medium transition duration-200"
>
  Reset All
</button>
```

**Common utility classes**:

```css
/* Layout */
flex, grid, block, inline-block
items-center, justify-between
p-4, px-6, py-2, m-auto

/* Colors (dark theme) */
bg-gray-800, text-gray-300, border-gray-700

/* Responsive */
hover:bg-blue-700, focus:outline-none

/* Sizing */
w-full, h-8, max-w-sm, min-h-[28px]

/* Others */
rounded, font-medium, transition, duration-200
```

**Project's dark theme colors**:
- Background: `bg-[#1a1a2e]`, `bg-[#16213e]`, `bg-[#1a2642]`
- Text: `text-gray-300`, `text-gray-400`
- Border: `border-gray-700`

**Related concepts**: [Conditional Classes](#conditional-classes)

---

### Conditional Classes

**One-line summary**: Dynamically apply className based on conditions

**Project example**: [BuilderTab.jsx:447-454](../src/components/BuilderTab.jsx#L447-L454)

```javascript
<button
  onClick={saveSelected}
  disabled={!hasSelectedRows}
  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded"
>
  Save Selected
</button>
```

**Patterns**:

```javascript
// 1. Tailwind variants (recommended)
<div className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-500" />

// 2. Template literals
<div className={`bg-blue-500 ${isActive ? 'ring-2' : ''}`} />

// 3. Conditional string concatenation
<div className={isActive ? "bg-blue-500" : "bg-gray-500"} />
```

**Project example 2**: [UTMTableRow.jsx](../src/components/UTMTableRow.jsx) (Row selection highlight)

```javascript
<tr
  className={selectedRowIndex === index ? "bg-blue-900/30" : "hover:bg-[#1a2642]"}
>
  ...
</tr>
```

**Related concepts**: [Tailwind CSS](#tailwind-css)

---

### Dark Theme

**One-line summary**: Dark mode UI design (reduces eye strain, saves battery)

**Project color palette**:

```javascript
// Defined in tailwind.config.js or used directly
Background: #1a1a2e (darkest), #16213e (card), #1a2642 (hover)
Text: #e5e7eb (bright), #9ca3af (medium), #6b7280 (dark)
Accent: #3b82f6 (blue), #8b5cf6 (purple), #ef4444 (red)
```

**Project example**: [index.css](../src/index.css)

```css
body {
  background-color: #1a1a2e;
  color: #e5e7eb;
}
```

**Dark theme best practices**:
- Use slightly bright gray instead of pure black (#000)
- Text uses slightly dark white instead of pure white (#fff)
- Use borders instead of shadows for separation
- Maintain sufficient contrast (accessibility)

**Related concepts**: [Tailwind CSS](#tailwind-css)

---

## Browser APIs

### Clipboard API

**One-line summary**: Read/write clipboard functionality (copy/paste)

**Project example**: [useCellSelection.js:135-143](../src/hooks/useCellSelection.js#L135-L143)

```javascript
// Copy
navigator.clipboard.writeText("Text to copy");

// Paste
navigator.clipboard.readText().then((text) => {
  console.log("Pasted content:", text);
});
```

**Project example 2**: [useCellSelection.js:125-136](../src/hooks/useCellSelection.js#L125-L136) (Range copy)

```javascript
// Copy cell range separated by tabs/newlines (Excel/Google Sheets compatible)
const cellValues = [];
for (let r = minRow; r <= maxRow; r++) {
  const rowValues = [];
  for (let f = minFieldIndex; f <= maxFieldIndex; f++) {
    rowValues.push(rows[r][fields[f]] || "");
  }
  cellValues.push(rowValues.join("\t")); // Separate columns with tabs
}
const textToCopy = cellValues.join("\n"); // Separate rows with newlines
navigator.clipboard.writeText(textToCopy);
```

**Key points**:
- Only works in HTTPS environments (security constraint)
- Async API (returns Promise)
- Requires user permission (some browsers)

**Related concepts**: [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

---

### Window.open

**One-line summary**: Open new browser windows or tabs

**Project example**: [BuilderTab.jsx:326-332](../src/components/BuilderTab.jsx#L326-L332)

```javascript
const openUrlInNewTab = (row) => {
  const url = buildUTMUrl(row);
  if (url) {
    window.open(url, "_blank", "noopener,noreferrer");
    showToast("Opened in new tab!", "success");
  }
};
```

**Parameters**:
- First: URL
- Second: Target (`_blank` = new tab)
- Third: Options (`noopener,noreferrer` = security)

**Security options**:
- `noopener`: Block `window.opener` access from new window
- `noreferrer`: Don't send Referer header

**Related concepts**: [Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)

---

## React Router

### BrowserRouter

**One-line summary**: Router using HTML5 History API (clean URLs like `/about`)

**Project example**: [App.jsx:6-14](../src/App.jsx#L6-L14)

```javascript
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/utm-builder" element={<UTMBuilderPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**Key points**:
- Requires server configuration (serve index.html for all routes)
- Clean URLs (`/about` vs `/#/about`)
- Supports back/forward buttons

**Alternative**: `HashRouter` (no server config needed, has `#` in URL)

**Related concepts**: [Routes/Route](#routes-route)

---

### Routes/Route

**One-line summary**: Map components to URL paths

**Project example**: [App.jsx:8-11](../src/App.jsx#L8-L11)

```javascript
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/utm-builder" element={<UTMBuilderPage />} />
</Routes>
```

**Dynamic routes**:

```javascript
// URL parameters
<Route path="/user/:id" element={<UserProfile />} />

// Use in component
import { useParams } from "react-router-dom";
const { id } = useParams(); // /user/123 → id = "123"
```

**Navigation**:

```javascript
import { Link, useNavigate } from "react-router-dom";

// Link component
<Link to="/about">About</Link>

// Programmatic navigation
const navigate = useNavigate();
navigate("/about");
```

**Related concepts**: [BrowserRouter](#browserrouter)

---

## JavaScript Core

### Array Methods

**One-line summary**: Built-in methods for array manipulation

**Project example**: [BuilderTab.jsx](../src/components/BuilderTab.jsx)

```javascript
// map: Transform each element
rows.map((row) => ({ ...row, selected: false }));

// filter: Keep only matching elements
rows.filter((row) => row.selected);

// find: Get first matching element
rows.find((row) => row.id === id);

// every: All elements match condition?
rows.every((row) => row.selected);

// some: Any element matches condition?
rows.some((row) => row.selected);

// reduce: Accumulate calculation
const total = numbers.reduce((sum, num) => sum + num, 0);
```

**Project example 2**: [BuilderTab.jsx:268-295](../src/components/BuilderTab.jsx#L268-L295)

```javascript
const savedItems = selectedRows
  .map((row) => {
    const fullUrl = buildUTMUrl(row);
    if (!fullUrl) return null;

    return {
      id: Date.now() + Math.random(),
      campaignName: `${row.source}-${row.medium}-${row.campaign}`,
      fullUrl: fullUrl,
    };
  })
  .filter(Boolean); // Remove nulls
```

**Key points**:
- Don't mutate original array (immutability)
- Chainable: `arr.filter().map()`
- `map` always returns same length, `filter` can reduce

**Related concepts**: [Spread Operator](#spread-operator)

---

### Spread Operator

**One-line summary**: Spread arrays or objects to copy/merge

**Project example**: [BuilderTab.jsx:144-147](../src/components/BuilderTab.jsx#L144-L147)

```javascript
// Copy object and change property
setRows((prevRows) =>
  prevRows.map((row) =>
    row.id === id ? { ...row, selected: !row.selected } : row
  )
);

// Copy array and add item
const newRow = createEmptyRow();
setRows((prevRows) => [...prevRows, newRow]);

// Copy array and remove items
const remainingRows = rows.filter((row) => !row.selected);
setRows(remainingRows);
```

**Object merging**:

```javascript
const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };
const merged = { ...obj1, ...obj2 }; // { a: 1, b: 3, c: 4 }
```

**Key points**:
- Performs shallow copy only
- Nested objects share references
- Essential for maintaining immutability

**Related concepts**: [structuredClone](#structuredclone), [Destructuring](#destructuring)

---

### Destructuring

**One-line summary**: Extract values from objects or arrays into variables

**Project example**: [BuilderTab.jsx:68](../src/components/BuilderTab.jsx#L68)

```javascript
// Object destructuring
const { rows, editingCell } = historyState;

// Array destructuring
const [state, setState, { undo, redo }] = useHistory(...);

// Function parameters
function UTMTableRow({ row, index, onToggleSelect, onChange }) {
  // row, index, onToggleSelect, onChange available
}
```

**Default values**:

```javascript
const { name = "Guest", age = 0 } = user;
```

**Nested destructuring**:

```javascript
const { user: { name, email } } = response;
```

**Related concepts**: [Props](#props)

---

### Template Literals

**One-line summary**: String templates with backticks (`) that allow variable interpolation

**Project example**: [BuilderTab.jsx:282](../src/components/BuilderTab.jsx#L282)

```javascript
// Variable interpolation
const campaignName = `${row.source}-${row.medium}-${row.campaign}`;

// Multi-line strings
const html = `
  <div>
    <h1>${title}</h1>
    <p>${content}</p>
  </div>
`;

// Query selector
const selector = `input[data-row-index="${rowIndex}"][data-field="${field}"]`;
```

**Project example 2**: [urlBuilder.js](../src/utils/urlBuilder.js)

```javascript
const params = new URLSearchParams({
  utm_source: source,
  utm_medium: medium,
  utm_campaign: campaign,
});
return `${baseUrl}?${params.toString()}`;
```

**Related concepts**: [String Concatenation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/concat)

---

### Optional Chaining

**One-line summary**: Safely access nested object properties (prevents undefined errors)

**Project example**: [BuilderTab.jsx:374](../src/components/BuilderTab.jsx#L374)

```javascript
// Safe access with ?.
const length = input.value?.length ?? 0;

// Same meaning (traditional way)
const length = input.value ? input.value.length : 0;
```

**Various uses**:

```javascript
// Object properties
user?.address?.street

// Array elements
users?.[0]?.name

// Function calls
obj.method?.()
```

**Project example 2**: [useKeyboardNavigation.js:125-128](../src/hooks/useKeyboardNavigation.js#L125-L128)

```javascript
const isEditingMode = editingCell &&
  editingCell.rowIndex === rowIndex &&
  editingCell.field === field;
```

**Related concepts**: [Nullish Coalescing (`??`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)

---

## Code Structure & Patterns

### Component Structure

**One-line summary**: Separate components by functionality to improve reusability and maintainability

**Project structure**:

```
src/
├── components/          # UI components
│   ├── BuilderTab.jsx  # Main table
│   ├── UTMTableRow.jsx # Table row
│   ├── UTMTableInput.jsx # Input field
│   └── Toast.jsx       # Notification
├── hooks/              # Reusable logic
│   ├── useLocalStorage.js
│   └── useKeyboardNavigation.js
├── utils/              # Pure functions
│   ├── urlBuilder.js
│   └── validation.js
└── constants/          # Constants
    └── index.js
```

**Component separation principles**:
- One component has one responsibility
- Consider splitting if over 50-100 lines
- Repeated UI should be separate components

**Project example**: [UTMTableRow.jsx](../src/components/UTMTableRow.jsx)

```javascript
// Separated row rendering logic from BuilderTab
function UTMTableRow({ row, index, ... }) {
  return (
    <tr>
      <td><input type="checkbox" /></td>
      <td>{index + 1}</td>
      <td><UTMTableInput field="baseUrl" /></td>
      // ...
    </tr>
  );
}
```

**Related concepts**: [Props](#props), [Separation of Concerns](#separation-of-concerns)

---

### Utility Functions

**One-line summary**: Separate business logic with pure functions to make code testable and reusable

**Project example**: [urlBuilder.js](../src/utils/urlBuilder.js)

```javascript
// Pure function: same input → same output, no side effects
export const buildUTMUrl = (row) => {
  const { baseUrl, source, medium, campaign, term, content } = row;

  if (!baseUrl) return "";

  const params = new URLSearchParams({
    utm_source: source,
    utm_medium: medium,
    utm_campaign: campaign,
    ...(term && { utm_term: term }),
    ...(content && { utm_content: content }),
  });

  return `${baseUrl}?${params.toString()}`;
};
```

**Pure function benefits**:
- Easy to test (just verify input → output)
- Reusable (call from anywhere)
- Predictable (no side effects)

**Project example 2**: [rowFactory.js](../src/utils/rowFactory.js)

```javascript
export const createEmptyRow = () => ({
  id: Date.now() + Math.random(),
  baseUrl: "",
  source: "",
  medium: "",
  campaign: "",
  term: "",
  content: "",
  selected: false,
});
```

**Related concepts**: [Separation of Concerns](#separation-of-concerns)

---

### Constants

**One-line summary**: Separate magic numbers/strings into constants for better maintainability

**Project example**: [constants/index.js](../src/constants/index.js)

```javascript
export const STORAGE_KEYS = {
  ROWS: "utmBuilderRows",
  SAVED: "utmBuilderSaved",
};

export const DEBOUNCE_DELAY = 500;

export const FIELDS = ["baseUrl", "source", "medium", "campaign", "term", "content"];
```

**Usage example**: [BuilderTab.jsx:23](../src/components/BuilderTab.jsx#L23)

```javascript
import { STORAGE_KEYS, DEBOUNCE_DELAY, FIELDS } from "../constants";

const saved = localStorage.getItem(STORAGE_KEYS.ROWS);
```

**Benefits**:
- Prevent typos (IDE autocomplete)
- Change value in one place
- Clear meaning (`500` vs `DEBOUNCE_DELAY`)

**Related concepts**: [ES Modules](#es-modules)

---

## Build Tools

### Vite

**One-line summary**: Next-generation frontend tool providing fast dev server and optimized builds

**Project example**: [package.json:6-9](../package.json#L6-L9)

```json
"scripts": {
  "dev": "vite",           // Dev server (http://localhost:5173)
  "build": "vite build",   // Production build
  "preview": "vite preview" // Preview build result
}
```

**Key features**:
- Instant dev server start (cold start < 1s)
- HMR (Hot Module Replacement): Instant reflection of file changes
- Native ES Modules support
- Rollup-based optimized builds

**Vite vs Create React App**:
- Vite: Fast, ES Modules, simple config
- CRA: Slow, Webpack, complex config

**Related concepts**: [ES Modules](#es-modules)

---

### ES Modules

**One-line summary**: JavaScript's official module system (import/export)

**Project example**: [BuilderTab.jsx:1-10](../src/components/BuilderTab.jsx#L1-L10)

```javascript
// Named export/import
export const buildUTMUrl = (row) => { ... };
import { buildUTMUrl } from "../utils/urlBuilder";

// Default export/import
export default function BuilderTab() { ... }
import BuilderTab from "./components/BuilderTab";

// Multiple imports
import { buildUTMUrl, validateUrl } from "../utils/urlBuilder";

// Import all
import * as urlUtils from "../utils/urlBuilder";
```

**package.json setting**: [package.json:5](../package.json#L5)

```json
"type": "module"
```

**Key points**:
- Can omit file extensions (`.js`, `.jsx`)
- Static analysis possible (tree shaking)
- Native browser support

**Related concepts**: [Vite](#vite)

---

## Conclusion

This document summarizes core concepts used in the UTM Builder project.

**Learning tips**:
1. Understand concept → Read project code → Try modifying it
2. Quickly find unknown concepts in [Quick Reference](quick-reference.md)
3. Learn by connecting related concepts (follow links)

**Next steps**:
- React official docs: https://react.dev
- Tailwind CSS docs: https://tailwindcss.com
- MDN JavaScript guide: https://developer.mozilla.org/en-US/docs/Web/JavaScript

Happy Coding! 🚀
