const jsCompiler = require("./index");

process.on("message", ({ src, opt }) => {
    ClosureCompiler(src, opt).then((result) => {
        process.send({ result });
    }).catch((err) => {
        process.send({ err });
    })
})

function ClosureCompiler(src, opt) {
    return new Promise((resolve, reject) => {

        let _compiler = new jsCompiler(opt);
        _compiler.run([{ src }], (exitCode, stdOut, stdErr) => {
            _compiler = null;
            if (stdErr) {
                reject(stdErr);
                return;
            }
            //compilation complete
            resolve(stdOut[0].src);
        });
    });
}

process.on("uncaughtException", console.log)