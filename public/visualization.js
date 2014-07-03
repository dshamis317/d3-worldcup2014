$(function() {
  $('.show-teams').click(function() {
    $('.teams').slideToggle();
  })

  $('.team-submit').submit(function(e) {
    e.preventDefault();
    $('.visualization').html('');
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
  var data = data;

  var margin = {
    top: 100,
    bottom: 100,
    left: 100,
    right: 100
  }
  var width = (1265 - margin.left - margin.right)/3;
  var height = 500 - margin.top - margin.bottom;

  var maxGoalsHome = d3.max(data, function(team) {
    return team.homeGoals;
  });

  var maxGoalsAway = d3.max(data, function(team) {
    return team.awayGoals;
  });

  var homeColor = d3.scale.linear()
                      .range(['#ff0000', '#0000ff'])
                      .domain([0, maxGoalsHome]);

  var awayColor = d3.scale.linear()
                      .range(['#ffff00', '#00ffff'])
                      .domain([0, maxGoalsAway]);

  var xScale = d3.scale.linear()
                  .domain([0, maxGoalsHome + 1])
                  .range([0, width]);

  var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient('bottom');

  var canvas = d3.select('.visualization')
                 .append('svg')
                   .attr('width', width + margin.right + margin.left)
                   .attr('height', height + margin.top + margin.bottom)
                 .append('g')
                   .attr('width', width)
                   .attr('height', height)
                   .attr('class', 'set')
                   .attr('transform', 'translate('+ margin.left + ','+ margin.top + ')');

  var canvas2 = d3.select('.visualization')
                 .append('svg')
                   .attr('width', width + margin.right + margin.left)
                   .attr('height', height + margin.top + margin.bottom)
                 .append('g')
                   .attr('width', width)
                   .attr('height', height)
                   .attr('class', 'set')
                   .attr('transform', 'translate('+ margin.left + ','+ margin.top + ')');

  var home = canvas.selectAll('rect')
                    .data(data)
                    .enter()
                    .append('rect')
                      .attr('width', width)
                      .attr('height', 40)
                      .attr('fill', function(d) {return homeColor(d.homeGoals)})
                      .attr('x', function(d, i) {return i})
                      .attr('y', function(d, i) {return i * 60})
                      .transition()
                        .duration(1500)
                        .attr('width', function(d) {return xScale(d.homeGoals)})
                      // .append('text')
                      //   .text('Home Goals')

  var away = canvas2.selectAll('rect')
                    .data(data)
                    .enter()
                    .append('rect')
                      .attr('width', width)
                      .attr('height', 40)
                      .attr('fill', function(d) {return awayColor(d.awayGoals)})
                      .attr('x', function(d, i) {return i})
                      .attr('y', function(d, i) {return i * 60})
                      .transition()
                        .duration(1500)
                        .attr('width', function(d) {return xScale(d.awayGoals)})
                      // .append('text')
                      //   .text(function(d){return d.away})

  canvas.append('g')
        .attr('transform', 'translate(0, 300)')
        .call(xAxis)

  canvas.selectAll('svg')
        .append('text')
        .data(data)
        .enter()
        .append('text')
          .text(function(d){return d.home + ', ' + d.homeGoals})
          .attr('x', function(d, i) {return i})
          .attr('y', function(d, i) {return i * 60})

  canvas.selectAll('svg')
          .append('text')
            .text('Home Team Scoring')

  canvas2.append('g')
        .attr('transform', 'translate(0, 300)')
        .call(xAxis)

  canvas2.selectAll('svg')
      .append('text')
      .data(data)
      .enter()
      .append('text')
        .text(function(d){return d.away + ', ' + d.awayGoals})
        .attr('x', function(d, i) {return i})
        .attr('y', function(d, i) {return i * 60})

  canvas2.selectAll('svg')
            .append('text')
              .text('Away Team Scoring')
}
