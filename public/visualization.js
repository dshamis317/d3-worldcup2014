$(function() {
  $('.team-submit').submit(function(e) {
    e.preventDefault();
    teamData();
  })
});

// Retrieve Team Name
function teamData() {
  var inputField = $('.team-name');
  var team = inputField.val().toUpperCase();
  inputField.val('');
  postTeam(team);
};

// Send Post Request with callback to get data
function postTeam(team) {
  $.ajax({
    url: '/team',
    method: 'post',
    dataType: 'json',
    data: {teamName: team},
    success: function(data) {
      getTeamData(data.teamName);
    }
  });
}

// Get request for visualization data
function getTeamData(team) {
  var teamName = team;
  $.ajax({
    url: '/team/'+ teamName,
    dataType: 'json',
    method: 'get',
      // dataType: 'json',
      success: function(data) {
        window.teamGames = data;
        parseData(data)
      }
    });
}

// Parse returned data
function parseData(data) {
  var data = data;
  var matchData = [];
  $.each(data, function(idx, match) {
    var played = [];
    played.date = match.datetime;
    played.location = match.location;
    played.away = match.away_team.country;
    played.awayGoals = match.away_team.goals;
    played.home = match.home_team.country;
    played.homeGoals = match.home_team.goals;
    matchData.push(played);
  })
  buildSvg(matchData);
}

// Build SVG
function buildSvg(data) {
  var margin = {
    top: 100,
    bottom: 100,
    left: 100,
    right: 100
  }
  var width = $(window).width() - margin.left - margin.right;
  var height = 600 - margin.top -margin.bottom

  window.lineScale = d3.scale.linear()
                        .domain([0, 120])
                        .range([0, width])

  window.svg = d3.select('body')
                 .append('svg')
                   .attr('width', width + margin.right + margin.left)
                   .attr('height', height + margin.top + margin.bottom)
                 .append('g')
                   .attr('width', width)
                   .attr('height', height)
                   .attr('class', graph)
                   .attr('transform', 'translate('+ margin.left + ','+ margin.top + ')');

  var line = d3.svg.line()
                   .interpolate('basis')

}
