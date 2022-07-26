'use strict';

const API_KEY = 'c00f5f870cabcfba830203d9ff199683';
const host = 'api.openweathermap.org';

export const getWeatherDataByCoords = async (lat, lon) => {
    const url = createUrl('https', '/data/2.5/weather', {
        lat: lat,
        lon: lon,
        units: 'metric',
    });

    try {
        const request = await fetch(url);
        return await request.json();
    } catch (e) {
        console.log(e);
        return false;
    }
};

export const getHintsByQuery = async (query, count) => {
    const url = createUrl('http', '/geo/1.0/direct', {
        q: query,
        limit: count,
    });

    try {
        const request = await fetch(url);
        return await request.json();
    } catch (e) {
        console.log(e);
        return false;
    }
};

function createUrl(protocol, pathName, searchParamsObject) {
    const url = new URL(`${protocol}://${host}${pathName}`);

    Object.entries(searchParamsObject).forEach(([key, value]) =>
        url.searchParams.set(key, value)
    );
    url.searchParams.set('appid', API_KEY);

    return url;
}
