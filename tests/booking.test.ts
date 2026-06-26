import { describe, it } from 'vitest'

import { getbBookedSlots } from '../src/modules/availability/avavlability.service'
import { getAllBookings, getAllHistoryStatusBooking, getBookingsByRole, getDetailsBooking } from '../src/modules/bookings/booking.repository'

describe("getBookings", () => {
    it('get bookings', async () => {
        const date = process.env.DATE
        const tutorId = process.env.TUTOR_ID
        const serviceId = process.env.SERIVCE_ID

        const data = await getbBookedSlots({ date: new Date(date), tutorId: Number(tutorId), serviceId })

        console.log({ data })
    })
})

describe("getAllBookings", () => {
    it("get all bookings", async () => {
        const data = await getAllBookings()
        console.log({data})
    })
})

describe("getBookingsByRole", () => {
    it("get bookings by role", async () => {
        const role = process.env.ROLE
        const id = process.env.ID
        const userId = Number(id)

        const data = await getBookingsByRole({role, userId})

        console.log({data})
    })
})

describe("getDetailsBooking", () => {
    it("get details booking", async () => {
        const id = process.env.ID

        const data = await getDetailsBooking(id)

        console.log({data})
    })
})

describe("getAllHistoryBooking", () => {
    it("get all history booking", async () => {
        const id = process.env.ID

        const data = await getAllHistoryStatusBooking(id)

        console.log({data})
    })
})