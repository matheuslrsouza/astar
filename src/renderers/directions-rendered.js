
class DirectionsRenderer {

    constructor(astar) {
        this.astar = astar;
    }

    render() {
        this.astar.allowedActions.forEach(arrow => {
            arrow.render();
        });
    }

}