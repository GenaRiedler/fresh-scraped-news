// Grab the headlines as a json
$.getJSON("/headlines", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#headlines").append(
                        '<div class="col-sm-6">' +
                            '<div class="card">' +
                            '<div class="card-body">' +
                                '<h2 class="card-title" data-id=' + data[i]._id + '>' + data[i].title + '</h2>' +
                                '<p class="card-text">' + data[i].summary + '</p>' +
                                '<a href="http://www.sandiegouniontribune.com/' + data[i].link + '" class="btn btn-primary btn-sm">Read Article</a>' +
                                '<button data-toggle="modal" data-target="#exampleModalCenter" id="notes-btn" class="btn btn-primary btn-sm" data-id=' + data[i]._id + '>Write a Note</button>' +
                            '</div>' +
                            '</div>' +
                        '</div>'
       );
    }
  });
  
  // Whenever someone clicks the note button
  $(document).on("click", "#notes-btn", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/headlines/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $("#notes").append(
                '<div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">' +
                    '<div class="modal-dialog modal-dialog-centered" role="document">' +
                        '<div class="modal-content">' +
                        '<div class="modal-header">' +
                            '<h5 class="modal-title" id="exampleModalLongTitle">' + data.title + '</h5>' +
                            '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                            '<span aria-hidden="true">&times;</span>' +
                            '</button>' +
                        '</div>' +
                        '<div class="modal-body">' + 
                            '<p>' + data.summary + '</p>' +
                        '</div>' +
                        '<div class="modal-footer">' +
                            '<button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Close</button>' +
                            '<button type="button" class="btn btn-primary btn-sm">Save changes</button>' +
                        '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>');
        
        /*     "<h2>" + data.title + "</h2>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>" */
  
        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/headlines/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  