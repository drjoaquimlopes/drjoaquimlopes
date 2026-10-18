import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { splitSurfaces } from './knee-components.mjs';
import { LoopSubdivision } from 'three-subdivide';
import * as MikkTSpace from 'three/addons/libs/mikktspace.module.js';
import { computeMikkTSpaceTangents, toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js';

const require = createRequire(import.meta.url);
const cliRequire = createRequire(require.resolve('@gltf-transform/cli'));
const { NodeIO } = cliRequire('@gltf-transform/core');
const { ALL_EXTENSIONS } = cliRequire('@gltf-transform/extensions');
const { dedup, prune, weld, meshopt } = cliRequire('@gltf-transform/functions');
const { MeshoptEncoder } = cliRequire('meshoptimizer');
const sharp = cliRequire('sharp');
globalThis.window = { URL: globalThis.URL };
globalThis.FileReader = class {
  readAsArrayBuffer(blob) { blob.arrayBuffer().then(v=>{this.result=v;this.onloadend?.();}); }
  readAsDataURL(blob) { blob.arrayBuffer().then(v=>{this.result=`data:${blob.type};base64,${Buffer.from(v).toString('base64')}`;this.onloadend?.();}); }
};
THREE.TextureLoader.prototype.load = () => new THREE.Texture();
const source = process.argv[2] || '../knee-source';
const bytes = await fs.readFile(path.join(source,'source/Knee Anatomy.fbx'));
const original = new FBXLoader().parse(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
original.updateMatrixWorld(true);
const scene = new THREE.Group();
await MikkTSpace.ready;
await MeshoptEncoder.ready;
const profiles = {
  cortical: { source: 'bone', roughness: 0.9, normal: 0.45, occlusion: 0.4, subdivisions: 2 },
  patella: { source: 'mash', roughness: 0.86, normal: 0.4, occlusion: 0.35, subdivisions: 2 },
  meniscus: { source: 'mash', roughness: 0.55, normal: 0.38, occlusion: 0.45, subdivisions: 2 },
  ligament: { source: 'mash', roughness: 0.82, normal: 0.8, occlusion: 0.4, subdivisions: 1 },
  tendon: { source: 'Opacyty', roughness: 0.78, normal: 0.9, occlusion: 0.38, subdivisions: 2 },
};
const names = {
  Bone_Low_0:'femur', Bone_Low_1:'tibia', Bone_Low_2:'fibula',
  Mash_Low_2:'menisco-a', Mash_Low_3:'menisco-b', Mash_Low_4:'patela',
  Mash_Low_0:'colateral-a', Mash_Low_1:'colateral-b',
  Mash_Low_5:'interno-a', Mash_Low_6:'interno-b', Mash_Low_8:'interno-c', Mash_Low_7:'interno-d',
  Transparenty_Low_0:'aparelho-extensor',
};
original.traverse(mesh=>{
  if(!mesh.isMesh) return;
  for(const part of splitSurfaces(mesh)) {
    const sourceName=part.name;
    part.name=names[sourceName] || sourceName;
    part.userData={sourceSurface:sourceName};
    const profileName = mesh.name === 'Bone_Low' ? 'cortical' : part.name === 'patela' ? 'patella' : part.name.startsWith('menisco') ? 'meniscus' : part.name === 'aparelho-extensor' ? 'tendon' : 'ligament';
    const profile = profiles[profileName];
    const lowPoly = part.geometry;
    part.geometry = LoopSubdivision.modify(lowPoly,profile.subdivisions,{split:false,uvSmooth:false,preserveEdges:true});
    lowPoly.dispose();
    // Normalize the asset upstream: metres are unnecessary here; longest side is 4 scene units.
    part.geometry.translate(0.232, -6.99, 0.139);
    part.geometry.rotateY(-Math.PI/2);
    part.geometry.scale(4/14.98,4/14.98,4/14.98);
    // Average normals by position across UV seams, while keeping the cut bone ends crisp.
    part.geometry = toCreasedNormals(part.geometry, Math.PI * 0.42);
    computeMikkTSpaceTangents(part.geometry,MikkTSpace);
    const material = new THREE.MeshStandardMaterial({name:profileName, color:0xffffff, roughness:profile.roughness, metalness:0});
    part.material=material;
    scene.add(part);
  }
});
const binary = await new GLTFExporter().parseAsync(scene,{binary:true});
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.encoder':MeshoptEncoder});
const document = await io.readBinary(new Uint8Array(binary));
const { EXTTextureWebP } = cliRequire('@gltf-transform/extensions');
document.createExtension(EXTTextureWebP).setRequired(true);
const textures = new Map();
for (const prefix of ['bone','mash','Opacyty']) {
  const baseSize = prefix === 'bone' ? 1536 : 1024;
  const img=await sharp(path.join(source,'textures',`${prefix}_Base_color.png`)).resize(baseSize,baseSize).webp({quality:92}).toBuffer();
  const base=document.createTexture(`${prefix}-base`).setImage(img).setMimeType('image/webp');
  const normal=await sharp(path.join(source,'textures',`${prefix}_Normal_OpenGL.png`)).resize(1536,1536).webp({quality:95}).toBuffer();
  const normalTexture=document.createTexture(`${prefix}-normal`).setImage(normal).setMimeType('image/webp');
  // Pack the original data maps into standard glTF ORM channels (R = AO, G = roughness, B = metalness).
  const size=1024;
  const ao=await sharp(path.join(source,'textures',`${prefix}_Mixed_AO.png`)).resize(size,size).toColourspace('b-w').raw().toBuffer();
  const rough=await sharp(path.join(source,'textures',`${prefix}_Roughness.png`)).resize(size,size).toColourspace('b-w').raw().toBuffer();
  const orm=Buffer.alloc(size*size*3);
  for(let i=0;i<size*size;i++) { orm[i*3]=ao[i]; orm[i*3+1]=rough[i]; orm[i*3+2]=0; }
  const packed=await sharp(orm,{raw:{width:size,height:size,channels:3}}).webp({quality:90}).toBuffer();
  const data=document.createTexture(`${prefix}-orm`).setImage(packed).setMimeType('image/webp');
  textures.set(prefix,{base,normal:normalTexture,data});
}
for(const material of document.getRoot().listMaterials()) {
  const profile=profiles[material.getName()];
  const maps=textures.get(profile.source);
  material.setBaseColorTexture(maps.base).setNormalTexture(maps.normal).setNormalScale(profile.normal);
  material.setOcclusionTexture(maps.data).setOcclusionStrength(profile.occlusion);
  material.setMetallicRoughnessTexture(maps.data).setMetallicFactor(0).setRoughnessFactor(profile.roughness);
}
await document.transform(weld(),dedup(),meshopt({encoder:MeshoptEncoder,level:'medium',quantizePosition:14,quantizeNormal:10,quantizeTexcoord:12}),prune());
await fs.mkdir('public/models/knee',{recursive:true});
await io.write('public/models/knee/knee.glb',document);
console.log(JSON.stringify({bytes:(await fs.stat('public/models/knee/knee.glb')).size,nodes:document.getRoot().listNodes().map(n=>n.getName()),vertices:scene.children.reduce((n,m)=>n+m.geometry.attributes.position.count,0)},null,2));
