import * as THREE from "three";
import { kneeParts, type KneePartId } from "@/lib/knee-anatomy";

// Each number follows a vertex on its surface, including during deformation.
const anchors: Record<KneePartId, { mesh: string; target: [number,number,number]; side: number }> = {
  meniscos: { mesh: "menisco-a", target: [.3,.02,.15], side: -1 },
  ligamentos: { mesh: "colateral-b", target: [.55,-.13,0], side: 1 },
  patela: { mesh: "patela", target: [0,.27,.56], side: -1 },
  tendoes: { mesh: "aparelho-extensor", target: [0,.73,.55], side: 1 },
  femur: { mesh: "femur", target: [-.3,.4,.22], side: -1 },
  tibia: { mesh: "tibia", target: [.05,-.57,.2], side: 1 },
  fibula: { mesh: "fibula", target: [-.45,-.88,-.2], side: -1 },
  musculos: { mesh: "musculo-quadriceps-lateral", target: [-.48,1.05,.35], side: 1 },
};

export function createKneeMarkers(host: HTMLElement, meshes: THREE.Mesh[], onSelect: (id: KneePartId) => void) {
  const overlay=document.createElement("div");
  overlay.className="knee-markers";
  overlay.setAttribute("role","group");
  overlay.setAttribute("aria-label","Números das estruturas do joelho");
  const namespace="http://www.w3.org/2000/svg";
  const svg=document.createElementNS(namespace,"svg");
  svg.setAttribute("aria-hidden","true");
  overlay.appendChild(svg);
  const entries=kneeParts.flatMap(part=>{
    const anchor=anchors[part.id];
    const mesh=meshes.find(m=>m.name===anchor.mesh);
    if(!mesh) return [];
    const target=new THREE.Vector3(...anchor.target), position=new THREE.Vector3();
    const attribute=mesh.geometry.getAttribute("position");
    let closest=Infinity, index=0;
    for(let i=0;i<attribute.count;i++) {
      position.fromBufferAttribute(attribute,i);
      const distance=position.distanceToSquared(target);
      if(distance<closest) { closest=distance; index=i; }
    }
    const line=document.createElementNS(namespace,"line");
    line.setAttribute("class","knee-marker-line");
    svg.appendChild(line);
    const button=document.createElement("button");
    button.type="button"; button.className="knee-marker";
    button.dataset.part=part.id;
    button.setAttribute("aria-label",`Estrutura ${part.number}: ${part.name}`);
    button.setAttribute("aria-controls","knee-detail");
    button.title=`${part.number} · ${part.name}`;
    button.style.setProperty("--marker-color",part.color);
    const number=document.createElement("span");
    number.textContent=part.number;
    button.appendChild(number);
    const click=()=>onSelect(part.id);
    button.addEventListener("click",click);
    overlay.appendChild(button);
    return [{part,mesh,index,side:anchor.side,button,line,click,x:0,y:0,ax:0,ay:0,visible:false}];
  });
  host.appendChild(overlay);
  const point=new THREE.Vector3();
  return {
    update: (camera: THREE.Camera, selected: KneePartId | null) => {
      const width=host.clientWidth, height=host.clientHeight;
      for(const entry of entries) {
        point.fromBufferAttribute(entry.mesh.geometry.getAttribute("position"),entry.index).applyMatrix4(entry.mesh.matrixWorld).project(camera);
        entry.visible=entry.mesh.visible && point.z>-1 && point.z<1 && Math.abs(point.x)<1.02 && Math.abs(point.y)<1.02;
        entry.button.hidden=!entry.visible;
        entry.line.style.display=entry.visible ? "" : "none";
        if(!entry.visible) continue;
        entry.ax=(point.x*.5+.5)*width; entry.ay=(-point.y*.5+.5)*height;
        entry.x=THREE.MathUtils.clamp(entry.ax+entry.side*34,23,width-23);
        entry.y=THREE.MathUtils.clamp(entry.ay,23,height-23);
        // Keep the upper-right camera controls and upper-left legend available.
        if(entry.y<175 && entry.x>width-155) entry.x=Math.max(23,width-170);
        if(width>430 && entry.y<90 && entry.x<85) entry.x=100;
        entry.button.setAttribute("aria-pressed",String(entry.part.id===selected));
      }
      const visible=entries.filter(e=>e.visible);
      for(let pass=0;pass<5;pass++) for(let i=0;i<visible.length;i++) for(let j=i+1;j<visible.length;j++) {
        const a=visible[i],b=visible[j];
        if(Math.abs(a.x-b.x)>43) continue;
        const gap=b.y-a.y;
        if(Math.abs(gap)>=43) continue;
        const direction=gap>=0 ? 1 : -1, push=(43-Math.abs(gap))*.5;
        a.y=THREE.MathUtils.clamp(a.y-direction*push,23,height-23);
        b.y=THREE.MathUtils.clamp(b.y+direction*push,23,height-23);
      }
      for(const entry of visible) {
        entry.button.style.transform=`translate(${entry.x-22}px,${entry.y-22}px)`;
        entry.line.setAttribute("x1",String(entry.ax)); entry.line.setAttribute("y1",String(entry.ay));
        entry.line.setAttribute("x2",String(entry.x)); entry.line.setAttribute("y2",String(entry.y));
      }
    },
    dispose: () => { entries.forEach(e=>e.button.removeEventListener("click",e.click)); overlay.remove(); },
  };
}
