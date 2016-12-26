export function timeAgoFormatter(value, unit, suffix) {
    if (unit !== 'second') {
        return [
            value, unit + (value !== 1
                ? 's'
                : ''),
            suffix
        ].join(' ')
    }

    if (suffix === 'ago') {
        return 'a few seconds ago'
    }

    if (suffix === 'from now') {
        return 'in a few seconds'
    }
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

// INTERCEPT addEventListener to push to an array and
// have an array with all the event listeners
((addEventListener, removeEventListener) => {
    let listEventListeners = [];

    document.addEventListener = (evName, cb, opts) => {
        listEventListeners.push(evName);
        return addEventListener(evName, cb, opts);
    }
    document.removeEventListener = (evName, cb, opts) => {
        if (listEventListeners.indexOf(evName) > -1)
            listEventListeners.splice(listEventListeners.indexOf(evName), 1);

        return removeEventListener(evName, cb, opts);
    }

    document.listEventListeners = listEventListeners;

})(document.addEventListener, document.removeEventListener);
