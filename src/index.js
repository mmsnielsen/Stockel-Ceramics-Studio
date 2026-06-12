// SENT MESSAGE POPUP //

const form = document.querySelector("#contact-form");
const sentMessage = document.getElementById("sent-message-popup");

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;
    let firstInvalidField = null;

    const userDetails = form.querySelectorAll(".user-details");
    userDetails.forEach((detail) => {
      const input = detail.querySelector("input, textarea");
      const emailField = input.id === "email";
      const isEmpty = (input?.value?.trim() || "") === "";
      const isEmailValid = emailField && !validateEmail(input.value);

      if (isEmpty || isEmailValid) {
        detail.classList.add("error");
        isValid = false;
        if (!firstInvalidField) {
          firstInvalidField = input;
        }
      } else {
        detail.classList.remove("error");
      }
    });

    if (isValid) {
      sentMessage.classList.add("show");
      form.reset();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        sentMessage.classList.remove("show");
      }, 3000);
    } else {
      if (firstInvalidField) {
        firstInvalidField.focus();
      }
    }
  });

  form
    .querySelectorAll(".user-details input, .user-details textarea")
    .forEach((input) => {
      input.addEventListener("input", () => {
        const detail = input.closest(".user-details");
        if (detail.classList.contains("error")) {
          detail.classList.remove("error");
        }
      });
    });
}

// CART SIDECAR //

let cartItems = JSON.parse(localStorage.getItem("studioCart")) || [];
let globalCartCountValue = cartItems.length;

const globalCartCount = document.getElementById("global-cart-count");
const registerButtons = document.querySelectorAll(".offer-card__register-btn");
const cartSidebar = document.getElementById("cart-sidebar");
const viewCartBtn = document.getElementById("btn-view-cart");
const cartItemsList = document.getElementById("cart-items-list");
const productCards = document.querySelectorAll(".product-card");

const summaryContainer = document.getElementById("checkout-items-summary");
const checkoutForm = document.getElementById("checkout-form");
const navCartTrigger = document.getElementById("nav-cart-trigger");

document.addEventListener("DOMContentLoaded", () => {
  if (globalCartCount) globalCartCount.innerText = globalCartCountValue;

  if (viewCartBtn)
    viewCartBtn.innerText = `View Shop (${globalCartCountValue})`;

  renderCartItems();
  renderCheckoutSummary();
});

function renderCartItems() {
  if (!cartItemsList) return;

  cartItemsList.innerHTML = "";

  cartItems.forEach((item, index) => {
    const itemRow = document.createElement("div");
    itemRow.className = "cart-sidecar__item-row";

    const imgClass = item.isMembership
      ? "cart-sidecar__img--membership"
      : "cart-sidecar__img";

    itemRow.innerHTML = `
        <img src="${item.imgSrc}" class="${imgClass}" alt="Course Image" />
        <div class="cart-sidecar__item-details">
          <h3 class="cart-sidecar__item-title">${item.title}</h3>
          <p class="cart-sidecar__item-price">${item.price}</p>
          <p class="cart-sidecar__item-date">${item.date}</p>
        </div>
        <button class="btn-remove-item" data-index="${index}">&times;</button>
      `;

    cartItemsList.appendChild(itemRow);
  });

  const removeButtons = cartItemsList.querySelectorAll(".btn-remove-item");
  removeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const itemIndex = parseInt(button.getAttribute("data-index"));
      cartItems.splice(itemIndex, 1);
      globalCartCountValue = cartItems.length;

      if (globalCartCount) globalCartCount.innerText = globalCartCountValue;
      if (viewCartBtn)
        viewCartBtn.innerText = `View Shop (${globalCartCountValue})`;

      renderCartItems();
    });
  });

  localStorage.setItem("studioCart", JSON.stringify(cartItems));
}

function renderCheckoutSummary() {
  if (!summaryContainer) return;

  summaryContainer.innerHTML = "";

  if (cartItems.length === 0) {
    summaryContainer.innerHTML = `<p style="color: #888; padding: 20px 0;">Your cart is currently empty. <a href="index.html#workshops" style="color: #973c00;">Go back to courses</a>.</p>`;
  } else {
    cartItems.forEach((item) => {
      const row = document.createElement("div");
      row.className = "cart-sidecar__item-row";

      row.innerHTML = `<img src="${item.imgSrc}" class="cart-sidecar__img" alt="Item Image" style="border-radius: 4px;" />
      <div class="cart-sidecar__item-details">
        <h3 class="cart-sidecar__item-title" style="color: #333;">${item.title}</h3>
          <p class="cart-sidecar__item-price" style="color: #973c00; font-weight: 600;">${item.price}</p>
          <p class="cart-sidecar__item-date" style="color: #666; font-size: 13px;">${item.date}</p>
        </div>
        `;
      summaryContainer.appendChild(row);
    });
  }
}

//Course registration buttons //

registerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const courseCard = button.closest(".offer-card");

    const courseTitle =
      courseCard.querySelector(".offer-card__title").innerText;

    const priceElement =
      courseCard.querySelector(".offer-card__price") ||
      courseCard.querySelector(".membership-card__price");
    const coursePrice = priceElement ? priceElement.innerText : "0€";

    const dateElement =
      courseCard.querySelector(".offer-card__date") ||
      courseCard.querySelector(".membership-card__period");
    const courseDate = dateElement ? dateElement.innerText : "Acces Plan";

    const imgElement =
      courseCard.querySelector(".offer-card__image img") ||
      courseCard.querySelector(".offer-card__image");
    const courseImgSrc = imgElement ? imgElement.src : "image/circle-check.svg";

    cartItems.push({
      title: courseTitle,
      price: coursePrice,
      date: courseDate,
      imgSrc: courseImgSrc,
      isMembership: !imgElement,
    });

    globalCartCountValue += 1;

    if (globalCartCount) {
      globalCartCount.innerText = globalCartCountValue;
    }
    if (viewCartBtn) {
      viewCartBtn.innerText = `View Shop (${globalCartCountValue})`;
    }

    renderCartItems();

    if (cartSidebar) {
      cartSidebar.classList.remove("hidden-cart");
    }
  });
});

// SHOP.HTML //

if (productCards.length > 0) {
  productCards.forEach((card) => {
    const btnDecrement = card.querySelector(".btn-decrement");
    const btnIncrement = card.querySelector(".btn-increment");
    const quantityDisplay = card.querySelector(".quantity");
    const btnAddToCart = card.querySelector(".btn-add-to-cart");

    let currentQty = 0;

    if (btnIncrement) {
      btnIncrement.addEventListener("click", () => {
        currentQty += 1;
        quantityDisplay.innerText = currentQty;
      });
    }

    if (btnDecrement) {
      btnDecrement.addEventListener("click", () => {
        if (currentQty > 0) {
          currentQty -= 1;
          quantityDisplay.innerText = currentQty;
        }
      });
    }

    if (btnAddToCart) {
      btnAddToCart.addEventListener("click", () => {
        if (currentQty === 0) {
          alert("Please select a quantity before adding to cart.");
          return;
        }

        const productTitle = card.querySelector(
          ".product-card__title",
        ).innerText;
        const productPrice = card.querySelector(
          ".product-card__price",
        ).innerText;

        const imgElement = card.querySelector(".product-card__image img");
        const productImgSrc = imgElement
          ? imgElement.src
          : "image/cart-shopping.svg";

        for (let i = 0; i < currentQty; i++) {
          cartItems.push({
            title: productTitle,
            price: productPrice,
            date: "Studio Merchandise", // Clean custom placeholder text line
            imgSrc: productImgSrc,
            isMembership: false,
          });
        }

        globalCartCountValue += currentQty;
        if (globalCartCount) globalCartCount.innerText = globalCartCountValue;
        if (viewCartBtn)
          viewCartBtn.innerText = `View Shop (${globalCartCountValue})`;

        renderCartItems();

        if (cartSidebar) {
          cartSidebar.classList.remove("hidden-cart");
        }

        currentQty = 0;
        quantityDisplay.innerText = "0";
      });
    }
  });
}

// auto close listeners //

if (cartSidebar) {
  cartSidebar.addEventListener("click", (e) => {
    if (e.target === cartSidebar) {
      cartSidebar.classList.add("hidden-cart");
    }
  });
}

if (navCartTrigger && cartSidebar) {
  navCartTrigger.addEventListener("click", (e) => {
    e.preventDefault();
    cartSidebar.classList.remove("hidden-cart");
  });
}

// TERMS CHECKBOX //

document.addEventListener("submit", (e) => {
  if (e.target && e.target.id === "checkout-form") {
    e.preventDefault();

    let isCheckoutValid = true;
    let firstCheckoutInvalidField = null;

    const activeForm = e.target;
    const checkoutName = activeForm.querySelector("#checkout-name");
    const checkoutEmail = activeForm.querySelector("#checkout-email");
    const checkoutPhone = activeForm.querySelector("#checkout-phone");
    const termsCheckbox = activeForm.querySelector("#checkout-terms");
    const registrationPopup = document.getElementById("registration-msg-popup");

    activeForm.querySelectorAll("input").forEach((input) => {
      input.style.borderColor = "";
      input.style.backgroundColor = "";
    });

    if (checkoutName && checkoutName.value.trim() === "") {
      checkoutName.style.borderColor = "#ef4444";
      checkoutName.style.backgroundColor = "#fef2f2";
      isCheckoutValid = false;
      if (!firstCheckoutInvalidField) firstCheckoutInvalidField = checkoutName;
    }

    const validateCheckoutEmailStr = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );
    };

    if (
      checkoutEmail &&
      (checkoutEmail.value.trim() === "" ||
        !validateCheckoutEmailStr(checkoutEmail.value))
    ) {
      checkoutEmail.style.borderColor = "#ef4444";
      checkoutEmail.style.backgroundColor = "#fef2f2";
      isCheckoutValid = false;
      if (!firstCheckoutInvalidField) firstCheckoutInvalidField = checkoutEmail;
    }

    if (checkoutPhone && checkoutPhone.value.trim() === "") {
      checkoutPhone.style.borderColor = "#ef4444";
      checkoutPhone.style.backgroundColor = "#fef2f2";
      isCheckoutValid = false;
      if (!firstCheckoutInvalidField) firstCheckoutInvalidField = checkoutPhone;
    }

    if (termsCheckbox && !termsCheckbox.checked) {
      alert(
        "You must agree to the Terms of Service and Student Contract to continue.",
      );
      return;
    }

    if (isCheckoutValid) {
      if (registrationPopup) {
        registrationPopup.classList.add("show");
      }

      activeForm.reset();

      cartItems = [];
      globalCartCountValue = 0;
      localStorage.removeItem("studioCart");

      const globalCartCount = document.getElementById("global-cart-count");
      if (globalCartCount) globalCartCount.innerText = "0";

      window.scrollTo({ top: 0, behavior: "smooth" });

      setTimeout(() => {
        if (registrationPopup) registrationPopup.classList.remove("show");
        window.location.href = "index.html";
      }, 3000);
    } else {
      if (firstCheckoutInvalidField) {
        firstCheckoutInvalidField.focus();
      }
    }
  }
});

document.addEventListener("input", (e) => {
  if (e.target && e.target.closest("#checkout-form")) {
    e.target.style.borderColor = "";
    e.target.style.backgroundColor = "";
  }
});
