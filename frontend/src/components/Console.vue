<script lang="ts" setup>
// const boolrConsole = document.querySelector(".console");
// const container = boolrConsole.querySelector(".container");
// const focusedInput = container.querySelector(".focused-input");
// focusedInput.input = focusedInput.querySelector("input");

// boolrConsole.history = [];
// let historyIndex = 0;

// boolrConsole.show = function () {
//   this.style.display = "block";
//   setTimeout(() => {
//     this.style.opacity = 1;
//     this.style.transform = "scale(1)";
//     focusedInput.input.focus();
//   }, 10);
// };

// boolrConsole.hide = function () {
//   this.style.opacity = 0;
//   this.style.transform = "scale(.9) translateX(-63px) translateY(150px)";
//   setTimeout(() => {
//     this.style.display = "none";
//     c.focus();
//   }, 200);
// };

// boolrConsole.toggleFullscreen = function () {
//   this.fullscreen = !this.fullscreen;

//   this.style.height = this.fullscreen ? innerHeight - 40 : "460px";
//   this.style.width = this.fullscreen ? innerWidth - 40 : "360px";

//   focusedInput.input.focus();
// };

// boolrConsole.clear = function () {
//   container.innerHTML = "";
//   container.appendChild(focusedInput);
//   focusedInput.input.focus();
// };

// boolrConsole.log = function (msg) {
//   const log = document.createElement("div");
//   log.className = "log";
//   log.innerHTML = msg;
//   container.insertBefore(log, focusedInput);
//   container.scrollTop = container.scrollHeight;
// };

// boolrConsole.error = function (msg) {
//   const log = document.createElement("div");
//   log.className = "error";
//   log.innerHTML = msg;
//   container.insertBefore(log, focusedInput);
//   container.scrollTop = container.scrollHeight;
// };

// boolrConsole.onkeydown = function (e) {
//   if (e.which == 13) {
//     // Enter key
//     const input = document.createElement("div");
//     input.className = "input";
//     input.innerHTML = focusedInput.input.value;
//     container.insertBefore(input, focusedInput);

//     boolrConsole.history.push(focusedInput.input.value);

//     try {
//       const output = document.createElement("div");
//       output.className = "output";
//       output.innerHTML = inputHandler(focusedInput.input.value) || "";
//       container.insertBefore(output, focusedInput);
//     } catch (e) {
//       this.error(e);
//     }

//     focusedInput.input.value = "";
//     container.scrollTop = container.scrollHeight;
//     historyIndex = 0;
//   } else if (e.which == 38) {
//     if (historyIndex > -boolrConsole.history.length) {
//       focusedInput.input.value = boolrConsole.history.slice(--historyIndex)[0];
//     }

//     // Move caret to the end
//     setTimeout(() => (focusedInput.input.value = focusedInput.input.value));
//   } else if (e.which == 40) {
//     if (historyIndex == -1) {
//       historyIndex = 0;
//       focusedInput.input.value = "";
//     } else if (historyIndex < -1) {
//       focusedInput.input.value = boolrConsole.history.slice(++historyIndex)[0];
//     }

//     // Move caret to the end
//     setTimeout(() => (focusedInput.input.value = focusedInput.input.value));
//   } else if (e.which == 27) {
//     this.hide();
//   } else if (e.which == 76 && e.ctrlKey) {
//     this.clear();

//     // Prevents default address bar focus
//     return false;
//   } else if (e.which == 9) {
//     if (
//       focusedInput.input.value == "" ||
//       focusedInput.input.value.includes(" ")
//     )
//       return false;

//     let found = [];
//     for (let i = 0; i < commands.length; ++i) {
//       if (commands[i].match(new RegExp("^" + focusedInput.input.value))) {
//         found.push(commands[i]);
//       }
//     }
//     focusedInput.input.value = found[0] + " ";

//     // Move caret to the end
//     setTimeout(() => (focusedInput.input.value = focusedInput.input.value));

//     // Prevent default action
//     return false;
//   }
// };

// const commands = [
//   "set",
//   "get",
//   "variables",
//   "remove",
//   "edit",
//   "findComponent",
//   "pause",
// ];

// boolrConsole.help = function () {
//   this.log("<b>set [name] [value]</b>: sets a variable");
//   this.log("<b>get [name]</b>: returns value of a variable");
//   this.log("<b>variables</b>: return list of all variables");
//   this.log("<b>remove ([name] | [id] | [x] [y])</b>: removes component");
//   this.log(
//     "<b>edit ([name] | [id] | [x] [y])</b>: edits property of component"
//   );
//   this.log("<b>findComponent ([name] | [id] | [x] [y])</b>: finds component");
//   this.log("<b>start</b>: starts simulation");
//   this.log("<b>pause</b>: pauses simulation");
// };

// function inputHandler(input) {
//   input = input.split(" ");
//   const command = input[0];
//   const args = input.slice(1);

//   switch (command) {
//     case "set":
//       return setVariable(args[0], args[1]);
//       break;
//     case "get":
//       return getVariable(args[0]);
//       break;
//     case "variables":
//       for (let i in variables) {
//         boolrConsole.log(i + ": " + variables[i]);
//       }
//       break;
//     case "remove":
//       if (args.length == 1 && isNaN(args[0])) {
//         var component = findComponentByName(args[0]);
//         if (!component) return "Component " + args[0] + " not found";
//       } else if (args.length == 1) {
//         var component = findComponentByID(+args[0]);
//         if (!component) return "Component with ID " + args[0] + " not found";
//       } else if (args.length > 1) {
//         var x = args[0] == "~" ? mouse.grid.x : +args[0];
//         var y = args[1] == "~" ? mouse.grid.y : +args[1];
//         var component = findComponentByPos(x, y);
//         if (!component) return "No component found at " + x + "," + y;
//       }
//       removeComponent(component, true);
//       return "Removed component " + component.name;
//       break;
//     case "edit":
//       if (
//         (!isNaN(args[0]) || args[0] == "~") &&
//         (!isNaN(args[1]) || args[1] == "~")
//       ) {
//         var x = args[0] == "~" ? mouse.grid.x : +args[0];
//         var y = args[1] == "~" ? mouse.grid.y : +args[1];
//         var component = findComponentByPos(x, y);
//         if (!component) return "No component found at " + x + "," + y;

//         edit(component, args[2], args[3], true);
//       } else if (!isNaN(args[0])) {
//         var component = findComponentByID(+args[0]);
//         if (!component) return "Component with ID " + args[0] + " not found";

//         edit(component, args[1], args[2], true);
//       } else if (args.length > 1) {
//         var component = findComponentByName(args[0]);
//         if (!component) return "Component " + args[0] + " not found";

//         edit(component, args[1], args[2], true);
//       }
//       break;
//     case "findComponent":
//       if (args.length == 1 && isNaN(args[0])) {
//         var component = findComponentByName(args[0]);
//         if (!component) return "Component " + args[0] + " not found";
//         else
//           return (
//             "Component " +
//             args[0] +
//             " found at " +
//             component.pos.x +
//             "," +
//             component.pos.y
//           );
//       } else if (args.length == 1) {
//         var component = findComponentByID(+args[0]);
//         if (!component) return "Component with ID " + args[0] + " not found";
//         else
//           return (
//             "Component with ID " +
//             args[0] +
//             " found at " +
//             component.pos.x +
//             "," +
//             component.pos.y
//           );
//       } else if (args.length > 1) {
//         var x = args[0] == "~" ? mouse.grid.x : +args[0];
//         var y = args[1] == "~" ? mouse.grid.y : +args[1];
//         var component = findComponentByPos(x, y);
//         if (!component) return "No component found at " + x + "," + y;
//         else {
//           return (
//             "Component " +
//             component.name +
//             " found at " +
//             component.pos.x +
//             "," +
//             component.pos.y
//           );
//         }
//       }
//       break;
//     case "start":
//       pauseSimulation = false;
//       document.querySelector("#pause").innerHTML = "play_arrow";
//       return "Simulation started";
//       break;
//     case "pause":
//       pauseSimulation = true;
//       document.querySelector("#pause").innerHTML = "pause";
//       return "Simulation paused";
//       break;
//     case "help":
//       boolrConsole.help();
//       break;
//     case "?":
//       boolrConsole.help();
//       break;
//     case "openDevTools":
//       require("electron").remote.getCurrentWindow().webContents.openDevTools();
//       return "Opened Developer Tools";
//       break;
//     default:
//       throw "Command not found: " + command;
//       break;
//   }
// }
</script>

<template>
  <div class="console">
    <div class="container">
      <div class="focused-input">
        <span class="arrow material-icons">keyboard_arrow_right</span>
        <input spellcheck="false" />
      </div>
    </div>
    <div class="toolbar">
      <button
        class="material-icons"
        onclick="boolrConsole.clear();"
        title="Clear console"
      >
        delete
      </button>
      <button
        class="material-icons"
        onclick="boolrConsole.toggleFullscreen();"
        title="Fullscreen"
      >
        fullscreen
      </button>
      <button
        class="material-icons"
        onclick="boolrConsole.hide()"
        title="Close console"
      >
        exit_to_app
      </button>
      <button class="material-icons" title="Help">help</button>
    </div>
  </div>
</template>

<style scoped>
.console {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  height: 460px;
  width: 360px;
  background: #111;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  border-radius: 0 5px 0 0;
  padding: 20px;
  z-index: 8;

  opacity: 0;
  transform: scale(0.9) translateX(-63px) translateY(150px);
  transition: opacity 0.2s, transform 0.2s, width 0.2s, height 0.2s;
}

.console .container {
  height: 95%;
  width: 100%;
  overflow-y: auto;
}

.console .container .focused-input .arrow {
  color: #ddd;
  position: relative;
  top: 7px;
}

.console .container .focused-input input {
  background: transparent;
  border: none;
  padding: 10px 10px 10px 2px;
  font-family: "Ubuntu Mono", Monospaced;
  font-size: 18px;
  color: #ddd;
  outline: none;
  width: 90%;
}

.console .container .focused-input input::selection {
  background: rgba(255, 255, 255, 0.5);
  color: #111;
}

.console .container .input,
.console .container .output {
  padding: 2px 5px;
  font-family: "Ubuntu Mono", Monospaced;
  font-size: 18px;
  color: #ddd;
}

.console .container .output {
  color: #888;
}

.console .container .input:before,
.console .container .output:before {
  content: "keyboard_arrow_right";
  font-family: "Material-icons";
  font-size: 24px;
  color: #888;
  position: relative;
  top: 7px;
  left: -5px;
}

.console .container .output:before {
  content: "keyboard_arrow_left";
}

.console .container .log {
  background: rgba(255, 255, 255, 0.1);
  color: #ddd;
  font-family: "Ubuntu", Monospaced;
  font-size: 15px;
  padding: 10px 10px 10px 15px;
  margin-top: 5px;
  min-height: 24px;
  line-height: 25px;
}

.console .container .error {
  background: rgba(255, 0, 0, 0.1);
  color: red;
  font-family: "Ubuntu", Monospaced;
  font-size: 15px;
  padding: 10px 10px 10px 15px;
  margin-top: 5px;
  min-height: 24px;
  line-height: 12px;
}

.console .container .error:before {
  content: "error";
  font-family: "Material-icons";
  font-size: 20px;
  color: red;
  position: relative;
  top: 5px;
  left: -5px;
}

.console .toolbar {
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
  text-align: center;
}

.console .toolbar button {
  background: transparent;
  border: none;
  color: #888;
  margin: 0 15px;
  outline: none;
  cursor: pointer;
  transition: color 0.2s;
}

.console .toolbar button:hover {
  color: #ddd;
}
</style>
