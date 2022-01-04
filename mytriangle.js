

class MyTriangle {
    constructor (p1,p2,p3) {
        this.NO_POINTS = 3

        this.lines = Array(this.NO_POINTS)
        this.lines[0] = new MyLine(p1, p2)
        this.lines[1] = new MyLine(p2, p3)
        this.lines[2] = new MyLine(p3, p1)
        this.det_normal()

    }
    scale(S) {
        for (let my_line of this.lines) {
            my_line.scale(S)
        }
    }
    translate(t) {
        for (let my_line of this.lines) {
            my_line.translate(t)
        }
    }

    det_normal() {
        this.normal = normal3(this.lines[0].p[0],this.lines[1].p[0],this.lines[2].p[0])
    }


    /**
     * calculate intersection triangle with line.
     * 
     * @param {*} line 
     * @returns v3: point of intersection, NaN if no interserction
     */
    linePlaneIntersect(line_arg) {
        // https://en.wikipedia.org/wiki/Line%E2%80%93plane_intersection
        let p0 = this.lines[0].p[0]
        let l0 = line_arg.p[0]
        let l = line_arg.get_direction()
        let teller = dot3(sub3(p0, l0), this.normal)
        let noemer = dot3(l,this.normal)
        if (Math.abs(noemer) > FLOATING_POINT_ACCURACY ) {
            let d = teller / noemer
            let p = add3(l0, scale3(l, d))
            if (insideTriangleXY(this.lines[0].p[0],this.lines[1].p[0],this.lines[2].p[0], p)) {
                return p
            }
        }
        return NaN
    }

    /**
     * check if line overlaps (from top view) this triangle
     *  // https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
     *  @returns
     *     [] array with all intersection points, empty if none.
     */
    lineMyLinesIntersect(line_arg) {
        let p = []
        for (let cur_line in this.lines) {
            res = cur_line.intersectionXY(line_arg)
            if ( res != NaN) {
                p.push(res)
            }
        }
        return p
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
        for (let my_line of this.lines) {
            my_line.project(M4)
        }
        this.det_normal()

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

    getLinesCopy(settings) {
        let my_lines = []
        for (let my_line of this.lines) {
            let copy  = my_line.get_copy()
            my_lines = my_lines.concat(copy)
        }
        return my_lines
    }

    draw2d(w, h, settings) {
        let lines_drawn = 0
        stroke(color(1,1,1))

        if (this.normal[2]<0){  // only draw fronts
            // let s1 = center2dscreen(w,h,this.v1)
            // let s2 = center2dscreen(w,h,this.v2)
            // let s3 = center2dscreen(w,h,this.v3)
            if (settings.draw_edges){
                for (let my_line of this.lines) {
                    lines_drawn +=  my_line.draw2d(w,h)
                }
                // stroke(color(1,1,1))
                // strokeWeight(1)
                // line(s1[X], s1[Y], s2[X], s2[Y])
                // line(s2[X], s2[Y], s3[X], s3[Y])
                // line(s3[X], s3[Y], s1[X], s1[Y])
            }

            if (settings.draw_normal) {
                for(let i = 0; i < this.NO_POINTS; i++) {
                    // stroke(color(255,0,0))
                    // strokeWeight(1)
                    let c1  = centerv3(this.lines[0].p[0], this.lines[1].p[0], this.lines[2].p[0])
                    let scaled_normal = scale3(this.normal,10)
                    let c2 = add3(scaled_normal, c1)
                    let s1 = center2dscreen(w,h,c1)
                    let s2 = center2dscreen(w,h,c2)
                    line(s1[X], s1[Y], s2[X], s2[Y])
                    lines_drawn +=  1
                }

            }

            if (settings.draw_hatching) {
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


                let hatch_spacing =  settings.hatch_min + (this.shading)*settings.hatch_grad //pixels, to be replaces with shading
                // let hatch_spacing = 0.002
                for (let x = sqr_bl[X]; x < sqr_tr[X]; x += hatch_spacing) {
                    let b = [x,bottom[Y], 0]
                    let t = [x, top[Y], 0]

                    let hatch_line = new MyLine(b,t)
                    let i_is = []  // intersectes within the square/triangle
                    for (let i = 0; i < this.NO_POINTS; i ++) {
                        let is = hatch_line.intersectionXY(this.lines[i], false)
                        let is_in = insideTriangleXY(p1,p2,p3,is)
                        if (is_in) {
                            i_is.push(is)
                        }
                    }
                    if (i_is.length == 2) {
                        let s1 = center2dscreen(w,h,i_is[0])
                        let s2 = center2dscreen(w,h,i_is[1])
                        line(s1[X], s1[Y], s2[X], s2[Y])
                        lines_drawn +=  1
                    }
                }
            }
        }
        return lines_drawn 
    }
}