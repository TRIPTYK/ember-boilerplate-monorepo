import { SEEDED_USERS, unique, uniqueEmail } from "../../fixtures/seed.ts";
import { expect, test } from "../../fixtures/test.ts";

/**
 * Users CRUD against the real API.
 *
 * Rows a test needs are created through `api` so the test only drives the UI for
 * the behaviour it actually asserts, and are removed on teardown — several tests
 * share one database.
 */
test.describe("users list", () => {
  test("shows the seeded users", async ({ usersPage }) => {
    await usersPage.goto();

    await expect(usersPage.title).toBeVisible();
    await expect(usersPage.table.row(SEEDED_USERS.main.id)).toContainText(
      SEEDED_USERS.main.email,
    );
    for (const user of SEEDED_USERS.others) {
      await expect(usersPage.table.row(user.id)).toContainText(user.email);
    }
  });

  test("filters the list from the search box", async ({ api, usersPage }) => {
    const lastName = unique("Searchable");
    const user = await api.createUser({
      firstName: "Search",
      lastName,
      email: uniqueEmail("search"),
      password: "password123",
    });

    await usersPage.goto();
    await usersPage.table.search(lastName);

    await expect(usersPage.table.rows).toHaveCount(1);
    await expect(usersPage.table.row(user.id)).toContainText(lastName);
  });
});

test.describe("user creation", () => {
  test("creates a user and shows it in the list", async ({ page, usersPage, userForm }) => {
    const email = uniqueEmail("created");

    await usersPage.goto();
    await usersPage.startCreate();
    await expect(page).toHaveURL("/users/create");

    await userForm.fill({
      firstName: "Created",
      lastName: unique("Byform"),
      password: "password123",
      email,
    });
    await userForm.submit();

    await expect(page).toHaveURL("/users");
    const id = await usersPage.table.idOfRowWith(email);
    await expect(usersPage.table.row(id)).toContainText("Created");

    // Leave the database as we found it.
    await usersPage.startDelete(id);
    await usersPage.deleteModal.confirm();
    await expect(usersPage.table.row(id)).toHaveCount(0);
  });

  test("rejects an invalid email without leaving the form", async ({ page, userForm }) => {
    await userForm.gotoCreate();
    await userForm.fill({
      firstName: "Invalid",
      lastName: "Email",
      password: "password123",
      email: "not-an-email",
    });
    await userForm.submit();

    await expect(page).toHaveURL("/users/create");
    await expect(userForm.errorsFor("email")).toContainText("Invalid email address");
  });

  test("rejects a password shorter than the minimum", async ({ page, userForm }) => {
    await userForm.gotoCreate();
    await userForm.fill({
      firstName: "Short",
      lastName: "Password",
      password: "short",
      email: uniqueEmail("short"),
    });
    await userForm.submit();

    await expect(page).toHaveURL("/users/create");
    await expect(userForm.errorsFor("password")).toContainText("Min 8 characters");
  });
});

test.describe("user edition", () => {
  test("updates a user and reflects it in the list", async ({ page, api, usersPage, userForm }) => {
    const user = await api.createUser({
      firstName: "Before",
      lastName: unique("Edit"),
      email: uniqueEmail("edit"),
      password: "password123",
    });
    const newFirstName = unique("After");

    await userForm.gotoEdit(user.id);

    await expect(userForm.firstName).toHaveValue("Before");
    // The edit form intentionally omits the password field.
    await expect(userForm.password).toHaveCount(0);

    await userForm.fill({ firstName: newFirstName });
    await userForm.submit();

    await expect(page).toHaveURL("/users");
    await expect(usersPage.table.row(user.id)).toContainText(newFirstName);
  });

  test("opens the edit form from the row action menu", async ({ page, api, usersPage }) => {
    const user = await api.createUser({
      firstName: "Menu",
      lastName: unique("Edit"),
      email: uniqueEmail("menu"),
      password: "password123",
    });

    await usersPage.goto();
    await usersPage.table.search(user.lastName);
    await usersPage.edit(user.id);

    await expect(page).toHaveURL(`/users/${user.id}/edit`);
  });
});

test.describe("user deletion", () => {
  test("deletes a user once the modal is confirmed", async ({ api, usersPage, flash }) => {
    const user = await api.createUser({
      firstName: "Doomed",
      lastName: unique("Delete"),
      email: uniqueEmail("delete"),
      password: "password123",
    });

    await usersPage.goto();
    await usersPage.startDelete(user.id);

    await expect(usersPage.deleteModal.question).toContainText("Doomed");
    await usersPage.deleteModal.confirm();

    await expect(usersPage.table.row(user.id)).toHaveCount(0);
    await expect(flash.success).toContainText("User deleted successfully.");
  });

  test("keeps the user when the modal is cancelled", async ({ api, usersPage }) => {
    const user = await api.createUser({
      firstName: "Spared",
      lastName: unique("Cancel"),
      email: uniqueEmail("cancel"),
      password: "password123",
    });

    await usersPage.goto();
    await usersPage.startDelete(user.id);
    await usersPage.deleteModal.cancel();

    await expect(usersPage.table.row(user.id)).toBeVisible();
  });
});
