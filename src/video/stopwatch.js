class Stopwatch {

    constructor() {
        this.times = [];
    }

    start(name) {
        this.times[name] = {
            start: new Date()
        };
    }

    stop(name) {
        this.times[name].end = new Date();
    }

    hasFinished(name) {
        return this.times[name].end != undefined;
    }

    timeElapsed(name) {
        if (!this.times[name]) return 0;

        let end = this.times[name].end ? this.times[name].end : new Date();
        
        var secondsDiff = abs(this.times[name].start - end) / 1000;
        return secondsDiff;
    }

}