
const NO_LINES = 3

class MyTriangle {
    constructor (p1,p2,p3) {

        this.lines = Array(NO_LINES)
        this.lines[0] = new MyLine(p1, p2)
        this.lines[1] = new MyLine(p2, p3)
        this.lines[2] = new MyLine(p3, p1)
        this._det_normal()

    }
    scale(S) {
        for (let my_line of this.lines) {
            my_line.scale(S)
        }
        // this.p1 = scale3(this.p1, S)
        // this.p2 = scale3(this.p2, S)
        // this.p3 = scale3(this.p3, S)
    }
    translate(t) {
        for (let my_line of this.lines) {
            my_line.translate(t)
        }
        this._det_normal()
    }

    _det_normal() {
        this.normal = normal3(this.lines[0].p[0],this.lines[1].p[0],this.lines[2].p[0])
    }

    light(l) {
        let shading = dot3(this.normal, l)
        if (shading > 0) {
            this.shading = shading
        } else {
            this.shading = 0;
        }
    }

    project(M4) {
        // let p1 = [...this.p1]
        // p1.push(1)
        // let p2 = [...this.p2]
        // p2.push(1)
        // let p3 = [...this.p3]
        // p3.push(1)
        // this.v1 = transform4(p1, M4)
        // this.v2 = transform4(p2, M4)
        // this.v3 = transform4(p3, M4)
        // this.vn = normal3(this.v1,this.v2,this.v3)
        for (let my_line of this.lines) {
            my_line.project(M4)
        }
        this._det_normal()

    }

    draw3d() {
        stroke(color(1,1,1))
        strokeWeight(1)
        beginShape()
        vertex(this.v1[X], this.v1[Y], this.v1[Z])
        vertex(this.v2[X], this.v2[Y], this.v2[Z])
        vertex(this.v3[X], this.v3[Y], this.v3[Z])
        vertex(this.v1[X], this.v1[Y], this.v1[Z])

        endShape()
    }

    draw2d(w, h, my_light, draw_edges=true, draw_normal=true, draw_hatching=true) {
        stroke(color(1,1,1))

        if (this.normal[2]<0){  // only draw fronts
            // let s1 = center2dscreen(w,h,this.v1)
            // let s2 = center2dscreen(w,h,this.v2)
            // let s3 = center2dscreen(w,h,this.v3)
            if (draw_edges){
                for (let my_line of this.lines) {
                    my_line.draw2d(w,h)
                }
                // stroke(color(1,1,1))
                // strokeWeight(1)
                // line(s1[X], s1[Y], s2[X], s2[Y])
                // line(s2[X], s2[Y], s3[X], s3[Y])
                // line(s3[X], s3[Y], s1[X], s1[Y])
            }

            if (draw_normal) {
                // stroke(color(255,0,0))
                // strokeWeight(1)
                let center  = centerv3(this.v1,this.v2,this.v3)
                let scaled_normal = scale3(this.normal,50)
                let center2 = add3(scaled_normal, center)
                let s1 = center2dscreen(w,h,center)
                let s2 = center2dscreen(w,h,center2)
                line(s1[X], s1[Y], s2[X], s2[Y])
            }

            if (draw_hatching) {
                let p1 = this.lines[0].p[0]
                let p2 = this.lines[1].p[0]
                let p3 = this.lines[2].p[0]
                let left = p1
                if (p2[X] < left[X]) left = p2
                if (p3[X] < left[X]) left = p3
                let right = p1
                if (p2[X] > right[X]) right = p2
                if (p3[X] > right[X]) right = p3

                let bottom = p1
                if (p2[Y] < bottom[Y]) bottom = p2
                if (p3[Y] < bottom[Y]) bottom = p3
                let top = p1
                if (p2[Y] > top[Y]) top = p2
                if (p3[Y] > top[Y]) top = p3

                // make a square around the triangle
                let sqr_bl = Array(2)
                sqr_bl[X] = left[X]
                sqr_bl[Y] = bottom[Y]
                let sqr_tr = Array(2)
                sqr_tr[X] = right[X]
                sqr_tr[Y] = top[Y]

                // https://www.tutorialspoint.com/Check-whether-a-given-point-lies-inside-a-Triangle


                let hatch_spacing =  0.0002 + (this.shading)*0.003 //pixels, to be replaces with shading
                // let hatch_spacing = 0.002
                for (let x = sqr_bl[X]; x < sqr_tr[X]; x += hatch_spacing) {
                    let b = [x,bottom[Y], 0]
                    let t = [x, top[Y], 0]

                    let hatch_line = new MyLine(b,t)
                    let i_is = []  // intersectes within the square/triangle
                    for (let i = 0; i < NO_LINES; i ++) {
                        let is = hatch_line.intersectionXY(this.lines[i])
                        let is_in = insideTriangle(p1,p2,p3,is)
                        if (is_in) {
                            i_is.push(is)
                        }
                    }
                    if (i_is.length == 2) {
                        let s1 = center2dscreen(w,h,i_is[0])
                        let s2 = center2dscreen(w,h,i_is[1])
                        line(s1[X], s1[Y], s2[X], s2[Y])
                        }
                }
            }
        }
    }
}