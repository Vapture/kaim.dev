import React, { createContext, useEffect, useContext } from 'react';
import * as THREE from 'three';

const EffectContext = createContext();

export const useEffectContext = () => useContext(EffectContext);

const EffectProvider = ({ children }) => {
  useEffect(() => {
    const fragmentShader = ` uniform sampler2D uTexture;
      uniform float uAlpha;
      uniform vec2 uOffset;
      varying vec2 vUv;

      vec3 rgbShift(sampler2D textureImage, vec2 uv, vec2 offset) {
        float r = texture2D(textureImage,uv + offset).r;
        vec2 gb = texture2D(textureImage,uv).gb;
        return vec3(r,gb);
      }

      void main() {
        vec3 color = rgbShift(uTexture,vUv,uOffset);
        gl_FragColor = vec4(color,uAlpha);
      }
    `;

    const vertexShader = `uniform sampler2D uTexture;
      uniform vec2 uOffset;
      varying vec2 vUv;

      #define M_PI 3.1415926535897932384626433832795

      vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset) {
        position.x = position.x + (sin(uv.y * M_PI) * offset.x);
        position.y = position.y + (sin(uv.x * M_PI) * offset.y);
        return position;
      }

      void main() {
        vUv = uv;
        vec3 newPosition = deformationCurve(position, uv, uOffset);
        gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
      }
    `;

    class EffectCanvasClass {
      constructor() {
        this.container = document.querySelector('main');
        this.elements = [...document.querySelectorAll('.scrollable > *')];
        this.meshItems = [];
        this.setupCamera();
        this.createMeshItems();
        this.render();
      }

      get viewport() {
        let width = window.innerWidth;
        let height = window.innerHeight;
        let aspectRatio = width / height;
        return {
          width,
          height,
          aspectRatio
        };
      }

      setupCamera() {
        window.addEventListener('resize', this.onWindowResize.bind(this), false);

        this.scene = new THREE.Scene();

        let perspective = 1000;
        const fov = (180 * (2 * Math.atan(window.innerHeight / 2 / perspective))) / Math.PI;
        this.camera = new THREE.PerspectiveCamera(fov, this.viewport.aspectRatio, 1, 1000);
        this.camera.position.set(0, 0, perspective);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.viewport.width, this.viewport.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
      }

      onWindowResize() {
        this.camera.aspect = this.viewport.aspectRatio;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.viewport.width, this.viewport.height);
      }

      createMeshItems() {
        this.elements.forEach(element => {
          let meshItem = new MeshItem(element, this.scene);
          this.meshItems.push(meshItem);
        });
      }

      render() {
        for (let i = 0; i < this.meshItems.length; i++) {
          this.meshItems[i].render();
        }
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
      }
    }

    class MeshItem {
      constructor(element, scene) {
        this.element = element;
        this.scene = scene;
        this.offset = new THREE.Vector2(0, 0);
        this.sizes = new THREE.Vector2(0, 0);
        this.createMesh();
      }

      getDimensions() {
        const { width, height, top, left } = this.element.getBoundingClientRect();
        this.sizes.set(width, height);
        this.offset.set(left - window.innerWidth / 2 + width / 2, -top + window.innerHeight / 2 - height / 2);
      }

      createMesh() {
        this.geometry = new THREE.PlaneGeometry(1, 1, 100, 100);
        const texture = new THREE.CanvasTexture(this.elementToCanvas(this.element));
        this.uniforms = {
          uTexture: {
            value: texture
          },
          uOffset: {
            value: new THREE.Vector2(0.0, 0.0)
          },
          uAlpha: {
            value: 1.
          }
        };
        this.material = new THREE.ShaderMaterial({
          uniforms: this.uniforms,
          vertexShader: vertexShader,
          fragmentShader: fragmentShader,
          transparent: true,
          side: THREE.DoubleSide
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.getDimensions();
        this.mesh.position.set(this.offset.x, this.offset.y, 0);
        this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);

        this.scene.add(this.mesh);
      }

      elementToCanvas(element) {
        const canvas = document.createElement('canvas');
        const width = element.offsetWidth;
        const height = element.offsetHeight;
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        context.drawImage(element, 0, 0, width, height);
        return canvas;
      }

      render() {
        this.getDimensions();
        this.mesh.position.set(this.offset.x, this.offset.y, 0);
        this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);
      }
    }

    new EffectCanvasClass();
  }, []);

  return (
    <EffectContext.Provider value={{}}>
      {children}
    </EffectContext.Provider>
  );
};

export default EffectProvider;
