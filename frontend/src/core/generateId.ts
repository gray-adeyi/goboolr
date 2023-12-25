/*
 Generates id for every component using ES6 generators
 */
const IdGenerator = (function* () {
  let id = 0;
  while (true) yield id++;
})();
export default () => IdGenerator.next().value;
