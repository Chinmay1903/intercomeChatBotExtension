$(document).ready(function () {
  var conversation_id;
  let id;
  $("#createroom").click(function () {
    var subject = $("#title").val();
    var email = $("#email").val();
    if (email === "") {
      id = "60c9caeeb7479fcacc3ce2e2";
      createroom(subject, id);
    } else {
      data = { email: email };
      $("#createroom").html('<span class="spinner-border spinner-border-sm" style="margin-bottom: 2px;" role="status" aria-hidden="true"></span> Creating Room');
      $.ajax({
        type: "POST",
        url: "https://stagingwebsites.info/odz/zoom2gdrive/test/chatbot/searchcontactbyemail.php", //the script to call to get data
        dataType: "json",
        data: data,
        success: function (
          result //on recieve of reply
        ) {
          console.log(result);
          if (result.data.length == 0) {
            alert("No User Found with Email :" + email);
            $("#createroom").html('Create Room');
          } else {
            id = result.data[0].id
            alert("User Found");
            createroom(subject, id);
          }
        },
        error: function (er) {
          console.log(er);
          console.log(er.responseText);
        },
      });
    }
  });
  
  $("#enterroom").click(function () {
    window.open("adminpage.php?conversation_id=" + conversation_id , '_self');
  });
});

function createroom(subject, id) {
  if (subject === "") {
    alert("Title can't be empty");
    $("#createroom").html('Create Room');
  } else {
    var body = "Conversation Created By Admin For " + subject;
    data = { subject: subject, body: body, id: id };
    $.ajax({
      type: "POST",
      url: "https://stagingwebsites.info/odz/zoom2gdrive/test/chatbot/createconversation.php", //the script to call to get data
      dataType: "json",
      data: data,
      beforeSend: function(){
        $("#createroom").html('<span class="spinner-border spinner-border-sm" style="margin-bottom: 2px;" role="status" aria-hidden="true"></span> Creating Room');
      },
      complete: function(){
        $("#createroom").html('Create Room');
      },
      success: function (
        result //on recieve of reply
      ) {
        console.log(result);
        conversation_id = result.conversation_id
        alert("New Room Created :" + conversation_id);
        $("#roomid").html(conversation_id);
        $("#createroom").html('Create Room');
      },
      error: function (er) {
        console.log(er);
        console.log(er.responseText);
      },
    });
  }
}