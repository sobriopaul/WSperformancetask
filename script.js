const form = document.getElementById("registrationForm");
const successMessage = document.getElementById("successMessage");
const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const agreement = document.getElementById("agreement");
const agreementError = document.getElementById("agreementError");

const fields = form.querySelectorAll("[data-validate]");

document.getElementById("dob").setAttribute(
    "max",
    new Date().toISOString().split("T")[0]
);

function getErrorMessage(field) {
    if (field === agreement) {
        return agreementError;
    }

    return field.closest(".field").querySelector(".error-message");
}

function clearError(field) {
    field.classList.remove("error");
    getErrorMessage(field).textContent = "";
    field.removeAttribute("aria-invalid");
}

function showError(field, message) {
    field.classList.add("error");
    field.setAttribute("aria-invalid", "true");
    getErrorMessage(field).textContent = message;
}

function validateField(field) {
    let value = field.value.trim();
    let message = "";
    const rule = field.dataset.validate;

    if (field.type !== "password" && field.type !== "checkbox") {
        field.value = value;
    }

    if (rule === "required" && value === "") {
        message = field.dataset.error;
    }

    else if (["email", "phone", "password", "confirm"].includes(rule) && value === "") {
        message = field.dataset.error;
    }

    else if (rule === "email" && value !== "") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(value)) {
            message = field.dataset.error;
        }
    }

    else if (rule === "phone" && value !== "") {
        const phonePattern = /^(09\d{9}|\+639\d{9})$/;

        if (!phonePattern.test(value)) {
            message = field.dataset.error;
        }
    }

    else if (rule === "password" && value !== "") {
        if (value.length < 8) {
            message = field.dataset.error;
        }
    }

    else if (rule === "confirm" && value !== "") {
        if (value !== password.value) {
            message = field.dataset.error;
        }
    }

    else if (rule === "agreement" && !field.checked) {
        message = field.dataset.error;
    }

    if (field.id === "dob" && value !== "") {
        const today = new Date().toISOString().split("T")[0];

        if (value > today) {
            message = "Date of birth cannot be in the future.";
        }
    }

    if (message) {
        showError(field, message);
        return false;
    }

    clearError(field);
    return true;
}

fields.forEach(function(field) {
    field.addEventListener("input", function() {
        validateField(field);

        if (field === password && confirmPassword.value !== "") {
            validateField(confirmPassword);
        }
    });

    field.addEventListener("change", function() {
        validateField(field);
    });

    field.addEventListener("blur", function() {
        validateField(field);
    });
});

togglePassword.addEventListener("click", function() {
    const isHidden = password.type === "password";

    password.setAttribute("type", isHidden ? "text" : "password");
    confirmPassword.setAttribute("type", isHidden ? "text" : "password");

    togglePassword.classList.toggle("active", isHidden);

    togglePassword.textContent = isHidden
        ? "Hide passwords"
        : "Show passwords";

    togglePassword.setAttribute("aria-pressed", String(isHidden));
});

form.addEventListener("submit", function(event) {
    event.preventDefault();

    let isFormValid = true;

    fields.forEach(function(field) {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });

    if (!isFormValid) {
        successMessage.hidden = true;

        const firstInvalid = form.querySelector(".error");

        if (firstInvalid) {
            firstInvalid.focus();
        }

        return;
    }

    fields.forEach(function(field) {
        clearError(field);
    });

    successMessage.textContent = "Registration successful!";

    successMessage.hidden = false;
    successMessage.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
});

form.addEventListener("reset", function() {
    setTimeout(function() {
        fields.forEach(function(field) {
            clearError(field);
        });

        successMessage.hidden = true;

        password.setAttribute("type", "password");
        confirmPassword.setAttribute("type", "password");

        togglePassword.classList.remove("active");
        togglePassword.textContent = "Show passwords";
        togglePassword.setAttribute("aria-pressed", "false");
    }, 0);
});