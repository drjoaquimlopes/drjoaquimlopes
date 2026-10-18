import fs from 'node:fs';
import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { splitSurfaces } from './knee-components.mjs';

globalThis.window = { URL: globalThis.URL };
THREE.TextureLoader.prototype.load = function (url) { const t = new THREE.Texture(); t.name = String(url); return t; };
const bytes = fs.readFileSync('../knee-source/source/Knee Anatomy.fbx');
const model = new FBXLoader().parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '../knee-source/textures/');
model.updateMatrixWorld(true);
model.traverse(o => {
  if (!o.isMesh) return;
  const box = new THREE.Box3().setFromObject(o);
  console.log(JSON.stringify({ name:o.name, vertices:o.geometry.attributes.position.count, groups:o.geometry.groups, materials:(Array.isArray(o.material)?o.material:[o.material]).map(m=>({name:m.name,color:m.color.getHexString(),opacity:m.opacity,map:m.map?.name})),min:box.min.toArray(),max:box.max.toArray() }));
  for (const part of splitSurfaces(o)) {
    const b=new THREE.Box3().setFromObject(part);
    console.log(JSON.stringify({part:part.name,vertices:part.geometry.attributes.position.count,min:b.min.toArray().map(n=>+n.toFixed(3)),max:b.max.toArray().map(n=>+n.toFixed(3))}));
  }
});
