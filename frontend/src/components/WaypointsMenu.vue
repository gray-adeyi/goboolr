<script lang="ts" setup>
import { ref } from "vue";
import { WayPoint } from "../types";

const wayPointText = ref("");
const waypointsMenuIsVisible = ref(false);
let waypoints = ref<WayPoint[]>([]);

function setWaypoint(
  x: number,
  y: number,
  label = `Waypoint#${waypoints.value.length}`
) {
  waypoints.value.push({
    x,
    y,
    label,
  });
  toolbar.message(`Waypoint <i>${label}</i> set at <i>${x}</i>,<i>${y}</i>`);
}

function gotoWaypoint(index: number) {
  if (!waypoints.value[index]) return;
  scroll(
    waypoints.value[index].x - mouse.grid.x,
    waypoints[index].y - mouse.grid.y
  );
  toolbar.message(
    `Jumped to waypoint#${index} at ${waypoints[index].x}, ${waypoints[index].y}`
  );
}

show = function (
  x = mouse.screen.x / zoom + offset.x,
  y = -mouse.screen.y / zoom + offset.y
) {
  if (waypoints.length == 0) {
    toolbar.message(
      "You have no waypoints set. Press <i>s</i> to add a waypoint"
    );
    return;
  } else if (waypoints.length == 1 && contextMenu.style.display == "none") {
    gotoWaypoint(0);
    return;
  }

  this.x = x;
  this.y = y;

  wayPointText.value = "Jump to...";
  for (let i = 0; i < waypoints.length; ++i) {
    const li = document.createElement("li");
    li.onclick = () => {
      gotoWaypoint(i);
      this.hide();
      contextMenu.hide();
      c.focus();
    };

    li.innerHTML = waypoints[i].label;
    li.innerHTML += `\t|\t${waypoints[i].x},${waypoints[i].y}`;

    const deleteBtn = document.createElement("i");
    deleteBtn.className = "material-icons remove";
    deleteBtn.innerHTML = "close";
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      if (waypoints.length <= 1) {
        this.style.display = "none";
        this.style.opacity = 0;
        c.focus();
      }

      const index = Array.from(this.children).indexOf(deleteBtn.parentNode) - 1;
      toolbar.message(`Removed waypoint ${waypoints[index].label}`);
      waypointsMenu.removeChild(deleteBtn.parentNode);
      waypoints.splice(index, 1);
    };
    li.appendChild(deleteBtn);

    this.appendChild(li);
  }

  this.style.display = "block";
  setTimeout(() => (this.style.opacity = 0.95), 1);
};

const hide = function () {
  waypointsMenuIsVisible.value = false;
};
</script>

<template>
  <ul
    id="waypointsMenu"
    :class="{ '#waypointsMenu--hide': !waypointsMenuIsVisible }"
  >
    {{
      wayPointText
    }}
  </ul>
</template>

<style scoped>
#waypointsMenu--show {
  display: block;
  opacity: 0.95;
  transition: display 200ms ease;
}

#waypointsMenu--hide {
  display: none;
  opacity: 0;
}
</style>
