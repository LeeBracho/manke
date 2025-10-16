// 这是一个共享的JavaScript文件，用于处理网站的通用功能
// 包括导航栏滚动效果、移动端菜单切换和页面动画等

// 等待DOM内容加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化导航栏效果
    initNavbar();
    
    // 初始化页面动画
    initAnimations();
});

/**
 * 初始化导航栏效果
 * 包括滚动时的阴影效果和移动端菜单的切换
 */
function initNavbar() {
    // 获取导航栏元素
    const navbar = document.getElementById('navbar');
    
    if (navbar) {
        // 添加滚动事件监听器，实现导航栏滚动效果
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('shadow-md');
                navbar.classList.remove('shadow-sm');
            } else {
                navbar.classList.remove('shadow-md');
                navbar.classList.add('shadow-sm');
            }
        });
        
        // 初始化移动端菜单
        initMobileMenu();
    }
}

/**
 * 初始化移动端菜单
 * 实现菜单的显示和隐藏功能
 */
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            // 切换菜单的显示状态
            mobileMenu.classList.toggle('hidden');
        });
        
        // 点击移动端菜单中的链接后关闭菜单
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
            });
        });
    }
}

/**
 * 初始化页面动画
 * 为页面元素添加滚动时的淡入动画
 */
function initAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    fadeElements.forEach(element => {
        // 设置初始透明度为0
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        element.style.transform = 'translateY(20px)';
    });
    
    // 创建IntersectionObserver用于观察元素是否进入视口
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 元素进入视口时显示元素并应用动画
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // 停止观察已经显示的元素
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1, // 当元素10%进入视口时触发
        rootMargin: '0px 0px -50px 0px' // 扩展视口边界，使动画提前触发
    });
    
    // 开始观察所有需要淡入的元素
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * 平滑滚动到页面指定位置
 * @param {string} targetId - 目标元素的ID
 */
function scrollToTarget(targetId) {
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
        // 计算目标元素的顶部位置，减去导航栏的高度
        const navbarHeight = document.getElementById('navbar').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        
        // 平滑滚动到目标位置
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

/**
 * 表单验证函数
 * 检查表单输入是否有效
 * @param {HTMLFormElement} form - 要验证的表单元素
 * @returns {boolean} - 表单是否验证通过
 */
function validateForm(form) {
    // 重置所有错误提示
    const errorElements = form.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.remove();
    });
    
    let isValid = true;
    
    // 获取所有必填字段
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            showError(field, '此字段为必填项');
        } else if (field.type === 'email') {
            // 验证邮箱格式
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                showError(field, '请输入有效的邮箱地址');
            }
        } else if (field.type === 'tel') {
            // 验证电话号码格式（简单验证）
            const phoneRegex = /^[0-9\-+\s]+$/;
            if (!phoneRegex.test(field.value)) {
                isValid = false;
                showError(field, '请输入有效的电话号码');
            }
        }
    });
    
    return isValid;
}

/**
 * 显示表单错误信息
 * @param {HTMLElement} field - 产生错误的表单字段
 * @param {string} message - 错误信息
 */
function showError(field, message) {
    // 检查是否已经存在错误信息
    let errorElement = field.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) {
        // 创建新的错误信息元素
        errorElement = document.createElement('div');
        errorElement.className = 'error-message text-red-500 text-sm mt-1';
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
    
    // 设置错误信息
    errorElement.textContent = message;
    
    // 为输入框添加边框高亮
    field.classList.add('border-red-500');
    
    // 当用户开始输入时移除错误提示
    field.addEventListener('input', function removeError() {
        errorElement.textContent = '';
        field.classList.remove('border-red-500');
        field.removeEventListener('input', removeError);
    });
}

/**
 * 防抖函数
 * 用于限制函数的调用频率
 * @param {Function} func - 要执行的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} - 防抖后的函数
 */
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * 节流函数
 * 用于限制函数的执行频率
 * @param {Function} func - 要执行的函数
 * @param {number} limit - 时间限制（毫秒）
 * @returns {Function} - 节流后的函数
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 设置当前导航项为活动状态
 * 根据当前页面的URL路径，高亮显示对应的导航链接
 */
function setActiveNavItem() {
    // 获取当前页面的路径
    const currentPath = window.location.pathname;
    // 获取所有导航链接
    const navLinks = document.querySelectorAll('#navbar a, #mobile-menu a');
    
    // 遍历所有导航链接
    navLinks.forEach(link => {
        // 获取链接的路径
        const linkPath = new URL(link.href).pathname;
        
        // 如果链接路径与当前页面路径匹配，添加活动状态类
        if (linkPath === currentPath || 
            (currentPath === '/' && linkPath === '/index.html')) {
            link.classList.add('font-bold', 'text-blue-600');
            link.classList.remove('text-gray-600');
        } else {
            link.classList.remove('font-bold', 'text-blue-600');
            link.classList.add('text-gray-600');
        }
    });
}

/**
 * 初始化平滑滚动效果
 * 为所有内部链接添加平滑滚动行为
 */
function initSmoothScroll() {
    // 获取所有内部链接（href以#开头的链接）
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 阻止默认的点击行为
            e.preventDefault();
            
            // 获取目标元素的ID
            const targetId = this.getAttribute('href');
            
            // 如果目标ID不为空，并且存在对应的元素
            if (targetId !== '#' && document.querySelector(targetId)) {
                // 滚动到目标元素
                scrollToTarget(targetId.substring(1));
            }
        });
    });
}