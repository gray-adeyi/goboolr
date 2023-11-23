<script lang="ts" setup>
import { ref, Ref } from "vue";

const showMainMenu = ref(true);
const showNewBoardMenu = ref(true);
const showOpenBoardMenu = ref(false);
const showSettings = ref(false);

const boardName = ref("");
const fileName = ref("This board will be saved as new-board.board");
const fileNameElement: Ref<HTMLDivElement | null> = ref(null);

function showFileName() {
  if (fileNameElement.value) {
    fileNameElement.value.style.opacity = "1";
  }
}

function hideFileName() {
  if (fileNameElement.value) {
    fileNameElement.value.style.opacity = "0";
  }
}

function updateFileName() {
  setTimeout(() => {
    const name = createFileName(boardName.value);

    if (fileNameElement.value) {
      if (name != boardName.value + ".board") {
        fileName.value = "This board will be saved as " + name;
        fileNameElement.value.style.opacity = "1";
      } else fileNameElement.value.style.opacity = "0";
    }
  });
}

// --------------------------- OLD CODE

// const mainMenu = document.querySelector(".main-menu");

// mainMenu.show = function () {
//   openedSaveFile && save();
//   this.style.display = "block";

//   setTimeout(() => {
//     this.style.opacity = 1;
//   }, 10);

//   this.querySelector("h1").style.top = 0;

//   const buttons = this.querySelectorAll(".main-menu > button");
//   for (let i of buttons) {
//     i.style.top = 0;
//     i.style.opacity = 1;
//     i.style.transform = "translateX(0px)";

//     i.querySelector(".material-icons").style.transform = "translateX(0px)";
//   }

//   setTimeout(() => (loading.style.display = "none"));
//   setTimeout(clearBoard, 1000);
// };

// mainMenu.hide = function () {
//   for (let i of sub) i.hide();

//   const buttons = this.querySelectorAll("button");
//   for (let i of buttons) {
//     i.style.top = "100%";
//   }

//   this.querySelector("h1").style.top = "-100%";

//   this.style.opacity = 0;

//   setTimeout(() => {
//     this.style.display = "none";
//     c.focus();

//     if (!localStorage.pwsData) {
//       dialog.welcome();
//     }
//   }, 500);
// };

// // Loading indicator
// const loading = document.querySelector(".main-menu .loading");

// // Sub menu's
// const sub = document.querySelectorAll(".main-menu .sub");

// // Apply show and hide methods to sub menu's
// for (let i of sub) {
//   i.show = function () {
//     i.onopen && i.onopen();

//     this.style.display = "block";
//     const height =
//       Math.min(innerHeight - this.getBoundingClientRect().bottom, 0) - 100;

//     setTimeout(() => {
//       this.style.opacity = 1;
//       this.style.transform = "translateY(0px)";
//       mainMenu.style.transform = `translateY(${height}px)`;
//     }, 10);

//     setTimeout(
//       () => this.querySelector("input") && this.querySelector("input").focus(),
//       10
//     );

//     for (let j of sub) i != j && j.hide();
//   };

//   i.hide = function () {
//     this.style.opacity = 0;
//     this.style.transform = "translateY(-50px)";
//     mainMenu.style.transform = "translateY(0px)";
//     setTimeout(() => (this.style.display = "none"), 500);

//     i.onclose && i.onclose();
//   };

//   i.toggle = function () {
//     if (this.style.display != "block") this.show();
//     else this.hide();
//   };

//   i.onkeydown = function (e) {
//     if (e.which == 13) {
//       const buttons = this.querySelectorAll("button");
//       buttons[buttons.length - 1] && buttons[buttons.length - 1].click();
//     } else if (e.which == 27) {
//       this.hide();
//     }
//   };
// }

// document.body.onkeydown = (e) => {
//   if (e.which == 27) {
//     for (let i of sub) i.hide();
//   }
// };

// const newBoardMenu = document.querySelector(".main-menu .new-board");
// const openBoardMenu = document.querySelector(".main-menu .open-board");
// const settingsMenu = document.querySelector(".main-menu .settings");

// newBoardMenu.onopen = function () {
//   this.querySelector("#boardname").value = "";
//   this.querySelector("#filename").innerHTML =
//     "This board will be saved as new-board.board";
//   this.querySelector("#filename").style.opacity = 1;

//   setTimeout(() => this.querySelector("#boardname").focus(), 10);
// };

// openBoardMenu.onopen = function () {
//   const list = document.querySelector(".open-board ul");

//   list.innerHTML = "";
//   readSaveFiles();

//   if (saves.length < 1) {
//     const li = document.createElement("li");
//     li.innerHTML = "You have no saved boards";
//     li.style.textAlign = "center";
//     li.style.color = "#888";
//     list.appendChild(li);
//     return;
//   }

//   for (let save of saves) {
//     const li = document.createElement("li");
//     li.save = save;

//     li.appendChild(document.createTextNode(`${save.name}`));

//     // Remove board button
//     const removeBtn = document.createElement("i");
//     removeBtn.className = "material-icons";
//     removeBtn.title = "Remove board";
//     removeBtn.innerHTML = "delete";
//     removeBtn.onclick = function (e) {
//       dialog.confirm(
//         "Are you sure you want to delete " + this.parentNode.save.name + "?",
//         () => {
//           fs.unlink(savesFolder + save.fileName, (err) => console.log(err));
//           const index = saves.indexOf(save);
//           if (index > -1) saves.splice(index, 1);
//           openBoardMenu.onopen();
//         }
//       );
//       e.stopPropagation();
//     };
//     li.appendChild(removeBtn);

//     // Edit board button
//     const editBtn = document.createElement("i");
//     editBtn.className = "material-icons";
//     editBtn.title = "Edit board";
//     editBtn.innerHTML = "edit";
//     editBtn.onclick = function (e) {
//       dialog.editBoard(save);
//       e.stopPropagation();
//     };
//     li.appendChild(editBtn);

//     // Convert file size
//     const i = Math.floor(Math.log(save.fileSize) / Math.log(1024));
//     const size =
//       (save.fileSize / Math.pow(1024, i)).toFixed(2) * 1 +
//       " " +
//       ["bytes", "KB", "MB", "GB", "TB"][i];

//     const sizeSpan = document.createElement("span");
//     sizeSpan.innerHTML = `<span>${size}</span>`;
//     li.appendChild(sizeSpan);

//     const fileNameSpan = document.createElement("span");
//     fileNameSpan.innerHTML = `<span>${save.fileName}</span>`;
//     li.appendChild(fileNameSpan);

//     li.onclick = () => {
//       openSaveFile(save);
//       openBoardMenu.hide();
//       mainMenu.hide();
//     };

//     list.appendChild(li);
//   }
// };

// settingsMenu.onopen = function () {
//   this.querySelector("#settings") &&
//     this.removeChild(this.querySelector("#settings"));

//   const settingsList = document.getElementById("settings").cloneNode(true);
//   settingsList.style.display = "block";
//   this.insertBefore(settingsList, this.querySelector("br"));

//   const scrollAnimationOption = settingsList.querySelector(
//     ".option.scrollAnimation"
//   );
//   scrollAnimationOption.checked = settings.scrollAnimation;

//   const zoomAnimationOption = settingsList.querySelector(
//     ".option.zoomAnimation"
//   );
//   zoomAnimationOption.checked = settings.zoomAnimation;

//   const showDebugInfoOption = settingsList.querySelector(
//     ".option.showDebugInfo"
//   );
//   showDebugInfoOption.checked = settings.showDebugInfo;

//   const showComponentUpdatesOption = settingsList.querySelector(
//     ".option.showComponentUpdates"
//   );
//   showComponentUpdatesOption.checked = settings.showComponentUpdates;

//   settingsList.querySelector("#settings #reset").onclick = () =>
//     dialog.confirm(
//       "Are you sure you want to clear all local stored data?",
//       () => {
//         delete localStorage.pwsData;
//         window.onbeforeunload = undefined;
//         location.reload();
//       }
//     );

//   this.apply = () => {
//     settings.scrollAnimation = scrollAnimationOption.checked;
//     settings.zoomAnimation = zoomAnimationOption.checked;
//     settings.showDebugInfo = showDebugInfoOption.checked;
//     settings.showComponentUpdates = showComponentUpdatesOption.checked;
//   };
// };
</script>

<template>
  <div v-if="showMainMenu" class="main-menu">
    <h1>BOOLR</h1>
    <span class="version"></span>

    <div class="loading">LOADING...</div>
    <button
      @click.ctrlKey="showMainMenu = false"
      @click="showNewBoardMenu = !showNewBoardMenu"
    >
      <i class="material-icons">add</i>NEW BOARD
    </button>

    <div v-if="showNewBoardMenu" class="sub new-board">
      <h1>Create new board</h1>
      <input
        id="boardname"
        v-model="boardName"
        placeholder="Board name"
        @focus="showFileName"
        @blur="hideFileName"
        @keydown="updateFileName"
      />
      <div id="filename" ref="fileNameElement">{{ fileName }}</div>

      <br /><br />
      <p style="color: rgba(0, 0, 0, 0.5)">
        Hint: hold the Ctrl-key while clicking the NEW BOARD button to go
        sandbox mode without creating a save file
      </p>
      <button
        @click="
          () => {
            showNewBoardMenu = false;
            boardName = '';
          }
        "
      >
        Cancel
      </button>
      <button
        @click="
          () => {
            createSaveFile(boardName);
            showMainMenu = false;
          }
        "
      >
        Create
      </button>
    </div>

    <button @click="showOpenBoardMenu = !showOpenBoardMenu">
      <i class="material-icons">folder</i>OPEN BOARD
    </button>

    <div v-if="showOpenBoardMenu" class="sub open-board">
      <h1>Open board</h1>
      <ul></ul>
      <p>To open boards, paste a .board file in the saves folder</p>
      <!-- TODO: Open file dialog in go backend -->
      <button
        @click="
          require('child_process').exec('xdg-open ' + __dirname + '/../saves')
        "
      >
        Open saves folder
      </button>
      <!-- TODO: Check what a BOOLR server is -->
      <button @click="dialog.connectToServer()">
        Connect to a BOOLR server
      </button>
    </div>

    <button @click="showSettings = !showSettings">
      <i class="material-icons">settings</i>SETTINGS
    </button>

    <div v-if="showSettings" class="sub settings">
      <h1>Settings</h1>
      <br /><br />
      <button @click="showSettings = false">Cancel</button>
      <!-- TODO: Find the apply function -->
      <button onclick="this.parentNode.apply(); this.parentNode.hide()">
        OK
      </button>
    </div>

    <!-- TODO: Implement app close feature -->
    <button @click="window.close()">
      <i class="material-icons">exit_to_app</i>QUIT
    </button>
  </div>
</template>

<style scoped>
.main-menu {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  padding-bottom: 1000px;
  width: 100%;
  z-index: 100;
  text-align: center;
  background: #111;
  overflow-y: auto;

  opacity: 1;
  transform: translateY(0px);
  transition: opacity 1s, transform 0.5s;
}

.main-menu > h1 {
  display: inline-block;
  font-family: "Righteous";
  font-size: 160px;
  font-weight: 400;
  color: #ddd;
  margin: 40px 0;

  position: relative;
  top: 0;
  transition: top 0.5s;
}

.main-menu .version {
  display: inline-block;
  font-family: "Ubuntu", Arial;
  font-size: 18px;
  color: #ddd;
}

.main-menu .loading {
  position: fixed;
  top: 25%;
  font-family: "Ubuntu", Arial;
  font-size: 30px;
  color: #888;
  width: 100%;
  text-align: center;
}

.main-menu > button {
  position: relative;
  display: block;
  background: transparent;

  border: 0px solid #111;
  margin: 10px auto;
  padding: 30px;
  width: 400px;
  font-family: Ubuntu;
  font-size: 24px;
  color: #ddd;
  outline: none;
  cursor: pointer;

  opacity: 0;
  transform: translateX(-50px);
  top: 0;
  transition: opacity 1s, transform 0.75s, top 0.5s, background 0.2s, color 0.2s;
}

.main-menu > button:hover {
  transform: translateX(5px);
}

.main-menu > button .material-icons {
  position: relative;
  top: -8px;
  float: left;
  font-size: 40px;
  color: #888;

  transform: translateX(30px);
  transition: transform 0.75s, color 0.5s;
}

.main-menu > button:hover .material-icons {
  color: #ddd;
}

.main-menu > button .material-icons:after {
  content: "";
  position: relative;
  left: 40px;
  top: 0px;
  border-left: 3px solid #888;
  color: #888;
}

.main-menu .sub {
  position: fixed;
  display: none;
  width: 100%;
  background: #ddd;
  padding-bottom: 50px;
  z-index: 1;
  font-family: "Ubuntu", Arial;

  opacity: 0;
  transform: translateY(-50px);
  transition: height 0.5s, opacity 0.5s, transform 0.5s;
}

.main-menu .sub:before {
  content: "";
  position: relative;
  border-style: solid;
  border-width: 0 15px 15px;
  border-color: #ddd transparent;
  display: block;
  width: 0;
  z-index: 3;
  top: -15px;
  left: 50%;
  margin-left: -15px;
}

.main-menu .sub h1 {
  font-family: "Ubuntu", Arial;
  font-weight: 400;
  margin: 30px;
}

.main-menu .sub button {
  background: #111;
  border: none;
  font-family: "Ubuntu", Arial;
  font-size: 16px;
  color: #ddd;
  padding: 12px 25px;
  margin: 10px;
  border-radius: 5px;
  cursor: pointer;
  outline: none;
}

.main-menu .sub button:hover {
  background: #333;
}

.main-menu .new-board input {
  display: block;
  margin: 20px auto;
  background: transparent;
  border: none;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  padding: 10px;
  width: 200px;
  font-family: "Ubuntu", Arial;
  font-size: 18px;
  outline: none;
  text-align: center;
}

.main-menu .new-board #filename {
  background: rgba(0, 0, 0, 0.1);
  color: #111;
  padding: 10px;
  font-size: 15px;
  border-radius: 5px;
  display: inline-block;
  line-height: 0px;
  height: 25px;

  opacity: 1;
  transition: opacity 0.2s;
}

.main-menu .new-board #filename:before {
  content: "";
  position: relative;
  border-style: solid;
  border-width: 0 15px 15px;
  border-color: rgba(0, 0, 0, 0.1) transparent;
  display: block;
  width: 0;
  z-index: 3;
  top: -25px;
  left: 50%;
  margin-left: -15px;
}

.main-menu .new-board input::selection {
  background: #111;
  color: #ddd;
}

.main-menu .open-board ul {
  width: 640px;
  list-style: none;
  padding: 0;
  margin: 20px auto;
  max-height: 200px;
  overflow-y: auto;
}

.main-menu .open-board ul::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

.main-menu .open-board ul::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

.main-menu .open-board ul::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 5px;
}

.main-menu .open-board li {
  font-family: "Ubuntu", Arial;
  font-size: 18px;
  padding: 20px;
  text-align: left;

  transition: background 0.2s, color 0.2s;
}

.main-menu .open-board li .material-icons {
  float: right;
  margin-left: 30px;
  cursor: pointer;
}

.main-menu .open-board li:hover {
  background: rgba(0, 0, 0, 0.1);
}

.main-menu .open-board li span {
  position: relative;
  top: 2px;
  padding-left: 20px;
  color: #555;
  font-size: 15px;
  float: right;
}

.main-menu .settings #settings {
  margin: 0 auto;
  width: 500px;
}

.main-menu .settings #settings li {
  text-align: left;
}

.main-menu .settings #settings .slider {
  background: #888;
}

.main-menu .settings #settings .slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 4px;
  bottom: 4px;
  background: #ddd;
  opacity: 0.5;
  -webkit-transition: 0.2s;
  transition: 0.2s;
}

.main-menu .settings #settings input:checked + .slider {
  background: #111;
}

.main-menu .settings #settings button {
  padding: 10px;
  background: #500;
  margin-left: -250px;
}
</style>
