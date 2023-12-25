import Component from "./component";

export default class Button extends Component {
  value: number;

  constructor(name: string, pos: Position) {
    super(name, pos, 2, 1, { type: "icon", text: "radio_button_checked" });
    this.addOutputPort({ side: 1, pos: 0 });
    this.value = 0;
  }

  onmousedown(sendToSocket = true) {
    this.value = 1;
    this.update();

    if (socket && sendToSocket) {
      socket.send(
        JSON.stringify({
          type: "mousedown",
          data: this.id,
        })
      );
    }
  }

  onmouseup(sendToSocket = true) {
    this.value = 0;
    this.update();

    if (socket && sendToSocket) {
      socket.send(
        JSON.stringify({
          type: "mouseup",
          data: this.id,
        })
      );
    }
  }

  execute() {
    this.output[0].value = this.value;
  }
}
