import * as T from './vendor/three.module.js';
// Bake rigid scenery in island-local coordinates. Keep animated meshes and transparent surfaces separate.
export function batchScenery(island,animated){
 island.updateMatrixWorld(true);const inverse=island.matrixWorld.clone().invert(),groups=new Map();
 function visit(o){if(animated.has(o))return;if(o.isMesh&&!o.isInstancedMesh&&!Array.isArray(o.material)&&!o.material.transparent&&!o.geometry.attributes.color){
  let key=o.material.uuid+'|'+o.castShadow+'|'+o.receiveShadow;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(o);
 }for(let c of o.children)visit(c)}
 visit(island);const normal=new T.Vector3(),point=new T.Vector3(),transform=new T.Matrix4(),normalTransform=new T.Matrix3();
 for(let list of groups.values()){if(list.length<3)continue;let ps=[],ns=[],us=[],ix=[],offset=0;
 for(let o of list){let g=o.geometry,p=g.attributes.position,n=g.attributes.normal,uv=g.attributes.uv;if(!n)g.computeVertexNormals();n=g.attributes.normal;transform.multiplyMatrices(inverse,o.matrixWorld);normalTransform.getNormalMatrix(transform);for(let i=0;i<p.count;i++){point.fromBufferAttribute(p,i).applyMatrix4(transform);normal.fromBufferAttribute(n,i).applyMatrix3(normalTransform).normalize();ps.push(point.x,point.y,point.z);ns.push(normal.x,normal.y,normal.z);us.push(uv?uv.getX(i):0,uv?uv.getY(i):0)}if(g.index){for(let j of g.index.array)ix.push(offset+j)}else for(let j=0;j<p.count;j++)ix.push(offset+j);offset+=p.count;o.removeFromParent()}
 let geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(ps,3));geo.setAttribute('normal',new T.Float32BufferAttribute(ns,3));geo.setAttribute('uv',new T.Float32BufferAttribute(us,2));geo.setIndex(ix);let mesh=new T.Mesh(geo,list[0].material);mesh.castShadow=list[0].castShadow;mesh.receiveShadow=list[0].receiveShadow;island.add(mesh)}
}
