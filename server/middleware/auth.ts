import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export default defineEventHandler(async (event) => {
    const publicPaths = ["/", "/login", "/register"];

    const url = getRequestURL(event).pathname;

    if (publicPaths.includes(url)) return;

    if (url.startsWith("/link/view/")) {
        return;
    }

    if (event.path.startsWith("/api/links") && event.method === "GET") {
        return;
    }
    if (event.path.startsWith("/api/users") && event.method === "GET") {
        return;
    }

    if (event.path.startsWith("/api/auth") && event.method === "GET") {
        console.log("allow GET /api/auth");
        return;
    }

    const token = getCookie(event, "auth_token");
    if (!token) {
        // throw createError({ statusCode: 401, message: "Unauthorized!" });

        return sendRedirect(event, "/login", 302);
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        event.context.user = decoded;
    } catch (err) {
        throw createError({ statusCode: 401, message: "Invalid or expired token" });
    }
});
