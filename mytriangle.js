class MyTriangle {
    constructor (p1,p2,p3) {

        this.draw_normal = true

        this.p1 = [...p1]
        this.p2 = [...p2]
        this.p3 = [...p3]
        this.pn = normal3(p1,p2,p3)

    }
    scale(S) {
        this.p1 = scale3(this.p1, S)
        this.p2 = scale3(this.p2, S)
        this.p3 = scale3(this.p3, S)
    }
    translate(t) {
        t.push(0)
        this.p1 = add3(this.p1, t)
        this.p2 = add3(this.p2, t)
        this.p3 = add3(this.p3, t)
        this.pn = normal3(this.p1,this.p2,this.p3)
    }


    project(M4) {
        let p1 = [...this.p1]
        p1.push(1)
        let p2 = [...this.p2]
        p2.push(1)
        let p3 = [...this.p3]
        p3.push(1)
        this.v1 = transform4(p1, M4)
        this.v2 = transform4(p2, M4)
        this.v3 = transform4(p3, M4)
        this.vn = normal3(this.v1,this.v2,this.v3)
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
        if (this.vn[2]<0) {
            stroke(color(1,1,1))
            strokeWeight(1)
            let v1 = center2dscreen(w,h,this.v1)
            let v2 = center2dscreen(w,h,this.v2)
            let v3 = center2dscreen(w,h,this.v3)
            line(v1[0], v1[1], v2[0], v2[1])
            line(v2[0], v2[1], v3[0], v3[1])
            line(v3[0], v3[1], v1[0], v1[1])

            if (this.draw_normal) {
                // stroke(color(255,0,0))
                // strokeWeight(1)
                let center  = centerv3(this.v1,this.v2,this.v3)
                let scalen = scale3(this.vn,50)
                let center2 = add3(scalen, center)
                let c1 = center2dscreen(w,h,center)
                let c2 = center2dscreen(w,h,center2)
                line(c1[0], c1[1], c2[0], c2[1])
            }

        }
    }
}