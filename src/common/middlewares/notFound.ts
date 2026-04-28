import { RequestHandler } from "express";


export const notFoundMiddleware: RequestHandler = (req, res, next) => {
  const error = new Error("Not found") as Error &{statusCode? :number}
  error.statusCode = 404
  return next(error)
}