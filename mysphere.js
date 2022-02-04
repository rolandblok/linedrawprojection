function my_sphere(p,R,devisions) {
    // https://www.opengl.org.ru/docs/pg/0208.html
    let X=.525731112119133606 
    let Z=.850650808352039932
    
    let vdata = [    //[12][3] 
    [-X, 0.0, Z], [X, 0.0, Z], [-X, 0.0, -Z], [X, 0.0, -Z],    
    [0.0, Z, X], [0.0, Z, -X], [0.0, -Z, X], [0.0, -Z, -X],    
    [Z, X, 0.0], [-Z, X, 0.0], [Z, -X, 0.0], [-Z, -X, 0.0] 
    ];
    let tindices = [ //s[20][3]
    [0,4,1], [0,9,4], [9,5,4], [4,5,8], [4,8,1],    
    [8,10,1], [8,3,10], [5,3,8], [5,2,3], [2,7,3],    
    [7,10,3], [7,6,10], [7,11,6], [11,0,6], [0,1,6], 
    [6,1,10], [9,0,11], [9,11,2], [9,2,5], [7,2,11] ];
    
    let triangles = []
    for (let i = 0; i < 20; i++) {    
        /* color information here */ 
        let t1 = tindices[i][0]
        let v1 =  vdata[t1]
        let t2 = tindices[i][1]
        let v2 =  vdata[t2]
        let t3 = tindices[i][2]
        let v3 =  vdata[t3]
        sub_triangles = subdivide( v1,v2,v3, devisions)
        triangles = triangles.concat(sub_triangles)
        // triangles.push(new MyTriangle( v1, v2, v3 ))
    }


    for (let t of triangles) {
        t.scale(R)
        t.translate(p)
    }
    return triangles
}
function subdivide(v1,v2,v3, depth) {
    let triangles = []
    if (depth == 0) {
        triangles.push(new MyTriangle( v1, v2, v3 ))
        return triangles
    }
    for (let i = 0; i < 3; i++) {
        let v12 = normalize3(add3(v1,v2))
        let v23 = normalize3(add3(v2,v3))
        let v31 = normalize3(add3(v3,v1))

        triangles = triangles.concat(subdivide( v1,v12,v31, depth - 1))
        triangles = triangles.concat(subdivide( v2,v23,v12, depth - 1))
        triangles = triangles.concat(subdivide( v3,v31,v23, depth - 1))
        triangles = triangles.concat(subdivide( v12,v23,v31, depth - 1))
        return triangles
    }

}