import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { bakeSurface, createKneeRig } from '../components/knee/knee-rig.ts';

test('baking a quantized glTF surface preserves its world-space vertex positions', () => {
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Int16BufferAttribute([0,32767,0,32767,0,0,0,0,32767],3,true));
  geometry.computeVertexNormals();
  const mesh=new THREE.Mesh(geometry,new THREE.MeshPhysicalMaterial());
  mesh.position.set(0,1.8,0); mesh.scale.setScalar(0.5);
  const baked=bakeSurface(mesh).getAttribute('position');
  assert.ok(Math.abs(baked.getY(0)-2.3)<1e-6);
  assert.ok(Math.abs(baked.getX(1)-0.5)<1e-6);
  assert.ok(Math.abs(baked.getZ(2)-0.5)<1e-6);
  assert.ok(baked.array instanceof Float32Array);
});

test('flexion keeps the femur fixed, rotates the lower leg rigidly and returns exactly to rest', () => {
  const material=new THREE.MeshPhysicalMaterial();
  const surface=name=>{const m=new THREE.Mesh(new THREE.BoxGeometry(.1,1,.1),material);m.name=name;return m;};
  const femur=surface('femur'), tibia=surface('tibia'), tendon=surface('aparelho-extensor');
  const rest=Float32Array.from(tendon.geometry.getAttribute('position').array);
  const rig=createKneeRig([femur,tibia,tendon]);
  rig.pose(0);
  const origin=new THREE.Vector3(0,-1,0), top=new THREE.Vector3(0,0,0);
  const upperRest=femur.matrixWorld.clone();
  for(const degrees of [30,60,90,110,60,0]) {
    rig.pose(degrees);
    assert.ok(femur.matrixWorld.equals(upperRest),'femur must stay fixed');
    const a=origin.clone().applyMatrix4(tibia.matrixWorld), b=top.clone().applyMatrix4(tibia.matrixWorld);
    assert.ok(Math.abs(a.distanceTo(b)-1)<1e-8,'lower leg length must remain unchanged');
    const positions=tendon.geometry.getAttribute('position').array;
    assert.ok(Array.from(positions).every(Number.isFinite),'deformed tissue must remain finite');
  }
  assert.deepEqual(Float32Array.from(tendon.geometry.getAttribute('position').array),rest,'returning to 0 must restore soft tissue without drift');
  assert.ok(origin.clone().applyMatrix4(tibia.matrixWorld).distanceTo(origin)<1e-8);
});
