const throwErr = (statusCode: number, message: string): never => {
  const e = new Error(message) as Error & { statusCode?: number };
  e.statusCode = statusCode;
  throw e;
};

export default throwErr;
