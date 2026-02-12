# Requirements Document: Valentine Dashboard

## 1. Introduction

The Valentine Dashboard is a macOS Electron application that combines a playful Valentine's Day prompt with productivity and wellness tools. The application starts with an interactive "Will you be my Valentine?" screen that uses gamification to encourage a positive response, then transitions to a dashboard featuring time management tools (Pomodoro timer and food timer for cooking), wellness reminders, and quick access to personal planning resources.

## 2. Goals

- Create an engaging and playful Valentine's Day themed application experience
- Provide productivity tools (Pomodoro timer and food timer) to help users manage their time effectively
- Promote wellness through automated reminders during working hours
- Offer quick access to personal planning resources (vision board and shared calendar)
- Deliver a native macOS application experience using Electron

## 3. Glossary

- **Valentine_Prompt_Screen**: The initial screen displayed when the application starts, presenting the Valentine's Day question
- **Yes_Button**: The button that accepts the Valentine's Day question and proceeds to the dashboard
- **No_Button**: The button that attempts to decline the Valentine's Day question
- **Dashboard**: The main application screen containing productivity and wellness tools
- **Pomodoro_Timer**: A time management tool using the Pomodoro Technique (typically 25-minute work intervals)
- **Food_Timer**: A countdown timer designed for cooking various foods such as eggs and ramen
- **Wellness_Reminder**: Automated notifications encouraging healthy behaviors during work hours
- **Working_Hours**: The time period from 10:30 AM to 6:30 PM when wellness reminders are active
- **Click_Attempt**: A user action of clicking or attempting to click the No_Button
- **Success_Animation**: A celebratory "yipe" animation displayed when the user clicks Yes

## 4. Functional Requirements

### 4.1 Interactive Valentine Prompt

**User Story:** As a user, I want to see a playful Valentine's Day prompt when I start the app, so that I have a fun and engaging experience.

#### Acceptance Criteria

1. WHEN the application starts, THE Valentine_Prompt_Screen SHALL display the text "Will you be my Valentine?"
2. WHEN the Valentine_Prompt_Screen is displayed, THE System SHALL show both Yes_Button and No_Button
3. THE Yes_Button SHALL be clickable at all times
4. THE No_Button SHALL be clickable until it disappears
5. WHEN the Valentine_Prompt_Screen is displayed, THE System SHALL prevent access to the Dashboard until Yes_Button is clicked

### 4.2 Dynamic Button Behavior

**User Story:** As a user, I want the buttons to react playfully to my interaction attempts, so that the experience feels dynamic and fun.

#### Acceptance Criteria

1. WHEN a user attempts to click the No_Button, THE System SHALL increase the size of the Yes_Button
2. WHEN a user attempts to click the No_Button, THE System SHALL decrease the size of the No_Button
3. WHEN the No_Button has been clicked 10 times, THE System SHALL remove the No_Button from the display
4. WHEN the No_Button is removed, THE Yes_Button SHALL remain visible and clickable
5. THE System SHALL track the count of Click_Attempts on the No_Button starting from zero

### 4.3 Success Transition

**User Story:** As a user, I want to see a celebratory animation when I click "Yes", so that the acceptance feels rewarding.

#### Acceptance Criteria

1. WHEN the Yes_Button is clicked, THE System SHALL display the Success_Animation
2. WHEN the Success_Animation completes, THE System SHALL transition to the Dashboard
3. THE Success_Animation SHALL display a "yipe" visual effect
4. WHEN the Success_Animation is playing, THE System SHALL prevent user interaction with other UI elements

### 4.4 Pomodoro Timer

**User Story:** As a user, I want to use a Pomodoro timer, so that I can manage my work sessions effectively.

#### Acceptance Criteria

1. WHEN the Dashboard is displayed, THE System SHALL provide access to the Pomodoro_Timer
2. WHEN a user starts the Pomodoro_Timer, THE System SHALL count down from the configured duration
3. WHEN the Pomodoro_Timer reaches zero, THE System SHALL notify the user
4. THE Pomodoro_Timer SHALL allow the user to start, pause, and reset the timer
5. WHEN the Pomodoro_Timer is running, THE System SHALL display the remaining time

### 4.5 Food Timer

**User Story:** As a user, I want to use a food timer for cooking various foods like eggs and ramen, so that I can prepare meals to my preferred doneness.

#### Acceptance Criteria

1. WHEN the Dashboard is displayed, THE System SHALL provide access to the Food_Timer
2. WHEN a user starts the Food_Timer, THE System SHALL count down from the configured duration
3. WHEN the Food_Timer reaches zero, THE System SHALL notify the user
4. THE Food_Timer SHALL allow the user to set custom durations for different foods
5. WHEN the Food_Timer is running, THE System SHALL display the remaining time
6. THE Food_Timer SHALL provide preset durations for common foods including eggs and ramen
7. WHEN a user selects a food preset, THE System SHALL automatically set the appropriate timer duration

### 4.6 Wellness Reminders

**User Story:** As a user, I want to receive random wellness reminders during my working hours, so that I maintain healthy habits throughout the day.

#### Acceptance Criteria

1. WHILE the current time is within Working_Hours, THE System SHALL display Wellness_Reminders at random intervals
2. WHEN a Wellness_Reminder is triggered, THE System SHALL display either a water drinking reminder or a deep breathing reminder
3. WHILE the current time is outside Working_Hours, THE System SHALL NOT display Wellness_Reminders
4. THE System SHALL randomize the timing of Wellness_Reminders to avoid predictable patterns
5. WHEN a Wellness_Reminder is displayed, THE System SHALL allow the user to dismiss it

### 4.7 External Resource Links

**User Story:** As a user, I want quick access to my vision board and shared calendar, so that I can stay aligned with my goals and schedule.

#### Acceptance Criteria

1. WHEN the Dashboard is displayed, THE System SHALL provide a link to the vision board on Canva
2. WHEN the Dashboard is displayed, THE System SHALL provide a link to the shared calendar on Google Calendar
3. WHEN a user clicks the vision board link, THE System SHALL open the Canva URL in the default browser
4. WHEN a user clicks the shared calendar link, THE System SHALL open the Google Calendar URL in the default browser

## 5. Non-Functional Requirements

### 5.1 macOS Application

**User Story:** As a macOS user, I want the application to be installable and run natively on my Mac, so that I have a seamless desktop experience.

#### Acceptance Criteria

1. THE System SHALL be packaged as a macOS Electron application
2. THE System SHALL be installable on macOS systems
3. WHEN installed, THE System SHALL appear in the Applications folder
4. WHEN launched, THE System SHALL run as a native macOS application
5. THE System SHALL follow macOS application conventions for window management and system integration

### 5.2 User Interface Design

**User Story:** As a user, I want the application to have a clean and cute visual design, so that it's pleasant to use and matches the Valentine's Day theme.

#### Acceptance Criteria

1. THE System SHALL use a visual design that is clean and uncluttered
2. THE System SHALL incorporate Valentine's Day themed colors and elements
3. THE System SHALL use typography and spacing that enhances readability
4. THE System SHALL provide visual feedback for all interactive elements
5. THE System SHALL maintain consistent styling across all screens
