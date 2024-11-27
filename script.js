import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


// Initialisation de la scène
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;
camera.position.y = 1.2;

// Rendu dans le canvas existant
const canvas = document.getElementById('myCanvas');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

// Contrôles de la caméra
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Rend les mouvements plus fluides
controls.dampingFactor = 0.1; // Ajuste l'effet de fluidité

// Ajout de la lumière ambiante
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Chargement de l'image de fond
const textureLoader = new THREE.TextureLoader();
textureLoader.load('dojo.jpg', (texture) => {
    scene.background = texture; // Applique l'image comme fond de scène fixe
});

// Titre de la page 
const fontLoader = new FontLoader();
fontLoader.load('https://threejs.org/examples/fonts/gentilis_bold.typeface.json', (font) => {
    const textGeometry = new TextGeometry("K'e-mono", {
        font: font,
        size: 0.3,
        height: 0.05,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 0.005,
        bevelSegments: 5
        
    });

    const textMaterial = new THREE.MeshStandardMaterial({ color: 0x00000 }); 
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    // Ajouter le texte à une autre scène (comme un HUD)
    textMesh.position.set(-0.85, 1.8, -3); // Place le texte dans le champ de vision
    textMesh.rotation.x = Math.PI / 10; // Facultatif, selon votre design

    // Crée un groupe pour lier à la caméra
    const cameraGroup = new THREE.Group();
    cameraGroup.add(textMesh);

    // Attache le groupe à la caméra
    camera.add(cameraGroup);

    // ajoute la caméra à la scène
    scene.add(camera);
});

// ajout d'un texte
fontLoader.load('https://threejs.org/examples/fonts/gentilis_bold.typeface.json', (font) => {
    const textGeometry = new TextGeometry("Click on the sensors!", {
        font: font,
        size: 0.05, // Taille plus petite
        height: 0.006, // Moins épais
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.005,
        bevelSize: 0.002,
        bevelSegments: 3
    });

    const textMaterial = new THREE.MeshStandardMaterial({ color: 0x00FEC7}); // Blanc pour bien contraster
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    // Position du texte dans le champ de vision
    textMesh.position.set(0.4, -0.1, -1.5); // Ajustez pour placer sous votre texte principal
    textMesh.rotation.y = -0.3;

    // Crée un groupe lié à la caméra
    const cameraGroup = new THREE.Group();
    cameraGroup.add(textMesh);

    // Attache le groupe à la caméra
    camera.add(cameraGroup);

    // Ajout de la caméra dans la scène
    scene.add(camera);
});

// ajout d'un texte
fontLoader.load('https://threejs.org/examples/fonts/gentilis_bold.typeface.json', (font) => {
    const textGeometry = new TextGeometry("Zoom and rotate with the mouse", {
        font: font,
        size: 0.06, // Taille plus petite
        height: 0.006, // Moins épais
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.0000005,
        bevelSize: 0.002,
        bevelSegments: 3
    });

    const textMaterial = new THREE.MeshStandardMaterial({ color: 0x00000 }); // Blanc pour bien contraster
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    // Position du texte dans le champ de vision
    textMesh.position.set(-0.6, -1, -1.5); // Ajustez pour placer sous votre texte principal
    textMesh.rotation.x = -0.2; // Pas de rotation par défaut

    // Crée un groupe lié à la caméra
    const cameraGroup = new THREE.Group();
    cameraGroup.add(textMesh);

    // Attache le groupe à la caméra
    camera.add(cameraGroup);

    // Assurez-vous que la caméra est bien dans la scène
    scene.add(camera);
});

// Variables pour les flèches
const arrowLength = 0.1; // Longueur de la flèche
const arrowWidth = 0.04; // Largeur de la flèche
const arrowColor = 0x00FEC7;
let arrows = [];

// Fonction pour créer une flèche 3D avec une tête et un corps épais
function createArrow(position, direction) {
    // Créer la tige de la flèche (cylindre)
    const geometry = new THREE.CylinderGeometry(arrowWidth, arrowWidth, arrowLength, 8);
    const material = new THREE.MeshStandardMaterial({ color: arrowColor });
    const cylinder = new THREE.Mesh(geometry, material);

    // Créer la tête de la flèche (cône)
    const coneHeight = arrowWidth * 1.5; // Hauteur du cône pour la tête de la flèche
    const coneGeometry = new THREE.ConeGeometry(arrowWidth * 2, coneHeight, 8);
    const cone = new THREE.Mesh(coneGeometry, material);

    // Positionner le cône à l'extrémité de la tige
    cone.position.set(0, arrowLength / 2 + coneHeight / 2, 0);
    
    // Combiner la tige et la tête dans un seul groupe
    const arrow = new THREE.Group();
    arrow.add(cylinder);
    arrow.add(cone);
    
    // Positionner la flèche dans la scène
    arrow.position.copy(position);
    
    // Orientation de la flèche selon la direction donnée
    const axis = new THREE.Vector3(0, 0, 1); // L'axe de rotation pour aligner la flèche
    const angle = Math.acos(direction.dot(axis)); // Calcul de l'angle entre la direction et l'axe
    const rotationAxis = new THREE.Vector3().crossVectors(axis, direction).normalize(); // L'axe autour duquel la flèche doit tourner
    arrow.setRotationFromAxisAngle(rotationAxis, angle); // Appliquer la rotation
    
    scene.add(arrow);
    return arrow;
}

// Créer 3 flèches avec différentes positions et directions
arrows.push(createArrow(new THREE.Vector3(1.3, 0.6, -0.1), new THREE.Vector3(1,1,-1))); // Flèche 1 : 
arrows.push(createArrow(new THREE.Vector3(-0.55, -0.25, 0.3), new THREE.Vector3(1,-1,-1))); // Flèche 2 :
arrows.push(createArrow(new THREE.Vector3(-0.5, 1.55, -0.2), new THREE.Vector3(-0.5, 1, -1))); // Flèche 3 : 
arrows.push(createArrow(new THREE.Vector3(0, 0.9, -0.55), new THREE.Vector3(0, -1, 0))); // Flèche 4 : 


// Fonction d'animation
let scaleDirection = 1;
let scaleSpeed = 0.002;
function animateArrowSize() {
    arrows.forEach(arrow => {
        // Clignotement dynamique de la taille de la flèche
        arrow.scale.set(scaleDirection, scaleDirection, scaleDirection);

        if (scaleDirection >= 1.2 || scaleDirection <= 0.8) {
            scaleSpeed = -scaleSpeed; // Inverser la direction du clignotement
        }
        scaleDirection += scaleSpeed;
    });
}

// Raycaster pour la détection de la souris
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let kimonoMesh;

// Chargement du modèle du kimono
const loader = new GLTFLoader();
loader.load(
    'kimono.glb',
    function (gltf) {
        const kimono = gltf.scene;
        kimono.scale.set(2, 2, 2); // Échelle augmentée (facteur de 2 pour le zoom)
        scene.add(kimono);
        kimono.position.y = -0.4;

        // Rendre le kimono transparent au survol
        kimono.traverse((node) => {
            if (node.isMesh) {
                node.material.transparent = true;
                node.material.opacity = 1.0;
                kimonoMesh = node;
            }
        });

        // Charger le modèle du PCB
        loadPCBModel(kimono);

        // Charger le modèle du sensor
        loadsensorModel(kimono);

        // Charger le modèle du IMU
        loadIMUModel(kimono);
    },
    undefined,
    function (error) {
        console.error('Erreur lors du chargement du modèle :', error);
    }
);

// Fonction pour charger le modèle du PCB
function loadPCBModel(kimono) {
    const pcbLoader = new GLTFLoader();
    pcbLoader.load(
        'pcb.glb',
        function (gltf) {
            const pcb = gltf.scene;
            pcb.scale.set(0.020, 0.020, 0.020);
            pcb.position.set(-0.18, 0.08, 0.15);
            pcb.rotation.y = Math.PI / 2;
            pcb.traverse((child) => {
                if (child.isMesh) {
                    child.name = `PCB`; 
                }
            });
            kimono.add(pcb);
        },
        undefined,
        function (error) {
            console.error('Erreur lors du chargement du sensor :', error);
        }
    );
}

// Fonction pour charger le modèle du IMU
function loadIMUModel(kimono) {
    const imuLoader = new GLTFLoader();
    const imuPositions = [
        { x: -0.17, y: 0.91, z: -0.1 },
        { x: 0.17, y: 0.91, z: -0.1 }
    ];
    imuLoader.load(
        'imu.glb',
        function (gltf) {
            imuPositions.forEach((pos, index) => {
                const imu = gltf.scene.clone();
                imu.scale.set(0.0011, 0.0011, 0.0011);
                imu.position.set(pos.x, pos.y, pos.z);

                // Assigner un nom unique aux Meshes des IMU
                imu.traverse((child) => {
                    if (child.isMesh) {
                        child.name = `IMU_${index}`; // Nom unique pour chaque IMU
                    }
                });

                kimono.add(imu);
            });
        },
        undefined,
        function (error) {
            console.error('Erreur lors du chargement des IMU :', error);
        }
    );
}

// Fonction pour charger le modèle du sensor
function loadsensorModel(kimono) {
    const sensorLoader = new GLTFLoader();
    const sensorPositions = [
        { x: -0.46, y: 0.48, z: -0.014 },
        { x: -0.36, y: 0.65, z: -0.03 },
        { x: 0.45, y: 0.5, z: -0.02 },
        { x: 0.33, y: 0.65, z: -0.028 },
        { x: 0.13, y: 0.75, z: 0.07 },
        { x: -0.13, y: 0.75, z: 0.07 },
        { x: -0.15, y: 0.8, z: -0.15 },
        { x: -0.1, y: 0.5, z: -0.09 },
        { x: 0.15, y: 0.8, z: -0.15 },
        { x: 0.1, y: 0.5, z: -0.10 },
        { x: 0, y: 0.65, z: -0.15 }

    ];
    sensorLoader.load(
        'sensor.glb',
        function (gltf) {
            sensorPositions.forEach((pos, index) => {
                const sensor = gltf.scene.clone();
                sensor.scale.set(0.05, 0.05, 0.05);
                sensor.position.set(pos.x, pos.y, pos.z);
                sensor.traverse((child) => {
                    if (child.isMesh) {
                        child.name = `Sensor_${index}`; // Attribuer un nom unique au Mesh
                    }
                });
                kimono.add(sensor);
            });
        },
        undefined,
        function (error) {
            console.error('Erreur lors du chargement des capteurs :', error);
        }
    );
}


// Gestion des clics
function onClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    
    let intersectElements = [];
    
    scene.traverse(child => {
        if ((child.name.startsWith("Sensor"))||(child.name.startsWith("IMU"))||(child.name.startsWith("PCB"))) intersectElements.push(child);
    })
    
    // Filtrer le kimono pour éviter la détection de clics dessus
    const intersects = raycaster.intersectObjects(intersectElements, true);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;

        if (clickedObject.name.includes('Sensor') || clickedObject.name.includes('PCB') || clickedObject.name.includes('IMU')) {
            zoomOnObject(clickedObject);
            showDescription(clickedObject);
        }
    }
}

window.addEventListener('click', onClick, false);

// Récupérer l'élément de la boîte de texte
const textBox = document.querySelector('.text-box');

// Zoom sur un capteur
function zoomOnObject(object) {
    // Obtenir la position globale du capteur
    const targetPosition = new THREE.Vector3();
    object.getWorldPosition(targetPosition);

    // Calculer une position pour la caméra légèrement devant le capteur (sur l'axe Z)
    const cameraPosition = new THREE.Vector3(
        targetPosition.x,
        targetPosition.y,
        targetPosition.z + 0.5 // Ajustez la distance pour reculer ou avancer
    );

    // Position initiale de la caméra
    const startPosition = camera.position.clone();
    const startOpacity = kimonoMesh.material.opacity; // Sauvegarder l'opacité actuelle
    let elapsedTime = 0;
    const duration = 20;

    // Masquer la boîte de texte
    textBox.style.display = "none";

    function animateZoom() {
        elapsedTime += 0.5;
        const t = Math.min(elapsedTime / duration, 1); // Limite t entre 0 et 1

        // Interpolation de la position de la caméra
        camera.position.lerpVectors(startPosition, cameraPosition, t);

        // La caméra regarde toujours le capteur
        camera.lookAt(targetPosition);

        // Réduire progressivement l'opacité du kimono
        if (kimonoMesh && kimonoMesh.material) {
            kimonoMesh.material.opacity = THREE.MathUtils.lerp(startOpacity, 0.3, t); // Rendre semi-transparent
        }

        // Continuer l'animation tant que t < 1
        if (t < 1) {
            requestAnimationFrame(animateZoom);

        } else {
            showReturnButton(); // Afficher le bouton de retour une fois le zoom terminé
        }
    }
    animateZoom();
}

const descriptions = {
    sensors1: `
        <p>
            It consists of two electrodes embroidered with conductive thread on each terminal of the sensor, separated by a resistive fabric. <br><br>
            When gripped, the pressure applied to the sensor causes a change in resistance. <br>
            This signal is used to analyze the judoka's grip technique, known as 'kumi-kata'.
        </p>
    `,
    sensors2: `
        <p>
            It consists of two electrodes embroidered with conductive thread on each terminal of the sensor, separated by a resistive fabric. <br><br>
            When a fall occurs on the back, the pressure applied to the sensor causes a change in resistance. This signal is used to analyze the back's position on the ground during impact, aiding in refereeing decisions.        
        </p>
    `,
    pcb: `
        <p>
            This microcontroller records the data collected by the sensors during training. <br>
            It then transmits the data to a digital interface that visualizes the analysis results.
        </p>
    `,
    imu: `
        <p>
            These IMU (Inertial Measurement Unit) sensors measure movements and orientation during training. <br>
            The data is used to infer various elements such as the center of gravity, posture, speed, and the judoka's responsiveness.        
        </p>
    `,
};


const descriptionTitles = {};

// Générer dynamiquement les titres pour les capteurs
for (let i = 0; i <= 10; i++) {
    descriptionTitles[`Sensor_${i}`] = 'Resistive sensors';
}
descriptionTitles['PCB'] = 'LilyPad arduino Microcontroller';
descriptionTitles['IMU_0'] = 'IMU sensor';
descriptionTitles['IMU_1'] = 'IMU sensor';


// Afficher une description
function showDescription(object) {
    const existingDescription = document.getElementById('description');
    if (existingDescription) existingDescription.remove();

    const title = descriptionTitles[object.name]; // Cherche un titre personnalisé ou utilise le nom par défaut

    const description = document.createElement('div');
    description.id = 'description';
    description.style.position = 'absolute';
    description.style.color = 'white';
    description.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    description.style.padding = '10px';
    description.style.borderRadius = '5px';
    description.style.top = `${event.clientY}px`;
    description.style.left = `${event.clientX}px`;

    // Ajouter une description spécifique en fonction de l'objet cliqué
    let descriptionText = "";
    if (object.name.includes('Sensor')) {
        const sensorIndex = parseInt(object.name.split('_')[1], 10); // Récupère l'index numérique
        descriptionText = sensorIndex <= 5 ? descriptions.sensors1 : descriptions.sensors2;
    } else if (object.name.includes('PCB')) {
        descriptionText = descriptions.pcb;
    } else if (object.name.includes('IMU')) {
        descriptionText = descriptions.imu;
    }

    description.innerHTML = `<strong>${title}</strong><br>${descriptionText}`;
    document.body.appendChild(description);

    // setTimeout(() => {
    //     if (description) description.remove();
    // }, 10000);
}

// Afficher le bouton "Retour"
function showReturnButton() {
    const existingButton = document.getElementById('returnButton');
    if (existingButton) return; // Ne pas créer plusieurs boutons
    const returnButton = document.createElement('div');
    returnButton.id = 'returnButton';
    returnButton.style.position = 'absolute';
    returnButton.style.bottom = '20px';
    returnButton.style.left = '20px';
    returnButton.style.padding = '10px 20px';
    returnButton.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    returnButton.style.color = 'white';
    returnButton.style.borderRadius = '5px';
    returnButton.style.cursor = 'pointer';
    returnButton.innerHTML = 'Retour';

    // Ajouter le bouton à la page
    document.body.appendChild(returnButton);

    // Ajouter l'événement de clic
    returnButton.addEventListener('click', () => {
        resetView(); // Réinitialiser la vue de la caméra
        hideDescription(); // Supprime la description affichée
        document.body.removeChild(returnButton); // Supprimer le bouton
    });
}

// Fonction pour cacher la description
function hideDescription() {
    const existingDescription = document.getElementById('description');
    if (existingDescription) existingDescription.remove();
}

// Réinitialiser la vue de la caméra
function resetView() {
    const targetPosition = new THREE.Vector3(0, 1.5, 3); // Position initiale de la caméra
    const startPosition = camera.position.clone();

    let elapsedTime = 0;
    const duration = 10;

    function animateReset() {
        elapsedTime += 0.5;
        const t = Math.min(elapsedTime / duration, 1); // Limite t entre 0 et 1

        // Interpolation de la position de la caméra
        camera.position.lerpVectors(startPosition, targetPosition, t);

        // La caméra regarde toujours l'origine (le centre du kimono)
        camera.lookAt(new THREE.Vector3(0, 0.4, 0));

        if (t < 1) {
            requestAnimationFrame(animateReset);
        } else {
            textBox.style.display = "block"; // Réafficher la boîte de texte
        }
    }

    animateReset();
}

// Gestion de la souris pour ajuster l'opacité du kimono
function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(kimonoMesh, true);

    if (intersects.length > 0) {
        kimonoMesh.material.opacity = 0.3;
    } else {
        kimonoMesh.material.opacity = 1;
    }
}



// Écouteur de mouvement de la souris
window.addEventListener('mousemove', onMouseMove, false);

// Animation et rendu
function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
    // Appliquer l'animation de taille des flèches
    animateArrowSize();
}

animate();
