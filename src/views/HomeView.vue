<template>
    <div class="content max-w-full w-125 p-5 h-full">
        <div class="relative z-20 pb-1">
            <BaseInput
                class="w-full p-4 bg-white/80 rounded-tr-xl rounded-bl-xl block w-full shadow-xl focus:shadow-md transition-all duration-300 text-black"
                type="text"
                placeholder="Search..."
                v-model="query"
                :error="error"
                @update:modelValue="search(query)"
            />
            <TipsList :tips="hints" @select-tip="selectSpot" />
        </div>
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
                <p class="text-3xl text-center mb-1 font-black drop-shadow-lg">
                    {{ normalizeTime(time) }}
                </p>
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
    </div>
</template>

<script>
import TipsList from '@/components/TipsList';
import { getHintsByQuery, getWeatherDataByCoords } from '@/api';

export default {
    name: 'HomeView',
    components: { TipsList },
    data() {
        return {
            query: '',
            error: '',
            weather: {},
            location: {},
            hints: [],
            coords: {},
            updatingWeather: null,
            updatingTimeout: 100000,
            time: new Date(Date.now()),
        };
    },
    methods: {
        async search(query) {
            this.error = '';
            this.hints = [];

            if (query.length < 2) {
                this.error = 'Enter more then 2 characters';
                return;
            }

            const result = await getHintsByQuery(query, 5);

            if (Array.isArray(result) && result.length > 0) {
                this.hints = result;
                return;
            }

            this.error = 'Nothing found';
        },

        async updateWeatherData() {
            const weatherData = await getWeatherDataByCoords(
                this.location.lat,
                this.location.lon
            );

            if (typeof weatherData !== 'object' || weatherData?.cod === '404') {
                this.error = `${weatherData.message}. Please try later`;
            } else {
                this.updateData(weatherData);
                this.saveData();
            }
        },

        async selectSpot(locationObject) {
            this.hints = [];
            this.location.lat = locationObject.lat;
            this.location.lon = locationObject.lon;

            await this.updateWeatherData();

            this.query = '';
        },

        saveData() {
            const weatherData = JSON.stringify(this.weather);
            const locationData = JSON.stringify(this.location);
            window.localStorage.setItem('weather-data', weatherData);
            window.localStorage.setItem('location-data', locationData);
        },

        getData() {
            const oldWeatherData = window.localStorage.getItem('weather-data');
            const oldLocationData =
                window.localStorage.getItem('location-data');

            if (oldWeatherData) {
                this.weather = JSON.parse(oldWeatherData);
            }

            if (oldLocationData) {
                this.location = JSON.parse(oldLocationData);
            }

            return oldWeatherData && oldLocationData;
        },

        normalizeTemperature(temperature) {
            // TODO: remake to template string
            return `${temperature.toFixed()}&#176;<span class="font-bold">C</span>`;
        },

        updateData(dataObject) {
            const newWeatherObject = {
                temp: dataObject.main.temp,
                pressure: dataObject.main.pressure,
                feels_like: dataObject.main.feels_like,
                main: dataObject.weather[0].main,
                description: dataObject.weather[0].description,
                windSpeed: dataObject.wind.speed,
                icon: dataObject.weather[0].icon,
            };

            const newLocationObject = {
                name: dataObject.name,
                country: dataObject.sys.country,
            };

            this.weather = newWeatherObject;
            this.location = { ...this.location, ...newLocationObject };
        },

        setUpdatingInterval() {
            this.updatingWeather = setInterval(async () => {
                await this.updateWeatherData();
            }, this.updatingTimeout);
        },

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
        const isOldDataExist = this.getData();

        if (isOldDataExist) {
            this.setUpdatingInterval();
        }

        setInterval(this.timer, 1000 * 60);
    },
};
</script>
