import handleRespone, { ok } from "@common/utils/response.js";
import { getAllTutorsService, getTutorByIdService } from "./tutor.service.js";


export const getAllTutorsController = handleRespone(async (req, res) => {
    const { data, message } = await getAllTutorsService();

    ok(res, data, message);
});  

export const getTutorByIdController = handleRespone(async (req, res) => {
    const tutorId = parseInt(req.params.id);
    const { data, message } = await getTutorByIdService(tutorId);

    ok(res, data, message);
});