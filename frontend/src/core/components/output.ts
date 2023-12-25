import Component from "./component";

export default class Output extends Component {
  value = 0;

  constructor(name: string, pos: Position) {
    super(name, pos, 2, 1, { type: "value" });
    this.addInputPort({ side: 3, pos: 0 });
  }

  execute() {
    this.value = this.input[0].value;
  }
}
