import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../config/db.js";
import { CreateServiceInput, UpdateServiceInput } from "./service.validation.js";
import throwErr from "../../common/utils/throwError.js";

export const getAllServices = async () => {
  const services = await prisma.service.findMany({where: { isActive: true }});
  return {
    data: services,
    message: "Services retrieved successfully",
  };
};

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
}: CreateServiceInput) => {
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

export const updateService = async ({ body }: UpdateServiceInput) => {
  const {id, ...data} = body;
  try {
    const service = await prisma.service.update({
        where: { id },
        data,
    })
    return {
      data: service,
      message: "Service updated successfully",
    };
  } catch (error) {
    if(error instanceof Prisma.PrismaClientKnownRequestError) {
      if(error.code === "P2025") {
        throwErr(404, "Service not found");
      }
  }
    throw error;
  }
}

export const detailService = async (id: string) => {
  const service = await prisma.service.findUnique({
    where: { id, isActive: true, },
  });

  if (!service) {
    throwErr(404, "Service not found");
  }

  return {
    data: service,
    message: "Service retrieved successfully",
  };
};
