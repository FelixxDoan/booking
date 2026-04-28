import { RequestHandler, Response } from "express";

type SuccessBody<T> = {
  success: true;
  data?: T;
  message?: string;
};

const buildBody = <T>(data: T, message?: string): SuccessBody<T> => ({
  success: true,
  data,
  ...(message ? { message } : {}),
});

export const ok = <T>(res: Response, data: T, message?: string) => {
  return res.status(200).json(buildBody(data, message));
};

export const created = <T>(res: Response, data: T, message?: string) => {
  return res.status(201).json(buildBody(data, message));
};

export const accepted = <T>(res: Response, data: T, message?: string) => {
  return res.status(202).json(buildBody(data, message));
};

export const noContent = <T>(res: Response) => {
  return res.status(204).send();
};

const handleRespone =
  (controller: RequestHandler): RequestHandler =>
  async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

export default handleRespone;
