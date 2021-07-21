$(document).ready(function () {
  if (localStorage.getItem("myObj")) {
    var d = localStorage.getItem("myObj");
    // var d = '{"name":"John", "age":30, "city":"New York"}';
    console.log(d);
    console.log(typeof d);
    var res = JSON.parse(d);
    console.log(res.account_type);
    if (res.account_type === "user") {
      var textFieldContent = {user: res.account_type, id: res.user_id, room_id: res.conversation_id}
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log(tabs);
        chrome.tabs.sendMessage(tabs[0].id,{ msg: "Checked", data: textFieldContent}, (response) => {
            // If this message's recipient sends a response it will be handled here 
            if (response) {
              console.log(response)
            }
        });
      });
    }else if (res.account_type === "random") {
      var textFieldContent = {user: res.account_type, name: res.name, room_id: res.conversation_id}
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log(tabs);
        chrome.tabs.sendMessage(tabs[0].id,{ msg: "Checked", data: textFieldContent}, (response) => {
            // If this message's recipient sends a response it will be handled here 
            if (response) {
              console.log(response)
            }
        });
      });
    }
  }
    if (getUrlParameter("conversation_id")) {
      var conversationId = getUrlParameter("conversation_id");
      $("#roomid").val(conversationId);
      $("#adminpage").attr("href", "adminenterpage.html?conversation_id=" + conversationId);
    }

    $('input[name="personaldetails"]').change(function(){
      if($('#name').prop('checked')) {
        $("#userid").attr("placeholder", "xyz abc");
      }else if($('#uid').prop('checked')) {
        $("#userid").attr("placeholder", "73fh77h2119h1");
      }
    });
  
    var accounttype;
  
    $("#enterroom").submit(function (event) {
      event.preventDefault();
      var conversation_id = $("#roomid").val();
      if (conversation_id == "") {
        alert("Please enter Room Number to proceed !!");
      } else {
        accounttype = "user";
        $("#enterbtn").html(
          '<span class="spinner-border spinner-border-sm mb-1" role="status" aria-hidden="true"></span> Entering Room'
        );
        if($('#name').prop('checked')) {
          var name = $("#userid").val();          
          var data = {
            conversation_id: conversation_id,
          };
            $.ajax({
              type: "POST",
              url: "https://stagingwebsites.info/odz/zoom2gdrive/test/chatbot/getconversation.php", //the script to call to get data
              dataType: "json",
              data: data,
              success: function (
                result //on recieve of reply
              ) {
                console.log(result);
                console.log(result.id);
                if (result.id === conversation_id) {
                  getuserid(conversation_id, accounttype, name);
                } else {
                  alert("Room Id Not Found !!");
                  $("#enterbtn").html("Submit");
                }
              },
              error: function (er) {
                console.log(er);
                console.log(er.responseText);
                alert("Room Id Not Found !!");
                $("#enterbtn").html("Submit");
              },
            });
        }else if($('#uid').prop('checked')) {
          var user_id = $('#userid').val();
          var data = {
            conversation_id: conversation_id,
          };
            $.ajax({
              type: "POST",
              url: "https://stagingwebsites.info/odz/zoom2gdrive/test/chatbot/getconversation.php", //the script to call to get data
              dataType: "json",
              data: data,
              success: function (
                result //on recieve of reply
              ) {
                console.log(result);
                console.log(result.id);
                if (result.id === conversation_id) {
                  enterroom(conversation_id, accounttype, user_id);
                } else {
                  alert("Room Id Not Found !!");
                  $("#enterbtn").html("Submit");
                }
              },
              error: function (er) {
                console.log(er);
                console.log(er.responseText);
                alert("Room Id Not Found !!");
                $("#enterbtn").html("Submit");
              },
            });
        }
      }
    });
  });
  
  function getuserid(conversation_id, accounttype, name) {
    var data = {
      name: name
    };
    $.ajax({
      type: "POST",
      url: "https://stagingwebsites.info/odz/zoom2gdrive/test/chatbot/getuserid.php", //the script to call to get data
      dataType: "json",
      data: data,
      beforeSend: function () {
        
      },
      complete: function () {
        
      },
      success: function (
        result //on recieve of reply
      ) {
        console.log(result);
        if (result.data.length > 0) {
          var user_id = result.data[0].id;
          enterroom(conversation_id, accounttype, user_id);
        } else {
          var r = confirm("User Account Not Found !!!\nWith Name : " + name + "\nWould you like to continue");
          if (r == true) {
            accounttype = "random";
            randomenterroom(conversation_id, accounttype, name);
          }
          $("#enterbtn").html("Submit");
        }
      },
      error: function (er) {
        console.log(er);
        console.log(er.responseText);
        alert("Error Occured When Connecting to Server !!\nPlease Retry");
        $("#enterbtn").html("Submit");
      },
    });
  }
  

  function enterroom(conversation_id, accounttype, user_id) {
    var textFieldContent = {user: accounttype, id: user_id, room_id: conversation_id};
    data = { user: accounttype, id: user_id };
    $.ajax({
      type: "POST",
      url: "https://stagingwebsites.info/odz/zoom2gdrive/test/chatbot/checkuser.php", //the script to call to get data
      dataType: "json",
      data: data,
      success: function (
        result //on recieve of reply
      ) {
        console.log(result);
        if (result === 1) {
          // window.open("viewconversation.php?conversation_id=" +  conversation_id +  "&user_id=" +  user_id +  "&account_type=" +  accounttype,"_self");
          // chrome.runtime.sendMessage({ msg: "Text field changed", data: textFieldContent }, (response) => {
          //   // window.close();
          //   if (response) {
          //     console.log(response)
          //   }
          //   return true;
          // });

          chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            console.log(tabs);
            chrome.tabs.sendMessage(tabs[0].id,{ msg: "Checked", data: textFieldContent}, (response) => {
                // If this message's recipient sends a response it will be handled here 
                if (response) {
                  console.log(response)
                }
            });
          });
        
          $("#enterbtn").html("Submit");
        } else {
          alert("Account Not Found !!!");
          $("#enterbtn").html("Submit");
        }
      },
      error: function (er) {
        console.log(er);
        console.log(er.responseText);
        alert("Error Occured When Connecting to Server !!\nPlease Retry");
        $("#enterbtn").html("Submit");
      },
    });
  }

  function randomenterroom(conversation_id, accounttype, name){
    var textFieldContent = {user: accounttype, name: name, room_id: conversation_id}
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log(tabs);
        chrome.tabs.sendMessage(tabs[0].id,{ msg: "Checked", data: textFieldContent}, (response) => {
            // If this message's recipient sends a response it will be handled here 
            if (response) {
              console.log(response)
            }
        });
      });
  }
  