import handleRespone, { created } from "../../common/utils/response.js";
import { createService } from "./service.service.js";

export const createController = handleRespone(async (req, res) => {
  const {
    code,
    name,
    subject,
    description,
    durationMinutes,
    price,
    level,
    mode,
    isActive,
  } = req.body;

  const { data, message } = await createService({
    code,
    name,
    subject,
    description,
    durationMinutes,
    price,
    level,
    mode,
    isActive,
  });

  created(res, data, message);
});
