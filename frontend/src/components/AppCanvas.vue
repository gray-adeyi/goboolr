<script lang="ts" setup>
import { ref, onMounted } from "vue";
import Wire from "../wire";
import Selected from "../selected";
import useCanvas from "../composables/canvas";
import useMouse from "../composables/mouse";

const { canvas, canvasContext } = useCanvas();
const offset = ref<Position>({ x: 0, y: 0 }); // see wails runtime declarations for Position
const zoom = ref(100);
const scrollAnimation = ref({ v: 0, r: 0, animate: false });
const zoomAnimation = ref(zoom.value);
const framerate = ref(60);
const lastFrame = ref(new Date());
const mouse = useMouse();
const settings = ref({
  scrollAnimation: true,
  zoomAnimation: true,
  showDebugInfo: false,
  visualizeComponentUpdates: false,
});

const dragging = ref(null);
const selecting = ref(null);
const connecting = ref<Wire | null>(null);
const wheelClick = ref(false);

function isVisible(x: number, y: number, w: number, h: number) {
  if (canvas.value) {
    return (
      x + (w || 0) > offset.value.x &&
      x < offset.value.x + canvas.value.width / zoom.value &&
      y - (h || 0) < offset.value.y &&
      y > offset.value.y - canvas.value.height / zoom.value
    );
  }
  return false;
}

function scroll(dx: number, dy: number) {
  if (settings.value.scrollAnimation) {
    scrollAnimation.value.v = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) / 16;
    scrollAnimation.value.r = Math.atan2(-dx, dy);
    scrollAnimation.value.animate = true;
  } else {
    offset.value.x += dx;
    offset.value.y += dy;
  }

  mouse.value.grid.x += dx;
  mouse.value.grid.y += dy;
}

function changeZoom(dz: number) {
  zoomAnimation.value = Math.min(Math.max(zoomAnimation.value + dz, 2), 300);
}

function draw() {
  // Clear the screen
  // canvasContext.clearRect(0, 0, c.width, c.height);
  // I would have preferred this syntax but typescript is
  // still showing squiggly lines
  // if ([canvas, canvasContext].every((valueRef) => valueRef.value === null)) return;
  if (canvasContext.value === null) return;
  if (canvas.value === null) return;

  canvasContext.value.fillStyle = "#fff";
  canvasContext.value.fillRect(0, 0, canvas.value.width, canvas.value.height);

  // Draw grid points
  if (zoom.value > 24) {
    canvasContext.value.fillStyle =
      "rgba(200,200,200," + Math.min(1, zoom.value / 100) + ")";
    for (
      let i = (-offset.value.x * zoom.value) % zoom.value;
      i < canvas.value.width;
      i = i + zoom.value
    ) {
      for (
        let j = (offset.value.y * zoom.value) % zoom.value;
        j < canvas.value.height;
        j = j + zoom.value
      ) {
        canvasContext.value.fillRect(
          i - zoom.value / 24,
          j - zoom.value / 24,
          zoom.value / 12,
          zoom.value / 12
        );
      }
    }
  }

  // For nice rounded edges
  if (zoom.value > 50) {
    canvasContext.value.lineJoin = "round";
  } else {
    canvasContext.value.lineJoin = "miter";
  }

  // Draw wires
  canvasContext.value.lineWidth =
    zoom.value < 20 ? 1 : Math.round(zoom.value / 8);

  // Draw connecting wire
  if (connecting.value) connecting.value.draw();

  for (let i = 0, l = wires.length; i < l; ++i) {
    wires[i].draw();
  }

  canvasContext.value.lineCap = "butt";

  // Draw components
  for (let i = 0, l = components.length; i < l; ++i) {
    components[i].draw();
  }

  // Draw hover balloon
  if (hoverBalloon.display) {
    if (Array.isArray(mouse.hover.pos)) {
      hoverBalloon.style.top = mouse.screen.y - hoverBalloon.clientHeight - 35;
      hoverBalloon.style.left = mouse.screen.x - hoverBalloon.clientWidth / 2;
    } else {
      hoverBalloon.style.top =
        (offset.value.y - mouse.hover.pos.y - 0.5) * zoom.value -
        hoverBalloon.clientHeight -
        35;
      hoverBalloon.style.left =
        (mouse.hover.pos.x - offset.x + mouse.hover.width / 2 - 0.5) *
          zoom.value -
        hoverBalloon.clientWidth / 2;
    }
  }

  // Draw selections
  if (selecting) {
    canvasContext.value.fillStyle = "rgba(0,90,180,.1)";
    canvasContext.value.strokeStyle = "rgba(0,90,180,1)";
    canvasContext.value.setLineDash([10, 5]);
    canvasContext.value.lineDashOffset = selecting.dashOffset++;
    canvasContext.value.lineWidth = 2;

    canvasContext.value.beginPath();
    canvasContext.value.rect(
      (selecting.x - offset.value.x) * zoom.value,
      (-selecting.y + offset.value.y) * zoom.value,
      selecting.w * zoom.value,
      -selecting.h * zoom.value
    );
    canvasContext.value.fill();
    canvasContext.value.stroke();

    canvasContext.value.setLineDash([0, 0]);
  }

  // Draw context menu
  if (document.getElementById("contextMenu").style.display != "none") {
    const contextMenu = document.getElementById("contextMenu");
    contextMenu.style.left = (contextMenu.x - offset.value.x) * zoom.value;
    contextMenu.style.top = -(contextMenu.y - offset.value.y) * zoom.value;
  }

  // Draw waypoints menu
  if (document.getElementById("waypointsMenu").style.display != "none") {
    const waypointsMenu = document.getElementById("waypointsMenu");
    waypointsMenu.style.left = (waypointsMenu.x - offset.value.x) * zoom.value;
    waypointsMenu.style.top = -(waypointsMenu.y - offset.value.y) * zoom.value;
  }

  // Scroll animatie
  if (settings.value.scrollAnimation) {
    if (scrollAnimation.value.animate && settings.value.scrollAnimation) {
      offset.value.x -=
        Math.sin(scrollAnimation.value.r) * scrollAnimation.value.v;
      offset.value.y +=
        Math.cos(scrollAnimation.value.r) * scrollAnimation.value.v;

      scrollAnimation.value.v -= scrollAnimation.value.v / 16;
      if (scrollAnimation.value.v <= 0.001) {
        scrollAnimation.value.animate = false;
      }
    }
  }

  // Zoom animation
  if (settings.value.zoomAnimation) {
    offset.value.x +=
      mouse.screen.x *
      (1 / zoom.value - 8 / (zoomAnimation.value + 7 * zoom.value));
    offset.value.y -=
      mouse.screen.y *
      (1 / zoom.value - 8 / (zoomAnimation.value + 7 * zoom.value));
    zoom.value = zoom.value - (zoom.value - zoomAnimation.value) / 8;
  } else {
    offset.value.x =
      offset.value.x +
      mouse.screen.x * (1 / zoom.value - 1 / zoomAnimation.value);
    offset.value.y =
      offset.value.y -
      mouse.screen.y * (1 / zoom.value - 1 / zoomAnimation.value);
    zoom.value = zoomAnimation.value;
  }

  //tick();

  // Framerate berekenen
  framerate.value = 1000 / (new Date().valueOf() - lastFrame.value.valueOf());
  lastFrame.value = new Date();

  window.requestAnimationFrame(draw);
}

// window.onfocus = function() {
//     let data;
//     if(localStorage.pws) data = JSON.parse(localStorage.pws);
//     else data = {};
//
//     if(data.clipboard) {
//         parse(data.clipboard,true);
//     }
//     if(data.settings) {
//         settings = data.settings;
//     }
//     if(data.tips) {
//         for(let tip in data.tips) {
//             tips[tip].disabled = data.tips[tip];
//         }
//     }
//
//     c.focus();
// }
//window.onblur = setLocalStorage;

window.onresize = () => {
  c.height = window.innerHeight;
  c.width = window.innerWidth;

  if (boolrConsole.fullscreen) {
    boolrConsole.style.height = innerHeight - 40;
    boolrConsole.style.width = innerWidth - 40;
  }
};

window.onerror = function (msg, url, line) {
  notifications.push(
    `${msg}<br>` + `<span style="color: #888">${url}:${line}</span>`,
    "error"
  );

  boolrConsole.error(msg + "@" + url + ":" + line);

  dragging = connecting.value = selecting = null;
};
</script>

<template>
  <canvas id="canvas" tabindex="1" ref="canvas"></canvas>
</template>
../core/wire../core/selected
