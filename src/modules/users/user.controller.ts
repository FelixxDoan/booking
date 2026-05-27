import handleRespone, { created } from "@common/utils/response.js"
import { createTutorService } from "./user.service.js"


export const meController = () => {

}

export const createTutorController = handleRespone(async (req, res) => {
    const { userProfile, tutorProfile } = req.body

    const { data, message } = await createTutorService({ userProfile, tutorProfile })

    created(res, data, message)
})