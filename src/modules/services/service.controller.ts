import handleRespone, { created, ok } from "../../common/utils/response.js";
import { createService, getDetailService, getAllAdminServices, getAllServices, updateService } from "./service.service.js";

export const getAllController = handleRespone(async (req, res) => {
  const { data, message } = await getAllServices();
  ok(res, data, message);
});

export const getAllAdminController = handleRespone(async (req, res) => {
  const { data, message } = await getAllAdminServices();
  ok(res, data, message);
});

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

export const updateController = handleRespone(async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  const { data, message } = await updateService({ body: { id, ...body } });

  ok(res, data, message);

});

export const detailController = handleRespone(async (req, res) => {
  const { id } = req.params;

  const { data, message } = await getDetailService(id);

  ok(res, data, message);
});
