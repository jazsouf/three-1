import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0x92400e });
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.20, 10, 10);
  const material = new THREE.MeshStandardMaterial( { color: 0xffff00 })
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ));
  star.position.set(x, y, z);
  scene.add(star)
}

Array(300).fill().forEach(addStar)

const spaceTexture = new THREE.TextureLoader().load("A_sharp_dense_forest.png");
scene.background = spaceTexture;

const moussTexture = new THREE.TextureLoader().load('mouss.jpg');
const mouss = new THREE.Mesh(
  new THREE.BoxGeometry(5,5,5),
  new THREE.MeshBasicMaterial( {map: moussTexture})
);

scene.add(mouss);

const shatterTexture = new THREE.TextureLoader().load('shatter.png');
const spiralTexture = new THREE.TextureLoader().load('spiral.png')

const shatter = new THREE.Mesh(
  new THREE.SphereGeometry(3,32,32),
  new THREE.MeshStandardMaterial( {
    map: shatterTexture,
    normalMap: spiralTexture
  })
)
shatter.position.z = 30;
shatter.position.setX(-10);

scene.add(shatter);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  shatter.rotation.x += 0.05;
  shatter.rotation.y += 0.075;
  shatter.rotation.z += 0.05;

  mouss.rotation.y += 0.01;
  mouss.rotation.z += 0.01;

  camera.position.z = t * -1;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera;


function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate();
