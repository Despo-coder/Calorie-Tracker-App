import Storage from './Storage';
class CalorieTracker {
  constructor() {
    this._caloriesLimit = Storage.getCaloriesLimit();
    this._totalCalories = Storage.getTotalCalories(0);
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkouts();
    this._displayCaloriesLimit();
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
    document.getElementById('limit').value = this._caloriesLimit;
  }
  //Public Methods/API
  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    Storage.saveMeal(meal);
    Storage.updateTotalCalories(this._totalCalories);
    this._displayNewMeal(meal);
    this._render();
  }
  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    Storage.saveWorkout(workout);

    Storage.updateTotalCalories(this._totalCalories);
    this._displayNewWorkOut(workout);
    this._render();
  }

  removeMeal(id) {
    const index = this._meals.findIndex((meal) => meal.id === id);
    if (index !== -1) {
      const meal = this._meals[index];
      this._totalCalories -= meal.calories;
      this._meals.splice(index, 1);
      Storage.updateTotalCalories(this._totalCalories);
      Storage.removeMeal(id);
      this._render();
    }
  }

  removeWorkout(id) {
    const index = this._workouts.findIndex((workout) => workout.id === id);

    if (index !== -1) {
      const workout = this._workouts[index];
      this._totalCalories += workout.calories;
      this._workouts.splice(index, 1);
      Storage.updateTotalCalories(this._totalCalories);
      Storage.removeWorkout(id);
      this._render();
    }
  }
  setLimit(calorieLimit) {
    this._caloriesLimit = calorieLimit;
    Storage.setCalorieLimit(calorieLimit);
    this._displayCaloriesLimit();
    this._render();
  }
  loadItems() {
    this._meals.forEach((meal) => this._displayNewMeal(meal));
    this._workouts.forEach((workout) => this._displayNewWorkOut(workout));
  }
  reset() {
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    Storage.clearAll();
    this._render();
  }
  //Private Methods

  _displayCaloriesTotal() {
    const totalCaloriesEl = document.getElementById('calories-total');
    totalCaloriesEl.innerHTML = this._totalCalories;
  }
  _displayCaloriesLimit() {
    const calorieLimitEl = document.getElementById('calories-limit');
    calorieLimitEl.innerHTML = this._caloriesLimit;
  }
  _displayCaloriesConsumed() {
    const caloriesConsumedEl = document.getElementById('calories-consumed');

    const consumed = this._meals.reduce(
      (total, meal) => total + meal.calories,
      0
    );
    caloriesConsumedEl.innerHTML = consumed;
  }
  _displayCaloriesBurned() {
    const caloriesBurnedEl = document.getElementById('calories-burned');

    const burned = this._workouts.reduce(
      (total, workout) => total + workout.calories,
      0
    );
    caloriesBurnedEl.innerHTML = burned;
  }
  _displayCaloriesRemaining() {
    const progress = document.getElementById('calories-progress');
    const caloreisLeft = document.getElementById('calories-remaining');
    const remaining = this._caloriesLimit - this._totalCalories;
    caloreisLeft.innerHTML = remaining;
    if (remaining <= 0) {
      caloreisLeft.parentElement.parentElement.classList.remove('bg-light');
      caloreisLeft.parentElement.parentElement.classList.add('bg-danger');
      progress.classList.remove('bg-success');
      progress.classList.add('bg-danger');
    } else {
      caloreisLeft.parentElement.parentElement.classList.remove('bg-danger');
      caloreisLeft.parentElement.parentElement.classList.add('bg-light');
      progress.classList.remove('bg-danger');
      progress.classList.add('bg-success');
    }
  }
  _displayCaloriesProgress() {
    const progress = document.getElementById('calories-progress');
    const percentage = (this._totalCalories / this._caloriesLimit) * 100;
    const width = Math.min(percentage, 100);

    progress.style.width = `${width}%`;
  }
  _displayNewMeal(meal) {
    const mealsEl = document.getElementById('meal-items');
    const mealEl = document.createElement('div');
    mealEl.classList.add('card', 'my-2');
    mealEl.setAttribute('data-id', meal.id);
    mealEl.innerHTML = `
      <div class="card my-2">
      <div class="card-body">
      <div class="d-flex align-items-center justify-content-between">
      <h4 class="mx-1">${meal.name}</h4>
      <div class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
        >
        ${meal.calories}
     </div>
     <button class="delete btn btn-danger btn-sm mx-2">
     <i class="fa-solid fa-xmark"></i>
     </button>
     </div>
    </div>
            </div>
            </div>`;
    mealsEl.appendChild(mealEl);
  }
  _displayNewWorkOut(workout) {
    const workoutsEl = document.getElementById('workout-items');
    const workoutEl = document.createElement('div');
    workoutEl.classList.add('card', 'my-2');
    workoutEl.setAttribute('data-id', workout.id);
    workoutEl.innerHTML = `
            <div class="card my-2">
              <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${workout.name}</h4>
                  <div
                    class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${workout.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
            </div>`;
    workoutsEl.appendChild(workoutEl);
  }
  _render() {
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
  }
}

export default CalorieTracker;
