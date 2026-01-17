import { initTRPC, TRPCError, type AnyProcedure } from "@trpc/server";
import superjson from "superjson";
import type { Context } from "./context.js";
import { verifyToken } from "./utils/auth.js";
import type { User } from "@prisma/client";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

const isAuthed = t.middleware(async ({ ctx, next }) => {
  const authHeader = ctx.req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Missing or invalid authorization header",
    });
  }

  const token = authHeader.substring(7);

  try {
    const user = await verifyToken(token);
    return next({
      ctx: {
        ...ctx,
        user,
      },
    });
  } catch (error) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid or expired token",
    });
  }
});

export type ProtectedContext = Context & { user: User };

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure: typeof t.procedure = t.procedure.use(
  isAuthed
) as any;
