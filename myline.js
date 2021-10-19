class MyLine {
    constructor (p1,p2, c=[0,0,0]) {
        this.c = color(c)
        this.p1 = [...p1]
        this.p1.push(1)
        this.p2 = [...p2]
        this.p2.push(1)

        this.v1 = [...this.p1]
        this.v2 = [...this.p2]

    }

    project(M4) {

        this.v1 = transform4(this.p1, M4)

        this.v2 = transform4(this.p2, M4)

    }

    draw3d() {
        stroke(this.c)
        strokeWeight(1)
        beginShape()
        vertex(this.v1[0], this.v1[1], this.v1[2])
        vertex(this.v2[0], this.v2[1], this.v2[2])
        endShape()
    }

    draw2d(w, h) {
        stroke(this.c)
        strokeWeight(1)
        let c1 = center2dscreen(w,h,this.v1)
        let c2 = center2dscreen(w,h,this.v2)
        line(c1[0], c1[1], c2[0], c2[1])
    }
}