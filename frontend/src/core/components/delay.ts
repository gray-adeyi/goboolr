import Component from "./component";

export default class Delay extends Component {
  constructor(name: string, pos: Position) {
    super(name, pos, 2, 1, { type: "icon", text: "timer" });
    this.addInputPort({ side: 3, pos: 0 });
    this.addOutputPort({ side: 1, pos: 0 });

    setTimeout(() => {
      if (!this.properties.hasOwnProperty("delay")) {
        dialog.editDelay(this);
      }
    }, 100);
  }

  update() {
    // Highlight
    if (settings.showComponentUpdates) this.highlight(250);

    this.lastUpdate = new Date();

    const value = this.input[0].value;
    setTimeout(
      () =>
        updateQueue.push(() => {
          this.output[0].value = value;
          this.output[0].connection && this.output[0].connection.update(value);
        }),
      this.properties.delay
    );
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
    ctx.lineWidth = (zoom / 12) | 0;
    ctx.beginPath();
    ctx.rect(x - zoom / 2, y - zoom / 2, this.width * zoom, this.height * zoom);
    zoom > 24 && ctx.fill();
    ctx.stroke();

    const dTime = new Date() - this.lastUpdate;
    if (
      this.output[0].value == 0 &&
      dTime > 0 &&
      dTime < this.properties.delay
    ) {
      const ratio = Math.min(dTime / this.properties.delay, 1);
      ctx.fillStyle = "#ddd";
      ctx.fillRect(
        x - zoom / 2 + zoom / 24,
        y - zoom / 2 + zoom / 24,
        Math.max(this.width * zoom * ratio - zoom / 12, 0),
        this.height * zoom - zoom / 12
      );
    }

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

    // Draw the delay value of the component in the bottom left corner
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
}
