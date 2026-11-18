import * as T from './vendor/three.module.js';

// Junctions follow the cottage lanes and the middle of the bridge deck.
const places=[[-8.35,3.15],[-6.6,3.23],[-4.8,2.8],[-3.55,1.95],[-1.1,2],[.32,2],[2.04,2],[3.86,2],[5.03,2.26],[6.55,.38],[8.13,-.68],[10.20,-1.50],[11.7,-3.55],[-3.61,-.65],[-3.50,-2.85],[-8.62,5.11],[-8.26,7.73],[-9.31,9.23],[-5.96,8.31],[-3.57,6.61],[4.99,4.07],[4.57,6.16]];
const roads=[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12],[3,13],[13,14],[0,15],[15,16],[16,17],[16,18],[18,19],[19,2],[8,20],[20,21]];
const neighbors=places.map(()=>[]);for(const [a,b] of roads){neighbors[a].push(b);neighbors[b].push(a)}
const villagers=[
 ['阿禾','#9b604a','今天的风正好。','木桥边能看见鱼。'],
 ['小满','#c29d55','你好呀！','要一起去看羊吗？'],
 ['山谷邮差','#667f92','你的信，我会送到。','刚从山那边回来。'],
 ['牧羊人','#797b56','小羊都在呢。','别惊着吃草的牛。'],
 ['老林','#866c54','山泉今天格外清。','走累了，到木屋歇歇。'],
 ['阿紫','#887387','你也来听流水吗？','山尖已经见光了。'],
 ['豆豆','#b18b50','我发现一条小路！','快看那边的溪水！'],
 ['小川','#678980','你好，慢慢走。','走过木桥就是牧场。']
];
export function populate({island,ball,box,cyl,height,bridgeX}){
 let seed=991;const random=()=>((seed=Math.imul(seed,1664525)+1013904223>>>0)/4294967296);
 const people=villagers.map(([name,coat,...lines],i)=>{
  const g=new T.Group();island.add(g);g.userData.name=name;g.userData.lines=lines;g.userData.kind='person';
  const skin=['#cfa081','#d9ac8a','#bf9275'][i%3],boots='#504b40';
  ball(0,.63,0,.163,.221,.11,coat,g);ball(0,.48,0,.134,.084,.103,'#545e60',g);
  ball(0,.985,.009,.111,.139,.103,skin,g);ball(0,1.065,-.012,.116,.076,.105,'#54483d',g);
  for(let s of [-1,1])ball(.042*s,.995,.101,.012,.011,.007,'#423e34',g);ball(0,.968,.111,.022,.025,.017,skin,g);
  if(i%3!==2){cyl(0,1.091,0,.162,.021,i%2?'#9d8d66':'#b79f77',g,20);ball(0,1.122,-.003,.114,.062,.108,'#a69470',g)}
  const legs=[],arms=[];for(let s of [-1,1]){
   let leg=new T.Group();g.add(leg);leg.position.set(s*.071,.444,0);ball(0,-.175,0,.053,.183,.052,'#515e60',leg);ball(0,-.385,.026,.059,.049,.088,boots,leg);legs.push(leg);
   let arm=new T.Group();g.add(arm);arm.position.set(s*.154,.771,0);ball(s*.011,-.119,0,.048,.142,.051,coat,arm);ball(s*.011,-.27,.007,.038,.056,.038,skin,arm);arms.push(arm)}
  if(i===2){box(.137,.56,.066,.12,.17,.14,'#816448',g);let strap=box(.018,.692,.113,.019,.30,.012,'#7b6043',g);strap.rotation.z=.55}
  let from=[0,3,5,9,11,15,18,20][i],to=neighbors[from][0];return {g,legs,arms,from,to,progress:.20+i*.06,step:i*.7,speed:.53+random()*.25,rest:0};
 });
 function update(dt,time){for(let v of people){const greet=time-(v.g.userData.greet??-20),waving=greet<2.15,walking=!waving&&v.rest<=0;
  if(walking){let [x,z]=places[v.from],[xx,zz]=places[v.to];v.progress+=dt*v.speed/Math.hypot(xx-x,zz-z);v.step+=dt*6;
   if(v.progress>=1){let candidates=neighbors[v.to].filter(n=>n!==v.from),next=candidates.length?candidates[Math.floor(random()*candidates.length)]:v.from;v.from=v.to;v.to=next;v.progress=0;v.rest=random()<.35?.6+random()*1.6:0}}
  else v.rest=Math.max(0,v.rest-dt);
  let [x,z]=places[v.from],[xx,zz]=places[v.to],p=v.progress,px=x+(xx-x)*p,pz=z+(zz-z)*p;
  let y=height(px,pz);if(Math.abs(pz-2)<.54){const t=T.MathUtils.clamp((2.1-Math.abs(px-bridgeX))/.32,0,1);y=T.MathUtils.lerp(y,1.12,t)}
  v.g.position.set(px,y+(walking?.014*Math.abs(Math.sin(v.step)):0),pz);
  const heading=Math.atan2(xx-x,zz-z);const delta=Math.atan2(Math.sin(heading-v.g.rotation.y),Math.cos(heading-v.g.rotation.y));v.g.rotation.y+=delta*(1-Math.exp(-dt*8));
  for(let i=0;i<2;i++){let stride=walking?Math.sin(v.step+i*Math.PI)*.48:0;v.legs[i].rotation.x=stride;v.arms[i].rotation.x=-stride*.66;v.arms[i].rotation.z=0}
  if(waving){v.arms[1].rotation.z=2.38+.26*Math.sin(greet*12);v.arms[1].rotation.x=-.33}
 }}
 return {people,update}
}
