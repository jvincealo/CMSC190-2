(function($){
  $(function(){

    $('.button-collapse').sideNav();
    $('.parallax').parallax();

  }); // end of document ready
})(jQuery); // end of jQuery name space

$(document).ready(function(){
		$('#search-bar-div').hide();
    $('.modal-trigger').leanModal();
	
		$('#search-bar').on('keyup',function(e){ //deletes selected subject
			var temp = document.getElementById('search-bar').value.trim();
			if(e.keyCode == 13 && temp != "" ) searchCourse(document.getElementById('search-bar').value.trim());
		});
	
		$('#search-bar2').on('keyup',function(e){ //deletes selected subject
			var temp = document.getElementById('search-bar2').value.trim();
			if(e.keyCode == 13 && temp != "" ) searchCourse(document.getElementById('search-bar2').value.trim());
		});
	
		$('#comment-area').on('keyup',function(e){ //deletes selected subject
			var temp = document.getElementById('comment-area').value.trim();
			if(e.keyCode == 13 && temp != "" ) addComent(document.getElementById('comment-area').value.trim());
		});
	
		$('#view-comments-textarea').on('keyup',function(e){ //deletes selected subject
			var temp = document.getElementById('view-comments-textarea').value.trim();
			if(e.keyCode == 13 && temp != "" ) addComent(document.getElementById('view-comments-textarea').value.trim());
		});
	
		$('#edit-tab-department').on('keyup',function(e){ //deletes selected subject
			var temp = document.getElementById('edit-tab-department').value.trim();
			if(e.keyCode == 13 && temp != "" ) editCurriculumInfo(document.getElementById('edit-tab-department').value.trim());
		});
	
		$('#edit-tab-department').on('keyup',function(e){ //deletes selected subject
			var temp = document.getElementById('edit-tab-department').value.trim();
			if(e.keyCode == 13 && temp != "" ) editCurriculumInfo(document.getElementById('edit-tab-department').value.trim());
		});
});

function switchModal(){
	$('#modal-feedback').closeModal();
	$('#modal-login').openModal();
}

function showSearch(){
		$('#search-toggle').hide();
		$('#search-bar-div').show();
		$("#search-bar").focus();	
}

function hideSearch(){
		$('#search-toggle').show();
		$('#search-bar-div').hide();
}

function searchCourse(query){
		alert("Searched for: '"+query+"'");
}

function addComent(comment){
		alert("Commenting: '"+comment+"'");
}

function editCurriculumInfo(info){
		alert("New value: "+info);
}