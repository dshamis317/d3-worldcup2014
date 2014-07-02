$(function() {
    $('.team-submit').submit(function(e) {
      e.preventDefault();
      teamData();
    })
  });

  function teamData() {
    var inputField = $('.team-name');
    var team = inputField.val().toUpperCase();
    inputField.val('');
    postTeam(team);
  };

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

  function getTeamData(team) {
    var teamName = team;
    $.ajax({
      url: '/team/'+ teamName,
      method: 'get',
      // dataType: 'json',
      success: function(data) {
        console.log(data)
      }
    });
  }
