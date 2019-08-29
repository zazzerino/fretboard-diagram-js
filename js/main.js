import './../css/styles.css';
import { makeCircle, makeLine, makeSVGContainer, makeRect } from './svg';
import { empty } from './utils';

export class FretboardDiagram {
    constructor(opts) {
        if (opts.id == null) {
            throw new Error(`Must provide id.`);
        }

        this.id = opts.id;

        this.onClick = opts.onClick;

        this.width = opts.width || 200;
        this.height = opts.height || 300;

        this.stringCount = opts.stringCount || 6;
        this.fretCount = opts.fretCount || 4;

        this.dots = opts.dots || [];
        this.drawDotOnHover = opts.drawDotOnHover || false;

        const rootElem = document.getElementById(this.id);

        if (rootElem == null) {
            throw new Error(`Parent element ${this.id} is null.`);
        }

        empty(rootElem); // in case element is being redrawn

        this.svgElem = makeSVGContainer(rootElem, this.width, this.height);
        this.svgElem.classList.add("fretboard-diagram");

        this.draw();
    }

    draw() {
        this.drawFrets();
        this.drawStrings();
        this.drawDots();
        this.makeListeners();
    }

    drawFrets() {
        for (let i = 0; i < this.fretCount + 1; i++) {
            const yPos = (this.fretHeight * i) + this.yMargin;
            makeLine(this.svgElem, this.xMargin, yPos, this.width - this.xMargin, yPos);
        }
    }

    drawStrings() {
        for (let i = 0; i < this.stringCount; i++) {
            for (let j = 0; j < this.fretCount; j++) {
                const x = (i * this.stringMargin) + this.xMargin;
                const y = (j * this.fretHeight) + this.yMargin;

                makeLine(this.svgElem, x, y, x, y + this.fretHeight);
            }
        }
    }

    drawDot({ string, fret, color }) {
        const { x, y } = this.fretCoords({ string, fret });

        let dotRadius = this.dotRadius;

        // shrink open string dots
        if (fret === 0) {
            dotRadius -= dotRadius / 4;
        }

        const dot = makeCircle(this.svgElem, x, y, dotRadius, color);
        return dot;
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

    makeListeners() {
        for (let string = 1; string < this.stringCount + 1; string++) {
            for (let fret = 0; fret < this.fretCount + 1; fret++) {
                const { x, y } = this.fretCoords({ string, fret });

                let height = this.listenerHeight;
                if (fret === 0) {
                    height -= height / 3;
                }

                const listener = makeRect(
                    this.svgElem,
                    x - (this.listenerWidth / 2),
                    y - (height / 2),
                    this.listenerWidth,
                    height
                );
                listener.classList.add("listener");

                let dot = null;

                listener.addEventListener("mouseover", () => {
                    if (this.drawDotOnHover) {
                        dot = this.drawDot({ string, fret });
                        dot.classList.add("hover-dot");
                    }
                });

                listener.addEventListener("mouseout", () => {
                    if (dot != null) {
                        dot.remove();
                    }
                });

                listener.addEventListener("click", () => {
                    if (this.onClick != null) {
                        this.onClick({ string, fret }, this);
                    }
                });
            }
        }
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

    get listenerWidth() {
        return this.dotRadius * 3;
    }

    get listenerHeight() {
        return this.dotRadius * 7;
    }

}

// const fd = new FretboardDiagram({
//     id: "example-1",
//     dots: [
//         { string: 5, fret: 3, color: 'limegreen' },
//         { string: 3, fret: 0 },
//         { string: 2, fret: 1 },
//         { string: 1, fret: 0 }
//     ],
//     drawDotOnHover: true,
//     onClick: (dot, inst) => {
//         console.log(`${dot.string} ${dot.fret} ${inst.id}`);
//     }
// });