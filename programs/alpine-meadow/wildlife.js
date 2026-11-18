import * as T from './vendor/three.module.js';
const TAU=Math.PI*2;
function spindle(ball,g,start,end,width,depth,colour){
 const a=new T.Vector3(...start),b=new T.Vector3(...end),mid=a.clone().lerp(b,.5),v=b.sub(a);
 const part=ball(mid.x,mid.y,mid.z,width,v.length()*.57,depth,colour,g);
 part.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());return part
}
export function sheepdog({island,height,ball}){
 const dog=new T.Group();island.add(dog);dog.userData.kind='dog';dog.userData.name='牧羊犬 · 阿栗';dog.userData.lines=['汪！','汪汪！'];const coat='#403e36',white='#dcd9c8',tan='#b48962',nose='#393932';
 // Skeleton faces +z. Each shoulder and hock pivots independently of the body.
 const spine=new T.Group();dog.add(spine);spine.position.y=.52;
 ball(0,.035,-.03,.158,.17,.343,coat,spine);ball(0,.038,.184,.142,.18,.173,white,spine);ball(0,-.004,.205,.112,.153,.137,white,spine);
 ball(0,.083,-.23,.147,.138,.156,coat,spine);ball(.120,.057,-.066,.042,.095,.09,white,spine);
 const head=new T.Group();head.position.set(0,.176,.295);spine.add(head);
 ball(0,.044,.04,.116,.123,.129,coat,head);ball(0,.066,.124,.029,.087,.053,white,head);
 ball(0,-.008,.170,.075,.063,.103,white,head);ball(0,.008,.251,.057,.037,.030,nose,head);
 for(let sign of [-1,1]){
  ball(sign*.072,.068,.135,.018,.019,.013,'#42382a',head);ball(sign*.072,.075,.145,.006,.006,.004,'#e6d4a6',head);
  ball(sign*.081,.102,.108,.031,.016,.022,tan,head);
  let ear=new T.Mesh(new T.ConeGeometry(.060,.146,5),new T.MeshStandardMaterial({color:coat,roughness:.91}));ear.position.set(sign*.088,.159,-.005);ear.rotation.z=-sign*.22;ear.rotation.x=-.23;head.add(ear);
 }
 const tail=new T.Group();spine.add(tail);tail.position.set(0,.045,-.283);
 spindle(ball,tail,[0,0,0],[0,.062,-.221],.05,.051,coat);
 spindle(ball,tail,[0,.058,-.186],[0,.146,-.327],.040,.042,white);
 const legs=[];for(let front of [true,false])for(let side of [-1,1]){
  const hip=new T.Group(),knee=new T.Group();hip.position.set(side*.107,.445,front?.163:-.217);dog.add(hip);hip.add(knee);
  knee.position.set(0,-.19,front?-.026:.054);
  spindle(ball,hip,[0,.012,0],[0,-.194,knee.position.z],front?.044:.063,front?.051:.067,front?white:coat);
  const ankleZ=front?.036:-.060;spindle(ball,knee,[0,0,0],[0,-.183,ankleZ],.027,.031,front?white:tan);
  ball(0,-.209,ankleZ+.028,.038,.036,.066,white,knee);legs.push({hip,knee,front,side})}
 // A network outside the fence leaves the animals space. Junctions allow a new route on each lap.
 const nodes=[[4.66,2.06],[4.77,3.72],[4.52,6.21],[4.47,9.42],[6.97,11.32],[9.12,11.80],[12.86,10.42],[13.61,8.52],[13.92,5.32],[13.09,.85],[10.44,.02],[8.37,-.24],[6.41,.52],[4.06,2.60],[4.24,4.13],[4.65,7.32],[4.42,10.16]];
 const tracks=[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12],[12,0],[0,13],[13,14],[14,15],[15,16],[16,4],[14,1],[16,3]];
 const links=nodes.map(()=>[]);tracks.forEach(([a,b])=>{links[a].push(b);links[b].push(a)});
 let prev=10,from=11,to=12,progress=.16,rest=0,stride=0,seed=12;function rand(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}
 const point=i=>new T.Vector3(nodes[i][0],0,nodes[i][1]),left=new T.Vector3(),right=new T.Vector3();
 function route(){const a=point(prev),b=point(from),c=point(to);left.copy(a).lerp(b,.5);right.copy(b).lerp(c,.5);return new T.QuadraticBezierCurve3(left.clone(),b,right.clone())}
 let curve=route();
 function update(dt,t){let greeting=t-(dog.userData.greet??-10)<1.55;const running=!greeting&&rest<=0;
  if(running){progress+=dt*(1.42+.27*Math.sin(t*.39))/curve.getLength();stride+=dt*9.9;
   if(progress>=1){prev=from;from=to;let options=links[from].filter(n=>n!==prev);to=options[Math.floor(rand()*options.length)]??prev;curve=route();progress-=1;rest=rand()<.24?.50+rand()*.97:0}}
  else rest=Math.max(0,rest-dt);
  const p=curve.getPointAt(progress),direction=curve.getTangentAt(progress),lift=running?.033*Math.sin(stride)**2:0;
  dog.position.set(p.x,height(p.x,p.z)+lift,p.z);dog.rotation.y=Math.atan2(direction.x,direction.z);spine.rotation.x=running?.043*Math.sin(stride):0;
  head.rotation.x=greeting?-.22:running?.056*Math.sin(stride+.46):.10;head.rotation.y=running?0:.20*Math.sin(t*2);tail.rotation.y=Math.sin(t*(greeting?13:7))*(greeting?.65:.36);
  legs.forEach(({hip,knee,front,side})=>{let phase=stride+(front?0:2.7)+(side>0?.72:0);hip.rotation.x=running?.65*Math.sin(phase):0;knee.rotation.x=running?(front?1:-1)*.57*Math.max(0,Math.cos(phase)):0})
 }
 update(0,0);return {dog,update}
}

export function swallows({scene,ball}){
 const dark=new T.MeshStandardMaterial({color:'#39474a',roughness:.82,side:T.DoubleSide}),light=new T.MeshStandardMaterial({color:'#9eaa9d',roughness:.87,side:T.DoubleSide}),rust='#946d55';
 function vane(parent,points,mat){let g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(points.flat(),3));let ix=[];for(let i=1;i<points.length-1;i++)ix.push(0,i,i+1);g.setIndex(ix);g.computeVertexNormals();const m=new T.Mesh(g,mat);parent.add(m);return m}
 const flock=[];for(let i=0;i<5;i++){let g=new T.Group();scene.add(g);g.scale.setScalar(.87+.075*(i%3));ball(0,0,0,.083,.079,.204,'#455052',g);ball(0,-.037,.013,.071,.053,.142,'#c5c3ad',g);ball(0,.047,.161,.07,.067,.082,'#37474a',g);ball(0,.014,.211,.053,.034,.051,rust,g);
 vane(g,[[-.034,.040,.215],[0,.030,.290],[.034,.040,.215],[0,.057,.22]],dark);
 for(let s of [-1,1]){ball(s*.049,.060,.214,.010,.01,.007,'#302e27',g);vane(g,[[0,0,-.13],[s*.067,.003,-.16],[s*.153,-.011,-.408],[s*.036,-.014,-.265],[0,-.008,-.203]],dark)}
 const wings=[];for(let s of [-1,1]){let root=new T.Group(),wrist=new T.Group();root.position.set(s*.057,.025,.044);wrist.position.set(s*.228,.035,.045);root.add(wrist);g.add(root);
 vane(root,[[0,0,.062],[s*.228,.035,.08],[s*.234,.034,-.023],[s*.159,.002,-.076],[s*.074,-.011,-.125],[0,-.018,-.105]],dark);
 for(let j=0;j<5;j++){let f=j/4;vane(wrist,[[0,-.003,.034-f*.087],[s*(.322-f*.14),.014-f*.013,-.193-f*.022],[s*(.239-f*.10),.005,-.181-f*.023],[s*.004,-.005,-.014-f*.084]],j===4?light:dark)}
 wings.push({s,root,wrist})}flock.push({g,wings,i})}
 return t=>{for(let {g,wings,i} of flock){const a=t*(.146+i*.008)+i*1.25,rx=6.7+i*.32,rz=3.4+i*.22,dx=rx*Math.cos(a),dz=-rz*Math.sin(a);
  g.position.set(rx*Math.sin(a),9.2+i*.71+.54*Math.sin(2*a+i),-4.2+rz*Math.cos(a));g.rotation.order='YXZ';g.rotation.y=Math.atan2(dx,dz);g.rotation.x=-.14*Math.cos(2*a+i);g.rotation.z=.16+.14*Math.sin(a+.7);
  const beat=t*(10.4+i*.45)+i,weight=T.MathUtils.smoothstep(Math.sin(t*.91+i*2),-.36,.46);for(let {s,root,wrist} of wings){root.rotation.z=s*(.13+.62*Math.sin(beat)*weight);wrist.rotation.z=s*(-.085+.34*Math.sin(beat-.85)*weight)}}}
}
