import Component from "./component";

export default class ROM extends Component {
  constructor(name: string, pos: Position, data = []) {
    super(name, pos, 3, 8, { type: "char", text: "ROM" });

    setTimeout(() => {
      if (
        !this.properties.hasOwnProperty("data") ||
        !this.properties.hasOwnProperty("addressWidth")
      ) {
        dialog.editRom(this);
      }
    }, 100);
  }

  execute() {
    let addr = 0;
    for (let i = 0; i < this.input.length; i++) {
      addr |= (this.input[i].value > 0) << i;
    }
    let rom = this.properties.rom;
    if (rom) {
      let content = this.properties.rom[addr];
      for (let i = 0; i < this.output.length; i++) {
        this.output[i].value = (content & (1 << i)) > 0 ? 1 : 0;
      }
    }
  }
}
