# Implementation Plan: Valentine Dashboard

## Overview

This implementation plan breaks down the Valentine Dashboard into discrete, actionable tasks. The application is a macOS Electron app built with React 19, TypeScript, and Tailwind CSS. The implementation follows a layered architecture with clear separation between presentation (React UI), business logic (timers and reminders), and platform integration (Electron main process).

The implementation strategy:
1. Set up the project structure and core infrastructure
2. Implement the Valentine Prompt screen with dynamic button behavior
3. Build the timer components (Pomodoro and Food timers)
4. Add wellness reminder scheduling system
5. Integrate external links and state persistence
6. Polish UI/UX with animations and styling
7. Package for macOS distribution

## Tasks

- [ ] 1. Set up project structure and development environment
  - Initialize Electron + Vite + React + TypeScript project
  - Configure Tailwind CSS with Valentine's Day color palette
  - Set up Vitest and fast-check for testing
  - Configure electron-builder for macOS packaging
  - Create basic Electron main process and renderer process structure
  - Set up preload script with IPC bridge
  - _Requirements: 5.1.1, 5.1.2_

- [ ] 2. Implement application state management
  - [ ] 2.1 Create TypeScript interfaces for all state models
    - Define ApplicationState, ValentinePromptState, DashboardState types
    - Define TimerState, ReminderSchedule, ButtonState types
    - Define action types for state transitions
    - _Requirements: 4.1.1, 4.1.2, 4.4.1, 4.5.1, 4.6.1_
  
  - [ ] 2.2 Implement root state reducer with Context API
    - Create appReducer function with all action handlers
    - Set up React Context for global state
    - Implement pure state transition functions
    - _Requirements: 4.1.1, 4.2.5_
  
  - [ ]* 2.3 Write property test for state transitions
    - **Property 5: Click count increments correctly**
    - **Validates: Requirements 4.2.5**

- [ ] 3. Implement Valentine Prompt screen
  - [ ] 3.1 Create ValentinePrompt component with button rendering
    - Render "Will you be my Valentine?" text
    - Render Yes and No buttons with dynamic sizing
    - Implement button click handlers
    - _Requirements: 4.1.1, 4.1.2, 4.1.3, 4.1.4_
  
  - [ ] 3.2 Implement dynamic button behavior logic
    - Implement No button click handler (size changes, click counting)
    - Implement button visibility logic (hide after 10 clicks)
    - Implement Yes button size increase on No clicks
    - _Requirements: 4.2.1, 4.2.2, 4.2.3, 4.2.4, 4.2.5_
  
  - [ ]* 3.3 Write property tests for button behavior
    - **Property 1: Yes button always clickable**
    - **Property 2: No button clickability tied to visibility**
    - **Property 4: Button size changes on No button click**
    - **Validates: Requirements 4.1.3, 4.1.4, 4.2.1, 4.2.2**
  
  - [ ] 3.4 Implement success animation
    - Create "yipe" animation component with celebratory styling
    - Implement animation trigger on Yes button click
    - Block user interaction during animation
    - Auto-transition to dashboard after animation completes
    - _Requirements: 4.3.1, 4.3.2, 4.3.3, 4.3.4_
  
  - [ ]* 3.5 Write property tests for animation and transitions
    - **Property 6: Yes button click triggers animation**
    - **Property 7: Animation completion transitions to dashboard**
    - **Property 8: Animation blocks interaction**
    - **Validates: Requirements 4.3.1, 4.3.2, 4.3.4**
  
  - [ ]* 3.6 Write unit tests for edge cases
    - Test No button at exactly 10 clicks (disappearance threshold)
    - Test button size calculations at boundaries
    - Test animation timeout fallback (5 second max)
    - _Requirements: 4.2.3, 4.3.4_

- [ ] 4. Checkpoint - Ensure Valentine Prompt works correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Implement Dashboard layout and navigation
  - [ ] 5.1 Create Dashboard component structure
    - Create main dashboard layout with sections for timers, reminders, and links
    - Implement phase-based routing (valentine-prompt vs dashboard)
    - Ensure dashboard is only accessible after valentine acceptance
    - _Requirements: 4.1.5_
  
  - [ ]* 5.2 Write property test for dashboard access control
    - **Property 3: Dashboard access blocked until acceptance**
    - **Validates: Requirements 4.1.5**

- [ ] 6. Implement Pomodoro Timer
  - [ ] 6.1 Create PomodoroTimer component with UI
    - Render timer display showing remaining time
    - Create start, pause, and reset buttons
    - Implement duration configuration input
    - _Requirements: 4.4.1, 4.4.5_
  
  - [ ] 6.2 Implement Pomodoro timer logic
    - Implement timer countdown using setInterval
    - Handle start, pause, reset actions
    - Trigger notification when timer reaches zero
    - Implement timer state invariants validation
    - _Requirements: 4.4.2, 4.4.3, 4.4.4_
  
  - [ ]* 6.3 Write property tests for Pomodoro timer
    - **Property 9: Timer countdown behavior**
    - **Property 10: Timer controls work in all states**
    - **Property 11: Running timer displays remaining time**
    - **Property 14: Timer state invariants**
    - **Validates: Requirements 4.4.2, 4.4.4, 4.4.5**
  
  - [ ]* 6.4 Write unit tests for Pomodoro timer edge cases
    - Test timer at zero (completion boundary)
    - Test pause and resume functionality
    - Test notification fallback when system notifications fail
    - _Requirements: 4.4.3, 4.4.4_

- [ ] 7. Implement Food Timer
  - [ ] 7.1 Create FoodTimer component with presets
    - Render timer display showing remaining time
    - Create preset buttons for common foods (eggs, ramen)
    - Create custom duration input
    - Create start, pause, and reset buttons
    - _Requirements: 4.5.1, 4.5.5, 4.5.6_
  
  - [ ] 7.2 Implement Food timer logic with preset handling
    - Implement timer countdown using setInterval
    - Handle preset selection (set duration automatically)
    - Handle custom duration input
    - Trigger notification when timer reaches zero
    - _Requirements: 4.5.2, 4.5.3, 4.5.4, 4.5.7_
  
  - [ ]* 7.3 Write property tests for Food timer
    - **Property 9: Timer countdown behavior**
    - **Property 12: Custom duration acceptance**
    - **Property 13: Preset selection sets duration**
    - **Property 14: Timer state invariants**
    - **Validates: Requirements 4.5.2, 4.5.4, 4.5.7**
  
  - [ ]* 7.4 Write unit tests for Food timer edge cases
    - Test all preset durations (soft/medium/hard boiled eggs, ramen)
    - Test custom duration validation (reject negative/zero values)
    - Test timer at zero (completion boundary)
    - _Requirements: 4.5.6, 4.5.7_

- [ ] 8. Checkpoint - Ensure all timers work correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Implement Wellness Reminder system
  - [ ] 9.1 Create WellnessReminder component
    - Render dismissible reminder notification
    - Display reminder message with appropriate emoji
    - Implement dismiss button
    - _Requirements: 4.6.2, 4.6.5_
  
  - [ ] 9.2 Implement reminder scheduling logic
    - Implement working hours detection (10:30 AM - 6:30 PM)
    - Implement random interval scheduling (15-45 minutes)
    - Implement reminder type randomization (water vs breathing)
    - Schedule next reminder recursively
    - Clear reminders outside working hours
    - _Requirements: 4.6.1, 4.6.3, 4.6.4_
  
  - [ ]* 9.3 Write property tests for wellness reminders
    - **Property 15: Reminders scheduled during working hours**
    - **Property 16: Reminder type is valid**
    - **Property 17: No reminders outside working hours**
    - **Property 18: Reminder dismissal removes display**
    - **Validates: Requirements 4.6.1, 4.6.2, 4.6.3, 4.6.5**
  
  - [ ]* 9.4 Write unit tests for reminder edge cases
    - Test working hours boundaries (exactly 10:30 AM and 6:30 PM)
    - Test daylight saving time transitions
    - Test notification permission denied fallback
    - _Requirements: 4.6.1, 4.6.3_

- [ ] 10. Implement External Links component
  - [ ] 10.1 Create ExternalLinks component
    - Render vision board link with icon
    - Render shared calendar link with icon
    - Implement click handlers for external links
    - _Requirements: 4.7.1, 4.7.2_
  
  - [ ] 10.2 Implement external link opening via Electron
    - Use shell.openExternal() to open URLs in default browser
    - Validate URLs before opening
    - Prevent navigation within Electron window
    - Handle browser launch failures with error messages
    - _Requirements: 4.7.3, 4.7.4_
  
  - [ ]* 10.3 Write property test for external links
    - **Property 19: External links open in browser**
    - **Validates: Requirements 4.7.3, 4.7.4**
  
  - [ ]* 10.4 Write unit tests for link error handling
    - Test invalid URL format handling
    - Test browser launch failure fallback
    - Test URL validation logic
    - _Requirements: 4.7.3, 4.7.4_

- [ ] 11. Implement state persistence with SQLite
  - [ ] 11.1 Set up better-sqlite3 in main process
    - Initialize SQLite database in user data directory
    - Create app_state table with schema
    - Implement database initialization on app startup
    - Handle database creation errors gracefully
    - _Requirements: 5.1.3, 5.1.4_
  
  - [ ] 11.2 Implement IPC handlers for state persistence
    - Create get-state IPC handler
    - Create set-state IPC handler
    - Implement atomic state operations
    - Handle IPC communication errors with retries
    - _Requirements: 5.1.3, 5.1.4_
  
  - [ ] 11.3 Integrate state persistence in renderer process
    - Load persisted state on app startup (pomodoro duration, valentine acceptance)
    - Save state changes via IPC (pomodoro duration, last food preset)
    - Handle database unavailable fallback (in-memory state)
    - _Requirements: 5.1.3, 5.1.4_
  
  - [ ]* 11.4 Write unit tests for state persistence
    - Test database initialization and schema creation
    - Test state save and load operations
    - Test corrupted database recovery
    - Test IPC timeout handling
    - _Requirements: 5.1.3, 5.1.4_

- [ ] 12. Checkpoint - Ensure core functionality is complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Implement UI styling and animations
  - [ ] 13.1 Apply Valentine's Day theme styling
    - Configure Tailwind with custom color palette (pinks, roses, pastels)
    - Apply rounded corners and soft shadows to all components
    - Add heart icons and Valentine-themed decorations
    - Implement consistent spacing using 8px grid
    - _Requirements: 5.2.1, 5.2.2, 5.2.3, 5.2.5_
  
  - [ ] 13.2 Implement button animations
    - Add smooth size transitions for button scaling (300ms ease-in-out)
    - Add hover effects with lift and glow
    - Add active states with squish animation
    - Maintain button center position during scaling
    - _Requirements: 5.2.4_
  
  - [ ] 13.3 Implement timer animations
    - Add color pulse animation for running timers
    - Add celebratory bounce animation on timer completion
    - Add smooth countdown updates
    - _Requirements: 5.2.4_
  
  - [ ] 13.4 Implement success animation effects
    - Create "yipe" text with bouncy animation
    - Add heart confetti or sparkle particle effects
    - Add fade transition to dashboard (500ms)
    - _Requirements: 4.3.3_

- [ ] 14. Implement accessibility features
  - [ ] 14.1 Add keyboard navigation support
    - Implement tab order for all interactive elements
    - Add Enter key activation for buttons
    - Add Escape key for dismissing reminders
    - Add Space bar for timer start/pause
    - _Requirements: 5.2.4_
  
  - [ ] 14.2 Add screen reader support
    - Add ARIA labels for all interactive elements
    - Add live regions for timer updates
    - Add descriptive button labels
    - Add status announcements for state changes
    - _Requirements: 5.2.4_
  
  - [ ] 14.3 Ensure visual accessibility
    - Verify color contrast meets WCAG AA standards
    - Add focus indicators on all interactive elements
    - Ensure minimum text size of 14px
    - _Requirements: 5.2.3_

- [ ] 15. Implement error handling
  - [ ] 15.1 Add timer error handling
    - Validate duration inputs (reject negative/zero/non-numeric)
    - Implement notification fallback for system notification failures
    - Display user-friendly error messages
    - _Requirements: 4.4.2, 4.5.4_
  
  - [ ] 15.2 Add reminder error handling
    - Validate working hours configuration on startup
    - Handle time calculation errors gracefully
    - Implement in-app reminder fallback for denied permissions
    - _Requirements: 4.6.1_
  
  - [ ] 15.3 Add external link error handling
    - Validate URL format before opening
    - Catch and display shell.openExternal() errors
    - Provide clipboard copy fallback for failed launches
    - _Requirements: 4.7.3, 4.7.4_
  
  - [ ] 15.4 Add state persistence error handling
    - Detect and handle database unavailability
    - Implement database corruption recovery
    - Fall back to in-memory state if persistence fails
    - Log all errors for debugging
    - _Requirements: 5.1.3, 5.1.4_

- [ ] 16. Configure Electron main process
  - [ ] 16.1 Implement window management
    - Create main window with proper dimensions (1000x700)
    - Set minimum window size (800x600)
    - Prevent navigation within Electron window
    - Handle window lifecycle events
    - _Requirements: 5.1.4, 5.1.5_
  
  - [ ] 16.2 Implement native integrations
    - Set up system notification delivery
    - Configure external URL opening via shell.openExternal()
    - Set up IPC communication between main and renderer
    - Handle app quit and cleanup (close database)
    - _Requirements: 4.4.3, 4.5.3, 4.7.3, 4.7.4_

- [ ] 17. Package application for macOS
  - [ ] 17.1 Configure electron-builder
    - Set up electron-builder configuration for macOS
    - Configure app metadata (name, ID, category)
    - Create application icon (icon.icns)
    - Configure DMG and ZIP targets
    - _Requirements: 5.1.1, 5.1.2, 5.1.3_
  
  - [ ] 17.2 Build and test macOS application
    - Build production application bundle
    - Test installation in Applications folder
    - Test application launch and window management
    - Verify native notifications work correctly
    - _Requirements: 5.1.3, 5.1.4, 5.1.5_

- [ ] 18. Final checkpoint - Complete testing and validation
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 19. Integration testing
  - [ ]* 19.1 Write integration tests for complete flows
    - Test complete valentine prompt flow (No clicks → Yes click → Dashboard)
    - Test complete timer flow (Start → Countdown → Notification)
    - Test complete reminder flow (Schedule → Display → Dismiss)
    - Test Electron IPC communication
    - _Requirements: 4.1.1, 4.3.2, 4.4.2, 4.5.2, 4.6.1_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties (minimum 100 iterations each)
- Unit tests validate specific examples and edge cases
- The implementation uses TypeScript throughout for type safety
- All state transitions are implemented as pure functions for testability
- The application follows a unidirectional data flow pattern using React's useReducer
