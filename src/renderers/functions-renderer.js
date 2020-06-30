function renderRoute(route) {
    if (!route) return;
    
    push();
    stroke(146, 100, 255);
    strokeWeight(5);
    for (let i = 0; i < route.length-1; i++) {
        const c = route[i];
        const c2 = route[i+1];
        line(c[0], c[1], c2[0], c2[1]);
    }
    pop();
}