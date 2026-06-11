// Fungsi Utama untuk Transisi Card
function showCard(target) {
    const loginCard = document.getElementById('loginCard');
    const registerCard = document.getElementById('registerCard');

    if (target === 'login') {
        // Sembunyikan Register, Tampilkan Login
        registerCard.style.display = 'none';
        loginCard.style.display = 'block';
    } else if (target === 'register') {
        // Sembunyikan Login, Tampilkan Register
        loginCard.style.display = 'none';
        registerCard.style.display = 'block';
    }
}

// Fungsi Toggle Password (Dibuat Universal untuk Login & Register)
function togglePassword(formType) {
    let passwordFieldId;
    let iconId;

    // Tentukan ID elemen berdasarkan form mana yang dipanggil
    if (formType === 'login') {
        passwordFieldId = 'loginPasswordInput';
        iconId = 'loginIcon';
    } else if (formType === 'register') {
        passwordFieldId = 'registerPasswordInput';
        iconId = 'registerIcon';
    } else {
        return;
    }

    const passwordField = document.getElementById(passwordFieldId);
    const toggleIcon = document.getElementById(iconId);

    if (passwordField.type === "password") {
        // Tampilkan Password
        passwordField.type = "text"; 
        toggleIcon.classList.remove("bi-eye-slash");
        toggleIcon.classList.add("bi-eye");
    } else {
        // Sembunyikan Password
        passwordField.type = "password";
        toggleIcon.classList.remove("bi-eye");
        toggleIcon.classList.add("bi-eye-slash");
    }
}