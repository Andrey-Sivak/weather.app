<template>
    <div class="content max-w-full w-125 p-5 h-full">
        <div class="relative z-20 pb-1">
            <BaseInput
                type="text"
                placeholder="Search..."
                v-model="query"
                :error="error"
                @update:modelValue="search(query)"
            />
            <TipsList :tips="hints" @select-tip="selectSpot" />
        </div>
        <BaseContent :weather="weather" :location="location" />
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
                this.coords.lat,
                this.coords.lon
            );

            if (typeof weatherData !== 'object' || weatherData?.cod === '404') {
                this.error = `${weatherData.message}. Please try later`;
            } else {
                this.updateData(weatherData);
            }
        },

        async selectSpot(locationObject) {
            this.hints = [];
            this.coords.lat = locationObject.lat;
            this.coords.lon = locationObject.lon;

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

            const isLat = new URL(window.location.href).searchParams.has('lat');
            const isLon = new URL(window.location.href).searchParams.has('lon');

            if (isLat && isLon) {
                this.coords.lat = new URL(
                    window.location.href
                ).searchParams.get('lat');
                this.coords.lon = new URL(
                    window.location.href
                ).searchParams.get('lon');
            }

            if (oldWeatherData) {
                this.weather = JSON.parse(oldWeatherData);
            }

            if (oldLocationData) {
                this.location = JSON.parse(oldLocationData);
            }

            return oldWeatherData && oldLocationData;
        },

        updateData(dataObject) {
            this.updateWeather(dataObject);
            this.updateLocation(dataObject);
            this.saveData();
        },

        updateWeather(dataObject) {
            this.weather = {
                temp: dataObject.main.temp,
                pressure: dataObject.main.pressure,
                feels_like: dataObject.main.feels_like,
                main: dataObject.weather[0].main,
                description: dataObject.weather[0].description,
                windSpeed: dataObject.wind.speed,
                icon: dataObject.weather[0].icon,
            };
        },

        updateLocation(dataObject) {
            this.location = {
                name: dataObject.name,
                country: dataObject.sys.country,
            };
        },

        setUpdatingInterval() {
            this.updatingWeather = setInterval(async () => {
                await this.updateWeatherData();
            }, this.updatingTimeout);
        },
    },
    watch: {
        coords: {
            handler() {
                const url = new URL(window.location.href);
                url.searchParams.set('lat', this.coords.lat);
                url.searchParams.set('lon', this.coords.lon);
                window.history.pushState(null, document.title, url);
            },
            deep: true,
        },
    },
    mounted() {
        const isOldDataExist = this.getData();

        if (isOldDataExist) {
            this.setUpdatingInterval();
        }
    },
};
</script>
