import Component from "./component";

export default class OR extends Component {
  constructor(name: string, pos: Position) {
    super(name, pos, 2, 2, { type: "char", text: "|" });
    this.addInputPort({ side: 3, pos: 1 });
    this.addInputPort({ side: 3, pos: 0 });
    this.addOutputPort({ side: 1, pos: 0 });
  }

  execute() {
    this.output[0].value = this.input[0].value | this.input[1].value;
  }
}
