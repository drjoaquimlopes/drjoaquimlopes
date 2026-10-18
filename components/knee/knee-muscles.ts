import * as THREE from "three";

type MuscleShape = { name: string; points: number[][]; width: number; depth: number; calf?: boolean };

// Original, schematic muscle volumes. The central anterior joint stays exposed for exploration.
// These provide anatomical context; they are not segmented patient anatomy.
const shapes: MuscleShape[] = [
  { name: "musculo-quadriceps-central", width: 0.28, depth: 0.18, points: [[0,2.65,.35],[.03,1.9,.55],[.05,1.05,.62],[.04,.62,.56]] },
  { name: "musculo-quadriceps-lateral", width: 0.33, depth: 0.25, points: [[-.4,2.6,.05],[-.55,1.55,.22],[-.5,.85,.36],[-.28,.45,.43]] },
  { name: "musculo-quadriceps-medial", width: 0.29, depth: 0.22, points: [[.3,2.25,.03],[.5,1.45,.19],[.44,.72,.34],[.24,.38,.44]] },
  { name: "musculo-posterior-a", width: 0.22, depth: 0.2, points: [[-.33,2.55,-.42],[-.5,1.5,-.55],[-.49,.65,-.52],[-.43,.1,-.3]] },
  { name: "musculo-posterior-b", width: 0.23, depth: 0.2, points: [[.33,2.55,-.42],[.47,1.5,-.58],[.45,.65,-.54],[.39,.12,-.29]] },
  { name: "musculo-panturrilha-a", width: 0.28, depth: 0.26, calf: true, points: [[-.28,.08,-.44],[-.38,-.55,-.58],[-.3,-1.2,-.47],[-.15,-2.1,-.27]] },
  { name: "musculo-panturrilha-b", width: 0.3, depth: 0.27, calf: true, points: [[.28,.08,-.44],[.39,-.52,-.6],[.3,-1.2,-.47],[.16,-2.1,-.27]] },
];

export function createMuscleLayer() {
  return shapes.map((shape, index) => {
    const curve = new THREE.CatmullRomCurve3(shape.points.map(p => new THREE.Vector3(...p)), false, "centripetal");
    const rows = 48, columns = 32;
    const positions: number[] = [], uvs: number[] = [], colors: number[] = [], indices: number[] = [];
    const axis = new THREE.Vector3(1,0,0);
    for (let row=0; row<=rows; row++) {
      const t=row/rows;
      const center=curve.getPoint(t), tangent=curve.getTangent(t).normalize();
      const side=axis.clone().addScaledVector(tangent,-axis.dot(tangent)).normalize();
      const front=new THREE.Vector3().crossVectors(tangent,side).normalize();
      const belly=Math.pow(Math.sin(Math.PI*t),0.65) * (1.1-0.3*t);
      const radius=Math.max(0.025,belly);
      // A short pale transition at the ends suggests connective tissue without adding separate anatomy.
      const attachment=1-THREE.MathUtils.smoothstep(t,0.01,0.13)+THREE.MathUtils.smoothstep(t,0.86,0.99);
      const tint=new THREE.Color("#ffffff").lerp(new THREE.Color("#efd4b4"),Math.min(attachment,1)*0.7);
      for (let col=0; col<=columns; col++) {
        const theta=col/columns*Math.PI*2;
        const p=center.clone().addScaledVector(side,Math.cos(theta)*shape.width*radius).addScaledVector(front,Math.sin(theta)*shape.depth*radius);
        positions.push(p.x,p.y,p.z); uvs.push(col/columns,t); colors.push(tint.r,tint.g,tint.b);
        if(row<rows && col<columns) { const a=row*(columns+1)+col, b=a+columns+1; indices.push(a,a+1,b,b,a+1,b+1); }
      }
    }
    const geometry=new THREE.BufferGeometry();
    geometry.setAttribute("position",new THREE.Float32BufferAttribute(positions,3));
    geometry.setAttribute("uv",new THREE.Float32BufferAttribute(uvs,2));
    geometry.setAttribute("color",new THREE.Float32BufferAttribute(colors,3));
    geometry.setIndex(indices); geometry.computeVertexNormals();
    const material=createMuscleMaterial(index);
    const mesh=new THREE.Mesh(geometry,material);
    mesh.name=shape.name;
    mesh.userData.muscleLayer=true;
    mesh.userData.calf=!!shape.calf;
    return mesh;
  });
}

function createMuscleMaterial(index: number) {
  const material=new THREE.MeshPhysicalMaterial({
    name:"muscle",color:index%2 ? "#a04b46" : "#a9504b",roughness:0.67,metalness:0,
    vertexColors:true,envMapIntensity:0.6,sheen:0.22,sheenColor:new THREE.Color("#dfa39a"),sheenRoughness:0.7,
    clearcoat:0.025,clearcoatRoughness:0.65,
  });
  material.onBeforeCompile=shader=>{
    shader.vertexShader=shader.vertexShader.replace("#include <common>","#include <common>\nvarying vec2 muscleUv;").replace("#include <begin_vertex>","#include <begin_vertex>\nmuscleUv=uv;");
    shader.fragmentShader=shader.fragmentShader.replace("#include <common>","#include <common>\nvarying vec2 muscleUv;");
    shader.fragmentShader=shader.fragmentShader.replace("#include <color_fragment>",`
      #include <color_fragment>
      float bundlePhase=muscleUv.x*142.0+sin(muscleUv.y*12.0)*1.3;
      float fiberPhase=muscleUv.x*530.0+sin(muscleUv.y*21.0)*1.2;
      float fiberAA=1.0-smoothstep(1.2,4.0,fwidth(fiberPhase));
      float fibers=mix(.5,.5+.5*sin(fiberPhase),fiberAA);
      float bundles=.5+.5*cos(bundlePhase);
      float nuance=sin(muscleUv.x*38.0+sin(muscleUv.y*12.0))*sin(muscleUv.y*19.0+muscleUv.x*11.0);
      diffuseColor.rgb *= (.89+.055*bundles+.065*fibers)*(1.0+.035*nuance);
      float attachment=1.0-smoothstep(.01,.13,muscleUv.y)+smoothstep(.86,.99,muscleUv.y);
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.76,.66,.53),clamp(attachment,0.0,1.0)*.5);
    `);
  };
  material.customProgramCacheKey=()=>"knee-muscle-fibers-v1";
  return material;
}
