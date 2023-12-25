import { ComponentProperties, IComponent, Icon, Port } from "../../types";
import generateId from "../generateId";

export default abstract class Component implements IComponent {
  readonly id: number = generateId();
  rotation = 0;
  properties: ComponentProperties = {};
  input: Port[] = [];
  output: Port[] = [];

  constructor(
    readonly name: string,
    pos: Postion = Object.assign({}, mouse.grid),
    width = 2,
    height = 2,
    readonly icon: Icon
  ) {
    // If no name is given, create a standard name in the format [Component type]#[Number of components with the same type that are already on the board]
    // Example: if you create an AND gate and there are already 16 AND gates on the board, the name will be AND#16
    if (!name) {
      name =
        this.constructor.name +
        "#" +
        components.filter((a) => a.constructor == this.constructor).length;
    }
    this.name = name;
  }

  update() {
    // Highlight
    if (settings.showComponentUpdates) this.highlight(250);

    // Update output ports
    this.execute();

    const wires = [];
    const values = [];
    for (let i = 0; i < this.output.length; ++i) {
      const port = this.output[i];
      // If the port is empty, skip to the next port
      if (!port.connection) continue;
      // // If this output port's value has changed, update all the connected components
      // if(port.value != port.connection.value) {
      //     port.connection.update(port.value);
      // }

      const index = wires.indexOf(port.connection);
      if (index == -1) {
        wires.push(port.connection);
        values.push(port.value);
      } else if (values[index] < port.value) {
        values[index] = port.value;
      }
    }

    for (let i = 0; i < wires.length; ++i) {
      //wires[i].update(values[i]);
      updateQueue.push(wires[i].update.bind(wires[i], values[i]));
    }
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
    if (this.outline) {
      ctx.strokeStyle = "#f00";
    } else {
      ctx.strokeStyle = "#111";
    }
    ctx.fillStyle = "#fff";
    ctx.lineWidth = zoom / 12;
    ctx.beginPath();
    ctx.rect(x - zoom / 2, y - zoom / 2, this.width * zoom, this.height * zoom);
    zoom > 24 && ctx.fill();
    ctx.stroke();

    ctx.textBaseline = "middle";

    // Draw the icon of the component
    if (this.icon && zoom > 3) {
      ctx.textAlign = "center";

      if (this.icon.type == "icon") {
        ctx.fillStyle = this.value ? "#aaa" : "#111";
        ctx.font = zoom / 1.3 + "px Material-icons";
        ctx.fillText(
          this.icon.text,
          x + ((this.width - 1) / 2) * zoom,
          y + ((this.height - 1) / 2) * zoom
        );
      } else if (this.icon.type == "char") {
        ctx.fillStyle = this.value ? "#aaa" : "#111";
        ctx.font = "normal normal normal " + zoom / 1.2 + "px Ubuntu";
        ctx.fillText(
          this.icon.text,
          x + ((this.width - 1) / 2) * zoom,
          y + ((this.height - 1) / 2) * zoom
        );
      } else if (this.icon.type == "value") {
        ctx.fillStyle = "#111";
        ctx.font = "normal normal normal " + zoom / 1.3 + "px Monospaced";
        ctx.fillText(
          this.value,
          x + ((this.width - 1) / 2) * zoom,
          y + ((this.height - 0.85) / 2) * zoom
        );
      }
    }

    // Draw the name of the component in the upper left corner
    if (this.name && zoom > 30) {
      ctx.textAlign = "left";
      ctx.font = "italic normal normal " + zoom / 7 + "px Ubuntu";
      ctx.fillStyle = "#888";
      ctx.fillText(this.name, x - 0.5 * zoom + zoom / 15, y - 0.37 * zoom);
    }

    // If this component has a delay value, draw the delay value of the component in the bottom left corner
    if (this.properties.delay && zoom > 30) {
      ctx.textAlign = "left";
      ctx.font = "italic normal normal " + zoom / 7 + "px Ubuntu";
      ctx.fillStyle = "#888";
      ctx.fillText(
        this.properties.delay + " ms",
        x - 0.5 * zoom + zoom / 15,
        y + this.height * zoom - 0.63 * zoom
      );
    }

    // Draw input pins
    for (let i = 0; i < this.input.length; ++i) {
      const screen = { x, y };
      const pos = this.input[i].pos;

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
            screen.x - ctx.measureText(name).width / 2,
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
            screen.x - ctx.measureText(name).width / 2,
            pos.side == 2 ? screen.y + zoom / 4 : screen.y - zoom / 4
          );
        }
      }
    }
  }

  addInputPort(pos: Position, name: string, properties = {}): Port {
    const port: Port = {
      id: generateId(),
      type: "input",
      component: this,
      name,
      pos,
      value: 0,
    };

    Object.assign(port, properties);

    this.input.push(port);
    return port;
  }

  addOutputPort(pos: Position, name: string, properties = {}): Port {
    const port: Port = {
      id: generateId(),
      type: "output",
      component: this,
      name,
      pos,
      value: 0,
    };

    Object.assign(port, properties);

    this.output.push(port);
    return port;
  }

  rotate() {
    // TODO: solution for input/output
    for (let i = 0; i < this.input.length; ++i) {
      if (this.input[i].connection) {
        return;
      }
    }

    for (let i = 0; i < this.output.length; ++i) {
      if (this.output[i].connection) {
        return;
      }
    }

    this.rotation = ++this.rotation % 4;

    const tmp = this.height;
    this.height = this.width;
    this.width = tmp;

    if (this.rotation == 0) {
      this.pos.y -= this.width - this.height;
    }

    if (this.rotation == 2) {
      this.pos.x -= this.width - this.height;
    }

    if (this.rotation == 3) {
      this.pos.y += this.height - this.width;
      this.pos.x += this.height - this.width;
    }

    for (let i = 0; i < this.input.length; ++i) {
      this.input[i].pos.side = ++this.input[i].pos.side % 4;
    }

    for (let i = 0; i < this.output.length; ++i) {
      this.output[i].pos.side = ++this.output[i].pos.side % 4;
    }
  }

  abstract execute(): void;
}
