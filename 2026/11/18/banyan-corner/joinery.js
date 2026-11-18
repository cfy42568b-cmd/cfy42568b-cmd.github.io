import * as T from './vendor/three.module.js';
import {drawing,weather} from './patina.js';

function roundedBlock(){
 const g=new T.BoxGeometry(1,1,1,12,12,12),p=g.attributes.position,n=g.attributes.normal;
 for(let i=0;i<p.count;i++){const v=new T.Vector3().fromBufferAttribute(p,i),core=v.clone().clampScalar(-.37,.37),normal=v.clone().sub(core).normalize(),q=core.addScaledVector(normal,.13);p.setXYZ(i,q.x,q.y,q.z);n.setXYZ(i,normal.x,normal.y,normal.z)}
 return g
}
const rounded=roundedBlock(),sphere=new T.SphereGeometry(1,18,10);
export function joinery({G,add,box,rod,ring,shape,standard}){
 const frame=standard('#806147','grain'),edge=standard('#ae8961','grain'),chrome=weather('#969a89',14),enamel=weather('#a9b9aa',26);
 const textile=drawing(512,256,(g,w,h)=>{g.fillStyle='#afc0af';g.fillRect(0,0,w,h);for(let x=0;x<w;x+=3){g.fillStyle=x%2?'rgba(61,81,70,.15)':'rgba(220,219,192,.15)';g.fillRect(x,0,1,h)}for(let y=0;y<h;y+=3){g.fillStyle='rgba(65,83,75,.11)';g.fillRect(0,y,w,1)}for(let i=0;i<38;i++){let x=(i*89)%w,y=(i*113)%h;let grad=g.createRadialGradient(x,y,1,x,y,20+i%27);grad.addColorStop(0,'rgba(129,114,86,.075)');grad.addColorStop(1,'rgba(142,121,89,0)');g.fillStyle=grad;g.fillRect(x-50,y-50,100,100)}});
 const cloth=new T.MeshStandardMaterial({map:textile,color:'#91afa0',roughness:.99,bumpMap:textile,bumpScale:.0007});
 function cord(points,r,c,closed=false){const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)),closed);const g=new T.TubeGeometry(curve,Math.max(16,points.length*3),r,6,closed);add(g,c,0,0,0,1,1,1)}
 function piping(x,y,z,w,d,c){const a=w/2,b=d/2,r=.055;
 cord([[-a+r,-b],[-a+.008,-b+.014],[-a,-b+r],[-a,b-r],[-a+.014,b-.012],[-a+r,b],[a-r,b],[a-.014,b-.012],[a,b-r],[a,-b+r],[a-.014,-b+.012],[a-r,-b]].map(([dx,dz])=>[x+dx,y,z+dz]),.006,c,true)}
 const backPad=rounded.clone(),pp=backPad.attributes.position;
 for(let i=0;i<pp.count;i++){let x=pp.getX(i),y=pp.getY(i),z=pp.getZ(i);if(z>.28){let d=0;for(let k of [-.235,.235])d+=Math.exp(-((x-k)**2/.007+(y-.04)**2/.012));pp.setZ(i,z-.122*d)}}backPad.computeVertexNormals();
 function sofa(x,y,z){for(let dx of [-.77,.77])for(let dz of [-.29,.29])rod([x+dx,y,z+dz],[x+dx*.975,y+.145,z+dz*.98],.047,frame,.063);
 add(rounded,frame,x,y+.165,z,1.81,.13,.75);add(rounded,cloth,x,y+.265,z,1.78,.17,.78);
 for(let i=0;i<2;i++){let dx=x+(i-.5)*.733;add(rounded,cloth,dx,y+.385,z+.055,.725,.155,.59);piping(dx,y+.43,z+.054,.704,.568,'#829b88');
 add(backPad,cloth,dx,y+.626,z-.247,.728,.485,.19,-.095);for(let k of [-.169,.169]){add(sphere,'#789485',dx+k,y+.646,z-.165,.015,.015,.005)}}
 for(let s of [-1,1]){add(rounded,cloth,x+s*.827,y+.444,z,.20,.36,.79);add(rounded,frame,x+s*.828,y+.626,z,.193,.036,.72)}
 }
 function chair(x,y,z){const cc=standard('#9b7956','grain'),plug='#bc9f76';
 for(let a of [-1,1])for(let b of [-1,1]){rod([x+a*.199,y+.008,z+b*.193],[x+a*.155,y+.368,z+b*.142],.021,frame,.031);add(sphere,'#595747',x+a*.199,y+.012,z+b*.193,.023,.012,.024)}
 for(let a of [-1,1]){rod([x+a*.18,y+.192,z-.169],[x+a*.18,y+.192,z+.169],.015,frame);rod([x+a*.151,y+.34,z-.15],[x+a*.157,y+.833,z-.211],.024,frame,.020);add(sphere,plug,x+a*.16,y+.754,z-.183,.011,.01,.006)}
 rod([x-.175,y+.176,z],[x+.175,y+.176,z],.014,edge);add(rounded,cc,x,y+.383,z,.445,.063,.432);add(rounded,cc,x,y+.742,z-.19,.416,.162,.05,-.13);
 for(let s of [-1,1]){rod([x+s*.135,y+.4,z-.15],[x+s*.116,y+.665,z-.183],.009,frame)}
 }
 function freezer(x,y,z){const inside='#718784',w=1.45,d=.78;add(rounded,enamel,x,y+.31,z,w,.61,d);box(x,y+.637,z,1.37,.043,.702,inside);
 for(let s of [-1,1]){box(x+s*.701,y+.689,z,.054,.099,d,chrome);box(x,y+.689,z+s*.366,1.37,.099,.051,chrome);for(let i=0;i<2;i++)rod([x+s*.59,y+.03,z+(i-.5)*.54],[x+s*.59,y+.11,z+(i-.5)*.54],.032,'#585d54')}
 for(let i=0;i<16;i++)box(x-.59+i*.079,y+.669,z,.009,.012,.61,'#9ea99b');
 const glass=new T.MeshStandardMaterial({color:'#c3d2ca',transparent:true,opacity:.47,roughness:.31,depthWrite:false});
 for(let [j,dx] of [-.335,.212].entries()){let h=y+.706+j*.021;box(x+dx,h,z,.633,.012,.63,glass);for(let s of [-1,1]){box(x+dx+s*.315,h+.003,z,.018,.021,.65,'#a9b3a4');box(x+dx,h+.003,z+s*.317,.637,.021,.016,'#a9b3a4')}box(x+dx+.23,h+.023,z+.19,.032,.04,.15,'#7d8c83')}
 box(x+.45,y+.286,z+.394,.38,.29,.019,'#919e92');for(let i=0;i<9;i++)box(x+.45,y+.18+i*.025,z+.406,.302,.009,.011,'#56645c');for(let dx of [-.16,.16])for(let dy of [-.12,.12])add(sphere,chrome,x+.45+dx,y+.286+dy,z+.411,.009,.009,.004);
 }
 function deskExtras(x,y,z){const copper='#977c57',green=weather('#697d70',16);const lx=x+.49,lz=z-.235;
 add(sphere,green,lx,y+.781,lz,.123,.024,.098);rod([lx,y+.788,lz],[lx-.024,y+1.094,lz],.016,copper);rod([lx-.024,y+1.09,lz],[lx-.129,y+1.19,lz+.015],.012,copper);
 const shade=new T.LatheGeometry([[.018,.085],[.042,.077],[.070,.048],[.094,.008],[.095,0],[.087,.004],[.063,.045],[.018,.075]].map(([r,h])=>new T.Vector2(r,h)),24);add(shade,green,lx-.139,y+1.12,lz+.017,1,1,1,.14,0,-.22);add(sphere,'#dcd0aa',lx-.14,y+1.13,lz+.023,.040,.033,.04);
 for(let i=0;i<2;i++){let px=x-.27,pz=z+.18+i*.038;rod([px,y+.772,pz],[px+.194,y+.772,pz-.047],.005,i?'#8b5e48':'#c9a25c');rod([px+.194,y+.772,pz-.047],[px+.214,y+.772,pz-.052],.005,'#bba481',.001)}
 for(let i=0;i<2;i++){let side=i?1:-1;add(sphere,copper,x+side*.22,y+.61,z+.359,.007,.007,.004)}
 }
 return {sofa,chair,freezer,deskExtras}
}
