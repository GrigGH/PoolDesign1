import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { Water } from 'three/examples/jsm/objects/Water.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
camera.position.set(0, 2, -15);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 2, -15);
scene.add(light);

const amblight = new THREE.AmbientLight(0xffffff, 1);
scene.add(amblight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const loader = new GLTFLoader();
const texLoader = new THREE.TextureLoader();

const poolGroup = new THREE.Group();
scene.add(poolGroup);


const waterNormals = texLoader.load(
  'https://threejs.org/examples/textures/waternormals.jpg',
  texture => { texture.wrapS = texture.wrapT = THREE.RepeatWrapping; }
);

const waterGeo = new THREE.PlaneGeometry(10, 7.6, 1, 1); 
const waterMat = new THREE.MeshPhysicalMaterial({
  color: 0x3399ff,
  metalness: 0.1,
  roughness: 0.05,
  transmission: 0.9,
  thickness: 0.5,
  ior: 1.33,
  transparent: true,
  envMapIntensity: 1.0,
  normalMap: waterNormals,
  normalScale: new THREE.Vector2(0.2, 0.2)
});

const water = new THREE.Mesh(waterGeo, waterMat);
water.rotation.x = -Math.PI / 2;
water.position.set(-1.2, 3.3, -0.4);

let model;
loader.load('model/Pooldesigned.glb', (gltf) => {
  model = gltf.scene;
  model.scale.set(1, 1, 1);
  model.position.y = 0;

  model.traverse((child) => {
    if (child.isMesh && child.material.isMeshStandardMaterial) {
      child.material.metalness = 0;
      child.material.roughness = 1;
      child.material.color = new THREE.Color();
    }
  });

  poolGroup.add(model);
  poolGroup.add(water);

  water.position.y = 1.2; 
  water.rotation.x = -Math.PI / 2;
  water.position.x = -1.2;
  water.position.z = -0.4;
});

const grassTexture = texLoader.load('https://threejs.org/examples/textures/terrain/grasslight-big.jpg');
grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(10, 10);

const grassGeo = new THREE.PlaneGeometry(3, 14.2);
const grassMat = new THREE.MeshStandardMaterial({ 
  map: grassTexture,
  side: THREE.DoubleSide
});

const grass = new THREE.Mesh(grassGeo, grassMat);
grass.rotation.x = -Math.PI / 2; 
grass.position.set(-1.1, 1.2, -6);
grass.rotation.z = -Math.PI / 2;
scene.add(grass);

const grassCopy = grass.clone();
grassCopy.position.set(-1.1, 1.2, 5.2);
scene.add(grassCopy);

const grassCopy1 = grass.clone();
grassCopy1.position.set(-7.5, 1.2, -0.4);
grassCopy1.rotation.z = -Math.PI;
scene.add(grassCopy1);

const grassCopy2 = grass.clone();
grassCopy2.position.set(5, 1.2, -0.4);
grassCopy2.rotation.z = -Math.PI;
scene.add(grassCopy2);

let loungerModel;
let loungers = [];

loader.load('model/sun_lounger_3d.glb', (gltf) => {
    loungerModel = gltf.scene;
    loungerModel.scale.set(0.01, 0.01, 0.01);

    for (let i = 0; i < 5; i++) {
        const loungerCopy = loungerModel.clone();
        loungerCopy.position.set(-5 + i * 1.5, 1.25, grass.position.z);
        scene.add(loungerCopy);
        loungers.push(loungerCopy);
    }
});


function updateLoungers() {
    for (let i = 0; i < loungers.length; i++) {
        loungers[i].position.z = grass.position.z;
    }
}

const widthSlider = document.getElementById('widthSlider');
const lengthSlider = document.getElementById('lengthSlider');
const depthSlider = document.getElementById('depthSlider');
const widthVal = document.getElementById('widthVal');
const lengthVal = document.getElementById('lengthVal');
const depthVal = document.getElementById('depthVal');

function grassLocationx() {
  const scaleX = Math.max(poolGroup.scale.x, 1.8);
  const scaleY = Math.max(poolGroup.scale.y, 3.7);

  grass.scale.y = widthSlider.value == 1 ? 0.9 : scaleX - 0.45;
  if(widthSlider.value ==5) grass.scale.y = scaleY;
  grass.position.x = -(scaleX + 0.2);

  grassCopy.scale.y = grass.scale.y;
  grassCopy.position.x = -(scaleX + 0.2);

  grassCopy1.position.x = -7.5 - (widthSlider.value - 1) *6.3;
  grassCopy2.position.x = 5 + (widthSlider.value - 1) *3.9;
}

function grassLocationz() {
  const scaleZ = Math.max(poolGroup.scale.z, 1.2);

  grassCopy1.scale.y = scaleZ * 0.65;
  grassCopy1.position.z = (scaleZ - 12);
  grassCopy2.scale.y = scaleZ * 0.65;
  grassCopy2.position.z = (scaleZ - 10);

  grass.position.z = -6 - (lengthSlider.value - 1) * 4.7;
  if(lengthSlider.value == 1) grass.position.z = -6;
  if(lengthSlider.value <= 5) {
      grassCopy1.position.z = -1.05;
      grassCopy2.position.z = -1.05;
  }
  grassCopy.position.z = 5.2 + (lengthSlider.value - 1) * 3.85;

  updateLoungers();
}

widthSlider.addEventListener('input', ()=> {
  widthVal.textContent = widthSlider.value;
  poolGroup.scale.x = parseFloat(widthSlider.value);
  grassLocationx();
});

lengthSlider.addEventListener('input', ()=> {
  lengthVal.textContent = lengthSlider.value;
  poolGroup.scale.z = parseFloat(lengthSlider.value);
  grassLocationz();
});

depthSlider.addEventListener('input', ()=> {
  depthVal.textContent = depthSlider.value;
  poolGroup.scale.y = parseFloat(depthSlider.value);
  poolGroup.position.y = 0 - (depthSlider.value - 1) * 1.33;
  grassLocationx();
  grassLocationz();
});

function animate(time) {
    requestAnimationFrame(animate);
    renderer.setClearColor('white');
    controls.update();

    waterNormals.offset.x =  time * 0.0001; 
    waterNormals.offset.y = time * 0.00015;

    renderer.render(scene, camera);
}

animate();
