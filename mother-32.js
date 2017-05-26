//
// mother-32.js
// pdv
//

'use strict';

const $ = (id) => document.getElementById(id);

// Graphics

const canvas = $('mother');
const w = canvas.width;
const h = canvas.height;
const gctx = canvas.getContext('2d');

// Knobs

const knobWidth = 60;
const knobFrames = 31;
const knobImg = new Image();
knobImg.src = "knob.png";

const knobs = {
    frequency: { label: "frequency", x: 20, y: 20, val: 0, min: -1, max: 1 }
};

let mouse = {
    down: { x: 0, y: 0 },
    current: { x: 0, y: 0 }
};

function contains(knob, mousePos) {
    return knob.x < mousePos.x && mousePos.x < knob.x + knobWidth
        && knob.y < mousePos.y && mousePos.y < knob.y + knobWidth;
}

function getMousePos(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x: x, y: y };
}

canvas.addEventListener('mousedown', (e) => {
    mouse.down = mouse.current = getMousePos(canvas, e);
}, false);

canvas.addEventListener('mouseup', (e) => {
    mouse.current = getMousePos(canvas, e);
    mouse.down = undefined;
}, false);

canvas.addEventListener('mousemove', (e) => {
    mouse.current = getMousePos(canvas, e);
    if (mouse.down) {
        let dy = mouse.down.y - mouse.current.y;
        for (let knobKey in knobs) {
            let knob = knobs[knobKey];
            if (contains(knob, mouse.down)) {
                knob.value += dy;
                knob.onChange(knob.value);
                break;
            }
        }
    }
}, false);

function draw() {
    for (let knobKey in knobs) {
        const knob = knobs[knobKey];
        
        gctx.drawImage(knobImg, 0, knob.
    }
}

// Audio

let actx = new window.AudioContext();
let nodes = {
    vco: actx.createOscillator(),
    lfo: actx.createOscillator()
};


