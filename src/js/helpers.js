import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

export const formatIngredientsArr = function (newRecipe) {
  const ingredientsDataArr = Object.entries(newRecipe)
    .filter(entry => entry[0].startsWith('ingredient'))
    .map(ingData => {
      const ingIndex = +ingData[0].split('-').slice(-2, -1) - 1;
      const [ingType] = ingData[0].split('-').slice(-1);
      const ingValue = ingData[1];
      return [ingIndex, ingType, ingValue];
    });
  const ingQuantity = ingredientsDataArr.filter(curr => curr[1] === 'quantity');
  const ingUnit = ingredientsDataArr.filter(curr => curr[1] === 'unit');
  const ingDescription = ingredientsDataArr.filter(
    curr => curr[1] === 'description'
  );
  const ingredients = [];
  for (let i = 0; i < 8; i++) {
    if (
      ingQuantity[i][2] === '' &&
      ingUnit[i][2] === '' &&
      ingDescription[i][2] === ''
    )
      break;
    ingredients.push({
      quantity: ingQuantity[i][2] ? +ingQuantity[i][2] : null,
      unit: ingUnit[i][2],
      description: ingDescription[i][2],
    });
  }
  return ingredients;
};

/*
export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
*/
