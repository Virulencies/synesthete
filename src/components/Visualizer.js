import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Visualizer = ({ audioFeatures }) => {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        
        // ensure mount has defined width and height
        mount.style.width = '100%';
        mount.style.height = '500px'; // Set desired height
        
        // scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        mount.appendChild(renderer.domElement);

        // geometry and material
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        // camera position
        camera.position.z = 5;

        // animation function
        const animate = () => {
            requestAnimationFrame(animate);

            // rotate the cube based on audio features
            if (audioFeatures) {
                cube.rotation.x += audioFeatures.tempo / 60000; // adjust rotation speed based on tempo
                cube.rotation.y += audioFeatures.energy / 10; // adjust based on energy
            } else {
                cube.rotation.x += 0.01;
                cube.rotation.y += 0.01;
            }

            renderer.render(scene, camera);
        };

        animate();

        // clean up on unmount
        return () => {
            mount.removeChild(renderer.domElement);
        };
    }, [audioFeatures]);

    return <div ref={mountRef} style={{ width: '100%', height: '500px' }} />;
};

export default Visualizer;
