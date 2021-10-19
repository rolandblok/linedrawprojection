class triangle {
    constructor (p1,p2,p3) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;

        let s = sub3(this.p2, this.p1)
        let c = cross3(this.p3,s )
        this.normal = normalize3(c)
    }

    project(M4) {
        
    }

    draw3d() {
        stroke(color(1,1,1))
        strokeWeight(1)
        beginShape()
        vertex(this.p1[0], this.p1[1], this.p1[2])
        vertex(this.p2[0], this.p2[1], this.p2[2])
        vertex(this.p3[0], this.p3[1], this.p3[2])
        vertex(this.p1[0], this.p1[1], this.p1[2])

        endShape()
    }

    draw2d(w, h) {
        let w2 = w/2
        let h2 = h/2
        stroke(color(1,1,1))
        strokeWeight(1)
        line(w2+this.p1[0], h2+ this.p1[1], w2+this.p2[0], h2+ this.p2[1])
        line(w2+this.p2[0], h2+ this.p2[1], w2+this.p3[0], h2+ this.p3[1])
        line(w2+this.p3[0], h2+ this.p3[1], w2+this.p1[0], h2+ this.p1[1])
    }
}