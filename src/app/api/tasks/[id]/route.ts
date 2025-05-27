import { NextRequest } from "next/server";
import prisma from "@/db/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import {
  createResponse,
  createErrorResponse,
  HttpStatus,
} from "@/utils/api/apiResponse";

/**
 * @description Обновление существующей задачи
 * @route PUT /api/tasks/:id
 * @headers {Authorization} Bearer token - Токен авторизации
 * @param {string} id - ID задачи (URL параметр, преобразуется в number)
 * @body {string} [title] - Новое название задачи
 * @body {string} [description] - Новое описание задачи (null для очистки)
 * @body {"PENDING"|"IN_PROGRESS"|"DONE"} [status] - Новый статус задачи
 * @body {string} [dueAt] - Новый срок выполнения (ISO-строка или null для очистки)
 * @returns {{
 *   id: number,
 *   title: string,
 *   description: string | null,
 *   status: "PENDING" | "IN_PROGRESS" | "DONE",
 *   dueAt: string | null,
 *   listId: number,
 *   createdAt: string,
 *   updatedAt: string
 * }} Обновленная задача
 * @throws {401} Требуется авторизация
 * @throws {404} Задача не найдена или не принадлежит пользователю
 * @throws {400} Ошибка валидации данных
 * @throws {500} Внутренняя ошибка сервера
 * @example
 * // Запрос:
 * {
 *   "title": "Обновленное название",
 *   "status": "DONE",
 *   "description": null
 * }
 * // Ответ:
 * {
 *   "id": 123,
 *   "title": "Обновленное название",
 *   "description": null,
 *   "status": "DONE",
 *   "dueAt": "2023-12-31T23:59:59.000Z",
 *   "listId": 1,
 *   "createdAt": "2023-01-01T00:00:00.000Z",
 *   "updatedAt": "2023-01-02T00:00:00.000Z"
 * }
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return createErrorResponse(
        "Требуется авторизация",
        HttpStatus.UNAUTHORIZED
      );
    }

    const taskId = Number(params.id);
    const { title, description, status, dueAt } = await req.json();

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { list: true },
    });

    if (!task || task.list.userId !== user.userId) {
      return createErrorResponse("Задача не найдена", HttpStatus.NOT_FOUND);
    }

    try {
      const updated = await prisma.task.update({
        where: { id: taskId },
        data: {
          title,
          description,
          status,
          dueAt: dueAt ? new Date(dueAt) : null,
        },
      });

      return createResponse(updated, HttpStatus.OK);
    } catch (error) {
      console.error("Task update error:", error);
      return createErrorResponse(
        "Ошибка обновления задачи",
        HttpStatus.BAD_REQUEST
      );
    }
  } catch (error) {
    console.error("Task update error:", error);
    return createErrorResponse(
      "Internal Server Error",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

/**
 * @description Удаление существующей задачи
 * @route DELETE /api/tasks/:id
 * @headers {Authorization} Bearer token - Токен авторизации
 * @param {string} id - ID задачи (URL параметр, преобразуется в number)
 * @returns {null} No Content
 * @throws {401} Требуется авторизация
 * @throws {404} Задача не найдена
 * @throws {500} Внутренняя ошибка сервера
 * @example
 * // Успешный ответ:
 * HTTP 204 No Content
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return createErrorResponse(
        "Требуется авторизация",
        HttpStatus.UNAUTHORIZED
      );
    }

    const taskId = Number(params.id);

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { list: true },
    });

    console.log(task);

    if (!task || task.list.userId !== user.userId) {
      return createErrorResponse("Задача не найдена", HttpStatus.NOT_FOUND);
    }

    await prisma.task.delete({ where: { id: taskId } });

    return createResponse(null, HttpStatus.OK);
  } catch (error) {
    console.error("Task delete error:", error);
    return createErrorResponse(
      "Internal Server Error",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
