/*
function Test(arg) {
    this.arg = arg;
    this.print = function print() {
        console.log(arg);
    }
    this.print();
}
*/

class Test {
    v = 1;
    constructor(arg) {
        this.arg = arg;
        this.print();
    }
    print() {
        console.log(this.arg);
    }
}


t = Test;
a = new t(1);
a.print();