export default defineNuxtRouteMiddleware(async (to) => {
    console.log("🚀 Global middleware running");

    const publicPages = ["/", "/login", "/register"];

    if (publicPages.includes(to.path)) return;

    if (to.path.startsWith("/link/view/")) {
        return;
    }

    try {
        const { data } = await useFetch("/api/auth/me", {
            credentials: "include",
            server: true,
        });

        if (!data.value?.user) {
            return navigateTo("/login");
        }
    } catch {
        console.error("Failed to fetch user");
        return navigateTo("/login");
    }
});
