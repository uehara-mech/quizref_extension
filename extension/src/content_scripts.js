chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  if(request.command=="kotobank"){
    cmdKtbnk(sendResponse);
  }else if(request.command=="amazon"){
    // console.log("hello");
    cmdAmazon(sendResponse);
  }
  return true;
});

function cmdKtbnk(sendResponse){
  var list = new Array();

  var article_list = document.querySelectorAll(".dictype");
  // console.log(article_list);
  for(var i=0;i<article_list.length;i++){
    koto_title_list = article_list[i].querySelectorAll("h3");
    var koto_title = new Array();
    for (var j=0;j<koto_title_list.length;j++){
      koto_title.push(koto_title_list[j].innerHTML);
    }
    try {
      koto_dic = article_list[i].querySelector("h2").querySelector("a").innerHTML;
      // console.log(koto_dic);
    } catch(e){
      // console.log(e);
      koto_dic = article_list[i].querySelector("h2").innerHTML;;
    }
    try {
      koto_author = article_list[i].querySelector(".source").innerHTML;
    } catch(e){
      // console.log(e);
      koto_author = "";
    }
    var dic_array = [koto_title, koto_dic, koto_author];
    // console.log(dic_array);
    list.push(dic_array);
  }

  sendResponse(list);
}

function cmdAmazon(sendResponse){
  // console.log("cmdAmazon");
  var list = new Array();
    // console.log("loaded");
    var inf_area = document.getElementById('detail_bullets_id');

    var title = document.querySelector("title");
    list.push(title.innerHTML);

  var book_inf = inf_area.querySelectorAll("li");
  for(var i=0; i<book_inf.length; i++){
    list.push(book_inf[i].innerHTML);
  }
  sendResponse(list);

}
