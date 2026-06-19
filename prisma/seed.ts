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
if (!dbUrl) throw new Error("DATABASE_URL is missing");

const adapter = new PrismaPg({ connectionString: dbUrl });
const prisma = new PrismaClient({ adapter });

const seedDate = (date: string) => new Date(`${date}T00:00:00.000Z`);

// Định nghĩa đúng 10 môn học theo yêu cầu
const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "English",
  "Computer Science",
  "History",
  "Biology",
  "Geography",
  "Literature",
  "Art"
];

const clearData = async () => {
  console.log("Xóa dữ liệu cũ...");
  await prisma.$transaction([
    prisma.bookingStatusHistory.deleteMany(),
    prisma.booking.deleteMany(),
    prisma.blockedSlot.deleteMany(),
    prisma.tutorProfile.deleteMany(),
    prisma.workingHours.deleteMany(),
    prisma.service.deleteMany(),
    prisma.user.deleteMany(),
  ]);
  console.log("Đã xóa xong dữ liệu cũ.");
};

async function main() {
  await clearData();
  const passwordHash = await bcrypt.hash("Password123!", 10);

  // 1. Tạo 1 Tài khoản Admin mặc định
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      fullName: "Hệ Thống Admin",
      email: "admin@example.com",
      passwordHash,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  // 2. Tạo 10 Giáo viên (Tutors) & Xử lý phân phối môn học logic
  console.log("Đang khởi tạo 10 Giáo viên (Đảm bảo phủ đủ 10 môn)...");
  const tutors: any[] = [];
  const tutorNames = [
    "Nguyễn Minh Tâm", "Trần Thị Hương", "Lê Hoàng Nam", "Phạm Hồng Phúc", 
    "Vũ Tiến Đạt", "Hoàng Thúy Nga", "Ngô Quốc Bảo", "Đỗ Diệu Linh", 
    "Bùi Văn Hùng", "Phan Thanh Thảo"
  ];

  for (let i = 0; i < 10; i++) {
    const email = `tutor.${i + 1}@example.com`;
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        fullName: tutorNames[i],
        email,
        passwordHash,
        role: UserRole.TUTOR,
        status: UserStatus.ACTIVE,
      },
    });
    tutors.push(user);

    // --- THUẬT TOÁN ĐẢM BẢO PHỦ ĐỦ MÔN ---
    // Giáo viên thứ `i` chắc chắn sẽ dạy môn thứ `i` trong danh sách SUBJECTS
    const mandatorySubject = SUBJECTS[i]; 

    // Lọc ra các môn còn lại để chọn ngẫu nhiên thêm (tránh trùng môn chính)
    const remainingSubjects = SUBJECTS.filter(s => s !== mandatorySubject);
    const shuffledRemaining = remainingSubjects.sort(() => 0.5 - Math.random());
    
    // Sinh thêm ngẫu nhiên từ 0 đến 2 môn nữa
    const extraCount = Math.floor(Math.random() * 3); // Trả về 0, 1 hoặc 2
    const extraSubjects = shuffledRemaining.slice(0, extraCount);

    // Gộp lại thành mảng danh sách môn của giáo viên đó (Tối đa 3 môn)
    const assignedSubjects = [mandatorySubject, ...extraSubjects];

    await prisma.tutorProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        headline: `Chuyên gia giảng dạy: ${assignedSubjects.join(", ")}`,
        bio: `Giáo viên phụ trách chính môn ${mandatorySubject}. Phương pháp sư phạm thực tế, tận tâm.`,
        subjects: assignedSubjects,
        yearsOfExperience: Math.floor(Math.random() * 8) + 2,
        teachingModes: i % 2 === 0 ? ["ONLINE", "OFFLINE"] : ["ONLINE"],
        isActive: true,
      },
    });
  }

  // 3. Tạo 5 Học sinh (Students)
  console.log("Đang khởi tạo 5 Học sinh...");
  const studentNames = [
    "Nguyễn Văn An", "Trần Đức Bình", "Lê Minh Châu", "Phạm Tiến Dũng", "Hoàng Hải Yến"
  ];
  for (let i = 0; i < 5; i++) {
    const email = `student.${i + 1}@example.com`;
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        fullName: studentNames[i],
        email,
        passwordHash,
        role: UserRole.STUDENT,
        status: UserStatus.ACTIVE,
      },
    });
  }

  // 4. Khởi tạo danh sách các Dịch vụ học tập (Services) tương ứng với 10 môn
  console.log("Đang tạo danh sách khóa học cho 10 môn học...");
  const services = SUBJECTS.flatMap((subj, index) => {
    const shortSubj = subj.substring(0, 3).toUpperCase();
    return [
      {
        code: `${shortSubj}-BEG-${index + 1}`,
        name: `Khóa học ${subj} Nền Tảng`,
        subject: subj,
        description: `Bổ trợ và củng cố kiến thức môn ${subj} cho mọi đối tượng học sinh.`,
        durationMinutes: 60,
        price: 150000 + (index * 10000),
        level: ServiceLevel.BEGINNER,
        mode: ServiceMode.ONLINE,
        isActive: true,
      },
      {
        code: `${shortSubj}-ADV-${index + 1}`,
        name: `Luyện thi ${subj} Nâng Cao`,
        subject: subj,
        description: `Bồi dưỡng tư duy chuyên sâu, mẹo giải bài tập khó môn ${subj}.`,
        durationMinutes: 90,
        price: 250000 + (index * 10000),
        level: ServiceLevel.ADVANCED,
        mode: ServiceMode.HYBRID,
        isActive: true,
      }
    ];
  });

  for (const service of services) {
    await prisma.service.upsert({
      where: { code: service.code },
      update: {},
      create: service,
    });
  }

  // 5. Khởi tạo Khung giờ làm việc hàng tuần (Working Hours)
  console.log("Đang tạo khung giờ làm việc...");
  const weekdays = [
    Weekday.MONDAY, Weekday.TUESDAY, Weekday.WEDNESDAY, 
    Weekday.THURSDAY, Weekday.FRIDAY, Weekday.SATURDAY
  ];
  for (const day of weekdays) {
    await prisma.workingHours.upsert({
      where: { weekday: day },
      update: {},
      create: {
        weekday: day,
        startTime: "08:00",
        endTime: "21:00",
        timezone: "Asia/Ho_Chi_Minh",
        isActive: true,
      },
    });
  }

  // 6. Tạo một vài Blocked slots mẫu cho Giáo viên đầu tiên làm dữ liệu test chặn lịch
  if (tutors.length > 0) {
    console.log("Tạo lịch bận mẫu cho giáo viên...");
    await prisma.blockedSlot.createMany({
      data: [
        {
          date: seedDate("2026-06-20"),
          startTime: null,
          endTime: null,
          reason: "[SEED] Toàn bộ hệ thống nghỉ lễ Quốc Gia",
          createdBy: admin.id,
        },
        {
          tutorId: tutors[0].id,
          date: seedDate("2026-06-22"),
          startTime: "09:00",
          endTime: "11:00",
          reason: "[SEED] Giáo viên bận việc cá nhân",
          createdBy: tutors[0].id,
        }
      ]
    });
  }

  console.log("\n--- HOÀN THÀNH SEED DỮ LIỆU MỞ RỘNG ---");
  console.log(`- Đã tạo: 1 Admin, 10 Tutors (mỗi môn chắc chắn có ít nhất 1 người dạy), 5 Students.`);
  console.log(`- Đảm bảo phủ đủ toàn bộ 10 môn học: ${SUBJECTS.join(", ")}`);
  console.log(`- Mật khẩu đăng nhập chung: Password123!`);
}

main()
  .catch((error) => {
    console.error("Seed dữ liệu thất bại:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });