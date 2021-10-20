class MyTriangle {
    constructor (p1,p2,p3) {

        this.draw_edges = true
        this.draw_normal = true
        this.draw_hatching = true

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

        this.h = [] // hatches
        

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
            let s1 = center2dscreen(w,h,this.v1)
            let s2 = center2dscreen(w,h,this.v2)
            let s3 = center2dscreen(w,h,this.v3)
            if (this.draw_edges){
                stroke(color(1,1,1))
                strokeWeight(1)
                line(s1[0], s1[1], s2[0], s2[1])
                line(s2[0], s2[1], s3[0], s3[1])
                line(s3[0], s3[1], s1[0], s1[1])
            }

            if (this.draw_normal) {
                // stroke(color(255,0,0))
                // strokeWeight(1)
                let center  = centerv3(this.v1,this.v2,this.v3)
                let scalen = scale3(this.vn,50)
                let center2 = add3(scalen, center)
                let s1 = center2dscreen(w,h,center)
                let s2 = center2dscreen(w,h,center2)
                line(s1[0], s1[1], s2[0], s2[1])
            }

            if (this.draw_hatching) {
                let min_x = s1(0)
                if (s2(0) < min_x) min_x = s2(0)
                if (s3(0) < min_x) min_x = s3(0)
                let max_x = s1(0)
                if (s2(0) > max_x) max_x = s2(0)
                if (s3(0) > max_x) max_x = s3(0)

                let min_y = s1(1)
                if (s2(1) < min_y) min_y = s2(1)
                if (s3(1) < min_y) min_y = s3(1)
                let max_y = s1(0)
                if (s2(1) > max_y) max_y = s2(1)
                if (s3(1) > max_y) max_y = s3(1)
            }

        }
    }
}