import {drawing} from './patina.js';
export function furnish({box,rod,add,shape,ring,label,range,pick,wood,iron,material,T}){
const oak=material('#a68058','grain'),darkOak=material('#70543c','grain'),walnut=material('#634130','grain',{roughness:.41}),edge=material('#8b6044','grain',{roughness:.47}),brass=new T.MeshStandardMaterial({color:0xae8957,metalness:.64,roughness:.48});
const cloth=['#656e5c','#7e564b','#526778','#716c54','#946b53','#67606a','#92836a'];
const spineLabels=['植物誌','山の花','草木図譜','歳時記','天体観測','日本の町','古建築','旅の記録','楽典','素描帖','樹木図鑑','郷土史'].map((title,i)=>{
 const tex=drawing(64,192,(g,w,h)=>{g.fillStyle=cloth[i%cloth.length];g.fillRect(0,0,w,h);g.strokeStyle='#ad9c7d';g.lineWidth=1;g.strokeRect(4,6,56,180);g.fillStyle='#d4c7a5';g.textAlign='center';g.font='22px serif';Array.from(title).forEach((c,j)=>g.fillText(c,32,49+j*29));g.fillRect(9,169,46,2);g.fillRect(9,174,46,1)});return new T.MeshStandardMaterial({map:tex,roughness:.94})
});
const spineFace=new T.PlaneGeometry(1,1);
function shelf(x,y,z){for(let dx of [-.73,.73]){box(x+dx,y+.85,z,.065,1.69,.48,darkOak);box(x+dx,y+.85,z+.239,.061,1.7,.023,oak)}box(x,y+.82,z-.23,1.46,1.56,.045,darkOak);box(x,y+1.71,z,1.6,.075,.56,oak);
 for(let row=0;row<4;row++){let by=y+.1+row*.405;box(x,by,z,1.49,.047,.49,oak);for(let dx of [-.706,.706])for(let dz of [-.16,.15])add(shape.tube,'#8b826e',x+dx,by-.032,z+dz,.009,.048,.009,0,0,Math.PI/2);
 let cursor=-.67;
 while(cursor<.52){let width=range(.045,.1),height=range(.22,.335),depth=range(.21,.33),xx=x+cursor+width/2,zz=z+range(-.015,.025),col=pick(cloth);box(xx,by+.027+height/2,zz,width,height-.012,depth,'#d9c9ab');for(let side of [-1,1])box(xx+side*width*.49,by+.027+height/2,zz,.008,height,depth+.012,col);box(xx,by+.027+height/2,zz+depth/2,width+.004,height,.023,col);if((row+Math.round(cursor*100))%3!==0)add(spineFace,spineLabels[Math.abs(Math.round(cursor*200)+row*3)%spineLabels.length],xx,by+.027+height*.51,zz+depth/2+.0128,width*.91,height*.92,1);for(let f of [.10,.93])box(xx,by+.027+height*f,zz+depth/2+.013,width*.73,.005,.004,'#b3a081');cursor+=width+.013}
 } }
function desk(x,y,z){for(let k=0;k<5;k++)box(x,y+.727,z-.35+k*.176,1.49,.072,.173,k%2?oak:wood);for(let a of [-.62,.62])for(let b of [-.31,.31]){rod([x+a,y+.02,z+b],[x+a*.95,y+.69,z+b*.95],.036,darkOak,.058);box(x+a*.98,y+.58,z+b*.98,.106,.16,.1,oak)}
 for(let b of [-.31,.31])box(x,y+.611,z+b,1.21,.145,.049,darkOak);for(let a of [-.6,.6])box(x+a,y+.611,z,.05,.14,.63,darkOak);box(x,y+.61,z+.344,.58,.112,.025,oak);add(shape.tube,brass,x,y+.607,z+.371,.023,.032,.023,Math.PI/2);
 box(x+.2,y+.776,z+.02,.37,.024,.27,'#5f6b60',.13);box(x+.2,y+.798,z+.02,.35,.024,.25,'#cabfa6',.13);box(x+.2,y+.814,z+.02,.37,.009,.27,'#75816b',.13);add(shape.tube,'#ccc5ac',x-.43,y+.83,z-.18,.063,.13,.063);add(shape.tube,'#665244',x-.43,y+.897,z-.18,.051,.004,.051);ring(x-.356,y+.844,z-.18,.036,.008,'#c6bda1')}
function piano(x,y,z){let width=1.76;box(x,y+.62,z,width,1.23,.48,walnut);box(x,y+1.254,z,width+.07,.061,.54,edge);box(x,y+.98,z+.249,width-.13,.44,.028,edge);box(x,y+.98,z+.269,width-.22,.345,.018,walnut);box(x,y+.31,z+.247,width-.19,.45,.028,edge);box(x,y+.31,z+.265,width-.26,.39,.017,walnut);box(x,y+.077,z+.27,width,.098,.16,edge);
 box(x,y+.616,z+.365,width+.02,.105,.38,walnut);for(let side of [-1,1]){box(x+side*.85,y+.687,z+.37,.085,.092,.37,edge);rod([x+side*.79,y+.08,z+.43],[x+side*.79,y+.58,z+.43],.045,edge,.06);box(x+side*.79,y+.066,z+.35,.14,.084,.28,walnut)}
 let key=.0315;for(let i=0;i<52;i++){let xx=x+(i-25.5)*key;box(xx,y+.687,z+.383,key-.0019,.047,.254,i%11?'#e3dac6':'#d3c7ad');if(i<51&&![1,4].includes(i%7))box(xx+key/2,y+.724,z+.339,.018,.046,.152,'#302d2a')}
 for(let a of [-.09,0,.09]){rod([x+a,y+.11,z+.29],[x+a,y+.057,z+.4],.015,brass);add(shape.rock,brass,x+a,y+.055,z+.423,.028,.015,.063)}
 box(x,y+.837,z+.32,.67,.036,.108,edge);box(x,y+.952,z+.288,.62,.21,.028,walnut);
 const score=drawing(512,256,(g,w,h)=>{g.fillStyle='#d5cdb3';g.fillRect(0,0,w,h);g.fillStyle='#5c5548';g.textAlign='center';g.font='italic 15px serif';g.fillText('Andantino',128,24);g.fillText('cantabile',385,24);g.fillRect(255,0,2,256);for(let page=0;page<2;page++)for(let row=0;row<3;row++){let X=page*256+18,Y=48+row*67;g.fillStyle='#726b57';for(let k=0;k<5;k++)g.fillRect(X,Y+k*5,218,1);for(let k=0;k<14;k++){let px=X+7+k*15,py=Y+6+((k*7+row*3+page)%8)*2.5;g.beginPath();g.ellipse(px,py,3.6,2.6,-.38,0,7);g.fill();g.fillRect(px+3,py-17,1,17);if(k%4===0)g.fillRect(px+3,py-17,12,2);if(k%5===4)g.fillRect(px+6,Y,1,21)}}});
 box(x,y+.976,z+.326,.49,.227,.013,'#d8ceb0');add(spineFace,new T.MeshStandardMaterial({map:score,roughness:.97}),x,y+.976,z+.334,.488,.225,1);
 box(x,y+.714,z+.248,width-.14,.021,.022,'#81574e');for(let k=0;k<11;k++)add(shape.tube,brass,x-.717+k*.143,y+.777,z+.256,.007,.103,.007,0,0,Math.PI/2);for(let side of [-1,1]){add(shape.tube,brass,x+side*.792,y+.033,z+.41,.033,.033,.033,Math.PI/2);box(x+side*.732,y+.322,z+.281,.013,.364,.009,edge)}
 box(x,y+.394,z+.99,.73,.095,.34,walnut);box(x,y+.454,z+.99,.71,.067,.33,'#685344');for(let a of [-.29,.29])for(let b of [-.11,.11])rod([x+a,y+.01,z+.99+b],[x+a,y+.37,z+.99+b],.026,walnut,.043)
}
return {shelf,desk,piano}
}
