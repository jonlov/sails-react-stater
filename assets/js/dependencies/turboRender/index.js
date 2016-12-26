import Turbolinks from 'turbolinks';
import reactDOM from 'react-dom';

Turbolinks.start();

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

let utils = {
        url: window.location.pathname.split('/')[1].toLowerCase(),
        getElementByAttribute: (attribute, parent) => {
            let matchingElements = [];

            if (!parent)
                parent = document.getElementsByTagName('*');
            else if (parent[0])
                parent = parent[0].getElementsByTagName('*');

            for (var i = 0, n = parent.length; i < n; i++) {
                if (parent[i].getAttribute(attribute) !== null) {
                    // Element exists with attribute. Add to array.
                    matchingElements.push(parent[i]);
                }
            }
            return matchingElements;
        }
    },
    turboRender = {
        getAttribute: (attribute, body) => {
            let bodyToLoad = (body && typeof body === 'object')
                    ? body
                    : document,
                turboRenderElement = bodyToLoad.getElementsByTagName('turboRender'),
                scriptsTag = [],
                e = '';

            if (turboRenderElement.length > 0) {
                scriptsTag = turboRenderElement[0].getAttribute(attribute);

                if (scriptsTag) {
                    scriptsTag = scriptsTag.replace('[', e).replace(']', e);
                    scriptsTag = scriptsTag.replaceAll('\'', e).replaceAll('\"', e).split(',');
                }
            }

            return scriptsTag;
        },
        loadScripts: (body, cb, append) => {
            let arrayOfScripts = turboRender.getAttribute('script', body) || turboRender.getAttribute('module', body);

            if (arrayOfScripts.length > 0) {
                return arrayOfScripts.forEach(script => {
                    return System.import (`app/${script}/index.js`).then(bundle => {
                        return (cb && typeof cb === 'function')
                            ? cb(true)
                            : true;
                    }).catch(err => console.log("Can't load the bundle ", err));
                    // return System.import (`app/${script}.bundle.js`).then(bundle => {
                    //     return (cb && typeof cb === 'function')
                    //         ? cb(true)
                    //         : true;
                    // }).catch(() => console.log("can't load the bundle"));
                });
            }

            // if (cb && typeof cb === 'function')
            //     return cb(true);

            return (cb && typeof cb === 'function')
                ? cb(true)
                : true;
        },
        renderModule: () => {
            let arrayOfModules = turboRender.getAttribute('module') || [];

            arrayOfModules.forEach(module => {
                module = module.toLowerCase();
                if (!turboRender.fn[module]) {
                    // Explain
                    console.log('Turborender : Module ' + module + ' not found.');
                } else {
                    turboRender.fn[module](window.location.pathname);
                }
            });
        },
        fn: {}
    };

setTimeout(function() {
    turboRender.loadScripts();
});

export function render(a, id, b, c) {
    // If the id is not an string
    // we throw an error to declare <xx turboRender> element with the tag
    if (typeof id != 'string')
        throw new Error(`Do not pass the document.getElementById()... [ Click (...) for more ]=>
    To solve this proble you can:
        - Let turboRender handle the id him self passing (id) from the callback function
        - Pass the render just an string with an ID like 'XXX' (MUST BE UNIQUE)
    `);

    if (!id)
        throw new Error('The render id is not defined.');

    let turboRenderElement = document.getElementsByTagName('turboRender'),
        elementExist = document.getElementById(id),
        element = document.createElement("div");
    element.setAttribute('id', id)

    // If the tag turboRender> element doesn't exist
    // we throw an error to declare <xx turboRender> element with the tag
    // if (turboRender.length == 0)
    //     throw new Error(`"turboRender" element is no defined... [ Click (...) for more ]=>
    // Declare turboRender like <turboRender /> (MUST BE DECLARE ONCE PER PAGE)
    // `);

    if (turboRenderElement.length > 1)
        throw new Error(`"turboRender" element was defined more than once... [ Click (...) for more ]=>
    Declare turboRender like <turboRender /> (MUST BE DECLARE ONCE PER PAGE)
    `);

    // If the element doesn't exist we create it
    if (!elementExist && turboRender.length != 0) {
        turboRenderElement[0].appendChild(element);
        elementExist = element;
    }

    // If the element exist we render the reactDOM
    if (elementExist)
        return reactDOM.render(a, elementExist, b, c);

        // Otherwise if the element doesn't exist
        // we throw an error
        // throw new Error('There is no element defined with the ' + id + ' id.');
    }

export function renderComponent(renderFunction, moduleName) {
    // If the id is not an string
    // we throw an error to declare <xx turboRender> element with the tag
    if ((!moduleName || typeof moduleName != 'string')) {
        moduleName = window.location.pathname.substring(1);
        if (moduleName.charAt(moduleName.length - 1) == '/') {
            moduleName = moduleName.slice(0, -1);
        }
    }
    if ((!renderFunction || typeof renderFunction != 'function')) {
        throw new Error(`Define renderComponent like renderComponent('moduleName', function (id){ ... })`);
    }

    moduleName = moduleName.toLowerCase();
    turboRender.fn[moduleName] = renderFunction;

    turboRender.renderModule();
}
let toVisit = () => {};

document.addEventListener('turbolinks:before-render', (e) => {
    let turboRenderDOM = utils.getElementByAttribute('turboRenderDOM'),
        elements = utils.getElementByAttribute('data-reactroot', turboRenderDOM);

    if (elements.length > 0) {
        elements.forEach((element) => {
            let node = reactDOM.findDOMNode(element.parentNode);
            reactDOM.unmountComponentAtNode(node);

            // DEBUG functions
            // console.log('findDOMNode ', reactDOM.findDOMNode(element));
            // console.log('unmountComponentAtNode ', reactDOM.unmountComponentAtNode(node));
        });
    }
});
document.addEventListener('turbolinks:render', () => {
    turboRender.renderModule();
});

((BrowserAdapter) => {

    let BrowserAdapterThis,
        BrowserAdapterThisFinished;

    Turbolinks.BrowserAdapter.prototype.visitRequestProgressed = function(visit) {
        if (this.controller && !BrowserAdapterThis) {
            BrowserAdapterThis = this;
        }

        if (visit.turboRender && BrowserAdapterThis) {
            return BrowserAdapterThis.progressBar.setValue(visit.progress);
        }
    };

    Turbolinks.BrowserAdapter.prototype.visitRequestFinished = function(visit) {
        if (this.controller && !BrowserAdapterThisFinished) {
            BrowserAdapterThisFinished = this;
        }

        if (visit.turboRender && BrowserAdapterThisFinished) {
            return BrowserAdapterThisFinished.hideProgressBar();
        }
    };

    Turbolinks.BrowserAdapter.prototype.visitRequestCompleted = function(visit) {
        return visit.loadResponse();
    };

    let visitHack;
    Turbolinks.BrowserAdapter.prototype.visitStarted = function(visit) {
        visitHack = visit;
        visit.issueRequest();
        visit.changeHistory();
        return visit.loadCachedSnapshot();
    };

    Turbolinks.Renderer.prototype.renderView = function(callback) {
        let _this = this;
        // setTimeout(function() {
        turboRender.loadScripts(_this.newBody, () => {
            _this.delegate.viewWillRender(_this.newBody);
            BrowserAdapter.visitRequestProgressed({progress: 100, turboRender: true});
            BrowserAdapter.visitRequestFinished({turboRender: true});
            callback();
            _this.delegate.viewRendered(_this.newBody);
        });
        // }, 1000);
    };
})(Turbolinks.BrowserAdapter.prototype);

// (function(open) {
//     XMLHttpRequest.prototype.open = function(method, url, async) {
//         open.call(this, method, url, async);
//     };
// })(XMLHttpRequest.prototype.open);
