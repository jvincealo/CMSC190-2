$(function() {
  $("a.loader").on("click",function(e) {
    e.preventDefault(); // cancel the link itself
    // console.log($(this).attr('id'));
    $("<form action='/new' method='post'><input type='hidden' name='data[code]' value="+$(this).attr('id')+" /></form>").submit();
    });
});