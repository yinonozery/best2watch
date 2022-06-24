
$(document).ready(() => {
  document.getElementById('date').max = new Date().toISOString().split("T")[0];
  const urlParams = new URLSearchParams(window.location.search);
  const movieID = urlParams.get('id');
  let movieData;

  $.ajax({
    type: 'GET',
    async: false,
    url: '/movie/' + movieID,
    success: (result) => {
      movieData = result;
      document.title += ' ' + movieData.name;
    },
    error: (error) => {
      dialogBox("ERROR", error.responseText, false);
      setTimeout(function () { window.location.href = '/list'; }, 2000);
    },
  })

  // Set movie values
  document.getElementById('username').value = movieData.name;
  document.getElementById('picture').value = movieData.picture;
  document.getElementById('director').value = movieData.director;
  document.getElementById('date').value = movieData.date.split("-").reverse().join("-");
  document.getElementById('rating').value = movieData.rating;
  document.getElementById('movieTitle').append(movieData.name);

  if (movieData.isSeries) {
    document.getElementById('mediaType').selectedIndex = 1;
    document.getElementById('isSeries').style.display = 'block';
    document.getElementById('seasons').value = movieData.series_details.length;
    editEpisodes(movieData.series_details);
  }
  else
    document.getElementById('mediaType').selectedIndex = 0;

  $.ajax()
  $("form[name='edit_movie']").validate({
    rules: {
      'name': {
        minlength: 1
      },
      'id_field': {
        minlength: 1
      },
      'url': {
        url: true
      },
      'date': {
        date: true
      }
    },
    messages: {
      name: 'Please enter a valid name',
      id_field: 'Your id must be at least one character'
    }
  });

  $('#edit_movie').submit(function (event) {
    let seasonsValid = true;
    let isSeries = false;
    const type = document.getElementById('mediaType').value;
    const seasons = document.getElementById('seasons').value;
    if (type === 'series')
      isSeries = true;
    let arrEpisodes = [];
    if (isSeries) {
      for (let i = 0; i < seasons; i++) {
        let num = parseInt(document.getElementById('numEpisodes_' + i).value);
        num ? arrEpisodes[i] = parseInt(document.getElementById('numEpisodes_' + i).value) : seasonsValid = false;
      }
    }
    else
      arrEpisodes = null;
    event.preventDefault();

    if (seasons < 1) {
      dialogBox("ERROR", "Media type is series, please enter the number of seasons (>0)", false);
      return;
    }
    if (!seasonsValid) {
      dialogBox("ERROR", "Enter the number of episodes in each season (>0)", false);
      return;
    }

    if (!$('#edit_movie').valid()) return;
    else {
      $.ajax({
        type: 'PUT',
        url: '/movie/' + movieData._id,
        data: {
          'name': $('#username').val(),
          'picture': $('#picture').val(),
          'director': $('#director').val(),
          'date': String($('#date').val()).split("-").reverse().join("-"),
          'rating': $('#rating').val(),
          'isSeries': isSeries,
          'series_details': arrEpisodes,
        },
        success: function (result) {
          dialogBox("SUCCESS", result, false);
          setTimeout(function () { window.location.href = '/list'; }, 2000)
        },
        error: function (error) {
          dialogBox("ERROR", error.responseText, false);
        },
      })
    }
  });
});

const editSeries = () => {
  const select = document.getElementById('isSeries');
  if (document.getElementById('mediaType').value === 'series')
    select.style.display = 'block';
  else
    select.style.display = 'none';
}

const editEpisodes = (episodesArr) => {
  let str = '';
  const seasons = parseInt(document.getElementById('seasons').value);

  for (let i = 0; i < seasons; i++) {
    if (episodesArr)
      str += "Season " + (i + 1) + "<input id='numEpisodes_" + i + "' type='number' min='1' step='1' value='" + episodesArr[i] + "' required/>";
    else
      str += "Season " + (i + 1) + "<input id='numEpisodes_" + i + "' type='number' min='1' step='1' required />";
  }

  document.getElementById('episodes_label').innerHTML = 'Enter No. of episodes in each season';
  document.getElementById('episodes').innerHTML = str;
}