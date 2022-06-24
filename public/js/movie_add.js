
$(document).ready(function () {
  document.getElementById('date').max = new Date().toISOString().split("T")[0];
  $("form[name='add_movie']").validate({
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

  $('#add_movie').submit(function (event) {
    event.preventDefault();

    const seasons = document.getElementById('seasons').value;
    const type = document.getElementById('mediaType').value;
    let arrEpisodes = [];
    let seasonsValid = true;
    if (type === 'series')
      isSeries = true;
    if (isSeries) {
      for (let i = 0; i < seasons; i++) {
        let num = parseInt(document.getElementById('numEpisodes_' + i).value);
        num ? arrEpisodes[i] = parseInt(document.getElementById('numEpisodes_' + i).value) : seasonsValid = false;
      }
    }
    else
      arrEpisodes = null;

    if (seasons < 1) {
      dialogBox("ERROR", "Media type is series, please enter the number of seasons (>0)", false);
      return;
    }
    if (!seasonsValid) {
      dialogBox("ERROR", "Enter the number of episodes in each season (>0)", false);
      return;
    }

    if (!$('#add_movie').valid()) return;
    else {
      $.ajax({
        type: 'POST',
        url: '/movies',
        contentType: 'application/json',
        data: JSON.stringify({
          'id': $('#id').val(),
          'name': $('#username').val(),
          'picture': $('#picture').val(),
          'director': $('#director').val(),
          'date': String($('#date').val()).split("-").reverse().join("-"),
          'rating': $('#rating').val(),
          'isSeries': isSeries,
          'series_details': arrEpisodes,
          'actors': [],
        }),
        processData: false,
        encode: true,
        success: function (result) {
          dialogBox("SUCCESS", result, false);
          setTimeout(function () { window.location.href = '/list'; }, 2000)
        },
        error: function (error) {
          dialogBox("ERROR", error.responseText, false);
        }
      })
    }
  });
});

const addSeries = () => {
  // If client chooses to add a series, show input for the number of seasons
  const select = document.getElementById('isSeries');
  if (document.getElementById('mediaType').value === 'series')
    select.style.display = 'block';
  else
    select.style.display = 'none';
}

const addEpisodes = () => {
  // After the client chose the number of seasons, show input for the number of episodes in each season
  let str = '';
  const seasons = parseInt(document.getElementById('seasons').value);

  for (let i = 0; i < seasons; i++)
    str += "Season " + (i + 1) + "<input id='numEpisodes_" + i + "' type='number' min='1' step='1' required />";

  document.getElementById('episodes_label').innerHTML = 'Enter No. of episodes in each season';
  document.getElementById('episodes').innerHTML = str;
}