import Component from "./component";

export default class TimerStart extends Component {
  value = 0;

  constructor(name: string, pos: Position) {
    super(name, pos, 2, 1, { type: "value" });
    this.addOutputPort({ side: 1, pos: 0 });
  }

  onmousedown(sendToSocket = true) {
    this.value = 1 - this.value;
    this.update(true);

    if (socket && sendToSocket) {
      socket.send(
        JSON.stringify({
          type: "mousedown",
          data: this.id,
        })
      );
    }
  }

  update() {
    console.time();
    // timerStart = new Date();

    this.execute();

    this.output[0].value = this.value;
    this.output[0].connection && this.output[0].connection.update(this.value);
  }

  execute() {
    this.output[0].value = this.value;
  }
}
