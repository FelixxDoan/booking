import type { NextFunction, Request, Response } from "express";
import type { ZodSchema, ZodIssue } from "zod";

const formatZodIssues = (issues: ZodIssue[]) => {
  return issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
};

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errCode: "VALIDATION_ERROR",
        errors: formatZodIssues(result.error.issues),
      });
    }

    next();
  };
