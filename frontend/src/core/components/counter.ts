import Component from "./component";

export default class Counter extends Component {
  constructor(name: string, pos: Position) {
    super(name, pos, 2, 1, { type: "value" });
    this.addInputPort({ side: 3, pos: 0 });
    this.value = 0;
  }

  execute() {
    if (this.input[0].value == 1) ++this.value;
  }
}
