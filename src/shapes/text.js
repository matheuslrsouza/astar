class ItemText {

    constructor(text, x, y, color = [255, 222, 89]) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.color = color;
        this.alpha = 0;
        this.visible = false;
    }

    show() {
        this.visible = true;
    }

    render() {

        if (this.visible && this.alpha < 255) {
            this.alpha += 0.5;
        }

        push();
        noStroke();
        
        let colorWithAlpha = this.color.concat(this.alpha);
        var txtSize = 30;

        //textFont(fontRockwellBold);
        textSize(txtSize);
        fill(colorWithAlpha);
        text(this.text, this.x, this.y);
        pop();
    }

}