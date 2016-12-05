var rcp = {

    switchJornalTab : function (elem, currTab){

        var tabs    = getId('jornal_view_tabs'),
            views   = getId('jornal_views');

        // Return tabs & views to default display none
        for(var i = 0; i < tabs.children.length; i++){
            tabs.children[i].className = '';
            views.children[i].style.display = 'none';
        }


        // Set the current active tab
        elem.className = 'active';
        views.querySelector('#jornal_views > .' + currTab).style.display = 'block';


        console.log('currTab: ',  views.querySelector(currTab));

    },

    find : function(){

        var recipes = JSON.parse(localStorage.getItem("recipes")),
            list    = getId('recipe_list'),
            values  = recipes.ids;

        var params = {
            url : '/recipes/find',
            data : JSON.stringify({searchStr : values}),
            method : 'POST'
        };

        if(values)

            // Send params & get json data
            $.ajax(params, function(entries){



                if(typeof entries == 'string' && entries != 'not_found'){

                    var json = srch.isJson(entries);

                    if(json){
                        var list = getId('recipe_list');
                        list.innerHTML = '';

                        for(var key in json)
                            if(json[key].description != undefined)
                                list.appendChild(srch.createSearchingElement(json[key]));

                        // Set active found recipes if exists in localStorage vars
                        task.switchActiveInRecipeList(list, recipes.ids);
                    }
                }
            });
    }





};






























































