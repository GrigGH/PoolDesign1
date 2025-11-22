import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
// import { Water } from 'three/examples/jsm/objects/Water.js';
// import { Sky } from 'three/addons/objects/Sky.js';
// import { plane } from 'three/examples/jsm/Addons.js';
// import { GroundedSkybox } from 'three/addons/objects/GroundedSkybox.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';



//Constants
const dirAmbLightColor = 0xffffff;
const dirLightPosX = 10;
const dirLightPosY = 20;
const dirLightPosZ = 10;
const cameraMaxDistance = 200;
const cameraMinDistance = 100;


const poolScalingXYZ = 0.8;

const waterTexColor = 0x3399ff;
let waterPosX = 0.6;
let waterPosY = 10.2;
let waterPosZ = 0;
let waterScaleX = 13.3;
let waterScaleY = 8;

const ScX1 = 64.8;
const ScY1 = 0.8;
const ScZ1 = 56;
const PsX1 = 29.76;
const PsY1 = 11.2;
const PsZ1 = 0;

const ScX2 = 88.8;
const ScY2 = 0.8;
const ScZ2 = 56;
const PsX2 = 17.76;
const PsY2 = 11.2;
const PsZ2 = 0;

const ScX3 = 124;
const ScY3 = 0.8;
const ScZ3 = 56;
const PsX3 = 0;
const PsY3 = 11.2;
const PsZ3 = 0;

const woodenplankPosX = 0;
const woodenplankPosY = 9.5;
const woodenplankPosZ = 0;
const woodenplankGeoScaleX = 120;
const woodenplankGeoScaleY = 184;

const ashphaltTexGeoScalingY = 2000;
const ashphaltTexGeoScalingX = 2500;
const ashphaltTexGeoPosY = 9.4;

const grasslandscapeGeoSmallScaling = 1000;
const grasslandscapeSmallPosY = 9.4;

const loungerModelScaling = 0.08;

const colorwhite = document.getElementById("colorPickerToggle1");
const colorlightgrey = document.getElementById("colorPickerToggle2");
const colordarkgrey = document.getElementById("colorPickerToggle3");
const colorblack = document.getElementById("colorPickerToggle4");
const greycolor = 0xbfbfbf;
const whitecolor = 0xffffff;
const darkgreycolor = 0x4d4d4d;
const blackcolor = 0x1f1f1f;

const lightcolorred = document.getElementById('color-red');
const lightcolorblue = document.getElementById('color-blue');
const lightcolorgreen = document.getElementById('color-green');
const lightswitchToggle = document.getElementById('lightToggle');


const widthSlider = document.getElementById('widthSlider');
const lengthSlider = document.getElementById('lengthSlider');
const depthSlider = document.getElementById('depthSlider');
const widthVal = document.getElementById('widthVal');
const lengthVal = document.getElementById('lengthVal');
const depthVal = document.getElementById('depthVal');

const lightingColor = document.getElementById('pool-lighting-color')

//Ui 
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


//Scene & Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 50, -200);

//Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(dirAmbLightColor, 1);
light.position.set(dirLightPosX, dirLightPosY, dirLightPosZ);
light.castShadow = true;
scene.add(light);

const amblight = new THREE.AmbientLight(dirAmbLightColor, 1);
scene.add(amblight);

//Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minPolarAngle = Math.PI * 0.2;
controls.maxPolarAngle = Math.PI * 0.45;
controls.minDistance = cameraMinDistance;
controls.maxDistance = cameraMaxDistance;

const loader = new GLTFLoader();
const texLoader = new THREE.TextureLoader();

//Background EXR/HDRI Image

const exrLoader = new EXRLoader();
exrLoader.load(
    'images/derelict_airfield_02_4k.exr',
    (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping; 
        scene.background = texture;
    },
);

//Water
const waterNormals = texLoader.load('images/waternormals.jpg',
    texture => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }
);

const waterGeo = new THREE.PlaneGeometry(9.3, 7, 1, 1);
const waterMat = new THREE.MeshPhysicalMaterial({
    color: waterTexColor,
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

water.position.set(waterPosX, waterPosY, waterPosZ);
water.rotation.x = -Math.PI / 2;
water.scale.set(waterScaleX, waterScaleY)

scene.add(water);

//Pool Model Parts
let right

loader.load('model/PoolRight.glb', (gltf) => {
    right = gltf.scene;
    right.scale.set(poolScalingXYZ, poolScalingXYZ, poolScalingXYZ)
    right.position.set(0, 0, 0)
    right.traverse((child) => {
        if (child.isMesh && child.material.isMeshStandardMaterial) {
            child.material.metalness = 0;
            child.material.roughness = 1;
            child.material.color = new THREE.Color();
        }
    });
    scene.add(right)
});


let left

loader.load('model/PoolLeft.glb', (gltf) => {
    left = gltf.scene;
    left.scale.set(poolScalingXYZ, poolScalingXYZ, poolScalingXYZ)
    left.position.set(0, 0, 0)
    left.traverse((child) => {
        if (child.isMesh && child.material.isMeshStandardMaterial) {
            child.material.metalness = 0;
            child.material.roughness = 1;
            child.material.color = new THREE.Color();
        }
    });
    scene.add(left)
});

let mid

loader.load('model/PoolMid.glb', (gltf) => {
    mid = gltf.scene;
    mid.scale.set(poolScalingXYZ, poolScalingXYZ, poolScalingXYZ)
    mid.position.set(0, 0, 0)
    mid.traverse((child) => {
        if (child.isMesh && child.material.isMeshStandardMaterial) {
            child.material.metalness = 0;
            child.material.roughness = 1;
            child.material.color = new THREE.Color();
        }
    });
    scene.add(mid)
});



//Ground Textures
const woodenplankTex = texLoader.load('images/woodenplank.avif');
woodenplankTex.wrapS = woodenplankTex.wrapT = THREE.RepeatWrapping;
woodenplankTex.repeat.set(10, 10);

const woodenplankGeo = new THREE.PlaneGeometry(woodenplankGeoScaleX, woodenplankGeoScaleY);
const woodenplankMat = new THREE.MeshStandardMaterial({ map: woodenplankTex, side: THREE.DoubleSide });

const woodenPlank = new THREE.Mesh(woodenplankGeo, woodenplankMat);
woodenPlank.rotation.x = Math.PI / 2;
woodenPlank.rotation.z = Math.PI / 2;
woodenPlank.material.transparent = true;
woodenPlank.position.set(woodenplankPosX, woodenplankPosY, woodenplankPosZ)
scene.add(woodenPlank);

//Ground landscape

const groundTex = texLoader.load('images/template-retro-edge-dirty-ancient.jpg');
const groundTexGeo = new THREE.PlaneGeometry(ashphaltTexGeoScalingX, ashphaltTexGeoScalingY);
const groundTexMat = new THREE.MeshStandardMaterial({
    map: groundTex,
    side: THREE.DoubleSide,
    transparent: true
});
const groundTexLandscape = new THREE.Mesh(groundTexGeo, groundTexMat);

groundTexLandscape.rotation.x = Math.PI / 2;
groundTexLandscape.position.y = ashphaltTexGeoPosY;
scene.add(groundTexLandscape);

//Lights colors
let bulbLights = [];
let currentColor = 0xadd8ff;

function updateLights() {
    bulbLights.forEach(light => scene.remove(light));
    bulbLights = [];

    if (lightswitchToggle.checked) {
        lightingColor.style.display = 'flex';
        const positions = [
            new THREE.Vector3(-48, 0, 2.5),
            new THREE.Vector3(-35, 0, -1.2),
            new THREE.Vector3(-20, 0, 0.8),
            new THREE.Vector3(-5, 0, -2.0),
            new THREE.Vector3(5, 0, 1.5),
            new THREE.Vector3(15, 0, -0.5),
            new THREE.Vector3(30, 0, 2.0),
            new THREE.Vector3(38, 0, -1.8),
        ];

        positions.forEach(pos => {
            const light = new THREE.PointLight(currentColor, 50, 50, 1);
            light.position.copy(pos);
            scene.add(light);
            bulbLights.push(light);
        });
    }
    else {
        lightingColor.style.display = 'none';
        water.material.color.set(waterTexColor);
        setLightColor(0xadd8ff, 0x3399ff);
        lightcolorblue.checked = true;
        lightcolorred.checked = false;
        lightcolorgreen.checked = false;
    }
}

function setLightColor(lightColor, waterColor) {
    currentColor = lightColor;
    bulbLights.forEach(light => light.color.set(lightColor));
    water.material.color.set(waterColor);

}

lightswitchToggle.addEventListener('change', updateLights);

lightcolorblue.addEventListener('change', () => {
    if (lightcolorblue.checked && lightswitchToggle.checked) {
        lightcolorred.checked = false;
        lightcolorgreen.checked = false;
        setLightColor(0xadd8ff, 0x3399ff);
    } else {
        updateLights();
    }
});

lightcolorred.addEventListener('change', () => {
    if (lightcolorred.checked && lightswitchToggle.checked) {
        lightcolorblue.checked = false;
        lightcolorgreen.checked = false;
        setLightColor(0xC2185B, 0xC2185B);
    } else {
        updateLights();
    }
});

lightcolorgreen.addEventListener('change', () => {
    if (lightcolorgreen.checked && lightswitchToggle.checked) {
        lightcolorred.checked = false;
        lightcolorblue.checked = false;
        setLightColor(0x00ff00, 'lightgreen');
    } else {
        updateLights();
    }
});

updateLights();

//Pool Closings
const closingImg1 = document.getElementById("ClosingImg1");
const closingImg2 = document.getElementById("ClosingImg2");
const closingImg3 = document.getElementById("ClosingImg3");

let plate = null;
let count = 0;

function createClosingPlate(ScX, ScY, ScZ, PsX, PsY, PsZ) {
    if (plate) scene.remove(plate);
    const geometry = new THREE.BoxGeometry(ScX, ScY, ScZ);
    const material = new THREE.MeshBasicMaterial({ color: 'grey' });
    plate = new THREE.Mesh(geometry, material);
    plate.position.set(PsX, PsY, PsZ);

    if (count % 2 === 0) {
        scene.add(plate);
    }
    count++;

    if (ScX == ScX1) {
        widthSlider.addEventListener('input', () => {
            widthVal.textContent = widthSlider.value;
            const scalingX = parseFloat(widthVal.textContent);

            plate.scale.x = 1 + (scalingX / 70)
            plate.position.x = PsX + scalingX
        });
    }
    if (ScX == ScX3) {
        widthSlider.addEventListener('input', () => {
            widthVal.textContent = widthSlider.value;
            const scalingX = parseFloat(widthVal.textContent);

            plate.scale.x = 1 + scalingX / 53;
            plate.position.x = PsX + scalingX / 4;
        });
    }
    if (ScX == ScX2) {
        widthSlider.addEventListener('input', () => {
            widthVal.textContent = widthSlider.value;
            const scalingX = parseFloat(widthVal.textContent);

            plate.scale.x = 1 + scalingX / 40;
            plate.position.x = PsX;
        });
    }
    lengthSlider.addEventListener('input', () => {
        lengthVal.textContent = lengthSlider.value;
        const scalingZ = parseFloat(lengthVal.textContent);

        plate.scale.z = 1 + (scalingZ / 11);
    });
    depthSlider.addEventListener('input', () => {
        depthVal.textContent = depthSlider.value;
        const PosY = parseFloat(depthVal.textContent);

        plate.position.y = PsY - 1 + PosY;
        lengthVal.textContent = plate.position.y
    });
}

closingImg1.addEventListener('click', () => {
    createClosingPlate(ScX1, ScY1, ScZ1, PsX1, PsY1, PsZ1);
});

closingImg2.addEventListener('click', () => {
    createClosingPlate(ScX2, ScY2, ScZ2, PsX2, PsY2, PsZ2);
});

closingImg3.addEventListener('click', () => {
    createClosingPlate(ScX3, ScY3, ScZ3, PsX3, PsY3, PsZ3);
});

//Pool Color
function getSelectedColor() {
    if (colorwhite.checked) return whitecolor;
    if (colorlightgrey.checked) return greycolor;
    if (colordarkgrey.checked) return darkgreycolor;
    if (colorblack.checked) return blackcolor;
}

function updateColor() {
    const color = getSelectedColor();

    mid.traverse((child) => {
        if (child.isMesh && child.material) {
            child.material.color.set(color);
        }
    });

    left.traverse((child) => {
        if (child.isMesh && child.material) {
            child.material.color.set(color);
        }
    });

    right.traverse((child) => {
        if (child.isMesh && child.material) {
            child.material.color.set(color);
        }
    });
    water.material.color.set(waterColor);
}

colorwhite.addEventListener('change', updateColor);
colorlightgrey.addEventListener('change', updateColor);
colordarkgrey.addEventListener('change', updateColor);
colorblack.addEventListener('change', updateColor);

//Loungers
const loungerModelBot = [];
for (let i = 0; i < 8; i++) {
    let loungerModel;
    loader.load('model/sun_lounger_3d.glb', (gltf) => {
        loungerModel = gltf.scene;
        loungerModel.scale.set(loungerModelScaling, loungerModelScaling, loungerModelScaling);

        loungerModel.position.set(8 * (-7 + 2 * i), 9.6, -48)

        loungerModel.traverse((child) => {
            if (child.isMesh && child.material.isMeshStandardMaterial) {
                child.material.metalness = 0;
                child.material.roughness = 1;
                child.material.color = new THREE.Color('grey');
            }
        });
        scene.add(loungerModel);
        loungerModelBot.push(loungerModel);

        lengthSlider.addEventListener('input', () => {
            const posz = parseFloat(lengthSlider.value);
            lengthVal.textContent = posz;

            loungerModelBot.forEach((block) => {
                block.position.z = - posz * 2.3 - 45;
            });
        });
    });
}

function animate(time) {
    requestAnimationFrame(animate);
    renderer.setClearColor('white');
    controls.update();

    waterNormals.offset.x = time * 0.0001;
    waterNormals.offset.y = time * 0.00015;

    renderer.render(scene, camera);
}

animate();


//Ui functionality 

function hideAll() {
    [swimming_pool_section, measurement_section, steps_section, lighting_section, color_section, shutter_section, display_section, save_section].forEach(sec => sec.style.display = 'none');
}

steps.addEventListener('click', () => {
    hideAll();
    steps_section.style.display = 'flex';
});

measurement.addEventListener('click', () => {
    hideAll();
    ui.style.display = 'flex';
    measurement_section.style.display = 'flex';
    measurement_section.style.flexDirection = 'column';
});

swimming_pool.addEventListener('click', () => {
    hideAll();
    swimming_pool_section.style.display = 'flex';
});

lighting.addEventListener('click', () => {
    hideAll();
    ui.style.display = 'block';
    lighting_section.style.display = 'flex';
    lighting_section.style.alignItems = 'start';
});

color.addEventListener('click', () => {
    hideAll();
    ui.style.display = 'block';
    color_section.style.display = 'flex';
});

shutter.addEventListener('click', () => {
    hideAll();
    ui.style.display = 'block';
    shutter_section.style.display = 'flex';
});

display.addEventListener('click', () => {
    hideAll();
    ui.style.display = 'block';
    display_section.style.display = 'flex';
    display_section.style.flexDirection = 'column';
});

save.addEventListener('click', () => {
    hideAll();
    ui.style.display = 'flex';
    save_section.style.display = 'flex';
});

//Measurement functionality

widthSlider.addEventListener('input', () => {
    widthVal.textContent = widthSlider.value;
    const posX = parseFloat(widthVal.textContent);
    const ScaleX = parseFloat(widthVal.textContent);

    right.position.x = posX;
    left.position.x = - posX;

    mid.scale.x = (ScaleX + 8) * 0.1;
    water.scale.x = 1.66 * 8 + (ScaleX + 1) * 0.205;

    woodenPlank.scale.y = 1 + ScaleX * 0.01;
});

lengthSlider.addEventListener('input', () => {
    lengthVal.textContent = lengthSlider.value - 1;
    const ScaleY = parseFloat(lengthVal.textContent);
    const scaleZ = parseFloat(lengthVal.textContent);
    const posz = parseFloat(lengthVal.textContent);

    right.scale.z = scaleZ * 0.05 + 0.8
    left.scale.z = scaleZ * 0.05 + 0.8

    mid.scale.z = scaleZ * 0.05 + 0.8
    water.scale.y = ScaleY * 0.7 + 8;

    woodenPlank.scale.x = 1 + scaleZ * 0.04;
})

depthSlider.addEventListener('input', () => {
    depthVal.textContent = depthSlider.value;
    const scaleY = parseFloat(depthVal.textContent);
    const positionY = parseFloat(depthVal.textContent);

    right.scale.y = 0.6 + scaleY * 0.2
    left.scale.y = 0.6 + scaleY * 0.2
    mid.scale.y = 0.6 + scaleY * 0.2

    let postop = -scaleY * 0.2;
    if (postop > -0.3) {
        postop = 0;
    }
    right.position.y = postop;
    left.position.y = postop;
    mid.position.y = postop;

    water.position.y = 10.2 + positionY;
})







