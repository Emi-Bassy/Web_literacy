(function ($) {
    $(function () {
      $.ajax({
        url: './roomadmin',
        type: 'GET',
        dataType: "json",
      }).done(function (data) {
        $('#roomname_result').html(data)
      }).fail(function (data) {
        console.log('error');
      });
    });
  })(jQuery);