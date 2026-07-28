/**
 * 极简导航 - 主交互脚本
 * 功能：点赞计数、社交分享、表单处理
 */

(function() {
    'use strict';
    
    // ==================== 全局配置 ====================
    const CONFIG = {
        // localStorage 键名
        STORAGE_KEY: 'minimal_nav_likes',
        // 动画持续时间 (毫秒)
        ANIMATION_DURATION: 300
    };
    
    // ==================== 初始化 ====================
    document.addEventListener('DOMContentLoaded', function() {
        initLikeFeature();
        initGuestbookForm();
    });
    
    // ==================== 点赞功能模块 ====================
    /**
     * 初始化点赞功能
     * 从 localStorage 读取点赞数并显示
     */
    function initLikeFeature() {
        const likeBtn = document.getElementById('likeBtn');
        const likeCount = document.getElementById('likeCount');
        
        if (!likeBtn || !likeCount) return;
        
        // 读取已存储的点赞数
        let currentLikes = parseInt(localStorage.getItem(CONFIG.STORAGE_KEY)) || 0;
        
        // 初始化显示
        updateLikeDisplay(currentLikes);
        
        // 绑定点击事件
        likeBtn.addEventListener('click', function() {
            // 增加点赞数
            currentLikes++;
            
            // 保存到 localStorage
            localStorage.setItem(CONFIG.STORAGE_KEY, currentLikes.toString());
            
            // 更新显示
            updateLikeDisplay(currentLikes);
            
            // 添加动画效果
            animateLike(likeBtn);
        });
    }
    
    /**
     * 更新点赞数显示
     * @param {number} count - 点赞数量
     */
    function updateLikeDisplay(count) {
        const likeCount = document.getElementById('likeCount');
        if (likeCount) {
            likeCount.textContent = count;
        }
    }
    
    /**
     * 点赞按钮动画效果
     * @param {HTMLElement} element - 按钮元素
     */
    function animateLike(element) {
        // 添加已点赞样式
        element.classList.add('liked');
        
        // 心形图标跳动动画
        const icon = element.querySelector('i');
        if (icon) {
            icon.style.transform = 'scale(1.4)';
            setTimeout(() => {
                icon.style.transform = 'scale(1)';
            }, CONFIG.ANIMATION_DURATION);
        }
    }
    
    // ==================== 分享功能模块 ====================
    
    /**
     * 分享到指定社交平台
     * @param {string} platform - 平台名称: 'twitter', 'facebook', 'email'
     */
    window.shareTo = function(platform) {
        // 获取当前页面URL和标题
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        
        // 各平台分享链接模板
        const shareUrls = {
            twitter: `https://twitter.com/intent/tweet?url=%24{url}&text=%24{title}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=%24{url}`,
            email: `mailto:?subject=${title}&body=${url}`
        };
        
        // 打开分享窗口
        if (shareUrls[platform]) {
            // 邮件分享直接跳转，其他在新窗口打开
            if (platform === 'email') {
                window.location.href = shareUrls[platform];
            } else {
                window.open(
                    shareUrls[platform], 
                    'shareWindow', 
                    'width=600,height=400,scrollbars=yes'
                );
            }
        }
    };
    
    /**
     * 复制当前页面链接到剪贴板
     */
    window.copyLink = function() {
        const url = window.location.href;
        const messageEl = document.getElementById('copyMessage');
        
        // 使用现代 Clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url)
                .then(() => showCopyMessage('链接已复制到剪贴板！', messageEl))
                .catch(() => fallbackCopy(url, messageEl));
        } else {
            fallbackCopy(url, messageEl);
        }
    };
    
    /**
     * 兼容性复制方案 (降级处理)
     * @param {string} text - 要复制的文本
     * @param {HTMLElement} messageEl - 提示消息元素
     */
    function fallbackCopy(text, messageEl) {
        // 创建临时文本域
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        
        // 选中文本并复制
        textarea.select();
        textarea.setSelectionRange(0, text.length);
        
        try {
            document.execCommand('copy');
            showCopyMessage('链接已复制到剪贴板！', messageEl);
        } catch (err) {
            showCopyMessage('复制失败，请手动复制', messageEl);
        }
        
        // 清理
        document.body.removeChild(textarea);
    }
    
    /**
     * 显示复制成功/失败提示
     * @param {string} message - 提示文本
     * @param {HTMLElement} element - 显示元素
     */
    function showCopyMessage(message, element) {
        if (!element) return;
        
        element.textContent = message;
        element.style.opacity = '1';
        
        // 3秒后清除提示
        setTimeout(() => {
            element.textContent = '';
        }, 3000);
    }
    
    // ==================== 留言表单模块 ====================
    
    /**
     * 初始化留言表单
     * 使用 Formspree 处理表单提交
     */
    function initGuestbookForm() {
        const form = document.getElementById('guestbookForm');
        const successDiv = document.getElementById('formSuccess');
        
        if (!form) return;
        
        form.addEventListener('submit', function(event) {
            // 阻止默认提交行为 (由 Formspree 处理)
            // 这里可以添加额外的客户端验证
            
            // 可选：添加加载状态
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 提交中...';
            
            // 表单提交后由 Formspree 处理重定向
            // 成功后会跳转到 Formspree 的感谢页面或返回原页面
            // 这里不做额外处理，让表单正常提交
            
            // 模拟提交成功后的处理 (实际由 Formspree 处理)
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }, 2000);
        });
    }
    
    // ==================== 工具函数 ====================
    
    /**
     * 防抖函数
     * @param {Function} func - 要执行的函数
     * @param {number} wait - 等待时间 (毫秒)
     * @returns {Function} 防抖后的函数
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * 节流函数
     * @param {Function} func - 要执行的函数
     * @param {number} limit - 限制时间 (毫秒)
     * @returns {Function} 节流后的函数
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
    
})();