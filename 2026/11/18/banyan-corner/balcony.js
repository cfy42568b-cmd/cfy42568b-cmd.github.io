import * as T from './vendor/three.module.js';
import {weather} from './patina.js';
export function balcony({box,add,rod,path,shape,rr,pick,standard,ring}){
 const paint=weather('#76867b',61),zinc=weather('#85897d',27),tile=['#c7c4ad','#ccc6b1','#c6c3aa','#cecab6'].map(c=>standard(c,'mineral')),bracket=weather('#817868',59);
 const x0=-.77,x1=2.22,z0=.875,z1=1.905,floor=2.738,top=floor+.838;
 box((x0+x1)/2,2.62,(z0+z1)/2,x1-x0,.181,z1-z0,standard('#b7b39f','mineral'));
 // The slab bears on two wall brackets, its tiles leave a narrow scupper at the east corner.
 for(let x of [-.64,1.96]){box(x,2.506,1.35,.105,.075,.92,bracket);rod([x,2.17,1.014],[x,2.499,1.75],.032,bracket);box(x,2.32,1.017,.14,.43,.047,bracket)}
 for(let a=0;a<10;a++)for(let b=0;b<4;b++){if(a===9&&b===3)continue;box(x0+.149+a*.297,2.726-b*.001,z0+.128+b*.255,.289,.026,.247,pick(tile))}
 box(2.047,2.72,1.77,.286,.016,.239,'#5e665a');for(let i=0;i<9;i++)box(1.924+i*.03,2.733,1.77,.012,.01,.219,zinc);
 path([[2.05,2.53,1.77],[2.05,2.45,1.77],[2.26,2.38,1.77],[2.26,2.38,2.01]],.035,zinc);ring(2.26,2.38,2.01,.035,.005,zinc);
 box(.71,2.697,z1,.987*3,.044,.043,zinc);for(let i=0;i<10;i++)box(x0+.19+i*.291,2.606,z1+.003,.006,rr(.022,.071),.005,'#979784');
 const postX=[-.719,.203,1.15,2.174];
 for(let x of postX){box(x,floor+.012,1.856,.104,.024,.104,zinc);box(x,floor+.417,1.856,.038,.82,.042,paint);for(let dx of [-.036,.036])for(let dz of [-.035,.035])add(shape.tube,'#756f60',x+dx,floor+.028,1.856+dz,.008,.009,.008)}
 for(let [y,r] of [[top,.027],[floor+.128,.013]]){rod([-.72,y,1.856],[2.178,y,1.856],r,paint);for(let x of [-.719,2.174])rod([x,y,.963],[x,y,1.856],r,paint)}
 for(let a=0;a<3;a++){let x=postX[a],xx=postX[a+1];for(let i=1;i<6;i++){let px=x+(xx-x)*i/6;box(px,floor+.465,1.856,.012,.673,.017,paint)}}
 for(let x of [-.719,2.174])for(let i=0;i<5;i++)box(x,floor+.47,1.03+i*.161,.014,.67,.016,paint);
 // A galvanized watering can has been left by the airing rail, next to a chipped saucer.
 const cx=-.43,cz=1.52,base=floor+.006;
 const can=new T.LatheGeometry([[.082,0],[.090,.017],[.094,.16],[.083,.175],[.055,.179],[.053,.172],[.079,.164],[.079,.025]].map(([r,h])=>new T.Vector2(r,h)),30);
 add(can,zinc,cx,base,cz,1,1,1);
 for(let h of [.034,.131])ring(cx,base+h,cz,.093,.003,zinc,Math.PI/2);
 const handle=[];for(let j=0;j<17;j++){let a=j*Math.PI/16;handle.push([cx,base+.149+.12*Math.sin(a),cz+.078*Math.cos(a)])}path(handle,.007,zinc);
 rod([cx+.071,base+.047,cz],[cx+.19,base+.186,cz+.035],.025,zinc,.012);add(shape.tube,zinc,cx+.194,base+.192,cz+.035,.026,.016,.026,0,0,-.62);
 const clay=standard('#b58a70','mineral');add(new T.LatheGeometry([[.095,0],[.13,.012],[.139,.036],[.133,.04],[.119,.019],[0,.015]].map(([r,h])=>new T.Vector2(r,h)),36),clay,-.46,base,1.187,1,1,1);
 // Open sliding-door leaf on the right; the left bay remains accessible from the room.
 for(let z of [.897,.934])box(.72,2.764,z,2.63,.017,.013,zinc);
 const glass=new T.MeshStandardMaterial({color:'#c2d2c3',transparent:true,opacity:.14,depthWrite:false,roughness:.37,side:T.DoubleSide});
 for(let x of [1.19,2.043])box(x,3.741,.911,.032,1.94,.035,paint);
 for(let y of [2.79,3.40,4.694])box(1.616,y,.911,.88,.034,.038,paint);
 box(1.616,3.097,.911,.831,.566,.01,glass);box(1.616,4.045,.911,.831,1.25,.01,glass);
 for(let y of [3.53,3.683])rod([1.216,y,.926],[1.216,y,.962],.009,zinc);rod([1.216,3.53,.962],[1.216,3.683,.962],.01,zinc);
 // The old airing rail still has two bent wire hangers and a few sun-bleached pegs.
 for(let x of [-.67,.55]){box(x,4.653,.986,.08,.135,.054,zinc);rod([x,4.63,1.013],[x,4.486,1.392],.015,paint)}
 rod([-.76,4.488,1.39],[.65,4.488,1.39],.012,zinc);
 for(let x of [-.40,.096]){path([[x-.027,4.475,1.405],[x-.025,4.501,1.39],[x,4.509,1.385],[x+.023,4.486,1.392],[x,4.425,1.398],[x,4.39,1.401],[x-.162,4.268,1.411],[x-.158,4.251,1.411],[x+.151,4.251,1.389],[x+.162,4.27,1.389],[x,4.39,1.401]],.0043,'#817d6e')}
 for(let x of [.265,.319]){box(x,4.471,1.39,.019,.057,.021,'#ad9473',0,.13);box(x,4.481,1.405,.019,.008,.006,zinc)}
}
