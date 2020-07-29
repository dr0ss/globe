/* global THREE */

// Create Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 600 / 400, 0.1, 1000);
const widget = document.getElementsByClassName('widget')[0];
const renderer = new THREE.WebGLRenderer();
renderer.setSize(600, 400);
widget.appendChild(renderer.domElement);

// The Earth
const earthDat = {
  name: 'theEarth',
  radius: 8,
  orbit: 0,
  speed: 3,
};

// The Orbiters
const theOrbs = [{
  name: 'theMoon',
  radius: 2,
  orbit: 30,
  speed: 3,
}, {
  name: 'theSun',
  radius: 1,
  orbit: 50,
  speed: 6,
}];

// Create and Orbital Object for Orb
function createOrbit(orbDat) {
  const orbitalObject = new THREE.Object3D();
  orbitalObject.name = `${orbDat.name}s_orbit`;
  // Draw Orbital Paths for Reference
  orbitalObject.rotateX(Math.PI / 2); // align horiz
  orbitalObject.add(new THREE.Line(
    new THREE.CircleGeometry(orbDat.orbit, 64),
    new THREE.LineBasicMaterial({ color: 0xffffff }),
  ));
  return orbitalObject;
}

// Create and Style Sphere Objects
function createSphere(orbDat) {
  const sphereObj = new THREE.Object3D();
  sphereObj.name = `${orbDat.name}s_sphere`;
  sphereObj.translateX(orbDat.orbit); // set the orbital distance
  const geometry = new THREE.SphereGeometry(orbDat.radius, 20, 20);
  const material = new THREE.MeshPhongMaterial({
    color: 0x156289, emissive: 0x156289, wireframe: false,
  });
  sphereObj.add(new THREE.Mesh(geometry, material));
  return sphereObj;
}

// Add Objects to its Target
function addObject(orbDat, target) {
  // create a three object
  const orbObj = new THREE.Object3D();
  orbObj.name = `${orbDat.name}s_object`;
  orbObj.add(createOrbit(orbDat));
  const p = createSphere(orbDat);
  orbObj.add(p);
  target.add(orbObj);
  orbDat.orbObj = orbObj;
}

// Postition the Camera
camera.position.set(0, 5, 36);

// The Moon and the Stars
theOrbs.forEach((d) => addObject(d, scene));

// The Earth
const theEarth = createSphere(earthDat, scene);

// The Sun
const sunLight = new THREE.SpotLight(0xedebca, 15, 0, 0.8, 0.5, 0);
const sunRays = new THREE.SpotLightHelper(sunLight);
const grid = new THREE.GridHelper(500, 40, 0x666666, 0x444444);

// Problem: How to set sunLight to theSuns_object
// instead of the theEarth

theEarth.add(sunLight);
sunLight.add(sunRays);
sunLight.position.set(0, 15, 0);
scene.add(theEarth);
scene.add(grid);
grid.rotateY(Math.PI / 2);

// new THREE.OrbitControls( camera, renderer.domElement );

// Render and Update
let t = 0;
function render(dt) {
  const t2 = dt - t;
  function updateOrbitalPosition(d) {
    d.orbObj.rotateY((t2 / 10000) * d.speed);
    // if (d.satellites) { d.satellites.forEach(updateRotation); }
  }
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  theOrbs.forEach(updateOrbitalPosition);
  theEarth.rotateY(t2 / 1000);
  t = dt;
}
requestAnimationFrame(render);
