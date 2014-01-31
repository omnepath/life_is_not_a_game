// Application Script


// This is the basis of jQuery,
// it runs anything in this function as soon javascript is avaiable 
// (slightly before onload would)
$(document).ready(function(){

	// jQuery is super duper easy!
	//
	// When you press the button it creates a p element
	//
	// The variable count just hold the number of times the button was pressed. 
	//
	// Append can take eithe raw HTML or a jQuery object and it just appends it to the end of an existing object
	var count = 0;
	$(".makeStuff").click(function(){
		$(".container").append("<p>N" + ++count + "ck, I just appended all this nonsense!</p>");
	});

	// When a p element is clicked on inside of the container (the white square) it changes the text
	// and runs an animation. 
	//
	// Animations use a special jQuery animation queue and text doesn't use that queue so I also used a setTimeOut
	//
	// The ".on" is used when you need to interact with elements that haven't been created yet 
	// (like all those p elements the button generates)
	//
	// You can store jQuery objects in variables. $(this) refers to the object the function is running from,
	// in this case it's the specific p element that was clicked on.
	//
	// The event in the function is filled with information about the "click" event like mouse position, etc
	$(".container").on("click","p", function(event){
		
		var animateMe = $(this);
		animateMe.text("Ben, I just clicked this... so...").delay(500).animate({marginLeft:-300, fontSize:"33px", opacity:0}, 600 ,function(){ $(this).remove() });
		
		window.setTimeout(function () {
    		animateMe.text("AAAAAAAHHHHHHHHHHHHH!");
		}, 480);
	});
	
	// This is the most useful function.
	console.log("I am awesome");

	// Can display Text
	console.log("Writes things to the development console for debugging.");
	
	// objects
	console.log($("body"));

	// and variables
	var text = ["soup","pepper","oligarch"];
	console.log(text);

});

// This is stuff that is run after the page loads
