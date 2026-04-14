"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroAmbientCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#dbd6cc"),
      transparent: true,
      opacity: 0.24,
    });

    const ringSoftMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#ebe6dc"),
      transparent: true,
      opacity: 0.18,
    });

    const ringOne = new THREE.Mesh(
      new THREE.TorusGeometry(2.65, 0.018, 12, 180),
      ringMaterial,
    );
    ringOne.rotation.set(0.35, -0.28, 0.14);

    const ringTwo = new THREE.Mesh(
      new THREE.TorusGeometry(1.62, 0.016, 10, 160),
      ringSoftMaterial,
    );
    ringTwo.position.set(1.25, -0.25, -0.35);
    ringTwo.rotation.set(-0.2, 0.48, -0.12);

    const ringThree = new THREE.Mesh(
      new THREE.TorusGeometry(0.45, 0.012, 8, 100),
      ringSoftMaterial,
    );
    ringThree.position.set(1.95, -0.35, 0.2);
    ringThree.rotation.set(0.2, -0.2, 0.7);

    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 24, 24),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#d3cec3"),
        transparent: true,
        opacity: 0.7,
      }),
    );
    dot.position.set(-1.85, 1.05, 0.5);

    group.add(ringOne, ringTwo, ringThree, dot);

    const clock = new THREE.Clock();
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const targetScroll = { value: 0 };
    const scrollInfluence = { value: 0 };

    const resize = () => {
      const width = mount.clientWidth || 1;
      const height = mount.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    const onScroll = () => {
      targetScroll.value = window.scrollY;
    };

    if (!prefersReducedMotion) {
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    let frameId = 0;

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.elapsedTime;
      scrollInfluence.value = prefersReducedMotion
        ? 0
        : THREE.MathUtils.damp(
            scrollInfluence.value,
            targetScroll.value / Math.max(window.innerHeight, 1),
            5,
            delta,
          );
      const depth = THREE.MathUtils.clamp(scrollInfluence.value, -1.2, 2.4);

      group.rotation.y = Math.sin(elapsed * 0.22) * 0.12 + depth * 0.08;
      group.rotation.x = Math.cos(elapsed * 0.16) * 0.06 - depth * 0.04;
      group.position.y = -depth * 0.22;

      ringOne.rotation.z += 0.0012 + depth * 0.00025;
      ringTwo.rotation.z -= 0.0015 - depth * 0.0002;
      ringThree.rotation.z += 0.002 + depth * 0.0003;
      dot.position.y = 1.05 + Math.sin(elapsed * 1.2 + depth * 1.4) * 0.06;

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      mount.removeChild(renderer.domElement);
      ringOne.geometry.dispose();
      ringTwo.geometry.dispose();
      ringThree.geometry.dispose();
      dot.geometry.dispose();
      ringMaterial.dispose();
      ringSoftMaterial.dispose();
      (dot.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="hero-ambient-canvas" ref={mountRef} aria-hidden="true" />
  );
}
