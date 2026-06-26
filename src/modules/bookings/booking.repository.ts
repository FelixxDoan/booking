import { prisma } from "@config/db.js"
import { bookingStatusesConsumeTime } from "./booking-status.policy.js"
import type { CreateBookingInput } from "./booking.validation.js"

export const getBookedSlots = async (
    { date, tutorId }:
        { date: Date, tutorId?: number }
) => {

    return await prisma.booking.findMany({
        where: {
            bookingDate: date,
            tutorId,
            status: {
                in: bookingStatusesConsumeTime
            }
        },
        select: {
            bookingDate: true,
            startTime: true,
            endTime: true,
        }
    })

}

export const generateBookingCode = ({ bookingDate, serviceCode }: { bookingDate: string, serviceCode: string }) => {

    const randomPart = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

    return `${bookingDate}-${serviceCode}-${randomPart}`;
};

export const createBooking = async (
    { bookingInput, studentId, serviceCode }:
        {
            bookingInput: CreateBookingInput, studentId: number, serviceCode: string, tutorId?: number
        }) => {
    const { serviceId
        , tutorId
        , bookingDate
        , startTime
        , endTime
        , studentNote } = bookingInput

    const booking = await prisma.$transaction(async (tx) => {
        const booking = await tx.booking.create({
            data: {
                code: generateBookingCode({ bookingDate, serviceCode }),
                bookingDate: new Date(bookingDate),
                studentId,
                tutorId: tutorId ?? null,
                serviceId,
                startTime,
                endTime,
                studentNote,
            }
        })

        await tx.bookingStatusHistory.create({
            data: {
                bookingId: booking.id,
                fromStatus: null,
                toStatus: "PENDING",
                changedById: studentId,
                note: studentNote,
            },
        });

        return booking
    })
    return booking
}

export const getAllBookings = async () => {
    return await prisma.booking.findMany()
}

export const getBookingsByRole = async ({ role, userId }: { role: string, userId: number }) => {
    const query = role === 'STUDENT' ? { studentId: userId } : { tutorId: userId }

    return prisma.booking.findMany({
        where: query,
        include: {
            service: {
                select: {
                    name: true,
                    mode: true
                }
            }
        }
    })
}

export const getDetailsBooking = async (id: string) => {
    return await prisma.booking.findUnique({
        where: {
            id
        }
    })
}

export const getAllHistoryStatusBooking = async (id: string) => {
    return await prisma.bookingStatusHistory.findMany({
        where: {
            bookingId: id
        }
    })
}