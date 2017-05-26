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

const knobWidth = 80;
const knobFrames = 63;
const knobDragScale = 0.0005;
const knobImg = new Image();
const knobImgWidth = 240;
knobImg.src = "moogknob.png";
knobImg.onload = draw;

const switchImg = new Image();
const switchImgWidth = 240;
const switchWidth = 40;
switchImg.src = "moogswitch.png";

const woodImg = new Image();
woodImg.src = "wood.jpg";
const bgImg = new Image();
bgImg.src = "bg.jpg";

const leftPadding = 50;
const topPadding = 45;
const knobSpace = 110;
const knobs = {
    frequency: { label: "frequency", x: 0, y: 0, value: 0, min: -1, max: 1, onChange: (val) => {
    }},
    pulseWidth: { label: "pulse width", x: 2, y: 0, value: 0.5, min: 0, max: 1, onChange: (val) => {}},
    mix: { label: "mix", x: 3, y: 0, value: 0.5, min: 0, max: 1, onChange: (val) => {}},
    cutoff: { label: "cutoff", x: 4, y: 0, value: 200, min: 20, max: 2000, onChange: (val) => {}},
    resonance: { label: "resonance", x: 5, y: 0, value: 0.1, min: 0, max: 1, onChange: (val) => {}},
    volume: { label: "volume", x: 7, y: 0, value: 0.1, min: 0, max: 1, onChange: (val) => {}},
    glide: { label: "glide", x: 0, y: 1, value: 0, min: 0, max: 1, onChange: (val) => {}},
    vcoMod: { label: "vco mod amount", x: 2, y: 1, value: 0.1, min: 0, max: 1, onChange: (val) => {}},
    vcfMod: { label: "vcf mod amount", x: 6, y: 1, value: 0.1, min: 0, max: 1, onChange: (val) => {}},
    tempo: { label: "tempo/gate", x: 1, y: 2, value: 0, min: 0, max: 1, onChange: (val) => {}},
    lfoRate: { label: "lfo rate", x: 2, y: 2, value: 0, min: 0, max: 1, onChange: (val) => {}},
    attack: { label: "attack", x: 4, y: 2, value: 0, min: 0, max: 1, onChange: (val) => {}},
    decay: { label: "decay", x: 6, y: 2, value: 0, min: 0, max: 1, onChange: (val) => {}},
    vcMix: { label: "vc mix", x: 7, y: 2, value: 0, min: 0, max: 1, onChange: (val) => {}}
};
const switches = {
    vcoWave: { label: "vco wave", on: "sqr", off: "saw", x: 1, y: 0, value: false, onChange: (on) => {}},
    vcaMode: { label: "vca mode", on: "on", off: "eg", x: 6, y: 0, value: false, onChange: (on) => {}},
    vcoModSrc: { label: "vco mod source", on: "eg", off: "lfo", x: 1, y: 1, value: true, onChange: (on) => {}},
    vcoModDest: { label: "vco mod dest", on: "pulse width", off: "frequency", x: 3, y: 1, value: true, onChange: (on) => {}},
    vcfMode: { label: "vcf mode", on: "high pass", off: "low pass", x: 4, y: 1, value: true, onChange: (on) => {}},
    vcfModSrc: { label: "vcf mod source", on: "eg", off: "lfo", x: 5, y: 1, value: false, onChange: (on) => {}},
    vcfModPol: { label: "vcf mod polarity", on: "+", off: "-", x: 7, y: 1, value: true, onChange: (on) => {}},
    lfoWave: { label: "lfo wave", on: "sqr", off: "tri", x: 3, y: 2, value: false, onChange: (on) => {}},
    sustain: { label: "sustain", on: "on", off: "off", x: 5, y: 2, value: false, onChange: (on) => {}}
};

let mouse = {
    down: { x: 0, y: 0 },
    current: { x: 0, y: 0 }
};

function contains(knob, mousePos) {
    const x = leftPadding + (knob.x * knobSpace);
    const y = topPadding + (knob.y * knobSpace);
    return x < mousePos.x && mousePos.x < x + knobWidth
        && y < mousePos.y && mousePos.y < y + knobWidth;
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
    for (let switchKey in switches) {
        let sw = switches[switchKey];
        if (contains(sw, mouse.down)) {
            sw.value = !sw.value;
            sw.onChange(sw.value);
            break;
        }
    }
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
    gctx.drawImage(bgImg, 0, 0, w, h);
    gctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    gctx.fillRect(0, 0, w, h);

    // Side 
    gctx.drawImage(woodImg, 0, 0, 20, h);
    gctx.drawImage(woodImg, w - 20, 0, 20, h);

    // MOTHER-32
    gctx.font = '20px sans-serif';
    gctx.fillStyle = '#fff';
    gctx.textAlign = 'left';
    gctx.fillText("MOTHER-32", leftPadding, h - 20);

    // on light
    gctx.fillStyle = 'red';
    gctx.beginPath();
    gctx.arc(leftPadding + (knobWidth / 2), topPadding + (2 * knobSpace) + (knobWidth / 2), 15, 0, 2 * Math.PI, false);
    gctx.fill();
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
        gctx.font = '11px sans-serif';
        gctx.textAlign = 'center';
        gctx.fillText(knob.label.toUpperCase(), x + (knobWidth / 2), y - 7);
    }
    for (let switchKey in switches) {
        const sw = switches[switchKey];
        const offset = sw.value ? 0 : switchImgWidth;
        const x = leftPadding + (sw.x * knobSpace);
        const y = topPadding + (sw.y * knobSpace);
        gctx.drawImage(switchImg,
                       0,
                       offset,
                       switchImgWidth,
                       switchImgWidth,
                       x + switchWidth / 2,
                       y + switchWidth / 2,
                       switchWidth,
                       switchWidth);
        gctx.fillStyle = '#fff';
        gctx.font = '9px sans-serif';
        gctx.textAlign = 'center';
        gctx.fillText(sw.label.toUpperCase(), x + (knobWidth / 2), y);
        // on off label
        gctx.font = '7px sans-serif';
        gctx.fillText(sw.on.toUpperCase(), x + (knobWidth / 2), y + (switchWidth / 2));
        gctx.fillText(sw.off.toUpperCase(), x + (knobWidth / 2), y + (switchWidth / 2) + 50);
    }
    window.requestAnimationFrame(draw);
}

// Audio

let actx = new window.AudioContext();
let nodes = {
    vco: actx.createOscillator(),
    lfo: actx.createOscillator()
};
