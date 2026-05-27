import { prisma } from "../../config/db.js";

export const allServices = async () => {
    return await prisma.service.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } });
};

export const detailService = async (id: string) => {
    return await prisma.service.findUnique({
        where: { id, isActive: true, },
    });
};
