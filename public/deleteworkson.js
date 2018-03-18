function deleteWorkson(id){
    console.log("In public script");
    console.log(id);
    $.ajax({
        url: '/workson/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};