import { describe, it } from 'vitest';
import { deleteUser, findUserByEmail, getAllUsers } from "../src/modules/users/user.repository"
import { getWorkingHoursService } from "../src/modules/availability/avavlability.service"
import { getAllBookings } from '../src/modules/bookings/booking.repository'

import { prisma } from '../src/config/db';

describe('getAllUsers', () => {
    it('all user', async () => {
        const data = await getAllUsers()
        console.log({ data })
    })
}
)

describe('delUser', () => {
    it('del user', async () => {
        const id = process.env.ID
        const data = await deleteUser(id)
        console.log({ data })
    })
})

describe("updateUser", () => {
    it("update user", async () => {
        const id = process.env.ID
        const role = process.env.ROLE

        const data = await prisma.user.update({
            where: {
                id: Number(id),
            },
            data: {
                role
            }
        })

        console.log({ data })
    })
})

describe("getAllWorkingHours", () => {
    it("get all working hours", async () => {
        const { data } = await getWorkingHoursService()
        console.log({ data })
    })
})

describe("getAllBookings", () => {
    it("Get all bookings", async () => {
        const data = await getAllBookings()
        console.log("bookings: ", data)
    })
})

describe("getDetailsUser", () =>{
    it('get details user', async () => {
        const email = process.env.EMAIL
        const {studentBookings: data} = await findUserByEmail(email)
        console.log({data})
    })
})