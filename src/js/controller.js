import icons from 'url:../img/icons.svg';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const renderSpinner = function (parentElement) {
  const spinnerHTML = `
  <div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div> `;
  parentElement.innerHTML = '';
  parentElement.insertAdjacentHTML('afterbegin', spinnerHTML);
};
const getRecipe = async function (recipeId) {
  try {
    const result = await fetch(
      // 'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886'
      `https://forkify-api.herokuapp.com/api/v2/recipes/${recipeId}`
    );
    const data = await result.json();

    //guard clause for htp errors
    if (!result.ok) throw new Error(`${data.message} (${result.status})`);

    //extract data
    let { recipe: recipeRaw } = data.data;

    // re-format the object
    let recipe = {
      id: recipeRaw.id,
      title: recipeRaw.title,
      publisher: recipeRaw.publisher,
      sourceUrl: recipeRaw.source_url,
      imageUrl: recipeRaw.image_url,
      servings: recipeRaw.servings,
      cookingTime: recipeRaw.cooking_time,
      ingredients: recipeRaw.ingredients,
    };

    // console.log(recipe);
    return recipe;
  } catch (error) {
    alert(error);
  }
};

const renderRecipeIngredients = ingredients =>
  ingredients.reduce(
    (ingredientsList, currentIngredient) =>
      ` ${ingredientsList}
        <li class="recipe__ingredient">
          <svg class="recipe__icon">
            <use href="${icons}#icon-check"></use>
          </svg>
          <div class="recipe__quantity">${
            currentIngredient.quantity ?? ''
          }</div>
          <div class="recipe__description">
            <span class="recipe__unit">${currentIngredient.unit}</span>
            ${currentIngredient.description}
          </div>
        </li>
      `,
    ''
  );

const showRecipe = async function () {
  //determine the recipe id from the url hash
  const recipeId = window.location.hash.slice(1);
  // load the spinner
  renderSpinner(recipeContainer);
  //fetch data
  const recipeData = await getRecipe(recipeId);
  //guard clause for undefined, in case there's an API error
  if (!recipeData) {
    //attach the initial text again
    recipeContainer.innerHTML = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>Start by searching for a recipe or an ingredient. Have fun!</p>
    </div>
    `;
    return;
  }

  //clear the container first
  recipeContainer.innerHTML = '';

  //build the recipe HTML
  const recipeHtml = `
    <figure class="recipe__fig">
      <img src="${recipeData.imageUrl}" alt="Tomato" class="recipe__img" />
      <h1 class="recipe__title">
        <span>${recipeData.title}</span>
      </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${
          recipeData.cookingTime
        }</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${
          recipeData.servings
        }</span>
        <span class="recipe__info-text">servings</span>

        <div class="recipe__info-buttons">
          <button class="btn--tiny btn--increase-servings">
            <svg>
              <use href="${icons}#icon-minus-circle"></use>
            </svg>
          </button>
          <button class="btn--tiny btn--increase-servings">
            <svg>
              <use href="${icons}#icon-plus-circle"></use>
            </svg>
          </button>
        </div>
      </div>

      <div class="recipe__user-generated">
        <svg>
          <use href="${icons}#icon-user"></use>
        </svg>
      </div>
      <button class="btn--round">
        <svg class="">
          <use href="${icons}#icon-bookmark-fill"></use>
        </svg>
      </button>
    </div>

    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">
        ${renderRecipeIngredients(recipeData.ingredients)}
      </ul>
    </div>

    <div class="recipe__directions">
      <h2 class="heading--2">How to cook it</h2>
      <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${
          recipeData.publisher
        }</span>. Please check out
        directions at their website.
      </p>
      <a
        class="btn--small recipe__btn"
        href="${recipeData.sourceUrl}"
        target="_blank"
      >
        <span>Directions</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </a>
    </div>
  `;
  //fill the container with the rendered recipe
  recipeContainer.insertAdjacentHTML('afterbegin', recipeHtml);
};
// getRecipe().then(recipe => console.log(recipe));

//attach a hash event listener to the window object
['hashchange', 'load'].forEach(event =>
  window.addEventListener(event, showRecipe)
);
