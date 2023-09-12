import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded :)';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  _isEdit = false;

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  closeWindow() {
    this._window.classList.add('hidden');
    this._overlay.classList.add('hidden');
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  addHandlerEditRecipe(handler) {
    document.querySelector(`body`).addEventListener(
      'click',
      function (e) {
        if (Array.from(e.target.classList).includes(`recipe__edit`)) {
          this._isEdit = true;
          this.toggleWindow();
          console.log(this._data);
          // console.log('hi');
          handler();
        }
      }.bind(this)
    );
  }

  renderEditForm(recipe) {
    this._isEdit = true;

    // Select each input field by name and set its value
    document.querySelector('[name="title"]').value = recipe.title;
    document.querySelector('[name="publisher"]').value = recipe.publisher;
    document.querySelector('[name="cookingTime"]').value = recipe.cookingTime;
    document.querySelector('[name="sourceUrl"]').value = recipe.sourceUrl;
    document.querySelector('[name="image"]').value = recipe.image;

    // Loop through ingredient numbers
    for (let i = 1; i <= 8; i++) {
      // Build the selector for quantity, unit, and description
      const quantitySelector = `[name="ingredient-${i}-quantity"]`;
      const unitSelector = `[name="ingredient-${i}-unit"]`;
      const descriptionSelector = `[name="ingredient-${i}-description"]`;

      // Select and set values for quantity, unit, and description
      document.querySelector(quantitySelector).value =
        recipe.ingredients[i - 1].quantity || '';
      document.querySelector(unitSelector).value =
        recipe.ingredients[i - 1].unit || '';
      document.querySelector(descriptionSelector).value =
        recipe.ingredients[i - 1].description || '';
    }
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
