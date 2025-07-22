export default defineNuxtRouteMiddleware(async (to) => {
    // Public paths that don't require authentication
    const publicPaths = ["/login", "/register", "/"];

    if (publicPaths.includes(to.path) || 1 === 1) {
        // Allow access to public pages
        return;
    }
});
