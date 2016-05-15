function populateDepartments() {
    var opts = document.getElementById("dept_opts");

    var contents = "";
    $.get("/departments/list",
        function(data) {
            // alert(JSON.stringify(data))
            for(var key in data) {
                var opt = document.createElement('option');
                opt.value = data[key].code;
                opt.innerHTML = data[key].name;
                opts.appendChild(opt);
            }
            $('select').material_select();
        }
    );

}

window.onload = populateDepartments();

function populateSubjects() {
    var dept = document.getElementById("dept_opts").value;
    var subjs = document.getElementById("add-subject-drop");
    var contents = "";

    var i;
    for(i=subjs.options.length-1;i>=0;i--)
    {
        subjs.remove(i);
    }

    $.get("/courses/department/"+dept,
         function(data) {
            for(var key in data) {

                var opt = document.createElement('option');
                opt.value = data[key].code;
                opt.innerHTML = data[key].code;
                subjs.appendChild(opt);
            }
            $('select').material_select();
        }
    );
}

function saveToAccount() {
    var dept_opts = document.getElementById("dept_opts");
    var department = dept_opts.options[dept_opts.selectedIndex].value;

    if(department === "") {
        Materialize.toast('Please choose department', 4000);
        return;
    }

    var entry = {
        _id : loaded_curriculum._id,
        author : user_id,
        csv : exportCSV(),
        code : document.getElementById("edit-tab-curriculum-code").value,
        title : document.getElementById("edit-tab-degree").value,
        department : department
    };

    $.post("/curriculum",
        entry,
        function(data, status){
            console.log("curriculum saved");
        }
    );

    Materialize.toast('Curriculum successfully saved!', 4000);
}

function generateImage() {
        var targetCanvas = document.createElement("canvas");
        svg_xml = (new XMLSerializer()).serializeToString(paper.svg);
        var ctx = targetCanvas.getContext('2d');

        // this is just a JavaScript (HTML) image
        var img = new Image();
        // http://en.wikipedia.org/wiki/SVG#Native_support
        // https://developer.mozilla.org/en/DOM/window.btoa
        img.src = "data:image/svg+xml;base64," + btoa(svg_xml);

        img.onload = function() {
            // after this, Canvas’ origin-clean is DIRTY
            ctx.drawImage(img, 0, 0);
        }

        var link = document.createElement('a');
        link.href = 'img';
        link.download = 'Download.jpg';
        document.body.appendChild(link);
        link.click();
}
var convert = (function () {
    function convert(stack) {
        var temp, str = '';

        if(stack.length != 0) {
            temp = stack.pop();

            if(temp == "AND" || temp == "OR") {
                str += "(";
                str += convert(stack, str)
                str += ' ' + temp + ' ';
                str += convert(stack, str)
                str += ")";
            } else {
                str += temp;
            }
        }
        return str;
    }
    return convert;
})();

var contains = function(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                var item = this[i];

                if((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle) > -1;
};