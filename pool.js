

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { color, metalness, roughness } from 'three/tsl'

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


const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({ color: 0x222222 })
);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);


const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.05;

// controls.target.set(0, 0, 0);


const loader = new GLTFLoader();
let model;

loader.load('model/test.glb', (gltf) => {
      model = gltf.scene;
      model.scale.set(1, 1, 1);
      model.rotation.x = Math.PI / 2
      model.position.y = 2.1;
      scene.add(model);
});

const widthSlider = document.getElementById('widthSlider');
const lengthSlider = document.getElementById('lengthSlider');
const widthVal = document.getElementById('widthVal');
const lengthVal = document.getElementById('lengthVal');
const depthSlider = document.getElementById('depthSlider');
const depthVal = document.getElementById('depthVal')

widthSlider.addEventListener('input', ()=> {
    widthVal.textContent = widthSlider.value;
    if(model){
        model.scale.x = parseFloat(widthSlider.value);
    }
});

lengthSlider.addEventListener('input', ()=> {
    lengthVal.textContent = lengthSlider.value;
    if(model){
        model.scale.y = parseFloat(lengthSlider.value);
    }
});
depthSlider.addEventListener('input', ()=> {
    depthVal.textContent = depthSlider.value;
    if(model){
        model.scale.z = parseFloat(depthSlider.value);
    }
});


function animate() {
    requestAnimationFrame(animate);
    renderer.setClearColor('white')
    controls.update();

    // if (model) model.rotation.y += 0.005;
    renderer.render(scene, camera);

}
animate();
