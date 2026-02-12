# Design Document: Valentine Dashboard

## 1. Overview

The Valentine Dashboard is a macOS Electron application that combines playful gamification with practical productivity tools. The application architecture follows a clear separation between the presentation layer (React-based UI), business logic layer (timer and reminder services), and platform integration layer (Electron main process).

The application flow consists of two main phases:
1. **Valentine Prompt Phase**: An interactive gamified screen that encourages user engagement through dynamic button behavior
2. **Dashboard Phase**: A productivity-focused interface with timers, wellness reminders, and external resource links

The design emphasizes:
- Clean separation of concerns between UI components and business logic
- Testable state management using a unidirectional data flow pattern
- Native macOS integration through Electron APIs
- Deterministic behavior for all interactive elements to enable comprehensive testing

## 2. Architecture

### 2.1 Application Structure

The application follows a layered architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│  (React Components, UI State Management)                 │
└─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│                   Business Logic Layer                   │
│  (Timer Services, Reminder Scheduler, State Machine)     │
└─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│                  Platform Integration Layer              │
│  (Electron Main Process, Native Notifications)           │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Technology Stack

- **Framework**: Electron 40 (latest version for macOS native application)
- **UI Library**: React 19 (latest version) with TypeScript
- **State Management**: React Context API with useReducer for predictable state updates
- **Styling**: Tailwind CSS for rapid development with cutesy, playful styling
- **Build Tool**: Vite for fast development and optimized production builds
- **Testing**: Vitest for unit tests, fast-check for property-based testing
- **Packaging**: electron-builder for macOS application packaging
- **Database**: better-sqlite3 for local state persistence

### 2.3 Process Architecture

**Main Process (Electron)**:
- Window management and lifecycle
- Native menu bar integration
- System notifications
- Deep link handling for external URLs

**Renderer Process (React)**:
- UI rendering and user interaction
- Timer state management
- Wellness reminder scheduling
- Animation orchestration

## 3. Components and Interfaces

### 3.1 Valentine Prompt Screen

**Component: ValentinePrompt**

Manages the interactive Valentine's Day question screen with dynamic button behavior.

```typescript
interface ValentinePromptState {
  noButtonClickCount: number;
  yesButtonSize: number;
  noButtonSize: number;
  noButtonVisible: boolean;
  showSuccessAnimation: boolean;
}

interface ValentinePromptProps {
  onAccept: () => void;
}

// State transitions
type ValentinePromptAction =
  | { type: 'NO_BUTTON_CLICKED' }
  | { type: 'YES_BUTTON_CLICKED' }
  | { type: 'ANIMATION_COMPLETE' };
```

**Button Sizing Logic**:
- Initial Yes button size: 100% (baseline)
- Initial No button size: 100% (baseline)
- On each No button click attempt:
  - Yes button size increases by 10%
  - No button size decreases by 10%
- After 10 clicks: No button is removed (noButtonVisible = false)

**Success Animation**:
- Displays "yipe" text with celebratory styling
- Duration: 2 seconds
- Blocks all user interaction during animation
- Automatically transitions to dashboard on completion

### 3.2 Dashboard

**Component: Dashboard**

The main application interface containing all productivity and wellness tools.

```typescript
interface DashboardProps {
  userName?: string;
}

// Child components
- PomodoroTimer
- FoodTimer
- WellnessReminder
- ExternalLinks
```

### 3.3 Pomodoro Timer

**Component: PomodoroTimer**

Implements the Pomodoro Technique for time management.

```typescript
interface PomodoroTimerState {
  duration: number; // in seconds, default 25 * 60
  remainingTime: number; // in seconds
  isRunning: boolean;
  isPaused: boolean;
}

interface PomodoroTimerActions {
  start: () => void;
  pause: () => void;
  reset: () => void;
  setDuration: (seconds: number) => void;
}

type TimerAction =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESET' }
  | { type: 'TICK' }
  | { type: 'COMPLETE' }
  | { type: 'SET_DURATION'; payload: number };
```

**Timer Behavior**:
- Counts down from configured duration (default: 25 minutes)
- Updates every second when running
- Triggers notification when reaching zero
- Can be paused and resumed
- Reset returns to configured duration

### 3.4 Food Timer

**Component: FoodTimer**

Specialized countdown timer for cooking with preset durations.

```typescript
interface FoodTimerState {
  duration: number; // in seconds
  remainingTime: number; // in seconds
  isRunning: boolean;
  selectedPreset: FoodPreset | null;
}

interface FoodPreset {
  name: string;
  duration: number; // in seconds
}

const FOOD_PRESETS: FoodPreset[] = [
  { name: 'Soft Boiled Egg', duration: 6 * 60 },
  { name: 'Medium Boiled Egg', duration: 8 * 60 },
  { name: 'Hard Boiled Egg', duration: 10 * 60 },
  { name: 'Ramen Noodles', duration: 3 * 60 },
  { name: 'Custom', duration: 0 }
];

interface FoodTimerActions {
  start: () => void;
  pause: () => void;
  reset: () => void;
  setPreset: (preset: FoodPreset) => void;
  setCustomDuration: (seconds: number) => void;
}
```

### 3.5 Wellness Reminder System

**Component: WellnessReminder**

Displays randomized wellness reminders during working hours.

```typescript
interface WellnessReminderState {
  currentReminder: WellnessMessage | null;
  nextReminderTime: Date | null;
  isVisible: boolean;
}

interface WellnessMessage {
  type: 'water' | 'breathing';
  message: string;
}

const WELLNESS_MESSAGES = {
  water: [
    'Time to hydrate, babe. 💧',
    'Drink some water, Pookie. 🥤',
    'Stay hydrated, my love. 💙'
  ],
  breathing: [
    'Take a deep breath 🌬️',
    'Breathe deeply for 30 seconds 🧘',
    'Pause and breathe 💨'
  ]
};

interface WorkingHours {
  start: { hour: number; minute: number }; // 10:30 AM
  end: { hour: number; minute: number };   // 6:30 PM
}
```

**Reminder Scheduling Logic**:
- Check if current time is within working hours (10:30 AM - 6:30 PM)
- If within hours: schedule next reminder at random interval (15-45 minutes)
- If outside hours: clear scheduled reminders
- Randomly select reminder type (water or breathing)
- Display reminder as dismissible notification

### 3.6 External Links

**Component: ExternalLinks**

Provides quick access to external resources.

```typescript
interface ExternalLink {
  label: string;
  url: string;
  icon?: string;
}

const EXTERNAL_LINKS: ExternalLink[] = [
  {
    label: 'Vision Board',
    url: 'https://www.canva.com/[user-specific-url]',
    icon: '🎯'
  },
  {
    label: 'Shared Calendar',
    url: 'https://calendar.google.com/[user-specific-url]',
    icon: '📅'
  }
];

interface ExternalLinksActions {
  openLink: (url: string) => void;
}
```

**Link Opening Behavior**:
- Uses Electron's shell.openExternal() to open URLs in default browser
- Prevents navigation within the Electron window
- Validates URLs before opening

## 4. Data Models

### 4.1 Application State

The root application state follows a finite state machine pattern:

```typescript
type AppPhase = 'valentine-prompt' | 'dashboard';

interface ApplicationState {
  phase: AppPhase;
  valentinePrompt: ValentinePromptState;
  dashboard: DashboardState;
}

interface DashboardState {
  pomodoroTimer: PomodoroTimerState;
  foodTimer: FoodTimerState;
  wellnessReminder: WellnessReminderState;
}
```

### 4.2 Timer State Model

Both timers share a common state structure:

```typescript
interface TimerState {
  duration: number;        // Total duration in seconds
  remainingTime: number;   // Current remaining time in seconds
  isRunning: boolean;      // Whether timer is actively counting
  isPaused: boolean;       // Whether timer is paused (only for Pomodoro)
  startTime: number | null; // Timestamp when timer started
}

// Timer state invariants:
// - remainingTime >= 0
// - remainingTime <= duration
// - If isRunning is true, startTime must not be null
// - If remainingTime is 0, isRunning must be false
```

### 4.3 Reminder State Model

```typescript
interface ReminderSchedule {
  isActive: boolean;
  nextTriggerTime: Date | null;
  currentMessage: WellnessMessage | null;
  workingHours: WorkingHours;
}

// Reminder state invariants:
// - If isActive is true, nextTriggerTime must not be null
// - nextTriggerTime must be within working hours when set
// - currentMessage is null when no reminder is displayed
```

### 4.4 Button State Model

```typescript
interface ButtonState {
  clickCount: number;
  sizeMultiplier: number;
  isVisible: boolean;
}

// Button state invariants:
// - clickCount >= 0
// - sizeMultiplier > 0
// - If clickCount >= 10, isVisible must be false for No button
```

### 4.5 Persistence Model

Application state that persists between sessions:

```typescript
interface PersistedState {
  pomodoroDuration: number; // User's preferred Pomodoro duration
  lastUsedFoodPreset: string | null;
  externalLinks: ExternalLink[]; // User-configured links
  valentineAccepted: boolean; // Whether user has accepted the valentine prompt
}
```

**Storage mechanism**: SQLite database using better-sqlite3 in the main process.

**Database Schema**:
```sql
CREATE TABLE IF NOT EXISTS app_state (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Example rows:
-- ('pomodoro_duration', '1500', 1234567890)
-- ('last_food_preset', 'Soft Boiled Egg', 1234567890)
-- ('valentine_accepted', 'true', 1234567890)
```

**IPC Communication**:
- Renderer process requests state via IPC: `ipcRenderer.invoke('get-state', key)`
- Renderer process saves state via IPC: `ipcRenderer.invoke('set-state', key, value)`
- Main process handles all database operations
- State changes are atomic and synchronous in main process


## 5. Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### 5.1 Valentine Prompt Properties

**Property 1: Yes button always clickable**
*For any* valentine prompt state, the Yes button should be clickable and able to trigger the success animation.
**Validates: Requirements 4.1.3**

**Property 2: No button clickability tied to visibility**
*For any* valentine prompt state, if the No button is visible, then it should be clickable.
**Validates: Requirements 4.1.4**

**Property 3: Dashboard access blocked until acceptance**
*For any* application state where the valentine prompt has not been accepted, the dashboard phase should not be accessible.
**Validates: Requirements 4.1.5**

**Property 4: Button size changes on No button click**
*For any* valentine prompt state where the No button is visible and clickable, clicking the No button should increase the Yes button size and decrease the No button size.
**Validates: Requirements 4.2.1, 4.2.2**

**Property 5: Click count increments correctly**
*For any* valentine prompt state, the No button click count should start at zero and increment by exactly one for each No button click.
**Validates: Requirements 4.2.5**

**Property 6: Yes button click triggers animation**
*For any* valentine prompt state, clicking the Yes button should transition the state to show the success animation.
**Validates: Requirements 4.3.1**

**Property 7: Animation completion transitions to dashboard**
*For any* application state where the success animation is complete, the application should transition to the dashboard phase.
**Validates: Requirements 4.3.2**

**Property 8: Animation blocks interaction**
*For any* application state where the success animation is playing, user interactions with buttons should be blocked.
**Validates: Requirements 4.3.4**

### 5.2 Timer Properties

**Property 9: Timer countdown behavior**
*For any* timer (Pomodoro or Food) with a configured duration, starting the timer should cause the remaining time to count down by one second for each elapsed second until reaching zero.
**Validates: Requirements 4.4.2, 4.5.2**

**Property 10: Timer controls work in all states**
*For any* timer state, the start, pause (Pomodoro only), and reset operations should correctly transition the timer to the expected state.
**Validates: Requirements 4.4.4**

**Property 11: Running timer displays remaining time**
*For any* timer state where the timer is running, the displayed remaining time should match the actual remaining time in the timer state.
**Validates: Requirements 4.4.5, 4.5.5**

**Property 12: Custom duration acceptance**
*For any* valid duration value (positive integer seconds), the food timer should accept and use that duration when set.
**Validates: Requirements 4.5.4**

**Property 13: Preset selection sets duration**
*For any* food preset, selecting that preset should set the timer duration to the preset's configured duration value.
**Validates: Requirements 4.5.7**

**Property 14: Timer state invariants**
*For any* timer state, the following invariants should hold:
- remainingTime >= 0
- remainingTime <= duration
- If isRunning is true, then startTime is not null
- If remainingTime is 0, then isRunning is false
**Validates: Requirements 4.4.2, 4.5.2**

### 5.3 Wellness Reminder Properties

**Property 15: Reminders scheduled during working hours**
*For any* time within working hours (10:30 AM - 6:30 PM), the wellness reminder system should have a scheduled next reminder time.
**Validates: Requirements 4.6.1**

**Property 16: Reminder type is valid**
*For any* triggered wellness reminder, the reminder type should be either 'water' or 'breathing'.
**Validates: Requirements 4.6.2**

**Property 17: No reminders outside working hours**
*For any* time outside working hours (before 10:30 AM or after 6:30 PM), the wellness reminder system should not have any scheduled reminders.
**Validates: Requirements 4.6.3**

**Property 18: Reminder dismissal removes display**
*For any* displayed wellness reminder, dismissing it should remove the reminder from display and clear the current message.
**Validates: Requirements 4.6.5**

### 5.4 External Link Properties

**Property 19: External links open in browser**
*For any* external link (vision board or shared calendar), clicking the link should open the URL in the default system browser, not within the Electron window.
**Validates: Requirements 4.7.3, 4.7.4**

## 6. Error Handling

### 6.1 Timer Error Handling

**Invalid Duration Input**:
- Validate that duration values are positive integers
- Reject negative values, zero, or non-numeric input
- Display user-friendly error message
- Maintain previous valid duration

**Timer Completion Notification Failure**:
- If system notification fails, display in-app notification as fallback
- Log notification errors for debugging
- Ensure timer state transitions correctly regardless of notification success

### 6.2 Wellness Reminder Error Handling

**Time Calculation Errors**:
- Validate working hours configuration on startup
- Handle edge cases around daylight saving time transitions
- Default to safe behavior (no reminders) if time calculation fails

**Notification Permission Denied**:
- Check notification permissions on startup
- Display in-app reminders if system notifications are unavailable
- Provide user guidance for enabling notifications

### 6.3 External Link Error Handling

**Invalid URL**:
- Validate URL format before attempting to open
- Display error message if URL is malformed
- Prevent navigation within Electron window

**Browser Launch Failure**:
- Catch errors from shell.openExternal()
- Display error message to user
- Log error details for debugging
- Provide fallback option to copy URL to clipboard

### 6.4 State Persistence Error Handling

**Database Unavailable**:
- Detect SQLite database availability on startup
- Create database file if it doesn't exist
- Fall back to in-memory state if database creation fails
- Warn user that preferences won't persist

**Corrupted Database**:
- Validate database schema on startup
- Attempt to repair corrupted database
- If repair fails, backup corrupted database and create new one
- Use default values if persisted state is invalid
- Log corruption for debugging

**IPC Communication Errors**:
- Handle IPC timeout errors gracefully
- Retry failed state operations once
- Fall back to in-memory state if IPC fails
- Log IPC errors for debugging

### 6.5 Animation Error Handling

**Animation Failure**:
- Set timeout to force transition to dashboard if animation doesn't complete
- Maximum animation duration: 5 seconds
- Log animation errors
- Ensure user is never stuck on animation screen

## 7. Testing Strategy

### 7.1 Testing Approach

The Valentine Dashboard will use a dual testing approach combining unit tests and property-based tests:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property-based tests**: Verify universal properties across all inputs

Both testing approaches are complementary and necessary for comprehensive coverage. Unit tests catch concrete bugs in specific scenarios, while property-based tests verify general correctness across a wide range of inputs.

### 7.2 Property-Based Testing

**Testing Library**: fast-check (JavaScript/TypeScript property-based testing library)

**Configuration**:
- Minimum 100 iterations per property test (due to randomization)
- Each property test must reference its design document property
- Tag format: `// Feature: valentine-dashboard, Property {number}: {property_text}`

**Property Test Implementation**:
- Each correctness property listed in Section 5 must be implemented as a single property-based test
- Use fast-check's arbitrary generators to create random test inputs
- Verify that properties hold across all generated inputs

**Example Property Test Structure**:
```typescript
// Feature: valentine-dashboard, Property 5: Click count increments correctly
test('No button click count increments correctly', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 0, max: 9 }), // Initial click count
      (initialCount) => {
        const state = createValentinePromptState({ noButtonClickCount: initialCount });
        const newState = handleNoButtonClick(state);
        return newState.noButtonClickCount === initialCount + 1;
      }
    ),
    { numRuns: 100 }
  );
});
```

### 7.3 Unit Testing

**Testing Library**: Vitest with React Testing Library

**Unit Test Focus Areas**:
- Specific examples demonstrating correct behavior
- Edge cases (e.g., timer at zero, 10th No button click)
- Error conditions and error handling paths
- Integration points between components
- UI rendering and user interaction flows

**Unit Test Balance**:
- Avoid writing too many unit tests for scenarios covered by property tests
- Focus unit tests on concrete examples and edge cases
- Use property tests for comprehensive input coverage

### 7.4 Test Coverage Goals

**Component Coverage**:
- ValentinePrompt: 100% of state transitions
- Timers (Pomodoro and Food): 100% of timer logic
- WellnessReminder: 100% of scheduling logic
- ExternalLinks: 100% of link opening logic

**Property Coverage**:
- All 19 correctness properties must have corresponding property-based tests
- Each property test must run minimum 100 iterations

**Edge Case Coverage**:
- No button at 10 clicks (disappearance threshold)
- Timer at zero (completion boundary)
- Working hours boundaries (10:30 AM and 6:30 PM)
- Empty/invalid input handling

### 7.5 Integration Testing

**Electron Integration**:
- Test main process and renderer process communication
- Test native notification delivery
- Test external URL opening via shell.openExternal()
- Test window lifecycle management

**End-to-End Flows**:
- Complete valentine prompt flow (No clicks → Yes click → Dashboard)
- Complete timer flow (Start → Countdown → Notification)
- Complete reminder flow (Schedule → Display → Dismiss)

### 7.6 Manual Testing

**macOS-Specific Testing**:
- Application installation and launch
- Native notification appearance and behavior
- Window management (minimize, maximize, close)
- Menu bar integration
- System preferences integration

**Visual Testing**:
- Valentine's Day theme consistency
- Button size animations
- Success animation appearance
- Timer display formatting
- Responsive layout behavior

## 8. UI/UX Design Considerations

### 8.1 Visual Design

**Design Aesthetic**: Very cutesy and playful with Valentine's Day charm

**Color Palette**:
- Primary: Soft pink (#FFB6C1) and rose (#FF69B4)
- Secondary: Light red (#FF6B6B) and coral (#FF7F7F)
- Accent: White (#FFFFFF) and cream (#FFF8F0)
- Pastels: Lavender (#E6E6FA), mint (#98FF98), peach (#FFDAB9)
- Text: Dark gray (#333333) for readability

**Typography**:
- Headings: Very playful, rounded sans-serif fonts (e.g., Quicksand, Fredoka, Comic Neue)
- Body: Friendly, approachable sans-serif (e.g., Nunito, Poppins)
- Timer display: Rounded monospace font (e.g., JetBrains Mono with rounded variant)
- Emphasis on soft, rounded letterforms throughout

**Visual Elements**:
- Rounded corners on all UI elements (border-radius: 16px+)
- Soft shadows for depth (subtle, pastel-colored shadows)
- Heart icons, sparkles, and Valentine-themed decorations
- Cute emoji integration (💕, 💖, ✨, 🎀, 🌸)
- Gradient backgrounds with soft color transitions
- Playful illustrations or doodles as accents

**Spacing**:
- Consistent 8px grid system
- Generous padding around interactive elements (minimum 20px for extra softness)
- Clear visual separation between dashboard sections with decorative dividers
- Breathing room to maintain the light, airy, cute aesthetic

### 8.2 Animation and Transitions

**Button Size Animation**:
- Smooth CSS transitions (300ms ease-in-out with bounce easing)
- Scale transform for size changes with playful overshoot
- Maintain button center position during scaling
- Add subtle rotation or wiggle on hover for extra cuteness

**Success Animation**:
- "Yipe" text with bouncy, exaggerated animation
- Heart confetti or sparkle particle effects
- Celebratory colors and motion
- Fade transition to dashboard (500ms) with gentle ease
- Consider adding a cute sound effect

**Timer Updates**:
- Smooth countdown without jarring updates
- Soft color pulse when timer is running
- Celebratory bounce animation when timer completes
- Cute notification with hearts or sparkles

**General Animation Principles**:
- Use spring-based animations for organic, bouncy feel
- Add micro-interactions (hover effects, button presses)
- Subtle floating or bobbing animations for decorative elements
- Smooth, delightful transitions between all states

### 8.3 Accessibility

**Keyboard Navigation**:
- Tab order follows logical flow
- Enter key activates buttons
- Escape key dismisses reminders
- Space bar for timer start/pause

**Screen Reader Support**:
- ARIA labels for all interactive elements
- Live regions for timer updates
- Descriptive button labels
- Status announcements for state changes

**Visual Accessibility**:
- Sufficient color contrast (WCAG AA minimum)
- Focus indicators on all interactive elements
- Text size minimum 14px
- No reliance on color alone for information

### 8.4 Responsive Behavior

**Window Sizing**:
- Minimum window size: 800x600px
- Maximum window size: 1200x800px
- Fixed aspect ratio to maintain design integrity
- Prevent window resizing below minimum

**Content Scaling**:
- Flexible layout using CSS Grid and Flexbox
- Proportional scaling of button sizes
- Responsive timer display
- Adaptive spacing based on available space

### 8.5 User Feedback

**Interactive Feedback**:
- Hover states with gentle lift and glow effects
- Active states with satisfying "squish" animation
- Disabled states with soft, desaturated colors
- Loading states with cute spinner or bouncing hearts

**Status Communication**:
- Clear timer state indicators with cute icons (▶️ running, ⏸️ paused, ⏹️ stopped)
- Visual confirmation of reminder dismissal with sparkle effect
- Success feedback for link opening with heart animation
- Error messages with friendly, encouraging language and cute sad emoji

**Cutesy Details**:
- Cursor changes to heart or sparkle on interactive elements
- Subtle particle effects on interactions
- Playful empty states with encouraging messages
- Delightful micro-copy throughout the interface

## 9. Implementation Notes

### 9.1 State Management

Use React's useReducer hook with Context API for predictable state management:

```typescript
// Centralized state reducer
function appReducer(state: ApplicationState, action: AppAction): ApplicationState {
  switch (action.type) {
    case 'NO_BUTTON_CLICKED':
      return handleNoButtonClick(state);
    case 'YES_BUTTON_CLICKED':
      return handleYesButtonClick(state);
    case 'TIMER_TICK':
      return handleTimerTick(state, action.payload);
    // ... other actions
  }
}

// Pure functions for state transitions (easily testable)
function handleNoButtonClick(state: ApplicationState): ApplicationState {
  const { valentinePrompt } = state;
  return {
    ...state,
    valentinePrompt: {
      ...valentinePrompt,
      noButtonClickCount: valentinePrompt.noButtonClickCount + 1,
      yesButtonSize: valentinePrompt.yesButtonSize * 1.1,
      noButtonSize: valentinePrompt.noButtonSize * 0.9,
      noButtonVisible: valentinePrompt.noButtonClickCount + 1 < 10
    }
  };
}
```

### 9.2 Timer Implementation

Use setInterval for timer countdown with cleanup:

```typescript
useEffect(() => {
  if (!isRunning) return;
  
  const intervalId = setInterval(() => {
    dispatch({ type: 'TIMER_TICK' });
  }, 1000);
  
  return () => clearInterval(intervalId);
}, [isRunning]);
```

### 9.3 Wellness Reminder Scheduling

Use setTimeout with recursive scheduling:

```typescript
function scheduleNextReminder() {
  if (!isWithinWorkingHours(new Date())) {
    return;
  }
  
  const randomInterval = getRandomInterval(15 * 60 * 1000, 45 * 60 * 1000);
  const timeoutId = setTimeout(() => {
    showReminder();
    scheduleNextReminder(); // Recursive scheduling
  }, randomInterval);
  
  return timeoutId;
}
```

### 9.4 Electron Main Process

```typescript
// main.ts
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database;

function initDatabase() {
  const userDataPath = app.getPath('userData');
  const dbPath = path.join(userDataPath, 'valentine-dashboard.db');
  
  db = new Database(dbPath);
  
  // Create table if not exists
  db.exec(`
    CREATE TABLE IF NOT EXISTS app_state (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `);
}

// IPC handlers for state persistence
ipcMain.handle('get-state', (event, key: string) => {
  const row = db.prepare('SELECT value FROM app_state WHERE key = ?').get(key);
  return row ? JSON.parse(row.value) : null;
});

ipcMain.handle('set-state', (event, key: string, value: any) => {
  const stmt = db.prepare(`
    INSERT INTO app_state (key, value, updated_at) 
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = ?
  `);
  const now = Date.now();
  const jsonValue = JSON.stringify(value);
  stmt.run(key, jsonValue, now, jsonValue, now);
  return true;
});

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  
  // Prevent navigation
  mainWindow.webContents.on('will-navigate', (event) => {
    event.preventDefault();
  });
  
  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  initDatabase();
  createWindow();
});

app.on('before-quit', () => {
  if (db) {
    db.close();
  }
});
```

### 9.5 Preload Script

```typescript
// preload.ts
import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getState: (key: string) => ipcRenderer.invoke('get-state', key),
  setState: (key: string, value: any) => ipcRenderer.invoke('set-state', key, value),
  openExternal: (url: string) => ipcRenderer.invoke('open-external', url)
});

// Type definitions for renderer process
declare global {
  interface Window {
    electronAPI: {
      getState: (key: string) => Promise<any>;
      setState: (key: string, value: any) => Promise<boolean>;
      openExternal: (url: string) => Promise<void>;
    };
  }
}
```

### 9.6 Build and Packaging

**electron-builder configuration**:
```json
{
  "appId": "com.valentine.dashboard",
  "productName": "Valentine Dashboard",
  "mac": {
    "category": "public.app-category.productivity",
    "icon": "build/icon.icns",
    "target": ["dmg", "zip"]
  }
}
```

## 10. Future Enhancements

### 10.1 Potential Features

- Customizable working hours for wellness reminders
- Multiple timer presets for Pomodoro (short break, long break)
- Timer history and statistics
- Custom wellness reminder messages
- Dark mode support
- Multiple language support
- Cloud sync for preferences

### 10.2 Technical Improvements

- Migrate to Electron Forge for better build tooling
- Add automatic updates using electron-updater
- Implement analytics for usage patterns
- Add crash reporting
- Optimize bundle size
- Add performance monitoring

