import { authDocs } from "./auth.docs.js";

export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Tutor Booking API",
    version: "1.0.0",
    description: "API documentation for Tutor Booking & Lesson Management App",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Local API server",
    },
  ],
  tags: [
    {
      name: "Auth",
      description: "Authentication endpoints",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    ...authDocs,
  },
};