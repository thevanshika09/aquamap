import { useEffect, useRef } from "react";
import * as THREE from "three";

function Earth3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      1,
      0.1,
      1000
    );
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(400, 400);
    mountRef.current.appendChild(renderer.domElement);

    // 🌍 Sphere geometry
    const geometry = new THREE.SphereGeometry(0.8, 64, 64);

    // 🌍 Texture
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
      "https://threejs.org/examples/textures/earth_atmos_2048.jpg"
    );

    const material = new THREE.MeshStandardMaterial({
      map: texture,
    });

    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    // 💡 Lighting
    const light = new THREE.PointLight(0xffffff, 1.5);
    light.position.set(5, 3, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // 🔄 Animation
    const animate = () => {
      requestAnimationFrame(animate);
      earth.rotation.y += 0.003;
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef}></div>;
}

export default Earth3D;