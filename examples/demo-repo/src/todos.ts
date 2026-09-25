// @req RF1 RF2
export interface Todo { id: number; title: string }
const todos: Todo[] = [];

export function createTodo(title: string): Todo {
  if (!title.trim()) throw new Error("título obrigatório");
  const todo = { id: todos.length + 1, title };
  todos.push(todo);
  return todo;
}

export function listTodos(): Todo[] {
  return [...todos];
}
