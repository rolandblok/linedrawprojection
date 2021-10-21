
const NO_POINTS = 2
class MyLine {
    constructor (p1,p2, c=[0,0,0]) {
        this.c = color(c)
        this.p = Array(NO_POINTS)
        this.p[0] = [...p1]
        this.p[1] = [...p2]

    }

    scale(S) {
        this.p[0] = scale3(this.p[0], S)
        this.p[1] = scale3(this.p[1], S)
    }
    translate(t) {
        for (let i = 0; i < NO_POINTS; i++) {
            this.p[i] = add3(this.p[i], t)
        }
    }

    project(M4) {
        let p0 = [...this.p[0]]
        p0.push(1)
        let p1 = [...this.p[1]]
        p1.push(1)

        this.p[0] = transform4(p0, M4)  // don't know yet if the array being 4 elemenst is problem
        this.p[1] = transform4(p1, M4)



    }

    draw3d() {
        stroke(this.c)
        strokeWeight(1)
        beginShape()
        vertex(this.p[0][X], this.p[0][Y], this.p[0][Z])
        vertex(this.p[1][X], this.p[1][Y], this.p[1][Z])
        endShape()
    }

    draw2d(w, h) {
        stroke(this.c)
        strokeWeight(1)
        let c1 = center2dscreen(w,h,this.p[0])
        let c2 = center2dscreen(w,h,this.p[1])
        line(c1[X], c1[Y], c2[X], c2[Y])
    }

    /* get the projected vectors */
    get x1() {return this.p[0][X] }
    get y1() {return this.p[0][Y] }
    get x2() {return this.p[1][X] }
    get y2() {return this.p[1][Y] }

    /**
     * Intersection with the PROJECTED line in 2 dimensions (xy)
     */
    intersection2d(L2) {
        // https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
        let x1 = this.x1
        let x2 = this.x2
        let y1 = this.y1
        let y2 = this.y2
        let x3 = L2.x1
        let x4 = L2.x2
        let y3 = L2.y1
        let y4 = L2.y2

        let t = ((x1-x3)*(y3-y4) - (y1-y3)*(x3-x4)) / ((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4))

        let p = Array(2)
        p[0] = x1 + t*(x2-x1)
        p[1] = y1 + t*(y2-y1)

        return p
        
    }
}