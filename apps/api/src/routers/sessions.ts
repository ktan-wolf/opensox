import { router, protectedProcedure } from "../trpc.js";
import { sessionService } from "../services/session.service.js";

export const sessionsRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }: any) => {
    const userId = ctx.user.id;
    return await sessionService.getSessions(ctx.db.prisma, userId);
  }),
});
