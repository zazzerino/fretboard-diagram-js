import { createCircle, createLine, createSVGContainer } from './svg';
import { empty } from './utils';

export class FretboardDiagram {

    constructor(opts) {
        if (opts.id == null) {
            throw new Error(`Must provide id.`);
        }

        this.id = opts.id;

        this.width = opts.width || 200;
        this.height = opts.height || 300;

        this.stringCount = opts.stringCount || 6;
        this.fretCount = opts.fretCount || 4;

        this.dots = opts.dots || {};

        const parent = document.getElementById(this.id);

        if (parent == null) {
            throw new Error(`Parent element ${this.id} is null.`);
        }

        empty(parent); // in case element is being redrawn

        this.svgEl = createSVGContainer(parent, this.width, this.height);
        this.svgEl.classList.add("fretboard-diagram");

        this.drawFrets();
        this.drawStrings();
        this.drawDots();
    }

    drawFrets() {
        for (let i = 0; i < this.fretCount + 1; i++) {
            const yPos = (this.fretHeight * i) + this.yMargin;
            createLine(this.svgEl, this.xMargin, yPos, this.width - this.xMargin, yPos);
        }
    }

    drawStrings() {
        for (let i = 0; i < this.stringCount; i++) {
            for (let j = 0; j < this.fretCount; j++) {
                const x = (i * this.stringMargin) + this.xMargin;
                const y = (j * this.fretHeight) + this.yMargin;

                createLine(this.svgEl, x, y, x, y + this.fretHeight);
            }
        }
    }

    drawDot(dot) {
        const { x, y } = this.fretCoords(dot);

        let dotRadius = this.dotRadius;

        // shrink open string dots
        if (dot.fret === 0) {
            dotRadius -= dotRadius / 4;
        }

        const circle = createCircle(this.svgEl, x, y, dotRadius);
        circle.style.fill = dot.color ? dot.color : 'white';

        return circle;
    }

    drawDots() {
        for (const dot of this.dots) {
            this.drawDot(dot);
        }
    }

    fretCoords({ string, fret }) {
        const stringOffset = Math.abs(string - this.stringCount);

        const x = (stringOffset * this.stringMargin) + this.xMargin;
        let y = ((fret * this.fretHeight) - (this.fretHeight / 2)) + this.yMargin;

        // Place open string dots closer to the top of the fretboard.
        if (fret === 0) {
            y += this.fretHeight / 5;
        }

        return { x, y };
    }

    get xMargin() {
        return this.width / 5;
    }

    get yMargin() {
        return this.height / 8;
    }

    get neckWidth() {
        return this.width - (this.xMargin * 2);
    }

    get neckHeight() {
        return this.height - (this.yMargin * 2);
    }

    get fretHeight() {
        return this.neckHeight / this.fretCount;
    }

    get stringMargin() {
        return this.neckWidth / (this.stringCount - 1);
    }

    get dotRadius() {
        return this.fretHeight / 7;
    }

}

// const fd = new FretboardDiagram({
//     id: "example-1",
//     dots: [
//         { string: 5, fret: 3 },
//         { string: 3, fret: 0 },
//         { string: 2, fret: 1 },
//         { string: 1, fret: 0 }
//     ]
// });