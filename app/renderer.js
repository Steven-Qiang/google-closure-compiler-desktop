// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const require = nodeRequire;

let ClosureCompilerCallback;
const compilerServer = require('child_process').fork(
    require.resolve('./libs/google-closure-compiler/child'),
    {
        // options
    }
);
compilerServer.on("message", function (data) {
    ClosureCompilerCallback && ClosureCompilerCallback(data)
})
// const fs = require('fs');
// const path = require('path');
// const tempfile = require('tempfile');


function ClosureCompiler(src, opt) {
    return new Promise((resolve, reject) => {

        ClosureCompilerCallback = ({ err, result }) => {
            ClosureCompilerCallback = null;
            if (err) {
                reject(err);
                return;
            }

            console.log(result)
            resolve(result)
        }

        compilerServer.send({ src, opt });
    })

}

async function ClosureCompilerCode(src, opt) {

    // 多任务
    if (Array.isArray(src)) {
        let task = [];
        src.forEach((code) => {
            task.push(_closureCompilerCode(code, opt))
        });
        return Promise.all(task);
    }
    if (typeof src != "string") throw new Error("src参数必须为string")
    return _closureCompilerCode(src, opt)
}

async function _closureCompilerCode(src, opt) {
    // const tempPath = tempfile(".js");
    // await fs.promises.writeFile(tempPath, src, { encoding: "utf-8" });
    return ClosureCompiler(src, { ...opt })//.finally(() => fs.promises.unlink(tempPath))
}

(async () => {

    $("#input-code").attr('placeholder', "// ADD YOUR CODE HERE\nfunction hello(name) {\n    alert('Hello, ' + name);\n}\nhello('New user');\n");
    $("#output-wrapper").val("(function(){\n%output%\n}).call(this)");

    const _submit_text = $('button#submit-compiler').html();
    $("#submit-compiler").click(() => {
        const src = $("#input-code").val();
        const compilation_level = $("#compilation-level option:selected").val();
        const warning_level = $("#warning-level option:selected").val();
        const language_in = $("#language-in option:selected").val();
        const language_out = $("#language-out option:selected").val();
        const output_wrapper = $("#output-wrapper").val();
        const opt = {
            compilation_level,
            warning_level,
            language_in,
            language_out,
            output_wrapper
        };
        $('button#submit-compiler').html("Process（处理中）...")
        $("select,input,textarea,button#submit-compiler").attr("disabled", true)
        ClosureCompilerCode(src, opt)
            .then(result => {
                $("#output-code").val(result)
            })
            .catch(error => {
                if (typeof error == 'string') {
                    $("#output-code").val(error);
                    return;
                }
                $("#output-code").val(JSON.stringify(error, Object.getOwnPropertyNames(error), 4))
            })
            .finally(() => {
                $('button#submit-compiler').html(_submit_text)
                $("select,input,textarea,button#submit-compiler").attr("disabled", false)
            })
    })
})()