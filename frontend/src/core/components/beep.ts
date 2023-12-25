import Component from "./component";

export default class Beep extends Component {
  constructor(name: string, pos: Position) {
    super(name, pos, 2, 1, { type: "icon", text: "audiotrack" });
    this.addInputPort({ side: 3, pos: 0 });
    this.properties.frequency = 700;
    this.properties.duration = 200;
  }

  execute() {
    if (this.input[0].value == 1) {
      beep(this.properties.frequency, this.properties.duration);
    }
  }
}
