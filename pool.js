import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { plane } from 'three/examples/jsm/Addons.js';
import { GroundedSkybox } from 'three/addons/objects/GroundedSkybox.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';



const widthSlider = document.getElementById('widthSlider');
const lengthSlider = document.getElementById('lengthSlider');
const depthSlider = document.getElementById('depthSlider');
const widthVal = document.getElementById('widthVal');
const lengthVal = document.getElementById('lengthVal');
const depthVal = document.getElementById('depthVal');



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 2, -70);




const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
light.castShadow = true;
scene.add(light);

const amblight = new THREE.AmbientLight(0xffffff, 1);
scene.add(amblight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minPolarAngle = Math.PI * 0.2;
controls.maxPolarAngle = Math.PI * 0.45;
controls.minDistance = 5;
controls.maxDistance = 175;

const loader = new GLTFLoader();
const texLoader = new THREE.TextureLoader();

let sky;

sky = new Sky();
sky.scale.setScalar(450000);
scene.add(sky);

const sun = new THREE.Vector3();

const parameters = {
    elevation: 10,
    azimuth: 180
};

function updateSun() {
    const uniforms = sky.material.uniforms;

    uniforms['turbidity'].value = 1;
    uniforms['rayleigh'].value = 0.5;
    uniforms['mieCoefficient'].value = 0.01;
    uniforms['mieDirectionalG'].value = 0.8;

    const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
    const theta = THREE.MathUtils.degToRad(parameters.azimuth);
    sun.setFromSphericalCoords(1, phi / 5, theta);
    uniforms['sunPosition'].value.copy(sun);
}

updateSun();




// new RGBELoader()
//   .setDataType(THREE.UnsignedByteType) // or THREE.FloatType for higher precision
//   .load('Images/derelict_airfield_02_4k.hdr', function (texture) {
//     texture.mapping = THREE.EquirectangularReflectionMapping;

//     // set as scene background
//     scene.background = texture;

//     // optional: set as environment for PBR materials
//     scene.environment = texture;
//   });





// const geo = new THREE.PlaneGeometry(20, 12);
// const mat = new THREE.MeshBasicMaterial({
//     map: tex,
// });

// const bgPlane = new THREE.Mesh(geo, mat);

// bgPlane.position.set(0, 6, -20);
// // bgPlane.lookAt(camera.position);

// scene.add(bgPlane);


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

water.position.y = 10.2;
water.rotation.x = -Math.PI / 2;
water.scale.set(13.4, 8)
water.position.x = 0;
water.position.z = 0;

scene.add(water);

const initialWidth = water.geometry.parameters.width;
const initialHeight = water.geometry.parameters.height;

let right

loader.load('model/PoolRight.glb', (gltf) => {
    right = gltf.scene;
    right.scale.set(0.8, 0.8, 0.8)
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

let bighouse

loader.load('model/house.glb', (gltf) => {
    bighouse = gltf.scene;
    bighouse.scale.set(20, 20, 25)
    bighouse.position.set(0, 7, -300)
    bighouse.traverse((child) => {
        if (child.isMesh && child.material.isMeshStandardMaterial) {
            child.material.metalness = 0;
            child.material.roughness = 1;
            child.material.color = new THREE.Color();
        }
    });


    scene.add(bighouse)
});






let realtree

loader.load('model/realtree.glb', (gltf) => {
    const prototype = gltf.scene;

    const spacingX = 40;
    const spacingZ = 40;

    for (let j = 0; j < 6; j++) {
        for (let i = 0; i < 1; i++) {
            const tree = prototype.clone(true);
            tree.scale.set(5, 6, 5);
            tree.position.set(80 + spacingX * (i + 1), 10, 100 - spacingZ * j);
            scene.add(tree);
            grassBlocksTop.push(tree);
        }
    }
    for (let j = 0; j < 6; j++) {
        for (let i = 0; i < 1; i++) {
            const tree = prototype.clone(true);
            tree.scale.set(5, 6, 5);
            tree.position.set(-80 - spacingX * (i + 1), 10, -100 + spacingZ * j);
            scene.add(tree);
            grassBlocksTop.push(tree);
        }
    }
});


// loader.load('model/grass-block.glb', (gltf) => {



// });


let realgrass

// loader.load('model/realisticgrass.glb', (gltf) => {
//     realgrass = gltf.scene;
//     realgrass.scale.set(0.1, 0.1, 0.1)
//     realgrass.position.set(0, 15, -20)
//     realgrass.traverse((child) => {
//         if (child.isMesh && child.material.isMeshStandardMaterial) {
//             child.material.metalness = 0;
//             child.material.roughness = 1;
//             child.material.color = new THREE.Color();
//         }
//     });


//     scene.add(realgrass)
// });


let left

loader.load('model/PoolLeft.glb', (gltf) => {
    left = gltf.scene;
    left.scale.set(0.8, 0.8, 0.8)
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
    mid.scale.set(0.8, 0.8, 0.8)
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

let model;


// widthSlider.addEventListener('input', () => {
//     widthVal.textContent = widthSlider.value + 1;
//     const posx = parseFloat(widthVal.textContent);

//     grassright.position.x = -posx * 0.1;
//     lengthVal.textContent =grassright.position.x
// });



// widthSlider.addEventListener('input', () => {
//     widthVal.textContent = widthSlider.value;
//     const posx = parseFloat(widthVal.textContent);

//     grassright.position.x = posx * 0.1;
// });













const grassTexture = texLoader.load('Images/woodenplank.avif');
const dirtTexture = texLoader.load('Images/woodenplank.avif');
grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(10, 10);

const dirtGeo = new THREE.PlaneGeometry(24, 184);
const dirtMat = new THREE.MeshStandardMaterial({ map: dirtTexture, side: THREE.DoubleSide });

const grassGeo = new THREE.PlaneGeometry(24, 72);
const grassMat = new THREE.MeshStandardMaterial({ map: grassTexture, side: THREE.DoubleSide });
const grassright = new THREE.Mesh(grassGeo, grassMat);

const grassGeo2 = new THREE.PlaneGeometry(24, 184);
const grassMat2 = new THREE.MeshStandardMaterial({ map: grassTexture, side: THREE.DoubleSide });

grassright.rotation.x = Math.PI / 2
grassright.position.x = -80
grassright.position.y = 9.5
scene.add(grassright);


const grassleft = new THREE.Mesh(grassGeo, grassMat);
grassleft.rotation.x = Math.PI / 2
grassleft.position.x = 80
grassleft.position.y = 9.5
scene.add(grassleft);




const dirtTop = new THREE.Mesh(dirtGeo, dirtMat);
dirtTop.rotation.x = Math.PI / 2
dirtTop.position.x = 0
dirtTop.position.z = 48
dirtTop.rotation.z = Math.PI / 2
dirtTop.position.y = 9.5
scene.add(dirtTop);


const grassbot = new THREE.Mesh(grassGeo2, grassMat);
grassbot.rotation.x = Math.PI / 2
grassbot.position.x = 0
grassbot.position.z = -48
grassbot.rotation.z = Math.PI / 2
grassbot.position.y = 9.5
scene.add(grassbot);

const greenlandscapeTex = texLoader.load('Images/grassbckground.jpg');
const grasslandscapeGeo = new THREE.PlaneGeometry(3000, 3000);
const grasslandscapeMat = new THREE.MeshStandardMaterial({
    map: greenlandscapeTex,
    side: THREE.DoubleSide,
    transparent: true
});
const grasslandscape = new THREE.Mesh(grasslandscapeGeo, grasslandscapeMat);

grasslandscape.rotation.x = Math.PI / 2
grasslandscape.position.y = 9.2
scene.add(grasslandscape);

const greenlandscapeTex1 = texLoader.load('Images/oeecL2_8K_Albedo.jpg');
const grasslandscapeGeo1 = new THREE.PlaneGeometry(1000, 1000);
const grasslandscapeMat1 = new THREE.MeshStandardMaterial({
    map: greenlandscapeTex1,
    side: THREE.DoubleSide,
    transparent: true
});
const grasslandscape1 = new THREE.Mesh(grasslandscapeGeo1, grasslandscapeMat1);

grasslandscape1.rotation.x = Math.PI / 2
grasslandscape1.position.y = 9.4
scene.add(grasslandscape1);



// const grasslandcapeGeom = new THREE.PlaneGeometry( 1000, 1000 );
// const grasslandcapeMater = new THREE.MeshBasicMaterial( { color: 0x7CFC00, side: THREE.DoubleSide } );
// const grasslandscape = new THREE.Mesh( grasslandcapeGeom, grasslandcapeMater );
// grasslandscape.rotation.x = Math.PI / 2
// grasslandscape.position.y =  9.2
// scene.add( grasslandscape );



const lightcolorred = document.getElementById('color-red');
const lightcolorblue = document.getElementById('color-blue');
const lightcolorgreen = document.getElementById('color-green');
const lightswitchToggle = document.getElementById('lightToggle');

let bulbLights = [];
let currentColor = 0xadd8ff;

function updateLights() {
    bulbLights.forEach(light => scene.remove(light));
    bulbLights = [];

    if (lightswitchToggle.checked) {
        const positions = [
            new THREE.Vector3(-3.5, 0.2, 3),
            new THREE.Vector3(1, 0.2, 3),
            new THREE.Vector3(3, 0.6, 0),
            new THREE.Vector3(3, 0.6, 1.9),
            new THREE.Vector3(3, 0.6, -1.9),
            new THREE.Vector3(-0.35, 0.6, -3),
            new THREE.Vector3(-1.2, -0.15, -3),
            new THREE.Vector3(-2, -0.85, -3),
            //  new THREE.Vector3(-3.5, 0.2, 3),
            // new THREE.Vector3(1, 0.2, 3),
            // new THREE.Vector3(3, 0.6, 0),
            // new THREE.Vector3(3, 0.6, 1.9),
            // new THREE.Vector3(3, 0.6, -1.9),
            // new THREE.Vector3(-0.35, 0.6, -3),
            // new THREE.Vector3(-1.2, -0.15, -3),
            // new THREE.Vector3(-2, -0.85, -3),
        ];

        positions.forEach(pos => {
            const light = new THREE.PointLight(currentColor, 2, 10, 0.5);
            light.position.copy(pos);
            scene.add(light);
            bulbLights.push(light);
        });
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


// const geometry = new THREE.BoxGeometry(8.3, 0.1, 7 );

// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

// const Closing1 = new THREE.Mesh( geometry, material );
// Closing1.position.x = 3.58
// Closing1.position.y = 1.4
// scene.add(Closing1);



const closingImg1 = document.getElementById("ClosingImg1");
const closingImg2 = document.getElementById("ClosingImg2");
const closingImg3 = document.getElementById("ClosingImg3");

let plate = null;
let count = 0;
let positX = 3.68;
let positY = 1.4;
let positZ = 0;



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


    if (ScX == 8.1 * 8) {
        widthSlider.addEventListener('input', () => {
            widthVal.textContent = widthSlider.value;
            const scalingX = parseFloat(widthVal.textContent);

            plate.scale.x = 1 + (scalingX / 70)
            plate.position.x = PsX + scalingX


        });
    }
    if (ScX == 15.5 * 8) {
        widthSlider.addEventListener('input', () => {
            widthVal.textContent = widthSlider.value;
            const scalingX = parseFloat(widthVal.textContent);

            plate.scale.x = 1 + scalingX / 53;
            plate.position.x = PsX + scalingX / 4;


        });
    }
    if (ScX == 11.1 * 8) {
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

        plate.position.y = PosY * 4;
    });

}




closingImg1.addEventListener('click', () => {
    createClosingPlate(8.1 * 8, 0.1 * 8, 7 * 8, 3.72 * 8, 1.4 * 8, 0);
});



closingImg2.addEventListener('click', () => {
    createClosingPlate(11.1 * 8, 0.1 * 8, 7 * 8, 2.22 * 8, 1.4 * 8, 0);
});

closingImg3.addEventListener('click', () => {
    createClosingPlate(15.5 * 8, 0.1 * 8, 7 * 8, 0, 1.4 * 8, 0);
});


const colorwhite = document.getElementById("colorPickerToggle1");
const colorlightgrey = document.getElementById("colorPickerToggle2");
const colordarkgrey = document.getElementById("colorPickerToggle3");
const colorblack = document.getElementById("colorPickerToggle4");


function updateColor() {
    mid.traverse((child) => {
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
            water.material.color.set(0x3399ff);
        }
    });
    left.traverse((child) => {
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
            water.material.color.set(0x3399ff);
        }
    });
    right.traverse((child) => {
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
            water.material.color.set(0x3399ff);
        }
    });
}

colorwhite.addEventListener('change', updateColor);
colorlightgrey.addEventListener('change', updateColor);
colordarkgrey.addEventListener('change', updateColor);
colorblack.addEventListener('change', updateColor);


const grassBlocksLeft = [];
const grassBlocksRight = [];


let grassmod;
// for (let i = 0; i < 7; i++) {
//     loader.load('model/grass-block.glb', (gltf) => {
//         grassmod = gltf.scene;
//         grassmod.scale.set(0.06, 0.1, 0.1);
//         grassmod.position.set(10, 1.7, -6 + 2 * i)
//         grassmod.traverse((child) => {
//             if (child.isMesh && child.material.isMeshStandardMaterial) {
//                 child.material.metalness = 0;
//                 child.material.roughness = 1;
//                 child.material.color = new THREE.Color('green');
//             }
//         });
//         scene.add(grassmod);
//         grassBlocksLeft.push(grassmod);


//         widthSlider.addEventListener('input', () => {
//             const posx = parseFloat(widthSlider.value);
//             widthVal.textContent = posx;

//             grassBlocksLeft.forEach((block) => {
//                 block.position.x = posx + 9;
//             });
//         });

//         lengthSlider.addEventListener('input', () => {
//             const scalez = parseFloat(lengthSlider.value);
//             lengthVal.textContent = scalez;

//             grassBlocksLeft.forEach((block) => {
//                 block.scale.z = scalez * 0.2 - 0.1;
//                 block.scale.y = scalez * 0.05 + 0.05;
//             });
//         });
//         depthSlider.addEventListener('input', () => {
//             const posy = parseFloat(depthSlider.value);
//             depthVal.textContent = posy;

//             grassBlocksLeft.forEach((block) => {
//                 block.position.y = posy + 0.7;
//                 widthVal.textContent = block.position.y
//             });
//         });
//     })

// }


// for (let i = 0; i < 7; i++) {
//     loader.load('model/grass-block.glb', (gltf) => {
//         grassmod = gltf.scene;
//         grassmod.scale.set(0.06, 0.1, 0.1);
//         grassmod.position.set(-10, 1.7, -6 + 2 * i)
//         grassmod.traverse((child) => {
//             if (child.isMesh && child.material.isMeshStandardMaterial) {
//                 child.material.metalness = 0;
//                 child.material.roughness = 1;
//                 child.material.color = new THREE.Color('green');
//             }
//         });
//         scene.add(grassmod);
//         grassBlocksRight.push(grassmod);


//         widthSlider.addEventListener('input', () => {
//             const posx = parseFloat(widthSlider.value);
//             widthVal.textContent = posx;

//             grassBlocksRight.forEach((block) => {
//                 block.position.x = -posx - 9;
//             });
//         });

//         lengthSlider.addEventListener('input', () => {
//             const scalez = parseFloat(lengthSlider.value);
//             lengthVal.textContent = scalez;

//             grassBlocksRight.forEach((block) => {
//                 block.scale.z = scalez * 0.2 - 0.1;
//                 block.scale.y = scalez * 0.05 + 0.05;
//             });
//         });
//         depthSlider.addEventListener('input', () => {
//             const posy = parseFloat(depthSlider.value);
//             depthVal.textContent = posy;

//             grassBlocksRight.forEach((block) => {
//                 block.position.y = posy + 0.7;
//                 widthVal.textContent = block.position.y
//             });
//         });
//     })

// }




const fence = [];

loader.load('model/Fence.glb', (gltf) => {
    const prototype = gltf.scene;

    // for (let j = 0; j < 5; j++) {
    for (let i = 0; i < 9; i++) {

        const fenceblock = prototype.clone(true);
        fenceblock.scale.set(20, 20, 20)

       
        if (i == 4) {
            fenceblock.position.set(364 - (i-1) * 112, 10, 500);;
        }
        else{
            fenceblock.position.set(420 - i * 112, 10, 500);
        }
        scene.add(fenceblock);
        fence.push(fenceblock);
    }

    for (let i = 0; i < 9; i++) {

        const fenceblock = prototype.clone(true);
        fenceblock.scale.set(20, 20, 20)

        fenceblock.position.set(420 - i * 112, 10, -508);
        scene.add(fenceblock);
        fence.push(fenceblock);
    }

    for (let i = 0; i < 9; i++) {

        const fenceblock = prototype.clone(true);
        fenceblock.scale.set(20, 20, 20)

        fenceblock.position.set(503.7, 10, 471.7 - 112 * i);
        fenceblock.rotation.y = Math.PI / 2
        scene.add(fenceblock);
        fence.push(fenceblock);
    }

    for (let i = 0; i < 9; i++) {

        const fenceblock = prototype.clone(true);
        fenceblock.scale.set(20, 20, 20)

        fenceblock.position.set(-503.6, 10, 471.7 - 112 * i);
        fenceblock.rotation.y = Math.PI / 2
        scene.add(fenceblock);
        fence.push(fenceblock);
    }

    // }
});

let gate;

loader.load('model/Gate.glb', (gltf) => {
    gate = gltf.scene;
    gate.scale.set(23.1, 25, 38)
    gate.position.set(-28, 10, 500)

    scene.add(gate)
});

let road;

loader.load('model/road.glb', (gltf) => {
    road = gltf.scene;
    road.scale.set(22, 25, 36)
    road.position.set(-25, 9.5, 365)

    scene.add(road)
});


let fountain;

loader.load('model/uploads_files_1917246_Fountain.glb', (gltf) => {
    fountain = gltf.scene;
    fountain.scale.set(1, 1, 1)
    fountain.position.set(-25, 11, 175)
   //fountain.material.color.set('white');

    scene.add(fountain)
});


let roundedroad;

loader.load('model/roundedroad.glb', (gltf) => {
    roundedroad = gltf.scene;
    roundedroad.scale.set(25, 25, 25)
    roundedroad.position.set(-25, 9.5, 175)
   // fountain.material.color.set('gray');

    scene.add(roundedroad)
});

let car;

loader.load('model/porshe.glb', (gltf) => {
    car = gltf.scene;
    car.scale.set(12, 12, 12)
    car.position.set(-25, 9.5, 325)
   // fountain.material.color.set('gray');

    scene.add(car)
});

let thuja=[];

loader.load('model/grassway.glb', (gltf) => {
      const prototype = gltf.scene;
    for (let i = 0; i < 3; i++) {
            const block1 = prototype.clone(true);
            block1.scale.set(12, 12, 12);
            block1.position.set(20, 9, 450 - i*87);
            block1.rotation.y = Math.PI /2
            scene.add(block1);
            thuja.push(block1);
            
            const block2 = prototype.clone(true);
            block2.scale.set(12, 12, 12);
            block2.position.set(-75, 9, 450 - i*87);
            block2.rotation.y = Math.PI /2
            scene.add(block2);
            thuja.push(block2);
    }
});

//GRASS CYCLE 

const grassBlocksTop = [];

loader.load('model/grass-block.glb', (gltf) => {

    const prototype = gltf.scene;

    // for (let j = 0; j < 38; j++) {
    //     for (let i = 0; i < 33; i++) {
    //         const block = prototype.clone(true);
    //         block.scale.set(1, 0.5, 1);
    //         block.position.set(-480 + 30 * i, 10, 487 - j * 10);
    //         scene.add(block);
    //         grassBlocksTop.push(block);
    //     }
    // }


    // for (let j = 0; j < 38; j++) {
    //     for (let i = 0; i < 33; i++) {
    //         const block = prototype.clone(true);
    //         block.scale.set(1, 0.5, 1);
    //         block.position.set(-480 + 30 * i, 10, -118 - j * 10);
    //         scene.add(block);
    //         grassBlocksTop.push(block);
    //     }
    // }
    for (let j = 0; j < 22; j++) {
        for (let i = 0; i < 1; i++) {
            const block = prototype.clone(true);
            block.scale.set(1, 0.5, 1);
            block.position.set(-130 + 30 * i, 10, 100 - j * 10);
            scene.add(block);
            grassBlocksTop.push(block);
        }
    }
    // for (let j = 0; j < 38; j++) {
    //     for (let i = 0; i < 1; i++) {
    //         const block = prototype.clone(true);
    //         block.scale.set(1, 0.5, 1);
    //         block.position.set(130 + 30 * i, 10, 100 - j * 10);
    //         scene.add(block);
    //         grassBlocksTop.push(block);
    //     }
    // }
    // for (let j = 0; j < 38; j++) {
    //     for (let i = 0; i < 1; i++) {
    //         const block = prototype.clone(true);
    //         block.scale.set(1, 0.5, 1);
    //         block.position.set(-130 - 30 * i, 10, 100 - j * 10);
    //         scene.add(block);
    //         grassBlocksTop.push(block);
    //     }
    // }
    for (let j = 0; j < 22; j++) {
        for (let i = 0; i < 1; i++) {
            const block = prototype.clone(true);
            block.scale.set(1, 0.5, 1);
            block.position.set(130 - 30 * i, 10, 100 - j * 10);
            scene.add(block);
            grassBlocksTop.push(block);
        }
    }


});



const loungerModelBot = [];
for (let i = 0; i < 8; i++) {
    let loungerModel;

    loader.load('model/sun_lounger_3d.glb', (gltf) => {
        loungerModel = gltf.scene;
        loungerModel.scale.set(0.08, 0.08, 0.08);

        loungerModel.position.set(8 * (-7 + 2 * i), 1.2 * 8, -6 * 8)

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
        // depthSlider.addEventListener('input', () => {
        //     const posy = parseFloat(depthSlider.value);
        //     depthVal.textContent = posy;

        //     loungerModelBot.forEach((block) => {
        //         block.position.y = 1.2 * 2.75 + posy * 5.65;
        //         widthVal.textContent = block.position.y
        //     });
        // });

    });

}


const fenceModelTop = [];
for (let i = 0; i < 11; i++) {
    let FenceModel;

    loader.load('model/Fence-01.glb', (gltf) => {
        FenceModel = gltf.scene;
        FenceModel.scale.set(1, 2, 1);

        FenceModel.position.set(2 * (-10 + 2 * i), 2 * 1.43, 12)

        FenceModel.traverse((child) => {
            if (child.isMesh && child.material.isMeshStandardMaterial) {
                child.material.metalness = 0;
                child.material.roughness = 1;
                child.material.color = new THREE.Color(0x8B5E3C);
            }
        });
        // scene.add(FenceModel);
        fenceModelTop.push(FenceModel);


        lengthSlider.addEventListener('input', () => {
            const posz = parseFloat(lengthSlider.value);
            lengthVal.textContent = posz;

            fenceModelTop.forEach((block) => {
                block.position.z = posz * 2.3 + 8.5;
            });
        });
        depthSlider.addEventListener('input', () => {
            const posy = parseFloat(depthSlider.value);
            depthVal.textContent = posy;

            fenceModelTop.forEach((block) => {
                block.position.y = posy + 0.45;
                widthVal.textContent = block.position.y
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




widthSlider.addEventListener('input', () => {
    widthVal.textContent = widthSlider.value - 1;
    const posX = parseFloat(widthVal.textContent);
    const ScaleX = parseFloat(widthVal.textContent);

    right.position.x = posX;
    left.position.x = - posX;

    mid.scale.x = (ScaleX + 8) * 0.1;
    water.scale.x = 1.66 * 8 + (ScaleX + 1) * 0.25;

    const waterWidth = water.geometry.parameters.width;
    grassright.position.x = - (waterWidth * water.scale.x + 26.4) / 2;
    grassleft.position.x = (waterWidth * water.scale.x + 26.4) / 2;

    dirtTop.scale.y = 0.01 + (waterWidth * water.scale.x) * 0.0075 // ScaleX * 0.1 + 1.05;
    grassbot.scale.y = .01 + (waterWidth * water.scale.x) * 0.0075;
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

    const waterLength = water.geometry.parameters.height;

    grassright.scale.y = (waterLength * water.scale.y) * 0.149 / 8;


    grassleft.scale.y = (waterLength * water.scale.y) * 0.149 / 8;

    dirtTop.position.z = posz * 2.4 + 48;
    grassbot.position.z = -posz * 2.4 - 48;
})

depthSlider.addEventListener('input', () => {
    depthVal.textContent = depthSlider.value;
    const scaleY = parseFloat(depthVal.textContent);
    const positionY = parseFloat(depthVal.textContent);

    right.scale.y = 0.6 + scaleY * 0.2
    left.scale.y = 0.6 + scaleY * 0.2
    mid.scale.y = 0.6 + scaleY * 0.2

    widthVal.textContent = scaleY

    let postop = -scaleY * 0.2;
    if (postop > -0.3) {
        postop = 0;
    }
    right.position.y = postop;
    left.position.y = postop;
    mid.position.y = postop;

    water.position.y = 10.2 + positionY;
    // grassright.position.y = positionY * 5 + 4;
    // grassleft.position.y = positionY * 5 + 4;

    // dirtTop.position.y = positionY * 5 + 4;
    // grassbot.position.y = positionY * 5 + 4;

})







