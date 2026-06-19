import { createBooking } from "./booking.repository.js"
import type { CreateBookingInput } from "./booking.validation.js"

export const createBookingService = async ( bookingInput: CreateBookingInput,studentId: number, serviceCode: string) => {
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

