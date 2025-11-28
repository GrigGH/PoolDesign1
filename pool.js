import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';



window.onerror = function (message, file, line) {
    alert(message)
}



//Constants
const dirAmbLightColor = 0xffffff;
const dirLightPosX = 10;
const dirLightPosY = 50;
const dirLightPosZ = 10;
const cameraMaxDistance = 200;
const cameraMinDistance = 100;


const poolScalingXYZ = 0.8;

const poolHandlerScale = 0.8;
const poolHanderPosX = -30.3;
const poolHanderPosY = 0;
const poolHanderPosZ = 0;

const poolObjectScale = 0.8;
const poolObjectPosX = -20.5;
const poolObjectPosY = 0;
const poolObjectPosZ = 0;

const waterTexColor = 0x3399ff;
let waterPosX = 0.6;
let waterPosY = 11.5;
let waterPosZ = 0;
let waterScaleX = 13.3;
let waterScaleY = 8;



const woodenplankPosX = 0;
const woodenplankPosY = 10;
const woodenplankPosZ = 0;
const woodenplankGeoScaleX = 120;
const woodenplankGeoScaleY = 184;

const ashphaltTexGeoScalingY = 330;
const ashphaltTexGeoScalingX = 500;
const ashphaltTexGeoScalingZ = 50;
const ashphaltTexGeoPosY = -14;

const grasslandscapeGeoSmallScalingXZ = 20;
const grasslandscapeGeoSmallScalingY = 10;
const grasslandscapeSmallPosY = 10.5;

const loungerModelScaling = 0.08;

const colorwhite = document.getElementById("colorPickerToggle1");
const colorlightgrey = document.getElementById("colorPickerToggle2");
const colordarkgrey = document.getElementById("colorPickerToggle3");
const greycolor = 0xbfbfbf;
const whitecolor = 0xffffff;
const darkgreycolor = 0x858585;


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

const lighting_section = document.getElementById('pool-lighting');
const lighting = document.getElementById('lighting-section');
const color_section = document.getElementById('pool-color');
const color = document.getElementById('color-picker');

const uiCloser = document.getElementById('close-UI');
const otherSections = document.getElementById('other-sections');
const addUI = document.getElementById('add-UI');

//Scene & Camera
const scene = new THREE.Scene();
scene.rotation.y = - Math.PI / 6.5;
scene.position.y = -120
scene.position.x = 300;
scene.position.z = 100
scene.fog = new THREE.FogExp2(0xffffff, 0.0001);

scene.scale.x = 5
scene.scale.y = 5
scene.scale.z = 5

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(-500, 100, -250);

//Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

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
controls.maxPolarAngle = Math.PI * 0.5;
controls.minDistance = cameraMinDistance;
controls.maxDistance = cameraMaxDistance;
controls.enablePan = true;

const loader = new GLTFLoader();
const texLoader = new THREE.TextureLoader();

//Background EXR/HDRI Image

const exrLoader = new EXRLoader();

exrLoader.load('images/pretoria_gardens_2k.exr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;

    const sphereGeo = new THREE.SphereGeometry(500, 64, 64);

    const sphereMat = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide
    });

    const skySphere = new THREE.Mesh(sphereGeo, sphereMat);
    skySphere.position.y = 150
    scene.add(skySphere);

    const createFakeMirror = (geometry, position, rotation = { x: 0, y: 0, z: 0 }) => {
        const mat = new THREE.MeshPhysicalMaterial({
            metalness: 1,
            roughness: 0,
            clearcoat: 1,
            clearcoatRoughness: 0,
            envMap: texture,
            envMapIntensity: 1.1, 
            color: 'gray'
        });

        const mesh = new THREE.Mesh(geometry, mat);
        mesh.position.set(position.x, position.y, position.z);
        mesh.rotation.set(rotation.x, rotation.y, rotation.z);
        scene.add(mesh);

        return mesh;
    };

    createFakeMirror(
        new THREE.PlaneGeometry(144, 15),
        { x: -50.75, y: 75, z: -73.5 },
        { x: 0, y: 0, z: 0 }
    );

    createFakeMirror(
        new THREE.PlaneGeometry(40, 70),
        { x: -150, y: 50, z: -55 },
        { x: 0, y: 0, z: 0.35 }
    );

    createFakeMirror(
        new THREE.PlaneGeometry(80, 20),
        { x: -167, y: 20, z: -55 },
        { x: 0, y: 0, z: 0 }
    );

    createFakeMirror(
        new THREE.PlaneGeometry(40, 40),
        { x: -170, y: 55, z: -55 },
        { x: 0, y: 0, z: 0.6 }
    );

    createFakeMirror(
        new THREE.PlaneGeometry(61, 30),
        { x: -170, y: 40, z: -55 },
        { x: 0, y: 0, z: 0 }
    );
});


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



//Modern Villa

let modernvilla;

const gltfloader = new GLTFLoader();

gltfloader.load(
    'model/modernvilla.glb',
    (gltf) => {
        modernvilla = gltf.scene;

        modernvilla.scale.set(15, 15, 15);
        modernvilla.position.set(-930, -280, 600);
        // modernvilla.rotation.x = Math.PI / 2;

        modernvilla.traverse((child) => {
            if (child.isMesh && child.material && child.material.isMeshStandardMaterial) {
                child.material.metalness = 0;
                child.material.roughness = 1;
                child.material.color = new THREE.Color();
            }
        });

        scene.add(modernvilla);
    }
);





//Pool Model Parts
let right
let oldHeight

loader.load('model/PoolRight.glb', (gltf) => {
    right = gltf.scene;
    right.scale.set(poolScalingXYZ, poolScalingXYZ, poolScalingXYZ)
    right.position.set(0, 0, 0)
    right.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                metalness: 0.3,
                roughness: 0.4,
                envMap: scene.environment,
                envMapIntensity: 2
            })
        }
    });

    let box = new THREE.Box3().setFromObject(right);
    let size = new THREE.Vector3();
    box.getSize(size);
    oldHeight = poolScalingXYZ * size.y;

    scene.add(right)
});

let left

loader.load('model/PoolLeft.glb', (gltf) => {
    left = gltf.scene;
    left.scale.set(poolScalingXYZ, poolScalingXYZ, poolScalingXYZ)
    left.position.set(0, 0, 0)
    left.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                metalness: 0.3,
                roughness: 0.4,
                envMap: scene.environment,
                envMapIntensity: 2
            })
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
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                metalness: 0.3,
                roughness: 0.4,
                envMap: scene.environment,
                envMapIntensity: 2
            })
        }
    });
    scene.add(mid)
});

let poolHandler;

loader.load('model/poolHandle.glb', (gltf) => {
    poolHandler = gltf.scene;
    poolHandler.scale.set(poolHandlerScale, poolHandlerScale, poolHandlerScale);
    poolHandler.position.set(poolHanderPosX, poolHanderPosY, poolHanderPosZ);

    poolHandler.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                metalness: 0.5,
                roughness: 0.4,
                envMap: scene.environment,
                envMapIntensity: 2
            });
            child.material.needsUpdate = true;
        }
    });

    scene.add(poolHandler);
});

let poolObject;

loader.load('model/poolObject.glb', (gltf) => {
    poolObject = gltf.scene;
    poolObject.scale.set(poolObjectScale, poolObjectScale, poolObjectScale);
    poolObject.position.set(poolObjectPosX, poolObjectPosY, poolObjectPosZ);

    poolObject.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                metalness: 0.5,
                roughness: 0.4,
                envMap: scene.environment,
                envMapIntensity: 2
            })
        }
    });

    scene.add(poolObject);
})

let greenGround;

loader.load('model/greenGround.glb', (gltf) => {
    greenGround = gltf.scene;
    greenGround.scale.set(120, grasslandscapeGeoSmallScalingY, 120)
    greenGround.position.set(0, grasslandscapeSmallPosY, 0)
    greenGround.traverse((child) => {
        if (child.isMesh && child.material) {
            child.material.transparent = true;
            child.material.opacity = 1;
            child.material.color.multiplyScalar(3);
            child.material.depthWrite = false;
            child.material.needsUpdate = true;
            child.material.fog = true;
            child.material.needsUpdate = true;
        }
    });


    scene.add(greenGround);
})


let ScX1 = 0;
let ScY1 = 0;
let ScZ1 = 0;



//Ground Textures
const woodenplankTex = texLoader.load('images/Wooden_Texture.jpg');
woodenplankTex.wrapS = woodenplankTex.wrapT = THREE.RepeatWrapping;
woodenplankTex.repeat.set(10, 10);

const woodenplankGeo = new THREE.PlaneGeometry(woodenplankGeoScaleX, woodenplankGeoScaleY);
const woodenplankMat = new THREE.MeshStandardMaterial({ map: woodenplankTex, side: THREE.DoubleSide });

const woodenPlank = new THREE.Mesh(woodenplankGeo, woodenplankMat);
woodenPlank.rotation.x = Math.PI / 2;
woodenPlank.rotation.z = Math.PI / 2;
woodenPlank.material.transparent = true;
woodenPlank.position.set(woodenplankPosX, water.position.y - 0.1, woodenplankPosZ)
scene.add(woodenPlank);

//Ground landscape

const groundTex = texLoader.load('images/Screenshot 2025-11-24 230001.png');
const groundTexGeo = new THREE.BoxGeometry(ashphaltTexGeoScalingX * 2, ashphaltTexGeoScalingY * 3, ashphaltTexGeoScalingZ);
const groundTexMat = new THREE.MeshStandardMaterial({
    map: groundTex,
    side: THREE.DoubleSide,
    transparent: true
});
const groundTexLandscape = new THREE.Mesh(groundTexGeo, groundTexMat);

groundTexLandscape.rotation.x = Math.PI / 2;
groundTexLandscape.position.y = ashphaltTexGeoPosY;
// scene.add(groundTexLandscape);

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
            const light = new THREE.PointLight(currentColor, 200, 200, 1);
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

let opt1 = false;
let opt2 = false;
let opt3 = false;

function removePlate() {
    if (!plate) return;

    scene.remove(plate);
    plate = null;
}


function addPlate(width, length, height) {



    depthVal.textContent = length
    if (!plate) {
        const garageTex = texLoader.load('images/garagetex.jpg');

        const geometry = new THREE.BoxGeometry(waterScaleX, 0.1, waterScaleY);
        const material = new THREE.MeshBasicMaterial({
            map: garageTex,
            side: THREE.DoubleSide,
            color: 'grey'
        });

        plate = new THREE.Mesh(geometry, material);
        scene.add(plate);
    }

    plate.scale.x = width;
    plate.scale.z = length;
    let w = 0;
    if (opt1) {
        w = water.scale.x * 2.5;
    }
    else if (opt2) {
        w = water.scale.x * 0.75;
    }
    plate.position.set(w, height - 0.1, 0);

}


function showorHidePlate() {
    ScZ1 = water.scale.y * 0.95;
    ScY1 = water.position.y + 0.3
    if (opt1 || opt2 || opt3) {
        if (opt1) {
            ScX1 = water.scale.x * 0.5 - 2;
        }
        if (opt2) {
            ScX1 = water.scale.x * 0.75 - 2;
        }
        if (opt3) {
            ScX1 = water.scale.x - 3.9;
        }
        addPlate(ScX1, ScZ1, ScY1);

    }
    else {
        removePlate();
    }
}

closingImg1.addEventListener('click', () => {
    opt1 = !opt1;
    opt2 = false;
    opt3 = false;
    showorHidePlate();;
});

closingImg2.addEventListener('click', () => {

    opt1 = false;
    opt2 = !opt2;
    opt3 = false;

    showorHidePlate();
});

closingImg3.addEventListener('click', () => {

    opt1 = false;
    opt2 = false;
    opt3 = !opt3;
    showorHidePlate();
});

//Pool Color
function getSelectedColor() {
    if (colorwhite.checked) return whitecolor;
    if (colorlightgrey.checked) return greycolor;
    if (colordarkgrey.checked) return darkgreycolor;
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
    poolHandler.traverse((child) => {
        if (child.isMesh && child.material) {
            child.material.color.set(color);
        }
    });
    poolObject.traverse((child) => {
        if (child.isMesh && child.material) {
            child.material.color.set(color);
        }
    });

    if (lightcolorblue.checked && lightswitchToggle.checked) {
        setLightColor(0xadd8ff, 0x3399ff);
    }
    if (lightcolorred.checked && lightswitchToggle.checked) {
        lightcolorblue.checked = false;
        lightcolorgreen.checked = false;
        setLightColor(0xC2185B, 0xC2185B);
    }
    if (lightcolorgreen.checked && lightswitchToggle.checked) {
        lightcolorred.checked = false;
        lightcolorblue.checked = false;
        setLightColor(0x00ff00, 'lightgreen');
    }
}

colorwhite.addEventListener('change', updateColor);
colorlightgrey.addEventListener('change', updateColor);
colordarkgrey.addEventListener('change', updateColor);


//Loungers
// const loungerModelBot = [];
// for (let i = 0; i < 8; i++) {
//     let loungerModel;
//     loader.load('model/sun_lounger_3d.glb', (gltf) => {
//         loungerModel = gltf.scene;
//         loungerModel.scale.set(loungerModelScaling, loungerModelScaling, loungerModelScaling);

//         loungerModel.position.set(8 * (-7 + 2 * i), 11.7, -45)

//         loungerModel.traverse((child) => {
//             if (child.isMesh && child.material.isMeshStandardMaterial) {
//                 child.material.metalness = 0;
//                 child.material.roughness = 1;
//                 child.material.color = new THREE.Color('grey');
//             }
//         });
//         scene.add(loungerModel);
//         loungerModelBot.push(loungerModel);

//         lengthSlider.addEventListener('input', () => {
//             const posz = parseFloat(lengthSlider.value);
//             lengthVal.textContent = posz;

//             loungerModelBot.forEach((block) => {
//                 block.position.z = - posz * 2.3 - 45;
//             });
//         });
//     });
// }

function animate(time) {
    requestAnimationFrame(animate);
    renderer.setClearColor('white');
    controls.update();

    waterNormals.offset.x = time * 0.00005;
    waterNormals.offset.y = time * 0.00005;

    renderer.render(scene, camera);
}

animate();


//Ui functionality 

function hideAll() {
    [swimming_pool_section, measurement_section, lighting_section, color_section].forEach(sec => sec.style.display = 'none');
}


measurement.addEventListener('click', () => {
    hideAll();
    ui.style.display = 'flex';
    measurement_section.style.display = 'flex';
    measurement_section.style.flexDirection = 'column';
});

swimming_pool.addEventListener('click', () => {
    hideAll();
    ui.style.display = 'block';
    swimming_pool_section.style.flexDirection = 'column';
    swimming_pool_section.style.marginTop = '12px';
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

uiCloser.addEventListener('click', () => {
    ui.style.display = 'none';
    otherSections.style.display = 'none';
    addUI.style.display = 'flex';
})
addUI.addEventListener('click', () => {

    otherSections.style.display = 'flex';
    addUI.style.display = 'none';

    ui.style.display = 'flex';

    lighting_section.style.display = 'none';
    color_section.style.display = 'none';
    swimming_pool_section.style.display = 'none';


    measurement_section.style.display = 'flex';
    measurement_section.style.flexDirection = 'column';
})


//Measurement functionality

widthSlider.addEventListener('input', () => {
    widthVal.textContent = widthSlider.value;
    const posX = parseFloat(widthVal.textContent);
    const ScaleX = parseFloat(widthVal.textContent);

    right.position.x = posX;
    left.position.x = - posX;
    poolHandler.position.x = poolHanderPosX + posX;
    poolObject.position.x = poolObjectPosX - posX

    mid.scale.x = (ScaleX + 8) * 0.1;
    water.scale.x = 1.66 * 8 + (ScaleX + 1) * 0.205;
    woodenPlank.scale.y = 1 + ScaleX * 0.01;

    showorHidePlate();



});

lengthSlider.addEventListener('input', () => {
    lengthVal.textContent = lengthSlider.value - 1;
    const ScaleY = parseFloat(lengthVal.textContent);
    const scaleZ = parseFloat(lengthVal.textContent);
    const posz = parseFloat(lengthVal.textContent);

    right.scale.z = scaleZ * 0.05 + 0.8;
    left.scale.z = scaleZ * 0.05 + 0.8;
    poolHandler.scale.z = scaleZ * 0.05 + 0.8;
    poolObject.scale.z = scaleZ * 0.05 + 0.8;

    mid.scale.z = scaleZ * 0.05 + 0.8
    water.scale.y = ScaleY * 0.7 + 8;

    woodenPlank.scale.x = 1 + scaleZ * 0.04;


    showorHidePlate();

})

depthSlider.addEventListener('input', () => {
    depthVal.textContent = depthSlider.value;
    const scaleY = parseFloat(depthVal.textContent);
    const positionY = parseFloat(depthVal.textContent);

    let oldY = right.scale.y;

    right.scale.y = poolScalingXYZ * scaleY
    left.scale.y = poolScalingXYZ * scaleY
    mid.scale.y = poolScalingXYZ * scaleY

    const newHeight = oldHeight * right.scale.y;
    let postop = (oldHeight - newHeight) / 1.2 - oldHeight * 0.1 / scaleY;


    right.position.y = postop
    left.position.y = postop
    mid.position.y = postop


    water.position.y = waterPosY + 0.2;
    woodenPlank.position.y = water.position.y - 0.5;

    showorHidePlate();
})







