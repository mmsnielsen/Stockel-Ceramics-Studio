const form = document.querySelector("#contact-form");
const sentMessage = document.getElementById("sent-message-popup");

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let isValid = true;
  let firstInvalidField = null;

  const userDetails = form.querySelectorAll(".user-details");
  userDetails.forEach((detail) => {
    const input = detail.querySelector("input, textarea");
    const emailField = input.id === "email";
    const isEmpty = input.value.trim() === "";
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
