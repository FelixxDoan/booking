import { prisma } from "@config/db.js";
import { tutorProfileInput } from "@modules/auth/auth.validation.js";

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

export const getTutorBySubject = async (subject: string) => {
    return await prisma.tutorProfile.findMany({
        where: {
            subjects: { has: subject }
        },
        select: {
            user: {
                select: {
                    id: true,
                    fullName: true,
                }
            },
        },
    });
}


export const upsertTutorProfile = async (id: number, tutorProfile: tutorProfileInput) => {
    return await prisma.tutorProfile.upsert({
        where: {
            userId: id
        },
        update: {
            ...tutorProfile
        },
        create: {
            ...tutorProfile,
            user: {
                connect: {
                    id,
                },
            }
        }
    })
}