import Component from "./component";

export default class NOT extends Component {
  constructor(name: string, pos: Position) {
    super(name, pos, 1, 1, { type: "char", text: "!" });
    this.addInputPort({ side: 3, pos: 0 });
    this.addOutputPort({ side: 1, pos: 0 });
  }

  execute() {
    this.output[0].value = 1 - this.input[0].value;
  }
}
