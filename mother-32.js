//
// mother-32.js
// pdv
//

'use strict';

let $ = (id) => document.getElementById(id);

// Graphics

let canvas = $('mother');
let w = canvas.width;
let h = canvas.height;
let gctx = canvas.getContext('2d');

gctx.fillStyle = '#000';
gctx.fillRect(0, 0, w, h);

// Audio

let actx = new window.AudioContext();
let nodes = {
    'vco': actx.createOscillator(),
    'lfo': actx.createOscillator()
};


