<template>
    <input
        class="w-full p-4 bg-white/80 rounded-tr-xl rounded-bl-xl block w-full shadow-xl focus:shadow-md transition-all duration-300 text-black"
        v-bind="$attrs"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
    />
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
