// import kuća from '../assets/images/kuća.jpg';
// import zdravlje from '../assets/images/zdravlje.jpg';
// import promet from '../assets/images/promet.jpg';
// import godisnja_doba from '../assets/images/godisnja_doba.jpg';
// import blagdani from '../assets/images/blagdani.jpg';
// import tjedan from '../assets/images/tjedan.jpg';

// export const images = {
//   kuća,
//   zdravlje,
//   promet,
//   godisnja_doba,
//   blagdani,
//   tjedan,
// };
export function images(input) {
  switch (input) {
    case 'kuća':
      return require('../assets/images/kuća.jpg');
    case 'zdravlje':
      return require('../assets/images/zdravlje.jpg');
    case 'promet':
      return require('../assets/images/promet.jpg');
    case 'godišnja_doba':
      return require('../assets/images/godisnja_doba.jpg');
    case 'blagdani':
      return require('../assets/images/blagdani.jpg');
    case 'tjedan':
      return require('../assets/images/tjedan.jpg');
    case 'obitelj':
      return require('../assets/images/obitelj.jpg');
    case 'geo_tijela':
      return require('../assets/images/geo_tijela.jpg');
    case 'geo_likovi':
      return require('../assets/images/geo_likovi.jpg');
    case 'crte':
      return require('../assets/images/crte.jpg');
  }
}
