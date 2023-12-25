import Component from "./component";

export default class LED extends Component {
  value = 0;

  constructor(name: string, pos: Position, public color = [100, 0, 0]) {
    super(name, pos, 1, 1, { type: "value" });
    this.addInputPort({ side: 3, pos: 0 });
  }

  execute() {
    this.value = this.input[0].value;
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
    ctx.fill();
    ctx.stroke();

    let color;
    if (this.value == 1) {
      color = this.color.map((n) => Math.min(n * 2, 255) | 0);

      if (zoom > 20) ctx.shadowBlur = zoom / 3;
      ctx.shadowColor =
        "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
    } else {
      color = this.color.map((n) => Math.min(n / 2, 255) | 0);
    }
    ctx.fillStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";

    ctx.beginPath();
    ctx.arc(
      x - zoom / 2 + (this.width / 2) * zoom,
      y - zoom / 2 + (this.height / 2) * zoom,
      zoom / 4,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.shadowBlur = 0;

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
