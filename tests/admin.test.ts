import { describe, it } from 'vitest';
import { deleteUser, getAllUsers } from "../src/modules/users/user.repository"
import { prisma } from '../src/config/db';

describe('getAllUsers', () =>{
    it('all user', async () => {
        const data = await getAllUsers()
        console.log({ data })
    })}
)

describe('delUser',
    it('del user', async () => {
        const id = process.env.ID
        const data = await deleteUser(id)
        console.log({ data })
    })
)

describe("updateUser", () => {
    it("update user", async() => {
        const id = process.env.ID
        const role = process.env.ROLE

        const data = await prisma.user.update({
            where : {
                id: Number(id),
            },
            data: {
                role
            }
        })

        console.log({data})
    })
})