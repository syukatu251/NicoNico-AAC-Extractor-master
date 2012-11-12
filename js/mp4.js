/*
 mp4.js Copyright 2012 - Syu Kato <ukyo.web@gmail.com>
 @version 0.2
 Licensed under the Apache License, Version 2.0 (the "License");
 http://www.apache.org/licenses/LICENSE-2.0
*/
var mp4js=mp4js||{};mp4js.version="0.2";(function(){var i=this;this.isType=function(a,f){return null!=a?a.constructor==f:!1};this.load=function(a,f){var h=new XMLHttpRequest;h.open("GET",a);h.responseType="arraybuffer";h.onreadystatechange=function(){if(4==h.readyState)if(2===~~(h.status/100)||0===h.status)f.call(h,h.response);else throw"Error: "+h.status;};h.send()};this.getUi16=function(a,f){return a[f]<<8|a[f+1]};this.getUi24=function(a,f){return a[f+1]<<16|a[f]<<8|a[f+1]};this.getUi32=function(a,f){return a[f]<<24|a[f+1]<<16|a[f+2]<<
8|a[f+3]};this.getStr=function(a,f,h){for(var d=[],i=0;i<f;++i)d[d.length]=a[h+i];return String.fromCharCode.apply(null,d)};this.putUi16=function(a,f,h){a[h+1]=f&255;a[h]=f>>8};this.putUi24=function(a,f,h){a[h+2]=f&255;a[h+1]=f>>8&255;a[h]=f>>16};this.putUi32=function(a,f,h){a[h+3]=f&255;a[h+2]=f>>8&255;a[h+1]=f>>16&255;a[h]=f>>24};this.putStr=function(a,f,h){for(var d=0,i=f.length;d<i;++d)a[d+h]=f.charCodeAt(d)};this.concatByteArrays=function(a){var a=i.isType(a,Array)?a:Array.prototype.slice.call(arguments,
0),f=0,h=0,d,p;for(d=0,p=a.length;d<p;++d)f+=a[d].length;f=new Uint8Array(f);for(d=0;d<p;++d)f.set(a[d],h),h+=a[d].length;return f}}).call(function(i){i=i||{};i.utils=i.utils||{};return i.utils}(this.mp4js),this);var mp4=mp4||{};mp4.descr=mp4.descr||{};
(function(i,a){var f=this,h=a.putUi16,d=a.putUi24,p=a.putUi32,r=a.putStr,s=a.isType,u=a.concatByteArrays;this.createBaseDescriptor=function(g,b){var c=new Uint8Array(g+2);c[0]=b;c[1]=g;return c};this.createESDescriptor=function(g,b,c,e,a,d,l){var i="string"===typeof e?1:0,o=null!=c?1:0,j=3,k=2,l=null==l?[]:s(l,Array)?l:[l],j=j+(o?2:0)+(i?e.length+1:0),j=j+a.length,j=j+d.length,l=u(l),j=j+l.length,j=f.createBaseDescriptor(j,3);h(j,g,k);k+=2;j[k++]=o<<7|i<<6|b;o&&(h(j,c,k),k+=2);i&&(j[k++]=e.length,
r(j,e,k),k+=e.length);j.set(a,k);k+=a.length;j.set(d,k);k+=d.length;j.set(l,k);return j};this.createDecodeConfigDescriptor=function(g,b,c,e,a,h,l){var i,l=null==l?[]:s(l,Array)?l:[l];i=u(l);l=f.createBaseDescriptor(i.length+13,4);l[2]=g;l[3]=b<<2|c<<1|1;d(l,e,4);p(l,a,7);p(l,h,11);l.set(i,15);return l};this.createDecoderSpecificInfo=function(g){var b=f.createBaseDescriptor(g.length,5);b.set(g,2);return b};this.createSLConfigDescriptor=function(g){var b=f.createBaseDescriptor(1,6);b[2]=g;return b};
this.createInitialObjectDescriptor=function(g,b,c,e,a,d,l,i,o,j){var k="string"===typeof c?1:0,m=2,q=4,o=null==o?[]:s(o,Array)?subDescr:[subDescr],j=null==j?[]:s(j,Array)?extDescr:[extDescr],m=m+(k?c.length+1:5),j=u(j),m=m+j.length;k?(m=f.createBaseDescriptor(m,16),m[q++]=c.length,r(m,c,q)):(c=u(o),m+=c.length,m=f.createBaseDescriptor(m,16),m[q++]=e,m[q++]=a,m[q++]=d,m[q++]=l,m[q++]=i,m.set(c,q));q+=c.length;h(m,g<<6|k<<5|b<<4|15,2);m.set(j,q);return m}}).call(function(i){i=i||{};i.descr=i.descr||
{};return i.descr}(this.mp4js),this,this.mp4js.utils);(function(i,a){var f=this,h=a.putUi16,d=a.putUi32,p=a.putStr,r=a.concatByteArrays,s=a.isType;this.createBox=function(a,g){var b=new Uint8Array(a);d(b,a,0);p(b,g,4);return b};this.createFullBox=function(a,g,b,c){a=f.createBox(a,g);h(a,b,8);h(a,c,10);return a};this.createMp4aBox=function(a,g,b){var c=f.createBox(36+b.length,"mp4a");h(c,a,14);h(c,2,24);h(c,16,26);h(c,g,32);c.set(b,36);return c};this.createEsdsBox=function(a){var g=f.createFullBox(12+a.length,"esds",0,0);g.set(a,12);return g};this.createTkhdBox=
function(a,g,b,c,e){var n=f.createFullBox(92,"tkhd",0,1);d(n,a,12);d(n,g,16);d(n,b,20);d(n,c,28);h(n,!e?256:0,44);d(n,65536,48);d(n,65536,64);d(n,1073741824,80);d(n,e?20971520:0,84);d(n,e?15728640:0,88);return n};this.createMdhdBox=function(a,g,b,c){var e=f.createFullBox(32,"mdhd",0,0);d(e,a,12);d(e,g,16);d(e,b,20);d(e,c,24);h(e,21956,28);return e};this.createHdlrBox=function(a,g){var b=f.createFullBox(32+g.length+1,"hdlr",0,0);p(b,a,16);p(b,g,32);return b};this.concatBoxes=function(a,g){var g=Array.prototype.slice.call(arguments,
1),a=arguments[0],b,c;c=r(g);b=f.createBox(c.length+8,a);b.set(c,8);return b};this.createUrlBox=function(a,g){var b="string"===typeof a?a.length+1:0,c=f.createFullBox(12+b,"url ",0,"undefined"===typeof g?1:g);b&&p(c,a,12);return c};this.createUrnBox=function(a,g,b){return createUrlBox(a+"\x00"+g,b)};this.createDrefBox=function(a){var a=Array.prototype.slice.call(arguments,0),g,b;b=r(a);g=f.createFullBox(b.length+16,"dref",0,0);d(g,12,a.length);g.set(b,16);return g};this.createStszBox=function(a,g){var b=
f.createFullBox(20+4*g.length,"stsz",0,0),c,e;d(b,a,12);d(b,g.length,16);if(0===a)for(c=0,e=g.length;c<e;++c)d(b,g[c],4*c+20);return b};this.createMvhdBox=function(a,g,b,c,e){var n=f.createFullBox(108,"mvhd",0,0);d(n,a,12);d(n,g,16);d(n,b,20);d(n,c,24);d(n,65536,28);h(n,256,32);d(n,65536,44);d(n,65536,60);d(n,1073741824,76);d(n,e,104);return n};this.createIodsBox=function(a){var g=f.createFullBox(a.length+12,"iods",0,0);g.set(a,12);return g};this.createDinfBox=function(a){var a=Array.prototype.slice.call(arguments,
0),g=16,b=16,c,e,n;for(c=0,e=a.length;c<e;++c)g+=a[c].length;n=f.createFullBox(g,"dref",0,0);d(n,e,12);for(c=0;c<e;++c)n.set(a[c],b),b+=a[c].length;g=f.createBox(g+8,"dinf");g.set(n,8);return g};this.createStsdBox=function(a){var a=Array.prototype.slice.call(arguments,0),g,b;b=r(a);g=f.createFullBox(b.length+16,"stsd",0,0);d(g,a.length,12);g.set(b,16);return g};this.createSttsBox=function(a){var g=f.createFullBox(16+8*a.length,"stts",0,0),b=16,c,e;d(g,a.length,12);for(c=0,e=a.length;c<e;++c)d(g,a[c].count,
b),d(g,a[c].duration,b+4),b+=8;return g};this.createStscBox=function(a){var a=s(a,Array)?a:[a],g=a.length,b=f.createFullBox(16+12*g,"stsc",0,0),c,e=16;d(b,g,12);for(c=0;c<g;++c)d(b,a[c].firstChunk,e),e+=4,d(b,a[c].samplesPerChunk,e),e+=4,d(b,a[c].samplesDescriptionIndex,e),e+=4;return b};this.createStcoBox=function(a){var g=a.length,b=f.createFullBox(16+4*g,"stco",0,0),c;d(b,g,12);for(c=0;c<g;++c)d(b,a[c],4*c+16);return b};this.createFreeBox=function(a){var g=f.createBox(8+a.length+1,"free");p(g,
a,8);return g};this.createFtypBox=function(a,g){var b=Array.prototype.slice.call(arguments,0),c=f.createBox(4*b.length+16,"ftyp"),e=16,d,h;p(c,a,8);for(d=0,h=b.length;d<h;++d)p(c,b[d],e),e+=4;return c}}).call(function(i){i=i||{};i.box=i.box||{};return i.box}(this.mp4js),this,this.mp4js.utils);(function(i){function a(a,b,c){for(var e,f={size:c},h=b+c,l,b=b+8;b<h;){c=d(a,b);e=r(a,4,b+4);if(l=boxes[e])f[e]&&!s(f[e],Array)?(f[e]=[f[e]],f[e].push(l(a,b,c))):s(f[e],Array)?f[e].push(l(a,b,c)):f[e]=l(a,b,c);else break;b+=c}return f}var f=i.MozBlobBuilder||i.WebKitBlobBuilder||i.MSBlobBuilder||i.BlobBuilder,h=this.utils.getUi16,d=this.utils.getUi32,p=this.utils.putUi16,r=this.utils.getStr,s=this.utils.isType,u=this.utils.concatByteArrays;self=this;boxes={ID32:a,albm:function(){},auth:function(){},
bpcc:function(){},buff:function(){},bxml:a,ccid:function(){},cdef:function(){},clsf:function(){},cmap:function(){},co64:function(){},colr:function(){},cprt:function(){},crhd:function(){},cslg:function(){},ctts:function(a,b,c){var c={size:c,body:[]},e,f=d(a,b+=12);for(e=0;e<f;++e)c.body.push({compositionOffset:d(a,b+=4),sampleCount:d(a,b+=4)});return c},cvru:function(){},dcfD:function(){},dinf:a,dref:a,dscp:function(){},dsgd:a,dstg:a,edts:a,elst:function(){},feci:function(){},fecr:function(){},fiin:function(){},
fire:function(){},fpar:function(){},free:function(){},frma:a,ftyp:function(){},gitn:function(){},gnre:function(){},grpi:function(){},hdlr:function(a,b,c){return{size:c,type:r(a,4,b+16)}},hmhd:function(){},hpix:function(){},icnu:function(){},idat:function(){},ihdr:function(){},iinf:function(){},iloc:function(){},imif:a,infu:function(){},iods:a,iphd:function(){},ipmc:a,ipro:function(){},iref:function(){},"jp  ":function(){},jp2c:function(){},jp2h:function(){},jp2i:function(){},kywd:function(){},loci:function(){},
lrcu:function(){},m7hd:function(){},mdat:function(a,b,c){return{offset:b,size:c,dataSize:c-8}},mdhd:function(a,b,c){return{size:c,creationTime:d(a,b+12),modificationTime:d(a,b+16),timeScale:d(a,b+20),duration:d(a,b+24),languageCode:d(a,b+28)}},mdia:a,mdri:function(){},meco:a,mehd:a,mere:function(){},meta:a,mfhd:function(){},mfra:function(){},mfro:function(){},minf:a,mjhd:function(){},moof:function(){},moov:a,mvcg:function(){},mvci:function(){},mvex:a,mvhd:function(){},mvra:function(){},nmhd:function(){},
ochd:function(){},odaf:function(){},odda:function(){},odhd:function(){},odhe:function(){},odrb:function(){},odrm:a,odtt:function(){},ohdr:function(){},padb:function(){},paen:function(){},pclr:function(){},pdin:function(){},perf:function(){},pitm:function(){},"res ":function(){},resc:function(){},resd:function(){},rtng:function(){},sbgp:a,schi:a,schm:a,sdep:function(){},sdhd:function(){},sdtp:a,sdvp:a,segr:function(){},sgpd:a,sidx:a,sinf:a,skip:function(){},smhd:function(){},srmb:function(){},srmc:a,
srpp:function(){},stbl:a,stco:function(a,b,c){var c={size:c,body:[]},e,f=d(a,b+=12);for(e=0;e<f;++e)c.body.push(d(a,b+=4));return c},stdp:function(){},stsc:function(a,b,c){var c={size:c,body:[]},e,f=d(a,b+=12);for(e=0;e<f;++e)c.body.push({firstChunk:d(a,b+=4),samplesPerChunk:d(a,b+=4),sampleDescriptionIndex:d(a,b+=4)});return c},stsd:function(g,b,c){return a(g,b+8,c-8)},stsh:function(){},stss:function(){},stts:function(a,b,c){return{size:c,entryCount:d(a,b+12),sampleCount:d(a,b+16),sampleDelta:d(a,
b+20)}},styp:a,stsz:function(a,b,c){var c={size:c,body:[]},e,f=d(a,b+=16);for(e=0;e<f;++e)c.body.push(d(a,b+=4));return c},stz2:function(){},subs:function(){},swtc:function(){},tfad:a,tfhd:function(){},tfma:a,tfra:function(){},tibr:function(){},tiri:function(){},titl:function(){},tkhd:function(){},traf:function(){},trak:a,tref:a,trex:function(){},trgr:function(){},trun:function(){},tsel:function(){},udta:a,uinf:function(){},UITS:function(){},ulst:function(){},"url ":function(){},vmhd:function(){},
vwdi:function(){},"xml ":function(){},yrrc:function(){},mp4a:function(a,b){return{dataReferenceIndex:d(a,b+=12),channels:h(a,b+=12),bitPerSample:h(a,b+=2),sampleRate:d(a,b+=4),esds:{objectTypeIndication:a[b+=25],bufferSizeDB:h(a,b+=3),maxBitrate:d(a,b+=2),avgBitrate:d(a,b+4)}}}};SAMPLERATE_TABLE=[96E3,88200,64E3,48E3,44100,32E3,24E3,22050,16E3,12E3,11025,8E3];this.Mp4=function(a){this.bytes=s(a,ArrayBuffer)?new Uint8Array(a):a;this.cache={}};this.Mp4.prototype={parse:function(){return this.cache.tree?
this.cache.tree:this.cache.tree=a(this.bytes,-8,this.bytes.length)},extractAACAsArrayBuffer:function(){var a=this.parse().moov.trak,b,c,e,d,f,h,i,o,j,k,m,q,p,v=0,r=0,t=new Uint8Array(new ArrayBuffer(7));if(s(a,Array))a.forEach(function(a){"soun"===a.mdia.hdlr.type&&(b=a)});else if("soun"===a.mdia.hdlr.type)b=a;else throw"This file does not have audio files.";a=b.mdia.minf.stbl.stsd.mp4a;c=b.mdia.minf.stbl.stsc.body;e=b.mdia.minf.stbl.stsz.body;d=b.mdia.minf.stbl.stco.body;p=new Uint8Array(7*e.length+
e.reduce(function(a,b){return a+b}));t[0]=255;t[1]=249;t[2]=64|SAMPLERATE_TABLE.indexOf(a.sampleRate)<<2|a.channels>>2;t[6]=252;for(f=0,q=0,o=c.length;f<o;++f){h=c[f].firstChunk-1;for(j=f+1<o?c[f+1].firstChunk-1:d.length;h<j;++h){r=d[h];for(i=0,k=c[f].samplesPerChunk;i<k;++i,++q)m=e[q]+7,t[3]=a.channels<<6|m>>11,t[4]=m>>3,t[5]=m<<5|31,p.set(t,v),v+=7,p.set(this.bytes.subarray(r,r+=e[q]),v),v+=e[q]}}return p.buffer},extractAACAsBlob:function(){var a=new f;a.append(this.extractAACAsArrayBuffer());return a.getBlob("audio/aac")}};
this.aacToM4a=function(a){function b(a){return(c[a+3]&3)<<11|c[a+4]<<3|c[a+5]>>5}var c=new Uint8Array(a),e=0,a=0,d=[],f=[],h=Date.now(),i,o,j,k,m,q,r,s,w,t,x,y;i=SAMPLERATE_TABLE[(c[2]&60)>>2];for(j=(c[2]&1)<<2|c[3]>>6;e<c.length;)f[a]=e,d[a++]=b(e)-7,e+=b(e);e=a;k=self.descr.createInitialObjectDescriptor(1,0,null,255,255,41,255,255);o=new Uint8Array(2);p(o,4096|SAMPLERATE_TABLE.indexOf(i)<<7|j<<3,0);j=self.descr.createDecoderSpecificInfo(o);o=self.descr.createDecodeConfigDescriptor(64,5,0,0,0,0,
[j]);j=self.descr.createSLConfigDescriptor(2);j=self.descr.createESDescriptor(0,0,null,null,o,j,[]);j=self.box.createEsdsBox(j);o=self.box.createMp4aBox(1,i,j);j=self.box.createFtypBox("M4A ","isom","mp42");m=self.box.createSttsBox([{count:a,duration:1024}]);q=self.box.createStscBox({firstChunk:1,samplesPerChunk:e,samplesDescriptionIndex:1});r=self.box.createStszBox(0,d);s=self.box.createStsdBox(o);w=self.box.createDinfBox(self.box.createUrlBox(null,1));t=self.box.createBox(16,"smhd");x=self.box.createMdhdBox(h,
h,i,1024*a);y=self.box.createHdlrBox("soun","mp4.js Audio Handler");o=self.box.createTkhdBox(h,h,1,~~(614400*a/i));k=self.box.createIodsBox(k);i=self.box.createMvhdBox(h,h,600,~~(614400*a/i),2);h=d.reduce(function(a,b){return a+b});dataStart=j.length+m.length+q.length+r.length+s.length+w.length+t.length+x.length+y.length+o.length+k.length+i.length;dataStart+=48;dataStart+=4*~~(d.length/e)+16;e=self.box.createStcoBox([dataStart]);e=self.box.concatBoxes("stbl",s,m,q,r,e);e=self.box.concatBoxes("minf",
t,w,e);e=self.box.concatBoxes("mdia",x,y,e);e=self.box.concatBoxes("trak",o,e);moov=self.box.concatBoxes("moov",i,k,e);e=self.box.createBox(h+8,"mdat");h=0;i=8;for(k=0;k<a;++k)h=f[k],e.set(c.subarray(h+7,h+7+d[k]),i),i+=d[k];a=self.box.createFreeBox("Produced with mp4.js "+self.version);return u(j,moov,e,a).buffer}}).call(this.mp4js,this);
