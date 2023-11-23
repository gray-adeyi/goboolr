<script lang="ts" setup></script>

<template>
  <ul id="menu">
    <li onmousedown="mainMenu.show(); newBoardMenu.show()">
      <i class="material-icons">add</i>New board
      <span>Ctrl+N</span>
    </li>
    <li onmousedown="mainMenu.show(); openBoardMenu.show()">
      <i class="material-icons">folder</i>Open board<span>Ctrl+O</span>
    </li>
    <li onmousedown="save(true)">
      <i class="material-icons">save</i>Save board<span>Ctrl+S</span>
    </li>
    <li onmousedown="boolrConsole.show()">
      <i class="material-icons">featured_play_list</i>Open console<span
        >Shift+T</span
      >
    </li>
    <li onmousedown="dialog.settings()">
      <i class="material-icons">settings</i>Settings<span>Ctrl+Shift+S</span>
    </li>
    <li onmousedown="tutorial.show()">
      <i class="material-icons">help</i>Open tutorial<span>F1</span>
    </li>
    <li onmousedown="mainMenu.show();">
      <i class="material-icons">exit_to_app</i>Quit
    </li>

    <script>
      const menu = document.getElementById("menu");
      menu.style.opacity = "0";
      menu.onmousedown = () => setTimeout(menu.hide.bind(menu));

      menu.show = function () {
        this.style.opacity = 1;
        this.style.bottom = 30;

        document.querySelector("#menuopen .container").style.transform =
          "rotateZ(180deg)";
      };

      menu.hide = function () {
        this.style.opacity = 0;
        this.style.bottom = -this.clientHeight - 100;

        document.querySelector("#menuopen .container").style.transform =
          "rotateZ(0deg)";
      };
    </script>
  </ul>
</template>
