/***********************************************************************

 * App Controllers. These controllers will be called on page initialization. *
 ***********************************************************************/

//this page is essentially where theyre collecting all their bindings: push on this area get this response.
//i mean, you /could/ just put it right on the item itself in an onClick, but then that would be super READABLE

myApp.controllers = {
    
    twopanePage: function(page) {
         
        //listen for click on settings button
        page.querySelector('#settings_button').onclick = function(){ document.querySelector('#myNavigator').pushPage('settings.html');
        };
        // click on save button
        page.querySelector('#savetostorage_button').onclick = myApp.services.tasks.saveToStorage;
  
        // click on history button
        page.querySelector('#history_button').onclick = function(){ document.querySelector('#myNavigator').pushPage('history.html');
        };
        //alt-enter sends to davinci
document.addEventListener('keydown', (event) => {
  if (event.altKey && event.keyCode === 13) {
      //alert('got ALT ENTER')
    myApp.services.tasks.getSug();
  }
});
// toolbar button that appends suggestion to prompt area.
page.querySelector('#copyUp_button').onclick = function() {
    text = document.getElementById('edit-bottom').value;
    textabove = document.getElementById('edit-top');
    textabove.value += text;
    }
}, ///end of twopanePage.
    
    
    settingsPage: function(page) {
        myApp.services.settings.loadSettings();
        //I tried so many fucking things before learning that ons-switch 'checked' attribute is not true/false, but there/not-there. If you set this attribute to "false", that = 'exists", and therefore returns true. Sigh. Im leaving it because whatever it works and the settings view remains nice and clean (thats the whole point of the model, right??)
            var listItems = document.querySelectorAll('#settingsList ons-switch');
   for (var i = 0; i < listItems.length; i++) {
    document.querySelectorAll('#settingsList ons-switch')[i].addEventListener("click",function(e){ myApp.services.settings.saveSettings(); } ) }
    
       
 
      }, //end of settings page 

historyPage: function(page) {
    myApp.services.tasks.loadFromStorage();
    }    


} //end of whole shebang.