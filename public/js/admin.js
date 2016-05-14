var upload_dept = document.getElementById('upload_dept');
upload_dept.addEventListener('change', importDept, false);

$(function() {
  $("a.loader").on("click",function(e) {
    e.preventDefault(); // cancel the link itself
    // console.log($(this).attr('id'));
    $("<form action='/new' method='post'><input type='hidden' name='data[code]' value="+$(this).attr('id')+" /></form>").submit();
    });
});

$(document).ready(function() {
    $("#courseSubmit").click(function(e) {
        e.preventDefault();
        var course = {
            department : document.getElementById("dept_opts").value,
            code : document.getElementById("courseCode").value,
            title : document.getElementById("courseTitle").value,
            prerequsite : document.getElementById("coursePrerequisite"),
            units : document.getElementById("units"),
            corequisite : document.getElementById("courseCorequisite"),
            concurrent : document.getElementById("courseConcurrent"),
            conprereq : document.getElementById("courseConPrereq"),
       };

       alert(course);
    });
});

function populateSubjects(id) {
    var dept = document.getElementById(id);
    var contents = "";

    $.get("/courses/department/"+id,
        function(data) {
            contents += '<ul>';

                for(var key in data) {
                    contents += '<li class="row"><a class="modal-trigger valign-wrapper col s6 m6 l8 offset-s1 offset-m1 offset-l1" href="#modal-edit-course">'+ data[key].title +'</a>';
                    contents += '<a class="col s5 m4 l2 offset-m1 offset-l1 black-text">Delete</a>';
                    contents += '</li>';
                }

            contents += '</ul>';
            dept.innerHTML = contents;
            $('.modal-trigger').leanModal();
        }
    );
}

function populateDepartments() {
    var ul = document.getElementById("departments");
    var opts = document.getElementById("dept_opts")

    var contents = "";
    $.get("/departments/list",
        function(data) {
            for(var key in data) {
                contents += '<div class="collapsible-header department-link" onclick="populateSubjects(\''+data[key].code+'\')">'+ data[key].name +'</div>';
                contents += '<div class="collapsible-body" data-collapsed="true" id="'+data[key].code+'"></div>';

                var list = document.createElement("li");
                list.innerHTML = contents;
                ul.appendChild(list);

                var opt = document.createElement('option');
                opt.value = data[key]._id;
                opt.innerHTML = data[key].name;
                opts.appendChild(opt);

                contents = "";
            }
            $('select').material_select();
        }
    );
}

window.onload = populateDepartments();

function importDept(evt) {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }

    var files = document.getElementById('upload_dept').files;
    var file = files[0];

    var reader = new FileReader();

    reader.onloadend = function(evt) {
      if (evt.target.readyState == FileReader.DONE) {
        var data = evt.target.result;
        var lines = data.split('\n');
        var tokens,
            department;

        for(var line = 0; line < lines.length ; line++) {
            tokens = lines[line].split(',');
            for(var token = 0; token < tokens.length; token+=3) {
                //check if the line is a comment
                if(tokens[token][0] === "#")
                    break;

                department = {
                    code : tokens[token],
                    college : tokens[token+1],
                    name: tokens[token+2]
                };

                $.post("/departments",
                    department,
                    function(data, status){
                    }
                );
            }
        }
      }
    };
    reader.readAsText(file);
}