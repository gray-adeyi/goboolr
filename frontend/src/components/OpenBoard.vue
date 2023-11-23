<script lang="ts" setup></script>

<template>
  <div id="openboard" style="display: none">
    <div
      id="dropfile"
      onclick="openFile()"
      ondrop="drop(event)"
      ondragover="allowDrop(event); this.style.background = 'rgba(255,255,255,.5)'"
    >
      <span style="font-size: 20px">Choose a .board file</span>
      <br />
      Or drop a file in this box
    </div>

    <script>
      function allowDrop(e) {
        e.preventDefault();
      }

      const drop = (e) => {
        e.preventDefault();
        readFile(e.dataTransfer);
      };
    </script>

    <br />
    <span style="text-decoration: underline">Connect to a BOOLR server</span>
  </div>
</template>
