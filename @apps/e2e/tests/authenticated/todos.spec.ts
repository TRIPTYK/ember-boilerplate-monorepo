import { unique } from "../../fixtures/seed.ts";
import { expect, test } from "../../fixtures/test.ts";

/**
 * Todos CRUD against the real API. The e2e seeder creates no todo, so every test
 * brings its own data and the list is never asserted as a whole.
 */
test.describe("todos list", () => {
  test("shows the empty state when a search matches nothing", async ({ todosPage }) => {
    await todosPage.goto();

    await todosPage.table.search(unique("no-such-todo"));

    await expect(todosPage.table.emptyMessage).toBeVisible();
  });

  test("shows a todo created through the API", async ({ api, todosPage }) => {
    const title = unique("Listed");
    const todo = await api.createTodo({ title, description: "created through the API" });

    await todosPage.goto();
    await todosPage.table.search(title);

    await expect(todosPage.table.row(todo.id)).toContainText("created through the API");
    await expect(todosPage.completedCheckbox(todo.id)).not.toBeChecked();
  });
});

test.describe("todo creation", () => {
  test("creates a todo and shows it in the list", async ({ page, todosPage, todoForm, flash }) => {
    const title = unique("Created");

    await todosPage.goto();
    await todosPage.startCreate();
    await expect(page).toHaveURL("/todos/create");

    await todoForm.fill({ title, description: "written through the form" });
    await todoForm.submit();

    await expect(page).toHaveURL("/todos");
    await expect(flash.success).toContainText("Todo saved successfully.");

    await todosPage.table.search(title);
    const id = await todosPage.table.idOfRowWith(title);
    await expect(todosPage.table.row(id)).toContainText("written through the form");

    // Leave the database as we found it.
    await todosPage.startDelete(id);
    await todosPage.deleteModal.confirm();
    await expect(todosPage.table.row(id)).toHaveCount(0);
  });

  test("requires a title", async ({ page, todoForm }) => {
    await todoForm.gotoCreate();
    await todoForm.fill({ description: "no title given" });
    await todoForm.submit();

    await expect(page).toHaveURL("/todos/create");
    await expect(todoForm.errorsFor("title")).toContainText("Title is required");
  });
});

test.describe("todo edition", () => {
  test("updates a todo and reflects it in the list", async ({ page, api, todosPage, todoForm }) => {
    const todo = await api.createTodo({ title: unique("Before"), description: "before" });
    const newTitle = unique("After");

    await todoForm.gotoEdit(todo.id);

    await expect(todoForm.title).toHaveValue(todo.title);

    await todoForm.fill({ title: newTitle, description: "after" });
    await todoForm.submit();

    await expect(page).toHaveURL("/todos");
    await todosPage.table.search(newTitle);
    await expect(todosPage.table.row(todo.id)).toContainText("after");
  });

  test("toggles the completed flag from the row action menu", async ({ api, todosPage }) => {
    const title = unique("Toggle");
    const todo = await api.createTodo({ title, description: "toggle me", completed: false });

    await todosPage.goto();
    await todosPage.table.search(title);
    await expect(todosPage.completedCheckbox(todo.id)).not.toBeChecked();

    await todosPage.toggleCompleted(todo.id);

    await expect(todosPage.completedCheckbox(todo.id)).toBeChecked();
  });
});

test.describe("todo deletion", () => {
  test("deletes a todo once the modal is confirmed", async ({ api, todosPage, flash }) => {
    const title = unique("Doomed");
    const todo = await api.createTodo({ title, description: "delete me" });

    await todosPage.goto();
    await todosPage.table.search(title);
    await todosPage.startDelete(todo.id);

    await expect(todosPage.deleteModal.question).toContainText("Are you sure");
    await todosPage.deleteModal.confirm();

    await expect(todosPage.table.row(todo.id)).toHaveCount(0);
    await expect(flash.success).toContainText("Todo deleted successfully.");
  });

  test("keeps the todo when the modal is cancelled", async ({ api, todosPage }) => {
    const title = unique("Spared");
    const todo = await api.createTodo({ title, description: "keep me" });

    await todosPage.goto();
    await todosPage.table.search(title);
    await todosPage.startDelete(todo.id);
    await todosPage.deleteModal.cancel();

    await expect(todosPage.table.row(todo.id)).toBeVisible();
  });
});
