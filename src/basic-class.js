
//
class Program {
    constructor(gl, vertexShaderText, fragmentShaderText) {
        this.gl = gl;
        var vertexShader = this.createShader(gl.VERTEXSHADER, vertexShaderText);
        var fragmentShader = this.createShader(gl.FRAGMENTSHADER, fragmentShaderText);
        this.program = this.createProgram(vertexShader, fragmentShader);
    }

    createShader(type, source) {
        gl = this.gl;

        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }

        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    createProgram(vertexShader, fragmentShader) {
        gl = this.gl;

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

    use() {
        this.gl.useProgram(this.program);
    }

    delete() {
        this.gl.deleteProgram(this.program);
    }
}



