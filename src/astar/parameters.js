const colors = {
    start: {
        fill: [255, 0, 0, 200]
    },
    goal: {
        fill: [0, 255, 0 , 150]
    },
    wall: {
        fill: [255]
    }, 
    current: {
        fill: [254, 254, 90, 150]//[255, 255, 255, 100]
    }, 
    cost: {
        expanded: [229, 129, 131, 230]//[254, 254, 90, 150]
    }, 
    arrow: {
        fill: [140, 140, 236]
    }
}

const images = {
    equations: {file: '', width: 950, height: 482}, 
    distance: {file: '', width: 706, height: 210}, 
    deltaX: {file: '', width: 180, height: 108}, 
    deltaY: {file: '', width: 180, height: 108},
    vs: {file: '', width: 693, height: 257},
    vsAStar: {file: '', width: 96, height: 48},
    vsNonAStar: {file: '', width: 336, height: 48},
};