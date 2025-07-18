import { db } from "@/db";
import { os, call } from "@orpc/server";
import { authMiddleware } from "./middlewares";
import z from "zod";
import { todo } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const baseOS = os.$context<{ headers: Headers }>();

const getTodos = baseOS.use(authMiddleware).handler(async ({ context }) => {
  const todos = await db.query.todo.findMany({
    limit: 10,
    orderBy: (todo, { desc }) => [desc(todo.createdAt)],
    where: (todo, { eq }) => eq(todo.userId, context.user.id),
  });
  return todos;
});

const createTodo = baseOS
  .use(authMiddleware)
  .input(z.object({ title: z.string(), description: z.string() }))
  .handler(async ({ context, input }) => {
    try {
      const [newTodo] = await db
        .insert(todo)
        .values({
          id: crypto.randomUUID(),
          title: input.title,
          userId: context.user.id,
          description: input.description,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return { newTodo, todos: await call(getTodos, {}, { context }) };
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

const updateTodo = baseOS
  .use(authMiddleware)
  .input(
    z.object({ id: z.string(), title: z.string(), description: z.string() })
  )
  .handler(async ({ context, input }) => {
    const [updatedTodo] = await db
      .update(todo)
      .set({
        title: input.title,
        description: input.description,
        updatedAt: new Date(),
      })
      .where(and(eq(todo.id, input.id), eq(todo.userId, context.user.id)))
      .returning();

    return updatedTodo;
  });

const deleteTodo = baseOS
  .use(authMiddleware)
  .input(z.object({ id: z.string() }))
  .handler(async ({ context, input }) => {
    const [deletedTodo] = await db
      .delete(todo)
      .where(and(eq(todo.id, input.id), eq(todo.userId, context.user.id)))
      .returning();

    return deletedTodo;
  });

export const todoRouter = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
