import * as T from './vendor/three.module.js';
import {carpBody,fins as attachFins} from './fishshape.js';
const tau=2*Math.PI;
const varieties=[
 {base:'#f1e9d5',marks:['#bd3428'],fin:'#e1d8c0',pattern:'cap',scale:'#bdb29e'},
 {base:'#dfab32',marks:[],fin:'#d9b561',pattern:'solid',scale:'#977333'},
 {base:'#7594a7',marks:['#b76b42'],fin:'#bd9682',pattern:'asagi',scale:'#435e76'},
 {base:'#343b3a',marks:['#ece6d4'],fin:'#a7a39a',pattern:'bands',scale:'#747b76'},
 {base:'#d1d5ce',marks:[],fin:'#d6d8cf',pattern:'pearl',scale:'#929e9e'},
 {base:'#9d6e4b',marks:[],fin:'#ae8966',pattern:'copper',scale:'#634a39'},
 {base:'#de873c',marks:['#372e29','#ece2d0','#b84623'],fin:'#cfa680',pattern:'tricolour',scale:'#95745c'}
];
function skin(index){
 const v=varieties[index],canvas=document.createElement('canvas');canvas.width=640;canvas.height=256;const c=canvas.getContext('2d');
 let seed=877+index*231;const rand=()=>((seed=Math.imul(seed,1664525)+1013904223>>>0)/4294967296);
 c.fillStyle=v.base;c.fillRect(0,0,640,256);
 function patch(cx,cy,w,h,color){let radii=Array.from({length:20},()=>.8+rand()*.35);
 for(let off of [-256,0,256]){let pts=radii.map((r,j)=>[cx+w*r*Math.cos(j*tau/20),cy+off+h*r*Math.sin(j*tau/20)]);c.fillStyle=color;c.beginPath();c.moveTo((pts[19][0]+pts[0][0])/2,(pts[19][1]+pts[0][1])/2);for(let j=0;j<20;j++){let [x,y]=pts[j],[xx,yy]=pts[(j+1)%20];c.quadraticCurveTo(x,y,(x+xx)/2,(y+yy)/2)}c.fill()}}
 // The dorsal centre line is at v=.25, or y=.75 of the flipped canvas texture.
 if(v.pattern==='cap')patch(529,192,58,36,v.marks[0]);
 if(v.pattern==='bands'||v.pattern==='tricolour'){let n=v.pattern==='bands'?5:9;for(let j=0;j<n;j++)patch(25+j*(596/n)+rand()*24,161+rand()*85,29+rand()*32,44+rand()*47,v.marks[j%v.marks.length])}
 if(v.pattern==='asagi'){for(let j=0;j<10;j++)patch(27+j*56,114+(j%2)*145,32+rand()*18,15+rand()*9,v.marks[0])}
 const shading=c.createLinearGradient(0,0,0,256);shading.addColorStop(0,'rgba(222,209,180,.04)');shading.addColorStop(.25,'rgba(238,222,193,.63)');shading.addColorStop(.54,'rgba(222,209,180,.04)');shading.addColorStop(.74,'rgba(82,78,64,.08)');shading.addColorStop(1,'rgba(222,209,180,.04)');c.fillStyle=shading;c.fillRect(0,0,640,256);
 for(let row=0;row<30;row++){for(let x=11;x<477;x+=13){let u=x+(row%2)*6.5,y=row*8.6;c.strokeStyle=v.scale;c.globalAlpha=v.pattern==='asagi'?.86:.45;c.lineWidth=v.pattern==='asagi'?2.1:1;c.beginPath();c.ellipse(u,y,7.2,4.65,0,1.76,4.5);c.stroke();c.globalAlpha=.28;c.strokeStyle='#fff2d2';c.lineWidth=.9;c.beginPath();c.ellipse(u+1,y,7,4.2,0,2.1,3.6);c.stroke()}}
 c.globalAlpha=1;let tex=new T.CanvasTexture(canvas);tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=4;return tex
}
export function shoal(group){
 const swimmers=[];for(let i=0;i<7;i++){let root=new T.Group();group.add(root);let parts=[];let body=new T.Mesh(carpBody(i),new T.MeshStandardMaterial({map:skin(i),roughness:i===4?.24:.37,metalness:i===4||i===1?.13:.02,side:T.DoubleSide}));root.add(body);parts.push(body);
 attachFins(root,parts,varieties[i].fin);
 for(let side of [-1,1]){let eye=new T.Mesh(new T.SphereGeometry(.011,10,8),new T.MeshStandardMaterial({color:0x302d23,roughness:.18}));eye.position.set(.157,.020,side*.045);root.add(eye)}
 let bendable=parts.map(m=>[m.geometry.attributes.position,m.geometry.attributes.position.array.slice()]);root.scale.setScalar(.87+.14*(i%4));swimmers.push({root,bendable,i})
 }
 return function swim(t){for(let {root,bendable,i} of swimmers){let speed=.2+.017*(i%4),q=t*speed+i*2.29+.16*Math.sin(t*.57+i),a=.67+(i%4)*.29,b=.26+(i%3)*.10,off=.28*Math.cos(i*2.2),s=i%3===1?-1:1;
 let dx=-a*Math.sin(q)-.18*Math.sin(q*2+i),dz=s*(b*Math.cos(q)+.12*Math.cos(q*2+i));root.position.set(.58+off+a*Math.cos(q)+.09*Math.cos(q*2+i),-.121+.015*Math.sin(q*2+i),4.38+s*(b*Math.sin(q)+.06*Math.sin(q*2+i))+.15*Math.sin(i));root.rotation.set(0,Math.atan2(-dz,dx),.033*Math.sin(t*2+i),'YXZ');
 let beat=t*(6.3+i*.22)+i*2.3+.65*Math.sin(q*2);for(let [attr,base] of bendable){for(let n=0;n<attr.count;n++){let x=base[n*3],amp=Math.max(0,(.14-x)/.44);attr.array[n*3+2]=base[n*3+2]+.082*amp*amp*Math.sin(beat-amp*3.1);let finSpan=Math.max(0,Math.abs(base[n*3+2])-.065);attr.array[n*3+1]=base[n*3+1]+finSpan*.36*Math.sin(t*3.6+i+Math.sign(base[n*3+2])*.3);attr.array[n*3]=x+.011*amp*amp*(1-Math.cos(beat-amp*3.1))}attr.needsUpdate=true}}
 }
}
