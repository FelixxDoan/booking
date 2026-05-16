import { prisma } from "@config/db.js";

const activeTutorWhere = {
    role: "TUTOR" as const,
    status: "ACTIVE" as const,
    tutorProfile: {
        isActive: true,
    },
};

export const getAllTurors = async () => {
    return await prisma.user.findMany({
        where: {
            ...activeTutorWhere
        },
        include: {
            tutorProfile: true,
        }
    });
}

export const getTutorById = async (id: number) => {
    return await prisma.user.findFirst({
        where: {
            id, ...activeTutorWhere
        },
        include: {
            tutorProfile: true,
        }
    });
}   
