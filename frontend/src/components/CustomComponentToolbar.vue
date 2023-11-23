<script lang="ts" setup>
// const customComponentToolbar = document.getElementById("customComponentToolbar");

// customComponentToolbar.querySelector(".close").onmouseup = function() {
//     const component = path.splice(-1)[0].component;

//     const data = path.slice(-1)[0];
//     components = data.components;
//     wires = data.wires;
//     undoStack = data.undoStack;
//     redoStack = data.redoStack;
//     offset = data.offset;
//     zoom = zoomAnimation = data.zoom;

//     component.create();

//     customComponentToolbar.querySelector("#name").innerHTML = path.slice(1).map(a => a.name).join(" > ");

//     customComponentToolbar.menu.style.opacity = 0;
//     customComponentToolbar.menu.style.transform = "scale(.5) translateX(80px) translateY(-40px)";
//     setTimeout(() => customComponentToolbar.menu.style.display = "none", 200);
//     customComponentToolbar.querySelector(".edit").style.transform = "rotateZ(0deg)";

//     if(path.length < 2) customComponentToolbar.hide();

//     c.focus();
// }

// customComponentToolbar.menu = customComponentToolbar.querySelector(".menu");
// customComponentToolbar.menu.onmousedown = function() {
//     this.style.opacity = 0;
//     this.style.transform = "scale(.5) translateX(80px) translateY(-40px)";
//     setTimeout(() => this.style.display = "none", 200);
//     customComponentToolbar.querySelector(".edit").style.transform = "rotateZ(0deg)";
// }

// customComponentToolbar.querySelector(".edit").onmouseup = function() {
//     if(customComponentToolbar.menu.style.display != "block") {
//         customComponentToolbar.menu.style.display = "block";
//         setTimeout(() => {
//             customComponentToolbar.menu.style.opacity = 1;
//             customComponentToolbar.menu.style.transform = "scale(1)";
//         }, 10);
//         this.style.transform = "rotateZ(180deg)";
//     } else {
//         customComponentToolbar.menu.style.opacity = 0;
//         customComponentToolbar.menu.style.transform = "scale(.5) translateX(80px) translateY(-40px)";
//         setTimeout(() => customComponentToolbar.menu.style.display = "none", 200);
//         this.style.transform = "rotateZ(0deg)";
//     }
// }

// customComponentToolbar.show = function() {
//     const component = path.slice(-1)[0];

//     this.style.display = "block";
//     this.querySelector("#name").innerHTML = path.slice(1).map(a => a.name).join(" > ");

//     setTimeout(() => {
//         this.style.top = 0;
//     }, 10);
// }

// customComponentToolbar.hide = function() {
//     this.style.top = -50;
//     setTimeout(() => {
//         this.style.display = "none";
//     }, 200);
// }
</script>

<template>
  <div id="customComponentToolbar">
    <button class="close material-icons">close</button>
    <span id="name">Full adder</span>
    <button class="edit material-icons">expand_more</button>

    <ul class="menu">
      <li onmousedown="dialog.editComponent(path.slice(-1)[0].component)">
        <i class="material-icons">edit</i>Edit
      </li>
      <li onmousedown="saveCustomComponent(path.slice(-1)[0].component)">
        <i class="material-icons">file_download</i>Save component
      </li>
    </ul>
  </div>
</template>
