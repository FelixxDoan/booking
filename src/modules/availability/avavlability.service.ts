import throwErr from "@common/utils/throwError.js";
import {
    getListAvailableTimeSlots,
    isOverlapTime,
} from "@common/utils/time.js";
import { prisma, Weekday } from "@config/db.js";
import { getBookedSlots } from "@modules/bookings/booking.repository.js";
import { getTutorById, getTutorBySubject } from "@modules/tutor/tutor.repository.js";

export type Slot = {
    startTime: string;
    endTime: string;
};

type TimeRange = {
    startTime: string;
    endTime: string;
};

type BlockedSlotResult = {
    startTime: string | null;
    endTime: string | null;
};

type CreateBlockedSlotInput = {
    startTime?: string;
    endTime?: string;
    reason?: string;
    date: string;
    tutorId?: number;
    createdBy: number;
};

type ServiceAvailableSlotsInput = {
    date: string | Date;
    serviceId: string;
    tutorId?: number|null;
};

/**
 * Working hours
 */

export const getWorkingHoursForWeekday = async (weekday: Weekday) => {
    return await prisma.workingHours.findUnique({
        where: { weekday },
    });
};

export const getWorkingHoursService = async () => {
    const workingHours = await prisma.workingHours.findMany();

    return {
        data: workingHours,
        message: "Working hours retrieved successfully",
    };
};

export const updateWorkingHoursService = async (
    workingHours: {
        weekday: Weekday;
        startTime: string;
        endTime: string;
        isActive: boolean;
    }[]
) => {
    const updatedWorkingHours = await prisma.$transaction(
        workingHours.map((wh) =>
            prisma.workingHours.upsert({
                where: {
                    weekday: wh.weekday,
                },
                update: {
                    startTime: wh.startTime,
                    endTime: wh.endTime,
                    isActive: wh.isActive,
                },
                create: {
                    weekday: wh.weekday,
                    startTime: wh.startTime,
                    endTime: wh.endTime,
                    isActive: wh.isActive,
                },
            })
        )
    );

    return {
        data: updatedWorkingHours,
        message: "Working hours updated successfully",
    };
};

/**
 * Blocked slots
 */

export const getAllBlockedSlotsService = async () => {
    const blockedSlots = await prisma.blockedSlot.findMany();

    return {
        data: blockedSlots,
        message: "Blocked slots retrieved successfully",
    };
};

export const getDetailsBlockedSlotService = async (
    date: Date,
    tutorId?: number
): Promise<BlockedSlotResult[]> => {
    const where = tutorId !== undefined ? { date, tutorId } : { date };

    return await prisma.blockedSlot.findMany({
        where,
        select: {
            date: true, 
            startTime: true,
            endTime: true,
        },
    });
};

const checkFullDayBlocked = async (date: Date, tutorId?: number) => {
    const dayBlocked = await prisma.blockedSlot.findFirst({
        where: {
            date,
            startTime: null,
            endTime: null,
            tutorId: tutorId ?? null,
        },
    });
    
    return Boolean(dayBlocked);
};

const checkOverlappingBlockedSlot = async (
    date: Date,
    startTime: string,
    endTime: string,
    tutorId?: number
) => {
    const overlappingSlot = await prisma.blockedSlot.findFirst({
        where: {
            date,
            tutorId: tutorId ?? null,
            startTime: {
                lt: endTime,
            },
            endTime: {
                gt: startTime,
            },
        },
    });

    return Boolean(overlappingSlot);
};

export const createBlockedSlotService = async (
    input: CreateBlockedSlotInput
) => {
    const { startTime, endTime, reason, date, tutorId, createdBy } = input;

    const targetDate = new Date(date);
    const isFullDayBlock = !startTime && !endTime;

    const isGlobalFullDayBlocked = await checkFullDayBlocked(targetDate);

    if (isGlobalFullDayBlocked) {
        throwErr(400, "The entire day is already blocked");
    }

    if (tutorId) {
        const tutor = await getTutorById(tutorId);

        if (!tutor) {
            throwErr(404, "Tutor not found");
        }

        const isTutorFullDayBlocked = await checkFullDayBlocked(
            targetDate,
            tutorId
        );

        if (isTutorFullDayBlocked) {
            throwErr(400, "The entire day is already blocked for this tutor");
        }
    }

    if (!isFullDayBlock) {
        const hasOverlappingBlockedSlot = await checkOverlappingBlockedSlot(
            targetDate,
            startTime!,
            endTime!,
            tutorId
        );

        if (hasOverlappingBlockedSlot) {
            throwErr(
                400,
                "There is an overlapping blocked slot for the specified time range"
            );
        }
    }

    const blockedSlot = await prisma.blockedSlot.create({
        data: {
            date: targetDate,
            startTime: startTime ?? null,
            endTime: endTime ?? null,
            reason: reason ?? null,
            tutorId: tutorId ?? null,
            createdBy,
        },
    });

    return {
        data: blockedSlot,
        message: "Blocked slot created successfully",
    };
};

/**
 * Availability helpers
 */

const hasFullDayBlockedSlot = (blockedSlots: BlockedSlotResult[]) => {
    return blockedSlots.some((slot) => !slot.startTime && !slot.endTime);
};

const isPartialDayBlockedSlot = (
    slot: BlockedSlotResult
): slot is BlockedSlotResult & TimeRange => {
    return Boolean(slot.startTime && slot.endTime);
};

const mapBlockedSlotsToTimeRanges = (
    blockedSlots: BlockedSlotResult[]
): TimeRange[] => {
    return blockedSlots
        .filter(isPartialDayBlockedSlot)
        .map((slot) => ({
            startTime: slot.startTime,
            endTime: slot.endTime,
        }));
};

const mapBookedSlotsToTimeRanges = (
    bookedSlots: {
        startTime: string;
        endTime: string;
    }[]
): TimeRange[] => {
    return bookedSlots.map((slot) => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
    }));
};

const filterAvailableSlots = (
    candidateSlots: Slot[],
    unavailableRanges: TimeRange[]
) => {
    if (unavailableRanges.length === 0) {
        return candidateSlots;
    }

    return candidateSlots.filter((candidateSlot) => {
        return !unavailableRanges.some((unavailableRange) => {
            return isOverlapTime(
                candidateSlot.startTime,
                candidateSlot.endTime,
                unavailableRange.startTime,
                unavailableRange.endTime
            );
        });
    });
};

export const tutorAvailableSlots = async ( subject: string ) => {

    const tutors = await getTutorBySubject(subject);

    if (!tutors) {
        return {
            data: [],
            message: "No tutors found for the specified subject",
        };
    }
    
    return {
        data: tutors,
        message: "Tutors retrieved successfully",
    }
};

export const serviceAvailableSlots = async ({
  date: targetDate,
  serviceId,
  tutorId: rawTutorId,
}: ServiceAvailableSlotsInput) => {
  const date = new Date(targetDate);

  const tutorId =
    rawTutorId !== undefined && rawTutorId !== null
      ? Number(rawTutorId)
      : undefined;

  const candidateSlots = await getListAvailableTimeSlots(date, serviceId);

  const blockedSlots = await getDetailsBlockedSlotService(date, tutorId);

  if (hasFullDayBlockedSlot(blockedSlots)) {
    return {
      data: [],
      message: "No available slots, the entire day is blocked",
    };
  }

  if (tutorId !== undefined) {
    const checkTutor = await getTutorById(tutorId);

    if (!checkTutor) throwErr(404, "Tutor inactive or not exist");
  }

  const bookedSlots = await getBookedSlots({ date, tutorId })

  const unavailableRanges: TimeRange[] = [
    ...mapBlockedSlotsToTimeRanges(blockedSlots),
    ...mapBookedSlotsToTimeRanges(bookedSlots),
  ];

  const availableSlots = filterAvailableSlots(candidateSlots, unavailableRanges);

  return {
    data: availableSlots,
    message: "Available slots retrieved successfully",
  };
};