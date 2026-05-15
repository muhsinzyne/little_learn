import { PrismaClient, LessonType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // 1. Numbers 0–10
  const stage1 = await prisma.stage.upsert({
    where: { orderIndex: 1 },
    update: {},
    create: {
      title: "Numbers 0–10",
      description: "Learn the basics of counting from zero to ten.",
      iconKey: "1️⃣",
      orderIndex: 1,
      milestoneFlag: true,
    },
  });

  for (let i = 0; i <= 10; i++) {
    await prisma.lesson.upsert({
      where: { stageId_orderIndex: { stageId: stage1.id, orderIndex: i } },
      update: {},
      create: {
        stageId: stage1.id,
        title: `Number ${i}`,
        type: LessonType.NUMBER,
        contentValue: i.toString(),
        orderIndex: i,
      },
    });
  }

  // 2. Numbers 11–50
  const stage2 = await prisma.stage.upsert({
    where: { orderIndex: 2 },
    update: {},
    create: {
      title: "Numbers 11–50",
      description: "Continue your counting journey up to fifty.",
      iconKey: "🔢",
      orderIndex: 2,
    },
  });

  for (let i = 11; i <= 50; i++) {
    await prisma.lesson.upsert({
      where: { stageId_orderIndex: { stageId: stage2.id, orderIndex: i - 11 } },
      update: {},
      create: {
        stageId: stage2.id,
        title: `Number ${i}`,
        type: LessonType.NUMBER,
        contentValue: i.toString(),
        orderIndex: i - 11,
      },
    });
  }

  // 3. Numbers 51–100
  const stage3 = await prisma.stage.upsert({
    where: { orderIndex: 3 },
    update: {},
    create: {
      title: "Numbers 51–100",
      description: "Master counting all the way to one hundred!",
      iconKey: "💯",
      orderIndex: 3,
      milestoneFlag: true,
    },
  });

  for (let i = 51; i <= 100; i++) {
    await prisma.lesson.upsert({
      where: { stageId_orderIndex: { stageId: stage3.id, orderIndex: i - 51 } },
      update: {},
      create: {
        stageId: stage3.id,
        title: `Number ${i}`,
        type: LessonType.NUMBER,
        contentValue: i.toString(),
        orderIndex: i - 51,
      },
    });
  }

  // 4. Capital Letters A–Z
  const stage4 = await prisma.stage.upsert({
    where: { orderIndex: 4 },
    update: {},
    create: {
      title: "Capital Letters A–Z",
      description: "Learn to recognize all uppercase letters of the alphabet.",
      iconKey: "🔠",
      orderIndex: 4,
    },
  });

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  for (let i = 0; i < alphabet.length; i++) {
    await prisma.lesson.upsert({
      where: { stageId_orderIndex: { stageId: stage4.id, orderIndex: i } },
      update: {},
      create: {
        stageId: stage4.id,
        title: `Letter ${alphabet[i]}`,
        type: LessonType.LETTER,
        contentValue: alphabet[i],
        orderIndex: i,
      },
    });
  }

  // 5. Small Letters a–z
  const stage5 = await prisma.stage.upsert({
    where: { orderIndex: 5 },
    update: {},
    create: {
      title: "Small Letters a–z",
      description: "Learn to recognize all lowercase letters of the alphabet.",
      iconKey: "🔡",
      orderIndex: 5,
      milestoneFlag: true,
    },
  });

  const smallAlphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  for (let i = 0; i < smallAlphabet.length; i++) {
    await prisma.lesson.upsert({
      where: { stageId_orderIndex: { stageId: stage5.id, orderIndex: i } },
      update: {},
      create: {
        stageId: stage5.id,
        title: `Letter ${smallAlphabet[i]}`,
        type: LessonType.LETTER,
        contentValue: smallAlphabet[i],
        orderIndex: i,
      },
    });
  }

  // 6. Sight Words
  const stage6 = await prisma.stage.upsert({
    where: { orderIndex: 6 },
    update: {},
    create: {
      title: "Sight Words",
      description: "Learn common preschool sight words.",
      iconKey: "📖",
      orderIndex: 6,
    },
  });

  const sightWords = [
    "the", "to", "and", "a", "I", "you", "it", "in", "said", "for", 
    "up", "look", "is", "go", "we", "little", "down", "can", "see", "not",
    "one", "my", "me", "big", "come", "blue", "red", "where", "jump", "away",
    "help", "make", "yellow", "two", "play", "run", "find", "three", "funny"
  ];
  for (let i = 0; i < sightWords.length; i++) {
    await prisma.lesson.upsert({
      where: { stageId_orderIndex: { stageId: stage6.id, orderIndex: i } },
      update: {},
      create: {
        stageId: stage6.id,
        title: sightWords[i].charAt(0).toUpperCase() + sightWords[i].slice(1),
        type: LessonType.WORD,
        contentValue: sightWords[i],
        orderIndex: i,
      },
    });
  }

  // 7. Shapes
  const stage7 = await prisma.stage.upsert({
    where: { orderIndex: 7 },
    update: {},
    create: {
      title: "Shapes",
      description: "Learn to identify basic geometric shapes.",
      iconKey: "📐",
      orderIndex: 7,
    },
  });

  const shapes = [
    "Circle", "Square", "Triangle", "Rectangle", "Oval", 
    "Diamond", "Star", "Heart", "Pentagon", "Hexagon"
  ];
  for (let i = 0; i < shapes.length; i++) {
    await prisma.lesson.upsert({
      where: { stageId_orderIndex: { stageId: stage7.id, orderIndex: i } },
      update: {},
      create: {
        stageId: stage7.id,
        title: shapes[i],
        type: LessonType.SHAPE,
        contentValue: shapes[i].toLowerCase(),
        orderIndex: i,
      },
    });
  }

  // 8. Colors
  const stage8 = await prisma.stage.upsert({
    where: { orderIndex: 8 },
    update: {},
    create: {
      title: "Colors",
      description: "Learn to recognize different colors.",
      iconKey: "🎨",
      orderIndex: 8,
      milestoneFlag: true,
    },
  });

  const colors = [
    "Red", "Blue", "Green", "Yellow", "Orange", "Purple", 
    "Pink", "Brown", "Black", "White", "Gray", "Cyan"
  ];
  for (let i = 0; i < colors.length; i++) {
    await prisma.lesson.upsert({
      where: { stageId_orderIndex: { stageId: stage8.id, orderIndex: i } },
      update: {},
      create: {
        stageId: stage8.id,
        title: colors[i],
        type: LessonType.COLOR,
        contentValue: colors[i].toLowerCase(),
        orderIndex: i,
      },
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
