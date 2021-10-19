class MyTriangle {
    constructor (p1,p2,p3) {

        let s = sub3(p2, p1)
        let c = cross3(p3,s )
        this.normal = normalize3(c)

        this.p1 = [...p1]
        this.p1.push(1)
        this.p2 = [...p2]
        this.p2.push(1)
        this.p3 = [...p3]
        this.p3.push(1)


        this.v1 = [...this.p1]
        this.v2 = [...this.p2]
        this.v3 = [...this.p3]

    }

    project(M4) {

        this.v1 = transform4(this.p1, M4)

        this.v2 = transform4(this.p2, M4)

        this.v3 = transform4(this.p3, M4)

    }

    draw3d() {
        stroke(color(1,1,1))
        strokeWeight(1)
        beginShape()
        vertex(this.v1[0], this.v1[1], this.v1[2])
        vertex(this.v2[0], this.v2[1], this.v2[2])
        vertex(this.v3[0], this.v3[1], this.v3[2])
        vertex(this.v1[0], this.v1[1], this.v1[2])

        endShape()
    }

    draw2d(w, h) {
        stroke(color(1,1,1))
        strokeWeight(1)
        let v1 = center2dscreen(w,h,this.v1)
        let v2 = center2dscreen(w,h,this.v2)
        let v3 = center2dscreen(w,h,this.v3)
        line(v1[0], v1[1], v2[0], v2[1])
        line(v2[0], v2[1], v3[0], v3[1])
        line(v3[0], v3[1], v1[0], v1[1])
    }
}