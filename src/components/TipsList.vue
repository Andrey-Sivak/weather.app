<template>
    <div
        class="absolute left-0 top-full w-full mt-2 bg-white/80 shadow-md rounded overflow-hidden"
        v-if="tips.length"
    >
        <p
            class="w-full py-2 cursor-pointer border-b last:border-none border-solid border-black/30 text-black/70 px-4 hover:bg-white"
            v-for="(tip, idx) in tips"
            :key="idx"
            @click="selectListItem(tip)"
        >
            {{ tip.name }} | {{ tip.state }}({{ tip.country }})
        </p>
    </div>
</template>

<script>
export default {
    name: 'TipsList',
    props: {
        tips: {
            type: Array,
        },
    },
    methods: {
        selectListItem(tip) {
            this.$emit('selectTip', tip);
        },
    },
};
</script>

<style scoped></style>
