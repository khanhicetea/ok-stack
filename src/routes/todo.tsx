import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { orpc } from "@/orpc/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/todo")({
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(
      context.orpc.todo.getTodos.queryOptions()
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const [title, setTitle] = useState("");
  const queryClient = useQueryClient();
  const { data: todos } = useQuery(orpc.todo.getTodos.queryOptions());
  const addTodo = useMutation(
    orpc.todo.createTodo.mutationOptions({
      onSuccess: (data) => {
        queryClient.setQueryData(orpc.todo.getTodos.queryKey(), data.todos);
      },
    })
  );

  return (
    <div className="flex flex-col gap-2 p-4">
      <ul className="flex flex-col gap-2">
        {todos?.map((todo) => (
          <li key={todo.id} className="p-2 border rounded">
            {todo.title}
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Add todo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button
          type="button"
          onClick={() => addTodo.mutate({ title, description: "test" })}
        >
          Add
        </Button>
      </div>
    </div>
  );
}
