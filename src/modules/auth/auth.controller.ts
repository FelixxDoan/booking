import handleRespone, { created } from "../../common/utils/response.js";
import throwErr from "../../common/utils/throwError.js";
import { registerService } from "./auth.service.js";

export const regiserController = handleRespone(async (req, res) => {
  const { fullName, email, password } = req.body;

  if( !fullName||!email|| !password) throwErr(400, "Missing fields")

  const{ data, message} = await registerService({ fullName, email, password});

  created(res, data, message)
});
