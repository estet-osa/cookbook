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
    },

    addComment : function(elem){

        var list = getId('commentsList'),
            txt  = getId('comments_description');

        var params = {
            url      : '/comment/add',
            formData : new FormData(document.forms.comments),
            method   : 'POST'
        };

        if(params.formData)
            // Send params & get json data
            $.ajax(params, function(entries){

                console.log(entries);

            });

        // Create comment block
        if(list && txt.value.length > 5){
            if(list.children.length > 0)
                list.insertBefore(rcp.createCoommentElem(txt), list.children[0]);
            else
                list.appendChild(rcp.createCoommentElem(txt));

            var cmtHeight = list.children[0].querySelector('.cover > div').clientHeight;
                list.children[0].querySelector('.cover').style.height = cmtHeight + 'px';

            // Clear form
            txt.value = '';
        }


        return false;
    },

    createCoommentElem : function(txt) {

        var LI          = create('LI'),
            COVER       = create('DIV'),
            WRAPPER     = create('DIV'),
            BAR         = create('DIV'),
            OWNER_LINK  = create('A'),
            CREATED     = create('DIV'),
            CREATED_TXT = create('SPAN'),
            COMMENT     = create('DIV'),
            OWNER       = create('DIV'),
            IMG_LINK    = create('A'),
            AVATAR      = create('IMG'),
            VOTE_LIST   = create('DIV'),
            VOTE_LIKE   = create('DIV'),
            LIKE_IMG    = create('IMG'),
            LIKE_COUNT  = create('DIV'),
            LIKE_TXT    = create('SPAN'),
            VOTE_DISLIKE    = create('DIV'),
            DISLIKE_IMG     = create('IMG'),
            DISLIKE_COUNT   = create('DIV'),
            DISLIKE_TXT     = create('SPAN'),
            COMMENT_TXT     = create('SPAN');

        COVER.className = 'cover';
        WRAPPER.className = 'comment_wrapper';
        BAR.className = 'comment_bar';
        OWNER_LINK.className = 'name';
        OWNER_LINK.setAttribute('target', '_blank');
        OWNER_LINK.innerHTML = 'Татьяна Зуброва';
        CREATED.className = 'created_at';
        CREATED_TXT.innerHTML = '25.12.18 в 14:12';
        COMMENT.className = 'comment';
        OWNER.className = 'owner';
        IMG_LINK.setAttribute('target', '_blank');
        AVATAR.src = '/img/';
        VOTE_LIST.className = 'comment_vote_list';
        VOTE_LIKE.className = 'like';
        VOTE_LIKE.setAttribute('onclick', "return Cmt.vote('11_2', 'like', this)");
        LIKE_IMG.src = '/img/comment_like.png';
        LIKE_COUNT.className = 'vote_count';
        VOTE_DISLIKE.className = 'dislike';
        VOTE_DISLIKE.setAttribute('onclick', "return Cmt.vote('11_2', 'dislike', this)");
        DISLIKE_IMG.src = '/img/comment_dislike.png';
        DISLIKE_COUNT.className = 'vote_count';
        COMMENT_TXT.className = 'txt';
        COMMENT_TXT.innerHTML = txt.value.trim();

        LI.appendChild(COVER);
        COVER.appendChild(WRAPPER);
        WRAPPER.appendChild(BAR);
        BAR.appendChild(OWNER_LINK);
        BAR.appendChild(CREATED);
        CREATED.appendChild(CREATED_TXT);
        WRAPPER.appendChild(COMMENT);
        COMMENT.appendChild(OWNER);
        OWNER.appendChild(IMG_LINK);
        IMG_LINK.appendChild(AVATAR);
        COMMENT.appendChild(VOTE_LIST);
        VOTE_LIST.appendChild(VOTE_LIKE);
        VOTE_LIKE.appendChild(LIKE_IMG);
        VOTE_LIKE.appendChild(LIKE_COUNT);
        LIKE_COUNT.appendChild(LIKE_TXT);
        VOTE_LIST.appendChild(VOTE_DISLIKE);
        VOTE_DISLIKE.appendChild(DISLIKE_IMG);
        VOTE_DISLIKE.appendChild(DISLIKE_COUNT);
        DISLIKE_COUNT.appendChild(DISLIKE_TXT);
        COMMENT.appendChild(COMMENT_TXT);

        return LI;
    },

    editorShow : function () {

        var editor  = getId('comment_editor'),
            area    = getId('comments_description');

        if(editor.style.display == 'none' || !editor.style.display){
            editor.style.display = 'block';
            area.focus();
        }else
            editor.style.display = 'none';


    }





};






























































