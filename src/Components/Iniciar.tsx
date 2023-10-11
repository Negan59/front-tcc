import React, { Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useFBX, useGLTF } from '@react-three/drei';
import { AnimationMixer, Mesh, MeshBasicMaterial } from 'three'; // Importe Mesh e MeshBasicMaterial
import { useDropzone } from 'react-dropzone';
import { useClip } from '../useClip';
import './Iniciar.css'; // Importe o arquivo CSS fornecido

interface ModelProps {
  avatarUrl: string;
  animUrl: string;
  xPos?: number;
}

function Model({ avatarUrl, animUrl, xPos }: ModelProps) {
  const model = useGLTF(avatarUrl);
  const fbx = useFBX(animUrl);
  const clip = useClip(fbx);

  let mixer: AnimationMixer;

  useEffect(() => {
    mixer = new AnimationMixer(model.scene);
    const action = mixer.clipAction(clip);
    action.play();

    model.scene.traverse((child) => {
      if ((child as any).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Adicione um material verde ao avatar male2.glb
        if (avatarUrl === './male2.glb') {
          const greenMaterial = new MeshBasicMaterial({ color: 'green' });
          (child as Mesh).material = greenMaterial;
        }
      }
    });
  }, [fbx]);

  useFrame((_, delta) => {
    if (mixer) {
      mixer.update(delta);
    }
  });

  return <primitive object={model.scene} position={[xPos, -0.8, 2]} />;
}

function Iniciar() {
  const [url, setUrl] = useState<string>('/animation.fbx');
  const { getRootProps } = useDropzone({ onDrop: handleDrop });

  function handleDrop(files: File[]) {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div {...getRootProps({ className: 'iniciar-container' })}>
      <Canvas camera={{
        fov: 45,
      }} shadows>
        <ambientLight intensity={6.0} />
        <spotLight position={[10, 15, 10]} angle={0.3} castShadow intensity={2.0} /> {/* Reduzi a intensidade da luz pontual */}
        <pointLight position={[-10, -10, -10]} castShadow intensity={2.0} />
        <Suspense fallback={null}>
          <Model avatarUrl='./male.glb' animUrl={url} xPos={-0.5} />
          <Model avatarUrl='./male2.glb' animUrl={url} xPos={0.5} />
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]}>
            <planeGeometry attach='geometry' args={[10, 10]} />
            <shadowMaterial attach='material' opacity={0.3} />
          </mesh>
        </Suspense>
      </Canvas>

    </div>
  );
}

export default Iniciar;
