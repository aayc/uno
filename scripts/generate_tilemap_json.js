const fs = require('fs')

const tilemap = { 
    "frames": [],
    "meta": {
        "version": "1.0",
        "image": "uno-front.png",
        "size": { "w": 4096, "h": 4096 },
        "scale": 1
    }
}

const cardWidth = 409.6
const cardHeight = 585.14
const recorded = []
const frames = []
let r = 0
let c = 0
for (const color of ["R", "Y", "B", "G"]) {
    for (const face of ["1", "2", "3", "4", "5", "6", "7", "8", "9"]) {
        frames.push({
            "filename": face + color,
            "frame": { "x": c * cardWidth, "y": r * cardHeight, "w": cardWidth, "h": cardHeight},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": { "x": 0, "y": 0, "w": cardWidth, "h": cardHeight},
            "sourceSize": {"w": cardWidth, "h": cardHeight},
            "pivot": { "x": 0.5, "y": 0.5}
        })
        c += 1
    }
    r += 1
}

// Wild
for (const color of ["R", "Y", "B", "G"]) {
    frames.push({
        "filename": "W" + color,
        "frame": { "x": 9 * cardWidth, "y": 0, "w": cardWidth, "h": cardHeight},
        "rotated": false,
        "trimmed": false,
        "spriteSourceSize": { "x": 0, "y": 0, "w": cardWidth, "h": cardHeight},
        "sourceSize": {"w": cardWidth, "h": cardHeight},
        "pivot": { "x": 0.5, "y": 0.5}
    })
}

// W4D
for (const color of ["R", "Y", "B", "G"]) {
    frames.push({
        "filename": "WD4" + color,
        "frame": { "x": 9 * cardWidth, "y": 2 * cardHeight, "w": cardWidth, "h": cardHeight},
        "rotated": false,
        "trimmed": false,
        "spriteSourceSize": { "x": 0, "y": 0, "w": cardWidth, "h": cardHeight},
        "sourceSize": {"w": cardWidth, "h": cardHeight},
        "pivot": { "x": 0.5, "y": 0.5}
    })
}

r = 4
c = 0
for (const face of ["S", "D2", "R"]) {
    for (const color of ["R", "Y", "B", "G"]) {
        frames.push({
            "filename": face + color,
            "frame": { "x": c * cardWidth, "y": r * cardHeight, "w": cardWidth, "h": cardHeight},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": { "x": 0, "y": 0, "w": cardWidth, "h": cardHeight},
            "sourceSize": {"w": cardWidth, "h": cardHeight},
            "pivot": { "x": 0.5, "y": 0.5}
        })
        if (c == 9) {
            c = 0
            r += 1
        } else {
            c += 1
        }
    }
}

tilemap["frames"] = frames

fs.writeFileSync("uno-front.json", JSON.stringify(tilemap, null, 2))