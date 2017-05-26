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
const knobFrames = 63;
const knobDragScale = 0.0005;
const knobImg = new Image();
const knobImgWidth = 240;
knobImg.src = "moogknob.png";
knobImg.onload = draw;

const woodImg = new Image();
woodImg.src = "wood.jpg";

const leftPadding = 50;
const topPadding = 30;
const knobSpace = 100;
const knobs = {
    frequency: { label: "frequency", x: 0, y: 0, value: 0, min: -1, max: 1, onChange: (val) => {
    }},
    pulseWidth: { label: "pulse width", x: 2, y: 0, value: 0.5, min: 0, max: 1, onChange: (val) => {}},
    glide: { label: "glide", x: 0, y: 1, value: 0, min: 0, max: 1, onChange: (val) => {}},
    tempo: { label: "tempo/gate", x: 0, y: 2, value: 0, min: 0, max: 1, onChange: (val) => {}},
    lfoRate: { label: "lfo rate", x: 1, y: 2, value: 0, min: 0, max: 1, onChange: (val) => {}}

};

let mouse = {
    down: { x: 0, y: 0 },
    current: { x: 0, y: 0 }
};

function contains(knob, mousePos) {
    return knob.x < mousePos.x && mousePos.x < knob.x + knobWidth
        && knob.y < mousePos.y && mousePos.y < knob.y + knobWidth;
}

function clip(value, min, max) {
    return Math.max(min, Math.min(value, max));
}

function getMousePos(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x: x, y: y };
}

document.addEventListener('mousedown', (e) => {
    mouse.down = mouse.current = getMousePos(canvas, e);
}, false);

document.addEventListener('mouseup', (e) => {
    mouse.current = getMousePos(canvas, e);
    mouse.down = undefined;
}, false);

document.addEventListener('mousemove', (e) => {
    mouse.current = getMousePos(canvas, e);
    if (mouse.down) {
        let dy = (mouse.down.y - mouse.current.y) * knobDragScale;
        for (let knobKey in knobs) {
            let knob = knobs[knobKey];
            if (contains(knob, mouse.down)) {
                knob.value = clip(knob.value + dy, knob.min, knob.max);
                knob.onChange(knob.value);
                break;
            }
        }
    }
}, false);

function drawBg() {
    gctx.fillStyle = '#000';
    gctx.fillRect(0, 0, w, h);
    gctx.drawImage(woodImg, 0, 0, 20, h);
    gctx.drawImage(woodImg, w - 20, 0, 20, h);
}

function draw() {
    gctx.clearRect(0, 0, w, h);
    drawBg();
    for (let knobKey in knobs) {
        const knob = knobs[knobKey];
        const normalized = (knob.value - knob.min) / (knob.max - knob.min);
        const frame = Math.floor(normalized * knobFrames);
        const x = leftPadding + (knob.x * knobSpace);
        const y = topPadding + (knob.y * knobSpace);
        gctx.drawImage(knobImg,
                       0,
                       frame * knobImgWidth,
                       knobImgWidth,
                       knobImgWidth,
                       x,
                       y,
                       knobWidth,
                       knobWidth);
        gctx.fillStyle = '#fff';
        gctx.font = '10px sans-serif';
        gctx.fillText(knob.label.toUpperCase(), x, y - 5);
    }
    window.requestAnimationFrame(draw);
}

// Audio

let actx = new window.AudioContext();
let nodes = {
    vco: actx.createOscillator(),
    lfo: actx.createOscillator()
};
