# Prompt 09: Keyboard Navigation & Stage Completion

## Task Definition
Add keyboard navigation to the Learn Mode lesson screen and implement a stage completion view.

## Requirements
- [x] Global keydown event listener (mounted/unmounted).
- [x] Key bindings:
    - Space/ArrowRight → Next lesson.
    - ArrowLeft → Previous lesson.
    - Enter → Mark as Learned + Auto-advance after 600ms.
    - Escape → Trigger Exit confirmation.
- [x] Visual highlights on UI elements during keypresses.
- [x] Stage completion view when the last lesson is finished.
- [x] Auto-hiding keyboard hint bar at the bottom.

## Implementation Details

### 1. `FullscreenWrapper.tsx`
- Added a custom event listener for `request-exit-confirm` to trigger the exit confirmation modal from any component.

### 2. `LessonLearnPage.tsx`
- **Navigation Logic**: Implemented `handleNext` and `handlePrev` callbacks.
- **Keyboard Listener**: Added a `useEffect` that listens for `Space`, `Enter`, `ArrowRight`, `ArrowLeft`, and `Escape`.
- **Visual Hints**: Used `activeKeyHint` state to apply temporary `ring` and `scale` classes to navigation buttons.
- **Hint Bar**: Added a fixed-bottom hint bar with an inactivity timer that hides it after 5 seconds of no keyboard input.
- **Stage Completion**: Created a celebratory inline view that appears when `nextId` is null, offering "Take the Test" and "Back to Map" options.

## Verification Results
- Keyboard shortcuts functional across all lesson types.
- Visual feedback provides clear confirmation of keypresses.
- Stage completion logic correctly handles the end of the lesson sequence.
- Hint bar behaves as expected with auto-hide/show logic.
