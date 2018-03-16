function deleteBuilding(id){
    $.ajax({
        url: '/building/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};