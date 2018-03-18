function deleteComputer(id){
    console.log("In delte computer ajax stuff, id is: " + id);
    $.ajax({
        url: '/computer/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};