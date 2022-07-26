<template>
    <p class="text-3xl text-center mb-1 font-black drop-shadow-lg">
        {{ normalizeTime(time) }}
    </p>
</template>

<script>
export default {
    name: 'BaseTimer',
    data() {
        return {
            time: new Date(Date.now()),
        };
    },
    methods: {
        timer() {
            this.time = new Date(Date.now());
        },

        normalizeTime(date) {
            return date.toLocaleString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
            });
        },
    },
    mounted() {
        setInterval(this.timer, 1000 * 60);
    },
};
</script>

<style scoped></style>
