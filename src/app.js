import { Modal, Collapse } from 'bootstrap';
import '@fortawesome/fontawesome-free/js/all';
import CalorieTracker from './Tracker';
import { Meal, Workout } from './Item';
import './style/bootstrap.css';
import './style/style.css';

class App {
  constructor() {
    this._tracker = new CalorieTracker();
    this._loadEventListeners();
    this._tracker.loadItems();
  }
  _loadEventListeners() {
    document
      .getElementById('reset')
      .addEventListener('click', this._reset.bind(this));
    document
      .getElementById('limit-form')
      .addEventListener('submit', this._setLimit.bind(this));
    document
      .getElementById('meal-form')
      .addEventListener('submit', this._newItem.bind(this, 'meal'));
    document
      .getElementById('workout-form')
      .addEventListener('submit', this._newItem.bind(this, 'workout'));
    document
      .getElementById('meal-items')
      .addEventListener('click', this._removeItem.bind(this, 'meal'));
    document
      .getElementById('workout-items')
      .addEventListener('click', this._removeItem.bind(this, 'workout'));
    document
      .getElementById('filter-meals')
      .addEventListener('keyup', this._filterItem.bind(this, 'meal'));
    document
      .getElementById('filter-workouts')
      .addEventListener('keyup', this._filterItem.bind(this, 'workout'));
  }
  _newItem(type, e) {
    const name = document.getElementById(`${type}-name`);
    const calories = document.getElementById(`${type}-calories`);
    //Validation
    if (name.value === '' || calories.value === '') {
      alert('Enter All Fields');
      return;
    }
    e.preventDefault();
    if (type === 'meal') {
      const meal = new Meal(name.value, +calories.value);
      this._tracker.addMeal(meal);
    } else if (type === 'workout') {
      const workout = new Workout(name.value, +calories.value);
      this._tracker.addWorkout(workout);
    }

    name.value = '';
    calories.value = '';

    const collapseVal = document.getElementById(`collapse-${type}`);
    const bsCollapse = new Collapse(collapseVal, { toggle: true });
  }
  _removeItem(type, e) {
    if (
      e.target.classList.contains(
        'delete' || e.target.classList.contains('fa-solid fa-xmark')
      )
    ) {
      if (confirm('Are You Sure')) {
        const id =
          e.target.parentElement.parentElement.parentElement.parentElement.getAttribute(
            'data-id'
          );

        type === 'meal'
          ? this._tracker.removeMeal(id)
          : this._tracker.removeWorkout(id);
        e.target.parentElement.parentElement.parentElement.parentElement.remove();
      }
    }
    e.preventDefault();
  }
  _filterItem(type, e) {
    const text = e.target.value.toLowerCase();
    document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
      const name = item.firstElementChild.firstElementChild.textContent;
      if (name.toLocaleLowerCase().indexOf(text) !== -1) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }
  _reset() {
    this._tracker.reset();
    const resetMeal = document.getElementById('meal-items');
    resetMeal.innerHTML = '';
    document.getElementById('workout-items').innerHTML = '';
    document.getElementById('filter-meals').value.innerHTML = '';
    document.getElementById('filter-workouts').value.innerHTML = '';
  }
  _setLimit(e) {
    const limit = document.getElementById('limit');
    if (limit.value === '') {
      alert('Please add limit');
      return;
    }
    this._tracker.setLimit(+limit.value);
    limit.value = '';
    const modalEl = document.getElementById('limit-modal');
    const modal = new Modal.getInstance(modalEl);
    modal.hide();
    e.preventDefault();
  }
}
const app = new App();
