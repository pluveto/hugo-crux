window.onload = function () {
    // Get a reference to the canvas object
    var canvas = document.getElementById('myCanvas');
    // Create an empty project and a view for the canvas:
    paper.setup(canvas);
    with (paper) {

        // 获取屏幕中心：view.center
        // 屏幕左上角：new Point(0,0)

        var createPoint = (x, y) => {
            return new Point(view.center.x + x, view.center.y - y)
        }

        var rand = (from, to) => {
            var i = 0
            while (i < 250) {
                i++
            }
            var delta = to - from
            return Math.random() * delta + from
        }

        var randGap = (from, to, gap) => {
            var delta = to - from
            var r;
            do {
                r = Math.random() * delta + from;
            }
            while ((from + to - gap) < 2 * r && 2 * r < (from + to + gap))
            return r;
        }

        var log = console.log
        log(view)
        class Body {
            constructor(pos, rad, mass, color = '#dfb443', trackColor = 'white') {
                this.path = new Path.Circle(pos, rad)
                this.path.fillColor = color;
                this.mass = mass
                this.historySize = 1000
                this.a = new Point(0, 0)
                this.v = new Point(0, 0)
                this.track = {
                    path: new Path({ strokeColor: trackColor }),
                    segs: []
                }
            }
            setForce(f, dt) {
                this.a = f.divide(this.mass)
                var dv = this.a.multiply(dt);
                this.v = this.v.add(dv)
                var dp = this.v.multiply(dt)
                this.path.position = this.path.position.add(dp)
                // 如果和上一轨迹点的距离大于 2，就追加轨迹
                this.updateTrack()

                // this.path.position.x = this.path.position % view.size.width
                // this.path.position.y = this.path.position % view.size.height
                //log(this.path.position.x)
            }
            updateTrack() {
                if (this.track.segs.length == 0) {
                    this.track.segs.push(this.path.position.clone())
                }
                var lastPt = this.track.segs[this.track.segs.length - 1]
                if (this.path.position.getDistance(lastPt) < 4) {
                    return
                }
                if (this.track.segs.length == this.historySize) {
                    this.track.segs.shift()
                }
                this.track.segs.push(this.path.position.clone())
                this.track.path.segments = this.track.segs

            }
        }

        var constants = {
            G: 6.67 * 2
        }
        var calFg = (m1, m2, p1, p2) => {
            var r = p1.getDistance(p2)
            // 避免离谱现象
            if (r <= 20) {
                return new Point(0, 0)
            }
            var dx = p2.x - p1.x
            var dy = p2.y - p1.y
            var f = constants.G * m1 * m2 / (r ** 2)
            var fx = f * dx / r
            var fy = f * dy / r
            return new Point(fx, fy)
        }
        var time = new class {
            constructor() {
                this.scale = 1
                this.update()
            }
            update() {
                this.time = + new Date() / this.scale
            }
            delta() {
                var now = + new Date() / this.scale
                var delta = now - this.time
                this.time = now
                return delta
            }
        }
        const vRange = () => rand(-0.05, 0.05)
        const posRange = () => rand(-300, 300)
        var m = [rand(0.02, 0.2), rand(0.02, 0.2), rand(0.02, 0.2)]
        var r = [(m[0]) * 50, (m[1]) * 50, (m[2]) * 50]

        var s1 = new Body(createPoint(posRange(), posRange()), r[0], m[0], "#bf395f", "#bf395f")
        s1.v = new Point(vRange(), vRange())

        var s2 = new Body(createPoint(posRange(), posRange()), r[1], m[1], "#bcd23f", "#bcd23f")
        s2.v = new Point(vRange(), vRange())

        var s3 = new Body(createPoint(posRange(), posRange()), r[2], m[2], "#479acb", "#479acb")
        s3.v = new Point(vRange(), vRange())
        var bodies = [s1, s2, s3]
        var centerBody = 0;
        document.querySelector("#app > main").addEventListener("click", () => {
            centerBody = (centerBody + 1) % (bodies.length)
            console.log(centerBody);
        })
        view.onFrame = (event) => {
            const fragments = 40
            var dt = time.delta();
            for (let i = 0; i < dt; i++) {
                var fg12 = calFg(s1.mass, s2.mass, s1.path.position, s2.path.position)
                var fg13 = calFg(s1.mass, s3.mass, s1.path.position, s3.path.position)
                var fg23 = calFg(s2.mass, s3.mass, s2.path.position, s3.path.position)
                view.center = bodies[centerBody].path.position
                s1.setForce(fg12.add(fg13), 1)
                s2.setForce(fg12.multiply(-1).add(fg23), 1)
                s3.setForce(fg13.multiply(-1).add(fg23.multiply(-1)), 1)
            }
        }
        // var pts = []
        // 
        // const PI = 3.14
        // var rot = function (vec, ang) {
        //     ang = -ang * (Math.PI / 180);
        //     var cos = Math.cos(ang);
        //     var sin = Math.sin(ang);
        //     return new Point(vec.x * cos - vec.y * sin, vec.x * sin + vec.y * cos);
        // };
        // // 首先创建一组点,点之间的坐标存在约束关系,避免太混乱
        // var prev = null;
        // var prevPrev = null;
        // for (let i = 0; i < 50; i++) {
        //     var newPt;
        //     if (prev && prevPrev) {
        //         console.log(prevPrev);
        //         var d = prev.subtract(prevPrev)
        //         log("d", d)
        //         var dir = d.normalize();
        //         console.log("prev", prev);
        //         console.log("dir", dir);
        //         var angRange = 40
        //         dir = rot(dir, randGap(-angRange, angRange, 0))
        //         newPt = prev.add(dir.multiply(rand(30, 50)))
        //     } else {
        //         newPt = createPoint(rand(-50, 50), rand(-50, 50))
        //     }
        //     pts.push(newPt)
        //     prevPrev = prev
        //     prev = newPt
        // }
        // // 然后每个点分配一个运动向量,向量之间约束

        // // 动吧


        // var path = new Path({
        //     segments: pts,
        //     strokeColor: 'white',
        //     //selected: true
        // });

        // path.smooth()
        // log(path)
        // view.onFrame = (event) => {
        //     pts.forEach(e => {
        //         e.x += rand(-0.5, 0.5)
        //         e.y += rand(-0.5, 0.5)
        //     });
        //     path.segments = pts;
        //     path.smooth()

        // }
    }
}