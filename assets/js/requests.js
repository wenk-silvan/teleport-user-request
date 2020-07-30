function createUser() {
    let userName = document.getElementById('name').value;
    console.debug(`Send request to create user (${userName})`);
    var request = new XMLHttpRequest();
    request.onreadystatechange = setResponseHandler;
    request.open("GET", `/api/user/create/${userName}`, true);
    request.setRequestHeader("Content-type", "application/json");
    request.send();
}

function deleteUser() {
    let userName = document.getElementById('name').value;
    console.debug(`Send request to delete user (${userName})`);
    var request = new XMLHttpRequest();
    request.onreadystatechange = setResponseHandler;
    request.open("GET", `/api/user/delete/${userName}`, true);
    request.setRequestHeader("Content-type", "application/json");
    request.send();
}

function setResponseHandler() {
    if (this.readyState != 4) return;
    let extracted = JSON.parse(this.responseText);
    if (this.status >= 200 && this.status < 300) {
        console.debug(this.responseText);
        setOutput(extracted);
    } else {
        console.warn(message);
        setOutput(extracted);
    }
}

function setOutput(data) {
    document.getElementById("message").innerHTML = data.message;
    let link = document.getElementById("url");
    link.href = data.url;
    link.innerHTML = data.url;
}