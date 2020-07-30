const express = require("express")
const app = express()
const path = require("path")
const port = 3000
const { exec, spawn } = require("child_process");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(express.static('assets'))

app.get("/", (req, res) => res.sendFile(path.join(__dirname + "/index.html")))

app.post("/api/user/create/", (req, res) => {
    let responseSent = false;
    let userName = req.body.userName;
    let logins = req.body.logins;
    if (!userName || userName == "" || !logins || logins == null) {
        res.status(500).json({
            message: "Arguments are missing.",
            url: "",
        });
        return;
    }
    const command = spawn("sudo", ["tctl", "users", "add", userName, logins]);
    
    command.stdout.on("data", function (data) {
        if (responseSent) return;
        let str = data.toString();
        let regex = /https:\/\/([^\s]+)/;
        let matches = str.match(regex);
        let url = matches != null ? matches[0] : "";
        let message = str.substring(0, matches.index);
        console.log("STDOUT: " + str);
        res.json({
            message: message,
            url: url,
        });
        responseSent = true;
        return;
    });

    command.stderr.on("data", function (data) {
        if (responseSent) return;
        console.error("STDERR: " + data.toString());
        res.status(500).json({
            message: data.toString(),
            url: "",
        });
        responseSent = true;
        return;
    });
})

app.delete("/api/user/delete/:name", (req, res) => {
    let userName = req.params.name;
    const command = spawn("sudo", ["tctl", "users", "rm", userName]);
    
    command.stdout.on("data", function (data) {
        console.log("STDOUT: " + data.toString());
        res.json({
            message: `The user ${userName} has been deleted.`,
            url: "",
        });
        return;
    });

    command.stderr.on("data", function (data) {
        console.error("STDERR: " + data.toString());
        res.status(500).json({
            message: data.toString(),
            url: "",
        });
        return;
    });
})

app.listen(port, () => console.log(`Teleport User Signup Tool at http://localhost:${port}`))
