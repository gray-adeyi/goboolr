import Component from "./component";

export default class Clock extends Component {
  value: number;

  constructor(readonly name: string, pos: Position) {
    super(name, pos, 2, 1, { type: "icon", text: "access_time" });
    this.addOutputPort({ side: 1, pos: 0 });
    this.value = 0;

    setTimeout(() => {
      if (this.properties.hasOwnProperty("delay")) {
        this.tick();
      } else {
        dialog.editDelay(this, this.tick.bind(this));
      }
    }, 100);
  }

  tick() {
    this.value = 1 - this.value;
    this.update();
    this.properties.delay &&
      setTimeout(
        () => updateQueue.push(this.tick.bind(this)),
        this.properties.delay
      );
  }

  execute() {
    this.output[0].value = this.value;
  }
}
