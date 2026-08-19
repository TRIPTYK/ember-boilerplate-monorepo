import { RequestContext, type EntityManager } from "@mikro-orm/core";
import type { FastifyInstance } from "fastify";

/**
 * Ouvre un RequestContext MikroORM par requête : chaque requête obtient son propre
 * EntityManager forké (identity map + unit of work isolés), partagé par toutes les libs.
 *
 * `em` DOIT être l'EntityManager racine (`orm.em`) : un fork a `useContext: false` et
 * ne résoudrait jamais le contexte.
 */
export function registerRequestContext(fastify: FastifyInstance, em: EntityManager): void {
  if (!em.global) {
    throw new Error(
      "registerRequestContext expects the root `orm.em`, not a fork — a fork never resolves the RequestContext.",
    );
  }

  fastify.addHook("onRequest", (_request, _reply, done) => {
    RequestContext.create(em, done);
  });
}
