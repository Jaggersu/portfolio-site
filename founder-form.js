// Founder Form JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('founderForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const sameAddressCheckbox = document.getElementById('sameAddress');
    const registeredAddressInput = document.getElementById('registeredAddress');
    const mailingAddressInput = document.getElementById('mailingAddress');
    const logoLink = document.querySelector('.logo-link');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // 地址複製功能
    function syncAddress() {
        if (sameAddressCheckbox.checked) {
            mailingAddressInput.value = registeredAddressInput.value;
            mailingAddressInput.readOnly = true;
            mailingAddressInput.style.backgroundColor = '#f8f9fa';
        } else {
            mailingAddressInput.readOnly = false;
            mailingAddressInput.style.backgroundColor = 'white';
        }
    }
    
    // Mobile Navigation Toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Logo click to go to home page
    logoLink.addEventListener('click', (e) => {
        e.preventDefault();
        // Close mobile menu if open
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        // Navigate to home page
        window.location.href = 'index.html';
    });
    
    // 監聽地址複製 checkbox
    sameAddressCheckbox.addEventListener('change', syncAddress);
    
    // 監聽戶籍地址變動
    registeredAddressInput.addEventListener('input', function() {
        if (sameAddressCheckbox.checked) {
            mailingAddressInput.value = this.value;
        }
    });
    
    // 表單驗證
    function validateForm() {
        let isValid = true;
        
        // 清除之前的錯誤狀態
        document.querySelectorAll('.form-input, .form-select').forEach(input => {
            input.classList.remove('error');
        });
        document.querySelectorAll('.error-message').forEach(error => {
            error.style.display = 'none';
        });
        
        // 驗證姓名
        const name = document.getElementById('name');
        if (!name.value.trim()) {
            name.classList.add('error');
            document.getElementById('nameError').style.display = 'block';
            isValid = false;
        }
        
        // 驗證性別
        const gender = document.querySelector('input[name="性別"]:checked');
        if (!gender) {
            document.getElementById('genderError').style.display = 'block';
            isValid = false;
        }
        
        // 驗證出生年月日
        const birthday = document.getElementById('birthday');
        if (!birthday.value) {
            birthday.classList.add('error');
            document.getElementById('birthdayError').style.display = 'block';
            isValid = false;
        } else {
            // 檢查是否為合理日期（至少18歲）
            const birthDate = new Date(birthday.value);
            const today = new Date();
            const age = Math.floor((today - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
            if (age < 18) {
                birthday.classList.add('error');
                document.getElementById('birthdayError').textContent = '發起人需年滿18歲';
                document.getElementById('birthdayError').style.display = 'block';
                isValid = false;
            }
        }
        
        // 驗證身分證字號
        const idNumber = document.getElementById('idNumber');
        const idRegex = /^[A-Z][12]\d{8}$/;
        if (!idNumber.value.trim() || !idRegex.test(idNumber.value.trim().toUpperCase())) {
            idNumber.classList.add('error');
            document.getElementById('idNumberError').style.display = 'block';
            isValid = false;
        }
        
        // 驗證戶籍地址
        const registeredAddress = document.getElementById('registeredAddress');
        if (!registeredAddress.value.trim()) {
            registeredAddress.classList.add('error');
            document.getElementById('registeredAddressError').style.display = 'block';
            isValid = false;
        }
        
        // 驗證通訊地址
        const mailingAddress = document.getElementById('mailingAddress');
        if (!mailingAddress.value.trim()) {
            mailingAddress.classList.add('error');
            document.getElementById('mailingAddressError').style.display = 'block';
            isValid = false;
        }
        
        // 驗證電話 (台灣手機號碼格式：09xxxxxxxx 或 +886-9xxxxxxxx)
        const phone = document.getElementById('phone');
        const phoneRegex = /^(09\d{8}|\+886-?\s?9\d{8})$/;
        if (!phone.value.trim() || !phoneRegex.test(phone.value)) {
            phone.classList.add('error');
            document.getElementById('phoneError').style.display = 'block';
            isValid = false;
        }
        
        // 驗證現職公司名稱
        const company = document.getElementById('company');
        if (!company.value.trim()) {
            company.classList.add('error');
            document.getElementById('companyError').style.display = 'block';
            isValid = false;
        }
        
        // 驗證職稱
        const position = document.getElementById('position');
        if (!position.value.trim()) {
            position.classList.add('error');
            document.getElementById('positionError').style.display = 'block';
            isValid = false;
        }
        
        // 驗證同意聲明
        const agreement = document.getElementById('agreement');
        if (!agreement.checked) {
            document.getElementById('agreementError').style.display = 'block';
            isValid = false;
        }
        
        return isValid;
    }
    
    // 顯示錯誤訊息
    function showError(message) {
        errorMessage.textContent = '❌ ' + message;
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
        
        // 滾動到錯誤訊息
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // 3秒後自動隱藏
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    }
    
    // 顯示成功訊息
    function showSuccess() {
        successMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        form.style.display = 'none';
        
        // 滾動到成功訊息
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // 設置按鈕載入狀態
    function setButtonLoading(loading) {
        if (loading) {
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            submitBtn.querySelector('.submit-text').textContent = '傳送中...';
        } else {
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.querySelector('.submit-text').textContent = '送出申請';
        }
    }
    
    // 送出表單
    async function submitForm(formData) {
        const API_URL = 'https://script.google.com/macros/s/AKfycbzd0j6hHqQJ8kocguXluFJYO_6zYNzwSqLWp8vDQduBXeCv_YPWfsh7x52Vjw9k8TZJ/exec';
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                mode: 'no-cors', // 避免 CORS 錯誤
                headers: {
                    'Content-Type': 'text/plain', // 使用 text/plain 確保 GAS 能正確接收
                },
                body: JSON.stringify(formData)
            });
            
            // 由於使用 no-cors，我們無法直接讀取響應
            // 但如果沒有拋出錯誤，通常表示請求已成功發送
            return true;
        } catch (error) {
            console.error('送出錯誤:', error);
            return false;
        }
    }
    
    // 表單提交處理
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // 驗證表單
        if (!validateForm()) {
            return;
        }
        
        // 設置載入狀態
        setButtonLoading(true);
        
        // 準備要傳送的資料
        const formData = {
            type: 'founder',
            姓名: document.getElementById('name').value.trim(),
            性別: document.querySelector('input[name="性別"]:checked').value,
            出生年月日: document.getElementById('birthday').value,
            身分證字號: document.getElementById('idNumber').value.trim().toUpperCase(),
            戶籍地址: document.getElementById('registeredAddress').value.trim(),
            通訊地址: document.getElementById('mailingAddress').value.trim(),
            聯絡電話: document.getElementById('phone').value.trim(),
            現職公司名稱: document.getElementById('company').value.trim(),
            職稱: document.getElementById('position').value.trim(),
            LINE_ID: document.getElementById('lineId').value.trim(),
            提交時間: new Date().toLocaleString('zh-TW', {
                timeZone: 'Asia/Taipei',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        
        try {
            // 送出表單
            const success = await submitForm(formData);
            
            if (success) {
                // 顯示成功訊息
                showSuccess();
                
                // 重置表單
                form.reset();
                
                // 重置地址複製狀態
                mailingAddressInput.readOnly = false;
                mailingAddressInput.style.backgroundColor = 'white';
                
                // 3秒後導回首頁
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 3000);
            } else {
                throw new Error('送出失敗');
            }
        } catch (error) {
            // 顯示錯誤訊息
            showError('送出失敗，請檢查網路連線後重試。');
        } finally {
            // 恢復按鈕狀態
            setButtonLoading(false);
        }
    });
    
    // 即時驗證
    document.getElementById('name').addEventListener('blur', function() {
        if (this.value.trim()) {
            this.classList.remove('error');
            document.getElementById('nameError').style.display = 'none';
        }
    });
    
    // 性別驗證
    document.querySelectorAll('input[name="性別"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('genderError').style.display = 'none';
        });
    });
    
    // 出生年月日驗證
    document.getElementById('birthday').addEventListener('change', function() {
        if (this.value) {
            this.classList.remove('error');
            document.getElementById('birthdayError').style.display = 'none';
        }
    });
    
    // 身分證字號驗證
    document.getElementById('idNumber').addEventListener('blur', function() {
        const idRegex = /^[A-Z][12]\d{8}$/;
        if (this.value.trim() && idRegex.test(this.value.trim().toUpperCase())) {
            this.classList.remove('error');
            document.getElementById('idNumberError').style.display = 'none';
        }
    });
    
    // 戶籍地址驗證
    document.getElementById('registeredAddress').addEventListener('blur', function() {
        if (this.value.trim()) {
            this.classList.remove('error');
            document.getElementById('registeredAddressError').style.display = 'none';
        }
    });
    
    // 通訊地址驗證
    document.getElementById('mailingAddress').addEventListener('blur', function() {
        if (this.value.trim()) {
            this.classList.remove('error');
            document.getElementById('mailingAddressError').style.display = 'none';
        }
    });
    
    document.getElementById('phone').addEventListener('blur', function() {
        const phoneRegex = /^(09\d{8}|\+886-?\s?9\d{8})$/;
        if (this.value.trim() && phoneRegex.test(this.value)) {
            this.classList.remove('error');
            document.getElementById('phoneError').style.display = 'none';
        }
    });
    
    // 現職公司名稱驗證
    document.getElementById('company').addEventListener('blur', function() {
        if (this.value.trim()) {
            this.classList.remove('error');
            document.getElementById('companyError').style.display = 'none';
        }
    });
    
    // 職稱驗證
    document.getElementById('position').addEventListener('blur', function() {
        if (this.value.trim()) {
            this.classList.remove('error');
            document.getElementById('positionError').style.display = 'none';
        }
    });
    
    // 同意聲明驗證
    document.getElementById('agreement').addEventListener('change', function() {
        if (this.checked) {
            document.getElementById('agreementError').style.display = 'none';
        }
    });
    
    // 清除錯誤狀態當用戶開始輸入
    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                this.classList.remove('error');
                const errorElement = document.getElementById(this.id + 'Error');
                if (errorElement) {
                    errorElement.style.display = 'none';
                }
            }
        });
    });
});
