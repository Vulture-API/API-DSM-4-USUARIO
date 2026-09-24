import "@/config/zod.config.js";

import cookie from "@fastify/cookie";
import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";

import { handleError } from "@/errors/error-handler.js";
import {
  RoleRepository,
  type RoleRepositoryPort,
} from "@/modules/roles/repositories/role.repository.js";
import { roleRoutes } from "@/modules/roles/routes/roles.route.js";
import {
  UserRepository,
  type UserRepositoryPort,
} from "@/modules/users/repositories/user.repository.js";
import { userRoutes } from "@/modules/users/routes/users.route.js";
import type { PasswordHasher } from "@/modules/users/services/password-hasher.js";

export type BuildAppOptions = {
  userRepository?: UserRepositoryPort;
  roleRepository?: RoleRepositoryPort;
  passwordHasher?: PasswordHasher;
};

export function buildApp(options: BuildAppOptions = {}) {
  const app = Fastify({
    logger: false,
  }).withTypeProvider<ZodTypeProvider>();
  const userRepository = options.userRepository ?? new UserRepository();
  const roleRepository = options.roleRepository ?? new RoleRepository();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.setErrorHandler(handleError);

  app.register(cookie);
  app.get("/health", async () => ({ status: "ok" }));
  app.get("/api/health", async () => ({ status: "ok" }));
  app.register(userRoutes, {
    prefix: "/api/users",
    userRepository,
    roleRepository,
    ...(options.passwordHasher
      ? { passwordHasher: options.passwordHasher }
      : {}),
  });
  app.register(roleRoutes, {
    prefix: "/api/roles",
    roleRepository,
  });

  return app;
}
