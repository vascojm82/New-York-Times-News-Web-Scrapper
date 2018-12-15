function toggleNavLiEffect(){
  if($(window).width() < 768) {
    $('.navbar-nav.login-favs li').removeClass('hvr-grow');
  }else{
    $('.navbar-nav.login-favs li').addClass('hvr-grow');
  }
}

function toggleCenterDiv(){
  if($(window).width() < 992) {
    $('.main-row').removeClass('synopsis-row');
  }else{
    $('.main-row').addClass('synopsis-row');
  }
}

$( document ).ready(function() {
  toggleNavLiEffect();
  toggleCenterDiv();

  function saveRecord(route, record){
    console.log("Ajax call record: " + JSON.stringify(record));

    $.ajax({
      url: route,
      method: "POST",
      data: record
      })
      .then(function(data) {
        console.log(data);
        if (data) {
          console.log("Favorite Article Saved Sucessfully");
          console.log("data: " + JSON.stringify(data));
          alert("Article Saved to Your Favorites!");
        } else {
        alert("Error Saving Favorite Article");
      }
    });
  }

  $('.btn-save').click(function(){
    let dataArticle = $(this).data("article");
    let domQuery = `div.panel.panel-primary.art-${dataArticle}`;
    let route ="https://stark-fortress-35869.herokuapp.com/favorites";

    let record = {
      heading: $(domQuery).find(".article-link").text(),
      description: $(domQuery).find("p.article-description").text(),
      url: $(domQuery).find(".article-link").attr("href"),
      image: $(domQuery).find(".article-img").prop('src')
    }

    console.log(`Record: ${JSON.stringify(record)}`);
    saveRecord(route, record);
  });
});

$(window).resize(function(){
    toggleNavLiEffect();
    toggleCenterDiv();
    console.log($(window).width());
});
