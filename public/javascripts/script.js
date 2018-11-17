function closePane(){
	var pane = document.getElementById('message');
	pane.style.display = 'none';
}
var reg =false;
function hideFullDetails(target){
	var name = 'but'+target;
	console.log('name is '+name);
	var plate = document.getElementById(target);
	var but = document.getElementById(name);
	if(reg==false){
		plate.style.display = 'block';
		but.innerHTML = 'Less'
		reg = true;
	}else{
		plate.style.display = 'none';
		but.innerHTML = 'More'
		reg = false;
	}
}
function hideMessage(){
	setTimeout(function(){
		var message = document.getElementById('message');
		message.style.display = 'none';
	},4000)
}