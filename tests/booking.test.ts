import { describe, it } from 'vitest'

import { getbBookedSlots } from '../src/modules/availability/avavlability.service'

describe("getBookings", () => {
    it('get bookings', async () => {
        const date = process.env.DATE
        const tutorId = process.env.TUTOR_ID
        const serviceId = process.env.SERIVCE_ID

        const data = await getbBookedSlots({ date: new Date(date), tutorId: Number(tutorId), serviceId })

        console.log({ data })
    })


})