import Component from "./component";

export default class Custom extends Component {
  constructor(
    name: string,
    pos: Position,
    components: Component[] = [],
    wires: Wire[] = [],
    description: string = ""
  ) {
    super(name, pos, 3, 1);

    this.properties.description = description;

    // this.components = components;
    // this.wires = wires;

    if (this.components.length || this.wires.length) this.create();
  }

  update() {
    // Highlight
    if (settings.showComponentUpdates) this.highlight(250);

    this.function();
  }

  create() {
    // Filter input and output ports out of the components array
    const input = this.components.filter(
      (component) => component.constructor == Input
    );
    const output = this.components.filter(
      (component) => component.constructor == Output
    );

    // If an input/output port is removed, remove the corresponding port
    for (let i = 0; i < this.input.length; ++i) {
      if (!input.includes(this.input[i].inputPort)) {
        if (this.input[i].connection) {
          removeWire(this.input[i].connection);
        }
        this.input.splice(i, 1);
        --i;
      }
    }
    for (let i = 0; i < this.output.length; ++i) {
      if (!output.includes(this.output[i].outputPort)) {
        if (this.output[i].connection) {
          removeWire(this.output[i].connection);
        }
        this.output.splice(i, 1);
        --i;
      }
    }

    let inputPos = 0;
    for (let i = 0; i < input.length; ++i) {
      const port = this.input.find((port) => port.inputPort == input[i]);
      if (!port) {
        while (findPortByComponent(this, 3, inputPos)) {
          ++inputPos;
          if (inputPos > this.height - 1) ++this.height;
        }

        this.addInputPort({ side: 3, pos: inputPos }, input[i].name, {
          inputPort: input[i],
        });
      } else {
        port.name = input[i].name;
      }
    }

    let outputPos = 0;
    for (let i = 0; i < output.length; ++i) {
      let port = this.output.find((port) => port.outputPort == output[i]);
      if (!port) {
        while (findPortByComponent(this, 1, outputPos)) {
          ++outputPos;
          if (outputPos > this.height - 1) ++this.height;
        }

        port = this.addOutputPort({ side: 1, pos: outputPos }, output[i].name, {
          outputPort: output[i],
        });

        output[i].port = port;
        output[i].update = function () {
          // Highlight
          if (settings.showComponentUpdates) this.highlight(250);

          this.function();

          const value = this.input[0].value;
          this.port.value = value;
          this.port.connection && this.port.connection.update(value);
        };
      } else {
        port.name = output[i].name;
      }
    }
  }

  // create() {
  //     // Reset connections
  //     for(let i = 0; i < this.input.length; ++i) {
  //         const port = this.input[i];
  //         if(port.connection) {
  //             removeWire(port.connection);
  //         }
  //     }
  //     for(let i = 0; i < this.output.length; ++i) {
  //         const port = this.output[i];
  //         if(port.connection) {
  //             removeWire(port.connection);
  //         }
  //     }
  //
  //     const input = this.components.filter(a => a.constructor == Input);
  //     const output = this.components.filter(a => a.constructor == Output);
  //
  //     this.height = Math.max(input.length,output.length,1);
  //     this.width = 3;
  //
  //     for(let i = 0; i < input.length; ++i) {
  //         this.addInputPort(
  //             input[i].name,
  //             { side: 3, pos: this.height - 1 - i },
  //             { input: input[i] }
  //         );
  //     }
  //
  //     for(let i = 0; i < output.length; ++i) {
  //         this.addOutputPort(
  //             output[i].name,
  //             { side: 1, pos: i },
  //             { output: output[i] }
  //         );
  //     }
  // }

  function() {
    for (let i = 0; i < this.input.length; ++i) {
      const port = this.input[i];
      if (port.value != port.inputPort.value) {
        port.inputPort.value = port.value;
        port.inputPort.update();
      }
    }

    for (let i = 0; i < this.output.length; ++i) {
      this.output[i].outputPort.update();
      this.output[i].value = this.output[i].outputPort.value;
    }
  }

  open() {
    const prev = path.splice(-1)[0];
    path.push({
      name: prev && prev.name,
      component: prev && prev.component,
      components: [...components],
      wires: [...wires],
      undoStack: [...undoStack],
      redoStack: [...redoStack],
      offset: Object.assign({}, offset),
      zoom,
    });

    components = this.components;
    wires = this.wires;
    undoStack = [];
    redoStack = [];
    offset = { x: 0, y: 0 };
    zoom = zoomAnimation = 100;

    path.push({
      name: this.name,
      component: this,
      components: this.components,
      wires: this.wires,
      undoStack,
      redoStack,
      offset,
      zoom,
    });

    Selected = Input;

    customComponentToolbar.show();
  }

  highlight(duration = 500) {
    this.outline = 1;
    setTimeout(() => (this.outline = 0), duration);
  }

  draw() {
    const x = (this.pos.x - offset.x) * zoom;
    const y = -(this.pos.y - offset.y) * zoom;

    if (
      !(
        x + this.width * zoom + zoom / 2 >= 0 &&
        x - zoom * 1.5 <= c.width &&
        y + this.height * zoom + zoom / 2 >= 0 &&
        y - zoom * 1.5 <= c.height
      )
    )
      return;

    // Draw the frame of the component
    ctx.fillStyle = "#111";
    ctx.strokeStyle = "#111";
    ctx.lineWidth = (zoom / 12) | 0;
    ctx.beginPath();
    ctx.rect(x - zoom / 2, y - zoom / 2, this.width * zoom, this.height * zoom);
    ctx.stroke();
    ctx.fill();

    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    // Draw the name of the component
    if (this.name && zoom > 5) {
      ctx.fillStyle = "#888";
      ctx.font = zoom / 3 + "px Ubuntu";
      ctx.fillText(
        this.name,
        x + ((this.width - 1) / 2) * zoom,
        y + ((this.height - 1) / 2) * zoom
      );
    }

    // Draw the description of the component
    const description = this.properties.description;
    if (description && zoom > 30) {
      ctx.fillStyle = "#666";
      ctx.font = zoom / 7 + "px Ubuntu";
      ctx.fillText(
        description,
        x + ((this.width - 1) / 2) * zoom,
        y + ((this.height - 0.5) / 2) * zoom
      );
    }

    ctx.strokeStyle = "#111";

    // Draw input pins
    for (let i = 0; i < this.input.length; ++i) {
      const screen = { x, y };
      const pos = this.input[i].pos;

      // let ox = x;
      // let oy = y;
      // const angle = Math.PI / 2 * pos.side;
      // if(Math.sin(angle) == 1) ox += (this.width - 1) * zoom;
      // if(Math.cos(angle) == -1) oy += (this.height - 1) * zoom;
      // ox += Math.sin(angle) / 2 * zoom;
      // oy -= Math.cos(angle) / 2 * zoom;
      //
      // if(pos.side == 2) ox += (this.width - 1) * zoom;
      // if(pos.side == 3) oy += (this.height - 1) * zoom;
      //
      // ox += Math.sin(angle + Math.PI / 2) * pos.pos * zoom;
      // oy -= Math.cos(angle + Math.PI / 2) * pos.pos * zoom;

      const angle = (Math.PI / 2) * pos.side;
      screen.x += Math.sin(angle) * zoom;
      screen.y -= Math.cos(angle) * zoom;
      if (pos.side == 1) screen.x += (this.width - 1) * zoom;
      else if (pos.side == 2) screen.y += (this.height - 1) * zoom;

      if (pos.side % 2 == 0) screen.x += pos.pos * zoom;
      else screen.y += pos.pos * zoom;

      ctx.beginPath();
      ctx.moveTo(
        screen.x - (Math.sin(angle) / 2) * zoom,
        screen.y + (Math.cos(angle) / 2) * zoom
      );
      ctx.lineTo(screen.x, screen.y);
      ctx.lineWidth = zoom / 8;
      ctx.stroke();

      if (zoom > 10) {
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, zoom / 8 - zoom / 20, 0, Math.PI * 2);
        ctx.lineWidth = zoom / 10;
        ctx.fillStyle = "#fff";
        ctx.stroke();
        ctx.fill();
      }

      if (zoom > 30) {
        const name = this.input[i].name;
        if (name) {
          ctx.fillStyle = "#888";
          ctx.font = zoom / 7 + "px Ubuntu";
          ctx.fillText(
            name,
            screen.x,
            pos.side == 2 ? screen.y + zoom / 4 : screen.y - zoom / 4
          );
        }
      }
    }

    // Draw output pins
    for (let i = 0; i < this.output.length; ++i) {
      const screen = { x, y };
      const pos = this.output[i].pos;

      const angle = (Math.PI / 2) * pos.side;
      screen.x += Math.sin(angle) * zoom;
      screen.y -= Math.cos(angle) * zoom;
      if (pos.side == 1) screen.x += (this.width - 1) * zoom;
      else if (pos.side == 2) screen.y += (this.height - 1) * zoom;

      if (pos.side % 2 == 0) screen.x += pos.pos * zoom;
      else screen.y += pos.pos * zoom;

      ctx.beginPath();
      ctx.moveTo(
        screen.x - (Math.sin(angle) / 2) * zoom,
        screen.y + (Math.cos(angle) / 2) * zoom
      );
      ctx.lineTo(screen.x, screen.y);
      ctx.lineWidth = zoom / 8;
      ctx.stroke();

      if (zoom > 10) {
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, zoom / 8, 0, Math.PI * 2);
        ctx.fillStyle = "#111";
        ctx.fill();
      }

      if (zoom > 30) {
        const name = this.output[i].name;
        if (name) {
          ctx.fillStyle = "#888";
          ctx.font = zoom / 7 + "px Ubuntu";
          ctx.fillText(
            name,
            screen.x,
            pos.side == 2 ? screen.y + zoom / 4 : screen.y - zoom / 4
          );
        }
      }
    }

    // If the component is highlighted, draw a colored layer over the frame
    if (this.outline > 0) {
      ctx.strokeStyle = "#d00";
      ctx.lineWidth = (zoom / 12) | 0;
      ctx.beginPath();
      ctx.rect(
        x - zoom / 2,
        y - zoom / 2,
        this.width * zoom,
        this.height * zoom
      );
      ctx.stroke();
    }
  }
}
