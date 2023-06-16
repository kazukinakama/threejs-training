import * as THREE from "three";
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Floor } from "./floor";

let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let controls: OrbitControls;
let stats: Stats;
let mixer: THREE.AnimationMixer;
let clock: THREE.Clock;

const init = () => {
  // Renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  // Clock
  clock = new THREE.Clock();

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xA0A0A0);
  scene.fog = new THREE.Fog(0xA0A0A0, 10, 50);

  // Camera
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight);
  camera.position.set(-1, 2, 3);

  // HemisphereLight
  const hemisphereLight = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d );
  hemisphereLight.position.set(0, 20, 0);
  scene.add(hemisphereLight);

  // DirectionalLight
  const directionalLight = new THREE.DirectionalLight( 0xffffff );
  directionalLight.position.set(3, 10, 10);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.top = 2;
  directionalLight.shadow.camera.bottom = - 2;
  directionalLight.shadow.camera.left = - 2;
  directionalLight.shadow.camera.right = 2;
  directionalLight.shadow.camera.near = 0.1;
  directionalLight.shadow.camera.far = 40;
  scene.add(directionalLight);

  // Floor
  const floor = new Floor(100, 100);
  floor.rotateX(-Math.PI / 2);
  floor.receiveShadow = true;
  scene.add(floor);

  const loader = new GLTFLoader();
  loader.load('Xbot.glb', (gltf: GLTF) => {
    const model = gltf.scene;
    scene.add(model);
    const animations = gltf.animations;
    mixer = new THREE.AnimationMixer(model);
    const action = mixer.clipAction(animations[3]);
    action.play();
  });

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1, 0);
  controls.maxPolarAngle = 1 * Math.PI / 2;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.update();

  // Stats
  stats = new Stats();
  document.body.appendChild(stats.dom);

  window.addEventListener('resize', onWindowResize);
  animate();
}

const onWindowResize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

const animate = () => {
  requestAnimationFrame(animate);

  mixer?.update(clock.getDelta());
  stats.update();

  renderer.render(scene, camera);
}

init();
