// Small standards-based ZIP writer (stored entries, UTF-8 names, CRC32).
const encoder=new TextEncoder()
const table=Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0})
const crc32=bytes=>{let c=0xffffffff;for(const b of bytes)c=table[(c^b)&255]^(c>>>8);return(c^0xffffffff)>>>0}
export function zipEntries(entries) {
 const locals=[],centrals=[];let offset=0
 for(const [filename,value] of entries){
  const name=encoder.encode(filename),body=typeof value==='string'?encoder.encode(value):value,crc=crc32(body)
  const local=new Uint8Array(30+name.length),lv=new DataView(local.buffer)
  lv.setUint32(0,0x04034b50,true);lv.setUint16(4,20,true);lv.setUint16(6,0x800,true);lv.setUint16(12,33,true);lv.setUint32(14,crc,true);lv.setUint32(18,body.length,true);lv.setUint32(22,body.length,true);lv.setUint16(26,name.length,true);local.set(name,30)
  const central=new Uint8Array(46+name.length),cv=new DataView(central.buffer)
  cv.setUint32(0,0x02014b50,true);cv.setUint16(4,20,true);cv.setUint16(6,20,true);cv.setUint16(8,0x800,true);cv.setUint16(14,33,true);cv.setUint32(16,crc,true);cv.setUint32(20,body.length,true);cv.setUint32(24,body.length,true);cv.setUint16(28,name.length,true);cv.setUint32(42,offset,true);central.set(name,46)
  locals.push(local,body);centrals.push(central);offset+=local.length+body.length
 }
 const size=centrals.reduce((n,b)=>n+b.length,0),end=new Uint8Array(22),ev=new DataView(end.buffer)
 ev.setUint32(0,0x06054b50,true);ev.setUint16(8,entries.length,true);ev.setUint16(10,entries.length,true);ev.setUint32(12,size,true);ev.setUint32(16,offset,true)
 const result=new Uint8Array(offset+size+22);let cursor=0
 for(const chunk of [...locals,...centrals,end]){result.set(chunk,cursor);cursor+=chunk.length}
 return result
}
