myApp.services = {
    tasks: {
        setText: function(text, placeholder = false) {
            textarea = document.getElementById('edit-bottom');
            if (placeholder == true) {
                textarea.placeholder = text;
            } else {
                textarea.value = text;
            }
        },
    copyUp: function() {
text = document.getElementById('edit-bottom').value;
textabove = document.getElementById('edit-top');
textabove.value += text;
},
getSug: function() {
    //coupla sanity checks
    try { apikey = localStorage.APIKey;
           apikey.length;
           } catch { ons.notification.alert("API Key undefined! Please set your key in Settings.") }
    try { model = localStorage.model } catch { model = 'text-davinci-002'; console-log('model not found in localStorage.model, falling back to text-davinci-002') };
     //alert('getsug')
  //progressBar('add');
 	promptwindow = document.getElementById('edit-top');
  prompt = promptwindow.value;
 	// POST	to server:
 	var url = "https://api.openai.com/v1/completions"
 	fetch(url, {
 			method: 'POST',
 			headers: {
 				'Content-Type': 'application/json',
 				'Authorization': 'Bearer ' + apikey },
 			body: JSON.stringify({
 				"prompt": prompt,
 				'echo': false,
 				'model': model,
 				'temperature': parseInt(localStorage.temperature,10),
 				'max_tokens': parseInt(localStorage.max_tokens,10),
 				'top_p': parseInt(localStorage.top_p,10)
 			})
 		})
 		.then(response => response.json())
 		.then(data => parseRet(data))
 		.catch(error => myApp.services.tasks.setText("Error: " + error));
 	function parseRet(data) {
 		try {
 		    //welp yet again led astray by davinci, who told me multiple responses were __always_ generated, however they are NOT unless you specify using 'n:' in POST. But the logic has been written so it may as well stay.
 		  result = ""  
 		  results = data.choices
 		  if(results.length > 1) {
 		      count=0;
 		      //make a popup presenting previews in cards
 		      results.forEach((e) => {
 		          result += "\nResult #"+count+":\n"+e.text+"\n\n"
 		          count++;
 		          })  
 		          }else{ result = results[0].text }
 		          myApp.services.tasks.setText(result)
 		  //3 lines below was prev. working way:  
 			//result = data.choices[0].text
 			//result = result.trim() + "\n"
 			//myApp.services.tasks.setText(result)
 		} catch(e) {
 		    //myApp.services.tasks.setText(e)
 			myApp.services.tasks.setText("Server Error: " + data.error.message+" "+e)
 		} 
 	}
}, // end of getSug
//Returns ex. "Dec 6, 4:34PM"
getPrettyTimeStamp: function() {
    var date = new Date();
    var m = date.getMonth();
    var months =['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    var month = months[m]
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;
    minute = minute < 10 ? '0' + minute : minute;
    var strTime = month + ' ' + day + ', ' + hour + ':' + minute + ampm;
    return strTime;
},

saveToStorage: function() {
    console.log('in saveToStorage')
    //gather the two textareas
    text = document.getElementById('edit-bottom').value;        
textabove = document.getElementById('edit-top').value;
    if (text == "") {
        //dont save 'undefined' at end of the file.
        total = textabove
        } else {
     total = textabove+text
     }
     //make object/dict
     oF = {};
     oF.date = myApp.services.tasks.getPrettyTimeStamp()
     oF.timestamp = Date.now() //for sorting?
     oF.data = total
    //json stringify
    processed = JSON.stringify(oF)
    //send to storage
     window.localStorage.setItem("saved_"+oF.timestamp,processed)
    //idk is a popup necessary
    alert('file saved! make me fancy')
    
}, //end of save to storage

del: function(id) {
  var element = document.getElementById(id);
  element.parentNode.removeChild(element);
  window.localStorage.removeItem('saved_'+id);
},
loadFromHistory: function(timestamp) {
  d=window.localStorage.getItem('saved_'+timestamp)
  e=JSON.parse(d)  
  document.getElementById('edit-top').value=e.data
  //mainly here so we can alert we did so.
  //make it nicer eventually
  ons.notification.alert('prompt loaded to main screen!')
},    
loadFromStorage: function() {
    //this function has a function inside of it, as we dont need it anywhere else. it prevents the text inside the preview cards from being interpreted by stripping tags...and when loadFromHistory is called, the unstripped stuff is still sent to the editor so we dont lose ability to save/restore js/html snippets.
    function htmlPurifier(htmlString) {
  // Strip all HTML tags
  let strippedString = htmlString.replace(/<[^>]*>/g, '');

  // Replace all HTML entities with their corresponding characters
  let entityRegex = /&#?[a-zA-Z0-9]+;/g;
  let entities = htmlString.match(entityRegex);
  if (entities) {
    entities.forEach(entity => {
      let char = String.fromCharCode(entity.replace(/&#?([a-zA-Z0-9]+);/, '$1'));
      strippedString = strippedString.replace(entity, char);
    });
  }

  // Return the purified string
  return strippedString;
}

//note we're still in loadFromStorage
    
    //onsen cards, of course, refuse any styling concerning width overflow. so, we will limit width relative to global screen width. more sigh. var width below will be referenced in the html output 'pre'
    var width = window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
    width = width-(width * .2) //minus 20%
    //console.log('width: '+width)
    //woot, a list of keys!
    keys = Object.getOwnPropertyNames(localStorage)
    //need to unstringify, make cards:
    saved_files = []
    for(var i = 0;i<keys.length;i++) {
        if(keys[i].includes('saved_')) {       saved_files.push(window.localStorage.getItem(keys[i]))
            }
        }
        //console.log('saved_files: ')
        //console.log(saved_files)
    sorted_files = saved_files.sort((a, b) => parseFloat(JSON.parse(b).timestamp) - parseFloat(JSON.parse(a).timestamp));
    //make a compendium of htmlformattedblobs
    cards = []
    saved_files.forEach((i) => {
        j=JSON.parse(i)
            //build a burger. format is
            // {date,timestamp,data}
            TIMESTAMP = j.timestamp
            PRETTYTIMESTAMP = j.date
            DATA = htmlPurifier(j.data)
            //st theyre already small:
            try {
            DATABLURB = DATA.substring(0,1000)
            } catch(e) { DATABLURB = DATA }
                
            pre='<ons-list-item id="'+TIMESTAMP+'"><ons-card><div class="title"><ons-icon icon="fa-edit" style="align:center;padding:5px" onclick="myApp.services.tasks.loadFromHistory(\''+TIMESTAMP+'\')"></ons-icon>'+PRETTYTIMESTAMP+'<ons-icon icon="fa-backspace" style="align:center;padding:5px"  onclick="myApp.services.tasks.del(\''+TIMESTAMP+'\')"></ons-icon></div><div class="content" style="width: '+width+'px;">'+DATABLURB+'...</div></ons-card></ons-list-item>'
            cards.push(pre)
               })
    
    div = document.querySelector("#history_is_now")
    //for (var i = 0; i < cards.length; i++) {
     cards.forEach((e) => {
        div.innerHTML += e;
    })
}, //end of load from storage

setAPIKeyDialog: function() {
  var dialog = document.querySelector('#apikey_dialog');
  if (dialog) {
      //console.log('its a dialog')
    dialog.show();
  } else {
      //console.log('its not a dialog')
    ons.createElement('dialog.html', { append: true })
      .then(function(dialog) {
        dialog.show();
      });
  }
},

writeAPIKeyToStorage: function() {
    localStorage.APIKey = document.querySelector('#apikey_input').value;    console.log('Setting API Key');
myApp.services.tasks.hideAPIDialog();
},

hideAPIDialog: function() {
  document.getElementById("apikey_dialog").hide();       
}, //end of API key

setAdvancedDialog: function() {
    //get theese both done at same time
    //user doesnt need to muck these around
    //that often: maybe splain that
    //slider for top-p & temperature
    //entry for max_tokens


}, //end of advanced dialog
    
// which brings me to another idea: a help 'overlay' mode where oncea '?' in toolbar is touched, we use those little modal popup dialogs to communicate what different features are for.  could be fun, and also just another tool in belt for other apps.
            
}, //end of tasks

settings: {  
loadSettings: function() {
    
    document.querySelector("#selectedModel > div > div").innerHTML = localStorage.model
    var listItems = document.querySelectorAll('#settingsList ons-switch');
   for (var i = 0; i < listItems.length; i++) {
    //we merely need length but whatevs
    //name is:
    name = document.querySelectorAll('#settingsList ons-switch')[i].id
    //get localStorage
    pref = window.localStorage.getItem(name)    
    //set with:
    console.log('setting: '+name+' to '+pref)
    omfg = document.querySelector('#'+name)
    //turns out 'checked' isnt true/false,
    //its exist/nonexist. good to know.
    //ninety billion attempts later before
    //understanding that.
    if (pref.toString() == "false"){
        omfg.removeAttribute('checked') }
    if (pref.toString() == "true") {
        omfg.setAttribute('checked','true') }
    }
    var prefs = ['max_tokens','top_p','temperature']
    prefs.forEach((e) => {
        var cur = window.localStorage.getItem(e)
        document.querySelector("#"+e+"_input").value = parseInt(cur)
        })
    },
saveSettings: function() {
    //return 0;
    var listItems = document.querySelectorAll('#settingsList ons-list-item');
   for (var i = 0; i < listItems.length; i++) {
    //we merely need length but whatevs
    //name is:
    name = document.querySelectorAll('#settingsList ons-switch')[i].id
    value = document.querySelector('#'+name).checked
    window.localStorage.setItem(name, value.toString());
    console.log('saved: '+name+': '+value)
    }
    },
    
toggle: function(name) {
    value = document.querySelector('#'+name).checked  
window.localStorage.setItem(name, value.toString());
    console.log('saved: '+name+': '+value)
    
   },
   
setThemeAtStartup: function() {
       //opposite of swapTheme. more down there if you want to remember the joy. onsen never considered a text field bigger than a password, or the thought of being able to toggle light/dark overall theme, or the thought of persistent settings...this is all of that colliding
       if (window.localStorage.darkSwitch == "true") { document.querySelector("#maintheme").href="lib/onsen/css/dark-onsen-css-components.css"; console.log('Startup: if-dark: true');csettings="background-color: rgba(0,0,0,0);color: white;width: 100%;border-width: 0px;height: 100%;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;";document.getElementById('edit-top').style.cssText=csettings;document.getElementById('edit-bottom').style.cssText=csettings;

        } else if (window.localStorage.darkSwitch == "false"){ console.log('Startup: if-dark: false');csettings="background-color: rgba(0,0,0,0);color: #353535;width: 100%;border-width: 0px;height: 100%;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;";document.getElementById('edit-top').style.cssText=csettings;document.getElementById('edit-bottom').style.cssText=csettings;document.querySelector("#maintheme").href="lib/onsen/css/onsen-css-components.css" }
},
   
swapTheme: function() {
//we're renaming this 'swap Theme' because it inverts whatever is currently saved.  Therell have to be another separate function that can be called at startup. ... 
//another ridiculous bug that was eleventy hours to figure out - if called from the toggle switch, it will read what the toggle was set to BEFORE the toggle happened, not after, ie the pages needed to be reversed if I wanted it to _change_. the problem now is - if called at setup, it will ALWAYS set the opposite of whatever is set in the settings! theres no end to this.
        if (window.localStorage.darkSwitch == "false") { document.querySelector("#maintheme").href="lib/onsen/css/dark-onsen-css-components.css"; console.log('in if-dark: false');csettings="background-color: rgba(0,0,0,0);color: white;width: 100%;border-width: 0px;height: 100%;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;";document.getElementById('edit-top').style.cssText=csettings;document.getElementById('edit-bottom').style.cssText=csettings;

        } else if (window.localStorage.darkSwitch == "true"){ console.log('in if-dark: true');csettings="background-color: rgba(0,0,0,0);color: #353535;width: 100%;border-width: 0px;height: 100%;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;";document.getElementById('edit-top').style.cssText=csettings;document.getElementById('edit-bottom').style.cssText=csettings;document.querySelector("#maintheme").href="lib/onsen/css/onsen-css-components.css" }

function notGonnaUseThisForNowItsNotBeingCalled() { 
//this is an hack that appends a ?rnd=rando_num to every stylesheet in order to force the client to not load from cache. good for eliminating that as reason shits not changing.      
  var h, a, f;
  a = document.getElementsByTagName('link');
  for (h = 0; h < a.length; h++) {
    f = a[h];
    if (f.rel.toLowerCase().match(/stylesheet/) && f.href) {
      var g = f.href.replace(/(&|\?)rnd=\d+/, '');
      f.href = g + (g.match(/\?/) ? '&' : '?');
      f.href += 'rnd=' + (new Date().valueOf());
      console.log('renamed a .css file')
    }
  } // for
} // end code being skipped

  
}, // end of reloadTheme

setModel: function(model) {
    //get the selector of the menu heading
    //and write model there too?
    document.querySelector("#selectedModel > div > div").innerHTML = model
    window.localStorage.setItem("model",model)
    console.log("Settings: Model: set "+model)
},

//this was pretty slick, but its perma-themed white (as far as my attention span lasted anyway)
displayModelSelector: function() {
    
  ons.openActionSheet({
    maskColor: '#000000',
    title: 'Select Model:',
    cancelable: true,
    buttons: [
    'text-davinci-003',
      'code-davinci-002',
'code-cushman-001',
'text-davinci-002',
'text-curie-001',
'text-babbage-001',
'text-ada-001',
      {
        label: 'Cancel',
        icon: 'md-close'
      }
    ]
  }).then(function (index) { console.log('index: ', index) })
    }, //end of model selector
    
    
} //end of settings


}; //end of myApp.services obj