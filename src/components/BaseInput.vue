<template>
    <input
        v-bind="$attrs"
        :modelValue="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
    />
    <!--      @keypress.enter="selectSpot(hints[0])"-->
    <p class="absolute left-0 top-full w-full text-red-600 pl-4" v-if="error">
        {{ error }}
    </p>
</template>

<script>
export default {
    name: 'BaseInput',
    props: {
        error: {
            type: String,
            default: '',
        },
        modelValue: {
            type: [String, Number],
            default: '',
        },
    },
};
</script>

<style scoped></style>
