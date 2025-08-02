<template>
    <main>
        <Header />

        <Hero-Home />

        <!-- <section class="section">
            <div class="container">this is a section</div>
        </section> -->

        <!-- <Footer /> -->
    </main>
</template>

<script setup>
const { user, loading, error, isLoggedIn, fetchUser, logout } = useAuth();

// if (process.client) {
await fetchUser();
// }

if (user.value) {
    navigateTo("/dashboard/links");
}

useHead({
    title: "HashFast",
});
</script>
