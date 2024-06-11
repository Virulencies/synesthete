import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Visualizer = ({ audioFeatures, isPlaying, getPlayerState, colorScheme }) => {
    const mountRef = useRef(null);
    const cubeRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;

        // mount with defined width and height
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

        // calculate boundaries based on the camera frustum and cube size
        const frustumSize = 5; // same as camera's z position - unsure why this needs to be the same but it works
        const aspect = mount.clientWidth / mount.clientHeight;
        const boundaries = {
            left: -frustumSize * aspect / 2 + 1,
            right: frustumSize * aspect / 2 - 1,
            top: frustumSize / 2 - 1,
            bottom: -frustumSize / 2 + 1
        };

        // function to update color based on track progress and energy
        const updateColor = (progress) => {
            let hue;
            switch (colorScheme) {
                case 'cool':
                    hue = (progress / 10000) % 1;
                    hue = hue * 120 + 180; // blue to green to purple
                    break;
                case 'warm':
                    hue = (progress / 10000) % 1;
                    hue = hue * 60; // red to orange to yellow
                    break;
                case 'default':
                default:
                    hue = (progress / 10000) % 1;
                    hue = hue * 360; // all colors
                    break;
            }
            const newColor = new THREE.Color(`hsl(${hue}, 100%, 50%)`);
            cube.material.color.set(newColor);
        };

        // ANIMATION FUNCTION
        const animate = async () => {
            requestAnimationFrame(animate);

            if (isPlaying && cube.userData.velocity && cube.userData.rotationSpeed) {
                // bounce the cube off the edges
                if (cube.position.x + 0.5 > boundaries.right || cube.position.x - 0.5 < boundaries.left) {
                    cube.userData.velocity.x = -cube.userData.velocity.x;
                }
                if (cube.position.y + 0.5 > boundaries.top || cube.position.y - 0.5 < boundaries.bottom) {
                    cube.userData.velocity.y = -cube.userData.velocity.y;
                }

                // update cube position
                cube.position.x += cube.userData.velocity.x;
                cube.position.y += cube.userData.velocity.y;

                // rotate the cube based on danceability
                cube.rotation.x += cube.userData.rotationSpeed;
                cube.rotation.y += cube.userData.rotationSpeed;

                // fetch current playback state and update color
                const state = await getPlayerState();
                if (state) {
                    const progress = state.position;
                    updateColor(progress);
                }
            }

            renderer.render(scene, camera);
        };

        // initialize cube properties based on audio features
        const initCubeProperties = () => {
            if (audioFeatures) {
                // set cube's velocity based on tempo non-linear
                const tempoFactor = Math.pow(audioFeatures.tempo / 120, 2.5); // Further non-linear scaling
                cube.userData.velocity = {
                    x: tempoFactor / 100, 
                    y: tempoFactor / 100
                };

                // set cube's rotation speed based on danceability
                cube.userData.rotationSpeed = audioFeatures.danceability / 50;
            } else {
                // use default values if audioFeatures are not available
                cube.userData.velocity = { x: 0.01, y: 0.01 };
                cube.userData.rotationSpeed = 0.02;
            }
        };

        initCubeProperties();
        animate();

        // clean up on unmount
        return () => {
            mount.removeChild(renderer.domElement);
        };
    }, [audioFeatures, isPlaying, getPlayerState, colorScheme]);

    return <div ref={mountRef} style={{ width: '100%', height: '500px' }} />;
};

export default Visualizer;
