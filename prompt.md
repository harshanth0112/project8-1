# Project: CounterVerse — Advanced Interactive Counter Application

## 1. Role and Objective

Act as a senior frontend developer and UI/UX engineer. Build a complete, modern, responsive Counter Application using **React, JSX, Tailwind CSS, and the React `useState` hook**.

This is a learning project, so the code must be beginner-friendly, readable, modular, and properly structured. The application should look like a premium SaaS dashboard rather than a basic college assignment.

**Project name:** CounterVerse
**Tagline:** Count smarter. Track progress. Achieve more.

## 2. Technology Stack

* React with Vite.
* JSX only; do not use TypeScript or TSX.
* Tailwind CSS for styling.
* React functional components and hooks.
* `useState` for application state.
* `useEffect` only where needed for keyboard shortcuts or event listeners.
* Lucide React for icons.
* CSS transitions and lightweight animations.
* No backend, database, authentication, or paid APIs.
* Use `localStorage` to persist counter settings and history across refreshes.

Use the Tailwind CSS installation method compatible with the existing project. If the repository already contains a working setup, preserve it instead of replacing the configuration unnecessarily.

## 3. Design Direction

Create a premium, futuristic interface inspired by modern productivity dashboards.

### Visual style

* Dark-first interface with an optional light theme.
* Background: deep navy or charcoal with subtle indigo and violet gradient accents.
* Glassmorphism cards with restrained blur, translucent surfaces, and subtle borders.
* Large, highly readable counter typography.
* Rounded cards, balanced spacing, soft shadows, and clean visual hierarchy.
* Smooth hover, focus, and pressed states.
* Responsive layout for mobile, tablet, and desktop.
* Use a consistent spacing system and accessible color contrast.

Avoid excessive gradients, clutter, oversized animations, and unnecessary decorative elements.

### Layout

1. Top navigation with CounterVerse logo, theme toggle, and settings button.
2. Welcome section with title and a short description.
3. Main counter card featuring the current count, decrement button, increment button, and reset button.
4. Goal-tracking card with a circular or linear progress indicator.
5. Counter configuration panel.
6. Activity history timeline.
7. Statistics cards and a clear footer.

On mobile, stack the sections vertically and make the primary controls easy to tap.

## 4. Core Counter Features

### A. Counter display

* Initialize the counter to zero using `useState`.
* Display the current count prominently.
* Increment the count by one.
* Decrement the count by one.
* Reset the count to zero.
* Prevent the count from becoming negative.
* Show "Minimum limit reached" when the count is zero.
* Display a contextual message when the count changes.
* Animate the number subtly when its value changes.

### B. Smart step controls

Provide selectable step values:

* +1 / -1
* +5 / -5
* +10 / -10
* Custom step value

When a step is selected, both increment and decrement should use it. Validate custom values and reject zero, negative, or invalid step values.

### C. Goal tracker

* Allow the user to set a target value.
* Display progress as a percentage and a visual progress bar or circular ring.
* Calculate progress from the current count and target.
* Cap the visual progress at 100%.
* Display "Keep going!" before reaching the target.
* Display "Goal achieved!" with a celebration animation when the target is reached.
* Allow the user to update the target.
* Prevent invalid target values.

### D. Undo and redo

* Provide Undo and Redo buttons.
* Record counter changes in a predictable history structure.
* Undo the most recent counter action.
* Redo an undone action.
* Disable Undo or Redo when no corresponding action is available.
* Ensure reset and step-based operations work correctly with the history.
* Avoid creating duplicate history entries when restoring a previous state.

### E. Activity history

Display recent actions in a timeline, including:

* Action type: increment, decrement, reset, undo, or redo.
* Previous value and resulting value.
* Step amount where applicable.
* Timestamp for each action.

Include a clear-history option with confirmation. Keep the history bounded to a reasonable number of recent entries.

### F. Keyboard shortcuts

Implement:

* `+` or `ArrowUp`: increment.
* `-` or `ArrowDown`: decrement.
* `R`: reset.
* `Z`: undo.
* `Y`: redo.

Do not trigger shortcuts while a user is typing in an input, textarea, or editable element. Prevent browser conflicts where appropriate, clean up event listeners, and display a small keyboard-shortcut help panel.

### G. Theme customization

* Dark and light themes.
* Smooth theme transitions.
* Use consistent colors across cards, buttons, inputs, and charts.
* Persist the selected theme in `localStorage`.
* Provide a clear visual indicator of the active theme.

### H. Additional enhancements

* Statistics: current count, highest count reached, total increment actions, and total decrement actions.
* Milestone badges for reaching 10, 25, 50, and 100.
* Optional auto-increment mode with Start and Stop controls.
* Sound feedback toggle, disabled by default.
* Reset confirmation when the count or history contains meaningful progress.
* Copy current count to clipboard with a visible success message.

## 5. React and State Management Requirements

Use React state for all interactive behavior. Do not manipulate the DOM directly.

Use functional state updates whenever the new value depends on the previous value, for example:

`setCount(previousCount => previousCount + step)`

Keep state organized into meaningful variables or well-defined structures. Separate derived values, such as goal progress and button disabled states, from stored state wherever possible.

Important implementation requirements:

* No direct mutation of arrays or objects in state.
* Use stable and unique keys when rendering history.
* Keep counter, history, and undo/redo behavior consistent.
* Avoid unnecessary state variables that duplicate values derivable from existing state.
* Prevent stale state bugs in keyboard shortcuts and auto-increment.
* Clean up timers and event listeners.
* Do not use `useEffect` for calculations that can be derived during rendering.
* Make sure the minimum count remains zero in every interaction path.

## 6. Suggested Component Structure

Build reusable components where appropriate:

* `App.jsx` — main application and state coordination.
* `Navbar.jsx` — logo, theme toggle, and settings.
* `CounterCard.jsx` — count display and primary controls.
* `StepSelector.jsx` — step-size selection and custom value.
* `GoalTracker.jsx` — target input and progress indicator.
* `StatisticsCards.jsx` — counter statistics and milestones.
* `ActivityHistory.jsx` — action timeline and clear-history control.
* `KeyboardShortcuts.jsx` — keyboard-help panel.
* `ConfirmDialog.jsx` — reusable confirmation dialog.

Use a sensible folder structure. Do not split every tiny UI element into a separate file if it makes the project harder for a beginner to understand.

## 7. Functional Requirements and Edge Cases

Ensure that:

* The initial count is zero for a first-time user.
* Decrement at zero does not change the count.
* Invalid step values and targets are rejected with helpful messages.
* Reset reliably returns the count to zero.
* Undo and redo restore the correct count.
* The progress indicator never exceeds 100%.
* The history remains consistent after resets and restored actions.
* Refreshing the page preserves supported saved settings and data.
* Empty history displays a useful empty state.
* Buttons have clear disabled states.
* All inputs have labels and validation feedback.
* The interface works without network access after dependencies are installed.
* No feature is presented as functional unless it has actually been implemented.

## 8. Accessibility and User Experience

* Use semantic HTML.
* Add accessible labels to icon-only buttons.
* Ensure keyboard focus is visible.
* Use appropriate ARIA attributes where needed.
* Respect `prefers-reduced-motion`.
* Avoid relying on color alone to communicate status.
* Keep animations smooth and non-disruptive.
* Ensure the application remains usable on small screens.

## 9. Deliverables

Generate the actual working source code, not just a design or code snippets.

Include:

1. Complete React JSX components.
2. Tailwind CSS styling and required configuration.
3. Any additional CSS required for custom animations.
4. A working theme toggle.
5. Functional counter controls, step selection, goal tracking, undo/redo, and history.
6. Persistent state using `localStorage`.
7. Responsive design.
8. A README containing setup instructions and feature descriptions.

## 10. Implementation Workflow

Follow this order:

1. Inspect the existing repository and package configuration.
2. Set up or reuse the Vite and Tailwind CSS environment.
3. Implement the basic counter with `useState`.
4. Add step selection, validation, and minimum-limit handling.
5. Implement goal tracking and statistics.
6. Add reliable undo/redo and activity history.
7. Implement keyboard shortcuts and auto-increment cleanup.
8. Add theme switching and persistence.
9. Polish the responsive UI and animations.
10. Run the build, fix errors, and verify all features manually.

Do not stop after creating the visual interface. Wire every button and input to working functionality.

At completion, provide a concise summary of the files created, the features implemented, the commands needed to run the project, and any known limitations.

**Final quality standard:** The result must be a functional, visually polished, responsive React application that demonstrates a clear understanding of `useState`, event handling, conditional rendering, reusable components, and state transitions. Keep the implementation understandable enough for a beginner to explain in a technical interview.
