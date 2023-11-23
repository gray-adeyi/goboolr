<script lang="ts" setup>
document.querySelector("#pause").onclick = function () {
  pauseSimulation = !pauseSimulation;
  this.innerHTML = pauseSimulation ? "play_arrow" : "pause";
};

document.querySelector("#menuopen").onclick = function () {
  if (menu.style.opacity == "0") {
    menu.show();
  } else {
    menu.hide();
  }
};
</script>

<template>
  <div class="brbtns">
    <button class="brbtn material-icons" id="menuopen" title="Open menu">
      <div class="container">expand_less</div>
    </button>
    <button class="brbtn material-icons" id="pause" title="Pause simulation">
      pause
    </button>
    <button
      class="brbtn"
      id="version"
      title="Version"
      onclick="dialog.update()"
      tooltip="Version"
    >
      <i class="material-icons">memory</i>
      BOOLR
      <span class="version"></span>
      <script>
        Array.from(document.getElementsByClassName("version")).forEach(
          (el) => (el.innerHTML = "v" + VERSION)
        );
      </script>
    </button>
  </div>
</template>
