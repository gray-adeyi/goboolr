import Component from "./component";

export default class Debug extends Component {
  value = 0;

  constructor(name: string, pos: Position) {
    super(name, pos, 2, 1, { type: "icon", text: "report_problem" });
    this.addInputPort({ side: 3, pos: 0 });
  }

  function() {
    this.input[0].value = this.value;
    notifications.push(this.name + ": " + this.value);
    boolrConsole.log(this.name + ": " + this.value);
  }
}
