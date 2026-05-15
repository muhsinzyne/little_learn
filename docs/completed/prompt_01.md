# LittleLearn — Project Setup Walkthrough

The LittleLearn preschool learning platform has been successfully scaffolded with Next.js 14, Prisma, and NextAuth.

## Project Structure
- **Framework**: Next.js 14 (App Router, TypeScript, Tailwind CSS)
- **Database**: Prisma ORM (MySQL ready)
- **Authentication**: NextAuth.js (Credentials Provider)

## Key Components

### 1. Database Schema
Created [prisma/schema.prisma](file:///Users/muhsinzyne/work/personal/little-learn/prisma/schema.prisma) with:
- `User`: Base user model.
- `ChildProfile`: Each user can have multiple children.
- `Stage`: 8 stages of learning.
- `Lesson`: ~227 lessons across stages.
- `Progress` & `Milestone`: Tracking systems.

### 2. Seed Data
A comprehensive seed file [prisma/seed.ts](file:///Users/muhsinzyne/work/personal/little-learn/prisma/seed.ts) is ready to populate:
- Numbers 0–100
- Alphabet (Capital & Small)
- Sight Words
- Shapes & Colors

### 3. Route Structure
Placeholder pages for all requested routes:
- [Dashboard](file:///Users/muhsinzyne/work/personal/little-learn/src/app/(main)/dashboard/page.tsx)
- [Progress](file:///Users/muhsinzyne/work/personal/little-learn/src/app/(main)/progress/page.tsx)
- [Settings](file:///Users/muhsinzyne/work/personal/little-learn/src/app/(main)/settings/page.tsx)
- [Auth (Login/Register)](file:///Users/muhsinzyne/work/personal/little-learn/src/app/(auth)/login/page.tsx)

## Next Steps
1. **Database Setup**: Update `DATABASE_URL` in [.env](file:///Users/muhsinzyne/work/personal/little-learn/.env) with your MySQL credentials.
2. **Migration**: Run `npx prisma migrate dev --name init`.
3. **Seed**: Run `npx prisma db seed`.
4. **Development**: Start the server with `npm run dev`.
