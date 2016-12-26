import turboRender from 'Dep/turboRender';
import serialize from 'serialize-javascript';
import 'bootstrap';
import './templateConfig';
export * from './initConfig';

// APP CONFIGURATION VARS
export default {
    API : {
        prefix: '/api' // Without the last slash
    }
};

// Secure ___definition rendered by the server
function serializeVars() {
    window.___definition = serialize(window.___definition, {isJSON: true});
}

document.addEventListener('turbolinks:before-render', (e) => {
    serializeVars();
});

serializeVars();
