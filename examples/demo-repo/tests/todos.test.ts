// @req RF1
import { createTodo } from "../src/todos";

it("exige título", () => {
  expect(() => createTodo("  ")).toThrow();
});
