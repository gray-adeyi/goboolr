<script lang="ts" setup>
// --------------------------- OLD CODE
// const tutorial = document.querySelector(".tutorial");

// tutorial.sections = tutorial.querySelectorAll(".sections div");
// tutorial.sectionIndex = 0;

// tutorial.querySelector(".index").innerHTML =
//   tutorial.sectionIndex + 1 + "/" + tutorial.sections.length;

// tutorial.nextBtn = tutorial.querySelector(".next");
// tutorial.nextBtn.onclick = function () {
//   const previousSection = tutorial.sections[tutorial.sectionIndex];
//   previousSection.style.opacity = 0;
//   previousSection.style.transform = "translateX(-500px)";

//   ++tutorial.sectionIndex;

//   const nextSection = tutorial.sections[tutorial.sectionIndex];
//   nextSection.style.opacity = 1;
//   nextSection.style.transform = "translateX(0px)";

//   tutorial.querySelector(".index").innerHTML =
//     tutorial.sectionIndex + 1 + "/" + tutorial.sections.length;

//   tutorial.previousBtn.disabled = false;
//   if (tutorial.sectionIndex >= tutorial.sections.length - 1) {
//     this.disabled = true;
//   }
// };

// tutorial.previousBtn = tutorial.querySelector(".previous");
// tutorial.previousBtn.onclick = function () {
//   const previousSection = tutorial.sections[tutorial.sectionIndex];
//   previousSection.style.opacity = 0;
//   previousSection.style.transform = "translateX(500px)";

//   --tutorial.sectionIndex;

//   const nextSection = tutorial.sections[tutorial.sectionIndex];
//   nextSection.style.opacity = 1;
//   nextSection.style.transform = "translateX(0px)";

//   tutorial.querySelector(".index").innerHTML =
//     tutorial.sectionIndex + 1 + "/" + tutorial.sections.length;

//   tutorial.nextBtn.disabled = false;
//   if (tutorial.sectionIndex < 1) {
//     this.disabled = true;
//   }
// };

// tutorial.show = function () {
//   this.style.display = "block";
//   setTimeout(() => {
//     this.style.opacity = 1;
//     this.style.left = 0;
//   }, 10);
// };

// tutorial.hide = function () {
//   this.style.opacity = 0;
//   this.style.left = "-30%";
//   setTimeout(() => {
//     this.style.display = "none";

//     for (let i of this.sections) {
//       i.style.opacity = 0;
//       i.style.transform = "translateX(500px)";
//     }

//     const nextSection = this.sections[0];
//     nextSection.style.opacity = 1;
//     nextSection.style.transform = "translateX(0px)";

//     this.sectionIndex = 0;
//     tutorial.previousBtn.disabled = true;
//     tutorial.querySelector(".index").innerHTML =
//       tutorial.sectionIndex + 1 + "/" + tutorial.sections.length;
//   }, 200);
// };

// tutorial.toggle = function () {
//   if (this.style.display != "block") {
//     this.show();
//   } else {
//     this.hide();
//   }
// };
</script>

<template>
  <div class="tutorial">
    <h1>Tutorial</h1>
    <div class="sections">
      <div style="opacity: 1; transform: translateX(0px)">
        <p>
          Welcome to your first BOOLR board. Here you can create circuits with
          logic gates.
        </p>
        <i class="material-icons">zoom_in</i>
        <p>Scroll to zoom in/out</p>
        <br />
        <i class="material-icons">swap_horiz</i>
        <p>
          Move the mouse while holding the middle mouse button to move around.
        </p>
        <p>
          If you don't have access to any middle mouse button, hold the Ctrl key
          and the left mouse button to move around.
        </p>
      </div>
      <div>
        <p>Now it's time to introduce you to logic gates.</p>
        <p>See the I/O button on the toolbar? Click it and select 'Input'.</p>
        <img src="img/tutorial/0.png" />
        <p>
          Now you have selected the input gate. To place it on the board, simply
          click somewhere with the left mouse button.
        </p>
        <p>Click the input gate to toggle its value.</p>
        <p>
          Let's give our input gate a name. Right click it, select "Edit", and
          enter a name.
        </p>
        <p>
          To move our input gate to another place on the board, grab it with
          Ctrl+click and drag it around.
        </p>
        <p>Tip: To cancel dragging, press the right mouse button.</p>
      </div>
      <div>
        <p>Let's connect our input gate with other logic gates.</p>
        <p>
          Select the NOT gate (!) on the toolbar and give it a nice place on the
          board.
        </p>
        <p>
          Click the <i>output port</i> (black) of our input gate and move the
          mouse while holding the left mouse button to the
          <i>input port</i> (white) of our NOT gate.
        </p>
        <img src="img/tutorial/1.png" />
        <p>
          Now the input gate is connected with the NOT gate and the NOT gate
          will invert the value of the input gate.
        </p>
        <p>
          Tip: You can right click on a gate on the toolbar to see the truth
          table of that gate.
        </p>
      </div>
      <div>
        <p>
          But we can't see what value the NOT gate outputs. To see this, we are
          going to connect our NOT gate with an output gate.
        </p>
        <p>
          Select the output gate from the input/output list (I/O) on the toolbar
          and place it on the board.
        </p>
        <p>
          Now, connect the NOT gate with it the same way we connected the input
          gate with the NOT gate
        </p>
        <img src="img/tutorial/2.png" />
        <p>Congratulations! You have built your first circuit!</p>
        <p>
          Tip: to view the connections of a gate, right click it and click 'View
          connections'
        </p>
      </div>
      <div>
        <p>Imagine this circuit is so special you want another one.</p>
        <p>
          To do this, we need to select it. Hold shift and and drag the mouse
          while holding the left mouse button to select the circuit. Make sure
          every logic gate of your circuit is inside the selection box
        </p>
        <img src="img/tutorial/3.png" />
        <p>
          When you have selected your circuit, a menu pops up. Click 'Copy' or
          hit Ctrl+C.
        </p>
        <p>
          To paste the circuit, right click somewhere on the board and click
          'Paste' or hit Ctrl+V
        </p>
        <p>
          Moving a selection around works the same way as moving gates, drag it
          around with Ctrl+click and release to drop it, right click to cancel
        </p>
        <p>To remove a selection, click 'Remove' or hit Delete</p>
      </div>
      <div>
        <p>
          If circuits are going to take up too much space, don't panic. The
          'componentize function' will save you.
        </p>
        <p>
          The 'componentize function' puts your circuit in a compact, nice
          little box. The input gates of your circuit are going to be its input
          ports, the output gates its output ports
        </p>
        <img src="img/tutorial/4.png" />
        <p>
          To do this, select your circuit like the previous section and click
          'Componentize'.
        </p>
        <p>
          Double click your <i>custom component</i> to open it en view your
          circuit in its original state.
        </p>
      </div>
      <div>
        <p>
          Press shift+T to open the console. You can use the command 'help' or
          '?' to see a list of available commands.
        </p>
        <p>
          Use the arrow up and down key to navigate through earlier executed
          commands.
        </p>
        <img src="img/tutorial/6.png" />
        <p>Press Ctrl+L to clear the console.</p>
        <p>Use the tab key to autocomplete command names.</p>
        <p>
          In commands that require a position as argument, you can use '~' for
          positions relative to the mouse position.
        </p>
      </div>
      <div>
        <p>
          You can use the console to declare variables. For components with a
          specific numeric property like 'delay' on a clock, you can use that
          variable.
        </p>
        <img src="img/tutorial/7.png" />
        <p>
          Usage: <code>'set example 200'</code> and <code>'get example'</code>.
          To use variables for components, enter for example
          <code>'2 * example - 50'</code> in the <i>edit</i> menu. When you
          change the value of a variable by executing 'set example 500', the
          values of the components are automatically changed.
        </p>
      </div>
      <div>
        <i class="material-icons">undo</i>
        <p>
          Done something stupid? No problem. Simply press Ctrl+Z to undo your
          previous action. To redo, press Ctrl+Y or Ctrl+Shift+Z.
        </p>
      </div>
      <div>
        <p>
          When you are going to build large structures, you might find yourself
          constantly scrolling around between two places.
        </p>
        <p>
          You can set a waypoint to jump to a specific location on the board. To
          do this, open the <i>context menu</i> and click 'Set waypoint', or hit
          Shift+S.
        </p>
        <i class="material-icons">my_location</i>
        <p>
          To jump to that waypoint, open the <i>context menu</i> again and click
          'Go to waypoint', or hit Shift+W. If you have set multiple waypoints,
          a list is going to pop up in which you can select a waypoint.
        </p>
      </div>
      <div>
        <p>Other useful tips:</p>
        <p>
          You can change the position of a port by dragging it around with
          Ctrl+click
        </p>
        <p>
          Hold the Shift key while connecting to draw the wire in a straight
          line.
        </p>
        <p>Hold the Ctrl key while selecting/connecting to scroll.</p>
        <p>
          If you don't have a mouse for some reason, use the arrow keys to
          scroll and Page up and Page down to zoom.
        </p>
        <p>Press the Home key to go to x: 0, y: 0.</p>
        <p>
          You can save custom components. Click 'Save component' on the context
          menu or press shift+R while pointing the mouse on the component you
          want to save. Saved components can be found and used in de 'saved
          components' list on the toolbar.
        </p>
        <!-- TODO: more? -->
        <p></p>
      </div>
    </div>
    <button class="close material-icons" onclick="tutorial.hide()">
      close
    </button>

    <div class="options">
      <button class="previous material-icons" disabled>
        keyboard_arrow_left
      </button>
      <span class="index"></span>
      <button class="next material-icons">keyboard_arrow_right</button>
    </div>
  </div>
</template>

<style scoped>
.tutorial {
  position: fixed;
  top: 0;
  left: -500px;
  height: 100%;
  width: 500px;
  background: #ddd;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.25);
  font-family: "Ubuntu", Arial;
  font-size: 15px;
  color: #111;
  text-align: center;
  overflow: hidden;

  opacity: 0;
  transition: opacity 0.2s, left 0.2s;
}

.tutorial h1 {
  font-weight: 400;
}

.tutorial .sections {
  padding: 20px;
  height: 100%;
}

.tutorial .sections div {
  position: absolute;
  width: 450px;
  transform: translateX(500px);
  opacity: 0;
  transition: transform 0.2s, opacity 0.5s;
  word-wrap: normal;
}

.tutorial .sections div p {
  line-height: 24px;
  margin: 8px;
}

.tutorial .sections div a {
  color: #888;
  text-decoration: underline;
  cursor: pointer;
}

.tutorial .sections div img {
  width: 250px;
  opacity: 0.7;
  border-radius: 5px;
}

.tutorial .sections div code {
  font-family: "Ubuntu Mono", Monospaced;
}

.tutorial .sections .material-icons {
  font-size: 50px;
  margin: 20px;
}

.tutorial .options {
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
}

.tutorial span {
  position: relative;
  bottom: 20px;
}

.tutorial .previous,
.tutorial .next {
  background: transparent;
  border: none;
  color: #888;
  font-size: 50px;
  outline: none;
  cursor: pointer;
  margin: 20px 50px;
}

.tutorial .previous:disabled,
.tutorial .next:disabled {
  opacity: 0.5;
}

.tutorial .close {
  color: #111;
  font-size: 24px;
  margin: 5px;
}
</style>
