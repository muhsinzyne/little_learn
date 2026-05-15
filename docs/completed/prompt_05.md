# Test Mode — Walkthrough

I have successfully built the **Test Mode** quiz engine for LittleLearn. This feature allows children to test their knowledge of a stage through a randomized, interactive quiz, earning stars and milestones.

## Key Features

### 1. Randomized Quiz Engine
- **Server-Side Generation**: The quiz is generated on the server (`/api/stages/[stageId]/quiz`), which selects 10 random lessons and creates multiple-choice options with randomized wrong answers from the same stage.
- **Smart Formatting**: Options are intelligently formatted based on lesson type (e.g., numbers are shown as words, while letters remain as letters).
- **Auto-Advance**: After selecting an answer, the UI provides immediate visual feedback (Green for Correct, Red for Wrong) and automatically moves to the next question after 1.5 seconds.

### 2. Interactive Quiz UI
- **Question Prompts**: Developed a `QuestionPrompt` component that shows compact visual cues (SVGs for shapes, color swatches, large letters/numbers).
- **Progress Tracking**: A dynamic progress bar at the top shows the child's progress through the 10 questions, with color-coded step indicators for correct and incorrect answers.
- **Child-Friendly Controls**: Large, rounded 2x2 grid buttons make it easy for children to tap their answers.

### 3. Results & Milestones
- **Star Animation**: The results screen features cascading star animations representing the score (X / 10).
- **Encouragement**: Dynamic messaging based on performance (Superstar vs. Keep Practicing).
- **Milestone Celebration**: If a child completes all lessons in a stage and passes the test, a full-screen **"Stage Complete!"** celebration appears with a trophy animation and confetti effects.
- **Persistence**: Every test session is saved to the database, and milestones are tracked to prevent duplicates.

## Technical Details

### New Routes
- `/stage/[stageId]/test`: The canonical quiz engine page.
- `/lesson/[lessonId]/test`: A transparent redirect that resolves the lesson's stage and forwards the child to the test.

### Animations
- Added custom keyframe animations in `globals.css`:
  - `animate-star-drop`: For the results screen.
  - `animate-confetti`: For the milestone celebration.
  - `animate-answer-correct` / `animate-answer-wrong`: For immediate feedback.

### Utilities
- Extracted `numberToWords` into a shared utility in `src/lib/` to ensure consistency between displays and quiz options.

## Verification Results
- **Type Safety**: Passed `npx tsc --noEmit`.
- **Database Integrity**: Verified milestone check logic ensures milestones are only created once all lessons are completed.
- **Responsiveness**: UI scales gracefully for mobile and desktop views.
