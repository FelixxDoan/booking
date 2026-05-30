import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  UserRole,
  UserStatus,
  ServiceLevel,
  ServiceMode,
  Weekday,
} from "../src/generated/prisma/client.js";

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("DATABASE_URL is missing");
}

const adapter = new PrismaPg({
  connectionString: dbUrl,
});

const prisma = new PrismaClient({
  adapter,
});

const seedDate = (date: string) => new Date(`${date}T00:00:00.000Z`);

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 10);

  /**
   * 1. Seed users first
   * Vì TutorProfile, BlockedSlot.createdBy, BlockedSlot.tutorId đều phụ thuộc User.
   */
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {
      fullName: "Demo Admin",
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
    create: {
      fullName: "Demo Admin",
      email: "admin@example.com",
      passwordHash,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  const tutorMath = await prisma.user.upsert({
    where: { email: "math.tutor@example.com" },
    update: {
      fullName: "Nguyen Minh Tutor",
      role: UserRole.TUTOR,
      status: UserStatus.ACTIVE,
    },
    create: {
      fullName: "Nguyen Minh Tutor",
      email: "math.tutor@example.com",
      passwordHash,
      role: UserRole.TUTOR,
      status: UserStatus.ACTIVE,
    },
  });

  const tutorEnglish = await prisma.user.upsert({
    where: { email: "english.tutor@example.com" },
    update: {
      fullName: "Tran English Tutor",
      role: UserRole.TUTOR,
      status: UserStatus.ACTIVE,
    },
    create: {
      fullName: "Tran English Tutor",
      email: "english.tutor@example.com",
      passwordHash,
      role: UserRole.TUTOR,
      status: UserStatus.ACTIVE,
    },
  });

  const studentOne = await prisma.user.upsert({
    where: { email: "student@example.com" },
    update: {
      fullName: "Demo Student",
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
    },
    create: {
      fullName: "Demo Student",
      email: "student@example.com",
      passwordHash,
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
    },
  });

  const studentTwo = await prisma.user.upsert({
    where: { email: "student2@example.com" },
    update: {
      fullName: "Second Demo Student",
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
    },
    create: {
      fullName: "Second Demo Student",
      email: "student2@example.com",
      passwordHash,
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
    },
  });

  /**
   * 2. Seed tutor profiles after tutor users
   */
  await prisma.tutorProfile.upsert({
    where: { userId: tutorMath.id },
    update: {
      headline: "Mathematics and General Tutor",
      bio: "Experienced tutor for Mathematics and general academic support.",
      subjects: ["Mathematics", "Physics"],
      yearsOfExperience: 3,
      teachingModes: ["ONLINE", "OFFLINE"],
      isActive: true,
    },
    create: {
      userId: tutorMath.id,
      headline: "Mathematics and General Tutor",
      bio: "Experienced tutor for Mathematics and general academic support.",
      subjects: ["Mathematics", "Physics"],
      yearsOfExperience: 3,
      teachingModes: ["ONLINE", "OFFLINE"],
      isActive: true,
    },
  });

  await prisma.tutorProfile.upsert({
    where: { userId: tutorEnglish.id },
    update: {
      headline: "English Communication Tutor",
      bio: "Tutor focused on English communication, pronunciation, and confidence building.",
      subjects: ["English"],
      yearsOfExperience: 4,
      teachingModes: ["ONLINE"],
      isActive: true,
    },
    create: {
      userId: tutorEnglish.id,
      headline: "English Communication Tutor",
      bio: "Tutor focused on English communication, pronunciation, and confidence building.",
      subjects: ["English"],
      yearsOfExperience: 4,
      teachingModes: ["ONLINE"],
      isActive: true,
    },
  });

  /**
   * 3. Seed services
   */
  const services = [
    {
      code: "MATH-BEG-60",
      name: "Toán học cơ bản cho học sinh cấp 2",
      subject: "Mathematics",
      description: "Hệ thống hóa kiến thức đại số và hình học nền tảng.",
      durationMinutes: 60,
      price: 150000,
      level: ServiceLevel.BEGINNER,
      mode: ServiceMode.ONLINE,
      isActive: true,
    },
    {
      code: "MATH-INT-90",
      name: "Toán nâng cao luyện tư duy",
      subject: "Mathematics",
      description: "Rèn luyện tư duy giải bài và kỹ năng xử lý đề nâng cao.",
      durationMinutes: 90,
      price: 250000,
      level: ServiceLevel.INTERMEDIATE,
      mode: ServiceMode.ONLINE,
      isActive: true,
    },
    {
      code: "ENG-INT-60",
      name: "Tiếng Anh giao tiếp trung cấp",
      subject: "English",
      description: "Tập trung vào phản xạ, phát âm và giao tiếp tình huống.",
      durationMinutes: 60,
      price: 220000,
      level: ServiceLevel.INTERMEDIATE,
      mode: ServiceMode.ONLINE,
      isActive: true,
    },
    {
      code: "PROG-ADV-120",
      name: "Lập trình Backend với Node.js chuyên sâu",
      subject: "Computer Science",
      description: "Xây dựng API, xử lý database, authentication và business logic thực tế.",
      durationMinutes: 120,
      price: 500000,
      level: ServiceLevel.ADVANCED,
      mode: ServiceMode.HYBRID,
      isActive: true,
    },
    {
      code: "TRIAL-FREE-30",
      name: "Buổi học thử miễn phí",
      subject: "General",
      description: "Đánh giá trình độ và tư vấn lộ trình học tập.",
      durationMinutes: 30,
      price: 0,
      level: ServiceLevel.BEGINNER,
      mode: ServiceMode.ONLINE,
      isActive: true,
    },
    {
      code: "OLD-COURSE",
      name: "Khóa học cũ đã ngừng nhận lịch",
      subject: "History",
      description: "Dữ liệu cũ để kiểm tra logic lọc service inactive.",
      durationMinutes: 45,
      price: 100000,
      level: ServiceLevel.BEGINNER,
      mode: ServiceMode.ONLINE,
      isActive: false,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { code: service.code },
      update: {
        name: service.name,
        subject: service.subject,
        description: service.description,
        durationMinutes: service.durationMinutes,
        price: service.price,
        level: service.level,
        mode: service.mode,
        isActive: service.isActive,
      },
      create: service,
    });
  }

  /**
   * 4. Seed weekly working hours
   * Dùng upsert vì weekday là unique.
   */
  const workingHours = [
    {
      weekday: Weekday.MONDAY,
      startTime: "08:00",
      endTime: "17:00",
      isActive: true,
    },
    {
      weekday: Weekday.TUESDAY,
      startTime: "08:00",
      endTime: "17:00",
      isActive: true,
    },
    {
      weekday: Weekday.WEDNESDAY,
      startTime: "08:00",
      endTime: "17:00",
      isActive: true,
    },
    {
      weekday: Weekday.THURSDAY,
      startTime: "08:00",
      endTime: "17:00",
      isActive: true,
    },
    {
      weekday: Weekday.FRIDAY,
      startTime: "08:00",
      endTime: "17:00",
      isActive: true,
    },
    {
      weekday: Weekday.SATURDAY,
      startTime: "09:00",
      endTime: "12:00",
      isActive: true,
    },
    {
      weekday: Weekday.SUNDAY,
      startTime: "09:00",
      endTime: "12:00",
      isActive: false,
    },
  ];

  for (const item of workingHours) {
    await prisma.workingHours.upsert({
      where: { weekday: item.weekday },
      update: {
        startTime: item.startTime,
        endTime: item.endTime,
        timezone: "Asia/Ho_Chi_Minh",
        isActive: item.isActive,
      },
      create: {
        weekday: item.weekday,
        startTime: item.startTime,
        endTime: item.endTime,
        timezone: "Asia/Ho_Chi_Minh",
        isActive: item.isActive,
      },
    });
  }

  /**
   * 5. Clean old demo blocked slots
   * Vì BlockedSlot chưa có unique key tự nhiên, xóa các seed cũ theo prefix rồi tạo lại.
   */
  await prisma.blockedSlot.deleteMany({
    where: {
      reason: {
        startsWith: "[SEED]",
      },
    },
  });

  /**
   * 6. Seed blocked slots
   *
   * Demo dates:
   * 2026-06-01 MONDAY    -> normal working day
   * 2026-06-02 TUESDAY   -> global full-day blocked
   * 2026-06-03 WEDNESDAY -> global partial blocked 10:00-12:00
   * 2026-06-04 THURSDAY  -> math tutor full-day blocked
   * 2026-06-05 FRIDAY    -> math tutor partial blocked 13:00-15:00
   */
  await prisma.blockedSlot.createMany({
    data: [
      {
        date: seedDate("2026-06-02"),
        startTime: null,
        endTime: null,
        reason: "[SEED] Public holiday - full day blocked for everyone",
        createdBy: admin.id,
      },
      {
        date: seedDate("2026-06-03"),
        startTime: "10:00",
        endTime: "12:00",
        reason: "[SEED] Staff meeting - global partial blocked time",
        createdBy: admin.id,
      },
      {
        tutorId: tutorMath.id,
        date: seedDate("2026-06-04"),
        startTime: null,
        endTime: null,
        reason: "[SEED] Math tutor unavailable - full day",
        createdBy: admin.id,
      },
      {
        tutorId: tutorMath.id,
        date: seedDate("2026-06-05"),
        startTime: "13:00",
        endTime: "15:00",
        reason: "[SEED] Math tutor personal appointment",
        createdBy: tutorMath.id,
      },
      {
        tutorId: tutorEnglish.id,
        date: seedDate("2026-06-05"),
        startTime: "09:00",
        endTime: "10:30",
        reason: "[SEED] English tutor morning blocked time",
        createdBy: tutorEnglish.id,
      },
    ],
  });

  console.log("Seed completed successfully");
  console.log("Demo accounts password: Password123!");
  console.log({
    admin: admin.email,
    tutorMath: tutorMath.email,
    tutorEnglish: tutorEnglish.email,
    studentOne: studentOne.email,
    studentTwo: studentTwo.email,
  });
}

main()
  .catch((error) => {
    console.error("Seed failed");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });