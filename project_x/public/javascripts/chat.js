$(document).ready(function(){

  //getUSERID
  var userID = $('#userID').text();

  //userpic & bot pic
  var userPIC = '<img src="https://graph.facebook.com/' + userID + '/picture" alt="" class="chatPIC">';
  var elaPIC = '<img src="../stylesheets/assets/logos/ela_thumb.png" alt="" class="chatPIC">';

  //DEFAULT: BOT PRESENCE IN CHAT
  $(".bulletin").append("<div>" + elaPIC + " <p class='chatpost'><span class='user'>Ela bot: </span>" + "A user has been found!" + "</br></p></div>")

	//client aanmaken zoals op http://faye.jcoglan.com/node/clients.html
	var client = new Faye.Client('http://localhost:3000/faye/',{
				timeout: 20
	});

	//subscribe en vraag printen http://faye.jcoglan.com/browser/subscribing.html
	var postSubscribtion = client.subscribe('/post', function(message) {
      //timestamp als ID
      var timestamp = new Date().getTime();

  		//handle messages en voeg ID aan messages toe om ze uniek te maken
  		var newsPost = $(".bulletin").append("<div>" + userPIC + " <p class='chatpost' id='p" + timestamp + "'><span class='user'>" + message.user + ": </span><span class='translateMSG' style='cursor: pointer;' onclick='translateME(m" + timestamp + ")' id='m" + timestamp + "'>" + message.post + "</span></br></p></div>");
  });

  	//onclick subscribe / publish
    $('#send').on('click', function(){
  			//haal values op voor publish
  			var userVal = $('#userName').text();
  			var postVal = $('#message').val();

		//als velden leeg zijn, error kleur
		if(postVal === "" )
    	{
    		$('#message').css("border-color", "red");
    	}
    	else
    	{
    		$('#message').css("border-color", "#0dbebe");
        $('#message').val("");
			  var postPublication = client.publish('/post', {post : postVal, user : userVal}); 
	    }
    }); //einde van post button onclick

    //nen enter hetzeflde /publish
    $('#message').keypress(function(e) {
      if(e.which == 13) {
              //haal values op
          var userVal = $('#userName').text();
          var postVal = $('#message').val();

      //als velden leeg zijn, error kleur
        if(postVal === "" )
        {
          $('#message').css("border-color", "red");
        }
        else
        {
          $('#message').css("border-color", "#0dbebe");
          $('#message').val("");
          var postPublication = client.publish('/post', {post : postVal, user : userVal}); 
        }
      }
    });

    /*http://faye.jcoglan.com/browser/extensions.html*/
    /*http://faye.jcoglan.com/node.html*/
    /*http://faye.jcoglan.com/node/extensions.html*/
    /*https://groups.google.com/forum/#!topic/faye-users/EQwzcs2swY8*/

    /*USER CONNECTS: FAYE PUBLISHES MESSAGE*/

    var userConnect = client.subscribe('/userconnect', function(message) {
      //timestamp als ID
      var timestamp = new Date().getTime();
      var userLoc = $('#location').text();

      //handle messages en voeg ID aan messages toe om ze uniek te maken
      $(".bulletin").append("<div>" + elaPIC + " <p class='chatpost'><span class='user'>Ela bot: </span>" + message.user + " has entered the chatroom from " + userLoc + "." + "</br></p></div>");
    }); 

    client.addExtension({
    incoming: function(message, callback) {
      if (message.channel === '/meta/handshake') {
        var userVal = $('#userName').text();
        var userConnectPublish = client.publish('/userconnect', {user : userVal});
      }
      callback(message);
      }
    });

    /*USER DISCONNECTS: FAYE PUBLISH MESSAGE*/

    var userConnect = client.subscribe('/userdisconnect', function(message) {
      //timestamp als ID
      var timestamp = new Date().getTime();

      //handle messages en voeg ID aan messages toe om ze uniek te maken
      $(".bulletin").append("<div>" + elaPIC + " <p class='chatpost'><span class='user'>Ela bot: </span>" + message.user + " has left the chatroom." + "</br></p></div>");
    }); 

    client.addExtension({
    incoming: function(message, callback) {
      if (message.channel === '/meta/disconnect') {
        var userVal = $('#userName').text();
        var userConnectPublish = client.publish('/userdisconnect', {user : userVal});
        //publish duurt te lang wanneer we wegnavigeren voor het script op uit te voeren?
        //omdat die al dc'd is kan die geen messages meer studern?

        //hij kan wel console doen en alerten want das ni me faye
        console.log("unsub");
      }
      callback(message);
      }
    });

    //ADD COUNTRY FROM USERS CONNECTING
    //ADD TRANSLATE FROM AND TOO SETTINGS IN PROFILE

});

  //http://jsfiddle.net/n9YLp/1/
  //http://social.msdn.microsoft.com/Forums/en-US/0ed61e34-1199-4000-8575-7976d7b98067/jquery-ajax-bing-translator?forum=microsofttranslator
  //http://msdn.microsoft.com/en-us/library/ff512421.aspx
  //http://www.microsoft.com/web/post/using-the-free-bing-translation-apis
  //http://msdn.microsoft.com/en-us/library/hh454950.aspx
  //http://msdn.microsoft.com/en-us/library/ff512385.aspx
  //http://kitmenke.com/blog/2013/08/27/use-jquery-to-call-the-microsoft-translator-ajax-api/
  //http://stackoverflow.com/questions/11679217/microsoft-azure-translator-ajax-api-not-working

  //url wordt custom php script op server
  //server roept aan en geeft resultaat


  function translateME(id){
      //ajaxTranslate(chatVal, "en", "de");
      //getlanguage
     /* var langKey = "&key=cc871bbedadf4c08747376aba99984af";
      var langBase = "http://ws.detectlanguage.com/0.2/detect?q=";
      //get text that needs to be translated & detected
      var chatVal = $(id).text();
      //complete url voor ajax call
      //detectUrl = document.createElement("script"); //detectUrl.src
      detectUrl = langBase+chatVal+langKey;*/

      var langKey = "http://api.whatlanguage.net/language/v1/detect?key=60525228d76611e393e6d43d7ebed8c2&q="
      var chatVal = $(id).text();
      var detectUrl = langKey+chatVal;

      console.log(detectUrl);

      //document.getElementsByTagName("head")[0].appendChild(detectUrl);
      //http://detectlanguage.com/
      //http://stackoverflow.com/questions/3467404/chrome-says-resource-interpreted-as-script-but-transferred-with-mime-type-text
      //HEADERS?
      //http://nodejs.org/api/https.html
      //https://github.com/mikeal/request

      //60525228d76611e393e6d43d7ebed8c2

      $.ajax({
                //crossDomain: true,
                url: detectUrl,
                type: "GET",
                //contentType: "application/json",
                //xhrFields: {withCredentials: false},
                //headers: {},
                dataType: 'json',
                //onCallback: 'langCallback',
                //jsonpCallback: "lang",
                success: function(response) //Wnr get succesvol is gaat hij deze functie uitvoeren
                {
                    //set city
                    //var city = response.results[0].address_components[2].long_name;
                    JSON.stringify(response);
                    var stringify = response;//.data.detections.language;
                    console.log(JSON.parse(stringify));//JSON.parse(stringify)
                },
                error: function() {
                    console.log("couldn't receive response");
                }
      });

      /*window.langCallback = function(response) {
        alert(response);
      }*/

      /*window.mycallback = function(response) {
        $(id).text(response);
      }

      //78280AF4DFA1CE1676AFE86340C690023A5AC139
      //68D088969D79A8B23AF8585CC83EBA2A05A97651

      var s = document.createElement("script");
      s.src = "http://api.microsofttranslator.com/V2/Ajax.svc/Translate?oncomplete=mycallback&appId=78280AF4DFA1CE1676AFE86340C690023A5AC139&from=en&to=de&text=" + chatVal;

      document.getElementsByTagName("head")[0].appendChild(s);*/
  };

  /*TRANSLATE API*/

  //https://github.com/troygoode/node-cors

  /*function ajaxTranslate(textToTranslate, fromLanguage, toLanguage) {
      //object aanmaken voor translate
      var p = {};
      p.appid = 'ByNC7HeVB3mLDJEZ3ctDvE1PgS80hxapToSaqDIv0Z8=';
      p.to = toLanguage;
      p.from = fromLanguage;
      p.text = textToTranslate;
      console.log(p);
      //geef object aan API
      $.ajax({
        url: 'http://api.microsofttranslator.com/V2/Ajax.svc/Translate',
        data: p,
        dataType: 'jsonp',
        jsonp: 'oncomplete',
        jsonpCallback: 'ajaxTranslateCallback',
        complete: function(request, status) {
          alert('complete: '+status);
        },
        success: function(data, status) {
          alert('success: data-'+data+',status-'+status);
        },
        error: function(request, status, error) {
          alert('error: status-'+status+',desc-'+error);
        }
      });
  } 

  function ajaxTranslateCallback(response) { 
    alert('ajaxTranslateCallback('+response+')'); 
  }*/
    
    // Get an access token now.  Good for 10 minutes.
    /*getToken();
    // Get a new one every 9 minutes.
    setInterval(getToken, 9 * 60 * 1000);

    function getToken() {
      //token scriptje
      //var requestStr = "../php/token.php";

      var clientID = "th1s1smy4ppimtr4nsl4t1ngw1thf0r3l4";
      var clientSecret = "57DkrwiR97DJ6AUah9StWW391rVgRdg3X8kQIbRVRQc=";
      var requestStr = "https://datamarket.accesscontrol.windows.net/v2/OAuth2-13grant_type=client_credentials&client_id=" + clientID + "&client_secret=" + clientSecret + "&scope=http://api.microsofttranslator.com";

      console.log(requestStr);

      $.ajax({
        url: requestStr,
        type: "GET",
        cache: true,
        dataType: 'json',
        success: function (data) {
          JSON.stringify(data)
          g_token = data.access_token;
        }
      });

      console.log(g_token);
    }

    function translateME(id){
      console.log(g_token);
    };*/
