import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Visualizer = ({ audioFeatures, isPlaying }) => {
    const mountRef = useRef(null);
    const cubeRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;

        // ensure mount has defined width and height
        mount.style.width = '100%';
        mount.style.height = '500px';

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
        cubeRef.current = cube;
        scene.add(cube);

        // camera position
        camera.position.z = 5;

        // cube movement variables
        let velocity = {
            x: 0.02,
            y: 0.02
        };

        // calc boundaries based on the camera frustum and cube size
        const frustumSize = 5; // same as camera's z position
        const aspect = mount.clientWidth / mount.clientHeight;
        const boundaries = {
            left: -frustumSize * aspect / 2 + 1,
            right: frustumSize * aspect / 2 - 1,
            top: frustumSize / 2 - 1,
            bottom: -frustumSize / 2 + 1
        };

        // animation function
        const animate = () => {
            requestAnimationFrame(animate);

            if (isPlaying) {
                // bounce cube off the edges
                if (cube.position.x + 0.5 > boundaries.right || cube.position.x - 0.5 < boundaries.left) {
                    velocity.x = -velocity.x;
                }
                if (cube.position.y + 0.5 > boundaries.top || cube.position.y - 0.5 < boundaries.bottom) {
                    velocity.y = -velocity.y;
                }

                // update cube position
                cube.position.x += velocity.x;
                cube.position.y += velocity.y;

                // rotate cube based on audio features
                if (audioFeatures) {
                    cube.rotation.x += audioFeatures.tempo / 60000; // adjust rotation speed based on tempo
                    cube.rotation.y += audioFeatures.energy / 10; // adjust based on energy
                } else {
                    cube.rotation.x += 0.01;
                    cube.rotation.y += 0.01;
                }
            }

            renderer.render(scene, camera);
        };

        animate();

        // clean up on unmount
        return () => {
            mount.removeChild(renderer.domElement);
        };
    }, [audioFeatures, isPlaying]);

    return <div ref={mountRef} style={{ width: '100%', height: '500px' }} />;
};

export default Visualizer;
