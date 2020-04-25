var isVisible = function (el) {
    return el.offsetParent !== null;
}
var timer = 0;
var defaultDelay = 2;//In seconds
var defaultDelayMs = defaultDelay * 1000;//In seconds
var waitForItem = function (selector, callback, parent) {
    console.log('Waiting for: ', selector);
    clearTimeout(timer);
    parent = parent || document;
    var items = parent.querySelectorAll(selector);
    for (let i = 0; i < items.length; i++) {
        const element = items[i];
        if (isVisible(element)) {
            console.log('Found: ', selector);
            callback(element);
            return;
        }
    }
    console.log('Retrying wait for: ', selector);
    ((selector, callback) => {
        timer = setTimeout(() => { waitForItem(selector, callback) }, defaultDelayMs);
    })(selector, callback);
}
var waitToHideDialog = function (selector, callback, parent) {
    console.log('Waiting to hide: ', selector);
    clearTimeout(timer);
    parent = parent || document;
    var items = parent.querySelectorAll(selector);
    for (let i = 0; i < items.length; i++) {
        const element = items[i];
        if (isVisible(element)) {
            console.log('Item not hidden, Retrying for: ', selector);
            ((selector, callback) => {
                timer = setTimeout(() => { waitToHideDialog(selector, callback) }, defaultDelayMs);
            })(selector, callback);
            return;
        }
    }
    console.log('Item is hidden: ', selector);
    callback();
}

var clickDot = function () {
    //button 'x' delete, class: img sp_WVlmwZ4PzbP sx_8019e2 | img sp_vPWoN8_ZzE7 sx_5cd324 | img sp_uBI2xAARzhd sx_812cfb | img sp_P3HKPeqx6sL sx_f56b15
    console.log('Clicking dot');
    var inputs_dot = document.querySelector('a[aria-label="Story options"]');
    if (inputs_dot) {
        //Click it and wait for menu
        inputs_dot.scrollIntoView();
        inputs_dot.click();
        console.log('Waiting for Delete');
        timer = setTimeout(() => { waitForItem('a[data-feed-option-name="MallPostDeleteOption"]', clickDelete) }, defaultDelayMs);
    }
    else {
        console.log('Script couldnt find any Dot button to click');
        timer = setTimeout(clickDot, defaultDelayMs);
    }
};

var clickDelete = function (element) {
    try {
        console.log('Clicking delete');
        element.scrollIntoView();
        element.click();
    }
    catch (e) {
        console.log('Script couldnt find any Delete button to click. Stopping.');
    }
    console.log('Waiting for confirmation box');
    //Wait for confirmation
    timer = setTimeout(() => {
        waitForItem('form[action*="/groups/content/remove/"] button[type="submit"], div[role="dialog"] button[data-testid="delete_post_confirm_button"]',
            clickConfirm)
    }, defaultDelayMs);
};

var clickConfirm = function (element) {
    try {
        console.log('Clicking confirm');
        element.scrollIntoView();
        element.click();
        console.log('Wait for confirm dialog to get hidden');
        timer = setTimeout(() => {
            waitToHideDialog('div[data-testid="delete_post_confirm_dialog"] div[role="dialog"] , div[role="dialog"] form[action*="/groups/content/remove/"]',
                clickDot)
        }, defaultDelayMs);
    }
    catch (e) {
        console.log('Script couldnt find any confirm button to click');
        return;
    }
}


//automatically scroll down to the bottom of page - ref: http://bit.ly/1O4tvHd
var interval_bottom_page = setInterval(function () { window.scrollTo(0, document.body.scrollHeight) }, 30000);

clickDot();

