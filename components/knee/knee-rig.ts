import * as THREE from "three";

type Surface = THREE.Mesh<THREE.BufferGeometry,THREE.MeshPhysicalMaterial>;
const pivot=new THREE.Vector3(0,0.10,-0.19);
const axis=new THREE.Vector3(1,0,0);

// Convert normalized integer glTF attributes before baking transforms or deforming vertices.
export function bakeSurface(mesh: THREE.Mesh) {
  mesh.updateWorldMatrix(true,false);
  const geometry=mesh.geometry.clone();
  for(const name of ["position","normal","tangent"]) {
    const attr=geometry.getAttribute(name);
    if(!attr) continue;
    const values=new Float32Array(attr.count*attr.itemSize);
    for(let i=0;i<attr.count;i++) for(let c=0;c<attr.itemSize;c++) values[i*attr.itemSize+c]=attr.getComponent(i,c);
    geometry.setAttribute(name,new THREE.BufferAttribute(values,attr.itemSize));
  }
  geometry.applyMatrix4(mesh.matrixWorld);
  return geometry;
}

export function createKneeRig(meshes: Surface[]) {
  const root=new THREE.Group();
  root.name="knee-educational-rig";
  const lower=new THREE.Group(), patella=new THREE.Group();
  lower.name="lower-leg"; patella.name="patella-tracking";
  lower.position.copy(pivot); patella.position.copy(pivot);
  root.add(lower,patella);
  const deforming: {mesh:Surface;positions:Float32Array;normals:Float32Array;tangents?:Float32Array;weights:Float32Array}[]=[];
  for(const mesh of meshes) {
    mesh.removeFromParent();
    mesh.position.set(0,0,0); mesh.quaternion.identity(); mesh.scale.set(1,1,1); mesh.updateMatrix();
    root.add(mesh);
    if(["tibia","fibula","menisco-a","menisco-b"].includes(mesh.name)) {
      lower.add(mesh); mesh.position.copy(pivot).negate();
    } else if(mesh.name==="patela") {
      patella.add(mesh); mesh.position.copy(pivot).negate();
    } else if(mesh.name!=="femur") {
      const pos=mesh.geometry.getAttribute("position");
      const normal=mesh.geometry.getAttribute("normal");
      const tangent=mesh.geometry.getAttribute("tangent");
      const uv=mesh.geometry.getAttribute("uv");
      const weights=new Float32Array(pos.count);
      for(let i=0;i<pos.count;i++) {
        const y=pos.getY(i);
        weights[i]=mesh.userData.calf ? THREE.MathUtils.smoothstep(uv.getY(i),0,.24)
          : mesh.name==="aparelho-extensor" ? 1-THREE.MathUtils.smoothstep(y,-.5,1.1)
          : mesh.userData.muscleLayer ? 1-THREE.MathUtils.smoothstep(y,-.15,.4)
          : 1-THREE.MathUtils.smoothstep(y,-.4,.3);
      }
      (pos as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage); (normal as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage);
      if(tangent) (tangent as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage);
      deforming.push({mesh,positions:Float32Array.from(pos.array),normals:Float32Array.from(normal.array),tangents:tangent ? Float32Array.from(tangent.array) : undefined,weights});
    }
  }
  let angle=NaN;
  const q=new THREE.Quaternion(), p=new THREE.Vector3(), n=new THREE.Vector3(), t=new THREE.Vector3();
  return {
    root,
    pose: (degrees:number) => {
      const next=THREE.MathUtils.clamp(degrees,0,110);
      if(next===angle) return;
      angle=next;
      const radians=THREE.MathUtils.degToRad(next);
      lower.rotation.x=radians;
      patella.rotation.x=radians*.55;
      for(const {mesh,positions,normals,tangents,weights} of deforming) {
        const pos=mesh.geometry.getAttribute("position"), normal=mesh.geometry.getAttribute("normal"), tangent=mesh.geometry.getAttribute("tangent");
        for(let i=0;i<pos.count;i++) {
          q.setFromAxisAngle(axis,radians*weights[i]);
          p.fromArray(positions,i*3).sub(pivot).applyQuaternion(q).add(pivot); pos.setXYZ(i,p.x,p.y,p.z);
          n.fromArray(normals,i*3).applyQuaternion(q); normal.setXYZ(i,n.x,n.y,n.z);
          if(tangent && tangents) { t.fromArray(tangents,i*4).applyQuaternion(q); tangent.setXYZ(i,t.x,t.y,t.z); }
        }
        pos.needsUpdate=true; normal.needsUpdate=true; if(tangent) tangent.needsUpdate=true;
        mesh.geometry.computeBoundingBox(); mesh.geometry.computeBoundingSphere();
      }
      root.updateMatrixWorld(true);
    },
  };
}
