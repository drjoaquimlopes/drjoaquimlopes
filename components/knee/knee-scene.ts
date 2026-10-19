import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { defaultKneeLayers, kneeLayerForPart, kneeParts, type KneeLayerState, type KneePartId } from "@/lib/knee-anatomy";
import { createMuscleLayer } from "./knee-muscles";
import { bakeSurface, createKneeRig } from "./knee-rig";
import { createKneeMarkers } from "./knee-markers";

export type KneeView = "front" | "side" | "back";
export type KneeViewer = {
  select: (id: KneePartId) => void;
  inside: (value: boolean) => void;
  view: (view: KneeView) => void;
  zoom: (direction: number) => void;
  frame: (detail: boolean) => void;
  layers: (state: KneeLayerState) => void;
  spotlight: (enabled: boolean) => void;
  flex: (degrees: number) => void;
  dispose: () => void;
};

export function createKneeViewer(host: HTMLDivElement, onSelect: (id: KneePartId) => void, onReady: () => void, onError: () => void): KneeViewer {
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  const environment = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const studio = pmrem.fromScene(environment, 0.04);
  scene.environment = studio.texture;
  scene.environmentIntensity = 0.4;
  environment.dispose();
  pmrem.dispose();
  renderer.domElement.setAttribute("aria-label", "Modelo 3D do joelho. Arraste para girar; selecione uma estrutura para saber mais.");
  renderer.domElement.setAttribute("role", "img");
  host.appendChild(renderer.domElement);
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0.04, 0);
  controls.enablePan = false;
  controls.enableZoom = false; // The wheel continues to scroll the page, including on mobile.
  controls.minPolarAngle = 0.4;
  controls.maxPolarAngle = Math.PI - 0.4;
  controls.rotateSpeed = 0.7;
  controls.touches.ONE = THREE.TOUCH.ROTATE;
  renderer.domElement.style.touchAction = "pan-y";
  const ambient = new THREE.HemisphereLight(0xfff7eb, 0x647d86, 0.3);
  scene.add(ambient);
  const key = new THREE.DirectionalLight(0xfff2e5, 2.4);
  key.position.set(-3, 4, 5);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xcbdfea, 0.5);
  fill.position.set(4, 1, 3); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xeaf7fa, 1.8);
  rim.position.set(2, 3, -4); scene.add(rim);
  // A diffuse studio contact shadow anchors the cut specimen without a hard directional cast.
  const contact = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.8), new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    vertexShader: "varying vec2 shadowUv; void main(){shadowUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",
    fragmentShader: "varying vec2 shadowUv; void main(){float d=length((shadowUv-.5)*2.0);float a=exp(-d*d*6.0)*(1.0-smoothstep(.65,1.0,d))*.15;gl_FragColor=vec4(.24,.29,.26,a);}",
  }));
  contact.rotation.x = -Math.PI / 2;
  contact.position.y = -2.035;
  scene.add(contact);
  let disposed = false;
  let selected: KneePartId = "meniscos";
  let inside = false;
  let detail = true;
  let layers = { ...defaultKneeLayers };
  let spotlight = false;
  let flexion = 0;
  let rig: ReturnType<typeof createKneeRig> | undefined;
  const meshes: THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>[] = [];
  const outlines = new Map<THREE.Mesh, THREE.Mesh>();
  let markers: ReturnType<typeof createKneeMarkers> | undefined;
  // Multiple state effects and OrbitControls changes can arrive in the same frame.
  // Draw their final state once rather than repeating expensive WebGL work.
  let renderFrame = 0;
  const render = () => {
    if (disposed || renderFrame) return;
    renderFrame = requestAnimationFrame(() => {
      renderFrame = 0;
      if (disposed) return;
      renderer.render(scene, camera);
      markers?.update(camera, spotlight ? selected : null);
    });
  };
  controls.addEventListener("change", render);
  const resize = () => {
    const width = host.clientWidth, height = host.clientHeight;
    if (!width || !height || disposed) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    render();
  };
  const observer = new ResizeObserver(resize); observer.observe(host);
  const framingDistance = () => detail ? (host.clientWidth < 430 ? 5.1 : 4.6) : (host.clientWidth < 430 ? 7.6 : 6.9);
  const view = (name: KneeView) => {
    const direction = name === "side" ? new THREE.Vector3(1, 0.065, 0) : name === "back" ? new THREE.Vector3(-0.08, 0.065, -1) : new THREE.Vector3(0.165, 0.065, 1);
    camera.position.copy(controls.target).addScaledVector(direction.normalize(), framingDistance());
    controls.update(); render();
  };
  view("front"); resize();
  const updateMaterials = () => {
    const part = kneeParts.find(p => p.id === selected)!;
    for (const mesh of meshes) {
      const active = spotlight && (part.meshes as readonly string[]).includes(mesh.name);
      const muscle = !!mesh.userData.muscleLayer;
      const meshPart = kneeParts.find(p => (p.meshes as readonly string[]).includes(mesh.name));
      mesh.visible = !!meshPart && layers[kneeLayerForPart(meshPart.id)];
      const occludes = ["femur", "tibia", "patela", "aparelho-extensor"].includes(mesh.name);
      const faded = spotlight && !active;
      const transparent = faded || (inside && (occludes || muscle) && !active);
      mesh.material.color.copy(mesh.userData.naturalColor);
      if (faded) mesh.material.color.lerp(new THREE.Color("#bec8c3"), 0.55);
      if (active) mesh.material.color.lerp(new THREE.Color(part.color), 0.13);
      mesh.material.emissive.set(active ? part.color : "#000000");
      mesh.material.emissiveIntensity = active ? 0.045 : 0;
      mesh.material.transparent = transparent;
      mesh.material.opacity = faded ? (muscle ? 0.035 : 0.12) : transparent ? (muscle ? 0.08 : mesh.name === "aparelho-extensor" ? 0.07 : 0.17) : 1;
      mesh.material.depthWrite = !transparent;
      mesh.renderOrder = transparent ? 1 : 0;
      const outline = outlines.get(mesh);
      if (outline) { outline.visible = active; (outline.material as THREE.MeshBasicMaterial).color.set(part.color); }
      mesh.material.needsUpdate = true;
    }
    render();
  };
  new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load("/models/knee/knee.glb", gltf => {
    if (disposed) { disposeObject(gltf.scene); return; }
    gltf.scene.traverse(object => {
      if (!(object instanceof THREE.Mesh)) return;
      const source = object.material as THREE.MeshStandardMaterial;
      const material = createNaturalMaterial(source);
      const previousGeometry = object.geometry;
      object.geometry = bakeSurface(object);
      previousGeometry.dispose();
      object.material = material;
      object.userData.naturalColor = material.color.clone();
      meshes.push(object as THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>);
    });
    for (const muscle of createMuscleLayer()) {
      muscle.userData.naturalColor = muscle.material.color.clone();
      meshes.push(muscle);
    }
    rig = createKneeRig(meshes);
    scene.add(rig.root);
    markers=createKneeMarkers(host,meshes,onSelect);
    rig.pose(flexion);
    // A restrained silhouette marks selection without replacing the tissue's natural color.
    for (const mesh of meshes) {
      const outline = new THREE.Mesh(mesh.geometry, new THREE.MeshBasicMaterial({ color: 0x3e9184, side: THREE.BackSide, transparent: true, opacity: 0.65, depthWrite: false }));
      outline.name = "selection-outline";
      outline.scale.setScalar(1.014);
      outline.visible = false;
      mesh.add(outline);
      outlines.set(mesh, outline);
    }
    updateMaterials(); onReady();
  }, undefined, () => { if (!disposed) onError(); });
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let down = { x: 0, y: 0 };
  const pointerdown = (event: PointerEvent) => { down = { x: event.clientX, y: event.clientY }; };
  const intersect = (event: PointerEvent) => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set(((event.clientX-rect.left)/rect.width)*2-1, -((event.clientY-rect.top)/rect.height)*2+1);
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(meshes.filter(mesh => mesh.visible), false);
    return hits.find(hit => (hit.object as typeof meshes[number]).material.opacity > 0.3) ?? hits.find(hit => (hit.object as typeof meshes[number]).material.opacity > 0.02);
  };
  const pointerup = (event: PointerEvent) => {
    if (Math.hypot(event.clientX-down.x,event.clientY-down.y)>6) return;
    const hit = intersect(event);
    const part = hit && kneeParts.find(p => (p.meshes as readonly string[]).includes(hit.object.name));
    if (part) onSelect(part.id);
  };
  let hoverFrame = 0;
  const pointermove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" || event.buttons || hoverFrame) return;
    hoverFrame = requestAnimationFrame(() => {
      hoverFrame = 0;
      if (!disposed) renderer.domElement.style.cursor = intersect(event) ? "pointer" : "grab";
    });
  };
  const contextLost = (event: Event) => { event.preventDefault(); onError(); };
  renderer.domElement.addEventListener("pointerdown", pointerdown);
  renderer.domElement.addEventListener("pointerup", pointerup);
  renderer.domElement.addEventListener("pointermove", pointermove);
  renderer.domElement.addEventListener("webglcontextlost", contextLost);
  return {
    select: id => { selected = id; updateMaterials(); },
    inside: value => { inside = value; updateMaterials(); },
    view,
    zoom: direction => {
      const offset = camera.position.clone().sub(controls.target);
      offset.setLength(THREE.MathUtils.clamp(offset.length() * (direction > 0 ? 0.85 : 1.18), 3.3, 11));
      camera.position.copy(controls.target).add(offset); controls.update(); render();
    },
    frame: value => {
      detail = value;
      const direction = camera.position.clone().sub(controls.target).normalize();
      camera.position.copy(controls.target).addScaledVector(direction, framingDistance());
      controls.update(); render();
    },
    layers: value => { layers = { ...value }; updateMaterials(); },
    spotlight: value => { spotlight = value; updateMaterials(); },
    flex: degrees => { flexion = THREE.MathUtils.clamp(degrees, 0, 110); rig?.pose(flexion); contact.visible = flexion < 5; render(); },
    dispose: () => {
      disposed = true; observer.disconnect(); controls.dispose();
      cancelAnimationFrame(renderFrame); cancelAnimationFrame(hoverFrame);
      renderer.domElement.removeEventListener("pointerdown", pointerdown);
      renderer.domElement.removeEventListener("pointerup", pointerup);
      renderer.domElement.removeEventListener("pointermove", pointermove);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      markers?.dispose(); disposeObject(scene); studio.dispose(); renderer.dispose(); renderer.domElement.remove();
    },
  };
}

function createNaturalMaterial(source: THREE.MeshStandardMaterial) {
  const bone = source.name === "cortical" || source.name === "patella";
  const meniscus = source.name === "meniscus";
  const tendon = source.name === "tendon";
  const material = new THREE.MeshPhysicalMaterial({
    name: source.name,
    map: source.map, normalMap: source.normalMap, normalScale: source.normalScale.clone(),
    aoMap: source.aoMap, aoMapIntensity: source.aoMapIntensity,
    roughnessMap: source.roughnessMap, roughness: source.roughness,
    metalness: 0, envMapIntensity: 0.8,
    color: bone ? "#e9d6b5" : meniscus ? "#b3c7ca" : tendon ? "#f0dfc5" : "#e8d3ac",
    clearcoat: meniscus ? 0.22 : bone ? 0 : 0.08,
    clearcoatRoughness: meniscus ? 0.35 : 0.6,
    sheen: bone ? 0 : 0.16,
    sheenColor: new THREE.Color(tendon ? "#f5eee5" : "#edd9d0"),
    sheenRoughness: 0.75,
  });
  if (bone || tendon) {
    // The source albedo has painted polygon boundaries. Retain subtle variation and add fine,
    // object-anchored surface detail so those painted facets do not overpower the smooth geometry.
    material.onBeforeCompile = shader => {
      shader.vertexShader = shader.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 kneeSurface;").replace("#include <begin_vertex>", "#include <begin_vertex>\nkneeSurface = position;");
      shader.fragmentShader = shader.fragmentShader.replace("#include <common>", `
        #include <common>
        varying vec3 kneeSurface;
        float kneeHash(vec3 p) { p=fract(p*0.3183099+vec3(.13,.37,.71)); p*=17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
        float kneeNoise(vec3 p) {
          vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
          return mix(mix(mix(kneeHash(i),kneeHash(i+vec3(1,0,0)),f.x),mix(kneeHash(i+vec3(0,1,0)),kneeHash(i+vec3(1,1,0)),f.x),f.y),mix(mix(kneeHash(i+vec3(0,0,1)),kneeHash(i+vec3(1,0,1)),f.x),mix(kneeHash(i+vec3(0,1,1)),kneeHash(i+vec3(1,1,1)),f.x),f.y),f.z);
        }
      `);
      shader.fragmentShader = shader.fragmentShader.replace("#include <map_fragment>", bone ? `
        #include <map_fragment>
        float corticalLuma = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
        float corticalVariation = kneeNoise(kneeSurface*12.0);
        float corticalGrain = kneeNoise(kneeSurface*185.0);
        diffuseColor.rgb = diffuse * (0.92+0.08*sqrt(corticalLuma)) * (0.925+0.12*corticalVariation);
        diffuseColor.rgb *= 0.96+0.08*corticalGrain;
      ` : `
        #include <map_fragment>
        float tendonLuma = dot(diffuseColor.rgb,vec3(.2126,.7152,.0722));
        float tendonFiber = .5+.5*sin((kneeSurface.x*240.0+kneeSurface.z*160.0)*6.28318+kneeNoise(kneeSurface*18.0)*1.5);
        diffuseColor.rgb = diffuse*(.89+.1*sqrt(tendonLuma))*(.95+.065*tendonFiber);
      `);
      shader.fragmentShader = shader.fragmentShader.replace("#include <normal_fragment_maps>", bone ? `
        #include <normal_fragment_maps>
        float corticalHeight = kneeNoise(kneeSurface*185.0)*0.00035;
        vec3 corticalDx = dFdx(-vViewPosition), corticalDy = dFdy(-vViewPosition);
        vec3 corticalR1 = cross(corticalDy,normal), corticalR2 = cross(normal,corticalDx);
        float corticalDet = dot(corticalDx,corticalR1);
        vec3 corticalGrad = sign(corticalDet)*(dFdx(corticalHeight)*corticalR1+dFdy(corticalHeight)*corticalR2);
        normal = normalize(abs(corticalDet)*normal-corticalGrad);
      ` : `
        #include <normal_fragment_maps>
        float tendonHeight = sin((kneeSurface.x*240.0+kneeSurface.z*160.0)*6.28318+kneeNoise(kneeSurface*18.0)*1.5)*.000035;
        vec3 tendonDx=dFdx(-vViewPosition), tendonDy=dFdy(-vViewPosition);
        vec3 tendonR1=cross(tendonDy,normal), tendonR2=cross(normal,tendonDx);
        float tendonDet=dot(tendonDx,tendonR1);
        normal=normalize(abs(tendonDet)*normal-sign(tendonDet)*(dFdx(tendonHeight)*tendonR1+dFdy(tendonHeight)*tendonR2));
      `);
    };
    material.customProgramCacheKey = () => bone ? "knee-cortical-ivory-v4" : "knee-tendon-fibers-v1";
  }
  return material;
}

function disposeObject(root: THREE.Object3D) {
  const textures = new Set<THREE.Texture>();
  root.traverse(object => {
    if (!(object instanceof THREE.Mesh)) return;
    object.geometry.dispose();
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of materials) {
      for (const value of Object.values(material)) if (value instanceof THREE.Texture) textures.add(value);
      material.dispose();
    }
  });
  textures.forEach(texture => texture.dispose());
}
