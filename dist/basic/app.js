function getBufferType(gl, glTypeEnum) {
    if (type == gl.DOUBLE) {
        return Float64Array;
    } else if (type == gl.FLOAT) {
        return Float32Array;
    } else if (type == gl.UNSIGNED_INT) {
        return Uint32Array;
    } else if (type == gl.INT) {
        return Int32Array
    } else if (type == gl.UNSIGNED_SHORT) {
        return Uint16Array
    } else if (type == gl.SHORT) {
        return Int16Array;
    } else if (type == gl.UNSIGNED_BYTE) {
        return Uint8Array;
    } else if (type == gl.BYTE) {
        return Int8Array;
    } else {
        return Float32Array;
    }
}


var attributeParameter = {
    "position": {
        name: "a_VertPosition",
        count: 3
    },
    "color": {
        name: "a_VertColor",
        count: 3
    }
}

var boxVertices =
    [ // X, Y, Z           R, G, B
        // Top
        -1.0, 1.0, -1.0, 0.5, 0.5, 0.5,
        -1.0, 1.0, 1.0, 0.5, 0.5, 0.5,
        1.0, 1.0, 1.0, 0.5, 0.5, 0.5,
        1.0, 1.0, -1.0, 0.5, 0.5, 0.5,

        // Left
        -1.0, 1.0, 1.0, 0.75, 0.25, 0.5,
        -1.0, -1.0, 1.0, 0.75, 0.25, 0.5,
        -1.0, -1.0, -1.0, 0.75, 0.25, 0.5,
        -1.0, 1.0, -1.0, 0.75, 0.25, 0.5,

        // Right
        1.0, 1.0, 1.0, 0.25, 0.25, 0.75,
        1.0, -1.0, 1.0, 0.25, 0.25, 0.75,
        1.0, -1.0, -1.0, 0.25, 0.25, 0.75,
        1.0, 1.0, -1.0, 0.25, 0.25, 0.75,

        // Front
        1.0, 1.0, 1.0, 1.0, 0.0, 0.15,
        1.0, -1.0, 1.0, 1.0, 0.0, 0.15,
        -1.0, -1.0, 1.0, 1.0, 0.0, 0.15,
        -1.0, 1.0, 1.0, 1.0, 0.0, 0.15,

        // Back
        1.0, 1.0, -1.0, 0.0, 1.0, 0.15,
        1.0, -1.0, -1.0, 0.0, 1.0, 0.15,
        -1.0, -1.0, -1.0, 0.0, 1.0, 0.15,
        -1.0, 1.0, -1.0, 0.0, 1.0, 0.15,

        // Bottom
        -1.0, -1.0, -1.0, 0.5, 0.5, 1.0,
        -1.0, -1.0, 1.0, 0.5, 0.5, 1.0,
        1.0, -1.0, 1.0, 0.5, 0.5, 1.0,
        1.0, -1.0, -1.0, 0.5, 0.5, 1.0,
    ];

var boxIndices =
    [
        // Top
        0, 1, 2,
        0, 2, 3,

        // Left
        5, 4, 6,
        6, 4, 7,

        // Right
        8, 9, 10,
        8, 10, 11,

        // Front
        13, 12, 14,
        15, 14, 12,

        // Back
        16, 17, 18,
        16, 18, 19,

        // Bottom
        21, 20, 22,
        22, 20, 23
    ];














class VBO {
    constructor(gl, vertices, type) {
        this.gl = gl;
        this.buffer = gl.createBuffer();
        this.length = vertices.length;
        this.setType(type);
    }


    bind() {
        var gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    }



    setType(type) {
        var gl = this.gl;

        this.type = type;
        this.byteCount = BufferType.BYTES_PER_ELEMENT;

        var BufferType = getBufferType(gl, type);
        this.bind();
        gl.bufferData(gl.ARRAY_BUFFER, new BufferType(this.vertices), gl.STATIC_DRAW);
    }
}

class EBO {
    constructor(gl, indices, type) {
        this.gl = gl;
        this.buffer = gl.createBuffer();

        this.type = type;
        this.length = indices.length;

        var BufferType = getBufferType(gl, type);
        this.bind();
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new BufferType(indices), gl.STATIC_DRAW);
    }

    bind() {
        var gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    }
}

class VAO {
    constructor(gl) {
        this.gl = gl;
        this.buffer = gl.createVertexArray();
    }

    linkAttrib(vbo, attribLoc, componentCount, stride, offset) {
        var gl = this.gl;
        vbo.bind();
        this.bind();
        gl.vertexAttribPointer(attribLoc, componentCount, this.vbo.type, stride, offset);
        gl.enalbeVertexAttribArray(attribLoc);

    }
    bindEBO(ebo) {
        var gl = this.gl;
        this.bind();
        ebo.bind();
    }
    bind() {
        var gl = this.gl;
        gl.bindVertexArray(this.buffer);
    }
}


class Mesh {
    constructor(gl, vertices, indices, textures, attributes) {
        this.gl = gl;
        this.vertices = vertices;
        this.indices = indices;
        this.textures = textures;
        this.attributes = attributes;

        this.vao = new VAO(gl);
        this.vbo = new VBO(gl, vertices, gl.FLOAT);
        this.ebo = new EBO(gl, indices, gl.UNSIGNED_BYTE);
    }

    attachShader(program) {
        program.activate();

        var offset = 0;
        var stride = this.getStride();

        this.attributes.forEach((attr) => {
            var name = attributeParameter[attr].name;
            var componentCount = attributeParameter[attr].count;

            var attribLoc = program.getAttribLocation(name);


            this.vao.linkAttrib(this.vbo, attribLoc, componentCount, stride, offset);
            this.gl.enableVertexAttribArray(attribLoc);
            offset += componentCount * this.vbo.byteCount;
        });




    }

    getStride() {
        stride = 0;
        this.attributes.forEach((attr) => {
            stride += attributeParameter[attr].count * this.vbo.byteCount;
        });
        return stride;
    }

    draw() {

        this.gl.drawElements(gl.TRIANGLES, this.ebo.length, this.ebo.type, 0);

    }
}

class Program {
    constructor(gl, vertexShaderText, fragmentShaderText) {
        this.gl = gl;
        var vertexShader = this.createShader(gl.VERTEX_SHADER, vertexShaderText);
        var fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragmentShaderText);
        this.program = this.createProgram(vertexShader, fragmentShader);
    }




    activate() {
        var gl = this.gl;
        gl.useProgram(this.program);
    }

    getAttribLocation(attribName) {
        return this.gl.getAttribLocation(this.program, attribName);
    }

    createProgram(vertexShader, fragmentShader) {
        var gl = this.gl;
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);

        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.log(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return;
        }

        gl.validateProgram(program);
        if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
            console.log(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return;
        }

        return program;
    }

    createShader(type, source) {
        var gl = this.gl;
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }

        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);

        return shader
    }
}
























var demo = function () {

    var canvas = document.getElementById("my-canvas");
    var gl = getWebGLContext(canvas);

    start(gl);
    var loop = function () {
        update(gl);
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

};

demo();


function start(gl) {
    //vertexShaderText = readTextAsync("./shader.vs");
    //fragmentShaderText = readTextAsync("./shader.fs");
    vertexShaderText = document.getElementById("vertex-shader").text;
    fragmentShaderText = document.getElementById("fragment-shader").text;

    program = new Program(gl, vertexShaderText, fragmentShaderText);

    //var positionAttribLocation = program.getAttribLocation("a_VertPosition");
    //var colorAttribLocation = program.getAttribLocation("a_VertColor");

    var box = new Mesh(gl, boxVertices, boxIndices, null, ["position", "color"]);

}

function update(gl) {
    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
}





function getWebGLContext(canvas) {
    var gl = canvas.getContext("webgl");
    if (!gl) {
        gl = canvas.getContext("experimental-webgl");
        if (!gl) {
            alert("webgl not supported");
        }
    }
    return gl;
}



function readTextAsync(url) {
    xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.overrideMimeType("text/xml");
    xhr.send();

    if (xhr.readyState == xhr.DONE) {
        if (xhr.status == 200) {
            return xhr.responseText;
        } else {
            console.log("Error" + xhr.statusText);
        }
    }
}




/*
 
        function VertexBufferSpec(buffer) {
            this.buffer = buffer;
            this.stride = 0;
            this.accessors = [];
            this.addAccessor = function (_attribLoc, _componentCount, _type, _componentSize) {
 
                this.accessors.push({
                    attribLoc: _attribLoc,
                    componentCount: _componentCount,
                    componentSize: _componentSize,
                    type: _type,
                    offset: this.stride
                });
 
                this.stride += _componentCount * _componentSize;
 
                return this;
            }
            this.print = function () {
                this.accessors.forEach((a) => {
                    console.log(a);
                });
                console.log(this.buffer);
            }
        }
 
*/



