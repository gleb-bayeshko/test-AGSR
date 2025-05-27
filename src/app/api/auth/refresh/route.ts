import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "@/db/prisma";
import {
  createResponse,
  createErrorResponse,
  HttpStatus,
} from "@/utils/api/apiResponse";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";
const REFRESH_TOKEN_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * @description Обновление пары токенов доступа (access + refresh)
 * @route POST /api/users/auth/refresh
 * @body {string} refreshToken - Токен для обновления (из кук или тела запроса)
 * @returns {object}
 *   - accessToken: Новый JWT-токен (действует 15 минут)
 *   - refreshToken: Новый JWT-токен для обновления (действует 7 дней)
 * @throws {400}
 *   - Необходимо указать refreshToken
 *   - Невалидный payload токена
 *   - Невалидный refreshToken
 *   - Сессия истекла
 * @throws {404} Сессия не найдена
 * @throws {500} Внутренняя ошибка сервера
 * @example
 * // Запрос:
 * {
 *   "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 * // Ответ:
 * {
 *   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();

    if (!refreshToken) {
      return createErrorResponse(
        "Необходимо указать refreshToken",
        HttpStatus.BAD_REQUEST
      );
    }

    let payload: JwtPayload;
    try {
      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
      if (typeof decoded === "string" || !("userId" in decoded)) {
        return createErrorResponse(
          "Невалидный payload",
          HttpStatus.BAD_REQUEST
        );
      }
      payload = decoded as JwtPayload;
    } catch (error) {
      console.error("JWT verification error:", error);
      return createErrorResponse(
        "Невалидный refreshToken",
        HttpStatus.BAD_REQUEST
      );
    }

    const session = await prisma.session.findFirst({
      where: {
        refreshToken,
        userId: payload.userId,
      },
      include: { user: true },
    });

    if (!session) {
      return createErrorResponse("Сессия не найдена", HttpStatus.NOT_FOUND);
    }

    if (new Date() > session.expiresAt) {
      await prisma.session.delete({ where: { id: session.id } });
      return createErrorResponse("Сессия истекла", HttpStatus.BAD_REQUEST);
    }

    await prisma.session.delete({ where: { id: session.id } });

    const accessToken = jwt.sign(
      {
        userId: session.user.id,
        email: session.user.email,
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    const newRefreshToken = jwt.sign(
      { userId: session.user.id },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    await prisma.session.create({
      data: {
        userId: session.user.id,
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS),
      },
    });

    return createResponse(
      {
        accessToken,
        refreshToken: newRefreshToken,
      },
      HttpStatus.OK
    );
  } catch (error) {
    console.error("Refresh error:", error);
    return createErrorResponse(
      "Internal Server Error",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
