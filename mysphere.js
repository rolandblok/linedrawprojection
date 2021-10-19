function my_sphere(p,R) {
    // https://www.opengl.org.ru/docs/pg/0208.html
    let X=R*.525731112119133606 
    let Z=R*.850650808352039932
    
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
        triangles.push(new MyTriangle( v1, v2, v3 ))
    }

    return triangles
}