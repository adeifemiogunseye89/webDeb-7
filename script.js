document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selection ---
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const messageInput = document.getElementById('message');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');

    const successMessage = document.getElementById('successMessage');
    const submitButton = document.getElementById('submitButton');

    const themeSwitcher = document.getElementById('themeSwitcher');
    const preferenceDisplay = document.getElementById('preferenceDisplay');
    const animatedBox = document.getElementById('animatedBox');

    const LS_THEME_KEY = 'userPreferredTheme';
    const LS_FORM_NAME_KEY = 'savedFormName';
    const LS_FORM_EMAIL_KEY = 'savedFormEmail';

    // --- Helper Functions (Validation - same as before) ---
    function showError(inputElement, errorElement, message) {
        errorElement.textContent = message;
        inputElement.classList.add('invalid');
        inputElement.classList.remove('valid');
    }

    function clearError(inputElement, errorElement) {
        errorElement.textContent = '';
        inputElement.classList.remove('invalid');
        // Optionally add 'valid' class if you have styles for it
        // inputElement.classList.add('valid');
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // --- Validation Functions (same as before, but added 'valid' class removal for consistency) ---
    function validateName() {
        if (nameInput.value.trim() === '') {
            showError(nameInput, nameError, 'Full Name is required.');
            return false;
        }
        clearError(nameInput, nameError);
        nameInput.classList.add('valid'); // Add valid class
        return true;
    }

    function validateEmail() {
        const emailValue = emailInput.value.trim();
        if (emailValue === '') {
            showError(emailInput, emailError, 'Email Address is required.');
            return false;
        } else if (!isValidEmail(emailValue)) {
            showError(emailInput, emailError, 'Please enter a valid email address.');
            return false;
        }
        clearError(emailInput, emailError);
        emailInput.classList.add('valid'); // Add valid class
        return true;
    }

    function validatePassword() {
        const passwordValue = passwordInput.value;
        if (passwordValue === '') {
            showError(passwordInput, passwordError, 'Password is required.');
            return false;
        } else if (passwordValue.length < 8) {
            showError(passwordInput, passwordError, 'Password must be at least 8 characters long.');
            return false;
        }
        clearError(passwordInput, passwordError);
        passwordInput.classList.add('valid'); // Add valid class
        return true;
    }

    function validateConfirmPassword() {
        const passwordValue = passwordInput.value;
        const confirmPasswordValue = confirmPasswordInput.value;
        if (confirmPasswordValue === '') {
            showError(confirmPasswordInput, confirmPasswordError, 'Please confirm your password.');
            return false;
        } else if (passwordValue !== confirmPasswordValue) {
            showError(confirmPasswordInput, confirmPasswordError, 'Passwords do not match.');
            return false;
        }
        clearError(confirmPasswordInput, confirmPasswordError);
        confirmPasswordInput.classList.add('valid'); // Add valid class
        return true;
    }

    // --- Theme Management ---
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            themeSwitcher.textContent = '☀️'; // Sun icon for dark mode
            themeSwitcher.setAttribute('aria-label', 'Switch to light theme');
        } else {
            document.body.classList.remove('dark-theme');
            themeSwitcher.textContent = '🌙'; // Moon icon for light mode
            themeSwitcher.setAttribute('aria-label', 'Switch to dark theme');
        }
        localStorage.setItem(LS_THEME_KEY, theme);
        updatePreferenceDisplay();
    }

    function toggleTheme() {
        const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    }

    themeSwitcher.addEventListener('click', toggleTheme);

    // --- Local Storage for Form Data (Simple Persistence) ---
    function saveFormData() {
        try {
            localStorage.setItem(LS_FORM_NAME_KEY, nameInput.value);
            localStorage.setItem(LS_FORM_EMAIL_KEY, emailInput.value);
            updatePreferenceDisplay(); // Update display after saving
        } catch (e) {
            console.warn("Could not save form data to localStorage:", e);
        }
    }

    function loadFormData() {
        try {
            const savedName = localStorage.getItem(LS_FORM_NAME_KEY);
            const savedEmail = localStorage.getItem(LS_FORM_EMAIL_KEY);
            if (savedName) nameInput.value = savedName;
            if (savedEmail) emailInput.value = savedEmail;
        } catch (e) {
            console.warn("Could not load form data from localStorage:", e);
        }
    }

    // Save on input/blur (can be debounced for performance on 'input')
    nameInput.addEventListener('blur', saveFormData);
    emailInput.addEventListener('blur', saveFormData);
    // Or use 'input' for more real-time saving, but consider debouncing:
    // nameInput.addEventListener('input', debounce(saveFormData, 500));
    // emailInput.addEventListener('input', debounce(saveFormData, 500));

    function clearSavedFormData() {
        try {
            localStorage.removeItem(LS_FORM_NAME_KEY);
            localStorage.removeItem(LS_FORM_EMAIL_KEY);
        } catch (e) {
            console.warn("Could not clear form data from localStorage:", e);
        }
    }

    // --- Dynamic Preference Display ---
    function updatePreferenceDisplay() {
        const currentTheme = localStorage.getItem(LS_THEME_KEY) || 'light';
        const savedName = localStorage.getItem(LS_FORM_NAME_KEY);
        let displayText = `Current theme: ${currentTheme}.`;
        if (savedName) {
            displayText += ` Welcome back, ${savedName}!`;
        }
        preferenceDisplay.textContent = displayText;
    }


    // --- User-Triggered Animation ---
    animatedBox.addEventListener('click', () => {
        // Remove class first to allow re-triggering if already applied
        animatedBox.classList.remove('pulse-animation');
        // Force reflow to ensure animation restarts if clicked rapidly
        void animatedBox.offsetWidth;
        // Add class to trigger animation
        animatedBox.classList.add('pulse-animation');

        // Optional: Remove class after animation ends to allow re-trigger
        // animatedBox.addEventListener('animationend', () => {
        //     animatedBox.classList.remove('pulse-animation');
        // }, { once: true }); // {once: true} removes listener after it fires
    });


    // --- Event Listeners for real-time validation feedback ---
    nameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('blur', validateEmail);
    passwordInput.addEventListener('blur', () => {
        validatePassword();
        if (confirmPasswordInput.value.trim() !== '') validateConfirmPassword();
    });
    confirmPasswordInput.addEventListener('blur', validateConfirmPassword);


    // --- Form Submission Handler ---
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        successMessage.style.display = 'none'; // Hide previous success

        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();

        if (isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
            successMessage.innerHTML = `Thank you, <strong>${nameInput.value}</strong>! Your message has been sent.`;
            successMessage.style.display = 'block';
            form.reset();
            clearSavedFormData(); // Clear saved name/email after successful submission
            updatePreferenceDisplay(); // Update display text

            // Clear visual validation states
            [nameInput, emailInput, passwordInput, confirmPasswordInput, messageInput].forEach(input => {
                input.classList.remove('invalid', 'valid');
            });
            [nameError, emailError, passwordError, confirmPasswordError].forEach(errEl => errEl.textContent = '');


            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);
        } else {
            if (!isNameValid) nameInput.focus();
            else if (!isEmailValid) emailInput.focus();
            else if (!isPasswordValid) passwordInput.focus();
            else if (!isConfirmPasswordValid) confirmPasswordInput.focus();
        }
    });

    // --- Initial Page Load Setup ---
    function initializePage() {
        // Load saved theme
        const savedTheme = localStorage.getItem(LS_THEME_KEY);
        applyTheme(savedTheme || 'light'); // Default to light if nothing saved

        // Load saved form data
        loadFormData();

        // Update preference display initially
        updatePreferenceDisplay();
    }

    initializePage();

}); // End DOMContentLoaded

// Simple debounce function (optional, for 'input' event listeners on form fields)
// function debounce(func, delay) {
//     let timeout;
//     return function(...args) {
//         clearTimeout(timeout);
//         timeout = setTimeout(() => func.apply(this, args), delay);
//     };
// }