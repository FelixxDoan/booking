import { prisma } from "@config/db.js"
import { Prisma } from "../../generated/prisma/client.js";
import { RegisterInput, tutorProfileInput } from "@modules/auth/auth.validation.js"
import { createUser, getAllUsers } from "./user.repository.js"
import throwErr from "@common/utils/throwError.js"
import { upsertTutorProfile } from "@modules/tutor/tutor.repository.js";
import { hashPassword } from "@common/utils/password.js";

export const createTutorService = async (
  { userProfile, tutorProfile }:
    { userProfile: RegisterInput, tutorProfile: tutorProfileInput }) => {

  const { password, ...restUserProfile } = userProfile

  const passwordHash = await hashPassword(password)

  try {
    const tutor = await createUser({ passwordHash, ...restUserProfile })
    const { id, createdAt, ...restTutor } = tutor

    const profile = await upsertTutorProfile(tutor.id, tutorProfile)
    const { id: _id, ...restProfile } = profile
    return {
      data: { ...restTutor, ...restProfile },
      message: "Create tutor success"
    }

  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const target = error.meta?.target;

      if (Array.isArray(target) && target.includes("email")) {
        throwErr(409, "Email already exists");
      }

      throwErr(409, "Duplicate value already exists");
    }

    throw error;
  }

}

export const getAllUsersService = async () => {
  return await getAllUsers()
}