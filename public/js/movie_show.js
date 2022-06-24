let movies = [];

const showEdit = (movieID) => {
  window.location.href = '/edit?id=' + movieID;
}

const addActor = () => {
  const desc = '<p><label for="name">Actor name:</label><input id="name" required /><br />' +
    '<label for="websiteURL">IMDB Profile URL:</label><input id="websiteURL" type="url" required /><br />' +
    '<label for="photoURL">Photo URL:</label><input id="photoURL" type="url" required /></p>';
  dialogBox('Add an actor', desc, true);
  document.getElementById('yes').textContent = "Add";
  document.getElementById('no').textContent = "Cancel";
  document.getElementById('yes').type = 'submit';
  document.getElementById('popupForm').onsubmit = (event) => {
    event.preventDefault();

    const actor = {
      "name": document.getElementById('name').value,
      "picture": document.getElementById('photoURL').value,
      "site": document.getElementById('websiteURL').value
    };

    $.ajax({
      type: 'PUT',
      url: '/actor/',
      data: actor,
      success: function (result) {
        loadData();
        dialogBox("SUCCESS", result, false);
      },
      error: function (err) {
        dialogBox("ERROR", err.responseText, false);
      },
      always: document.getElementById('popupForm').onsubmit = ''
    });
  };
}

const addActorToMovie = (movieID) => {
  let actorsArr = [];
  $.ajax({
    type: 'GET',
    url: '/actors',
    async: false,
    success: (result) => {
      actorsArr = Object.values(result);
    },
    error: (err) => {
      dialogBox("ERROR", err.responseText, false);
    }
  });

  let desc = '<div class="select-dropdown">Actors List <select id="actorSelect">';
  desc += actorsArr.map((actor) => {
    return (
      `<option value="${actor._id}">${actor.name}</option>`
    )
  });
  desc += '</select></div>';
  dialogBox('Add an actor to <br /> ' + movies.filter((e) => e._id === movieID)[0].name, desc, true);
  document.getElementById('yes').textContent = "Add";
  document.getElementById('no').textContent = "Cancel";
  document.getElementById('yes').type = 'submit';
  document.getElementById('no').type = 'none';
  document.getElementById('popupForm').onsubmit = (event) => {
    event.preventDefault();

    const actorID = document.getElementById('actorSelect').value;
    $.ajax({
      type: 'PUT',
      url: '/movie/' + movieID + '/actor/' + actorID,
      success: function (result) {
        loadData();
        dialogBox("SUCCESS", result, false);
      },
      error: function (err) {
        dialogBox("ERROR", err.responseText, false);
      },
      always: document.getElementById('popupForm').onsubmit = ''
    });

  };
}

const getActor = (actorID) => {
  let actor;
  $.ajax({
    type: 'GET',
    url: '/actor/' + actorID,
    async: false,
    success: (result) => {
      actor = result;
    },
    error: (err) => {
      dialogBox("ERROR", err.responseText, false);
    }
  });
  return actor;
}

const showActors = (movieID) => {
  let actors = "<table id='actors'><thead><tr><td>No.</td><td>Photo</td><td>Name</td><td>Action</td></tr></thead><tbody>";
  let length = 0;
  movies.forEach((movie) => {  // Looking for the movie in data
    if (movie._id === movieID) {
      (movie.actors).forEach((e, index) => { // Actors
        const act = getActor(e); // Array of actors
        actors += "<tr><td>" + (index + 1) + "</td><td><a href='" + act.site + "'><img src='" + act.picture + "'/></a></td>" + "<td>" + act.name + "</td>" +
          "<td><button onclick='deleteActor(\"" + movieID + "\",\"" + act._id + "\")'>Delete</button></td>";
        length++;
      })
      actors += "</tr></tbody></table><p>*Click on the actor's photo to enter the official page on IMDB.</p>";
      if (actors.length < 196)
        actors = "No information about actors"
    }
    dialogBox(length + " Actors", actors, false);
  });
}

const deleteActor = (movieID, actorID) => {
  $.ajax({
    type: 'DELETE',
    url: '/movie/' + movieID + '/actor/' + actorID,
    success: function (result) {
      dialogBox("SUCCESS", result, false);
      loadData();
    },
    error: function (err) {
      dialogBox("ERROR", err.responseText, false);
    }
  });
}

const dialogBox = (title, description, chooseBox) => {
  // A dialog box for multiple uses
  // if chooseBox is true, add yes & no buttons
  document.getElementById("myPopup").style.display = "block";
  document.getElementById("title").innerHTML = title;
  document.getElementById("description").innerHTML = description;

  const modal = document.getElementById("myPopup");
  const span = document.getElementsByClassName("close")[0];

  if (chooseBox) {
    const yesNoButtons = '<button id="yes">Yes</button><button id="no">No</button>';
    document.getElementById("btns").innerHTML = yesNoButtons;
    document.getElementById('no').onclick = () => { event.preventDefault(); modal.style.display = "none" };
  }
  else
    document.getElementById("btns").innerHTML = '';

  span.onclick = () => {
    modal.style.display = "none";
  }

  window.onclick = (event) => {
    if (event.target == modal)
      modal.style.display = "none";
  }
}

const reverseDate = (date) => {
  // Reverse date format from 'YYYY-MM-DD' to 'DD-MM-YYYY'
  return date.split('-').reverse().join('-');
}

const delMovie = (movieID) => {
  dialogBox("Are you sure?", null, true);
  document.getElementById('yes').onclick = function () {
    deleteMovie(movieID);
  };
}

const deleteMovie = (movieID) => {
  $.ajax({
    type: 'DELETE',
    url: '/movie/' + movieID,
    success: function (result) {
      loadData();
      dialogBox("SUCCESS", result, false);
    },
    error: function (err) {
      dialogBox("ERROR", err.responseText, false);
    }
  });
}

const showMovies = (arr) => {
  // Create card for each movie in data
  let cardCode = '';
  $.each(arr, function (index, value) {
    const id = value._id;
    const starRate = Math.floor(value.rating);

    cardCode += "<div class='card'><img src='" + value.picture + "' class='card-img' />" + '<p><h2>' + value.name + '</h2>';

    // Star Rating
    for (let i = 1; i <= 5; i++) {
      if (i <= starRate) cardCode += '<span class="fa fa-star checked"></span>';
      else cardCode += '<span class="fa fa-star"></span>';
    }

    cardCode += '</p><p>(' + value.id + ')<br />Release Date: ' + value.date.replace(/-/gi, '/', 2) + '<br />Rating: ' + value.rating;
    if (value.isSeries)
      cardCode += '<br />' + value.series_details.length + ' Seasons';
    cardCode += '</p>' +
      '<p><button onclick="delMovie(\'' + id + '\')">Delete</button>' +
      '<button id="btn-edit" onclick="showEdit(\'' + value.id + '\')">Edit</button>' +
      '<button onclick="showActors(\'' + id + '\')">Cast</button>' +
      '<button onclick="addActorToMovie(\'' + id + '\')">Add Actor</button>' +
      '</p></div>';
  });
  $('div[class=movies]').html(cardCode);
}

const sortBy = async (arr) => {
  let value = "";
  if (window.location.href.indexOf("list") != -1) { // Just for '/list' page
    if (arr.length == 0) {
      dialogBox("ERROR", "No movies to show.", false);
      return;
    }
    value = document.getElementById('sort').value + document.getElementById('order').value;
  }
  // All sort options
  if (value === 'name-asc')
    arr.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
  if (value === 'name-desc')
    arr.sort((a, b) => (a.name < b.name) ? 1 : ((b.name < a.name) ? -1 : 0))
  else if (value === 'date-desc')
    arr.sort((a, b) => new Date(reverseDate(b.date)) - new Date(reverseDate(a.date)));
  else if (value === 'date-asc')
    arr.sort((a, b) => new Date(reverseDate(a.date)) - new Date(reverseDate(b.date)));
  else if (value === 'rating-desc')
    arr.sort((a, b) => (a.rating < b.rating) ? 1 : ((b.rating < a.rating) ? -1 : 0))
  else if (value === 'rating-asc')
    arr.sort((a, b) => (a.rating > b.rating) ? 1 : ((b.rating > a.rating) ? -1 : 0))

  showMovies(arr);
}

const loadData = () => {
  // Load data of media from server
  document.getElementById('popupForm').onsubmit = (event) => {
    event.preventDefault();
  }
  $.ajax({
    type: 'GET',
    url: '/movies',
    success: function (result) {
      movies = Object.values(result); // Sorted by date-desc as default
      showMovies(movies);
    },
    error: function (err) {
      dialogBox("ERROR", err.responseText, false);
    }
  });
}

$(document).ready(loadData);