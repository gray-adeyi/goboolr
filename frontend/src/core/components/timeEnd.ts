import Component from "./component";

export default class TimerEnd extends Component {
  value = 0;

  constructor(name: string, pos: Position) {
    super(name, pos, 2, 1, { type: "value" });
    this.addInputPort({ side: 3, pos: 0 });
  }

  update() {
    console.timeEnd();
    boolrConsole.log(this.name + ": " + (new Date() - timerStart) + " ms");

    this.execute();

    this.input[0].value == 1 && (this.value = 1);
  }

  execute() {
    this.value = this.input[0].value;
  }
}
