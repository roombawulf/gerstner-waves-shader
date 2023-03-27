import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'

// Debug
const gui = new dat.GUI()
gui.close()
const wave1 = gui.addFolder('Wave 1')
const wave2 = gui.addFolder('Wave 2')
const wave3 = gui.addFolder('Wave 3')

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Update camera z-pos
    if (window.innerWidth < 800){
        controls.minDistance = 6
        controls.maxDistance = 15
        camera.position.z = 10.5
    }
    else {
        controls.minDistance = 1
        controls.maxDistance = 6
        camera.position.z = 4.5
    }
})


// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0.75, 4, 0.1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
if (window.innerWidth < 800){
    controls.minDistance = 6
    controls.maxDistance = 15
    camera.position.z = 10.5
}
else{
    controls.minDistance = 1
    controls.maxDistance = 6
    camera.position.z = 4.5
}
controls.enableDamping = true
controls.maxPolarAngle = Math.PI * 0.45

// Wave Plane Geometry
const waterGeometry = new THREE.PlaneGeometry(5, 5, 128, 128)

// Wave Plane Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    uniforms:
    {
        u_Time: { value: 0.0 },

        // Waves are Vec4(X Direction, Z Direction, Steepness, Wavelength)
        u_Wave1: { value: new THREE.Vector4(1.0, 0.5, 0.4, 2.5)},
        u_Wave2: { value: new THREE.Vector4(0.1, 0.4, 0.2, 1.8)},
        u_Wave3: { value: new THREE.Vector4(0.2, 0.3, 0.3, 0.9)},

        // Light Uniforms
        u_LightPos: { value: new THREE.Vector3(2.0, 1.0, 0.0)},
        u_LightColor: { value: new THREE.Color(0x48cae4)},
        u_LightPos2: { value: new THREE.Vector3(-2.0, 1.0, 0.0)},
        u_LightColor2: { value: new THREE.Color(0xf0f3bd)},
        u_LightIntensity: { value: 0.5 },
        u_CameraPos: { value: camera.position },
    }
})

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

// Debug

function addControl(folder, object, property, min, max, step, label){
    folder.add(object, property).min(min).max(max).step(step).name(label)
}

// Wave 1 Properties
addControl(wave1, waterMaterial.uniforms.u_Wave1.value, 'x', -1.0, 1.0, 0.1, 'X Direction')
addControl(wave1, waterMaterial.uniforms.u_Wave1.value, 'y', -1.0, 1.0, 0.1, 'Z Direction')
addControl(wave1, waterMaterial.uniforms.u_Wave1.value, 'z', 0.0, 1.0, 0.01, 'Wave Steepness')
addControl(wave1, waterMaterial.uniforms.u_Wave1.value, 'w', 0.0, 10.0, 0.1, 'Wavelength')

// Wave 2 Properties
addControl(wave2, waterMaterial.uniforms.u_Wave2.value, 'x', -1.0, 1.0, 0.1, 'X Direction')
addControl(wave2, waterMaterial.uniforms.u_Wave2.value, 'y', -1.0, 1.0, 0.01, 'Z Direction')
addControl(wave2, waterMaterial.uniforms.u_Wave2.value, 'z', 0.0, 1.0, 0.01, 'Wave Steepness')
addControl(wave2, waterMaterial.uniforms.u_Wave2.value, 'w', 0.0, 10.0, 0.1, 'Wavelength')

// Wave 3 Properties
addControl(wave3, waterMaterial.uniforms.u_Wave3.value, 'x', -1.0, 1.0, 0.1, 'X Direction')
addControl(wave3, waterMaterial.uniforms.u_Wave3.value, 'y', -1.0, 1.0, 0.1, 'Z Direction')
addControl(wave3, waterMaterial.uniforms.u_Wave3.value, 'z', 0.0, 1.0, 0.01, 'Wave Steepness')
addControl(wave3, waterMaterial.uniforms.u_Wave3.value, 'w', 0.0, 10.0, 0.1, 'Wavelength')

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animation
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Water Uniform Time
    waterMaterial.uniforms.u_Time.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()