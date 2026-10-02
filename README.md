# CounterVerse

Count smarter. Track progress. Achieve more.

CounterVerse is an advanced interactive counter application built with React, Vite, and Tailwind CSS. It features a stunning 3D interactive background, a responsive dark-mode first design, and advanced counting features like undo/redo, variable step sizes, goal tracking, and activity history.

## Features

- **3D Interactive Background**: Immersive tubes background that reacts to your cursor.
- **Smart Step Controls**: Increment or decrement by custom step sizes.
- **Goal Tracker**: Set and visualize progress towards your goals.
- **Undo/Redo**: Full history state tracking to undo or redo previous actions.
- **Activity History**: View a timeline of your recent counting activity.
- **Keyboard Shortcuts**: Control the counter entirely from your keyboard.
- **Local Storage**: All data, preferences, and history are saved automatically.
- **Theme Customization**: Toggle between light and dark modes instantly.

## Keyboard Shortcuts

- `+` or `ArrowUp`: Increment
- `-` or `ArrowDown`: Decrement
- `R`: Reset to zero
- `Z`: Undo last action
- `Y`: Redo undone action

## Tech Stack

- **React 18** (Vite template)
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Framer Motion** & **ThreeJS Components** (for 3D Background)

## Installation & Running Locally

1. Make sure you have Node.js installed.
2. Clone or open the project folder.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Limitations
- History is capped to the 50 most recent events to prevent excessive local storage usage.
- 3D background effects can be turned off manually in code if performance on lower-end devices is a concern.
