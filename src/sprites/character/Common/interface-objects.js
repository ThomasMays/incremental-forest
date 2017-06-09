export default function interfaceWithObjects(objects, method) {
  for (let i = 0, len = objects.length; i < len; i++) {
    if (objects[i].hasOwnProperty(method)) {
      objects[i][method]();
    }
  }
}
