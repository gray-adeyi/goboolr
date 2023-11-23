<script lang="ts" setup></script>

<template>
  <div id="settings" style="display: none">
    <ul>
      <li>
        Scroll animation
        <label class="switch"
          ><input class="option scrollAnimation" type="checkbox" />
          <div class="slider"></div>
        </label>
      </li>
      <li>
        Zoom animation
        <label class="switch"
          ><input class="option zoomAnimation" type="checkbox" />
          <div class="slider"></div>
        </label>
      </li>
      <li>
        Show debug info
        <label class="switch"
          ><input class="option showDebugInfo" type="checkbox" />
          <div class="slider"></div>
        </label>
      </li>
      <li>
        Show component updates
        <label class="switch"
          ><input class="option showComponentUpdates" type="checkbox" />
          <div class="slider"></div>
        </label>
      </li>
      <br />
      <button id="reset">Clear localStorage</button>
    </ul>
  </div>
</template>
