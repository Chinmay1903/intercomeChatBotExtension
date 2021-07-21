$(document).ready(function () {
  if (localStorage.getItem("myObj")) {
    var d = localStorage.getItem("myObj");
    // var d = '{"name":"John", "age":30, "city":"New York"}';
    console.log(d);
    console.log(typeof d);
    var res = JSON.parse(d);
    console.log(res.account_type);
    if (res.account_type === "admin") {
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
    }
  }
    if (getUrlParameter("conversation_id")) {
        var conversationId = getUrlParameter("conversation_id");
        $("#roomid").val(conversationId);
      }

      $('input[name="personaldetails"]').change(function(){
        if($('#name').prop('checked')) {
          $("#userid").attr("placeholder", "xyz abc");
        }else if($('#uid').prop('checked')) {
          $("#userid").attr("placeholder", "516862165");
        }
      });

      $("#enterroom").submit(function (event) {
        event.preventDefault();
        var conversation_id = $("#roomid").val();
        if (conversation_id == "") {
          alert("Please enter Room Number to proceed !!");
        } else {
          $("#enterbtn").html(
            '<span class="spinner-border spinner-border-sm mb-1" role="status" aria-hidden="true"></span> Entering Room'
          );
          accounttype = "admin";
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
                  getadminid(conversation_id, accounttype, name);
                } else {
                  alert("Room Id Not Found !!");
                  ("#enterbtn").html("Submit");
                }
              },
              error: function (er) {
                console.log(er);
                console.log(er.responseText);
                alert("Room Id Not Found !!");
                ("#enterbtn").html("Submit");
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
                  ("#enterbtn").html("Submit");
                }
              },
              error: function (er) {
                console.log(er);
                console.log(er.responseText);
                alert("Room Id Not Found !!");
                ("#enterbtn").html("Submit");
              },
            });
          }
        }
      });

      $("#login").submit(function (event) {
        event.preventDefault();
        var email = $("#email").val();
        var password = $("#password").val();
        data = { email: email, password: password };
        $.ajax({
          type: "POST",
          url: "https://stagingwebsites.info/odz/zoom2gdrive/test/chatbot/adminlogin.php", //the script to call to get data
          dataType: "json",
          data: data,
          beforeSend: function(){
            $("#submitbtn").val("Checking");
          },
          complete: function(){
            $("#submitbtn").val('Submit');
          },
          success: function (
            result //on recieve of reply
          ) {
            console.log(result);
            if (result == 1) {
              chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                console.log(tabs);
                chrome.tabs.sendMessage(tabs[0].id,{ msg: "Enter"}, (response) => {
                    // If this message's recipient sends a response it will be handled here 
                    if (response) {
                      console.log(response)
                    }
                });
              });
            } else {
              $(".text-danger").html("!! Invalide Credentials !!");
            }
          },
          error: function (er) {
            console.log(er);
            console.log(er.responseText);
          },
        });
        
      });
});

function getadminid(conversation_id, accounttype, name) {
  var data;
  data = { name: name };
  $.ajax({
    type: "POST",
    url: "https://stagingwebsites.info/odz/zoom2gdrive/test/chatbot/getadminid.php", //the script to call to get data
    dataType: "json",
    data: data,
    success: function (
      result //on recieve of reply
    ) {
      console.log(result);
      if (result === "Admin Not found") {
        alert("Admin Account Not Found !!!\nWith Name : " + name);
        $("#enterbtn").html("Submit");
      } else {
        var user_id = result;
        enterroom(conversation_id, accounttype, user_id);
      }
    },
    error: function (er) {
      console.log(er);
      console.log(er.responseText);
      alert("Admin Account Not Found !!!\nWith Name : " + name);
      $("#enterbtn").html("Submit");
    },
  });
}

function enterroom(conversation_id, accounttype, user_id) {
  var textFieldContent = {user: accounttype, id: user_id, room_id: conversation_id}
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
        alert("Account Not Found !!!\nWith User Id : " + user_id);
        $("#enterbtn").html("Submit");
      },
    });
  }
  