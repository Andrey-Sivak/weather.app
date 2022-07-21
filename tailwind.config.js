/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{vue,js}'],
    theme: {
        extend: {
            spacing: {
                125: '31.25rem',
            },
        },
    },
    plugins: [],
};
