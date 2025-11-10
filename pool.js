import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { Water } from 'three/examples/jsm/objects/Water.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 2, -15);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});
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
    texture => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }
);

const waterGeo = new THREE.PlaneGeometry(9.3, 7, 1, 1);
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




let model;



loader.load('model/newpooldesign.glb', (gltf) => {
    model = gltf.scene;
    model.scale.set(0.06, 0.1, 0.1);
    model.position.y = -0.15;
    model.position.x = -1.2

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
    water.position.z = 0;
});


// let grassModelCopies = [];




const grassGroup = new THREE.Group();
scene.add(grassGroup);


let grassmodel;
loader.load('model/grass-block.glb', (gltf) => {
    grassmodel = gltf.scene;
    grassmodel.scale.set(0.06, 0.1, 0.1);
    grassmodel.traverse((child) => {
        if (child.isMesh && child.material.isMeshStandardMaterial) {
            child.material.metalness = 0;
            child.material.roughness = 1;
            child.material.color = new THREE.Color('green');
        }
    });


    const positions = [
        { x: -7.8, z: -5.3 },
        { x: -7.8, z: -3 }, 
        { x: -7.8, z: -2 }, 
        { x: -7.8, z: -1 },
        { x: -7.8, z: 0 }, 
        { x: -7.8, z: 1 }, 
        { x: -7.8, z: 2 }, 
        { x: -7.8, z: 3 },
        { x: 5.3, z: -5.4 },
        { x: 5.3, z: -3 }, 
        { x: 5.3, z: -2 }, 
        { x: 5.3, z: -1 },
        { x: 5.3, z: 0 }, 
        { x: 5.3, z: 1 }, 
        { x: 5.3, z: 2 }, 
        { x: 5.3, z: 3 },
        { x: 3, z: -6 }, 
        { x: -6.3, z: -6.2 }, 
        { x: -7.7, z: -6.2 }, 
        { x: 5, z: -6.2 },
        { x: -8, z: 5.5 }, 
        { x: -7.3, z: 5.5 }, 
        { x: -6.3, z: 5.5 }, 
        { x: -5.3, z: 5.5 },
        { x: -4.3, z: 5.5 }, 
        { x: -3.3, z: 5.5 }, 
        { x: -2.3, z: 5.5 }, 
        { x: -1.3, z: 5.5 },
        { x: 0.3, z: 5.5 }, 
        { x: 2.3, z: 5.5 }, 
        { x: 3.3, z: 5.5 }, 
        { x: 4.3, z: 5.5 },
        { x: 5.3, z: 5.5 },
    ];

    positions.forEach(pos => {
        const copy = grassmodel.clone();
        copy.position.set(pos.x, 1.5, pos.z);
        grassGroup.add(copy);
    });


    const grassTexture = texLoader.load('https://threejs.org/examples/textures/terrain/grasslight-big.jpg');
    grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(10, 10);

    const grassGeo = new THREE.PlaneGeometry(3, 14.2);
    const grassMat = new THREE.MeshStandardMaterial({ map: grassTexture, side: THREE.DoubleSide });

    const planePositions = [
        { x: -1.1, z: -6, rotZ: -Math.PI / 2 },
        { x: -1.1, z: 5.2, rotZ: -Math.PI / 2 },
        { x: -7.5, z: -0.4, rotZ: -Math.PI },
        { x: 5, z: -0.4, rotZ: -Math.PI }
    ];

    planePositions.forEach(pos => {
        const plane = new THREE.Mesh(grassGeo, grassMat);
        plane.rotation.set(-Math.PI / 2, 0, pos.rotZ);
        plane.position.set(pos.x, 1.2, pos.z);
        grassGroup.add(plane);
    });
});

const grassTexture = texLoader.load('https://threejs.org/examples/textures/terrain/grasslight-big.jpg');
grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(10, 10);

let loungerModel;
let loungers = [];
loader.load('model/sun_lounger_3d.glb', (gltf) => {
    loungerModel = gltf.scene;
    loungerModel.scale.set(0.01, 0.01, 0.01);

    for (let i = 0; i < 5; i++) {
        const loungerCopy = loungerModel.clone();
        loungerCopy.position.set(-5 + i * 1.5, 1.25, -6);
        scene.add(loungerCopy);
        loungers.push(loungerCopy);
    }
});

function updateLoungers(zPos = -6) {
    loungers.forEach(l => l.position.z = zPos);
}



const colorwhite = document.getElementById("colorPickerToggle1");
const colorlightgrey = document.getElementById("colorPickerToggle2");
const colordarkgrey = document.getElementById("colorPickerToggle3");
const colorblack = document.getElementById("colorPickerToggle4");


function updateColor() {
    model.traverse((child) => {
        if (child.isMesh && child.material) {
            if (colorwhite.checked) {
                child.material.color.set(0xffffff);
            } else if (colorlightgrey.checked) {
                child.material.color.set(0xbfbfbf);
            } else if (colordarkgrey.checked) {
                child.material.color.set(0x4d4d4d);
            } else if (colorblack.checked) {
                child.material.color.set(0x1f1f1f);
            }
        }
    });
}

colorwhite.addEventListener('change', updateColor);
colorlightgrey.addEventListener('change', updateColor);
colordarkgrey.addEventListener('change', updateColor);
colorblack.addEventListener('change', updateColor);


const lightswitchOff = document.getElementById('lightUnToggle');
const lightswitchOn = document.getElementById('lightToggle');

let bulbLights = [];

function updateLights() {

    bulbLights.forEach(light => poolGroup.remove(light));
    bulbLights = [];

    if (lightswitchOn.checked) {
        const positions = [
            new THREE.Vector3(-3.5, 0.2, 3),
            new THREE.Vector3(1, 0.2, 3),
            new THREE.Vector3(3, 0.6, 0),
            new THREE.Vector3(3, 0.6, 1.9),
            new THREE.Vector3(3, 0.6, -1.9),
            new THREE.Vector3(-0.35, 0.6, -3),
            new THREE.Vector3(-1.2, -0.15, -3),
            new THREE.Vector3(-2, -0.85, -3),
        ];
        positions.forEach(pos => {
            const light = new THREE.PointLight(0xadd8ff, 2, 10, 0.8);
            light.position.copy(pos);
            poolGroup.add(light);
            bulbLights.push(light);
        })
    }

    //   if (bulbLight) {
    //     scene.remove(bulbLight);
    //     bulbLight = null;
    //   }

    //   if (lightswitchOn.checked) {
    //     bulbLight = new THREE.PointLight(0xadd8ff, 2, 10, 1);
    //     bulbLight.position.set(-3.5, 0.2, 3);
    //     scene.add(bulbLight);
    //   }
    // }
}
updateLights();

lightswitchOn.addEventListener('change', updateLights);
lightswitchOff.addEventListener('change', updateLights);




const widthSlider = document.getElementById('widthSlider');
const lengthSlider = document.getElementById('lengthSlider');
const depthSlider = document.getElementById('depthSlider');
const widthVal = document.getElementById('widthVal');
const lengthVal = document.getElementById('lengthVal');
const depthVal = document.getElementById('depthVal');

function updateGrassGroup() {
    if (!grassGroup) return;

    grassGroup.scale.x = parseFloat(widthSlider.value);
    grassGroup.scale.z = parseFloat(lengthSlider.value);

    updateLoungers(-6 * grassGroup.scale.z );
}

widthSlider.addEventListener('input', () => {
    widthVal.textContent = widthSlider.value;
    poolGroup.scale.x = parseFloat(widthSlider.value);
    updateGrassGroup();
});

lengthSlider.addEventListener('input', () => {
    lengthVal.textContent = lengthSlider.value;
    poolGroup.scale.z = parseFloat(lengthSlider.value);
    updateGrassGroup();
});

let prevDepth = parseFloat(depthSlider.value);

depthSlider.addEventListener('input', () => {
    const currentDepth = parseFloat(depthSlider.value);
    depthVal.textContent = currentDepth;

    poolGroup.scale.y = currentDepth;

    if (currentDepth > prevDepth) {
        poolGroup.position.y -= 0.1; 
    } else if (currentDepth < prevDepth) {
        poolGroup.position.y += 0.1; 
    }

    prevDepth = currentDepth; 
    updateGrassGroup();
});





function animate(time) {
    requestAnimationFrame(animate);
    renderer.setClearColor('white');
    controls.update();

    waterNormals.offset.x = time * 0.0001;
    waterNormals.offset.y = time * 0.00015;

    renderer.render(scene, camera);
}

animate();






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