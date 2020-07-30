function createUser() {
    let userName = document.getElementById('name').value;
    let logins = document.getElementById('logins').value;
    console.debug(`Send request to create user (${userName}) for logins (${logins})`);
    var request = new XMLHttpRequest();
    request.onreadystatechange = setResponseHandler;
    request.open("POST", "/api/user/create/", true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({
        "userName": userName,
        "logins": logins,
    }));
}

function deleteUser() {
    let userName = document.getElementById('name').value;
    console.debug(`Send request to delete user (${userName})`);
    var request = new XMLHttpRequest();
    request.onreadystatechange = setResponseHandler;
    request.open("DELETE", `/api/user/delete/${userName}`, true);
    request.setRequestHeader("Content-type", "application/json");
    request.send();
}

function setResponseHandler() {
    if (this.readyState != 4) return;
    let extracted = JSON.parse(this.responseText);
    if (this.status >= 200 && this.status < 300) {
        console.debug(this.responseText);
        setOutput(extracted, false);
    } else {
        console.warn(message);
        setOutput(extracted, true);
    }
}

function setOutput(data, hasError) {
    let messageElement = document.getElementById("message");
    messageElement.innerHTML = data.message;
    if (hasError) {
        messageElement.classList.add('error');
    } else {
        messageElement.classList.remove('error');
    }
    let linkElement = document.getElementById("url");
    linkElement.href = data.url;
    linkElement.innerHTML = data.url;
}