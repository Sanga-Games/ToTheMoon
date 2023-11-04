/**
 * Minified by jsDelivr using UglifyJS v3.1.10.
 * Original file: /npm/lzma@2.3.2/src/lzma_worker.js
 * 
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
var LZMA=function(){"use strict";function e(e,r){postMessage({action:De,cbn:r,result:e})}function r(e){var r=[];return r[e-1]=void 0,r}function t(e,r){return s(e[0]+r[0],e[1]+r[1])}function o(e,r){return function(e,r){var t,o;t=e*we,o=r,r<0&&(o+=we);return[o,t]}(~~Math.max(Math.min(e[1]/we,2147483647),-2147483648)&~~Math.max(Math.min(r[1]/we,2147483647),-2147483648),a(e)&a(r))}function n(e,r){var t,o;return e[0]==r[0]&&e[1]==r[1]?0:(t=e[1]<0,o=r[1]<0,t&&!o?-1:!t&&o?1:m(e,r)[1]<0?-1:1)}function s(e,r){var t,o;for(e%=0x10000000000000000,r=(r%=0x10000000000000000)-(t=r%we)+(o=Math.floor(e/we)*we),e=e-o+t;e<0;)e+=we,r-=we;for(;e>4294967295;)e-=we,r+=we;for(r%=0x10000000000000000;r>0x7fffffff00000000;)r-=0x10000000000000000;for(;r<-0x8000000000000000;)r+=0x10000000000000000;return[e,r]}function i(e,r){return e[0]==r[0]&&e[1]==r[1]}function _(e){return e>=0?[e,0]:[e+we,-we]}function a(e){return e[0]>=2147483648?~~Math.max(Math.min(e[0]-we,2147483647),-2147483648):~~Math.max(Math.min(e[0],2147483647),-2147483648)}function c(e){return e<=30?1<<e:c(30)*c(e-30)}function u(e,r){var t,o,n,s;if(r&=63,i(e,Le))return r?ye:e;if(e[1]<0)throw new Error("Neg");return s=c(r),o=e[1]*s%0x10000000000000000,n=e[0]*s,t=n-n%we,o+=t,n-=t,o>=0x8000000000000000&&(o-=0x10000000000000000),[n,o]}function f(e,r){var t;return r&=63,t=c(r),s(Math.floor(e[0]/t),e[1]/t)}function m(e,r){return s(e[0]-r[0],e[1]-r[1])}function d(e,r){return e.buf=r,e.pos=0,e.count=r.length,e}function p(e){return e.pos>=e.count?-1:255&e.buf[e.pos++]}function h(e,r,t,o){return e.pos>=e.count?-1:(o=Math.min(o,e.count-e.pos),S(e.buf,e.pos,r,t,o),e.pos+=o,o)}function P(e){return e.buf=r(32),e.count=0,e}function l(e){var r=e.buf;return r.length=e.count,r}function v(e,r){e.buf[e.count++]=r<<24>>24}function B(e,r,t,o){S(r,t,e.buf,e.count,o),e.count+=o}function S(e,r,t,o,n){for(var s=0;s<n;++s)t[o+s]=e[r+s]}function g(e,t,o,s,i){var _,c;if(n(s,Ee)<0)throw new Error("invalid length "+s);for(e.length_0=s,function(e,r){!function(e,r){e._dictionarySize=r;for(var t=0;r>1<<t;++t);e._distTableSize=2*t}(r,1<<e.s),r._numFastBytes=e.f,function(e,r){var t=e._matchFinderType;e._matchFinderType=r,e._matchFinder&&t!=e._matchFinderType&&(e._dictionarySizePrev=-1,e._matchFinder=null)}(r,e.m),r._numLiteralPosStateBits=0,r._numLiteralContextBits=3,r._posStateBits=2,r._posStateMask=3}(i,_=function(e){var t;for(e._repDistances=r(4),e._optimum=[],e._rangeEncoder={},e._isMatch=r(192),e._isRep=r(12),e._isRepG0=r(12),e._isRepG1=r(12),e._isRepG2=r(12),e._isRep0Long=r(192),e._posSlotEncoder=[],e._posEncoders=r(114),e._posAlignEncoder=ue({},4),e._lenEncoder=re({}),e._repMatchLenEncoder=re({}),e._literalEncoder={},e._matchDistances=[],e._posSlotPrices=[],e._distancesPrices=[],e._alignPrices=r(16),e.reps=r(4),e.repLens=r(4),e.processedInSize=[ye],e.processedOutSize=[ye],e.finished=[0],e.properties=r(5),e.tempPrices=r(128),e._longestMatchLength=0,e._matchFinderType=1,e._numDistancePairs=0,e._numFastBytesPrev=-1,e.backRes=0,t=0;t<4096;++t)e._optimum[t]={};for(t=0;t<4;++t)e._posSlotEncoder[t]=ue({},6);return e}({})),_._writeEndMark=void 0===LZMA.disableEndMark,function(e,r){e.properties[0]=9*(5*e._posStateBits+e._numLiteralPosStateBits)+e._numLiteralContextBits<<24>>24;for(var t=0;t<4;++t)e.properties[1+t]=e._dictionarySize>>8*t<<24>>24;B(r,e.properties,0,5)}(_,o),c=0;c<64;c+=8)v(o,255&a(f(s,c)));e.chunker=(_._needReleaseMFStream=0,_._inStream=t,_._finished=0,function(e){var t,o;e._matchFinder||(t={},o=4,e._matchFinderType||(o=2),function(e,r){e.HASH_ARRAY=r>2,e.HASH_ARRAY?(e.kNumHashDirectBytes=0,e.kMinMatchCheck=4,e.kFixHashSize=66560):(e.kNumHashDirectBytes=2,e.kMinMatchCheck=3,e.kFixHashSize=0)}(t,o),e._matchFinder=t);if(function(e,t,o){var n,s;if(null==e.m_Coders||e.m_NumPrevBits!=o||e.m_NumPosBits!=t)for(e.m_NumPosBits=t,e.m_PosMask=(1<<t)-1,e.m_NumPrevBits=o,s=1<<e.m_NumPrevBits+e.m_NumPosBits,e.m_Coders=r(s),n=0;n<s;++n)e.m_Coders[n]=function(e){return e.m_Encoders=r(768),e}({})}(e._literalEncoder,e._numLiteralPosStateBits,e._numLiteralContextBits),e._dictionarySize==e._dictionarySizePrev&&e._numFastBytesPrev==e._numFastBytes)return;(function(e,t,o,n,s){var i,_;t<1073741567&&(e._cutValue=16+(n>>1),function(e,t,o,n){var s;e._keepSizeBefore=t,e._keepSizeAfter=o,s=t+o+n,(null==e._bufferBase||e._blockSize!=s)&&(e._bufferBase=null,e._blockSize=s,e._bufferBase=r(e._blockSize));e._pointerToLastSafePosition=e._blockSize-o}(e,t+o,n+s,256+~~((t+o+n+s)/2)),e._matchMaxLen=n,i=t+1,e._cyclicBufferSize!=i&&(e._son=r(2*(e._cyclicBufferSize=i))),_=65536,e.HASH_ARRAY&&(_=t-1,_|=_>>1,_|=_>>2,_|=_>>4,_|=_>>8,_>>=1,(_|=65535)>16777216&&(_>>=1),e._hashMask=_,++_,_+=e.kFixHashSize),_!=e._hashSizeSum&&(e._hash=r(e._hashSizeSum=_)))})(e._matchFinder,e._dictionarySize,4096,e._numFastBytes,274),e._dictionarySizePrev=e._dictionarySize,e._numFastBytesPrev=e._numFastBytes}(_),_._rangeEncoder.Stream=o,function(e){(function(e){e._state=0,e._previousByte=0;for(var r=0;r<4;++r)e._repDistances[r]=0})(e),function(e){e._position=ye,e.Low=ye,e.Range=-1,e._cacheSize=1,e._cache=0}(e._rangeEncoder),he(e._isMatch),he(e._isRep0Long),he(e._isRep),he(e._isRepG0),he(e._isRepG1),he(e._isRepG2),he(e._posEncoders),function(e){var r,t=1<<e.m_NumPrevBits+e.m_NumPosBits;for(r=0;r<t;++r)he(e.m_Coders[r].m_Encoders)}(e._literalEncoder);for(var r=0;r<4;++r)he(e._posSlotEncoder[r].Models);U(e._lenEncoder,1<<e._posStateBits),U(e._repMatchLenEncoder,1<<e._posStateBits),he(e._posAlignEncoder.Models),e._longestMatchWasFound=0,e._optimumEndIndex=0,e._optimumCurrentIndex=0,e._additionalOffset=0}(_),Y(_),Z(_),_._lenEncoder._tableSize=_._numFastBytes+1-2,oe(_._lenEncoder,1<<_._posStateBits),_._repMatchLenEncoder._tableSize=_._numFastBytes+1-2,oe(_._repMatchLenEncoder,1<<_._posStateBits),_.nowPos64=ye,function(e,r){return e.encoder=r,e.decoder=null,e.alive=1,e}({},_))}function k(e,r,t){return e.output=P({}),g(e,d({},r),e.output,_(r.length),t),e}function R(e,t,o){var n,s,i,a,c="",u=[];for(s=0;s<5;++s){if(-1==(i=p(t)))throw new Error("truncated input");u[s]=i<<24>>24}if(n=function(e){e.m_OutWindow={},e.m_RangeDecoder={},e.m_IsMatchDecoders=r(192),e.m_IsRepDecoders=r(12),e.m_IsRepG0Decoders=r(12),e.m_IsRepG1Decoders=r(12),e.m_IsRepG2Decoders=r(12),e.m_IsRep0LongDecoders=r(192),e.m_PosSlotDecoder=r(4),e.m_PosDecoders=r(114),e.m_PosAlignDecoder=ae({},4),e.m_LenDecoder=G({}),e.m_RepLenDecoder=G({}),e.m_LiteralDecoder={};for(var t=0;t<4;++t)e.m_PosSlotDecoder[t]=ae({},6);return e}({}),!function(e,t){var o,n,s,i,_,a,c;if(t.length<5)return 0;for(c=255&t[0],s=c%9,i=(a=~~(c/9))%5,_=~~(a/5),o=0,n=0;n<4;++n)o+=(255&t[1+n])<<8*n;if(o>99999999||!function(e,t,o,n){if(t>8||o>4||n>4)return 0;!function(e,t,o){var n,s;if(null!=e.m_Coders&&e.m_NumPrevBits==o&&e.m_NumPosBits==t)return;for(e.m_NumPosBits=t,e.m_PosMask=(1<<t)-1,e.m_NumPrevBits=o,s=1<<e.m_NumPrevBits+e.m_NumPosBits,e.m_Coders=r(s),n=0;n<s;++n)e.m_Coders[n]=function(e){return e.m_Decoders=r(768),e}({})}(e.m_LiteralDecoder,o,t);var s=1<<n;return A(e.m_LenDecoder,s),A(e.m_RepLenDecoder,s),e.m_PosStateMask=s-1,1}(e,s,i,_))return 0;return function(e,t){if(t<0)return 0;e.m_DictionarySize!=t&&(e.m_DictionarySize=t,e.m_DictionarySizeCheck=Math.max(e.m_DictionarySize,1),function(e,t){null!=e._buffer&&e._windowSize==t||(e._buffer=r(t));e._windowSize=t,e._pos=0,e._streamPos=0}(e.m_OutWindow,Math.max(e.m_DictionarySizeCheck,4096)));return 1}(e,o)}(n,u))throw new Error("corrupted input");for(s=0;s<64;s+=8){if(-1==(i=p(t)))throw new Error("truncated input");1==(i=i.toString(16)).length&&(i="0"+i),c=i+""+c}/^0+$|^f+$/i.test(c)?e.length_0=Ee:(a=parseInt(c,16),e.length_0=a>4294967295?Ee:_(a)),e.chunker=function(e,r,t,o){return e.m_RangeDecoder.Stream=r,I(e.m_OutWindow),e.m_OutWindow._stream=t,function(e){e.m_OutWindow._streamPos=0,e.m_OutWindow._pos=0,he(e.m_IsMatchDecoders),he(e.m_IsRep0LongDecoders),he(e.m_IsRepDecoders),he(e.m_IsRepG0Decoders),he(e.m_IsRepG1Decoders),he(e.m_IsRepG2Decoders),he(e.m_PosDecoders),function(e){var r,t;for(t=1<<e.m_NumPrevBits+e.m_NumPosBits,r=0;r<t;++r)he(e.m_Coders[r].m_Decoders)}(e.m_LiteralDecoder);for(var r=0;r<4;++r)he(e.m_PosSlotDecoder[r].Models);W(e.m_LenDecoder),W(e.m_RepLenDecoder),he(e.m_PosAlignDecoder.Models),function(e){e.Code=0,e.Range=-1;for(var r=0;r<5;++r)e.Code=e.Code<<8|p(e.Stream)}(e.m_RangeDecoder)}(e),e.state=0,e.rep0=0,e.rep1=0,e.rep2=0,e.rep3=0,e.outSize=o,e.nowPos64=ye,e.prevByte=0,function(e,r){return e.decoder=r,e.encoder=null,e.alive=1,e}({},e)}(n,t,o,e.length_0)}function M(e,r){return e.output=P({}),R(e,d({},r),e.output),e}function D(e,r){return e._bufferBase[e._bufferOffset+e._pos+r]}function b(e,r,t,o){var n,s;for(e._streamEndWasReached&&e._pos+r+o>e._streamPos&&(o=e._streamPos-(e._pos+r)),++t,s=e._bufferOffset+e._pos+r,n=0;n<o&&e._bufferBase[s+n]==e._bufferBase[s+n-t];++n);return n}function w(e){return e._streamPos-e._pos}function E(e){var r,t;if(!e._streamEndWasReached)for(;;){if(!(t=-e._bufferOffset+e._blockSize-e._streamPos))return;if(-1==(r=h(e._stream,e._bufferBase,e._bufferOffset+e._streamPos,t)))return e._posLimit=e._streamPos,e._bufferOffset+e._posLimit>e._pointerToLastSafePosition&&(e._posLimit=e._pointerToLastSafePosition-e._bufferOffset),void(e._streamEndWasReached=1);e._streamPos+=r,e._streamPos>=e._pos+e._keepSizeAfter&&(e._posLimit=e._streamPos-e._keepSizeAfter)}}function L(e,r){e._bufferOffset+=r,e._posLimit-=r,e._pos-=r,e._streamPos-=r}function y(e){var r;++e._cyclicBufferPos>=e._cyclicBufferSize&&(e._cyclicBufferPos=0),function(e){++e._pos,e._pos>e._posLimit&&(e._bufferOffset+e._pos>e._pointerToLastSafePosition&&function(e){var r,t,o;for((o=e._bufferOffset+e._pos-e._keepSizeBefore)>0&&--o,t=e._bufferOffset+e._streamPos-o,r=0;r<t;++r)e._bufferBase[r]=e._bufferBase[o+r];e._bufferOffset-=o}(e),E(e))}(e),1073741823==e._pos&&(r=e._pos-e._cyclicBufferSize,C(e._son,2*e._cyclicBufferSize,r),C(e._hash,e._hashSizeSum,r),L(e,r))}function C(e,r,t){var o,n;for(o=0;o<r;++o)(n=e[o]||0)<=t?n=0:n-=t,e[o]=n}function z(e){var r=e._pos-e._streamPos;r&&(B(e._stream,e._buffer,e._streamPos,r),e._pos>=e._windowSize&&(e._pos=0),e._streamPos=e._pos)}function F(e,r){var t=e._pos-r-1;return t<0&&(t+=e._windowSize),e._buffer[t]}function I(e){z(e),e._stream=null}function x(e){return(e-=2)<4?e:3}function N(e){return e<4?0:e<10?e-3:e-6}function O(e){if(!e.alive)throw new Error("bad state");return e.encoder?function(e){(function(e,r,o,s){var c,u,f,d,p,h,P,l,v,B,S,g,k,R,M;if(r[0]=ye,o[0]=ye,s[0]=1,e._inStream&&(e._matchFinder._stream=e._inStream,function(e){e._bufferOffset=0,e._pos=0,e._streamPos=0,e._streamEndWasReached=0,E(e),e._cyclicBufferPos=0,L(e,-1)}(e._matchFinder),e._needReleaseMFStream=1,e._inStream=null),!e._finished){if(e._finished=1,R=e.nowPos64,i(e.nowPos64,ye)){if(!w(e._matchFinder))return void V(e,a(e.nowPos64));q(e),k=a(e.nowPos64)&e._posStateMask,Pe(e._rangeEncoder,e._isMatch,(e._state<<4)+k,0),e._state=N(e._state),f=D(e._matchFinder,-e._additionalOffset),se(ne(e._literalEncoder,a(e.nowPos64),e._previousByte),e._rangeEncoder,f),e._previousByte=f,--e._additionalOffset,e.nowPos64=t(e.nowPos64,Ce)}if(w(e._matchFinder))for(;;){if(P=function(e,r){var t,o,n,s,i,_,a,c,u,f,m,d,p,h,P,l,v,B,S,g,k,R,M,E,L,y,C,z,F,I,x,O,A,H,G,W,Z,Y,V,J,Q,U,X,ee,re;if(e._optimumEndIndex!=e._optimumCurrentIndex)return p=e._optimum[e._optimumCurrentIndex].PosPrev-e._optimumCurrentIndex,e.backRes=e._optimum[e._optimumCurrentIndex].BackPrev,e._optimumCurrentIndex=e._optimum[e._optimumCurrentIndex].PosPrev,p;if(e._optimumCurrentIndex=e._optimumEndIndex=0,e._longestMatchWasFound?(d=e._longestMatchLength,e._longestMatchWasFound=0):d=q(e),C=e._numDistancePairs,(L=w(e._matchFinder)+1)<2)return e.backRes=-1,1;for(L>273&&(L=273),J=0,u=0;u<4;++u)e.reps[u]=e._repDistances[u],e.repLens[u]=b(e._matchFinder,-1,e.reps[u],273),e.repLens[u]>e.repLens[J]&&(J=u);if(e.repLens[J]>=e._numFastBytes)return e.backRes=J,p=e.repLens[J],K(e,p-1),p;if(d>=e._numFastBytes)return e.backRes=e._matchDistances[C-1]+4,K(e,d-1),d;if(a=D(e._matchFinder,-1),v=D(e._matchFinder,-e._repDistances[0]-1-1),d<2&&a!=v&&e.repLens[J]<2)return e.backRes=-1,1;if(e._optimum[0].State=e._state,H=r&e._posStateMask,e._optimum[1].Price=Ie[e._isMatch[(e._state<<4)+H]>>>2]+ie(ne(e._literalEncoder,r,e._previousByte),e._state>=7,v,a),_e(e._optimum[1]),B=Ie[2048-e._isMatch[(e._state<<4)+H]>>>2],V=B+Ie[2048-e._isRep[e._state]>>>2],v==a&&(Q=V+function(e,r,t){return Ie[e._isRepG0[r]>>>2]+Ie[e._isRep0Long[(r<<4)+t]>>>2]}(e,e._state,H))<e._optimum[1].Price&&(e._optimum[1].Price=Q,function(e){e.BackPrev=0,e.Prev1IsChar=0}(e._optimum[1])),(m=d>=e.repLens[J]?d:e.repLens[J])<2)return e.backRes=e._optimum[1].BackPrev,1;e._optimum[1].PosPrev=0,e._optimum[0].Backs0=e.reps[0],e._optimum[0].Backs1=e.reps[1],e._optimum[0].Backs2=e.reps[2],e._optimum[0].Backs3=e.reps[3],f=m;do{e._optimum[f--].Price=268435455}while(f>=2);for(u=0;u<4;++u)if(!((Y=e.repLens[u])<2)){W=V+$(e,u,e._state,H);do{s=W+te(e._repMatchLenEncoder,Y-2,H),x=e._optimum[Y],s<x.Price&&(x.Price=s,x.PosPrev=0,x.BackPrev=u,x.Prev1IsChar=0)}while(--Y>=2)}if(E=B+Ie[e._isRep[e._state]>>>2],(f=e.repLens[0]>=2?e.repLens[0]+1:2)<=d){for(z=0;f>e._matchDistances[z];)z+=2;for(;c=e._matchDistances[z+1],s=E+j(e,c,f,H),x=e._optimum[f],s<x.Price&&(x.Price=s,x.PosPrev=0,x.BackPrev=c+4,x.Prev1IsChar=0),f!=e._matchDistances[z]||(z+=2)!=C;++f);}for(t=0;;){if(++t==m)return T(e,t);if(S=q(e),C=e._numDistancePairs,S>=e._numFastBytes)return e._longestMatchLength=S,e._longestMatchWasFound=1,T(e,t);if(++r,A=e._optimum[t].PosPrev,e._optimum[t].Prev1IsChar?(--A,e._optimum[t].Prev2?(X=e._optimum[e._optimum[t].PosPrev2].State,X=e._optimum[t].BackPrev2<4?X<7?8:11:X<7?7:10):X=e._optimum[A].State,X=N(X)):X=e._optimum[A].State,A==t-1?X=e._optimum[t].BackPrev?N(X):X<7?9:11:(e._optimum[t].Prev1IsChar&&e._optimum[t].Prev2?(A=e._optimum[t].PosPrev2,O=e._optimum[t].BackPrev2,X=X<7?8:11):(O=e._optimum[t].BackPrev,X=O<4?X<7?8:11:X<7?7:10),I=e._optimum[A],O<4?O?1==O?(e.reps[0]=I.Backs1,e.reps[1]=I.Backs0,e.reps[2]=I.Backs2,e.reps[3]=I.Backs3):2==O?(e.reps[0]=I.Backs2,e.reps[1]=I.Backs0,e.reps[2]=I.Backs1,e.reps[3]=I.Backs3):(e.reps[0]=I.Backs3,e.reps[1]=I.Backs0,e.reps[2]=I.Backs1,e.reps[3]=I.Backs2):(e.reps[0]=I.Backs0,e.reps[1]=I.Backs1,e.reps[2]=I.Backs2,e.reps[3]=I.Backs3):(e.reps[0]=O-4,e.reps[1]=I.Backs0,e.reps[2]=I.Backs1,e.reps[3]=I.Backs2)),e._optimum[t].State=X,e._optimum[t].Backs0=e.reps[0],e._optimum[t].Backs1=e.reps[1],e._optimum[t].Backs2=e.reps[2],e._optimum[t].Backs3=e.reps[3],_=e._optimum[t].Price,a=D(e._matchFinder,-1),v=D(e._matchFinder,-e.reps[0]-1-1),H=r&e._posStateMask,o=_+Ie[e._isMatch[(X<<4)+H]>>>2]+ie(ne(e._literalEncoder,r,D(e._matchFinder,-2)),X>=7,v,a),R=e._optimum[t+1],g=0,o<R.Price&&(R.Price=o,R.PosPrev=t,R.BackPrev=-1,R.Prev1IsChar=0,g=1),B=_+Ie[2048-e._isMatch[(X<<4)+H]>>>2],V=B+Ie[2048-e._isRep[X]>>>2],v!=a||R.PosPrev<t&&!R.BackPrev||(Q=V+(Ie[e._isRepG0[X]>>>2]+Ie[e._isRep0Long[(X<<4)+H]>>>2]))<=R.Price&&(R.Price=Q,R.PosPrev=t,R.BackPrev=0,R.Prev1IsChar=0,g=1),y=w(e._matchFinder)+1,y=4095-t<y?4095-t:y,!((L=y)<2)){if(L>e._numFastBytes&&(L=e._numFastBytes),!g&&v!=a&&(re=Math.min(y-1,e._numFastBytes),(P=b(e._matchFinder,0,e.reps[0],re))>=2)){for(ee=N(X),G=r+1&e._posStateMask,M=o+Ie[2048-e._isMatch[(ee<<4)+G]>>>2]+Ie[2048-e._isRep[ee]>>>2],F=t+1+P;m<F;)e._optimum[++m].Price=268435455;s=M+(te(e._repMatchLenEncoder,P-2,G)+$(e,0,ee,G)),x=e._optimum[F],s<x.Price&&(x.Price=s,x.PosPrev=t+1,x.BackPrev=0,x.Prev1IsChar=1,x.Prev2=0)}for(U=2,Z=0;Z<4;++Z)if(!((h=b(e._matchFinder,-1,e.reps[Z],L))<2)){l=h;do{for(;m<t+h;)e._optimum[++m].Price=268435455;s=V+(te(e._repMatchLenEncoder,h-2,H)+$(e,Z,X,H)),x=e._optimum[t+h],s<x.Price&&(x.Price=s,x.PosPrev=t,x.BackPrev=Z,x.Prev1IsChar=0)}while(--h>=2);if(h=l,Z||(U=h+1),h<y&&(re=Math.min(y-1-h,e._numFastBytes),(P=b(e._matchFinder,h,e.reps[Z],re))>=2)){for(ee=X<7?8:11,G=r+h&e._posStateMask,n=V+(te(e._repMatchLenEncoder,h-2,H)+$(e,Z,X,H))+Ie[e._isMatch[(ee<<4)+G]>>>2]+ie(ne(e._literalEncoder,r+h,D(e._matchFinder,h-1-1)),1,D(e._matchFinder,h-1-(e.reps[Z]+1)),D(e._matchFinder,h-1)),ee=N(ee),G=r+h+1&e._posStateMask,k=n+Ie[2048-e._isMatch[(ee<<4)+G]>>>2],M=k+Ie[2048-e._isRep[ee]>>>2],F=h+1+P;m<t+F;)e._optimum[++m].Price=268435455;s=M+(te(e._repMatchLenEncoder,P-2,G)+$(e,0,ee,G)),x=e._optimum[t+F],s<x.Price&&(x.Price=s,x.PosPrev=t+h+1,x.BackPrev=0,x.Prev1IsChar=1,x.Prev2=1,x.PosPrev2=t,x.BackPrev2=Z)}}if(S>L){for(S=L,C=0;S>e._matchDistances[C];C+=2);e._matchDistances[C]=S,C+=2}if(S>=U){for(E=B+Ie[e._isRep[X]>>>2];m<t+S;)e._optimum[++m].Price=268435455;for(z=0;U>e._matchDistances[z];)z+=2;for(h=U;;++h)if(i=e._matchDistances[z+1],s=E+j(e,i,h,H),x=e._optimum[t+h],s<x.Price&&(x.Price=s,x.PosPrev=t,x.BackPrev=i+4,x.Prev1IsChar=0),h==e._matchDistances[z]){if(h<y&&(re=Math.min(y-1-h,e._numFastBytes),(P=b(e._matchFinder,h,i,re))>=2)){for(ee=X<7?7:10,G=r+h&e._posStateMask,n=s+Ie[e._isMatch[(ee<<4)+G]>>>2]+ie(ne(e._literalEncoder,r+h,D(e._matchFinder,h-1-1)),1,D(e._matchFinder,h-(i+1)-1),D(e._matchFinder,h-1)),ee=N(ee),G=r+h+1&e._posStateMask,k=n+Ie[2048-e._isMatch[(ee<<4)+G]>>>2],M=k+Ie[2048-e._isRep[ee]>>>2],F=h+1+P;m<t+F;)e._optimum[++m].Price=268435455;s=M+(te(e._repMatchLenEncoder,P-2,G)+$(e,0,ee,G)),x=e._optimum[t+F],s<x.Price&&(x.Price=s,x.PosPrev=t+h+1,x.BackPrev=0,x.Prev1IsChar=1,x.Prev2=1,x.PosPrev2=t,x.BackPrev2=i+4)}if((z+=2)==C)break}}}}}(e,a(e.nowPos64)),B=e.backRes,k=a(e.nowPos64)&e._posStateMask,u=(e._state<<4)+k,1==P&&-1==B)Pe(e._rangeEncoder,e._isMatch,u,0),f=D(e._matchFinder,-e._additionalOffset),M=ne(e._literalEncoder,a(e.nowPos64),e._previousByte),e._state<7?se(M,e._rangeEncoder,f):(v=D(e._matchFinder,-e._repDistances[0]-1-e._additionalOffset),function(e,r,t,o){var n,s,i,_,a=1,c=1;for(s=7;s>=0;--s)n=o>>s&1,_=c,a&&(_+=1+(i=t>>s&1)<<8,a=i==n),Pe(r,e.m_Encoders,_,n),c=c<<1|n}(M,e._rangeEncoder,v,f)),e._previousByte=f,e._state=N(e._state);else{if(Pe(e._rangeEncoder,e._isMatch,u,1),B<4){if(Pe(e._rangeEncoder,e._isRep,e._state,1),B?(Pe(e._rangeEncoder,e._isRepG0,e._state,1),1==B?Pe(e._rangeEncoder,e._isRepG1,e._state,0):(Pe(e._rangeEncoder,e._isRepG1,e._state,1),Pe(e._rangeEncoder,e._isRepG2,e._state,B-2))):(Pe(e._rangeEncoder,e._isRepG0,e._state,0),1==P?Pe(e._rangeEncoder,e._isRep0Long,u,0):Pe(e._rangeEncoder,e._isRep0Long,u,1)),1==P?e._state=e._state<7?9:11:(ee(e._repMatchLenEncoder,e._rangeEncoder,P-2,k),e._state=e._state<7?8:11),d=e._repDistances[B],0!=B){for(h=B;h>=1;--h)e._repDistances[h]=e._repDistances[h-1];e._repDistances[0]=d}}else{for(Pe(e._rangeEncoder,e._isRep,e._state,0),e._state=e._state<7?7:10,ee(e._lenEncoder,e._rangeEncoder,P-2,k),g=Q(B-=4),l=x(P),fe(e._posSlotEncoder[l],e._rangeEncoder,g),g>=4&&(S=B-(c=(2|1&g)<<(p=(g>>1)-1)),g<14?function(e,r,t,o,n){var s,i,_=1;for(i=0;i<o;++i)Pe(t,e,r+_,s=1&n),_=_<<1|s,n>>=1}(e._posEncoders,c-g-1,e._rangeEncoder,p,S):(le(e._rangeEncoder,S>>4,p-4),de(e._posAlignEncoder,e._rangeEncoder,15&S),++e._alignPriceCount)),d=B,h=3;h>=1;--h)e._repDistances[h]=e._repDistances[h-1];e._repDistances[0]=d,++e._matchPriceCount}e._previousByte=D(e._matchFinder,P-1-e._additionalOffset)}if(e._additionalOffset-=P,e.nowPos64=t(e.nowPos64,_(P)),!e._additionalOffset){if(e._matchPriceCount>=128&&Y(e),e._alignPriceCount>=16&&Z(e),r[0]=e.nowPos64,o[0]=function(e){return t(t(_(e._cacheSize),e._position),[4,0])}(e._rangeEncoder),!w(e._matchFinder))return void V(e,a(e.nowPos64));if(n(m(e.nowPos64,R),[4096,0])>=0)return e._finished=0,void(s[0]=0)}}else V(e,a(e.nowPos64))}})(e.encoder,e.encoder.processedInSize,e.encoder.processedOutSize,e.encoder.finished),e.inBytesProcessed=e.encoder.processedInSize[0],e.encoder.finished[0]&&(!function(e){J(e),e._rangeEncoder.Stream=null}(e.encoder),e.alive=0)}(e):function(e){var r=function(e){var r,o,s,i,c,u;if(u=a(e.nowPos64)&e.m_PosStateMask,pe(e.m_RangeDecoder,e.m_IsMatchDecoders,(e.state<<4)+u)){if(pe(e.m_RangeDecoder,e.m_IsRepDecoders,e.state))s=0,pe(e.m_RangeDecoder,e.m_IsRepG0Decoders,e.state)?(pe(e.m_RangeDecoder,e.m_IsRepG1Decoders,e.state)?(pe(e.m_RangeDecoder,e.m_IsRepG2Decoders,e.state)?(o=e.rep3,e.rep3=e.rep2):o=e.rep2,e.rep2=e.rep1):o=e.rep1,e.rep1=e.rep0,e.rep0=o):pe(e.m_RangeDecoder,e.m_IsRep0LongDecoders,(e.state<<4)+u)||(e.state=e.state<7?9:11,s=1),s||(s=H(e.m_RepLenDecoder,e.m_RangeDecoder,u)+2,e.state=e.state<7?8:11);else if(e.rep3=e.rep2,e.rep2=e.rep1,e.rep1=e.rep0,s=2+H(e.m_LenDecoder,e.m_RangeDecoder,u),e.state=e.state<7?7:10,(c=ce(e.m_PosSlotDecoder[x(s)],e.m_RangeDecoder))>=4){if(i=(c>>1)-1,e.rep0=(2|1&c)<<i,c<14)e.rep0+=function(e,r,t,o){var n,s,i=1,_=0;for(s=0;s<o;++s)n=pe(t,e,r+i),i<<=1,i+=n,_|=n<<s;return _}(e.m_PosDecoders,e.rep0-c-1,e.m_RangeDecoder,i);else if(e.rep0+=function(e,r){var t,o,n=0;for(t=r;0!=t;--t)e.Range>>>=1,o=e.Code-e.Range>>>31,e.Code-=e.Range&o-1,n=n<<1|1-o,-16777216&e.Range||(e.Code=e.Code<<8|p(e.Stream),e.Range<<=8);return n}(e.m_RangeDecoder,i-4)<<4,e.rep0+=function(e,r){var t,o,n=1,s=0;for(o=0;o<e.NumBitLevels;++o)t=pe(r,e.Models,n),n<<=1,n+=t,s|=t<<o;return s}(e.m_PosAlignDecoder,e.m_RangeDecoder),e.rep0<0)return-1==e.rep0?1:-1}else e.rep0=c;if(n(_(e.rep0),e.nowPos64)>=0||e.rep0>=e.m_DictionarySizeCheck)return-1;!function(e,r,t){var o=e._pos-r-1;for(o<0&&(o+=e._windowSize);0!=t;--t)o>=e._windowSize&&(o=0),e._buffer[e._pos++]=e._buffer[o++],e._pos>=e._windowSize&&z(e)}(e.m_OutWindow,e.rep0,s),e.nowPos64=t(e.nowPos64,_(s)),e.prevByte=F(e.m_OutWindow,0)}else r=function(e,r,t){return e.m_Coders[((r&e.m_PosMask)<<e.m_NumPrevBits)+((255&t)>>>8-e.m_NumPrevBits)]}(e.m_LiteralDecoder,a(e.nowPos64),e.prevByte),e.state<7?e.prevByte=function(e,r){var t=1;do{t=t<<1|pe(r,e.m_Decoders,t)}while(t<256);return t<<24>>24}(r,e.m_RangeDecoder):e.prevByte=function(e,r,t){var o,n,s=1;do{if(n=t>>7&1,t<<=1,o=pe(r,e.m_Decoders,(1+n<<8)+s),s=s<<1|o,n!=o){for(;s<256;)s=s<<1|pe(r,e.m_Decoders,s);break}}while(s<256);return s<<24>>24}(r,e.m_RangeDecoder,F(e.m_OutWindow,e.rep0)),function(e,r){e._buffer[e._pos++]=r,e._pos>=e._windowSize&&z(e)}(e.m_OutWindow,e.prevByte),e.state=N(e.state),e.nowPos64=t(e.nowPos64,Ce);return 0}(e.decoder);if(-1==r)throw new Error("corrupted input");e.inBytesProcessed=Ee,e.outBytesProcessed=e.decoder.nowPos64,(r||n(e.decoder.outSize,ye)>=0&&n(e.decoder.nowPos64,e.decoder.outSize)>=0)&&(z(e.decoder.m_OutWindow),I(e.decoder.m_OutWindow),e.decoder.m_RangeDecoder.Stream=null,e.alive=0)}(e),e.alive}function A(e,r){for(;e.m_NumPosStates<r;++e.m_NumPosStates)e.m_LowCoder[e.m_NumPosStates]=ae({},3),e.m_MidCoder[e.m_NumPosStates]=ae({},3)}function H(e,r,t){if(!pe(r,e.m_Choice,0))return ce(e.m_LowCoder[t],r);var o=8;return pe(r,e.m_Choice,1)?o+=8+ce(e.m_HighCoder,r):o+=ce(e.m_MidCoder[t],r),o}function G(e){return e.m_Choice=r(2),e.m_LowCoder=r(16),e.m_MidCoder=r(16),e.m_HighCoder=ae({},8),e.m_NumPosStates=0,e}function W(e){he(e.m_Choice);for(var r=0;r<e.m_NumPosStates;++r)he(e.m_LowCoder[r].Models),he(e.m_MidCoder[r].Models);he(e.m_HighCoder.Models)}function T(e,r){var t,o,n,s;e._optimumEndIndex=r,n=e._optimum[r].PosPrev,o=e._optimum[r].BackPrev;do{e._optimum[r].Prev1IsChar&&(_e(e._optimum[n]),e._optimum[n].PosPrev=n-1,e._optimum[r].Prev2&&(e._optimum[n-1].Prev1IsChar=0,e._optimum[n-1].PosPrev=e._optimum[r].PosPrev2,e._optimum[n-1].BackPrev=e._optimum[r].BackPrev2)),s=n,t=o,o=e._optimum[s].BackPrev,n=e._optimum[s].PosPrev,e._optimum[s].BackPrev=t,e._optimum[s].PosPrev=r,r=s}while(r>0);return e.backRes=e._optimum[0].BackPrev,e._optimumCurrentIndex=e._optimum[0].PosPrev,e._optimumCurrentIndex}function Z(e){for(var r=0;r<16;++r)e._alignPrices[r]=function(e,r){var t,o,n=1,s=0;for(o=e.NumBitLevels;0!=o;--o)t=1&r,r>>>=1,s+=Be(e.Models[n],t),n=n<<1|t;return s}(e._posAlignEncoder,r);e._alignPriceCount=0}function Y(e){var r,t,o,n,s,i,_,a;for(n=4;n<128;++n)r=(2|1&(i=Q(n)))<<(o=(i>>1)-1),e.tempPrices[n]=function(e,r,t,o){var n,s,i=1,_=0;for(s=t;0!=s;--s)n=1&o,o>>>=1,_+=Ie[(2047&(e[r+i]-n^-n))>>>2],i=i<<1|n;return _}(e._posEncoders,r-i-1,o,n-r);for(s=0;s<4;++s){for(t=e._posSlotEncoder[s],_=s<<6,i=0;i<e._distTableSize;++i)e._posSlotPrices[_+i]=me(t,i);for(i=14;i<e._distTableSize;++i)e._posSlotPrices[_+i]+=(i>>1)-1-4<<6;for(a=128*s,n=0;n<4;++n)e._distancesPrices[a+n]=e._posSlotPrices[_+n];for(;n<128;++n)e._distancesPrices[a+n]=e._posSlotPrices[_+Q(n)]+e.tempPrices[n]}e._matchPriceCount=0}function V(e,r){J(e),function(e,r){if(!e._writeEndMark)return;Pe(e._rangeEncoder,e._isMatch,(e._state<<4)+r,1),Pe(e._rangeEncoder,e._isRep,e._state,0),e._state=e._state<7?7:10,ee(e._lenEncoder,e._rangeEncoder,0,r);var t=x(2);fe(e._posSlotEncoder[t],e._rangeEncoder,63),le(e._rangeEncoder,67108863,26),de(e._posAlignEncoder,e._rangeEncoder,15)}(e,r&e._posStateMask);for(var t=0;t<5;++t)ve(e._rangeEncoder)}function j(e,r,t,o){var n=x(t);return(r<128?e._distancesPrices[128*n+r]:e._posSlotPrices[(n<<6)+function(e){if(e<131072)return Fe[e>>6]+12;if(e<134217728)return Fe[e>>16]+32;return Fe[e>>26]+52}(r)]+e._alignPrices[15&r])+te(e._lenEncoder,t-2,o)}function $(e,r,t,o){var n;return r?(n=Ie[2048-e._isRepG0[t]>>>2],1==r?n+=Ie[e._isRepG1[t]>>>2]:(n+=Ie[2048-e._isRepG1[t]>>>2],n+=Be(e._isRepG2[t],r-2))):(n=Ie[e._isRepG0[t]>>>2],n+=Ie[2048-e._isRep0Long[(t<<4)+o]>>>2]),n}function K(e,r){r>0&&(!function(e,r){var t,o,n,s,i,_,a,c,u,f,m,d,p,h,P,l,v;do{if(e._pos+e._matchMaxLen<=e._streamPos)d=e._matchMaxLen;else if((d=e._streamPos-e._pos)<e.kMinMatchCheck){y(e);continue}for(p=e._pos>e._cyclicBufferSize?e._pos-e._cyclicBufferSize:0,o=e._bufferOffset+e._pos,e.HASH_ARRAY?(_=1023&(v=ze[255&e._bufferBase[o]]^255&e._bufferBase[o+1]),e._hash[_]=e._pos,a=65535&(v^=(255&e._bufferBase[o+2])<<8),e._hash[1024+a]=e._pos,c=(v^ze[255&e._bufferBase[o+3]]<<5)&e._hashMask):c=255&e._bufferBase[o]^(255&e._bufferBase[o+1])<<8,n=e._hash[e.kFixHashSize+c],e._hash[e.kFixHashSize+c]=e._pos,P=1+(e._cyclicBufferPos<<1),l=e._cyclicBufferPos<<1,f=m=e.kNumHashDirectBytes,t=e._cutValue;;){if(n<=p||0==t--){e._son[P]=e._son[l]=0;break}if(i=e._pos-n,s=(i<=e._cyclicBufferPos?e._cyclicBufferPos-i:e._cyclicBufferPos-i+e._cyclicBufferSize)<<1,h=e._bufferOffset+n,u=f<m?f:m,e._bufferBase[h+u]==e._bufferBase[o+u]){for(;++u!=d&&e._bufferBase[h+u]==e._bufferBase[o+u];);if(u==d){e._son[l]=e._son[s],e._son[P]=e._son[s+1];break}}(255&e._bufferBase[h+u])<(255&e._bufferBase[o+u])?(e._son[l]=n,l=s+1,n=e._son[l],m=u):(e._son[P]=n,P=s,n=e._son[P],f=u)}y(e)}while(0!=--r)}(e._matchFinder,r),e._additionalOffset+=r)}function q(e){var r=0;return e._numDistancePairs=function(e,r){var t,o,n,s,i,_,a,c,u,f,m,d,p,h,P,l,v,B,S,g,k;if(e._pos+e._matchMaxLen<=e._streamPos)h=e._matchMaxLen;else if((h=e._streamPos-e._pos)<e.kMinMatchCheck)return y(e),0;for(v=0,P=e._pos>e._cyclicBufferSize?e._pos-e._cyclicBufferSize:0,o=e._bufferOffset+e._pos,l=1,c=0,u=0,e.HASH_ARRAY?(c=1023&(k=ze[255&e._bufferBase[o]]^255&e._bufferBase[o+1]),u=65535&(k^=(255&e._bufferBase[o+2])<<8),f=(k^ze[255&e._bufferBase[o+3]]<<5)&e._hashMask):f=255&e._bufferBase[o]^(255&e._bufferBase[o+1])<<8,n=e._hash[e.kFixHashSize+f]||0,e.HASH_ARRAY&&(s=e._hash[c]||0,i=e._hash[1024+u]||0,e._hash[c]=e._pos,e._hash[1024+u]=e._pos,s>P&&e._bufferBase[e._bufferOffset+s]==e._bufferBase[o]&&(r[v++]=l=2,r[v++]=e._pos-s-1),i>P&&e._bufferBase[e._bufferOffset+i]==e._bufferBase[o]&&(i==s&&(v-=2),r[v++]=l=3,r[v++]=e._pos-i-1,s=i),0!=v&&s==n&&(v-=2,l=1)),e._hash[e.kFixHashSize+f]=e._pos,S=1+(e._cyclicBufferPos<<1),g=e._cyclicBufferPos<<1,d=p=e.kNumHashDirectBytes,0!=e.kNumHashDirectBytes&&n>P&&e._bufferBase[e._bufferOffset+n+e.kNumHashDirectBytes]!=e._bufferBase[o+e.kNumHashDirectBytes]&&(r[v++]=l=e.kNumHashDirectBytes,r[v++]=e._pos-n-1),t=e._cutValue;;){if(n<=P||0==t--){e._son[S]=e._son[g]=0;break}if(a=e._pos-n,_=(a<=e._cyclicBufferPos?e._cyclicBufferPos-a:e._cyclicBufferPos-a+e._cyclicBufferSize)<<1,B=e._bufferOffset+n,m=d<p?d:p,e._bufferBase[B+m]==e._bufferBase[o+m]){for(;++m!=h&&e._bufferBase[B+m]==e._bufferBase[o+m];);if(l<m&&(r[v++]=l=m,r[v++]=a-1,m==h)){e._son[g]=e._son[_],e._son[S]=e._son[_+1];break}}(255&e._bufferBase[B+m])<(255&e._bufferBase[o+m])?(e._son[g]=n,g=_+1,n=e._son[g],p=m):(e._son[S]=n,S=_,n=e._son[S],d=m)}return y(e),v}(e._matchFinder,e._matchDistances),e._numDistancePairs>0&&(r=e._matchDistances[e._numDistancePairs-2])==e._numFastBytes&&(r+=b(e._matchFinder,r-1,e._matchDistances[e._numDistancePairs-1],273-r)),++e._additionalOffset,r}function J(e){e._matchFinder&&e._needReleaseMFStream&&(e._matchFinder._stream=null,e._needReleaseMFStream=0)}function Q(e){return e<2048?Fe[e]:e<2097152?Fe[e>>10]+20:Fe[e>>20]+40}function U(e,r){he(e._choice);for(var t=0;t<r;++t)he(e._lowCoder[t].Models),he(e._midCoder[t].Models);he(e._highCoder.Models)}function X(e,r,t,o,n){var s,i,_,a,c;for(s=Ie[e._choice[0]>>>2],_=(i=Ie[2048-e._choice[0]>>>2])+Ie[e._choice[1]>>>2],a=i+Ie[2048-e._choice[1]>>>2],c=0,c=0;c<8;++c){if(c>=t)return;o[n+c]=s+me(e._lowCoder[r],c)}for(;c<16;++c){if(c>=t)return;o[n+c]=_+me(e._midCoder[r],c-8)}for(;c<t;++c)o[n+c]=a+me(e._highCoder,c-8-8)}function ee(e,r,t,o){!function(e,r,t,o){t<8?(Pe(r,e._choice,0,0),fe(e._lowCoder[o],r,t)):(t-=8,Pe(r,e._choice,0,1),t<8?(Pe(r,e._choice,1,0),fe(e._midCoder[o],r,t)):(Pe(r,e._choice,1,1),fe(e._highCoder,r,t-8)))}(e,r,t,o),0==--e._counters[o]&&(X(e,o,e._tableSize,e._prices,272*o),e._counters[o]=e._tableSize)}function re(e){return function(e){e._choice=r(2),e._lowCoder=r(16),e._midCoder=r(16),e._highCoder=ue({},8);for(var t=0;t<16;++t)e._lowCoder[t]=ue({},3),e._midCoder[t]=ue({},3)}(e),e._prices=[],e._counters=[],e}function te(e,r,t){return e._prices[272*t+r]}function oe(e,r){for(var t=0;t<r;++t)X(e,t,e._tableSize,e._prices,272*t),e._counters[t]=e._tableSize}function ne(e,r,t){return e.m_Coders[((r&e.m_PosMask)<<e.m_NumPrevBits)+((255&t)>>>8-e.m_NumPrevBits)]}function se(e,r,t){var o,n,s=1;for(n=7;n>=0;--n)o=t>>n&1,Pe(r,e.m_Encoders,s,o),s=s<<1|o}function ie(e,r,t,o){var n,s,i=1,_=7,a=0;if(r)for(;_>=0;--_)if(s=t>>_&1,n=o>>_&1,a+=Be(e.m_Encoders[(1+s<<8)+i],n),i=i<<1|n,s!=n){--_;break}for(;_>=0;--_)n=o>>_&1,a+=Be(e.m_Encoders[i],n),i=i<<1|n;return a}function _e(e){e.BackPrev=-1,e.Prev1IsChar=0}function ae(e,t){return e.NumBitLevels=t,e.Models=r(1<<t),e}function ce(e,r){var t,o=1;for(t=e.NumBitLevels;0!=t;--t)o=(o<<1)+pe(r,e.Models,o);return o-(1<<e.NumBitLevels)}function ue(e,t){return e.NumBitLevels=t,e.Models=r(1<<t),e}function fe(e,r,t){var o,n,s=1;for(n=e.NumBitLevels;0!=n;)o=t>>>--n&1,Pe(r,e.Models,s,o),s=s<<1|o}function me(e,r){var t,o,n=1,s=0;for(o=e.NumBitLevels;0!=o;)t=r>>>--o&1,s+=Be(e.Models[n],t),n=(n<<1)+t;return s}function de(e,r,t){var o,n,s=1;for(n=0;n<e.NumBitLevels;++n)o=1&t,Pe(r,e.Models,s,o),s=s<<1|o,t>>=1}function pe(e,r,t){var o,n=r[t];return o=(e.Range>>>11)*n,(-2147483648^e.Code)<(-2147483648^o)?(e.Range=o,r[t]=n+(2048-n>>>5)<<16>>16,-16777216&e.Range||(e.Code=e.Code<<8|p(e.Stream),e.Range<<=8),0):(e.Range-=o,e.Code-=o,r[t]=n-(n>>>5)<<16>>16,-16777216&e.Range||(e.Code=e.Code<<8|p(e.Stream),e.Range<<=8),1)}function he(e){for(var r=e.length-1;r>=0;--r)e[r]=1024}function Pe(e,r,n,s){var i,a=r[n];i=(e.Range>>>11)*a,s?(e.Low=t(e.Low,o(_(i),[4294967295,0])),e.Range-=i,r[n]=a-(a>>>5)<<16>>16):(e.Range=i,r[n]=a+(2048-a>>>5)<<16>>16),-16777216&e.Range||(e.Range<<=8,ve(e))}function le(e,r,o){for(var n=o-1;n>=0;--n)e.Range>>>=1,1==(r>>>n&1)&&(e.Low=t(e.Low,_(e.Range))),-16777216&e.Range||(e.Range<<=8,ve(e))}function ve(e){var r,s=a(function(e,r){var o;return r&=63,o=f(e,r),e[1]<0&&(o=t(o,u([2,0],63-r))),o}(e.Low,32));if(0!=s||n(e.Low,[4278190080,0])<0){e._position=t(e._position,_(e._cacheSize)),r=e._cache;do{v(e.Stream,r+s),r=255}while(0!=--e._cacheSize);e._cache=a(e.Low)>>>24}++e._cacheSize,e.Low=u(o(e.Low,[16777215,0]),8)}function Be(e,r){return Ie[(2047&(e-r^-r))>>>2]}function Se(e){for(var r,t,o,n=0,s=0,i=e.length,_=[],a=[];n<i;++n,++s){if(128&(r=255&e[n]))if(192==(224&r)){if(n+1>=i)return e;if(128!=(192&(t=255&e[++n])))return e;a[s]=(31&r)<<6|63&t}else{if(224!=(240&r))return e;if(n+2>=i)return e;if(128!=(192&(t=255&e[++n])))return e;if(128!=(192&(o=255&e[++n])))return e;a[s]=(15&r)<<12|(63&t)<<6|63&o}else{if(!r)return e;a[s]=r}16383==s&&(_.push(String.fromCharCode.apply(String,a)),s=-1)}return s>0&&(a.length=s,_.push(String.fromCharCode.apply(String,a))),_.join("")}function ge(e){var r,t,o,n=[],s=0,i=e.length;if("object"==typeof e)return e;for(function(e,r,t,o,n){var s;for(s=r;s<t;++s)o[n++]=e.charCodeAt(s)}(e,0,i,n,0),o=0;o<i;++o)(r=n[o])>=1&&r<=127?++s:s+=!r||r>=128&&r<=2047?2:3;for(t=[],s=0,o=0;o<i;++o)(r=n[o])>=1&&r<=127?t[s++]=r<<24>>24:!r||r>=128&&r<=2047?(t[s++]=(192|r>>6&31)<<24>>24,t[s++]=(128|63&r)<<24>>24):(t[s++]=(224|r>>12&15)<<24>>24,t[s++]=(128|r>>6&63)<<24>>24,t[s++]=(128|63&r)<<24>>24);return t}function ke(e){return e[1]+e[0]}var Re=1,Me=2,De=3,be="function"==typeof setImmediate?setImmediate:setTimeout,we=4294967296,Ee=[4294967295,-we],Le=[0,-0x8000000000000000],ye=[0,0],Ce=[1,0],ze=function(){var e,r,t,o=[];for(e=0;e<256;++e){for(t=e,r=0;r<8;++r)0!=(1&t)?t=t>>>1^-306674912:t>>>=1;o[e]=t}return o}(),Fe=function(){var e,r,t,o=2,n=[0,1];for(t=2;t<22;++t)for(r=1<<(t>>1)-1,e=0;e<r;++e,++o)n[o]=t<<24>>24;return n}(),Ie=function(){var e,r,t,o=[];for(r=8;r>=0;--r)for(e=1<<9-r,t=1<<9-r-1;t<e;++t)o[t]=(r<<6)+(e-t<<6>>>9-r-1);return o}(),xe=function(){var e=[{s:16,f:64,m:0},{s:20,f:64,m:0},{s:19,f:64,m:1},{s:20,f:64,m:1},{s:21,f:128,m:1},{s:22,f:128,m:1},{s:23,f:128,m:1},{s:24,f:255,m:1},{s:25,f:255,m:1}];return function(r){return e[r-1]||e[6]}}();return"undefined"==typeof onmessage||"undefined"!=typeof window&&void 0!==window.document||(onmessage=function(e){e&&e.data&&(e.data.action==Me?LZMA.decompress(e.data.data,e.data.cbn):e.data.action==Re&&LZMA.compress(e.data.data,e.data.mode,e.data.cbn))}),{compress:function(r,t,o,n){function s(){try{for(var e,r=(new Date).getTime();O(a.c.chunker);)if(i=ke(a.c.chunker.inBytesProcessed)/ke(a.c.length_0),(new Date).getTime()-r>200)return n(i),be(s,0),0;n(1),e=l(a.c.output),be(o.bind(null,e),0)}catch(e){o(null,e)}}var i,_,a={},c=void 0===o&&void 0===n;if("function"!=typeof o&&(_=o,o=n=0),n=n||function(r){if(void 0!==_)return e(r,_)},o=o||function(e,r){if(void 0!==_)return postMessage({action:Re,cbn:_,result:e,error:r})},c){for(a.c=k({},ge(r),xe(t));O(a.c.chunker););return l(a.c.output)}try{a.c=k({},ge(r),xe(t)),n(0)}catch(e){return o(null,e)}be(s,0)},decompress:function(r,t,o){function n(){try{for(var e,r=0,i=(new Date).getTime();O(c.d.chunker);)if(++r%1e3==0&&(new Date).getTime()-i>200)return _&&(s=ke(c.d.chunker.decoder.nowPos64)/a,o(s)),be(n,0),0;o(1),e=Se(l(c.d.output)),be(t.bind(null,e),0)}catch(e){t(null,e)}}var s,i,_,a,c={},u=void 0===t&&void 0===o;if("function"!=typeof t&&(i=t,t=o=0),o=o||function(r){if(void 0!==i)return e(_?r:-1,i)},t=t||function(e,r){if(void 0!==i)return postMessage({action:Me,cbn:i,result:e,error:r})},u){for(c.d=M({},r);O(c.d.chunker););return Se(l(c.d.output))}try{c.d=M({},r),a=ke(c.d.length_0),_=a>-1,o(0)}catch(e){return t(null,e)}be(n,0)}}}();this.LZMA=this.LZMA_WORKER=LZMA;
//# sourceMappingURL=/sm/1cdb09490948a60dde3e45505f6080e56fdb9b088662363d76194ebfae8812ec.map