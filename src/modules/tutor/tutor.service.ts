import throwErr from "@common/utils/throwError.js";
import { mapTutorDetail, mapTutorListItem } from "./tutor.mapper.js";
import { getAllTurors, getTutorById } from "./tutor.repository.js";


export const getAllTutorsService = async () => {
    const tutors = await getAllTurors();
    const mappedTutors = tutors.map(tutor => mapTutorListItem(tutor));

    return {
        data: mappedTutors,
        message: "Tutors retrieved successfully",
    }
};

export const getTutorByIdService = async (id: number) => {
    const tutor = await getTutorById(id);
    if (!tutor) {
        return throwErr(404, "Tutor not found");
    }

    return {
        data: mapTutorDetail(tutor),
        message: "Tutor retrieved successfully",
    }
};
