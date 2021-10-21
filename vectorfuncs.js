const X = 0
const Y = 1
const Z = 2
// vec2 functions
const equal2=(a,b)=>0.001>dist_sqr2(a,b);
const scale2=(a,b)=>[a[0]*b,a[1]*b];
const add2=(a,b)=>[a[0]+b[0],a[1]+b[1]];
const sub2=(a,b)=>[a[0]-b[0],a[1]-b[1]];
const dot2=(a,b)=>a[0]*b[0]+a[1]*b[1];
const dist_sqr2=(a,b)=>(a[0]-b[0])*(a[0]-b[0])+(a[1]-b[1])*(a[1]-b[1]);
const segment_intersect2=(a,b,d,c)=>{
    const e=(c[1]-d[1])*(b[0]-a[0])-(c[0]-d[0])*(b[1]-a[1]);
    if(0==e)return false;
    c=((c[0]-d[0])*(a[1]-d[1])-(c[1]-d[1])*(a[0]-d[0]))/e;
    d=((b[0]-a[0])*(a[1]-d[1])-(b[1]-a[1])*(a[0]-d[0]))/e;
    return 0<=c&&1>=c&&0<=d&&1>=d?[a[0]+c*(b[0]-a[0]),a[1]+c*(b[1]-a[1])]:false;
}
// vec3 functions
const scale3=(v,b)=>[v[0]*b,v[1]*b,v[2]*b];
const len3=(a)=>Math.sqrt(dot3(a,a));
const normalize3=(a)=>scale3(a,1/len3(a));
const add3=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
const sub3=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const dot3=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const cross3=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
// vec4 functions
const add4=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2],a[3]+b[3]];
const transform4=(v,M)=>{
    const d=new Float32Array(4);
    for(let c=0;4>c;c++)d[c]=M[c]*v[0]+M[c+4]*v[1]+M[c+8]*v[2]+M[c+12]*v[3];
    return d;
}
// mat4 functions
const lookAt4m=(a,b,d)=>{ // pos, lookAt, up
    const c=new Float32Array(16);
    b=normalize3(sub3(a,b));
    d=normalize3(cross3(d,b));
    const e=normalize3(cross3(b,d));
    c[0]=d[0];c[1]=e[0];c[2]=b[0];c[3]=0;
    c[4]=d[1];c[5]=e[1];c[6]=b[1];c[7]=0;
    c[8]=d[2];c[9]=e[2];c[10]=b[2];c[11]=0;
    c[12]=-(d[0]*a[0]+d[1]*a[1]+d[2]*a[2]);
    c[13]=-(e[0]*a[0]+e[1]*a[1]+e[2]*a[2]);
    c[14]=-(b[0]*a[0]+b[1]*a[1]+b[2]*a[2]);
    c[15]=1;
    return c;
}
const multiply4m=(a,b)=>{
    const d=new Float32Array(16);
    for(let c=0;16>c;c+=4)
        for(let e=0;4>e;e++)
            d[c+e]=b[c+0]*a[0+e]+b[c+1]*a[4+e]+b[c+2]*a[8+e]+b[c+3]*a[12+e];
    return d;
}
const perspective4m=(a,b)=>{ // fovy, aspect
    const c=(new Float32Array(16)).fill(0,0);
    c[5]=1/Math.tan(a/2);
    c[0]=c[5]/b;
    c[10]=c[11]=-1;
    return c;
}
const center2dscreen=(w,h,v4)=> {
    const d=new Float32Array(2);
    d[0]=w/2+v4[0]
    d[1]=h/2-v4[1]
    return d
}
const unitm=(n)=>{
    const d=new Float32Array(n*n).fill(0,0)
    for(let i=0; i<n; i++) d[i*n]=1
    return d
}
const centerv3=(a,b,c)=>{
    const d = Array(3)
    for (let i=0;i<3;i++) d[i]=(a[i]+b[i]+c[i])/3
    return d
}
const normal3=(v1,v2,v3)=>{
    let s = sub3(v2, v1)
    let t = sub3(v3, v2)
    let c = cross3(s,t )
    let n = normalize3(c)
    return n
}
