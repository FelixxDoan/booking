export const authDocs = {
  "/auth/register": {
    post: {
      tags: ["Auth"],
      summary: "Register a new user",
      description: "Create a new student account.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["fullName", "email", "password"],
              properties: {
                fullName: {
                  type: "string",
                  maxLength: 100,
                  example: "Nguyen Van A",
                },
                email: {
                  type: "string",
                  format: "email",
                  maxLength: 255,
                  example: "student@example.com",
                },
                password: {
                  type: "string",
                  format: "password",
                  minLength: 8,
                  maxLength: 72,
                  example: "password123",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "User registered successfully",
          content: {
            "application/json": {
              example: {
                success: true,
                data: {
                  id: "user_id",
                  fullName: "Nguyen Van A",
                  email: "student@example.com",
                  role: "STUDENT",
                },
                message: "Register success",
              },
            },
          },
        },
        400: {
          description: "Validation error",
        },
        409: {
          description: "Email already exists",
        },
      },
    },
  },

  "/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Login user",
      description: "Authenticate user and return access token.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  maxLength: 255,
                  example: "student@example.com",
                },
                password: {
                  type: "string",
                  format: "password",
                  minLength: 8,
                  maxLength: 72,
                  example: "password123",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Login successful",
          content: {
            "application/json": {
              example: {
                success: true,
                data: {
                  user: {
                    id: "user_id",
                    fullName: "Nguyen Van A",
                    email: "student@example.com",
                    role: "STUDENT",
                  },
                  accessToken: "jwt_token_here",
                },
                message: "Login success",
              },
            },
          },
        },
        400: {
          description: "Validation error",
        },
        401: {
          description: "Invalid email or password",
        },
      },
    },
  },

  "/auth/me": {
    get: {
      tags: ["Auth"],
      summary: "Get current authenticated user",
      description: "Return the current user from the provided JWT token.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Current user returned successfully",
          content: {
            "application/json": {
              example: {
                success: true,
                data: {
                  id: "user_id",
                  fullName: "Nguyen Van A",
                  email: "student@example.com",
                  role: "STUDENT",
                },
                message: "Get me success",
              },
            },
          },
        },
        401: {
          description: "Missing or invalid token",
        },
        403: {
          description: "Unauthenticated user",
        },
      },
    },
  },
};