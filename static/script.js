const canvas = document.getElementById('bezierCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let points = [];
let numSegments = 50;
let selectedPoint = null;

canvas.addEventListener('click', (event) => {
    const x = event.offsetX, y = event.offsetY;
    let found = false;
    
    points.forEach((p, i) => {
        if (Math.hypot(p[0] - x, p[1] - y) < 10) {
            points.splice(i, 1);
            found = true;
        }
    });

    if (!found) points.push([x, y]);
    draw();
});

function updateCurve() {
    numSegments = parseInt(document.getElementById('segmentInput').value);
    draw();
}

function clearCanvas() {
    points = [];
    draw();
}

async function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    points.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.stroke();
    });

    if (points.length > 1) {
        let response = await fetch('/compute_bezier', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ points, segments: numSegments })
        });

        let bezierPoints = await response.json();

        ctx.beginPath();
        ctx.moveTo(bezierPoints[0][0], bezierPoints[0][1]);
        bezierPoints.forEach(([x, y]) => ctx.lineTo(x, y));
        ctx.strokeStyle = "green";
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}