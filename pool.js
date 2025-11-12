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


// let cube
// loader.load('model/cube.glb', (gltf) => {
//     cube = gltf.scene;

//     cube.position.set(0,0,0)
//      cube.traverse((child) => {
//         if (child.isMesh && child.material.isMeshStandardMaterial) {
//             child.material.metalness = 0;
//             child.material.roughness = 1;
//             child.material.color = new THREE.Color();
//         }
//     });
//     scene.add(cube)
// });


// let rightmid

// loader.load('model/PoolRightMid.glb', (gltf) => {
//     rightmid = gltf.scene;
//     rightmid.scale.set(0.1, 0.1,0.1)
//     rightmid.position.set(0,0,0)
//      rightmid.traverse((child) => {
//         if (child.isMesh && child.material.isMeshStandardMaterial) {
//             child.material.metalness = 0;
//             child.material.roughness = 1;
//             child.material.color = new THREE.Color();
//         }
//     });
//     scene.add(rightmid)
// widthSlider.addEventListener('input', () => {
//     widthVal.textContent = widthSlider.value - 1;
//     const posX = parseFloat(widthVal.textContent);
//     rightmid.position.x= posX;
// });
// lengthSlider.addEventListener('input', ()=>{
//     lengthVal.textContent = lengthSlider.value - 1;
//     // const posZ = parseFloat(lengthVal.textContent);
//     const scaleZ = parseFloat(lengthVal.textContent)
//     rightmid.scale.z = scaleZ * 0.1 + 0.8
//     depthVal.textContent =  rightmid.scale.z
// })
// });


// let rightbot

// loader.load('model/PoolRightLeftnew.glb', (gltf) => {
//     rightbot = gltf.scene;
//     rightbot.scale.set(0.1, 0.1,0.1)
//     rightbot.position.set(0,0,0)
//      rightbot.traverse((child) => {
//         if (child.isMesh && child.material.isMeshStandardMaterial) {
//             child.material.metalness = 0;
//             child.material.roughness = 1;
//             child.material.color = new THREE.Color();
//         }
//     });
//     scene.add(rightbot)
// widthSlider.addEventListener('input', () => {
//     widthVal.textContent = widthSlider.value - 1;
//     const posX = parseFloat(widthVal.textContent);
//     rightbot.position.x= posX;
// });
// lengthSlider.addEventListener('input', ()=>{
//     lengthVal.textContent = lengthSlider.value - 1;
//     const posZ = parseFloat(lengthVal.textContent);
//     rightbot.position.z = - posZ 
// });
// // lengthSlider.addEventListener('input', ()=>{
// //     lengthVal.textContent = lengthSlider.value - 1;
// //     // const posZ = parseFloat(lengthVal.textContent);
// //     const scaleZ = parseFloat(lengthVal.textContent)
// //     rightleft.scale.z = scaleZ
// // })
// });

let right

loader.load('model/PoolRight.glb', (gltf) => {
    right = gltf.scene;
    right.scale.set(0.1, 0.1, 0.1)
    right.position.set(0, 0, 0)
    right.traverse((child) => {
        if (child.isMesh && child.material.isMeshStandardMaterial) {
            child.material.metalness = 0;
            child.material.roughness = 1;
            child.material.color = new THREE.Color();
        }
    });
    scene.add(right)
    widthSlider.addEventListener('input', () => {
        widthVal.textContent = widthSlider.value - 1;
        const posX = parseFloat(widthVal.textContent);

        right.position.x = posX;
    });
    lengthSlider.addEventListener('input', () => {
        lengthVal.textContent = lengthSlider.value - 1;
        const scaleZ = parseFloat(lengthVal.textContent);

        right.scale.z = scaleZ * 0.05 + 0.1
    })
    depthSlider.addEventListener('input', () => {
        depthVal.textContent = depthSlider.value;
        const scaleY = parseFloat(depthVal.textContent);

        right.scale.y = scaleY * 0.1

    })

});

let left

loader.load('model/PoolLeft.glb', (gltf) => {
    left = gltf.scene;
    left.scale.set(0.1, 0.1, 0.1)
    left.position.set(0, 0, 0)
    left.traverse((child) => {
        if (child.isMesh && child.material.isMeshStandardMaterial) {
            child.material.metalness = 0;
            child.material.roughness = 1;
            child.material.color = new THREE.Color();
        }
    });
    scene.add(left)
    widthSlider.addEventListener('input', () => {
        widthVal.textContent = widthSlider.value - 1;
        const posX = parseFloat(widthVal.textContent);

        left.position.x = - posX;
    });
    lengthSlider.addEventListener('input', () => {
        lengthVal.textContent = lengthSlider.value - 1;
        const scaleZ = parseFloat(lengthVal.textContent);

        left.scale.z = scaleZ * 0.05 + 0.1
    })
    depthSlider.addEventListener('input', () => {
        depthVal.textContent = depthSlider.value;
        const scaleY = parseFloat(depthVal.textContent);

        left.scale.y = scaleY * 0.1

    })
});

let mid

loader.load('model/PoolMid.glb', (gltf) => {
    mid = gltf.scene;
    mid.scale.set(0.1, 0.1, 0.1)
    mid.position.set(0, 0, 0)
    mid.traverse((child) => {
        if (child.isMesh && child.material.isMeshStandardMaterial) {
            child.material.metalness = 0;
            child.material.roughness = 1;
            child.material.color = new THREE.Color();
        }
    });
    scene.add(mid)
    widthSlider.addEventListener('input', () => {
        widthVal.textContent = widthSlider.value;
        const ScaleX = parseFloat(widthVal.textContent);

        mid.scale.x = ScaleX * 0.1;
    });
    lengthSlider.addEventListener('input', () => {
        lengthVal.textContent = lengthSlider.value - 1;
        const scaleZ = parseFloat(lengthVal.textContent);

        mid.scale.z = scaleZ * 0.05 + 0.1

    })
    depthSlider.addEventListener('input', () => {
        depthVal.textContent = depthSlider.value;
        const scaleY = parseFloat(depthVal.textContent);

        mid.scale.y = scaleY * 0.1

    })

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







loader.load('model/NewpoolSeparated.glb', (gltf) => {
    water.position.y = 1.2;
    water.rotation.x = -Math.PI / 2;
    water.scale.set(1.66, 1)
    water.position.x = 0;
    water.position.z = 0;

    scene.add(water);

    widthSlider.addEventListener('input', () => {
        widthVal.textContent = widthSlider.value;
        const ScaleX = parseFloat(widthVal.textContent);

        water.scale.x = 1.66 + ScaleX * 0.1735;
    });
    lengthSlider.addEventListener('input', () => {
        lengthVal.textContent = lengthSlider.value - 1;
        const ScaleY = parseFloat(lengthVal.textContent);

        water.scale.y = ScaleY * 0.5 + 1;

    });

    depthSlider.addEventListener('input', () => {
        depthVal.textContent = depthSlider.value - 1;
        const positionY = parseFloat(depthVal.textContent);

        water.position.y = positionY + 1.5;

    });


    const grassTexture = texLoader.load('https://threejs.org/examples/textures/terrain/grasslight-big.jpg');
    grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(10, 10);

    const grassGeo = new THREE.PlaneGeometry(3, 14.2);
    const grassMat = new THREE.MeshStandardMaterial({ map: grassTexture, side: THREE.DoubleSide });
    const grassright = new THREE.Mesh(grassGeo, grassMat);

    const grassGeo2 = new THREE.PlaneGeometry(3, 23);
    const grassMat2 = new THREE.MeshStandardMaterial({ map: grassTexture, side: THREE.DoubleSide });

    grassright.rotation.x = Math.PI / 2
    grassright.position.x = -10
    grassright.position.y = 1.4
    scene.add(grassright);
    widthSlider.addEventListener('input', () => {
        widthVal.textContent = widthSlider.value;
        const posx = parseFloat(widthVal.textContent);

        grassright.position.x = -10 + -posx + 1;

    });
    lengthSlider.addEventListener('input', () => {
        lengthVal.textContent = lengthSlider.value;
        const scaley = parseFloat(lengthVal.textContent);

        grassright.scale.y = scaley * 0.4 + 0.6;

    });
    depthSlider.addEventListener('input', () => {
        depthVal.textContent = depthSlider.value;
        const posy = parseFloat(depthVal.textContent);

        grassright.position.y = posy + 0.4;
    });

    const grassleft = new THREE.Mesh(grassGeo, grassMat);
    grassleft.rotation.x = Math.PI / 2
    grassleft.position.x = 10
    grassleft.position.y = 1.4
    scene.add(grassleft);

    widthSlider.addEventListener('input', () => {
        widthVal.textContent = widthSlider.value;
        const posx = parseFloat(widthVal.textContent);

        grassleft.position.x = 10 + posx - 1;

    });
    lengthSlider.addEventListener('input', () => {
        lengthVal.textContent = lengthSlider.value;
        const scaley = parseFloat(lengthVal.textContent);

        grassleft.scale.y = scaley * 0.4 + 0.6;

    });
    depthSlider.addEventListener('input', () => {
        depthVal.textContent = depthSlider.value;
        const posy = parseFloat(depthVal.textContent);

        grassleft.position.y = posy + 0.4;


    });


    const grasstop = new THREE.Mesh(grassGeo2, grassMat);
    grasstop.rotation.x = Math.PI / 2
    grasstop.position.x = 0
    grasstop.position.z = 6
    grasstop.rotation.z = Math.PI / 2
    grasstop.position.y = 1.4
    scene.add(grasstop);

    widthSlider.addEventListener('input', () => {
        widthVal.textContent = widthSlider.value;
        const scalex = parseFloat(widthVal.textContent);

        grasstop.scale.y = scalex * 0.1 + 0.9;

    });
    lengthSlider.addEventListener('input', () => {
        lengthVal.textContent = lengthSlider.value - 1;
        const posz = parseFloat(lengthVal.textContent);

        grasstop.position.z = posz * 2.4 + 6;
    });
    depthSlider.addEventListener('input', () => {
        depthVal.textContent = depthSlider.value;
        const posy = parseFloat(depthVal.textContent);

        grasstop.position.y = posy + 0.4;
    });

    const grassbot = new THREE.Mesh(grassGeo2, grassMat);
    grassbot.rotation.x = Math.PI / 2
    grassbot.position.x = 0
    grassbot.position.z = -6
    grassbot.rotation.z = Math.PI / 2
    grassbot.position.y = 1.4
    scene.add(grassbot);

    widthSlider.addEventListener('input', () => {
        widthVal.textContent = widthSlider.value;
        const scalex = parseFloat(widthVal.textContent);

        grassbot.scale.y = scalex * 0.1 + 0.9;

    });
    lengthSlider.addEventListener('input', () => {
        lengthVal.textContent = lengthSlider.value - 1;
        const posz = parseFloat(lengthVal.textContent);

        grassbot.position.z = -posz * 2.4 - 6;
    });
    depthSlider.addEventListener('input', () => {
        depthVal.textContent = depthSlider.value;
        const posy = parseFloat(depthVal.textContent);

        grassbot.position.y = posy + 0.4;
    });



    const lightswitchOff = document.getElementById('lightUnToggle');
    const lightswitchOn = document.getElementById('lightToggle');

    let bulbLights = [];

    function updateLights() {

        bulbLights.forEach(light => mid.remove(light));
        bulbLights = [];
        const count = 0
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

                const light = new THREE.PointLight(0xadd8ff, 2, 10, 0.1);
                if (count % 2 == 0) {
                    light.position.copy(pos);
                    mid.add(light);
                    bulbLights.push(light);
                }
            })
        }


    }
    updateLights();

    lightswitchOn.addEventListener('change', updateLights);
    lightswitchOff.addEventListener('change', updateLights);


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
const grassBlocksTop = [];

let grassmod;
for (let i = 0; i < 7; i++) {
    loader.load('model/grass-block.glb', (gltf) => {
        grassmod = gltf.scene;
        grassmod.scale.set(0.06, 0.1, 0.1);
        grassmod.position.set(10, 1.7, -6 + 2 * i)
        grassmod.traverse((child) => {
            if (child.isMesh && child.material.isMeshStandardMaterial) {
                child.material.metalness = 0;
                child.material.roughness = 1;
                child.material.color = new THREE.Color('green');
            }
        });
        scene.add(grassmod);
        grassBlocksLeft.push(grassmod);


        widthSlider.addEventListener('input', () => {
            const posx = parseFloat(widthSlider.value);
            widthVal.textContent = posx;

            grassBlocksLeft.forEach((block) => {
                block.position.x = posx + 9;
            });
        });

        lengthSlider.addEventListener('input', () => {
            const scalez = parseFloat(lengthSlider.value);
            lengthVal.textContent = scalez;

            grassBlocksLeft.forEach((block) => {
                block.scale.z = scalez * 0.2 - 0.1;
                block.scale.y = scalez * 0.05 + 0.05;
            });
        });
        depthSlider.addEventListener('input', () => {
            const posy = parseFloat(depthSlider.value);
            depthVal.textContent = posy;

            grassBlocksLeft.forEach((block) => {
                block.position.y = posy + 0.7;
                widthVal.textContent = block.position.y
            });
        });
    })

}


for (let i = 0; i < 7; i++) {
    loader.load('model/grass-block.glb', (gltf) => {
        grassmod = gltf.scene;
        grassmod.scale.set(0.06, 0.1, 0.1);
        grassmod.position.set(-10, 1.7, -6 + 2 * i)
        grassmod.traverse((child) => {
            if (child.isMesh && child.material.isMeshStandardMaterial) {
                child.material.metalness = 0;
                child.material.roughness = 1;
                child.material.color = new THREE.Color('green');
            }
        });
        scene.add(grassmod);
        grassBlocksRight.push(grassmod);


        widthSlider.addEventListener('input', () => {
            const posx = parseFloat(widthSlider.value);
            widthVal.textContent = posx;

            grassBlocksRight.forEach((block) => {
                block.position.x = -posx - 9;
            });
        });

        lengthSlider.addEventListener('input', () => {
            const scalez = parseFloat(lengthSlider.value);
            lengthVal.textContent = scalez;

            grassBlocksRight.forEach((block) => {
                block.scale.z = scalez * 0.2 - 0.1;
                block.scale.y = scalez * 0.05 + 0.05;
            });
        });
        depthSlider.addEventListener('input', () => {
            const posy = parseFloat(depthSlider.value);
            depthVal.textContent = posy;

            grassBlocksRight.forEach((block) => {
                block.position.y = posy + 0.7;
                widthVal.textContent = block.position.y
            });
        });
    })

}


for (let i = 0; i < 10; i++) {
    loader.load('model/grass-block.glb', (gltf) => {
        grassmod = gltf.scene;
        grassmod.scale.set(0.06, 0.1, 0.1);
        grassmod.position.set(-10 + 2 * i, 1.7, 6)
        grassmod.traverse((child) => {
            if (child.isMesh && child.material.isMeshStandardMaterial) {
                child.material.metalness = 0;
                child.material.roughness = 1;
                child.material.color = new THREE.Color('green');
            }
        });
        scene.add(grassmod);
        grassBlocksTop.push(grassmod);


        widthSlider.addEventListener('input', () => {
            const scalex = parseFloat(widthSlider.value);
            widthVal.textContent = scalex;

            grassBlocksTop.forEach((block) => {
                block.scale.x = scalex * 0.05 + 0.03;
                lengthVal.textContent = block.scale.x;
            });
        });

        lengthSlider.addEventListener('input', () => {
            const posz = parseFloat(lengthSlider.value);
            lengthVal.textContent = posz;

            grassBlocksTop.forEach((block) => {
                block.position.z = posz * 2 + 4;
                block.scale.y = posz * 0.05 + 0.05;
            });
        });
        depthSlider.addEventListener('input', () => {
            const posy = parseFloat(depthSlider.value);
            depthVal.textContent = posy;

            grassBlocksTop.forEach((block) => {
                block.position.y = posy + 0.7;
                widthVal.textContent = block.position.y
            });
        });
    })

}

const loungerModelBot = [];
for (let i = 0; i < 8; i++) {
    let loungerModel;

    loader.load('model/sun_lounger_3d.glb', (gltf) => {
        loungerModel = gltf.scene;
        loungerModel.scale.set(0.01, 0.01, 0.01);

        loungerModel.position.set(-7 + 2 * i, 1.43, -6)

        loungerModel.traverse((child) => {
            if (child.isMesh && child.material.isMeshStandardMaterial) {
                child.material.metalness = 0;
                child.material.roughness = 1;
                child.material.color = new THREE.Color('white');
            }
        });
        scene.add(loungerModel);
    loungerModelBot.push(loungerModel);


         lengthSlider.addEventListener('input', () => {
            const posz = parseFloat(lengthSlider.value);
            lengthVal.textContent = posz;

            loungerModelBot.forEach((block) => {
                block.position.z = - posz * 2.3 - 4;
            });
        });
        depthSlider.addEventListener('input', () => {
            const posy = parseFloat(depthSlider.value);
            depthVal.textContent = posy;

            loungerModelBot.forEach((block) => {
                block.position.y = posy + 0.45;
                widthVal.textContent = block.position.y
            });
        });

    });
    
}










const widthSlider = document.getElementById('widthSlider');
const lengthSlider = document.getElementById('lengthSlider');
const depthSlider = document.getElementById('depthSlider');
const widthVal = document.getElementById('widthVal');
const lengthVal = document.getElementById('lengthVal');
const depthVal = document.getElementById('depthVal');


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