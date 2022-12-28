


// "App logic."

// On page.id init: do stuff
// note that controllers.js does _exactly_ the same thing. take your pick. I didnt dream this structure up I just did my best to follow the rules.  You can also just call a function where you store all your app logic, which I did, and which probably isnt following the rules. IDK.


window.myApp = {};

 //new user bombs in webview if it checks for vars in localStorage and they arent there.
sane_defaults = {darkSwitch: false, godmodeSwitch: false, max_tokens: 1000, top_p: 1, temperature: 0, model: "text-davinci-002"}
for(let e in sane_defaults) {
    if (window.localStorage.getItem(e) === null) {
        window.localStorage.setItem(e, sane_defaults[e]);
    }
};


//Onward to init...      
      
document.addEventListener('init', function(event) {
  var page = event.target;
   myApp.services.settings.setThemeAtStartup();
  // Assoiciate page with controller in controllers.js
  if (myApp.controllers.hasOwnProperty(page.id)) {
    myApp.controllers[page.id](page);
  };
  
  if (page.id === 'twopanePage') {

      myApp.services.tasks.setText('Suggestions arrive here! Use the copy button in the toolbar if you want to append them to the prompt.', true )
      
    }; //end of twopanePage   
    
    if (page.id === "loadingPage") {
        console.log('in loadingpage app.js')
        var id = null;
function myMove() {
  var elem = document.querySelector("#loading");
  var value = 0;
  clearInterval(id);
  id = setInterval(frame, 1);
  function frame() {
    if (value == 100) {
      clearInterval(id); document.querySelector('#myNavigator').pushPage('twopane.html');
    } else {
        //console.log('in value++ step '+value)
      value++;
       document.querySelector("#loading").value = value
    }
  }
}

}; //end of loadingPage
    
}); //end of addEventListener
