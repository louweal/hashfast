export default defineNuxtRouteMiddleware(async (to) => {
    const publicPages = ["/", "/login", "/register"];

    if (publicPages.includes(to.path)) return;

    try {
        const { data } = await useFetch("/api/auth/me", {
            server: true,
        });

        if (!data.value?.user) {
            return navigateTo("/login");
        }
    } catch {
        return navigateTo("/login");
    }
});
