

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'


const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
camera.position.set(0, 2, -15);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 2, -15);
scene.add(light);

const amblight = new THREE.AmbientLight(0xffffff, 1)
amblight.position.set(0, 2, -15);
scene.add(amblight);





const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.05;

// controls.target.set(0, 0, 0);


const loader = new GLTFLoader();
let model;

loader.load('model/Pooldesigned.glb', (gltf) => {
  model = gltf.scene;
  model.scale.set(1, 1, 1);
  model.position.y = 2.1;

  model.traverse((child) => {
    if (child.isMesh) {
      const mat = child.material;
      
      if (mat && mat.isMeshStandardMaterial) {
        mat.metalness = 0;  
        mat.roughness = 1;  
        mat.color = new THREE.Color(); 
      }
    }
  });

  scene.add(model);
});

const widthSlider = document.getElementById('widthSlider');
const lengthSlider = document.getElementById('lengthSlider');
const widthVal = document.getElementById('widthVal');
const lengthVal = document.getElementById('lengthVal');
const depthSlider = document.getElementById('depthSlider');
const depthVal = document.getElementById('depthVal');

widthSlider.addEventListener('input', ()=> {
    widthVal.textContent = widthSlider.value;
    if(model){
        model.scale.x = parseFloat(widthSlider.value);
    }
});

lengthSlider.addEventListener('input', ()=> {
    lengthVal.textContent = lengthSlider.value;
    if(model){
        model.scale.z = parseFloat(lengthSlider.value);
    }
});
depthSlider.addEventListener('input', ()=> {
    depthVal.textContent = depthSlider.value;
    if(model){
        model.scale.y = parseFloat(depthSlider.value);
    }
});

const ui = document.getElementById('ui');

const swimming_pool = document.getElementById('swimming-pool-section');
const swimming_pool_section = document.getElementById('swimming-pool');

const measurement_section = document.getElementById('measurement-for-xyz');
const measurement = document.getElementById('measurement-section');

const steps = document.getElementById('step-section');
const steps_section = document.getElementById('steps');

const lighting_section = document.getElementById('pool-lighting');
const lighting = document.getElementById('lighting-section');

const color_section = document.getElementById('pool-color');
const color = document.getElementById('color-picker');

const shutter_section = document.getElementById('pool-shutter');
const shutter = document.getElementById('shutter-section');

const display_section = document.getElementById('display');
const display = document.getElementById('display-section');

const save_section = document.getElementById('save-pool');
const save = document.getElementById('save-section');

steps.addEventListener('click', () => {
  lighting_section.style.display = 'none';   
    measurement_section.style.display = 'none';
    swimming_pool_section.style.display = 'none';
    color_section.style.display = 'none';
    shutter_section.style.display = 'none';
    display_section.style.display = 'none';
    save_section.style.display = 'none';
    
    steps_section.style.display = 'flex';
});

measurement.addEventListener('click', () => {
  lighting_section.style.display = 'none';   
  steps_section.style.display = 'none';
  swimming_pool_section.style.display = 'none';
  color_section.style.display = 'none';
  shutter_section.style.display = 'none';
  display_section.style.display = 'none';
  save_section.style.display = 'none';

  ui.style.display = 'flex';
  measurement_section.style.display = 'flex';
  measurement_section.style.flexDirection = 'column';
});
swimming_pool.addEventListener('click', () => {
  lighting_section.style.display = 'none';   
  measurement_section.style.display = 'none';
  steps_section.style.display = 'none';
  color_section.style.display = 'none';
  shutter_section.style.display = 'none';
  display_section.style.display = 'none';
  save_section.style.display = 'none';

  swimming_pool_section.style.display = 'flex';
});
lighting.addEventListener('click', () => {
  measurement_section.style.display = 'none';
  steps_section.style.display = 'none';
  swimming_pool_section.style.display = 'none';
  color_section.style.display = 'none';
  shutter_section.style.display = 'none';
  display_section.style.display = 'none';
  save_section.style.display = 'none';
  ui.style.display = 'block';


  lighting_section.style.display = 'flex';
  lighting_section.style.alignItems = 'start';
});
color.addEventListener('click', () => {
  measurement_section.style.display = 'none';
  steps_section.style.display = 'none';
  swimming_pool_section.style.display = 'none';
  lighting_section.style.display = 'none';
  shutter_section.style.display = 'none';
  display_section.style.display = 'none';
  save_section.style.display = 'none';
  ui.style.display = 'block';

  color_section.style.display = 'flex';
});
shutter.addEventListener('click', () => {
  measurement_section.style.display = 'none';
  steps_section.style.display = 'none';
  swimming_pool_section.style.display = 'none';
  lighting_section.style.display = 'none';
  color_section.style.display = 'none';
  display_section.style.display = 'none';
  save_section.style.display = 'none';
  ui.style.display = 'block';

  shutter_section.style.display = 'flex';
});
display.addEventListener('click', () => {
  measurement_section.style.display = 'none';
  steps_section.style.display = 'none';
  swimming_pool_section.style.display = 'none';
  lighting_section.style.display = 'none';
  color_section.style.display = 'none';
  shutter_section.style.display = 'none';
  save_section.style.display = 'none';
  ui.style.display = 'block';

  display_section.style.display = 'flex';
  display_section.style.flexDirection = 'column';
});
save.addEventListener('click', () => {
  measurement_section.style.display = 'none';
  steps_section.style.display = 'none'; 
  swimming_pool_section.style.display = 'none';
  lighting_section.style.display = 'none';
  color_section.style.display = 'none';
  shutter_section.style.display = 'none';
  display_section.style.display = 'none';

  ui.style.display = 'flex';
  save_section.style.display = 'flex';
});

function animate() {
    requestAnimationFrame(animate);
    renderer.setClearColor('white')
    controls.update();

    // if (model) model.rotation.y += 0.005;
    renderer.render(scene, camera);

}
animate();