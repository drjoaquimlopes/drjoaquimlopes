import * as THREE from 'three';

// FBX has one mesh per material. Weld position seams to recover its disconnected anatomical surfaces.
export function splitSurfaces(mesh) {
  const geo = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry;
  const pos = geo.attributes.position;
  const parent = Array.from({length:pos.count},(_,i)=>i);
  const find = i => parent[i] === i ? i : (parent[i]=find(parent[i]));
  const join = (a,b) => { parent[find(a)]=find(b); };
  const seen = new Map();
  for (let i=0;i<pos.count;i++) {
    const key = [pos.getX(i),pos.getY(i),pos.getZ(i)].map(v=>Math.round(v*10000)).join(',');
    if(seen.has(key)) join(i,seen.get(key)); else seen.set(key,i);
    if(i%3!==0) join(i,i-i%3);
  }
  const groups = new Map();
  for(let i=0;i<pos.count;i++) { const key=find(i); if(!groups.has(key)) groups.set(key,[]); groups.get(key).push(i); }
  return [...groups.values()].map((indices,i)=>{
    const g=new THREE.BufferGeometry();
    for(const [name,attr] of Object.entries(geo.attributes)) {
      const data=new Float32Array(indices.length*attr.itemSize);
      indices.forEach((j,k)=>{ for(let c=0;c<attr.itemSize;c++) data[k*attr.itemSize+c]=attr.array[j*attr.itemSize+c]; });
      g.setAttribute(name,new THREE.BufferAttribute(data,attr.itemSize));
    }
    g.applyMatrix4(mesh.matrixWorld);
    const part=new THREE.Mesh(g,mesh.material.clone()); part.name=`${mesh.name}_${i}`;
    return part;
  }).sort((a,b)=>b.geometry.attributes.position.count-a.geometry.attributes.position.count);
}
