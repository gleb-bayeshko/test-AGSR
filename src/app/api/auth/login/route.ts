import prisma from "@/db/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createResponse,
  createErrorResponse,
  HttpStatus,
} from "@/utils/api/apiResponse";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

/**
 * @description Аутентификация пользователя и выдача токенов.
 * @route POST /api/users/auth/login
 * @body {string} email - Email пользователя
 * @body {string} password - Пароль пользователя
 * @returns {object}
 *   - accessToken: JWT-токен (действует 15 минут)
 *   - refreshToken: JWT-токен для обновления (действует 7 дней)
 *   - user: { id: string, email: string }
 * @throws {404} Пользователь не найден
 * @throws {400} Неверный логин или пароль
 * @throws {500} Внутренняя ошибка сервера
 * @example
 * // Запрос:
 * {
 *   "email": "user@example.com",
 *   "password": "securepassword123"
 * }
 * // Ответ:
 * {
 *   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "user": { "id": "1", "email": "user@example.com" }
 * }
 */
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return createErrorResponse(
        "Пользователь не найден",
        HttpStatus.NOT_FOUND
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return createErrorResponse(
        "Неверный логин или пароль",
        HttpStatus.BAD_REQUEST
      );
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
      },
    });

    return createResponse(
      {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
        },
      },
      HttpStatus.OK
    );
  } catch (error) {
    console.error("Login error:", error);
    return createErrorResponse(
      "Internal Server Error",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
