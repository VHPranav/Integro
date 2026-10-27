import sharp from 'sharp';
import {writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const input=process.argv[2]||'public/artwork/solar-home.webp';
const output=process.argv[3]||'public/artwork/solar-home-trace.json';
const {data,info}=await sharp(input).ensureAlpha().raw().toBuffer({resolveWithObject:true});
const {width:w,height:h}=info;
const dark=(x,y)=>{const p=(y*w+x)*4;return data[p+3]>150&&(data[p]+data[p+1]+data[p+2])/3<105;};
const found=[];
function scan(vertical){const along=vertical?h:w,across=vertical?w:h;for(let c=0;c<across;c+=2){let start=-1,last=-1,gap=0;for(let k=0;k<=along;k++){const x=vertical?c:k,y=vertical?k:c;const on=k<along&&x>w*.04&&x<w*.96&&y>h*.12&&y<h*.94&&dark(x,y);if(on){if(start<0)start=k;last=k;gap=0;}else if(start>=0&&++gap>3){if(last-start>(vertical?44:65))found.push({v:vertical,c,s:start,e:last,len:last-start});start=-1;gap=0;}}}}
scan(false);scan(true);
found.sort((a,b)=>b.len-a.len);
const keep=[];
for(const p of found){if(keep.some(q=>q.v===p.v&&Math.abs(q.c-p.c)<7&&Math.min(q.e,p.e)-Math.max(q.s,p.s)>Math.min(q.len,p.len)*.5))continue;keep.push(p);if(keep.length>=115)break;}
const lines=keep.map(p=>p.v?[p.c,p.e,p.c,p.s]:[p.s,p.c,p.e,p.c]);
const hash=createHash('sha256').update(data).digest('hex').slice(0,10);
await writeFile(output,JSON.stringify({w,h,hash,lines}));
console.log(`Traced ${lines.length} architectural lines in ${w}×${h} artwork (${hash}).`);
