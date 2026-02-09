// Founder Form JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('founderForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
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
        
        // 驗證電話
        const phone = document.getElementById('phone');
        const phoneRegex = /^[\d\-\+\(\)\s]+$/;
        if (!phone.value.trim() || !phoneRegex.test(phone.value)) {
            phone.classList.add('error');
            document.getElementById('phoneError').style.display = 'block';
            isValid = false;
        }
        
        // 驗證職業
        const occupation = document.getElementById('occupation');
        if (!occupation.value) {
            occupation.classList.add('error');
            document.getElementById('occupationError').style.display = 'block';
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
        const API_URL = 'https://script.google.com/macros/s/AKfycbz4ajM6fNpvCCKHnGl87K7pAZtAgQg9iceQh9OKTmNYKR7ZpTMzpwFScrh14y7OsBNO/exec';
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                mode: 'no-cors', // Google Apps Script 需要 no-cors 模式
                headers: {
                    'Content-Type': 'application/json',
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
            電話: document.getElementById('phone').value.trim(),
            LINE_ID: document.getElementById('lineId').value.trim(),
            職業: document.getElementById('occupation').value,
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
    
    document.getElementById('phone').addEventListener('blur', function() {
        const phoneRegex = /^[\d\-\+\(\)\s]+$/;
        if (this.value.trim() && phoneRegex.test(this.value)) {
            this.classList.remove('error');
            document.getElementById('phoneError').style.display = 'none';
        }
    });
    
    document.getElementById('occupation').addEventListener('change', function() {
        if (this.value) {
            this.classList.remove('error');
            document.getElementById('occupationError').style.display = 'none';
        }
    });
    
    // 清除錯誤狀態當用戶開始輸入
    document.querySelectorAll('.form-input, .form-select').forEach(input => {
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
