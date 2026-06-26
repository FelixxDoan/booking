import { BookingSource, UserRole } from "#generated/index.js"
import { prisma } from "@config/db.js"
import { createBooking, getBookingsByRole, getDetailsBooking } from "./booking.repository.js"
import type { CreateBookingInput, OldBooking, RescheduleInput } from "./booking.validation.js"
import throwErr from "@common/utils/throwError.js"
import { cancellableStatuses, canReschedule } from "./booking-status.policy.js"
import { serviceAvailableSlots } from "@modules/availability/avavlability.service.js"

export const createBookingService = async (bookingInput: CreateBookingInput, studentId: number, serviceCode: string) => {
    try {

        const data = await createBooking({ bookingInput, studentId, serviceCode })

        return {
            data,
            message: "Create booking success"
        }
    } catch (error) {
        throw error
    }
}

export const getBookingsByRoleService = async ({ role, userId }: { role: UserRole, userId: number }) => {
    try {
        const data = await getBookingsByRole({ role, userId })
        return {
            data,
            message: "Get Bookings success"
        }
    } catch (error) {
        throw error
    }
}

export const reScheduleBookingService = async ({
    bookingId, rescheduleInput
}: {
    bookingId: string, rescheduleInput: RescheduleInput
}) => {

    const booking = await getDetailsBooking(bookingId)
    if (!booking) return throwErr(404, "Booking not exist")
    const { newBookingDate, newStartTime, newEndTime } = rescheduleInput

    const isDraft = booking.status === "PENDING";
    if (isDraft) {
        const updated = await prisma.booking.update({
            where: { id: bookingId },
            data: {
                startTime: newStartTime,
                endTime: newEndTime,
                bookingDate: new Date(newBookingDate),
                updatedAt: new Date(),
            }
        });

        return {
            data: updated,
            message: "Draft updated (no history needed)"
        };
    }

    if (!canReschedule({ status: booking.status, startTime: booking.startTime, bookingDate: booking.bookingDate })) throwErr(400, "Can not reschedule")

    const { data: availableSlots } = await serviceAvailableSlots({ date: booking.bookingDate, serviceId: booking.serviceId, tutorId: booking.tutorId })


    if (!availableSlots.includes({ startTime: newStartTime, endTime: newEndTime })) throwErr(400, "Time range not available")

    const updatedBooking = prisma.$transaction(async (tx) => {
        const booking = await tx.booking.update({
            where: {
                id: bookingId
            },
            data: {
                status: "PENDING",
                startTime: newStartTime,
                endTime: newEndTime,
                updatedAt: new Date(),
                bookingDate: newBookingDate,
            }
        })

        await prisma.bookingStatusHistory.create({
            data: {
                bookingId,
                fromStatus: booking.status,
                toStatus: "PENDING",
                note: "reschedule",
            },
        });
        return booking
    })

    return {
        data: updatedBooking,
        message: "Reschedule success"
    }
}

export const cancelBookingService = async ({
    userId,
    bookingId,
    cancelReason
}: {
    userId: number;
    bookingId: string;
    cancelReason: string
}) => {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        select: { status: true },
    });

    if (!booking) {
        return throwErr(404, "Booking not exist");
    }

    if (!cancellableStatuses.includes(booking.status as any)) {
        throwErr(400, "Cannot cancel");
    }

    const updatedBooking = await prisma.$transaction(async (tx) => {
        const updatedBooking = await tx.booking.update({
            where: { id: bookingId },
            data: { status: "CANCELLED" },
        });

        await tx.bookingStatusHistory.create({
            data: {
                bookingId,
                fromStatus: booking.status,
                toStatus: "CANCELLED",
                changedById: userId,
                note: cancelReason,
            },
        });

        return updatedBooking

    })

    return {
        data: updatedBooking,
        message: "Cancel booking success",
    };
};

export const getDetailsBookingService = async ({ userId, role, bookingId }: { userId: number, role: UserRole, bookingId: string }) => {
    const userById = role === "STUDENT" ? { studentId: userId } : { tutorId: userId }
    const where = { id: bookingId, ...userById }
    const booking = await prisma.booking.findUnique({
        where,
        include: {
            service: true
        }
    })

    if (!booking) throwErr(404, "Booking not exist")

    return {
        data: booking,
        message: "Get details booking success"
    }

}