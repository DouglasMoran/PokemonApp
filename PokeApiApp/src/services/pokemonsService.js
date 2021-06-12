import {axiosApi} from '@http';
import axios from 'axios';

export const getPokemons = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let pokemosResults = await axiosApi.get('/pokemon');
      resolve({dataPokemons: pokemosResults});
    } catch (error) {
      console.log('getPokemons() : OPERATION NOT EXECUTED BY ERROR: ', error);
      reject(error);
    }
  });
};

export const getPokemonsRegions = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let pokemosRegionsResults = await axiosApi.get('/region');
      resolve({regions: pokemosRegionsResults});
    } catch (error) {
      console.log(
        'getPokemonsRegions() : OPERATION NOT EXECUTED BY ERROR: ',
        error,
      );
      reject(error);
    }
  });
};

export const getPokemonLocationsArea = () => {
  try {
    return new Promise(async (resolve, reject) => {
      let locationsAreResult = await axiosApi.get('/location-area?limit=70');
      let _locationsAreas = locationsAreResult.data.results;
      let locationsUrls = _locationsAreas.map(location => location.url);
      resolve({locationsUrls: locationsUrls});
    });
  } catch (error) {
    reject(error);
    console.log('ERROR : getPokemonLocationsArea() ::: ', error);
  }

};

export const getPokemonLocations = () => {
  try {
    const locationsGeneral = new Promise(async (resolve, reject) => {
      let pokemonLocationResults = await axiosApi.get('/location?limit=7');
      resolve({locations: pokemonLocationResults});
    });

    locationsGeneral.then(locations => {
      let locationsTmp = locations.locations.data.results;
      locationsTmp.map(location => {
        return new Promise(async (resolve, reject) => {
          let dataCurrentLocation = await axiosApi.get(location.url);
          resolve({dataCurrent: dataCurrentLocation});
        });
      });
    });
  } catch (error) {
    console.log(
      'getPokemonsRegions() : OPERATION NOT EXECUTED BY ERROR: ',
      error,
    );
    reject(error);
  }
};

export const encounterPokemons = id => {
  return new Promise(async (resolve, reject) => {
    try {
      // https://pokeapi.co/api/v2/encounter-condition-value/{id or name}/
      let responseEncounters = await axiosApi.get(`/pokemon/${id}/encounters`);
      resolve({encounters: responseEncounters});
    } catch (error) {
      console.log(
        'getPokemonsRegions() : OPERATION NOT EXECUTED BY ERROR: ',
        error,
      );
      reject(error);
    }
  });
};