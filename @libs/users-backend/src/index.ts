import { UserEntity } from "#src/entities/user.entity.js";

export * from "#src/entities/user.entity.js";
export * from "#src/routes/create.route.js";
export * from "#src/routes/delete.route.js";
export * from "#src/routes/get.route.js";
export * from "#src/routes/list.route.js";
export * from "#src/routes/profile.route.js";
export * from "#src/routes/update.route.js";
export * from "#src/serializers/user.serializer.js";
export * from "#src/init.js";

export const entities = [UserEntity];
