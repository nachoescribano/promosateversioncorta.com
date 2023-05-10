import { languages } from "./translations.js";

const htmlDoc = document.querySelector("HTML");
const currentLanguage = htmlDoc.lang;
(function () {
  var lastTime = 0;
  var vendors = ["ms", "moz", "webkit", "o"];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
    window.cancelAnimationFrame =
      window[vendors[x] + "CancelAnimationFrame"] ||
      window[vendors[x] + "CancelRequestAnimationFrame"];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function (callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
})();
// Test via a getter in the options object to see if the passive property is accessed
var supportsPassive = false;
try {
  var opts = Object.defineProperty({}, "passive", {
    get: function () {
      supportsPassive = true;
    },
  });
  window.addEventListener("testPassive", null, opts);
  window.removeEventListener("testPassive", null, opts);
} catch (e) {}


const buttonschartChange = document.querySelectorAll(".js-chart-change");
const elementTarget = document.getElementById("section-2");
const ctx = document.getElementById("myChart");
let myBar;


const chartData = {
  labels: [],
  datasets: [
    {
      label: [],
      data: [],
      backgroundColor: "#003A6A",
      borderWidth: 0,
    },
  ],
};

const barOptions = {
  events: false,
  showTooltips: false,
  legend: {
    position: "bottom",
  },
  scales: {
    yAxes: [
      {
        gridLines: {
          drawBorder: false,
        },
        ticks: {
          beginAtZero: true,
          padding: 10,
        },
      },
    ],
    xAxes: [
      {
        gridLines: {
          drawOnChartArea: false,
        },
      },
    ],
  },
  animation: {
    duration: 500,
    easing: "easeInSine",
    onComplete: function () {
      let fontSize = 13;
      if (document.body.clientWidth > 1024) {
        fontSize = 18;
      }
      let ctx = this.chart.ctx;
      ctx.font = Chart.helpers.fontString(
        fontSize,
        "bold",
        Chart.defaults.global.defaultFontFamily
      );
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      for (let i = 0; i < this.data.datasets.length; i++) {
        const dataset = this.data.datasets[i];
        for (let e = 0; e < dataset.data.length; e++) {
          const model =
            dataset._meta[Object.keys(dataset._meta)[0]].data[e]._model;
          ctx.fillStyle = "#003A6A";
          ctx.fillText(
            Intl.NumberFormat("de-DE").format(dataset.data[e]),
            model.x,
            model.y - 5
          );
        }
      }
    },
  },
};

let swiper = new Array(
  document.querySelectorAll("[class*=js-swiper-container]").length
);
function controlClassSlider(selector, method) {
  const swiperContainer = document.querySelector(selector);
  const swiperWrapper = swiperContainer && swiperContainer.children[0];
  if (!swiperContainer || !swiperWrapper) return;
  swiperWrapper.classList[method]("swiper-wrapper");
  for (let i = 0; i < swiperWrapper.children.length; i++) {
    swiperWrapper.children[i].classList[method]("swiper-slide");
  }
  if (method === "add") {
    swiperContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="swiper-pagination"></div>`
    );
  } else {
    const swiperPagination =
      swiperContainer.querySelector(".swiper-pagination");
    swiperContainer.removeChild(swiperPagination);
  }
}
function ControlShowSlider() {
  const mQuery = window.matchMedia("(min-width: 768px)");
  if (mQuery.matches && swiper[0]) {
    for (let i = 0; i < swiper.length; i++) {
      if (
        swiper[i] &&
        swiper[i].eventsListeners &&
        Object.keys(swiper[i].eventsListeners).length !== 0
      ) {
        swiper[i].destroy();
      }
      swiper[i] = null;
      controlClassSlider(`.js-swiper-container-${i}`, "remove");
      const swiperContainerOuter = document.querySelector(
        `.js-swiper-item-outer-container-${i}`
      );
      const swiperItemsOuter =
        swiperContainerOuter &&
        swiperContainerOuter.querySelectorAll(".js-swiper-item-outer");
      const swiperContainer =
        document.querySelector(`.js-swiper-container-${i} .row`) ||
        document.querySelector(`.js-swiper-container-${i}`);
      if (swiperContainerOuter && swiperItemsOuter.length > 0) {
        swiperItemsOuter.forEach((swiperItemOuter) => {
          swiperContainer.appendChild(swiperItemOuter);
        });
      }
    }
  } else if (!mQuery.matches && !swiper[0]) {
    for (let i = 0; i < swiper.length; i++) {
      const swiperContainerOuter = document.querySelector(
        `.js-swiper-item-outer-container-${i}`
      );
      const cardInteractive = document.querySelector(
        `.js-swiper-container-${i} .js-index-cards-container--interactive`
      );
      const swiperItemsOuter =
        swiperContainerOuter &&
        swiperContainerOuter.querySelectorAll(".js-swiper-item-outer");
      if (swiperContainerOuter && swiperItemsOuter.length > 0) {
        console.log({ swiperContainerOuter });
        swiperItemsOuter.forEach((swiperItemOuter) => {
          swiperContainerOuter.appendChild(swiperItemOuter);
        });
      }
      controlClassSlider(`.js-swiper-container-${i}`, "add");
      swiper[i] = new Swiper(`.js-swiper-container-${i}`, {
        autoHeight: false, //enable auto height
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      });
      if (cardInteractive) {
        const cardInteractiveChildren = cardInteractive.children;
        let e = 0;
        while (
          !cardInteractiveChildren[e].classList.contains(
            "index-card--interactive--active"
          )
        ) {
          e++;
        }
        swiper[i].pagination.bullets[e].click();
      }
    }
  }
}
ControlShowSlider();
const throttledControlShowSlider = _.throttle(ControlShowSlider, 60);
window.addEventListener("resize", throttledControlShowSlider);

const cardsContainerInteractive = document.querySelector(
  ".js-index-cards-container--interactive"
);
if (cardsContainerInteractive) {
  function activeCard(event) {
    const activeItem = cardsContainerInteractive.querySelector(
      ".index-card--interactive--active"
    );
    const activeID = activeItem.dataset.showId;

    activeItem.classList.remove("index-card--interactive--active");
    const fullCardVisible = document.querySelector(
      "[data-id=" + activeID + "]"
    );
    fullCardVisible && fullCardVisible.classList.add("index-card--hidden");
    this.classList.add("index-card--interactive--active");
    const newActiveID = this.dataset.showId;
    const newFullCardVisible = document.querySelector(
      "[data-id=" + newActiveID + "]"
    );
    if (newFullCardVisible) {
      newFullCardVisible.classList.remove("index-card--hidden");
      newFullCardVisible
        .querySelectorAll("[class*=js-swiper-container-]")
        .forEach((swiperSlider) => {
          if (swiperSlider.swiper) {
            swiperSlider.swiper.update();
          }
        });
    }
  }
  function generateEventListener(eventName) {
    document.addEventListener(
      eventName,
      (event) => {
        const elements = cardsContainerInteractive.querySelectorAll(
          ".js-index-cards--interactive"
        );
        const path = event.composedPath();
        path.forEach((node) => {
          elements.forEach((elem) => {
            if (node === elem) {
              activeCard.call(elem, event);
            }
          });
        });
      },
      true
    );
  }

  generateEventListener("click");
  generateEventListener("touchstart");
}
const tabInteractive = document.querySelector(".js-tab-interactive");
if (tabInteractive) {
  function activateTab(event) {
    if (this.getAttribute("aria-selected") === "true") return;
    const actualActiveTab = tabInteractive.querySelector(
      "[aria-selected=true]"
    );
    if (actualActiveTab) {
      actualActiveTab.setAttribute("aria-selected", "false");
      const actualActivePanel = tabInteractive.querySelector(
        `#${actualActiveTab.getAttribute("aria-controls")}`
      );
      actualActivePanel.classList.add("hidden");
    }
    this.setAttribute("aria-selected", "true");
    const newActivePanel = tabInteractive.querySelector(
      `#${this.getAttribute("aria-controls")}`
    );
    newActivePanel.classList.remove("hidden");
  }

  function generateEventListener(eventName) {
    document.addEventListener(
      eventName,
      (event) => {
        const elements = tabInteractive.querySelectorAll("[role=tab]");
        const path = event.composedPath();
        path.forEach((node) => {
          elements.forEach((elem) => {
            if (node === elem) {
              activateTab.call(elem, event);
            }
          });
        });
      },
      true
    );
  }

  generateEventListener("click");
  generateEventListener("touchstart");
}
const formRanges = document.querySelectorAll(".js-form-range");
if (formRanges) {
  formRanges.forEach((formRange) => {
    const formRangeOutput = document.querySelector(`#${formRange.id}Output`);
    const updateFormRange = (event) => {
      const measure = formRangeOutput.dataset.unitMeasure;
      formRangeOutput.value = measure
        ? `${formRange.value} ${measure}`
        : formRange.value;
      const percentPos =
        ((formRange.value - formRange.min) * 100) / formRange.max;
      let sliderMargin;
      if (percentPos <= 50) {
        sliderMargin = ((50 - percentPos) * 0.75) / 50;
      } else {
        sliderMargin = ((percentPos - 50) * -0.75) / 50;
      }
      formRangeOutput.style.marginLeft = `calc(${percentPos}% - ${
        formRangeOutput.clientWidth / 2
      }px + ${sliderMargin}rem)`;
    };
    formRange.oninput = updateFormRange;
    formRange.value = 0;
    updateFormRange();
  });
}
const measureAnchorForm = document.querySelector(".js-measure-anchor-form");

if (measureAnchorForm) {
  const formInputs = measureAnchorForm.querySelectorAll("input");
  formInputs.forEach((formInput) => {
    formInput.addEventListener(
      "input",
      (event) => {
        let i = 0;
        let formFilling = true;
        do {
          formFilling = formInputs[i].value !== "";
          i++;
        } while (formFilling && i < formInputs.length);
        const laceLength = measureAnchorForm.querySelector(
          "#measureAnchorFormLaceLength"
        );
        const maximumThickness = measureAnchorForm.querySelector(
          "#measureAnchorFormMaximumThickness"
        );
        if (formFilling) {
          const hd = parseFloat(
            measureAnchorForm.querySelector("#measureAnchorFormThickness").value
          );
          const ttol =
            parseFloat(
              measureAnchorForm.querySelector(
                "#measureAnchorFormLayerThickness"
              ).value
            ) +
            parseFloat(
              measureAnchorForm.querySelector("#measureAnchorFormLayer").value
            );
          const hef = parseFloat(
            measureAnchorForm.querySelector("#measureAnchorFormDepth").value
          );
          const la = hd + ttol + hef;
          const maxHd = la - ttol - hef;

          const laceLengthMeasure = laceLength.dataset.unitMeasure;
          laceLength.value = laceLengthMeasure
            ? `${la} ${laceLengthMeasure}`
            : la;
          const maximumThicknessMeasure = maximumThickness.dataset.unitMeasure;
          maximumThickness.value = maximumThicknessMeasure
            ? `${maxHd} ${maximumThicknessMeasure}`
            : maxHd;
        } else {
          laceLength.value = "-";
          maximumThickness.value = "-";
        }
      },
      false
    );
  });
}
const formContact = document.querySelector(".js-form-contact");

if (formContact) {
  const formInputs = formContact.querySelectorAll("input, textarea");
  const formAlert = formContact.querySelector(".js-form-contact-alert");
  const formSuccess = formContact.querySelector(".js-form-contact-success");
  const formAlertText = formAlert.querySelector(".js-message");
  const formSuccessText = formSuccess.querySelector(".js-message");
  const formElements = formContact.elements;
  const validation = [
    { name: "name", validation: "empty" },
    { name: "surnames", validation: "empty" },
    { name: "company", validation: "empty" },
    { name: "email", validation: "empty" },
    { name: "phone", validation: "empty" },
    { name: "message", validation: "empty" },
    { name: "personalData", validation: "checked" },
    { name: "legalData", validation: "checked" },
  ];
  formInputs.forEach((formInput) => {
    formInput.addEventListener(
      "input",
      () => {
        const isValid = validation.every(({ name, validation }) => {
          if (validation === "empty") {
            return formElements[name].value !== "";
          } else if (validation === "checked") {
            return formElements[name].checked === true;
          }
        });
        formElements["submit"].disabled = !isValid;
      },
      false
    );
  });
  formContact.addEventListener(
    "click",
    (event) => {
      const elements = formContact.querySelectorAll(".js-btn-close");
      const path = event.composedPath();
      path.forEach((node) => {
        elements.forEach((elem) => {
          if (node === elem) {
            elem.parentElement.classList.remove("show");
            elem.parentElement.classList.add("hidden");
          }
        });
      });
    },
    true
  );
  let widgetRecaptchaId;
  formContact.addEventListener(
    "submit",
    (event) => {
      const lang = document.documentElement.lang;
      event.preventDefault();
      const data = new FormData(formContact);
      fetch("./send-contact.php", {
        method: "POST",
        body: data,
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (response) {
          if (response.estado === 500) {
            throw languages[lang][response["mensaje_estado"]];
          }
          formContact.reset();
          formAlert.classList.remove("show");
          formAlert.classList.add("hidden");
          formSuccess.classList.remove("hidden");
          formSuccessText.textContent = languages[lang].Sucess;
          formSuccess.classList.add("show");
          grecaptcha.reset();
        })
        .catch(function (err) {
          console.log(err);
          formAlert.classList.remove("hidden");
          formAlert.classList.add("show");
          formSuccess.classList.remove("show");
          formAlertText.textContent = err;
          formSuccess.classList.add("hidden");
        });
    },
    false
  );
}
