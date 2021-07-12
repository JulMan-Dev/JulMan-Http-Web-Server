const { createCanvas } = require("canvas");

let canvas = createCanvas(100, 40);
let ctx = canvas.getContext('2d');

ctx.font = '40px "Lucida Console"'
ctx.fillStyle = 'red';
ctx.fillText('test', 0, 30);
ctx.strokeStyle = 'black';
ctx.strokeText('test', 0, 30);

write('<img src="' + canvas.toDataURL('image/png') + '">');

setResponseCode(202);