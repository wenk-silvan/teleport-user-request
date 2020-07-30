const express = require("express")
const app = express()
const path = require("path")
const port = 3000
const { exec, spawn } = require("child_process");

app.use(express.static('assets'))

app.get("/", (req, res) => res.sendFile(path.join(__dirname + "/index.html")))

app.get("/api/user/create/:name", (req, res) => {
    let userName = req.params.name;
    const ls = spawn("sudo", ["tctl", "users", "add", userName]);
    
    ls.stdout.on("data", function (data) {
        let str = data.toString();
        let regex = /https:\/\/([^\s]+)/;
        let matches = str.match(regex);
        let url = matches != null ? matches[0] : "";
        let message = str.replace(regex, "");
        console.log("STDOUT: " + str);
        res.json({
            message: message,
            url: url,
        });
        return;
    });

    ls.stderr.on("data", function (data) {
        console.error("STDERR: " + data.toString());
        res.status(500).json({
            message: data.toString(),
            url: "",
        });
        return;
    });
})

app.get("/api/user/delete/:name", (req, res) => {
    let userName = req.params.name;
    const ls = spawn("sudo", ["tctl", "users", "rm", userName]);
    
    ls.stdout.on("data", function (data) {
        console.log("STDOUT: " + data.toString());
        res.json({
            message: `The user ${userName} has been deleted.`,
            url: "",
        });
        return;
    });

    ls.stderr.on("data", function (data) {
        console.error("STDERR: " + data.toString());
        res.status(500).json({
            message: data.toString(),
            url: "",
        });
        return;
    });
})

app.listen(port, () => console.log(`Teleport User Signup Tool at http://localhost:${port}`))
