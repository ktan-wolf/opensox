import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, type ProtectedContext } from "../trpc.js";
import {
  sessionService,
  AuthorizationError,
} from "../services/session.service.js";

export const sessionsRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userId = (ctx as ProtectedContext).user.id;

    try {
      return await sessionService.getSessions(ctx.db.prisma, userId);
    } catch (error) {
      if (error instanceof AuthorizationError) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: error.message,
        });
      }
      throw error;
    }
  }),
});
