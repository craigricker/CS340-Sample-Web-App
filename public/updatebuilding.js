function updateBuilding(id){
    $.ajax({
        url: '/building/' + id,
        type: 'PUT',
        data: $('#update-building').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};