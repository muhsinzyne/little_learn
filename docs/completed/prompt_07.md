# Phase 7: Global Sound & Audio Control — Walkthrough

I have implemented a comprehensive Global Sound Toggle system for LittleLearn. This update gives parents total control over the platform's audio output, ensuring that learning can happen quietly when necessary.

## Completed Features

### 1. Global Master Sound Switch
- **Settings Page**: Added a new "Master Sound Switch" in the Voice & Speech section.
- **State Persistence**: The setting is saved to the `TtsSettings` table in the database and persists across sessions.
- **Conditional UI**: When the Master Sound Switch is turned OFF, all other TTS settings (Autoplay, Repeat Count, Speed, and Accents) are automatically greyed out and disabled to prevent confusion.

### 2. Quick-Access Toggles
- **Lesson Learn Screen**: Added a volume/mute icon in the top navigation bar. Parents can instantly toggle the app's sound without leaving the current lesson.
- **Stage Test Screen**: Added the same quick-access toggle to the test header, allowing for quiet testing sessions.
- **Instant Sync**: Tapping the quick-access icon performs an optimistic UI update and saves the preference to the database immediately.

### 3. Integrated Muting Logic
- **`useTts` Hook**: The core speech engine now checks the `soundEnabled` state before any audio is generated. If sound is disabled, speech synthesis is blocked.
- **`SpeakerButton` Component**:
    - Visually updates to a muted state (🔇) when sound is disabled.
    - Becomes non-interactive and greyed out.
    - Suppresses the "pulse" animation.
- **Autoplay Suppression**: Lessons will not automatically read aloud on load if the master sound switch is OFF.

### 4. Test Mode Audio Support
- **Question Audio**: Added a `SpeakerButton` to quiz questions.
- **Functional Integrity**: These buttons also respect the global sound toggle, appearing muted and disabled if the master switch is OFF.

## Technical Summary

### Database Changes
- **Prisma Schema**: Added `soundEnabled Boolean @default(true)` to the `TtsSettings` model.
- **Migration**: Applied `add_sound_toggle` migration to the MySQL database.

### New Logic
- **`PUT /api/tts-settings`**: Updated to support the `soundEnabled` field.
- **Optimistic Updates**: Implemented in learn and test pages for a snappy user experience.

### Verification
- **Linting**: Resolved all unused variable and React entity errors in modified files.
- **Manual Check**: Verified state persistence across Dashboard, Stage, and Lesson views.
