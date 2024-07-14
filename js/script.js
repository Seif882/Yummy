"use strict";
//////////////////////////////////////? StartUp Logic ?//////////////////////////////////////

const sectionsSelectors = [
  "#home-section",
  "#search-section",
  "#categories-section",
  "#area-section",
  "#ingredients-section",
  "#contact-section",
];

navsUp();

//////////////////////////////////////? Home Logic ?//////////////////////////////////////

function showMainSpinner() {
  $("#main-spinner").removeClass("d-none");
  $("body").addClass("overflow-hidden");
}

function hideMainSpinner() {
  $("#main-spinner").fadeOut(250);
  setTimeout(() => {
    $("#main-spinner").addClass("d-none");
  }, 400);
  $("body").removeClass("overflow-hidden");
}

//////////////////////////////////////! Adding The Hover Effect For Food Cards !//////////////////////////////////////

$(".m-1").hover(
  function () {
    $(this).addClass("hovered");
  },
  function () {
    $(this).removeClass("hovered");
  }
);

//////////////////////////////////////! Adding Home Meals !//////////////////////////////////////

function getHomeMeals() {
  showMainSpinner();
  let html = ``;
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`)
    .then((res) => res.json())
    .then(function (data) {
      data.meals.forEach((ele) => {
        html += `
                 <div class="col-md-3 p-0"  onClick="getDetails(${ele.idMeal})">
                 <div class="position-relative m-1 hovered overflow-hidden">
                 <div
                class="overlay position-absolute w-100 h-100 rounded p-1" 
                 >
                 <p class="fw-semibold fs-4 position-absolute top-50 translate-middle-y">${ele.strMeal}</p>
                </div>
                <img src="${ele.strMealThumb}" class="w-100 rounded" />
                </div>
                 </div>`;
        $("#homeRow").html(html);
      });
    });

  hideMainSpinner();
}

getHomeMeals();

//////////////////////////////////////? Details Logic ?//////////////////////////////////////

function getDetails(id) {
  showMainSpinner();

  $(".active-section").addClass("d-none");

  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then((res) => res.json())
    .then(function (data) {
      //! Getting Tags
      let tagsArr = data.meals[0].strTags?.split(",");
      let tagsHtml = ``;

      tagsArr?.forEach((tag) => {
        tagsHtml += `
        <span class="badge fs-5 fw-normal text-black tag-badge">
              ${tag}
            </span>
            `;
      });

      //! Getting Ingredients
      let ingredientsArr = [];
      let ingredientsHTML = ``;

      for (const key in data.meals[0]) {
        if (
          key.includes("strMeasure") &&
          data.meals[0][key] &&
          data.meals[0][key] !== " "
        ) {
          ingredientsArr.push(`${data.meals[0][key]} `);
        }
        if (key.includes("strIngredient") && data.meals[0][key]) {
          ingredientsArr.push(`${data.meals[0][key]} `);
        }
      }

      for (let i = 0; i < ingredientsArr.length / 2; i++) {
        ingredientsHTML += `
        <span class="badge fs-6 fw-normal text-black ingredient-badge m-1"
              > ${ingredientsArr[i + ingredientsArr.length / 2]} ${
          ingredientsArr[i]
        }</span
            >`;
      }

      //! Render Details For Selected Meal

      $("#detailsRow").html(`
      <div class="col-md-4">
          <img src="${data.meals[0].strMealThumb}" class="w-100" />
          <p class="text-white fs-3 fw-semibold">${data.meals[0].strMeal}</p>
        </div>
        <div class="col-md-8 text-white">
          <p class="h2">Instructions</p>
          <p>
            ${data.meals[0].strInstructions}
          </p>

          <p class="fw-bold fs-3">
            Area : <span class="fw-semibold">${data.meals[0].strArea}</span>
          </p>

          <p class="fw-bold fs-3">
            Category : <span class="fw-semibold">${data.meals[0].strCategory}</span>
          </p>

          <p class="fw-bold fs-3">Ingredients :</p>

          <div id="ingredients">
            ${ingredientsHTML}
          </div>

          <p class="fw-bold fs-3 mt-4">Tags :</p>

          <div id="tags">
            ${tagsHtml}
          </div>

          <p class="fw-bold fs-3 mt-4">Learn More :</p>

          <div class="btns-container mb-4">
            <a href="${data.meals[0].strYoutube}" target="_blank"> <button class="btn btn-danger">Youtube</button> </a>
          </div>
        </div>
        `);

      $("#details-section").removeClass("d-none");

      hideMainSpinner();
    });
}

//////////////////////////////////////! Closing Details Section !//////////////////////////////////////

function closeDetails() {
  $("#details-section").addClass("d-none");
  $(".active-section").removeClass("d-none");
}

$("#close-btn").click(closeDetails);

window.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeDetails();
  }
});

//////////////////////////////////////? Side Bar Section ?//////////////////////////////////////

//////////////////////////////////////! Opening And Closing Side Bar !//////////////////////////////////////

function closeSideBar(btn) {
  navsUp();
  $(btn).addClass("fa-bars");
  $(btn).removeClass("fa-xmark");
  $("aside").css("transform", "translateX(-260px)");
}

function openSideBar(btn) {
  $(btn).addClass("fa-xmark");
  $(btn).removeClass("fa-bars");
  $("aside").css("transform", "translateX(0)");
  navsDown();
}

function navsDown() {
  for (let i = 0; i < 6; i++) {
    $("#navs p").eq(i).slideDown();
  }
}

function navsUp() {
  for (let i = 0; i < 6; i++) {
    $("#navs p").eq(i).slideUp();
  }
}

$("#aside-toggle").click(function () {
  if (this.classList.contains("fa-bars")) {
    openSideBar(this);
  } else {
    closeSideBar(this);
  }
});

//////////////////////////////////////! Switching Sections !//////////////////////////////////////

$("#navs p").click(function () {
  closeDetails();
  $("#category-meals-row").fadeOut();
  $("#back-btn").fadeOut();
  $("#back-btn-area").fadeOut();
  $("#back-btn-ingredient").fadeOut();

  closeSideBar($("#aside-toggle"));

  sectionsSelectors.forEach((section) => {
    if (!section.includes($(this).attr("costume"))) {
      $(section).removeClass("active-section");
      $(section).fadeOut(250);
      setTimeout(() => {
        showMainSpinner();
      }, 250);
    } else {
      $(section).addClass("active-section");
    }
  });

  setTimeout(() => {
    hideMainSpinner();
  }, 250);

  setTimeout(() => {
    $(`#${$(this).attr("costume")}-section`).fadeIn(250);
  }, 500);
});

//////////////////////////////////////? Search Section ?//////////////////////////////////////

function search(type, caller) {
  let url = ``;

  if (type === "name")
    url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${caller.value}`;

  if (type === "letter")
    url = `https://www.themealdb.com/api/json/v1/1/search.php?f=${caller.value}`;

  if (caller.value) {
    $("#searchRow").css("display", "none");
    $("#mini-spinner").removeClass("d-none");

    let html = ``;

    fetch(`${url}`)
      .then((res) => res.json())
      .then(function (data) {
        //* Getting Rid Of Extra Data *//
        let newData = data.meals;

        if (data.meals.length > 20) {
          newData = data.meals.slice(0, 20);
        }

        if (newData) {
          newData.forEach((ele, i) => {
            html += `
                 <div class="col-md-3 p-0"  onClick="getDetails(${ele.idMeal})">
                 <div class="position-relative m-1 hovered overflow-hidden" ">
                 <div
                class="overlay position-absolute w-100 h-100 rounded p-1" 
                 >
                 <p class="fw-semibold fs-4 position-absolute top-50 translate-middle-y">${ele.strMeal}</p>
                </div>
                <img src="${ele.strMealThumb}" class="w-100 rounded" />
                </div>
                 </div>`;

            $("#searchRow").html(html);

            if (i === newData.length - 1) {
              setTimeout(() => {
                $("#mini-spinner").addClass("d-none");
              }, 100);

              $("#searchRow").fadeIn(250);
            }
          });
        } else {
          $("#searchRow").html("");
          $("#mini-spinner").addClass("d-none");
        }
      });
  }
}

//////////////////////////////////////! Search By Name Logic !//////////////////////////////////////

document.querySelector("#nameSearch").addEventListener("input", function () {
  search("name", this);
  $("#letterSearch").val("");
});

//////////////////////////////////////! Search By Letter Logic !//////////////////////////////////////

document.querySelector("#letterSearch").addEventListener("input", function () {
  search("letter", this);
  $("#nameSearch").val("");
});

//////////////////////////////////////? Categories Section ?//////////////////////////////////////

//////////////////////////////////////! Opening Categories Section !//////////////////////////////////////

$(`#categories-nav`).click(function () {
  showMainSpinner();

  setTimeout(() => {
    $("#categoriesRow").fadeIn(250);
  }, 500);

  $("#categories-h1").html("Meals Categories");

  fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    .then((res) => res.json())
    .then(function (data) {
      let html = ``;
      data.categories.forEach((category) => {
        html += `
        <div class="col-md-3 p-0" onClick="getCategory('${
          category.strCategory
        }')">
          <div class="position-relative m-1 hovered overflow-hidden">
            <div class="overlay position-absolute w-100 h-100 rounded p-1">
              <p class="fw-bold fs-4 text-center">${category.strCategory}</p>
              <p class=" text-center">
              ${category.strCategoryDescription
                .split(" ")
                .slice(0, 20)
                .join(" ")}
              </p>
            </div>
            <img src="${category.strCategoryThumb}" class="w-100 rounded" />
          </div>
        </div>
        `;
      });
      $("#categoriesRow").html(html);
    });
});

//////////////////////////////////////! Opening Certain Category !//////////////////////////////////////

function getCategory(category) {
  $("#categories-section").fadeOut(250);

  $("#categoriesRow").fadeOut();

  setTimeout(() => {
    showMainSpinner();
  }, 250);

  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    .then((res) => res.json())
    .then(function (data) {
      //* Getting Rid Of Extra Data *//
      let newData = data.meals;

      if (data.meals.length > 20) {
        newData = data.meals.slice(0, 20);
      }
      let html = ``;
      newData.forEach((ele) => {
        html += `
                 <div class="col-md-3 p-0"  onClick="getDetails(${ele.idMeal})">
                 <div class="position-relative m-1 hovered overflow-hidden">
                 <div
                class="overlay position-absolute w-100 h-100 rounded p-1" 
                 >
                 <p class="fw-semibold fs-4 position-absolute top-50 translate-middle-y">${ele.strMeal}</p>
                </div>
                <img src="${ele.strMealThumb}" class="w-100 rounded" />
                </div>
                 </div>`;
      });
      $("#category-meals-row").html(html);

      setTimeout(() => {
        hideMainSpinner();
      }, 250);

      setTimeout(() => {
        $("#categories-h1").html(`${category} Meals`);

        $("#categories-section").fadeIn(250);

        $("#category-meals-row").fadeIn();
        $("#back-btn").fadeIn();
      }, 500);
    });
}

//////////////////////////////////////! Closing Opened Category !//////////////////////////////////////

$("#back-btn").click(function () {
  $("#categories-section").fadeOut(250);
  $("#category-meals-row").fadeOut();
  $("#back-btn").fadeOut(250);

  setTimeout(() => {
    showMainSpinner();
  }, 250);

  setTimeout(() => {
    $("#categories-h1").html("Meals Categories");

    hideMainSpinner();
  }, 500);

  setTimeout(() => {
    $("#categories-section").fadeIn(250);
    $("#categoriesRow").fadeIn(250);
  }, 750);
});

//////////////////////////////////////? Area Section ?//////////////////////////////////////

$(`#area-nav`).click(function () {
  showMainSpinner();

  setTimeout(() => {
    $("#areaRow").fadeIn(250);
  }, 500);

  $("#areas-h1").html("Meals Areas");

  fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    .then((res) => res.json())
    .then(function (data) {
      let html = ``;
      data.meals.forEach((area) => {
        html += ` <div class="col-md-3 p-0 text-white text-center" onClick="getArea('${area.strArea}')">
          <i class="fa-solid fa-house-flag fs-1"></i>
          <p class="fs-2">${area.strArea}</p>
        </div>`;
      });
      $("#areasRow").html(html);
    });
});

//////////////////////////////////////! Opening Certain Area !//////////////////////////////////////

function getArea(area) {
  $("#area-section").fadeOut(250);

  $("#areasRow").fadeOut();

  setTimeout(() => {
    showMainSpinner();
  }, 250);

  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    .then((res) => res.json())
    .then(function (data) {
      //* Getting Rid Of Extra Data *//
      let newData = data.meals;

      if (data.meals.length > 20) {
        newData = data.meals.slice(0, 20);
      }
      let html = ``;
      newData.forEach((ele) => {
        html += `
                 <div class="col-md-3 p-0"  onClick="getDetails(${ele.idMeal})">
                 <div class="position-relative m-1 hovered overflow-hidden">
                 <div
                class="overlay position-absolute w-100 h-100 rounded p-1" 
                 >
                 <p class="fw-semibold fs-4 position-absolute top-50 translate-middle-y">${ele.strMeal}</p>
                </div>
                <img src="${ele.strMealThumb}" class="w-100 rounded" />
                </div>
                 </div>`;
      });
      $("#area-meals-row").html(html);

      setTimeout(() => {
        hideMainSpinner();
      }, 250);

      setTimeout(() => {
        $("#area-h1").html(`${area} Meals`);

        $("#area-section").fadeIn(250);

        $("#area-meals-row").fadeIn();
        $("#back-btn-area").fadeIn();
      }, 500);
    });
}

//////////////////////////////////////! Closing Opened Area !//////////////////////////////////////

$("#back-btn-area").click(function () {
  $("#area-section").fadeOut(250);
  $("#area-meals-row").fadeOut();
  $("#back-btn").fadeOut(250);

  setTimeout(() => {
    showMainSpinner();
  }, 250);

  setTimeout(() => {
    $("#area-h1").html("Meals Areas");

    hideMainSpinner();
  }, 500);

  setTimeout(() => {
    $("#area-section").fadeIn(250);
    $("#areasRow").fadeIn(250);
  }, 750);
});

//////////////////////////////////////! Closing Opened Area !//////////////////////////////////////

$("#back-btn").click(function () {
  $("#categories-section").fadeOut(250);
  $("#category-meals-row").fadeOut();
  $("#back-btn").fadeOut(250);

  setTimeout(() => {
    showMainSpinner();
  }, 250);

  setTimeout(() => {
    $("#categories-h1").html("Meals Categories");

    hideMainSpinner();
  }, 500);

  setTimeout(() => {
    $("#categories-section").fadeIn(250);
    $("#categoriesRow").fadeIn(250);
  }, 750);
});

//////////////////////////////////////? Ingredient Section ?//////////////////////////////////////

$(`#ingredients-nav`).click(function () {
  showMainSpinner();

  setTimeout(() => {
    $("#ingredients-section").fadeIn(250);
  }, 500);

  $("#ingredients-h1").html("Meals Ingredients");

  fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    .then((res) => res.json())
    .then(function (data) {
      let html = ``;
      //* Getting Rid Of Extra Data *//
      let newData = data.meals.slice(0, 20);

      newData.forEach((ingredient) => {
        html += ` <div class="col-md-3 p-0 text-white text-center" onClick="getIngredient('${
          ingredient.strIngredient
        }')">
          <i class="fa-solid fa-drumstick-bite fs-1"></i>
          <p class="fs-2">${ingredient.strIngredient}</p>
          <p >${ingredient.strDescription.split(" ").slice(0, 20).join(" ")}</p>
        </div>`;
      });

      $("#ingredientsRow").html(html);
    });
});

//////////////////////////////////////! Opening Certain Ingredient !//////////////////////////////////////

function getIngredient(ingredient) {
  $("#ingredients-section").fadeOut(250);

  $("#ingredientsRow").fadeOut();

  setTimeout(() => {
    showMainSpinner();
  }, 250);

  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
    .then((res) => res.json())
    .then(function (data) {
      //* Getting Rid Of Extra Data *//
      let newData = data.meals;

      if (data.meals.length > 20) {
        newData = data.meals.slice(0, 20);
      }
      let html = ``;
      newData.forEach((ele) => {
        html += `
                 <div class="col-md-3 p-0"  onClick="getDetails(${ele.idMeal})">
                 <div class="position-relative m-1 hovered overflow-hidden">
                 <div
                class="overlay position-absolute w-100 h-100 rounded p-1" 
                 >
                 <p class="fw-semibold fs-4 position-absolute top-50 translate-middle-y">${ele.strMeal}</p>
                </div>
                <img src="${ele.strMealThumb}" class="w-100 rounded" />
                </div>
                 </div>`;
      });
      $("#ingredient-meals-row").html(html);

      setTimeout(() => {
        hideMainSpinner();
      }, 250);

      setTimeout(() => {
        $("#ingredient-h1").html(`${ingredient} Meals`);

        $("#ingredients-section").fadeIn(250);

        $("#ingredient-meals-row").fadeIn();
        $("#back-btn-ingredient").fadeIn();
      }, 500);
    });
}

//////////////////////////////////////! Closing Opened Ingredient !//////////////////////////////////////

$("#back-btn-ingredient").click(function () {
  $("#ingredients-section").fadeOut(250);
  $("#ingredient-meals-row").fadeOut();
  $("#back-btn-ingredient").fadeOut(250);

  setTimeout(() => {
    showMainSpinner();
  }, 250);

  setTimeout(() => {
    $("#ingredient-h1").html("Meals Ingredients");

    hideMainSpinner();
  }, 500);

  setTimeout(() => {
    $("#ingredients-section").fadeIn(250);
    $("#ingredientsRow").fadeIn(250);
  }, 750);
});

//////////////////////////////////////? Contact Us Section ?//////////////////////////////////////

const validators = {
  validName: false,
  validEmail: false,
  validNumber: false,
  validAge: false,
  validPassword: false,
  validRepass: false,
};

function allValid() {
  if (
    validators.validName &&
    validators.validEmail &&
    validators.validNumber &&
    validators.validAge &&
    validators.validPassword &&
    validators.validRepass
  ) {
    $(".contact-btn").removeClass("disabled");
  } else {
    $(".contact-btn").addClass("disabled");
  }
}

const nameRegex = new RegExp(/^[a-zA-Z]+$/);
const emailRegex = new RegExp(/[^@ \t\r\n]+@[^@ \t\r\n]{3,}\.[^@ \t\r\n]{3,}$/);
const numberRegex = new RegExp(/^[0-9]{11}$/);
const passwordRegex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);

function validate(input, regex, validator, v, error) {
  if (regex.test(input.value)) {
    validator[v] = true;

    $(error).addClass("d-none");
    $(input).addClass("is-valid");
    $(input).removeClass("is-invalid");
  } else {
    validator = false;
    $(error).removeClass("d-none");
    $(input).addClass("is-invalid");
    $(input).removeClass("is-valid");
  }
}

function validateRepass() {
  if ($(".repass").val() === $(".pass").val()) {
    validators.validRepass = true;
    $(".repass-error").addClass("d-none");
    $(".repass").addClass("is-valid");
    $(".repass").removeClass("is-invalid");
  } else {
    validators.validRepass = false;
    $(".repass-error").removeClass("d-none");
    $(".repass").addClass("is-invalid");
    $(".repass").removeClass("is-valid");
  }
  allValid();
}

document.querySelector(".name").addEventListener("input", function () {
  validate(this, nameRegex, validators, "validName", ".name-error");
  allValid();
});

document.querySelector(".email").addEventListener("input", function () {
  validate(this, emailRegex, validators, "validEmail", ".email-error");
  allValid();
});

document.querySelector(".phone").addEventListener("input", function () {
  validate(this, numberRegex, validators, "validNumber", ".number-error");
  allValid();
});

document.querySelector(".pass").addEventListener("input", function () {
  validate(this, passwordRegex, validators, "validPassword", ".pass-error");
  validateRepass();
  allValid();
});

document.querySelector(".age").addEventListener("input", function () {
  if (this.value > 0 && this.value < 100) {
    validators.validAge = true;
    $(".age-error").addClass("d-none");
    $(this).addClass("is-valid");
    $(this).removeClass("is-invalid");
  } else {
    validAge = false;
    $(".age-error").removeClass("d-none");
    $(this).addClass("is-invalid");
    $(this).removeClass("is-valid");
  }
  allValid();
});

document.querySelector(".repass").addEventListener("input", validateRepass);
