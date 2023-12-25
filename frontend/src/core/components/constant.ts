import Component from "./component";

export default class Constant extends Component {
  value = 1;
  constructor(name: string, pos: Position, value: number = 0) {
    super(name, pos, 2, 1, { type: "value" });
    this.addOutputPort({ side: 1, pos: 0 });
  }

  execute() {
    this.output[0].value = this.value;
  }
}
