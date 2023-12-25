import Component from "./component";

export default class Display extends Component {
  constructor(name: string, pos: Position, color = "#a00") {
    super(name, pos, 4, 5, { type: "value" });
    this.addInputPort({ side: 0, pos: 0 }, "A");
    this.addInputPort({ side: 0, pos: 1 }, "B");
    this.addInputPort({ side: 0, pos: 2 }, "C");
    this.addInputPort({ side: 0, pos: 3 }, "D");
    this.addInputPort({ side: 2, pos: 0 }, "E");
    this.addInputPort({ side: 2, pos: 1 }, "F");
    this.addInputPort({ side: 2, pos: 2 }, "G");
    this.addInputPort({ side: 2, pos: 3 }, "DP");
    this.value = 0;

    this.lineWidth = 0.12;
    this.hOffset = this.width / 8;

    this.colorOff = "#300";
    this.colorOn = "#f00";
  }

  update() {}

  draw() {
    let x = (this.pos.x - offset.x) * zoom;
    let y = -(this.pos.y - offset.y) * zoom;

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
    ctx.fillStyle = this.fillColor || "#111";
    ctx.strokeStyle = this.strokeColor || "#111";
    ctx.lineWidth = (zoom / 12) | 0;
    ctx.beginPath();
    ctx.rect(x - zoom / 2, y - zoom / 2, this.width * zoom, this.height * zoom);
    ctx.fill();
    ctx.stroke();

    // Draw display segments
    x = x - zoom / 2;
    y = y - zoom / 2;
    const hOffset = (this.width / 8) * zoom;
    const vOffset =
      (this.width / 8 / 2 / (this.width - 1)) * this.height * zoom;
    const lineWidth = this.lineWidth * this.height * zoom;
    const margin = zoom / 20;

    ctx.shadowColor = this.colorOn;

    // Segment A, top mid
    ctx.fillStyle = this.input[0].value ? this.colorOn : this.colorOff;
    if (zoom > 20) ctx.shadowBlur = this.input[0].value ? zoom / 2 : 0;
    let sx = x + hOffset + lineWidth + margin;
    let sy = y + vOffset;
    let sLength =
      (this.width - 1) * zoom - 2 * lineWidth - hOffset - margin * 2;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + sLength, sy);
    ctx.lineTo(sx + sLength + lineWidth / 2, sy + lineWidth / 2);
    ctx.lineTo(sx + sLength, sy + lineWidth);
    ctx.lineTo(sx, sy + lineWidth);
    ctx.lineTo(sx - lineWidth / 2, sy + lineWidth / 2);
    ctx.fill();

    // Segment G, mid mid
    ctx.fillStyle = this.input[6].value ? this.colorOn : this.colorOff;
    if (zoom > 20) ctx.shadowBlur = this.input[6].value ? zoom / 2 : 0;
    sy = y + ((this.height / 2) * zoom - lineWidth / 2);
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + sLength, sy);
    ctx.lineTo(sx + sLength + lineWidth / 2, sy + lineWidth / 2);
    ctx.lineTo(sx + sLength, sy + lineWidth);
    ctx.lineTo(sx, sy + lineWidth);
    ctx.lineTo(sx - lineWidth / 2, sy + lineWidth / 2);
    ctx.fill();

    // Segment D, bottom mid
    ctx.fillStyle = this.input[3].value ? this.colorOn : this.colorOff;
    if (zoom > 20) ctx.shadowBlur = this.input[3].value ? zoom / 2 : 0;
    sy = y + (this.height * zoom - vOffset - lineWidth);
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + sLength, sy);
    ctx.lineTo(sx + sLength + lineWidth / 2, sy + lineWidth / 2);
    ctx.lineTo(sx + sLength, sy + lineWidth);
    ctx.lineTo(sx, sy + lineWidth);
    ctx.lineTo(sx - lineWidth / 2, sy + lineWidth / 2);
    ctx.fill();

    // Segment F, top left
    ctx.fillStyle = this.input[5].value ? this.colorOn : this.colorOff;
    if (zoom > 20) ctx.shadowBlur = this.input[5].value ? zoom / 2 : 0;
    sx = x + hOffset;
    sy = y + vOffset + lineWidth + margin;
    sLength = (this.height / 2) * zoom - lineWidth * 1.5 - vOffset - margin * 2;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + lineWidth / 2, sy - lineWidth / 2);
    ctx.lineTo(sx + lineWidth, sy);
    ctx.lineTo(sx + lineWidth, sy + sLength);
    ctx.lineTo(sx + lineWidth / 2, sy + sLength + lineWidth / 2);
    ctx.lineTo(sx, sy + sLength);
    ctx.fill();

    // Segment B, bottom left
    ctx.fillStyle = this.input[1].value ? this.colorOn : this.colorOff;
    if (zoom > 20) ctx.shadowBlur = this.input[1].value ? zoom / 2 : 0;
    sx = x + (this.width - 1) * zoom - lineWidth;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + lineWidth / 2, sy - lineWidth / 2);
    ctx.lineTo(sx + lineWidth, sy);
    ctx.lineTo(sx + lineWidth, sy + sLength);
    ctx.lineTo(sx + lineWidth / 2, sy + sLength + lineWidth / 2);
    ctx.lineTo(sx, sy + sLength);
    ctx.fill();

    // Segment E, top right
    ctx.fillStyle = this.input[4].value ? this.colorOn : this.colorOff;
    if (zoom > 20) ctx.shadowBlur = this.input[4].value ? zoom / 2 : 0;
    sx = x + hOffset;
    sy = y + (this.height / 2) * zoom + lineWidth / 2 + margin;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + lineWidth / 2, sy - lineWidth / 2);
    ctx.lineTo(sx + lineWidth, sy);
    ctx.lineTo(sx + lineWidth, sy + sLength);
    ctx.lineTo(sx + lineWidth / 2, sy + sLength + lineWidth / 2);
    ctx.lineTo(sx, sy + sLength);
    ctx.fill();

    // Segment C, bottom right
    ctx.fillStyle = this.input[2].value ? this.colorOn : this.colorOff;
    if (zoom > 20) ctx.shadowBlur = this.input[2].value ? zoom / 2 : 0;
    sx = x + (this.width - 1) * zoom - lineWidth;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + lineWidth / 2, sy - lineWidth / 2);
    ctx.lineTo(sx + lineWidth, sy);
    ctx.lineTo(sx + lineWidth, sy + sLength);
    ctx.lineTo(sx + lineWidth / 2, sy + sLength + lineWidth / 2);
    ctx.lineTo(sx, sy + sLength);
    ctx.fill();

    // Decimal Point segment
    ctx.fillStyle = this.input[7].value ? this.colorOn : this.colorOff;
    if (zoom > 20) ctx.shadowBlur = this.input[7].value ? zoom / 2 : 0;
    ctx.beginPath();
    ctx.arc(
      x + (this.width - 0.5) * zoom,
      y + (this.height - 0.5) * zoom,
      zoom / 4,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.shadowBlur = 0;

    x = x + zoom / 2;
    y = y + zoom / 2;

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
