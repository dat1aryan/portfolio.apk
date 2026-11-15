import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";

const base = import.meta.env.BASE_URL;
const logoUrls = [
  `${base}logos/python.jpg`,
  `${base}logos/C.jpg`,
  `${base}logos/c++.jpg`,
  `${base}logos/js.jpg`,
  `${base}logos/html.jpg`,
  `${base}logos/react.jpg`,
  `${base}logos/next.jpg`,
  `${base}logos/vite.jpg`,
  `${base}logos/tailwind_css.webp`,
  `${base}logos/node.jpg`,
  `${base}logos/fastapi.png`,
  `${base}logos/django.jpg`,
  `${base}logos/postgresql.jpg`,
  `${base}logos/docker.jpg`,
  `${base}logos/azure.jpg`,
  `${base}logos/github.jpg`,
  `${base}logos/tensorflow.webp`,
  `${base}logos/pytorch.jpg`,
  `${base}logos/sckit_learn.jpg`,
  `${base}logos/xgboost.jpg`,
  `${base}logos/numpy.jpg`,
  `${base}logos/pandas.jpg`,
  `${base}logos/scipy.jpg`,
  `${base}logos/gemini.jpg`,
];

/** Builds a 2:1 white-padded equirectangular sphere texture so every logo wraps cleanly without stretching or dark alpha artifacts. */
function createSphereTexture(url: string): THREE.CanvasTexture {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;

  const img = new Image();
  img.onload = () => {
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    const maxLogoSize = height * 0.36;
    const aspect = img.naturalWidth / Math.max(1, img.naturalHeight);
    const drawW = aspect >= 1 ? maxLogoSize : maxLogoSize * aspect;
    const drawH = aspect >= 1 ? maxLogoSize / aspect : maxLogoSize;

    // Paint the logo every 90 deg around the equator so a face always points toward the camera
    for (const u of [0.125, 0.375, 0.625, 0.875]) {
      const cx = width * u;
      ctx.drawImage(img, cx - drawW / 2, height * 0.5 - drawH / 2, drawW, drawH);
    }
    texture.needsUpdate = true;
  };
  img.src = url;

  return texture;
}

const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);

const sphereScales = [0.7, 1, 0.8, 1, 1];
const spheres = [...Array(30)].map((_, i) => ({
  scale: sphereScales[i % sphereScales.length],
  materialIndex: i % logoUrls.length,
}));

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  isActive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);

  useFrame((_state, delta) => {
    if (!isActive) return;
    delta = Math.min(0.1, delta);
    const impulse = vec
      .copy(api.current!.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -50 * delta * scale,
          -150 * delta * scale,
          -50 * delta * scale
        )
      );

    api.current?.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
      />
    </RigidBody>
  );
}

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

function Pointer({ vec = new THREE.Vector3(), isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive) return;
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    ref.current?.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

const TechStack = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const threshold = document
        .getElementById("work")!
        .getBoundingClientRect().top;
      setIsActive(scrollY > threshold);
    };
    document.querySelectorAll(".header a").forEach((elem) => {
      const element = elem as HTMLAnchorElement;
      element.addEventListener("click", () => {
        const interval = setInterval(() => {
          handleScroll();
        }, 10);
        setTimeout(() => {
          clearInterval(interval);
        }, 1000);
      });
    });
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const materials = useMemo(() => {
    return logoUrls.map((url) => {
      const texture = createSphereTexture(url);
      return new THREE.MeshPhysicalMaterial({
        map: texture,
        emissive: "#ffffff",
        emissiveMap: texture,
        emissiveIntensity: 0.3,
        metalness: 0.5,
        roughness: 1,
        clearcoat: 0.1,
      });
    });
  }, []);

  return (
    <div className="techstack">
      <h2> My Techstack</h2>

      <Canvas
        shadows
        gl={{ alpha: true, stencil: false, depth: false, antialias: false }}
        camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
        onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
        className="tech-canvas"
      >
        <ambientLight intensity={1} />
        <spotLight
          position={[20, 20, 25]}
          penumbra={1}
          angle={0.2}
          color="white"
          castShadow
          shadow-mapSize={[512, 512]}
        />
        <directionalLight position={[0, 5, -4]} intensity={2} />
        <Physics gravity={[0, 0, 0]}>
          <Pointer isActive={isActive} />
          {spheres.map(({ scale, materialIndex }, i) => (
            <SphereGeo
              key={i}
              scale={scale}
              material={materials[materialIndex]}
              isActive={isActive}
            />
          ))}
        </Physics>
        <Environment
          files={`${base}models/char_enviorment.hdr`}
          environmentIntensity={0.5}
          environmentRotation={[0, 4, 2]}
        />
        <EffectComposer enableNormalPass={false}>
          <N8AO color="#0f002c" aoRadius={2} intensity={1.15} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default TechStack;
