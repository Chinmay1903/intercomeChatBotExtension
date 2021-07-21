$(document).ready(function () {
    $("#welcomeModal").modal('show');
    console.log(Notification.permission);
    if (Notification.permission === "granted") {
      console.log(Notification.permission);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        console.log(Notification.permission);
      });
    }
    let randmsg = "";
    let conversationId = getUrlParameter("conversation_id");
    var mainaccounttype = getUrlParameter("account_type");
    if (mainaccounttype == "random") {
      var name = getUrlParameter("name");
      var userId = "60c9caeeb7479fcacc3ce2e2";
      randmsg = name + " :<br/>"
      var myObject = '{"conversation_id":"'+conversationId+'","name":"'+name+'", "account_type":"'+mainaccounttype+'"}';
      console.log(myObject);
      localStorage.setItem('myObj', myObject);
      accounttype = "user";
    } else {
      var userId = getUrlParameter("user_id");
      accounttype = mainaccounttype;
      var myObject = '{"conversation_id":"'+conversationId+'","user_id":"'+userId+'", "account_type":"'+accounttype+'"}';
      console.log(myObject);
      localStorage.setItem('myObj', myObject);
    }
    console.log(conversationId);
    console.log(userId);
    console.log(typeof userId);
    console.log(name);
    let check;
    let temp = 1;
    let tone = 0;    
  
    var data = {
      conversation_id: conversationId,
    };
    $.ajax({
      type: "POST",
      url: "https://stagingwebsites.info/odz/zoom2gdrive/test/chatbot/getconversation.php", //the script to call to get data
      dataType: "json",
      data: data,
      success: function (
        data //on recieve of reply
      ) {
        console.log(data);
        console.log(data.conversation_parts.conversation_parts.length);
        $("#con_id").append(" " + conversationId + " (" + data.title + ")");
        $("#conversation").html("");
        for (
          let index = 0;
          index < data.conversation_parts.conversation_parts.length;
          index++
        ) {
          printmsg(data, index, userId);
        }
        $("#loader").css("display", "none");
        var element = document.getElementById("conversation");
        element.scrollTop = element.scrollHeight - element.clientHeight;
        check = data.conversation_parts.conversation_parts.length;
      },
      error: function (er) {
        console.log(er);
        console.log(er.responseText);
      },
    });

    document.getElementById('msg').addEventListener('keydown', function(event) {
      const keyCode = event.which || event.keyCode;
      if (keyCode  === 13 && !event.shiftKey) {
        event.preventDefault();
        $("#sendmsg").click();
      }
    });
  
    $("#sendmsg").click(function () {
      $("#sendmsg").html(
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...'
      );
      var msg = $("#msg").val();
      var data = {
        conversation_id: conversationId,
        account_type: accounttype,
        user_id: userId,
        msg: randmsg + msg,
      };
      temp = 0;
      $.ajax({
        type: "POST",
        url: "https://stagingwebsites.info/odz/zoom2gdrive/test/chatbot/replytoconversation.php", //the script to call to get data
        dataType: "json",
        data: data,
        success: function (
          data //on recieve of reply
        ) {
          // console.log(data);
          if (data === 1) {
            getdata(conversationId, userId);
            $("#msg").val("");
            $("#sendmsg").html(
              '<i class="fa fa-paper-plane" aria-hidden="true"></i> Send'
            );
            $("#preview").html("");
          } else {
            alert("Message Not Sent !!!");
            $("#sendmsg").html(
              '<i class="fa fa-paper-plane" aria-hidden="true"></i> Send'
            );
            $("#preview").html("");
          }
        },
        error: function (er) {
          console.log(er);
          console.log(er.responseText);
          alert("Message Not Sent !!!");
          $("#sendmsg").html(
            '<i class="fa fa-paper-plane" aria-hidden="true"></i> Send'
          );
          $("#preview").html("");
        },
      });
    });
  
    $("#attachmetsent").click(function () {
      var msg2 = $("#msg2").val();
      var file = document.getElementById("file").files[0];
      var form_data = new FormData();
      form_data.append("file", file);
      form_data.append("conversation_id", conversationId);
      form_data.append("account_type", accounttype);
      form_data.append("user_id", userId);
      form_data.append("msg", randmsg + msg2);
      temp = 0;
      $.ajax({
        type: "POST",
        url: "https://stagingwebsites.info/odz/zoom2gdrive/test/chatbot/replytoconversation.php", //the script to call to get data
        dataType: "json",
        data: form_data,
        processData: false,
        contentType: false,
        beforeSend: function () {
          $("#attachmetsent").html(
            '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...'
          );
        },
        success: function (data) {
          console.log(data);
          $("#uploadModal").modal('hide');
        },
        error: function (er) {
          console.log(er);
          console.log(er.responseText);
          alert("Message Not Sent !!!");
          $("#attachmetsent").html(
            '<i class="fa fa-paper-plane" aria-hidden="true"></i> Send'
          );
        },
      });
    });
  
    setInterval(function () {
      getdata(conversationId, userId);
    }, 2000);
  
    $(window).focus(function () {
      favicon.reset();
    });
  
    // Auto Height Increasing TextAres
    $("textarea")
      .each(function () {
        this.setAttribute(
          "style",
          "height:" +
            this.scrollHeight +
            "px;overflow-y:hidden;max-height: 200px;"
        ); //remove max-height to infinite increase
      })
      .on("input", function () {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";
      });
  
    // Get Messages Ajax Call
    function getdata(conversationId, userId) {
      var data = {
        conversation_id: conversationId,
      };
      $.ajax({
        type: "POST",
        url: "https://stagingwebsites.info/odz/zoom2gdrive/test/chatbot/getconversation.php", //the script to call to get data
        dataType: "json",
        data: data,
        success: function (
          data //on recieve of reply
        ) {
          console.log(data);
          console.log(data.conversation_parts.conversation_parts.length);
          if (data.conversation_parts.conversation_parts.length > check) {
            index = data.conversation_parts.conversation_parts.length - 1;
            printmsg(data, index, userId);
            check = data.conversation_parts.conversation_parts.length;
            $("#scroll-btn").css("display", "block");
              chrome.tabs.query({active: true, currentWindow: true},function (tabs) {
                  console.log(tabs);
                  chrome.tabs.sendMessage(tabs[0].id,{msg: "Notification"},(response) => {
                      // If this message's recipient sends a response it will be handled here
                      if (response) {
                        console.log(response);
                      }
                    }
                  );
                });
            if (temp == 1) {
              if (Notification.permission === "granted") {
                text = data.conversation_parts.conversation_parts[index].body;
                // text = text.textContent;
                const notification = new Notification("New message incoming", {
                  body: text,
                  icon: 'assets/image/Intercom.png',
                });
                // notification.onclick = (e) => {
                //   window.location.href = "https://google.com";
                // };
              }
              if(tone == 1){
                var audio = new Audio("../assets/tone/Notification Alert Tone.mp3");
                audio.play();
              }
            } else {
              temp = 1;
            }
          }
        },
        error: function (er) {
          console.log(er);
          console.log(er.responseText);
        },
      });
    }
  
    function printmsg(data, index, userId) {
      var authorname =
        data.conversation_parts.conversation_parts[index].author.name;
  
      if (authorname == null) {
        authorname =
          data.conversation_parts.conversation_parts[index].author.email;
      }
  
      if (
        userId === data.conversation_parts.conversation_parts[index].author.id
      ) {
        if (
          data.conversation_parts.conversation_parts[index].attachments.length > 0
        ) {
          for (
            let i = 0;
            i <
            data.conversation_parts.conversation_parts[index].attachments.length;
            i++
          ) {
            var str =
              data.conversation_parts.conversation_parts[index].attachments[i]
                .content_type;
            attachmenttype = str.split("/");
            if (attachmenttype[0] == "video") {
              $("#conversation").append(
                '<div class="msg"><div class="name">' +
                  authorname +
                  "</div>" +
                  '<video controls style="width: 100%;"><source src="' +
                  data.conversation_parts.conversation_parts[index].attachments[i]
                    .url +
                  '" type="' +
                  data.conversation_parts.conversation_parts[index].attachments[i]
                    .content_type +
                  '">Your browser does not support the video tag.</video>' +
                  data.conversation_parts.conversation_parts[index].body +
                  "</div>"
              );
            } else if (attachmenttype[0] == "image") {
              $("#conversation").append(
                '<div class="msg"><div class="name">' +
                  authorname +
                  "</div>" +
                  "<img src='" +
                  data.conversation_parts.conversation_parts[index].attachments[i]
                    .url +
                  "' alt='" +
                  data.conversation_parts.conversation_parts[index].attachments[i]
                    .name +
                  "'>" +
                  data.conversation_parts.conversation_parts[index].body +
                  "</div>"
              );
            } else {
              $("#conversation").append();
            }
          }
        } else {
          console.log(
            detectURLs(data.conversation_parts.conversation_parts[index].body)
          );
          urls = detectURLs(
            data.conversation_parts.conversation_parts[index].body
          );
          var previewhtml = "";
          var urldata;
          if (urls) {
            text = search_word(urls[0], "intercom");
            if(text == 0){
              $.ajax({
                url: "https://api.linkpreview.net/?key=a53301c2c7bba941fc703988af948032&q=" + urls[0],
                type: 'GET',
                dataType: 'json', // added data type
                async: false,
                success: function(urldata) {
                    console.log(urldata);
                    // alert(urldata);
                    if (urldata != undefined) {
                      previewhtml =
                        '<a href="' +
                        urldata.url +
                        '" target="_blank" class="row mb-2"><div class="col-sm-3 px-1 text-center"><img src="' +
                        urldata.image +
                        '" alt="" srcset=""></div><div class="col-sm-9 px-1 border border-dark"><h5>' +
                        urldata.title +
                        "</h5><p>" +
                        urldata.description +
                        "</p></div></a>";
                    }
                }
              });
            }
          }
          $("#conversation").append(
            '<div class="msg"><div class="name">' +
              authorname +
              "</div>" +
              previewhtml +
              data.conversation_parts.conversation_parts[index].body +
              "</div>"
          );
        }
      } else {
        if (
          data.conversation_parts.conversation_parts[index].attachments.length > 0
        ) {
          for (
            let i = 0;
            i <
            data.conversation_parts.conversation_parts[index].attachments.length;
            i++
          ) {
            var str =
              data.conversation_parts.conversation_parts[index].attachments[i]
                .content_type;
            attachmenttype = str.split("/");
            if (attachmenttype[0] == "video") {
              $("#conversation").append(
                '<div class="msg left leftcolor"><div class="name left">' +
                  authorname +
                  "</div> " +
                  '<video controls style="width: 100%;"><source src="' +
                  data.conversation_parts.conversation_parts[index].attachments[i]
                    .url +
                  '" type="' +
                  data.conversation_parts.conversation_parts[index].attachments[i]
                    .content_type +
                  '">Your browser does not support the video tag.</video>' +
                  data.conversation_parts.conversation_parts[index].body +
                  "</div>"
              );
            } else if (attachmenttype[0] == "image") {
              $("#conversation").append(
                '<div class="msg left leftcolor"><div class="name left">' +
                  authorname +
                  "</div> " +
                  "<img src='" +
                  data.conversation_parts.conversation_parts[index].attachments[i]
                    .url +
                  "' alt='" +
                  data.conversation_parts.conversation_parts[index].attachments[i]
                    .name +
                  "'>" +
                  data.conversation_parts.conversation_parts[index].body +
                  "</div>"
              );
            } else {
              $("#conversation").append();
            }
          }
        } else {
          console.log(
            detectURLs(data.conversation_parts.conversation_parts[index].body)
          );
          urls = detectURLs(
            data.conversation_parts.conversation_parts[index].body
          );
          var previewhtml = "";
          var urldata;
          if (urls) {
            text = search_word(urls[0], "intercom")
            if(text == 0){
              $.ajax({
                url: "https://api.linkpreview.net/?key=a53301c2c7bba941fc703988af948032&q=" + urls[0],
                type: 'GET',
                dataType: 'json', // added data type
                async: false,
                success: function(urldata) {
                    console.log(urldata);
                    // alert(urldata);
                    if (urldata != undefined) {
                      previewhtml =
                        '<a href="' +
                        urldata.url +
                        '" target="_blank" class="row mb-2"><div class="col-sm-3 px-1 text-center"><img src="' +
                        urldata.image +
                        '" alt="" srcset=""></div><div class="col-sm-9 px-1 border border-dark"><h5>' +
                        urldata.title +
                        "</h5><p>" +
                        urldata.description +
                        "</p></div></a>";
                    }
                }
              });
            }
          }
          $("#conversation").append(
            '<div class="msg left leftcolor"><div class="name left">' +
              authorname +
              "</div> " +
              previewhtml +
              data.conversation_parts.conversation_parts[index].body +
              "</div>"
          );
        }
      }
    }
    function detectURLs(message) {
      var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
      if (message != null) {
        return message.match(urlRegex);
      }
    }
  
    $('#myModal').on('hidden.bs.modal', function (e) {
      $("#blah").attr("src", "https://via.placeholder.com/728x90.png?text=Uploaded+Image");
      $("#file").val("");
      $("#msg2").val("");
    })

    $('#scroll-btn').click(function () {
      var element = document.getElementById("conversation");
      element.scrollTop = element.scrollHeight - element.clientHeight;
      $("#scroll-btn").css("display", "none");
    });

    $("#logout").click(function () {
      localStorage.removeItem("myObj");
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log(tabs);
        chrome.tabs.sendMessage(tabs[0].id,{ msg: "Open"}, (response) => {
            // If this message's recipient sends a response it will be handled here 
            if (response) {
              console.log(response)
            }
        });
      });
    });

    $("#fullpage").click(function () {
      // localStorage.removeItem("myObj");
      if (mainaccounttype == "random") {
        var textFieldContent = {user: "random", name: name, room_id: conversationId}
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          console.log(tabs);
          chrome.tabs.sendMessage(tabs[0].id,{ msg: "Full Page", data: textFieldContent}, (response) => {
              // If this message's recipient sends a response it will be handled here 
              if (response) {
                console.log(response)
              }
          });
        });
      } else {
        var textFieldContent = {user: accounttype, id: userId, room_id: conversationId};
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log(tabs);
        chrome.tabs.sendMessage(tabs[0].id,{ msg: "Full Page", data: textFieldContent}, (response) => {
            // If this message's recipient sends a response it will be handled here 
            if (response) {
              console.log(response)
            }
        });
      });
      }
    });

    $("#tone").click(function () {
      if (tone == 1) {
        $("#tone").html('<i class="fa fa-volume-off" aria-hidden="true"></i>');
        $("#tone").attr('title', 'Notification Tone Off');
        tone = 0;
      } else if (tone == 0) {
        $("#tone").html('<i class="fa fa-volume-up" aria-hidden="true"></i>');
        $("#tone").attr('title', 'Notification Tone On');
        tone = 1;
      }
    });

    $("#copy").click(function () {
      var str = "https://stagingwebsites.info/odz/zoom2gdrive/test/chatbot/index.php?conversation_id=" + conversationId;
      const el = document.createElement('textarea');
      el.value = str;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      alert("URL Copied to Clipboard")
    });
  
});
  
  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
  
      reader.onload = function (e) {
        $("#blah").attr("src", e.target.result);
        console.log(e);
      };
  
      reader.readAsDataURL(input.files[0]);
    }
  }
  
  var elm;
  function isValidURL() {
    var u = document.getElementById("msg").value;
    if (u == "") {
      $("#preview").html("");
    }
    if (!elm) {
      elm = document.createElement("input");
      elm.setAttribute("type", "url");
    }
    elm.value = u;
    // return elm.validity.valid;
    console.info(elm.validity.valid);
    $.get(
      "https://api.linkpreview.net/?key=a53301c2c7bba941fc703988af948032&q=" + u,
      function (urldata, status) {
        console.log(urldata);
        $("#preview").html('<a href="' + urldata.url + '" target="_blank" ="row -2"><div class="col-sm-3 px-1 text-center"><img src="' + urldata.image + '" alt="" srcset=""></div><div ="col-sm-9 px-1 border border-dark"><h5>' + urldata.title + "</h5><p>" + urldata.description + "</p></div></a>");
      }
    );
  }
  
  function search_word(text, word){
      
    var x = 0, y=0;
   
    for (i=0;i< text.length;i++)
        {
        if(text[i] == word[0])
            {
            for(j=i;j< i+word.length;j++)
               {
                if(text[j]==word[j-i])
                  {
                    y++;
                  }
                if (y==word.length){
                    x++;
                }
            }
            y=0;
        }
    }
   return x;
  }
  
  