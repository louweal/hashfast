// server/api/links.get.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const { authorId } = getQuery(event) as { authorId?: string };

    try {
        const links = await prisma.link.findMany({
            where: authorId ? { authorId } : undefined,
            orderBy: { createdAt: "desc" }, // to do: order by last payment
            include: { author: true, payments: true }, // join author info (optional)
        });

        return links; // Nuxt serialises to JSON
    } catch (e) {
        console.error(e);
        return createError({ statusCode: 400, message: "Link query failed" });
    }
});
