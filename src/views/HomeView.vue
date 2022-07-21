<template>
    <div class="content max-w-full w-125 p-5 h-full">
        <div class="relative z-20 pb-1">
            <input
                type="text"
                class="w-full p-4 bg-white/80 rounded-tr-xl rounded-bl-xl block w-full shadow-xl focus:shadow-md transition-all duration-300 text-black"
                v-model="query"
                @input="search(query)"
                @keypress.enter="selectSpot(hints[0])"
                placeholder="Search..."
            />
            <p
                class="absolute left-0 top-full w-full text-red-600 pl-4"
                v-if="error"
            >
                {{ error }}
            </p>
            <div
                class="absolute left-0 top-full w-full mt-2 bg-white/80 shadow-md rounded overflow-hidden"
                v-if="hints.length"
            >
                <p
                    class="w-full py-2 cursor-pointer border-b last:border-none border-solid border-black/30 text-black/70 px-4 hover:bg-white"
                    v-for="(hint, idx) in hints"
                    :key="idx"
                    @click="selectSpot(hint)"
                >
                    {{ hint.name }} | {{ hint.state }}({{ hint.country }})
                </p>
            </div>
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
export default {
    name: 'HomeView',
    data() {
        return {
            query: '',
            error: '',
            weather: {},
            location: {},
            hints: [],
            coords: {},
            updatingWeather: null,
            updatingTimeout: 10000,
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

            const url = this.createUrl(
                'http://api.openweathermap.org/geo/1.0/direct',
                {
                    q: query,
                    limit: 5,
                }
            );

            try {
                const request = await fetch(url);
                this.hints = await request.json();
            } catch (e) {
                console.log(e);
            }
        },

        async selectSpot(locationObject) {
            this.hints = [];

            const isDataUpdated = await this.getDataByCoords(
                locationObject.lat,
                locationObject.lon
            );

            if (isDataUpdated) {
                this.saveData();
            } else {
                this.error = `failed to get data by ${this.query}`;
            }

            this.query = '';
        },

        createUrl(baseUrl, searchParamsObject) {
            const API_KEY = 'c00f5f870cabcfba830203d9ff199683';
            const url = new URL(baseUrl);

            Object.entries(searchParamsObject).forEach(([key, value]) =>
                url.searchParams.set(key, value)
            );
            url.searchParams.set('appid', API_KEY);

            return url;
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

        async getDataByCoords(lat, lon) {
            this.location.lat = lat;
            this.location.lon = lon;

            const url = this.createUrl(
                'https://api.openweathermap.org/data/2.5/weather',
                {
                    lat: lat,
                    lon: lon,
                    units: 'metric',
                }
            );

            try {
                const request = await fetch(url);
                const result = await request.json();
                this.updateData(result);
                return true;
            } catch (e) {
                console.log(e);
                return false;
            }
        },

        setUpdatingInterval() {
            this.updatingWeather = setInterval(async () => {
                const isDataUpdated = await this.getDataByCoords(
                    this.location.lat,
                    this.location.lon
                );

                if (isDataUpdated) {
                    this.saveData();
                } else {
                    this.error = `failed to get data by ${this.query}`;
                }
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
    components: {},
};
</script>
