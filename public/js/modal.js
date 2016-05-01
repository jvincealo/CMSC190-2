$(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
		$('#search-bar-div').hide();
    $('.modal-trigger').leanModal();
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