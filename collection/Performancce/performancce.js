function loadResources () {
    const image1 = new Image()
    image1.onload = resourceTiming
    image1.src = 'https://www.w3.org/Icons/w3c_main.png'
}

function resourceTiming () {
    const resourceList = window.performance.getEntriesByType('resource')
    for (let i = 0; i < resourceList.length; i++) {
        console.log('End to end resource fetch: ', resourceList[i], (resourceList[i].responseEnd - resourceList[i].startTime))
    }
}

var observer = new PerformanceObserver(function(list, obj) {
    var entries = list.getEntries();
    for (var i=0; i < entries.length; i++) {
        console.log(3333, new Date().getTime(),  entries[i]);
    }
});
observer.observe({entryTypes: ["paint", "mark", "frame"]});