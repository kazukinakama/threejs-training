import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, pointLight: THREE.PointLight, controls: OrbitControls;

const init = () => {
  // レンダラーを作成
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);
  
  // シーンを作成
  scene = new THREE.Scene();
  
  // カメラを作成
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 500);
  
  // テクスチャを追加
  const texture = new THREE.TextureLoader().load('./textures/earth.jpg');
  
  // ジオメトリを作成
  const ballGeometry = new THREE.SphereGeometry(100, 64, 32);
  // マテリアルを作成
  const ballMaterial = new THREE.MeshPhysicalMaterial({ map: texture });
  // メッシュ化
  const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
  scene.add(ballMesh);
  
  // 平行光源を追加
  const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 2);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  
  // ポイント光源を追加
  pointLight = new THREE.PointLight(0xFFFFFF, 1);
  pointLight.position.set(-200, -200, -200);
  scene.add(pointLight);
  
  // ポイント光源の場所を特定する
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 10);
  scene.add(pointLightHelper);
  
  // マウス操作できるようにする
  controls = new OrbitControls(camera, renderer.domElement);

  window.addEventListener('resize', onWindowResize);
  animate();
}

// ブラウザのリサイズに対応
const onWindowResize = () => {
  // レンダラーのサイズを随時更新
  renderer.setSize(window.innerWidth, window.innerHeight);

  // カメラのアスペクト比を正す
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

const animate = () => {
  // ポイント光源を球の周りを巡回させる
  pointLight.position.set(
    200 * Math.sin(Date.now() / 500),
    200 * Math.sin(Date.now() / 1000),
    200 * Math.cos(Date.now() / 500),
  );

  requestAnimationFrame(animate);

  // レンダリング
  renderer.render(scene, camera);
}

init();
