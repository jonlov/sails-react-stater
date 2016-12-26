function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
}

function insertParam(key, value, kvp) {
    key = encodeURI(key);
    value = encodeURI(value);

    kvp = (kvp)
        ? kvp.split('&')
        : document.location.search.substr(1).split('&');

    let i = kvp.length,
        x;

    while (i--) {
        x = kvp[i].split('=');

        if (x[0] == key) {
            x[1] = value;
            kvp[i] = x.join('=');
            break;
        }
    }

    if (i < 0) {
        kvp[kvp.length] = [key, value].join('=');
    }
    return kvp.join('&');
}

export function changeUrlParam(name, value) {
    let params;
    if (typeof name === 'object') {
        Object.keys(name).map((key) => {
            params = insertParam(key, name[key], params);
        });
    } else
        params = insertParam(name, value);

    let newURL = window.location.href.split('?')[0] + '?' + params;

    if (Turbolinks) {
        Turbolinks.visit(newURL);
    } else {
        window.history.replaceState('', '', newURL);
    }
}

export function getUrlParam(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export function getPaths() {
    let pathname = window.location.pathname.split('/');
    pathname.shift();
    return pathname;
}
