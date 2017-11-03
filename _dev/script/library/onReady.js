
// onReady
// ============
// When doc is ready

// Exports
export { onReady };

// Module JS
const onReady = function onReady(method) {

    let readyStateCheckInterval = setInterval(function () {
        if (document && document.readyState === 'complete') { // or 'interactive'
            clearInterval(readyStateCheckInterval);
            method();
        }
    }, 10);
}