import { NextRequest } from "next/server";
import prisma from "@/db/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import {
  createResponse,
  createErrorResponse,
  HttpStatus,
} from "@/utils/api/apiResponse";

/**
 * @description Создание новой задачи в указанном списке
 * @route POST /api/tasks
 * @headers {Authorization} Bearer token - Токен авторизации
 * @body {string} title - Название задачи (обязательное)
 * @body {number} listId - ID списка задач (обязательное)
 * @body {string} [description] - Описание задачи
 * @body {"PENDING"|"IN_PROGRESS"|"DONE"} [status=PENDING] - Статус задачи
 * @body {string} [dueAt] - Срок выполнения (ISO-строка)
 * @returns {{
 *   id: number,
 *   title: string,
 *   description: string | null,
 *   status: "PENDING" | "IN_PROGRESS" | "DONE",
 *   dueAt: string | null,
 *   listId: number,
 *   createdAt: string,
 *   updatedAt: string
 * }} Созданная задача
 * @throws {401} Требуется авторизация
 * @throws {400} Не указаны title и/или listId
 * @throws {404} Список задач не найден или не принадлежит пользователю
 * @throws {500} Внутренняя ошибка сервера
 * @example
 * // Запрос:
 * {
 *   "title": "Новая задача",
 *   "listId": 1,
 *   "description": "Описание задачи",
 *   "status": "IN_PROGRESS",
 *   "dueAt": "2023-12-31T23:59:59Z"
 * }
 * // Ответ:
 * {
 *   "id": 1,
 *   "title": "Новая задача",
 *   "description": "Описание задачи",
 *   "status": "IN_PROGRESS",
 *   "dueAt": "2023-12-31T23:59:59.000Z",
 *   "listId": 1,
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

    const { title, description, status, dueAt, listId } = await req.json();

    if (!title || !listId) {
      return createErrorResponse(
        "Укажите title и listId",
        HttpStatus.BAD_REQUEST
      );
    }

    const list = await prisma.taskList.findFirst({
      where: { id: listId, userId: user.userId },
    });

    if (!list) {
      return createErrorResponse("Список не найден", HttpStatus.NOT_FOUND);
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        dueAt: dueAt ? new Date(dueAt) : null,
        listId,
      },
    });

    return createResponse(task, HttpStatus.CREATED);
  } catch (error) {
    console.error("Task creation error:", error);
    return createErrorResponse(
      "Internal Server Error",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
