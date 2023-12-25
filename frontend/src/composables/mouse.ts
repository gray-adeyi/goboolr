import { ref } from "vue";

export default function useMouse() {
  const mouse = ref({
    grid: { x: 0, y: 0 },
    screen: { x: 0, y: 0 },
  });
  return mouse;
}
