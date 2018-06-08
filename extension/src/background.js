var selectedValue;
var return_list;
var current_data;
var stored_array = new Array();

document.addEventListener("DOMContentLoaded", function(){
  textAreaHeight();

  addMenu();

  current_data = localStorage.getItem("current_data");
  if(current_data == null){
    current_data = 0;
  }else{
    current_data = parseInt(current_data, 10);
  }

  document.getElementById("select-type").addEventListener("change", selectChanged);

  document.getElementById("getTitle").addEventListener("click", function(){
    switch(selectedValue){
      case "val-koto":
      getKotoInf();
      break;
      case "val-amazon":
      getBookInf();
      break;
      case "val-web":
      getWebInf();
      break;
    }
  });

  document.addEventListener("keypress", function(e){

    if(e.key == "Enter" && (document.activeElement.tagName=="BODY" || document.activeElement.tagName=="INPUT")){
      document.getElementById("submit").click();
    }
  });

  document.getElementById("submit").addEventListener("click", function(){
    console.log("submit clicked",selectedValue);
    switch(selectedValue){
      case "val-koto":
      dispKotobank();
      break;
      case "val-amazon":
      dispAmazon();
      break;
      case "val-web":
      dispWeb();
      break;
      case "val-news":
      dispNews();
      break;
      case "val-dic":
      dispDic();
      break;
      default:
      dispAdded();
      break;
    }
  });

  document.getElementById("copy-btn").addEventListener("click", function(){
      $("#text").select();
      document.execCommand('copy');
  });

  document.getElementById("local-store").addEventListener("click", function(){
    $("#store-alert").addClass("alert-text-hidden");
    $("#template-title").removeClass("invalid valid");
    $("#store-success").addClass("success-text-hidden");

    if($("#template-title").val() == ""){
      $("#store-alert").removeClass("alert-text-hidden");
      $("#template-title").addClass("invalid");
    }else{
      $("#template-title").addClass("valid");
      $("#store-success").removeClass("success-text-hidden");

      switch (selectedValue) {
        case "val-koto":
        storeKotobank();
        break;
        case "val-amazon":
        storeAmazon();
        break;
        case "val-web":
        storeWeb();
        break;
        case "val-news":
        storeNews();
        break;
        case "val-dic":
        storeDic();
        break;
      }
      current_data += 1;
      localStorage.setItem("current_data", current_data);
      addMenu();
    }
  });

  document.getElementById("local-delete").addEventListener("click", function(){
    deleteAdded();
  });

});

function selectChanged(){
  clearMessage();
  $("input").val("");
  $("#select-news").val("val-default");

  $("#store-alert").addClass("alert-text-hidden");
  $("#template-title").removeClass("invalid valid");
  $("#store-success").addClass("success-text-hidden");

  $(function(){
    var index = document.getElementById("select-type").selectedIndex;
    var options = document.querySelectorAll("#select-type option");
    console.log("select box", options[index].value);
    selectedValue = options[index].value;
    displayField(selectedValue);
    textAreaHeight();
  });
}

function getTitleDisabled(selectType){

  chrome.tabs.query({active:true, windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tab){
    if(tab[0].url.indexOf(selectType) != -1){
      $("#getTitle").attr("disabled", false);
    }else{
      $("#getTitle").attr("disabled", true);
      if(selectType == "amazon"){
        errorMessage("", "情報取得はAmazonのページ上のみ有効");
      }else if(selectType == "kotobank"){
        errorMessage("", "情報取得はコトバンクのページ上のみ有効");
      }
    }
  });
}

function displayField(selectedValue){
  console.log("displayField", selectedValue);
  $("#div-store").removeClass("store-passive");
  $("#div-delete").addClass("store-passive");
  $("#local-store").attr("disabled", false);
  $("#copy-btn").attr("disabled", false);

  switch(selectedValue){
    case "val-amazon":
    $("#submit").attr("disabled", false);
    $(".toggle-active").toggleClass("toggle-active toggle-passive");
    $("#amazon-id").removeClass("toggle-passive");
    $("#amazon-id").addClass("toggle-active");
    getTitleDisabled("amazon");
    break;
    case "val-koto":
    $("#submit").attr("disabled", false);
    $(".toggle-active").toggleClass("toggle-active toggle-passive");
    $("#kotobank-id").removeClass("toggle-passive");
    $("#kotobank-id").addClass("toggle-active");
    $("#div-select-kotobank").removeClass("koto-author-passive");
    $("#div-koto-author").addClass("koto-author-passive");
    getTitleDisabled("kotobank");
    break;
    case "val-web":
    $("#submit").attr("disabled", false);
    $(".toggle-active").toggleClass("toggle-active toggle-passive");
    $("#web-id").removeClass("toggle-passive");
    $("#web-id").addClass("toggle-active");
    $("#getTitle").attr("disabled", false);
    break;
    case "val-news":
    $("#submit").attr("disabled", false);
    $(".toggle-active").toggleClass("toggle-active toggle-passive");
    $("#news-id").removeClass("toggle-passive");
    $("#news-id").addClass("toggle-active");
    $("#getTitle").attr("disabled", true);
    break;
    case "val-dic":
    $("#submit").attr("disabled", false);
    $(".toggle-active").toggleClass("toggle-active toggle-passive");
    $("#dic-id").removeClass("toggle-passive");
    $("#dic-id").addClass("toggle-active");
    $("#getTitle").attr("disabled", true);
    break;
    case "val-default":
    $("#getTitle").attr("disabled", true);
    $("#submit").attr("disabled", true);
    $(".toggle-active").toggleClass("toggle-active toggle-passive");
    $("#local-store").attr("disabled", true);
    $("#copy-btn").attr("disabled", true);
    break;
    default:
    $("#getTitle").attr("disabled", true);
    $("#div-delete").removeClass("store-passive");
    $("#div-store").addClass("store-passive");
    dispFieldAdded();
    break;
  }
}

function getKotoInf(){

  var return_array = new Array();
  var multiIndex;

  chrome.tabs.query({active:true, windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tab){
    chrome.tabs.sendMessage(tab[0].id, {command:"kotobank"},function(response){

      console.log("return message",response);
      var koto_title = ""
      try{
        for (var i=0;i<response.length;i++){
          if(response[i][0][0].indexOf("】より") == -1){
            koto_title = "";
          }else{
            koto_title = "";
            multiIndex = i;
            for (var j=0;j<response[i][0].length;j++){
              koto_title += "、" + response[i][0][j].match(/【([^】]+)/).slice(1);
            }
            koto_title = koto_title.slice(1);
          }
          var koto_dic = response[i][1].match(/([^<]+)/)[0];
          var koto_author = response[i][2].match(/>([^(<||\s||　||「)]+)/)[0].replace(">","");
          var koto_dic_list = [koto_title, koto_dic, koto_author];
          return_array.push(koto_dic_list);
        }

        return_list = return_array;
        console.log("return_array", return_array);
      }catch(e){
        errorMessage(e);
      }
      chrome.tabs.getSelected(null, tab=>{
        try{
          koto_article = tab.title.split("とは")[0]
          $(function(){
            $("#koto-article").val(koto_article);
            $("#select-kotobank").append("<option disabled>──────────</option>");
            for (var j=0; j<return_array.length;j++){
              $("#select-kotobank").append("<option value=" +j+ ">" +return_array[j][1]+ "</option>")
            }
            $("#koto-url-id").val(tab.url);
          });
          document.getElementById("select-kotobank").addEventListener("change", function(){
            var koto_index = document.getElementById("select-kotobank").selectedIndex;
            var koto_options = document.querySelectorAll("#select-kotobank option");

            koto_selectVal = koto_options[koto_index].value;
            if(koto_selectVal == "val-default"){
              $("#koto-publisher").val("");
            }else{
              $("#koto-publisher").val(return_array[koto_selectVal][2]);
            }
            if(koto_selectVal == multiIndex){
              $("#koto-article").val(return_array[koto_selectVal][0]);
            }else{
              $("#koto-article").val(koto_article);
            }
          });
        }catch(e){
          errorMessage(e);
        }
      });
      console.log("error",chrome.runtime.lastError)
    });
  });
}

function getBookInf(){

  clearMessage();
  chrome.tabs.query({active:true, windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {command:"amazon"},function(response){
      console.log("amazon sendRequest", response);
      return_list = response;

      chrome.tabs.getSelected(null, tab=>{
        try{
          var content = return_list[0].split("|")
          var author = content[1].replace(/^\s+|\s+$/g, "");
          var author_array = author.split(", ")
          if (author_array.length > 3){
            author = author_array[0] + " 他"
          }
          var title = content[0].replace(/^\s+|\s+$/g, "");
          for(var i=0; i<return_list.length; i++){
            if(return_list[i].indexOf("出版社")!=-1){
              var publisher = return_list[i].split(" ")[1].replace(/[!"#$%&'()\*\+\-\.,\/:;<=>?@\[\\\]^_`{|}~]/g,"");
            }else if(return_list[i].indexOf("発売日")!=-1){
              var date = return_list[i].match(/\D+(\d+)\D+/)[1];
            }
          }
          $(function(){

            $("#amazon-author").val(author);
            $("#amazon-title").val(title);
            $("#amazon-publisher").val(publisher);
            $("#amazon-publish-year").val(date);
          });
        }catch(e){
          errorMessage(e);
        }
      });
      console.log("error",chrome.runtime.lastError)

    });
  });
}

function getWebInf(){
  clearMessage();
  chrome.tabs.query({active:true, windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tabs){
    try{
      var web_url = tabs[0].url;
      var web_title = tabs[0].title;
      return_list = [web_title, web_url];
      chrome.tabs.getSelected(null, tab=>{

        $(function(){
          $("#web-url").val(web_url);
          $("#web-title").val(web_title);
        });
      });
    }catch(e){
      errorMessage(e);
    }
  });
}

function dispAmazon(){

  var author = $("#amazon-author").val();
  var title = $("#amazon-title").val();
  var publisher = $("#amazon-publisher").val();
  var publish_year = $("#amazon-publish-year").val();
  var pages_start = $("#amazon-pages-start").val();
  var pages_last = $("#amazon-pages-last").val();

  var result_text = "";

  if(author !="") result_text += "、" + author;
  if(title!="") result_text += "、『"+ title  +"』";
  if (publisher != "") result_text += "、" + publisher;
  if (publish_year != "") result_text += "、" + publish_year + "年";
  if (pages_start != "" && pages_last != ""){
    result_text += "、p." + pages_start + "-" + pages_last;
  }else if((pages_start == "" || pages_last == "") && !(pages_start == "" && pages_last == "")){
    result_text += "、p." + pages_start + pages_last;
  }
  result_text = result_text.slice(1);
  $("#text").val(result_text);

}

function dispKotobank(){
  var koto_title = $("#koto-article").val();
  var koto_url = $("#koto-url-id").val();
  var koto_publisher = $("#koto-publisher").val();
  var koto_author = "";
  if($("#div-koto-author").hasClass("koto-author-passive")){
    if(document.getElementById("select-kotobank").selectedIndex != 0){
      koto_author = $("#select-kotobank option:selected").text();
    }
  }else if($("#div-select-kotobank").hasClass("koto-author-passive")){
    koto_author = $("#koto-author").val();
  }

  var result_text = "";
  if(koto_title != "") {
    if(koto_title.indexOf("、") != -1){
      var split_title = koto_title.split("、");
      for (var k=0;k<split_title.length;k++){
        result_text += "、「" + split_title[k] +"」";
      }
      result_text.slice(1);
    }else{
      result_text += "「" + koto_title +"」";
    }
  }
  if(koto_author != "") result_text+= "、" + koto_author;
  if(koto_publisher != "") result_text += "、" + koto_publisher;
  if(koto_url != "") result_text += "、" + koto_url;
  if(result_text.indexOf("、") == 0) result_text = result_text.slice(1)

  $("#text").val(result_text);

}

function dispWeb(){
  var web_title = $("#web-title").val();
  var web_url = $("#web-url").val();
  var web_ref = $("#web-ref").val();
  var result_text = "";

  web_ref = (web_ref == "")? "" : " (" + web_ref + ")";

  if(web_title != "") result_text += "、" + web_title;
  if(web_url != "") result_text += "、" + web_url;
  if(web_ref != "") result_text += web_ref;

  result_text = result_text.slice(1)
  $("#text").val(result_text);
}

function dispNews(){
  var news_title = $("#news-title").val();
  var news_paper = $("#news-paper").val();
  var news_date = $("#news-date").val();
  var news_select = "";
  if(document.getElementById("select-news").selectedIndex != 0){
    news_select = $("#select-news option:selected").text();
  }
  var news_page = $("#news-page").val();

  var result_text = "";
  if(news_title != "") result_text += "、"+"「" + news_title + "」";
  if(news_paper != "") result_text += "、" + news_paper;
  if(news_date != "") result_text += "、" + news_date;
  if(news_select != "") result_text += "、" + news_select;
  if(news_page != "") result_text += "、" + news_page;
  result_text = result_text.slice(1);

  $("#text").val(result_text);
}

function dispDic(){
  var dic_title = $("#dic-title").val();
  var dic_name = $("#dic-name").val();
  var dic_publisher = $("#dic-publisher").val();

  var result_text = "";
  if(dic_title != "") result_text += "、"+"「" + dic_title + "」";
  if(dic_name != "") result_text += "、" + dic_name;
  if(dic_publisher != "") result_text += "、" + dic_publisher

  result_text = result_text.slice(1);

  $("#text").val(result_text);
}

function errorMessage(e, msg="読み取りエラー"){
  $("#alertbox").removeClass("alert-passive");
  $("#alertbox").addClass("alert-active");
  $("#alert-id").html(msg);
  console.log(e);
}

function clearMessage(){
  $("#alertbox").removeClass("alert-active");
  $("#alertbox").addClass("alert-passive");
  $("#alert-id").html("読み取りエラー")
}

function textAreaHeight(){
  $("#text").height(
    $("body").height() - $("#without-text").height() - 30
  );
}


function storeKotobank(){
  var koto_title = $("#koto-article").val();
  var koto_url = $("#koto-url-id").val();
  var koto_publisher = $("#koto-publisher").val();
  var koto_author = "";
  if(document.getElementById("select-kotobank").selectedIndex != 0){
    koto_author = $("#select-kotobank option:selected").text();
  }
  var template_title = $("#template-title").val();

  var koto_data = {
    "koto_title": koto_title,
    "koto_url": koto_url,
    "koto_author": koto_author,
    "koto_publisher": koto_publisher,
  };
  var store_data = {
    "data_type": "kotobank",
    "data": koto_data,
    "template_title": template_title
  };
  console.log(store_data);
  localStorage.setItem(current_data, JSON.stringify(store_data));
}

function storeAmazon(){
  var author = $("#amazon-author").val();
  var title = $("#amazon-title").val();
  var publisher = $("#amazon-publisher").val();
  var publish_year = $("#amazon-publish-year").val();
  var pages_start = $("#amazon-pages-start").val();
  var pages_last = $("#amazon-pages-last").val();
  var template_title = $("#template-title").val();

  var amazon_data = {
    "amazon_title": title,
    "amazon_author": author,
    "amazon_publisher": publisher,
    "amazon_publish_year": publish_year,
    "amazon_pages_start": pages_start,
    "amazon_pages_last": pages_last
  };

  var store_data = {
    "data_type": "amazon",
    "data": amazon_data,
    "template_title": template_title
  };

  console.log(store_data);
  localStorage.setItem(current_data, JSON.stringify(store_data));
}

function storeWeb(){
  var web_title = $("#web-title").val();
  var web_url = $("#web-url").val();
  var web_ref = $("#web-ref").val();
  var template_title = $("#template-title").val();

  var web_data = {
    "web_title": web_title,
    "web_url": web_url,
    "web_ref": web_ref
  };

  var store_data = {
    "data_type": "web",
    "data": web_data,
    "template_title": template_title
  };

  console.log(store_data);
  localStorage.setItem(current_data, JSON.stringify(store_data));
}

function storeNews(){
  var news_title = $("#news-title").val();
  var news_paper = $("#news-paper").val();
  var news_date = $("#news-date").val();
  var news_select = "";
  if(document.getElementById("select-news").selectedIndex != 0){
    news_select = $("#select-news option:selected").text();
  }
  var news_page = $("#news-page").val();
  var template_title = $("#template-title").val();

  var news_data = {
    "news_title": news_title,
    "news_paper": news_paper,
    "news_date": news_date,
    "news_select": news_select,
    "news_page": news_page
  };

  var store_data = {
    "data_type": "news",
    "data": news_data,
    "template_title": template_title
  };

  console.log(store_data);
  localStorage.setItem(current_data, JSON.stringify(store_data));
}

function storeDic(){
  var dic_title = $("#dic-title").val();
  var dic_name = $("#dic-name").val();
  var dic_publisher = $("#dic-publisher").val();
  var template_title = $("#template-title").val();

  var dic_data = {
    "dic_title": dic_title,
    "dic_name": dic_name,
    "dic_publisher": dic_publisher
  };

  var store_data = {
    "data_type": "dic",
    "data": dic_data,
    "template_title": template_title
  };

  console.log(store_data);
  localStorage.setItem(current_data, JSON.stringify(store_data));
}

function addMenu(){
  var data_length = localStorage.length;
  for(var i=0; i<data_length; i++){
    var key_name = localStorage.key(i);
    if(key_name != "current_data"){
      var data_elem = JSON.parse(localStorage.getItem(key_name));
      stored_array[key_name] = data_elem;
    }
  }
  var key_array = Object.keys(stored_array);
  console.log(key_array);
  key_array = key_array.map(function (x) { return parseInt(x,10); });
  console.log(key_array);
  key_array.sort(
    function(a,b){
      if( a < b ) return -1;
      if( a > b ) return 1;
      return 0;
    }
  );

  console.log(key_array);

  for(var j=0;j<key_array.length;j++){
    key_name = key_array[j].toString();
    data_elem = stored_array[key_name];
    if(document.getElementById("newID_" + key_name) == null){
      $("<option>", {
        id: "newID_" + key_name,
        value: key_name,
        text: data_elem["template_title"]
      }).appendTo('#select-type');
    }
  }
  console.log(stored_array);
}

function dispFieldAdded(){
  var stored_elem = stored_array[selectedValue];
  var added_type = stored_elem["data_type"];
  console.log("dispFieldAdded", stored_elem);
  console.log("added_type", added_type);
  $("#getTitle").attr("disabled", true);

  switch(added_type){
    case "amazon":
    $("#submit").attr("disabled", false);
    $(".toggle-active").toggleClass("toggle-active toggle-passive");
    $("#amazon-id").removeClass("toggle-passive");
    $("#amazon-id").addClass("toggle-active");

    $("#amazon-author").val(stored_elem["data"]["amazon_author"]);
    $("#amazon-title").val(stored_elem["data"]["amazon_title"]);
    $("#amazon-publisher").val(stored_elem["data"]["amazon_publisher"]);
    $("#amazon-publish-year").val(stored_elem["data"]["amazon_publish_year"]);
    $("#amazon-pages-start").val(stored_elem["data"]["amazon_pages_start"]);
    $("#amazon-pages-last").val(stored_elem["data"]["amazon_pages_last"]);
    break;
    case "kotobank":
    $("#submit").attr("disabled", false);
    $(".toggle-active").toggleClass("toggle-active toggle-passive");
    $("#kotobank-id").removeClass("toggle-passive");
    $("#kotobank-id").addClass("toggle-active");
    $("#div-select-kotobank").addClass("koto-author-passive");
    $("#div-koto-author").removeClass("koto-author-passive");

    $("#koto-article").val(stored_elem["data"]["koto_title"]);
    $("#koto-url-id").val(stored_elem["data"]["koto_url"]);
    $("#koto-publisher").val(stored_elem["data"]["koto_publisher"]);
    $("#koto-author").val(stored_elem["data"]["koto_author"]);
    break;
    case "web":
    $("#submit").attr("disabled", false);
    $(".toggle-active").toggleClass("toggle-active toggle-passive");
    $("#web-id").removeClass("toggle-passive");
    $("#web-id").addClass("toggle-active");
    $("#web-title").val(stored_elem["data"]["web_title"]);
    $("#web-url").val(stored_elem["data"]["web_url"]);
    $("#web-ref").val(stored_elem["data"]["web_ref"]);
    break;
    case "news":
    $("#submit").attr("disabled", false);
    $(".toggle-active").toggleClass("toggle-active toggle-passive");
    $("#news-id").removeClass("toggle-passive");
    $("#news-id").addClass("toggle-active");

    $("#news-title").val(stored_elem["data"]["news_title"]);
    $("#news-paper").val(stored_elem["data"]["news_paper"]);
    $("#news-date").val(stored_elem["data"]["news_date"]);
    if(stored_elem["data"]["news_select"]=="朝刊"){
      $("#select-news").val("val-morning");
    }else if(stored_elem["data"]["news_select"]=="夕刊"){
      $("#select-news").val("val-night");
    }
    $("#news-page").val(stored_elem["data"]["news_page"]);
    break;
    case "dic":
    $("#submit").attr("disabled", false);
    $(".toggle-active").toggleClass("toggle-active toggle-passive");
    $("#dic-id").removeClass("toggle-passive");
    $("#dic-id").addClass("toggle-active");

    $("#dic-title").val(stored_elem["data"]["dic_title"]);
    $("#dic-name").val(stored_elem["data"]["dic_name"]);
    $("#dic-publisher").val(stored_elem["data"]["dic_publisher"]);
    break;
  }

}

function dispAdded(){
  var stored_elem = stored_array[selectedValue];
  var added_type = stored_elem["data_type"];
  console.log("dispAdded", stored_elem);
  console.log("added_type", added_type);

  switch (added_type) {
    case "kotobank":
    dispKotobank();
    break;
    case "amazon":
    dispAmazon();
    break;
    case "web":
    dispWeb();
    break;
    case "news":
    dispNews();
    break;
    case "dic":
    dispDic();
    break;
  }
}

function deleteAdded(){
  $("#select-type").val("val-default");
  selectChanged();
  $("#select-type > option[value = " + selectedValue + "]").remove();
  localStorage.removeItem(selectedValue);
}
