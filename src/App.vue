<template>
    <div
        class="main w-full h-screen bg-green flex py-[10vh] justify-center bg-green-600 text-white"
    >
        <div>
            <!--            <div>
                <router-link to="/">Home</router-link>
                |
                <router-link to="/about">About</router-link>
            </div>-->

            <router-view />
        </div>
    </div>
</template>

<style scoped>
.main {
    background-image: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.2),
            rgba(0, 0, 0, 0.85)
        ),
        url('~@/assets/img/bg.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
}
</style>
