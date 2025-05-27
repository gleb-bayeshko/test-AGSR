import { NextRequest } from "next/server";
import prisma from "@/db/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import {
  createResponse,
  createErrorResponse,
  HttpStatus,
} from "@/utils/api/apiResponse";

/**
 * @description Получение всех списков задач пользователя с вложенными задачами
 * @route GET /api/task-lists
 * @headers {Authorization} Bearer token - Токен авторизации
 * @returns {Array<{
 *   id: number,
 *   title: string,
 *   userId: number,
 *   createdAt: string,
 *   updatedAt: string,
 *   tasks: Array<{
 *     id: number,
 *     title: string,
 *     description: string | null,
 *     status: "PENDING" | "IN_PROGRESS" | "DONE",
 *     dueAt: string | null,
 *     listId: number,
 *     createdAt: string,
 *     updatedAt: string
 *   }>
 * }>} Массив списков задач с задачами
 * @throws {401} Требуется авторизация
 * @throws {500} Внутренняя ошибка сервера
 * @example
 * // Ответ:
 * [{
 *   "id": 1,
 *   "title": "Рабочие задачи",
 *   "userId": 123,
 *   "createdAt": "2023-01-01T00:00:00.000Z",
 *   "updatedAt": "2023-01-01T00:00:00.000Z",
 *   "tasks": [
 *     {
 *       "id": 1,
 *       "title": "Завершить проект",
 *       "description": "Необходимо завершить к пятнице",
 *       "status": "IN_PROGRESS",
 *       "dueAt": "2023-12-31T23:59:59.000Z",
 *       "listId": 1,
 *       "createdAt": "2023-01-01T00:00:00.000Z",
 *       "updatedAt": "2023-01-01T00:00:00.000Z"
 *     }
 *   ]
 * }]
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return createErrorResponse(
        "Требуется авторизация",
        HttpStatus.UNAUTHORIZED
      );
    }

    const lists = await prisma.taskList.findMany({
      where: { userId: user.userId },
      include: { tasks: true },
    });

    return createResponse(lists, HttpStatus.OK);
  } catch (error) {
    console.error("Task Lists get error:", error);
    return createErrorResponse(
      "Internal Server Error",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

/**
 * @description Создание нового списка задач
 * @route POST /api/task-lists
 * @headers {Authorization} Bearer token - Токен авторизации
 * @body {string} title - Название списка задач (обязательное)
 * @returns {{
 *   id: number,
 *   title: string,
 *   userId: number,
 *   createdAt: string,
 *   updatedAt: string
 * }} Созданный список задач
 * @throws {401} Требуется авторизация
 * @throws {400} Не указан title списка
 * @throws {500} Внутренняя ошибка сервера
 * @example
 * // Запрос:
 * {
 *   "title": "Личные задачи"
 * }
 * // Ответ:
 * {
 *   "id": 2,
 *   "title": "Личные задачи",
 *   "userId": 123,
 *   "createdAt": "2023-01-01T00:00:00.000Z",
 *   "updatedAt": "2023-01-01T00:00:00.000Z"
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return createErrorResponse(
        "Требуется авторизация",
        HttpStatus.UNAUTHORIZED
      );
    }

    const { title } = await req.json();

    if (!title) {
      return createErrorResponse(
        "Необходимо указать title",
        HttpStatus.BAD_REQUEST
      );
    }

    const newList = await prisma.taskList.create({
      data: {
        title,
        userId: user.userId,
      },
    });

    return createResponse(newList, HttpStatus.CREATED);
  } catch (error) {
    console.error("Task Lists create error:", error);
    return createErrorResponse(
      "Internal Server Error",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
