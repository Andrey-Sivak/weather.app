<template>
    <div
        class="relative z-10"
        v-if="Object.keys(weather).length && Object.keys(location).length"
    >
        <p class="mt-8 mb-2 text-3xl text-center font-black drop-shadow-lg">
            {{ location.name }} ({{ location.country }})
        </p>
        <div class="my-4">
            <p
                class="text-3xl text-center mb-1 font-black drop-shadow-lg"
                v-html="normalizeTemperature(weather.temp)"
            ></p>
            <p
                class="text-center font-bold mb-4"
                v-html="
                    'Feels like ' + normalizeTemperature(weather.feels_like)
                "
            ></p>
            <p
                class="text-center font-bold drop-shadow-lg text-xl drop-shadow-lg"
            >
                {{ weather.description }}
            </p>
            <img
                class="mx-auto drop-shadow-lg"
                :src="`http://openweathermap.org/img/wn/${weather.icon}@2x.png`"
                alt="icon"
            />
            <BaseTimer />
        </div>
        <div class="border-solid border-t border-white">
            <div
                class="py-2 px-4 flex w-full items-center justify-between drop-shadow-lg text-xl drop-shadow-lg border-solid border-b border-white"
            >
                <p>Wind speed:</p>
                <p>
                    <span class="font-bold">{{ weather.windSpeed }}</span>
                    m/s
                </p>
            </div>
            <div
                class="py-2 px-4 flex w-full items-center justify-between drop-shadow-lg text-xl drop-shadow-lg border-solid border-b border-white"
            >
                <p>Pressure:</p>
                <p>
                    <span class="font-bold">{{ weather.pressure }}</span>
                    bar
                </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BaseContent',
    props: {
        weather: {
            type: Object,
            default: () => {
                return {};
            },
        },
        location: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    methods: {
        normalizeTemperature(temperature) {
            return `${temperature.toFixed()}&#176;<span class="font-bold">C</span>`;
        },
    },
};
</script>

<style scoped></style>
