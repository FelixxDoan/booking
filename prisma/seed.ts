import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  UserRole,
  UserStatus,
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

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 10);

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      fullName: "Demo Admin",
      email: "admin@example.com",
      passwordHash,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.user.upsert({
    where: { email: "tutor@example.com" },
    update: {},
    create: {
      fullName: "Demo Tutor",
      email: "tutor@example.com",
      passwordHash,
      role: UserRole.TUTOR,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.user.upsert({
    where: { email: "student@example.com" },
    update: {},
    create: {
      fullName: "Demo Student",
      email: "student@example.com",
      passwordHash,
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
    },
  });

  const services = [
    {
      code: "MATH-BEG-60",
      name: "Toán học cơ bản cho học sinh cấp 2",
      subject: "Mathematics",
      description: "Hệ thống hóa kiến thức đại số và hình học nền tảng.",
      durationMinutes: 60,
      price: 150000,
      level: "BEGINNER",
      mode: "ONLINE",
      isActive: true,
    },
    {
      code: "ENG-INT-90",
      name: "Tiếng Anh giao tiếp trung cấp",
      subject: "English",
      description: "Tập trung vào phản xạ và phát âm chuẩn bản xứ.",
      durationMinutes: 90,
      price: 250000,
      level: "BEGINNER",
      mode: "ONLINE",
      isActive: true,
    },
    {
      code: "PROG-ADV-120",
      name: "Lập trình Backend với Node.js chuyên sâu",
      subject: "Computer Science",
      description: "Xây dựng hệ thống Microservices và tối ưu Performance.",
      durationMinutes: 120,
      price: 500000,
      level: "BEGINNER",
      mode: "ONLINE",
      isActive: true,
    },
    {
      code: "TRIAL-FREE-30",
      name: "Buổi học thử miễn phí",
      subject: "General",
      description: "Đánh giá trình độ và tư vấn lộ trình học tập.",
      durationMinutes: 30,
      price: 0,
      level: "BEGINNER",
      mode: "ONLINE",
      isActive: true,
    },
    {
      code: "OLD-COURSE",
      name: "Khóa học cũ (Đã ngừng nhận lịch)",
      subject: "History",
      description: "Dữ liệu cũ để kiểm tra logic hiển thị.",
      durationMinutes: 45,
      price: 100000,
      level: "BEGINNER",
      mode: "ONLINE",
      isActive: false, // Để test bộ lọc Active
    }
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { code: service.code },
      update: {},
      create: service,
    });
  }

  console.log("Seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });