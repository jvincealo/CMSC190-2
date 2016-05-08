var upload_departments = document.getElementById('upload_dept');
upload_departments.addEventListener('change', importDepartments, false);

$(function(){
    $("#upload_dept_link").on('click', function(e){
        e.preventDefault();
        $("#upload_dept:hidden").trigger('click');
    });
});

function fileSelect(evt) {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }

    var files = document.getElementById('upload').files;
    var file = files[0];

    var reader = new FileReader();

    reader.onloadend = function(evt) {
      if (evt.target.readyState == FileReader.DONE) { // DONE == 2
        var data = evt.target.result;
        var lines = data.split('\n');
        var tokens;

        for(var line = 0; line < lines.length ; line++) {
            tokens = lines[line].split(',');
            for(var token = 0; token < tokens.length; token++) {

            }
        }
      }
    };
    reader.readAsText(file);
}

function importCourses() {

}
