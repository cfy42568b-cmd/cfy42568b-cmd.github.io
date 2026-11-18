import * as T from './vendor/three.module.js';
const loader=new T.TextureLoader();
const leaves=Array.from({length:6},(_,n)=>{const map=loader.load(new URL('./leaves/ivy-'+n+'.webp',import.meta.url).href);map.colorSpace=T.SRGBColorSpace;map.anisotropy=4;return new T.MeshStandardMaterial({map,alphaTest:.48,side:T.DoubleSide,roughness:.8,metalness:0,color:'#f3f0de'})});
function folded(curl,asym){let p=[],uv=[],idx=[];for(let y=0;y<=8;y++)for(let x=0;x<=8;x++){let t=y/8,u=x/8,s=(u-.5)*2,depth=.13*Math.sin(t*Math.PI)-.08*s*s*Math.sin(t*Math.PI)+curl*t*t+asym*s*t;p.push((u-.5)*.92+asym*t*t,-t,depth);uv.push(u,t);if(x&&y){let k=y*9+x;idx.push(k-10,k-1,k-9,k-9,k-1,k)}}let g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g}
const shapes=[folded(.11,.035),folded(-.08,-.047),folded(.036,.018)];
export function climbers({add,rod,rr,R,pick,shape}){
 const disc=new T.SphereGeometry(1,8,6);
 function leaf(x,y,z,scale,age,azimuth,lean){let stage=age<.2?3:age>.91?pick([4,4,5]):pick([0,1,2]);let o=add(pick(shapes),leaves[stage],x,y,z,scale,scale,scale,rr(-.34,.27),azimuth,lean);o.rotation.order='YXZ'}
 function grow(points,count,r,age=1,normal=0){let curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),last=curve.getPoint(0),forward=new T.Vector3(Math.sin(normal),0,Math.cos(normal)),lateral=new T.Vector3(Math.cos(normal),0,-Math.sin(normal));for(let i=1;i<=count;i++){
 let t=i/count,node=curve.getPointAt(t);rod(last.toArray(),node.toArray(),r*(1-.65*t),t>.76?'#76794c':'#77664c');last=node;let side=i%2?1:-1;
 if(i%4===1&&age>.7){let base=node.clone().addScaledVector(lateral,side*.029),a=base.clone().addScaledVector(forward,-.031);rod(node.toArray(),base.toArray(),.0035,'#796d57');for(let j=0;j<3;j++){let d=a.clone().addScaledVector(lateral,(j-1)*.013);d.y+=.019*Math.cos(j*2);rod(base.toArray(),d.toArray(),.0025,'#806e55');add(disc,'#746a50',d.x,d.y,d.z,.008,.008,.004,0,normal)}}
 if(t<.18&&age>=1&&i%3!==0)continue;
 let off=rr(.022,.062)*(1+.3*age),tip=node.clone().addScaledVector(lateral,side*off).addScaledVector(forward,rr(.021,.043));tip.y+=rr(-.015,.023);rod(node.toArray(),tip.toArray(),.0032,'#948466');
 let size=rr(.115,.204)*(.66+.37*Math.sin(Math.PI*t))*(1-.45*Math.max(0,(t-.78)/.22));let a=t>.83?.12:Math.min(1,age*rr(.4,1.1));leaf(tip.x,tip.y,tip.z,size,a,normal+rr(-.39,.39),side*rr(.24,1.33))
 }}
 function balconyVines(){// Rooted on the east pier, turning out onto the slab and along its fascia.
 grow([[2.325,.19,.39],[2.32,.79,.53],[2.32,1.45,.52],[2.31,1.84,.53],[2.25,2.08,.57],[2.20,2.21,.80],[2.16,2.42,1.12],[2.17,2.51,1.60],[2.18,2.62,1.93]],30,.023,1);
 let arms=[[[2.18,2.62,1.93],[1.85,2.65,1.94],[1.61,2.61,1.945],[1.28,2.66,1.94],[.88,2.65,1.946],[.63,2.67,1.94]],[[2.17,2.62,1.93],[2.17,2.81,1.91],[2.18,3.05,1.88],[2.17,3.31,1.89],[2.15,3.58,1.87],[1.95,3.59,1.88]]];
 for(let pts of arms)grow(pts,22,.011,.84);
 for(let [x,len] of [[2.12,.60],[1.91,.43],[1.70,.51],[1.46,.28],[1.28,.38],[1.02,.18]])grow([[x,2.64,1.94],[x-.045,2.59,1.955],[x+.03,2.62-len*.62,1.97],[x-.037,2.62-len,1.98]],Math.ceil(len*16),.005,.59);
 grow([[2.32,1.46,.52],[2.32,1.71,.63],[2.32,1.95,.58],[2.325,2.18,.54],[2.325,2.39,.27]],15,.009,.76,1.57)
 }
 return {leaf,balconyVines}
}
