import { NextRequest } from "next/server";
import prisma from "@/db/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import {
  createResponse,
  createErrorResponse,
  HttpStatus,
} from "@/utils/api/apiResponse";

/**
 * @description Обновление списка задач пользователя
 * @route PUT /api/task-lists/:id
 * @headers {Authorization} Bearer token - Токен авторизации
 * @param {string} id - ID списка задач (URL параметр)
 * @body {string} title - Новое название списка (обязательное)
 * @returns {{
 *   id: number,
 *   title: string,
 *   userId: number,
 *   createdAt: string,
 *   updatedAt: string
 * }} Обновленный список задач
 * @throws {401} Требуется авторизация
 * @throws {400} Не указано название списка (title)
 * @throws {404} Список задач не найден или не принадлежит пользователю
 * @throws {500} Внутренняя ошибка сервера
 * @example
 * // Запрос:
 * {
 *   "title": "Обновленное название списка"
 * }
 * // Ответ:
 * {
 *   "id": 1,
 *   "title": "Обновленное название списка",
 *   "userId": 123,
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

    const { title } = await req.json();
    if (!title) {
      return createErrorResponse(
        "Необходимо указать title",
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      const updated = await prisma.taskList.update({
        where: {
          id: Number(params.id),
          userId: user.userId,
        },
        data: { title },
      });

      return createResponse(updated, HttpStatus.OK);
    } catch (error) {
      console.error("TaskList not found:", error);
      return createErrorResponse(
        "Список задач не найден",
        HttpStatus.NOT_FOUND
      );
    }
  } catch (error) {
    console.error("TaskList update error:", error);
    return createErrorResponse(
      "Internal Server Error",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

/**
 * @description Удаление списка задач пользователя
 * @route DELETE /api/task-lists/:id
 * @headers {Authorization} Bearer token - Токен авторизации
 * @param {string} id - ID списка задач (URL параметр)
 * @returns {null}
 * @throws {401} Требуется авторизация
 * @throws {404} Список задач не найден или не принадлежит пользователю
 * @throws {500} Внутренняя ошибка сервера
 * @example
 * // Ответ:
 * {
 *   "success": true,
 *   "error": null,
 *   "data": null,
 *   "status": 204
 * }
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

    try {
      await prisma.taskList.delete({
        where: {
          id: Number(params.id),
          userId: user.userId,
        },
      });

      return createResponse(null, HttpStatus.OK);
    } catch (error) {
      console.error("TaskList delete error:", error);
      return createErrorResponse(
        "Список задач не найден",
        HttpStatus.NOT_FOUND
      );
    }
  } catch (error) {
    console.error("TaskList delete internal error:", error);
    return createErrorResponse(
      "Internal Server Error",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
