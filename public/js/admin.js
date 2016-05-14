var selected_subject;

var upload_dept = document.getElementById('upload_dept');
upload_dept.addEventListener('change', importDept, false);

$(function() {
  $("a.loader").on("click",function(e) {
    e.preventDefault(); // cancel the link itself
    $("<form action='/new' method='post'><input type='hidden' name='data[code]' value="+$(this).attr('id')+" /></form>").submit();
    });
});

$(function() {
  $("#edit-submit").on("click",function(e) {
    e.preventDefault(); // cancel the link itself
        var course = {
            department : document.getElementById("dept_opts_edit").value,
            code : document.getElementById("edit-courseCode").value,
            title : document.getElementById("edit-courseTitle").value,
            prerequisite : document.getElementById("edit-prerequisites").value,
            units : document.getElementById("edit-units").value,
            term : document.getElementById("edit-term").value
       };

       $.ajax({
            url: '/courses/' + selected_subject,
            type: 'PUT',
            data : course,
            success: function(result) {
                Materialize.toast("Course successfully updated!", 4000)
            }
        });
    });
});

function deleteSubject(id) {
    $.ajax({
        url: '/courses/' + id,
        type: 'DELETE',
        success: function(result) {
            Materialize.toast("Course successfully deleted!", 4000)
        }
    });
}

function editModal(code) {
    $.get("/courses/find/"+code,
        function(data) {
            document.getElementById('dept_opts_edit').value = "\"" + data[0].department + "\"";
            document.getElementById('edit-courseCode').value = data[0].code;
            document.getElementById('edit-courseTitle').value = data[0].title
            document.getElementById('edit-prerequisites').value = data[0].prerequisite;
            document.getElementById('edit-units').value = data[0].units;
            document.getElementById('edit-term').value = data[0].term;

            selected_subject = data[0]._id;

            Materialize.updateTextFields();
        }
    );
}

$(document).ready(function() {
    $("#courseSubmit").click(function(e) {
        e.preventDefault();
        var course = {
            department : document.getElementById("dept_opts").value,
            code : document.getElementById("courseCode").value,
            title : document.getElementById("courseTitle").value,
            prerequisite : document.getElementById("prereq").value,
            corequisite : document.getElementById("coreq").value,
            units : document.getElementById("units").value,
            term : document.getElementById("term").value
       };

       $.ajax({
            url: '/courses',
            type: 'POST',
            data : course,
            success: function(result) {
                Materialize.toast("Course successfully created!", 4000)
            }
        });
    });
});

function populateSubjects(id) {
    var dept = document.getElementById(id);
    var contents = "";

    $.get("/courses/department/"+id,
        function(data) {
            contents += '<ul>';

                for(var key in data) {
                    contents += '<li class="row"><a class="course modal-trigger valign-wrapper col s6 m6 l8 offset-s1 offset-m1 offset-l1" href="#modal-edit-course" onclick="editModal(\''+data[key].code+'\');">'+ data[key].title +'</a>';
                    contents += '<a href="#" class="delete col s5 m4 l2 offset-m1 offset-l1 black-text" data-id=\''+data[key]._id+'\'>Delete</a>';
                    contents += '</li>';
                }

            contents += '</ul>';
            dept.innerHTML = contents;
            $('.modal-trigger').leanModal();

              $("a.delete").on("click",function(e) {
                e.preventDefault(); // cancel the link itself'))

                var answer = confirm("Are you sure?")
                if(answer)
                    deleteSubject($(this).attr('data-id'))
            });
        }
    );
}

function populateDepartments() {
    var ul = document.getElementById("departments");
    var opts = document.getElementById("dept_opts")
    var edit = document.getElementById("dept_opts_edit")

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
                opt.value = data[key].code;
                opt.innerHTML = data[key].name;
                opts.appendChild(opt);

                var opt2 = document.createElement('option');
                opt2.value = data[key].code;
                opt2.innerHTML = data[key].name;
                edit.appendChild(opt2);

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
