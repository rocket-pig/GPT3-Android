debugs('index.js:  js begin')


document.addEventListener('init', function(event) {
  console.log('This is a lifecycle event!', event.target);

  var page = event.target;
  if (page.matches('#index')) {
    page.querySelector('ons-toolbar .center').innerHTML = 'My app';
    
  }
});


debugs('made it past that trainwreck')


//writes to bottom text box
function setText(text, placeholder = false ) {
    textarea = document.getElementById('edit-bottom');
    if (placeholder == true) {
        textarea.placeholder = text } 
    else {
        textarea.value = text; 	
    }		
};

// toolbar button that appends suggestion to prompt area.
function copyUp() {
text = document.getElementById('edit-bottom').value;
textabove = document.getElementById('edit-top');
textabove.value += text;
}

debugs('index.js:  0')
  


debugs('index.js: 0.5')



//this is where doc.addEventListener was in case everything goes to shit again having it at the top


//set the frequent action button to send.
document.querySelector('ons-fab').addEventListener('click', getSug);


debugs('index.js:  1', true)

//
//alt-enter sends to davinci
document.addEventListener('keydown', (event) => {
  if (event.altKey && event.keyCode === 13) {
      //alert('got ALT ENTER')
    getSug();
  }
});


debugs('index.js:  2', true)

//Calling suggestions API
//values got defaulted, no settings api yet
 function getSug() {
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
 				'Authorization': 'Bearer ' + "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"
 			},
 			body: JSON.stringify({
 				"prompt": prompt,
 				'echo': false,
 				'model': 'text-davinci-002',
 				'temperature': 0,
 				'max_tokens': 3000,
 				'top_p': 1
 			})
 		})
 		.then(response => response.json())
 		.then(data => parseRet(data))
 		.catch(error => setText("Error: " + error));
 	function parseRet(data) {
 		try {
 			result = data.choices[0].text
 			result = result.trim() + "\n"
 			setText(result)
 		} catch {
 			setText("Server Error: " + data.error.message)
 		}; 
 	};
};
done;
    setText('Suggestions arrive here! Use the copy button in the toolbar if you want to append them to the prompt.', true );
//debugs('step before the curse of done')
//done;
debugs('index.js: 99')
  

//done; //update, even more hilariously is that it just errors out in the console anyway.  //this is for onsen (?) its unclear why. something about its lifecycle and my use of async. remember we spent hours where no js would run..not even sure why it began to work partly..anyway if you want to re-read its inside the interactive 'playground' app > Creating a Page > Doc > Page 3.
debugs('index.js: end of if clause?')




