import jwt from "jsonwebtoken";
import prisma from "@/db/prisma";
import { TokenPayload } from "@/utils/types/api";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;

/**
 * @description Извлекает и верифицирует пользователя из Authorization заголовка запроса
 * @async
 * @function getUserFromRequest
 * @param {Request} req - Входящий HTTP запрос
 * @returns {Promise<TokenPayload | null>}
 *   - Если успешно: payload JWT токена с данными пользователя
 *   - Если ошибка: null (отсутствует токен, невалидный токен, пользователь не найден)
 * @throws {Error} Ошибки при верификации JWT или запросе к БД
 * @example
 * // Использование:
 * const userPayload = await getUserFromRequest(req);
 * if (!userPayload) {
 *   // Пользователь не авторизован
 * }
 *
 * // Структура TokenPayload:
 * {
 *   userId: number,
 *   email: string, 
 * }
 */
export async function getUserFromRequest(
  req: Request
): Promise<TokenPayload | null> {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) return null;

  try {
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true },
    });

    if (!user) return null;

    return payload;
  } catch (e) {
    console.error("Auth error:", e);
    return null;
  }
}
