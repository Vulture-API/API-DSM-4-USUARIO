import type { FastifyInstance } from "fastify";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { buildApp } from "@/app.js";
import { FakeRoleRepository } from "@/modules/roles/testing/fake-role.repository.js";
import { FakeUserRepository } from "@/modules/users/testing/fake-repositories.js";

describe("App Health & System Endpoints", () => {
  let app: FastifyInstance;

  beforeEach(() => {
    app = buildApp({
      userRepository: new FakeUserRepository(),
      roleRepository: new FakeRoleRepository(),
    });
  });

  afterEach(async () => {
    await app.close();
  });

  it("responde GET /health com status ok", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/health",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: "ok" });
  });

  it("responde GET /api/health com status ok", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/health",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: "ok" });
  });
});
