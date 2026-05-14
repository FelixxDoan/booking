import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../config/db.js";
import { serviceInputSchema } from "./service.validation.js";
import throwErr from "../../common/utils/throwError.js";

export const createService = async ({
  code,
  name,
  subject,
  description,
  durationMinutes,
  price,
  level,
  mode,
  isActive,
}: serviceInputSchema) => {
  try {
    const service = await prisma.service.create({
      data: {
        code,
        name,
        subject,
        description,
        durationMinutes,
        price,
        level,
        mode,
        isActive,
      },
    });

    return {
      data: service,
      message: "Service created successfully",
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const target = error.meta?.target;
      if (Array.isArray(target) && target.includes("code")) {
        throwErr(409, "Service code already exists");
      }

      throwErr(409, "Duplicate value already exists");
    }
    throw error;
  }
};

export const updateService = async () => {
  
}
