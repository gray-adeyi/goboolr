import { onMounted, ref } from "vue";
import useMouse from "./mouse";

export default function useCanvas() {
  const canvas = ref<HTMLCanvasElement | null>(null);
  const canvasContext = ref<CanvasRenderingContext2D | null>(null);
  const mouse = useMouse();

  onMounted(() => {
    const { width, height } = window.runtime.WindowGetSize();
    if (canvas.value) {
      canvas.value.width = width;
      canvas.value.height = height;

      canvasContext.value = canvas.value.getContext("2d", { alpha: false });
      if (canvasContext.value) canvasContext.value.imageSmoothingEnabled = true;

      canvas.value.onfocus = handleCanvasFocusEvent;
      canvas.value.oncontextmenu = handleCanvasContextMenuEvent;
      canvas.value.onmouseleave = handleCanvasMouseLeaveEvent;
      canvas.value.onmouseenter = handleCanvasMouseEnterEvent;
      canvas.value.onmousedown = handleCanvasMouseDownEvent;
      canvas.value.onmousemove = handleCanvasMouseMoveEvent;
      canvas.value.onmouseup = handleCanvasMouseUpEvent;
      canvas.value.ondblclick = handleCanvasDoubleClickEvent;
      canvas.value.onwheel = handleCanvasMouseWheelEvent;
    }
  });

  return { canvas, canvasContext };
}

function handleCanvasFocusEvent() {
  menu.hide();
}

function handleCanvasContextMenuEvent() {
  return false;
}

function handleCanvasMouseLeaveEvent() {
  scrollAnimation.value.animate = true;
  connecting.value = null;
}

function handleCanvasMouseEnterEvent(event: MouseEvent) {
  event.button > 0 && (scrollAnimation.value.animate = false);
}

function handleCanvasMouseDownEvent(event: MouseEvent) {
  if (!canvas.value) return;
  canvas.value.focus();

  mouse.value.screen.x = event.x;
  mouse.value.screen.y = event.y;
  mouse.value.grid.x = Math.round(event.x / zoom.value + offset.value.x);
  mouse.value.grid.y = Math.round(-event.y / zoom.value + offset.value.y);

  if (event.button == 1) {
    if (contextMenu.style.display == "block" && !selecting) {
      contextMenu.hide();
      return;
    }
    if (waypointsMenu.style.display == "block") {
      waypointsMenu.hide();
      return;
    }

    if (event.shiftKey) {
      if (selecting) {
        // selecting.w = mouse.grid.x - selecting.x;
        // selecting.h = mouse.grid.y - selecting.y;

        const x = mouse.value.grid.x;
        const y = mouse.value.grid.y;

        (function animate() {
          selecting.w += (x - selecting.x - selecting.w) / 4;
          selecting.h += (y - selecting.y - selecting.h) / 4;

          if (
            Math.abs(x - selecting.x - selecting.w) * zoom.value > 1 ||
            Math.abs(y - selecting.y - selecting.h) * zoom.value > 1
          ) {
            requestAnimationFrame(animate);
          } else {
            selecting.w = x - selecting.x;
            selecting.h = y - selecting.y;

            contextMenu.show(
              selecting.x + selecting.w,
              selecting.y + selecting.h
            );
          }
        })();

        selecting.components = findComponentsInSelection(
          selecting.x,
          selecting.y,
          x - selecting.x,
          y - selecting.y
        );
        selecting.wires = findWiresInSelection2(
          selecting.x,
          selecting.y,
          x - selecting.x,
          y - selecting.y
        );
      } else {
        selecting = {
          x: Math.round(event.x / zoom + offset.x),
          y: Math.round(-(event.y / zoom - offset.y)),
          h: 0,
          w: 0,
          dashOffset: 0,
        };
      }
    } else if (event.ctrlKey) {
      const x = mouse.screen.x / zoom + offset.x;
      const y = -mouse.screen.y / zoom + offset.y;

      scrollAnimation.animate = false;
      if (selecting) {
        dragging = {
          selection: true,
          pos: {
            x: selecting.x,
            y: selecting.y,
          },
          dx: x - selecting.x,
          dy: y - selecting.y,
        };
      } else {
        let found;
        if ((found = findComponentByPos())) {
          dragging = {
            component: found,
            pos: Object.assign({}, found.pos),
            dx: x - found.pos.x,
            dy: y - found.pos.y,
          };
          canvas.value.style.cursor = "move";
        } else if ((found = findPortByPos())) {
          dragging = {
            port: found,
            pos: Object.assign({}, found.pos),
          };
        }
      }
    } else if (event.altKey) {
      event.preventDefault();
      scrollAnimation.value.animate = false;
      return false;
    } else {
      if (
        document.getElementById("list").style.display != "none" ||
        selecting
      ) {
        contextMenu.hide();
        document.getElementById("list").hide();
        selecting = null;
      } else {
        let found;
        if ((found = findComponentByPos())) {
          const component = found;
          if (component.onmousedown) {
            component.onmousedown();
          } else {
            component.update();
          }
        } else if ((found = findWireByPos())) {
          connecting.value = new Wire();
          connecting.value.input.push(found);
          connecting.value.pos.push({
            x: mouse.value.grid.x,
            y: mouse.value.grid.y,
          });
        } else if ((found = findPortByPos())) {
          const port = found;
          if (port.type == "output") {
            connecting.value = new Wire();
            connecting.value.from = port;
            connecting.value.pos.push({
              x: mouse.grid.x,
              y: mouse.grid.y,
            });
          }
        } else {
          const component = new Selected();
          add(component, mouse.grid.x, mouse.grid.y, false, true);
        }
      }
    }
  } else if (event.button == 2) {
    wheelClick.value = true;
    scrollAnimation.value.animate = false;
    return false;
  } else if (event.button == 3) {
    waypointsMenu.hide();

    if (selecting && !dragging) {
      // Cancel selection
      selecting = null;
    } else if (dragging) {
      // Cancel dragging
      if (dragging.selection) {
        // An animation for the selection flying back to his old position
        const components = selecting.components;
        const wires = selecting.wires;
        (function animate() {
          let dx = dragging.pos.x - selecting.x;
          let dy = dragging.pos.y - selecting.y;

          selecting.x += dx / 2.5;
          selecting.y += dy / 2.5;
          contextMenu.x += dx / 2.5;
          contextMenu.y += dy / 2.5;

          for (let i = 0; i < components.length; ++i) {
            components[i].pos.x += dx / 2.5;
            components[i].pos.y += dy / 2.5;
          }

          for (let i = 0; i < wires.length; ++i) {
            const pos = wires[i].pos;
            for (let j = 0; j < pos.length; ++j) {
              pos[j].x += dx / 2.5;
              pos[j].y += dy / 2.5;
            }
          }

          if (Math.abs(dx) * zoom > 1 || Math.abs(dy) * zoom > 1) {
            dx = dx - dx / 2.5;
            dy = dy - dy / 2.5;
            requestAnimationFrame(animate);
          } else {
            // Stop animation
            selecting.x = Math.round(selecting.x);
            selecting.y = Math.round(selecting.y);
            contextMenu.x = Math.round(contextMenu.x);
            contextMenu.y = Math.round(contextMenu.y);

            for (let i = 0; i < components.length; ++i) {
              const component = components[i];
              component.pos.x = Math.round(component.pos.x);
              component.pos.y = Math.round(component.pos.y);
            }

            for (let i = 0; i < wires.length; ++i) {
              const pos = wires[i].pos;
              for (let j = 0; j < pos.length; ++j) {
                pos[j].x = Math.round(pos[j].x);
                pos[j].y = Math.round(pos[j].y);
              }
            }

            dragging = null;
            canvas.value.style.cursor = "crosshair";
          }
        })();
      } else if (dragging.component) {
        // An animation for the component flying back to his old position
        const component = dragging.component;
        (function animate() {
          if (!dragging) return;

          let dx = dragging.pos.x - component.pos.x;
          let dy = dragging.pos.y - component.pos.y;

          component.pos.x += dx / 2.5;
          component.pos.y += dy / 2.5;

          for (let i = 0; i < component.input.length; ++i) {
            const wire = component.input[i].connection;
            if (wire) {
              wire.pos.slice(-1)[0].x += dx / 2.5;
              wire.pos.slice(-1)[0].y += dy / 2.5;
            }
          }

          for (let i = 0; i < component.output.length; ++i) {
            const wire = component.output[i].connection;
            if (wire) {
              wire.pos[0].x += dx / 2.5;
              wire.pos[0].y += dy / 2.5;
            }
          }

          if (Math.abs(dx) * zoom.value > 1 || Math.abs(dy) * zoom.value > 1) {
            dx = dx - dx / 2.5;
            dy = dy - dy / 2.5;
            requestAnimationFrame(animate);
          } else {
            // Stop animation
            component.pos.x = Math.round(component.pos.x);
            component.pos.y = Math.round(component.pos.y);

            for (let i = 0; i < component.input.length; ++i) {
              const wire = component.input[i].connection;
              if (wire) {
                wire.pos.slice(-1)[0].x = Math.round(wire.pos.slice(-1)[0].x);
                wire.pos.slice(-1)[0].y = Math.round(wire.pos.slice(-1)[0].y);
              }
            }

            for (let i = 0; i < component.output.length; ++i) {
              const wire = component.output[i].connection;
              if (wire) {
                wire.pos[0].x = Math.round(wire.pos[0].x);
                wire.pos[0].y = Math.round(wire.pos[0].y);
              }
            }

            dragging = null;
            canvas.style.cursor = "crosshair";
          }
        })();
      } else if (dragging.port) {
        dragging.port.pos.side = dragging.pos.side;
        dragging.port.pos.pos = dragging.pos.pos;
      }
    } else if (connecting) {
      connecting = null;
    } else {
      contextMenu.show();
    }
  }
}

function handleCanvasMouseMoveEvent(event: MouseEvent) {
  mouse.value.screen.x = event.x;
  mouse.value.screen.y = event.y;
  mouse.value.grid.x = Math.round(event.x / zoom.value + offset.value.x);
  mouse.value.grid.y = Math.round(-event.y / zoom.value + offset.value.y);

  if (event.button == 1) {
    if (selecting && !selecting.components) {
      if (event.ctrlKey) {
        offset.value.x -= event.movementX / zoom.value;
        offset.value.y += event.movementY / zoom.value;
        return;
      }

      selecting.w = event.x / zoom.value + offset.value.x - selecting.x;
      selecting.h = -(event.y / zoom.value - offset.value.y) - selecting.y;
    } else if (dragging) {
      if (dragging.selection) {
        const components = selecting.components;
        const wires = selecting.wires;

        const x = mouse.screen.x / zoom + offset.x;
        const y = -mouse.screen.y / zoom + offset.y;

        const dx = x - dragging.dx - selecting.x;
        const dy = y - dragging.dy - selecting.y;

        // If we are dragging a selection, we are first going to move the selection box and the context menu
        selecting.x += dx;
        selecting.y += dy;
        contextMenu.x += dx;
        contextMenu.y += dy;

        // Loop over all the components within the selections and move them
        for (let i = 0; i < components.length; ++i) {
          const component = components[i];
          component.pos.x += dx;
          component.pos.y += dy;

          for (let i = 0; i < component.input.length; ++i) {
            const wire = component.input[i].connection;
            if (wire && !wires.includes(wire)) {
              wire.pos.slice(-1)[0].x += dx;
              wire.pos.slice(-1)[0].y += dy;
            }
          }

          for (let i = 0; i < component.output.length; ++i) {
            const wire = component.output[i].connection;
            if (wire && !wires.includes(wire)) {
              wire.pos[0].x += dx;
              wire.pos[0].y += dy;
            }
          }
        }

        // Loop over all the wires within the selections and move them
        for (let i = 0; i < wires.length; ++i) {
          const pos = wires[i].pos;
          for (let j = 0; j < pos.length; ++j) {
            pos[j].x += dx;
            pos[j].y += dy;
          }

          const intersections = wires[i].intersections;
          for (let j = 0; j < intersections.length; ++j) {
            intersections[j].x += dx;
            intersections[j].y += dy;
          }
        }
      } else if (dragging.component) {
        const component = dragging.component;

        const x = mouse.screen.x / zoom + offset.x;
        const y = -mouse.screen.y / zoom + offset.y;

        const dx = x - dragging.dx - component.pos.x;
        const dy = y - dragging.dy - component.pos.y;

        // Add the delta mouse x and y (e.movementX and e.movementY) to the position of the component the user is dragging
        component.pos.x = x - dragging.dx;
        component.pos.y = y - dragging.dy;

        // Then, all the wires to and from the component need to be fixed...
        for (let i = 0; i < component.input.length; ++i) {
          const wire = component.input[i].connection;
          if (wire) {
            wire.pos.slice(-1)[0].x += dx;
            wire.pos.slice(-1)[0].y += dy;
          }
        }

        for (let i = 0; i < component.output.length; ++i) {
          const wire = component.output[i].connection;
          if (wire) {
            wire.pos[0].x += dx;
            wire.pos[0].y += dy;
          }
        }
      } else if (dragging.port) {
        const port = dragging.port;
        const pos = port.pos;
        const component = port.component;

        const x = mouse.value.screen.x / zoom.value + offset.value.x;
        const y = -mouse.value.screen.y / zoom.value + offset.value.y;

        const dx = x - port.component.pos.x;
        const dy = port.component.pos.y - y;

        if (dy < -0.5 && dx > -0.5 && dx < component.width - 0.5) {
          pos.side = 0;
          pos.pos = dx;
        } else if (
          dx > component.width - 0.5 &&
          dy > -0.5 &&
          dy < component.height - 0.5
        ) {
          pos.side = 1;
          pos.pos = dy;
        } else if (
          dy > component.height - 0.5 &&
          dx > -0.5 &&
          dx < component.width - 0.5
        ) {
          pos.side = 2;
          pos.pos = dx;
        } else if (dx < -0.5 && dy > -0.5 && dy < component.height - 0.5) {
          pos.side = 3;
          pos.pos = dy;
        }

        if (port.connection) {
          const pos = port.pos;
          const gridPos = Object.assign({}, component.pos);

          const angle = (Math.PI / 2) * pos.side;
          gridPos.x += Math.sin(angle);
          gridPos.y += Math.cos(angle);
          if (pos.side == 1) gridPos.x += component.width - 1;
          else if (pos.side == 2) gridPos.y -= component.height - 1;

          if (pos.side % 2 == 0) gridPos.x += pos.pos;
          else gridPos.y -= pos.pos;

          if (port.type == "input") {
            port.connection.pos.slice(-1)[0].x = gridPos.x;
            port.connection.pos.slice(-1)[0].y = gridPos.y;
          } else {
            port.connection.pos[0].x = gridPos.x;
            port.connection.pos[0].y = gridPos.y;
          }
        }
      }
    } else if (connecting) {
      // Scroll and return if the user is holding the ctrl key
      if (event.ctrlKey && connecting.pos.length > 1) {
        offset.value.x -= event.movementX / zoom.value;
        offset.value.y += event.movementY / zoom.value;
        return;
      }

      // Calculate the delta x and y
      let dx = mouse.value.grid.x - connecting.pos.slice(-1)[0].x;
      let dy = mouse.value.grid.y - connecting.pos.slice(-1)[0].y;

      // If dx and dy are both 0, no new positions have to be put into the wire's 'pos' array: return
      if (!dx && !dy) return;

      // If the shift key is down, we want the wire to be drawn in a straight line
      if (event.shiftKey) {
        if (!connecting.hasOwnProperty("lock")) {
          if (event.movementX != event.movementY)
            connecting.lock =
              Math.abs(event.movementX) < Math.abs(event.movementY);
        } else {
          connecting.lock ? (dx = 0) : (dy = 0);
        }
      } else {
        delete connecting.lock;
      }

      while ((dx || dy) && dx + dy < 10000) {
        const prev = connecting.pos.slice(-2)[0];
        const last = connecting.pos.slice(-1)[0];

        if (Math.abs(dx) > Math.abs(dy)) {
          if (
            prev &&
            last &&
            last.x + Math.sign(dx) == prev.x &&
            last.y == connecting.pos.slice(-2)[0].y
          ) {
            connecting.pos.splice(-1);
          } else {
            connecting.pos.push({
              x: last.x + Math.sign(dx),
              y: last.y,
            });
          }
          dx = dx - Math.sign(dx);
        } else {
          if (
            prev &&
            last &&
            last.x == prev.x &&
            last.y + Math.sign(dy) == prev.y
          ) {
            connecting.pos.splice(-1);
          } else {
            connecting.pos.push({
              x: last.x,
              y: last.y + Math.sign(dy),
            });
          }
          dy = dy - Math.sign(dy);
        }
      }

      const to = findPortByPos(
        connecting.pos.slice(-1)[0].x,
        connecting.pos.slice(-1)[0].y
      );

      if (to && to.type == "input") {
        connecting.to = to;
        wires.push(connecting);

        if (connecting.input.length > 0) {
          connectWires(connecting.input[0], connecting, true);
          /*
                          Give the intersection point to the wire with the highest index,
                          so the intersection point is drawn
                       */
          if (wires.indexOf(connecting) > wires.indexOf(connecting.input[0])) {
            connecting.intersections.push(Object.assign({}, connecting.pos[0]));
          } else {
            connecting.input[0].intersections.push(
              Object.assign({}, connecting.pos[0])
            );
          }
        }
        connect(connecting.from, to, connecting, true);

        connecting = null;
      }
    } else if (event.altKey) {
      event.preventDefault();
      offset.x -= event.movementX / zoom;
      offset.y += event.movementY / zoom;

      scrollAnimation.v =
        Math.sqrt(Math.pow(event.movementX, 2) + Math.pow(event.movementY, 2)) /
        zoom;
      scrollAnimation.r = Math.atan2(event.movementX, event.movementY);
      return false;
    } else if (event.ctrlKey) {
      event.preventDefault();
      offset.value.x -= event.movementX / zoom.value;
      offset.value.y += event.movementY / zoom.value;

      scrollAnimation.v =
        Math.sqrt(Math.pow(event.movementX, 2) + Math.pow(event.movementY, 2)) /
        zoom;
      scrollAnimation.r = Math.atan2(event.movementX, event.movementY);
      return false;
    }
  } else if (event.button == 2) {
    offset.x -= event.movementX / zoom.value;
    offset.y += event.movementY / zoom.value;

    scrollAnimation.v =
      Math.sqrt(Math.pow(event.movementX, 2) + Math.pow(event.movementY, 2)) /
      zoom;
    scrollAnimation.r = Math.atan2(event.movementX, event.movementY);

    wheelClick.value = false;
  } else if (event.button == 3) {
  }
}

// TODO: onmouseleave
function handleCanvasMouseUpEvent(event: MouseEvent) {
  mouse.screen.x = event.x;
  mouse.screen.y = event.y;
  mouse.grid.x = Math.round(event.x / zoom + offset.x);
  mouse.grid.y = Math.round(-event.y / zoom + offset.y);

  if (event.which == 1) {
    if (selecting && !selecting.components && !dragging) {
      if (Math.abs(selecting.w) < 0.5 && Math.abs(selecting.h) < 0.5) {
        //selecting = null;
        return;
      } else {
        selecting.components = findComponentsInSelection(
          selecting.x,
          selecting.y,
          Math.round(selecting.w),
          Math.round(selecting.h)
        );
        selecting.wires = findWiresInSelection2(
          selecting.x,
          selecting.y,
          Math.round(selecting.w),
          Math.round(selecting.h)
        );

        (function animate() {
          selecting.w += (Math.round(selecting.w) - selecting.w) / 4;
          selecting.h += (Math.round(selecting.h) - selecting.h) / 4;

          if (
            Math.abs(Math.round(selecting.w) - selecting.w) * zoom > 1 ||
            Math.abs(Math.round(selecting.h) - selecting.h) * zoom > 1
          ) {
            requestAnimationFrame(animate);
          } else {
            selecting.w = Math.round(selecting.w);
            selecting.h = Math.round(selecting.h);

            contextMenu.show(
              selecting.x + selecting.w,
              selecting.y + selecting.h
            );
          }
        })();
      }
    } else if (dragging) {
      if (dragging.selection) {
        /*
                   The x and y coordinate of the selection need to be integers. While dragging, they are floats. So I created a little animation for the x
                   and y coordinates of the selection becoming integers.
                   */

        const components = selecting.components;
        const wires = selecting.wires;

        (function animate() {
          let dx = Math.round(selecting.x) - selecting.x;
          let dy = Math.round(selecting.y) - selecting.y;

          selecting.x += dx / 2.5;
          selecting.y += dy / 2.5;
          contextMenu.x += dx / 2.5;
          contextMenu.y += dy / 2.5;

          for (let i = 0; i < components.length; ++i) {
            const component = components[i];
            component.pos.x += dx / 2.5;
            component.pos.y += dy / 2.5;

            for (let i = 0; i < component.input.length; ++i) {
              const wire = component.input[i].connection;
              if (wire && !wires.includes(wire)) {
                wire.pos.slice(-1)[0].x += dx / 2.5;
                wire.pos.slice(-1)[0].y += dy / 2.5;
              }
            }

            for (let i = 0; i < component.output.length; ++i) {
              const wire = component.output[i].connection;
              if (wire && !wires.includes(wire)) {
                wire.pos[0].x += dx / 2.5;
                wire.pos[0].y += dy / 2.5;
              }
            }
          }

          for (let i = 0; i < wires.length; ++i) {
            const pos = wires[i].pos;
            for (let j = 0; j < pos.length; ++j) {
              pos[j].x += dx / 2.5;
              pos[j].y += dy / 2.5;
            }

            const intersections = wires[i].intersections;
            for (let j = 0; j < intersections.length; ++j) {
              intersections[j].x += dx / 2.5;
              intersections[j].y += dy / 2.5;
            }
          }

          if (Math.abs(dx) * zoom > 1 || Math.abs(dy) * zoom > 1) {
            dx = dx - dx / 2.5;
            dy = dy - dy / 2.5;
            requestAnimationFrame(animate);
          } else {
            // Stop animation
            selecting.x = Math.round(selecting.x);
            selecting.y = Math.round(selecting.y);
            contextMenu.x = Math.round(contextMenu.x);
            contextMenu.y = Math.round(contextMenu.y);

            for (let i = 0; i < components.length; ++i) {
              const component = components[i];
              component.pos.x = Math.round(component.pos.x);
              component.pos.y = Math.round(component.pos.y);

              for (let i = 0; i < component.input.length; ++i) {
                const wire = component.input[i].connection;
                if (wire && !wires.includes(wire)) {
                  wire.pos.slice(-1)[0].x = Math.round(wire.pos.slice(-1)[0].x);
                  wire.pos.slice(-1)[0].y = Math.round(wire.pos.slice(-1)[0].y);
                }
              }

              for (let i = 0; i < component.output.length; ++i) {
                const wire = component.output[i].connection;
                if (wire && !wires.includes(wire)) {
                  wire.pos[0].x = Math.round(wire.pos[0].x);
                  wire.pos[0].y = Math.round(wire.pos[0].y);
                }
              }
            }

            for (let i = 0; i < wires.length; ++i) {
              const pos = wires[i].pos;
              for (let j = 0; j < pos.length; ++j) {
                pos[j].x = Math.round(pos[j].x);
                pos[j].y = Math.round(pos[j].y);
              }

              const intersections = wires[i].intersections;
              for (let j = 0; j < intersections.length; ++j) {
                intersections[j].x = Math.round(intersections[j].x);
                intersections[j].y = Math.round(intersections[j].y);
              }
            }

            // Only for undo purposes
            const dx = selecting.x - dragging.pos.x;
            const dy = selecting.y - dragging.pos.y;
            moveSelection(
              selecting.components,
              selecting.wires,
              -dx,
              -dy,
              false
            );
            moveSelection(selecting.components, selecting.wires, dx, dy, true);

            dragging = null;
            c.style.cursor = "crosshair";
          }
        })();
      } else {
        if (dragging.component) {
          /*
                       The x and y coordinate of the component need to be integers. While dragging, they are floats. So I created a little animation for the x
                       and y coordinates of the component becoming integers.
                       */
          const component = dragging.component;
          (function animate() {
            let dx = Math.round(component.pos.x) - component.pos.x;
            let dy = Math.round(component.pos.y) - component.pos.y;

            component.pos.x += dx / 2.5;
            component.pos.y += dy / 2.5;

            for (let i = 0; i < component.input.length; ++i) {
              const wire = component.input[i].connection;
              if (wire) {
                wire.pos.slice(-1)[0].x += dx / 2.5;
                wire.pos.slice(-1)[0].y += dy / 2.5;
              }
            }

            for (let i = 0; i < component.output.length; ++i) {
              const wire = component.output[i].connection;
              if (wire) {
                wire.pos[0].x += dx / 2.5;
                wire.pos[0].y += dy / 2.5;
              }
            }

            if (
              Math.abs(Math.round(component.pos.x) - component.pos.x) * zoom >
                1 ||
              Math.abs(Math.round(component.pos.y) - component.pos.y) * zoom > 1
            ) {
              dx = dx - dx / 2.5;
              dy = dy - dy / 2.5;
              requestAnimationFrame(animate);
            } else {
              // Stop animation
              component.pos.x = Math.round(component.pos.x);
              component.pos.y = Math.round(component.pos.y);

              for (let i = 0; i < component.input.length; ++i) {
                const wire = component.input[i].connection;
                if (wire) {
                  wire.pos.slice(-1)[0].x = Math.round(wire.pos.slice(-1)[0].x);
                  wire.pos.slice(-1)[0].y = Math.round(wire.pos.slice(-1)[0].y);
                }
              }

              for (let i = 0; i < component.output.length; ++i) {
                const wire = component.output[i].connection;
                if (wire) {
                  wire.pos[0].x = Math.round(wire.pos[0].x);
                  wire.pos[0].y = Math.round(wire.pos[0].y);
                }
              }

              // The component is already in his new place, but this function is only called for undo purposes
              moveComponent(component, undefined, undefined, true);

              dragging = null;
              c.style.cursor = "crosshair";
            }
          })();
        } else if (dragging.port) {
          const port = dragging.port;
          port.pos.pos = Math.round(port.pos.pos);

          for (let i = 0; i < port.component.input.length; ++i) {
            const port2 = port.component.input[i];
            if (port2 == port) continue;
            if (
              port2.pos.side == port.pos.side &&
              port2.pos.pos == port.pos.pos
            ) {
              port.pos.side = dragging.pos.side;
              port.pos.pos = dragging.pos.pos;
            }
          }

          for (let i = 0; i < port.component.output.length; ++i) {
            const port2 = port.component.output[i];
            if (port2 == port) continue;
            if (
              port2.pos.side == port.pos.side &&
              port2.pos.pos == port.pos.pos
            ) {
              port.pos.side = dragging.pos.side;
              port.pos.pos = dragging.pos.pos;
            }
          }

          const wire = port.connection;
          if (wire) {
            if (port.type == "input") {
              wire.pos.slice(-1)[0].x = Math.round(wire.pos.slice(-1)[0].x);
              wire.pos.slice(-1)[0].y = Math.round(wire.pos.slice(-1)[0].y);
            } else {
              wire.pos[0].x = Math.round(wire.pos[0].x);
              wire.pos[0].y = Math.round(wire.pos[0].y);
            }
          }

          movePort(port, undefined, undefined, true);

          dragging = null;
        }
      }
    } else if (connecting) {
      if (connecting.pos.length > 1) {
        const pos = connecting.pos.slice(-1)[0];
        const wire = findWireByPos(pos.x, pos.y);

        if (wire && wire != connecting) {
          wires.push(connecting);

          if (connecting.input.length > 0) {
            connectWires(connecting.input[0], connecting, true);
            /*
                           Give the intersection point to the wire with the highest index,
                           so the intersection point is drawn
                           */
            if (
              wires.indexOf(connecting) > wires.indexOf(connecting.input[0])
            ) {
              connecting.intersections.push(
                Object.assign({}, connecting.pos[0])
              );
            } else {
              connecting.input[0].intersections.push(
                Object.assign({}, connecting.pos[0])
              );
            }
          }

          connectWires(connecting, wire, true);
          if (wires.indexOf(connecting) > wires.indexOf(wire)) {
            connecting.intersections.push(Object.assign({}, pos));
          } else {
            wire.intersections.push(Object.assign({}, pos));
          }

          connect(connecting.from, undefined, connecting, true);
        }
      } else {
        const wires = findAllWiresByPos();

        // TODO: mongolen

        if (wires.length > 1) {
          const wire1PosIndex = wires[0].pos.findIndex(
            (pos) => pos.x == mouse.grid.x && pos.y == mouse.grid.y
          );
          if (wire1PosIndex) {
            const wire1Dx =
              wires[0].pos[wire1PosIndex].x - wires[0].pos[wire1PosIndex + 1].x;
            if (wire1Dx != 0) {
              const tmp = wires[0];
              wires[0] = wires[1];
              wires[1] = tmp;
            }
          }

          if (wires.indexOf(wires[0]) > wires.indexOf(wires[1])) {
            !wires[0].intersections.find(
              (pos) => pos.x == mouse.grid.x && pos.y == mouse.grid.y
            ) && wires[0].intersections.push(Object.assign({}, mouse.grid));
          } else {
            !wires[1].intersections.find(
              (pos) => pos.x == mouse.grid.x && pos.y == mouse.grid.y
            ) && wires[1].intersections.push(Object.assign({}, mouse.grid));
          }

          // TODO: meer dan 2
          if (wires.length > 2)
            dialog.warning(
              wires.length +
                " wires found. Please don't. Get out (menuutje voor Teun)"
            );
          if (
            wires[0].input.includes(wires[1]) &&
            wires[0].output.includes(wires[1])
          ) {
            console.log(1);
            const inputIndex = wires[0].input.indexOf(wires[1]);
            if (inputIndex > -1) wires[0].input.splice(inputIndex, 1);
            const outputIndex = wires[1].output.indexOf(wires[0]);
            if (outputIndex > -1) wires[1].output.splice(outputIndex, 1);

            const intersection = wires[1].intersections.find(
              (pos) => pos.x == mouse.grid.x && pos.y == mouse.grid.y
            );
            if (intersection) {
              intersection.type = 1;
            }
          } else if (wires[1].input.includes(wires[0])) {
            console.log(2);
            const inputIndex = wires[1].input.indexOf(wires[0]);
            if (inputIndex > -1) wires[1].input.splice(inputIndex, 1);
            const outputIndex = wires[0].output.indexOf(wires[1]);
            if (outputIndex > -1) wires[0].output.splice(outputIndex, 1);

            connectWires(wires[1], wires[0]);

            const intersection = wires[1].intersections.find(
              (pos) => pos.x == mouse.grid.x && pos.y == mouse.grid.y
            );
            if (intersection) {
              intersection.type = 2;
            }
          } else if (wires[1].output.includes(wires[0])) {
            console.log(3);
            const inputIndex = wires[0].input.indexOf(wires[1]);
            if (inputIndex > -1) wires[0].input.splice(inputIndex, 1);
            const outputIndex = wires[1].output.indexOf(wires[0]);
            if (outputIndex > -1) wires[1].output.splice(outputIndex, 1);

            const intersection = wires[1].intersections.findIndex(
              (pos) => pos.x == mouse.grid.x && pos.y == mouse.grid.y
            );
            if (intersection > -1) {
              wires[1].intersections.splice(intersection, 1);
            }
          } else {
            console.log(4);
            connectWires(wires[0], wires[1]);
            connectWires(wires[1], wires[0]);

            const intersection = wires[1].intersections.find(
              (pos) => pos.x == mouse.grid.x && pos.y == mouse.grid.y
            );
            if (intersection) {
              intersection.type = 3;
            }
          }
        }
      }
      connecting = null;
    } else if (event.altKey) {
      scrollAnimation.animate = true;
    } else if (event.ctrlKey) {
      scrollAnimation.animate = true;
    } else {
      const component = findComponentByPos();
      if (component && component.onmouseup) {
        component.onmouseup();
      }
    }
  } else if (event.which == 2) {
    scrollAnimation.animate = true;

    if (wheelClick) {
      const component = findComponentByPos();
      if (component) select(component.constructor);
    }

    event.preventDefault();
    return false;
  }
}

function handleCanvasDoubleClickEvent(event: MouseEvent) {
  mouse.value.screen.x = event.x;
  mouse.value.screen.y = event.y;
  mouse.value.grid.x = Math.round(event.x / zoom.value + offset.x);
  mouse.value.grid.y = Math.round(-event.y / zoom.value + offset.y);

  const component = findComponentByPos();
  if (event.which == 1 && component && component.open) {
    component.open();
  }
}

// Zooming
function handleCanvasMouseWheelEvent(event: WheelEvent) {
  event.preventDefault();

  mouse.value.screen.x = event.x;
  mouse.value.screen.y = event.y;
  mouse.value.grid.x = Math.round(event.x / zoom.value + offset.x);
  mouse.value.grid.y = Math.round(-event.y / zoom.value + offset.y);

  zoomAnimation = Math.min(
    Math.max(
      zoomAnimation -
        (zoom / 8) * ((event.deltaX || event.deltaY) > 0 ? 0.5 : -1),
      2
    ),
    300
  );
  return false;
}
