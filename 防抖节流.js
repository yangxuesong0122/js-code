// 函数防抖(debounce)：触发高频事件后n秒内函数只会执行一次，如果n秒内高频事件再次被触发，则重新计算时间。
// 实现方式：每次触发事件时设置一个延迟调用方法，并且取消之前的延时调用方法
// 缺点：如果事件在规定的时间间隔内被不断的触发，则调用方法会被不断的延迟

/*---非立即执行版(开始)---*/
function debounce(fn, delay) {
    let timeout = null; // 创建一个标记用来存放定时器的返回值
    return function () {
        let context = this; // 注意 this 指向
        let args = arguments; // arguments中存着e
        // 每当用户输入的时候把前一个setTimeout clear掉
        if (timeout) clearTimeout(timeout);
        // 然后又创建一个新的setTimeout, 这样就能保证interval间隔内如果时间持续触发，就不会执行fn函数
        timeout = setTimeout(() => {
            fn.apply(context, args);
        }, delay);
    };
}
/*---非立即执行版(结束)---*/

/*---立即执行版(开始) ---触发事件后函数会立即执行，然后 n 秒内不触发事件才能继续执行函数的效果。*/
function debounce(fn, delay) {
    let timeout = null;
    return function () {
        let context = this;
        let args = arguments;
        if (timeout) clearTimeout(timeout);
        let callNow = !timeout;
        timeout = setTimeout(() => {
            timeout = null;
        }, delay)
        if (callNow) fn.apply(context, args)
    }
}
/*---立即执行版(结束)*/

/*---合成版（开始）---*/
function debounce(func, wait, immediate) {
    let timer = null;
    return function() {
        let context = this
        let args = arguments;
        if (timer) clearTimeout(timer);
        if (immediate) {
            let callNow = !timer;
            timer = setTimeout(() => {
                timer = null;
            }, wait);
            if (callNow) func.apply(context, args);
        } else {
            timer  = setTimeout(() => {
                func.apply(context, args);
            }, wait)
        }
    }
}
/*---合成版(结束)*/

// 处理函数
function handle() {
    console.log('防抖：', Math.random());
}
//滚动事件
window.addEventListener('scroll', debounce(handle,500));

// --------------------------------------------------------------------------------------------------------------------------------------------
// 函数节流(throttle)：高频事件触发，但在n秒内只会执行一次，所以节流会稀释函数的执行频率。
// 实现方式：每次触发事件时，如果当前有等待执行的延时函数，则直接return

// 节流throttle代码一：
function throttle(fn, delay) {
    let canRun = true; // 通过闭包保存一个标记
    return function () {
        // 在函数开头判断标记是否为true，不为true则return
        if (!canRun) return;
        // 立即设置为false
        canRun = false;
        // 将外部传入的函数的执行放在setTimeout中
        setTimeout(() => {
            // 最后在setTimeout执行完毕后再把标记设置为true(关键)表示可以执行下一次循环了。
            // 当定时器没有执行的时候标记永远是false，在开头被return掉
            fn.apply(this, arguments);
            canRun = true;
        }, delay);
    };
}

// 节流throttle代码二：
function throttle(fn, delay) {
    let timeout = null;
    return function() {
        let context = this;
        let args = arguments;
        if (!timeout) {
            timeout = setTimeout(() => {
                timeout = null;
                fn.apply(context, args)
            }, delay)
        }
    }
}
function sayHi(e) {
    console.log('节流：', e.target.innerWidth, e.target.innerHeight);
}
window.addEventListener('resize', throttle(sayHi,500));