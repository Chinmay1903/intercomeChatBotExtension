$(document).ready(function () {
    let temp = 0;
    // console.log("Test");
    img = `${chrome.runtime.getURL('assets/image/Intercom.png')}`;
    $("body").append('<div id="mainbtnbody" class="mainbtnbody mainbtnposition"><button id="mainbutton" class="mainbutton" title = "Open Chat Bot"><img src="' + img + '" alt="" srcset=""></button></div>');

    $("#mainbutton").click(function () {
        $("#mainbtnbody").hide();
        // alert("Clicked");
        var newURL = `${chrome.runtime.getURL('html/userenterypage.html')}`;
        // window.open(newURL, "_blank");
        if (temp == 0) {
            $("body").append('<div id="draggable" class="chat-room-body"><div class="close-part"><button type="button" id="closeframe" title="Minimize">X</button></div><iframe id="chat-room-frame" src="' + newURL + '" frameborder="0"></iframe></div>');
        } else {
            $("#draggable").css("display", "block");
            temp = 0;
        }

        img = `${chrome.runtime.getURL('assets/image/Intercom.png')}`;
        $("#mainbutton").html('<img src="' + img + '" alt="" srcset="">');

        $("#closeframe").click(function () {
            // alert("check");
            $("#mainbtnbody").show();
            iframhide();
            img = `${chrome.runtime.getURL('assets/image/Intercom.png')}`;
            $("#mainbutton").html('<img src="' + img + '" alt="" srcset="">');
            chrome.runtime.sendMessage({
                msg: "Start"
            }, function (response) {
                console.log(response);
            });
        });
    });

    $("#mainbtnbody").draggable({
        cursor: "move",
        drag: function () {
            $("#mainbtnbody").removeClass("mainbtnposition");
        }
    });

    function iframhide() {
        $("#draggable").css("display", "none");
        temp = 1;
    }


    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request) {
            if (request.msg == "Checked") {
                // alert("THis");
                console.log(request);
                console.log(sender)
                if (request.data.user === "random") {
                    var newURL = `${chrome.runtime.getURL("html/viewconversation.html?conversation_id=" +  request.data.room_id +  "&name=" + request.data.name +  "&account_type=" + request.data.user)}`;
                    $("#chat-room-frame").attr("src", newURL);
                } else {
                    var newURL = `${chrome.runtime.getURL("html/viewconversation.html?conversation_id=" +  request.data.room_id +  "&user_id=" + request.data.id +  "&account_type=" + request.data.user)}`;
                    $("#chat-room-frame").attr("src", newURL);
                }
                sendResponse({
                    msg: "Confirm"
                }); // This response is sent to the message's sender 
            }
        }
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request) {
            if (request.msg == "Enter") {
                console.log(request);
                console.log(sender)
                var newURL = `${chrome.runtime.getURL("html/admin.html")}`;
                $("#chat-room-frame").attr("src", newURL);
                sendResponse({
                    msg: "Entered"
                }); // This response is sent to the message's sender 
            }
        }
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request) {
            if (request.msg == "Open") {
                console.log(request);
                console.log(sender)
                if (request.data) {
                    var newURL = `${chrome.runtime.getURL("html/userenterypage.html?conversation_id=" + request.data)}`;
                } else {
                    var newURL = `${chrome.runtime.getURL("html/userenterypage.html")}`;
                }
                $("#chat-room-frame").attr("src", newURL);
                sendResponse({
                    msg: "Entered"
                }); // This response is sent to the message's sender 
            }
        }
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request) {
            if (request.msg == "Full Page") {
                // alert("Test");
                console.log("This");
                console.log(request);
                console.log(sender);
                iframhide();
                if (request.data.user === "random") {
                    // alert("Test1");
                    var newURL = "https://stagingwebsites.info/odz/zoom2gdrive/test/chatbot/viewconversation.php?conversation_id=" + request.data.room_id + "&name=" + request.data.name + "&account_type=" + request.data.user;
                } else {
                    // alert("Test2");
                    var newURL = "https://stagingwebsites.info/odz/zoom2gdrive/test/chatbot/viewconversation.php?conversation_id=" + request.data.room_id + "&user_id=" + request.data.id + "&account_type=" + request.data.user;
                }
                window.open(newURL, "_blank");
                $("#mainbtnbody").show();
                sendResponse({
                    msg: "Closed"
                }); // This response is sent to the message's sender 
            }
        }
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request) {
            if (request.msg == "Notification") {
                // alert("Test");
                console.log(request);
                console.log(sender);
                img = `${chrome.runtime.getURL('assets/image/Intercom.png')}`;
                $("#mainbutton").html('<span class="notify-badge">!</span><img src="' + img + '" alt="" srcset="">');
                sendResponse({
                    msg: "Closed"
                }); // This response is sent to the message's sender 
            }
        }
    });

});