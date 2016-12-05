"use strict";

var d = document, w = window;

w.onload = function () {

    if(getId('ingredientList'))
        if(getId('ingredientList').children.length <= 0)
            getId('recipe_ingredient').previousElementSibling.style.display = 'none';

    // Change view recipes list if exist ul#recipes_list
    task.changeView();

    // View jornal list & show jornal links
    task.jornalView();

    if(getId('formingIngredients'))
        task.showFormingIngredients();

    // If current page jornal
    if(location.pathname == '/jornal')
        rcp.find();

};

function getId(id){
    return document.getElementById(id)
}

function create(elem){
    return document.createElement(elem)
}

var task = {

    showFormingIngredients : function() {

        var recipes = JSON.parse(localStorage.getItem("recipes")),
            list    = getId('formingIngredients');

        if(recipes && recipes.ids.length > 0){

            // Hide notification form empty jornal list
            getId('ingr_head').style.display = 'none';
            getId('ingredients_block').style.display = 'block';

            var params = {
                url : '/ingredients/jornal',
                data : JSON.stringify(recipes),
                method : 'post'
            };

            if(list){

                // Send params & get json data
                $.ajax(params, function(entries){

                    var json = JSON.parse(entries);

                    if(json){

                        // Cliar old list
                        list.innerHTML = '';

                        for(var key in json){

                            if(json[key].title && json[key].cnt)
                                list.appendChild(task.createJornalElements(json[key]));
                        }
                    }
                });
            }

        }else{

            // Show notification form empty jornal list
            getId('ingr_head').style.display = 'block';
            getId('ingredients_block').style.display = 'none';
        }
    },

    createJornalElements : function(key){

        var LI      = create('LI'),
            INNER   = create('DIV'),
            TXT     = create('SPAN'),
            COUNT   = create('SPAN');

        INNER.className = 'inner';
          TXT.className = 'txt';
          TXT.innerHTML = key.title;
          COUNT.className = 'count';
          COUNT.innerHTML = key.cnt + ' шт.';

        LI.appendChild(INNER);
          INNER.appendChild(TXT);
          INNER.appendChild(COUNT);

        return LI
    },

    jornalView : function(){

        var recipes = JSON.parse(localStorage.getItem("recipes")),
            list    = getId('recipe_list'),
            elem    = getId('jornalCnt');

        if(recipes){

            var recipesCount = recipes.ids.length;

            if(recipesCount > 0){

                elem.style.display = 'block';
                elem.innerHTML = recipesCount;
            }else{

                elem.style.display = 'none';
                elem.innerHTML = '';
            }

            // Set active & not active jornal tools in Recipe list
            if(list)
                task.switchActiveInRecipeList(list, recipes.ids);
        }
    },

    switchActiveInRecipeList : function(list, recipesArr){

        var currRecipeId = false;

        for(var i = 0; i < list.children.length; i++){

            currRecipeId = list.children[i].id.substr(6);

            if(task.findValFromArr(recipesArr, currRecipeId) != -1){

                // Set active to current list item
                var activeWrapper = list.children[i].querySelector('.task_btns_wrapper').children[1];
                    activeWrapper.className = 'task_response-active';
                    activeWrapper.children[0].className = 'cover-active';
                    activeWrapper.children[0].style.width = '11px';

                list.children[i].querySelector('.task_jornal_txt').innerHTML = 'Убрать из журнала';
            }
        }
    },

    /**
     * Find value in array
     *
     * @param array
     * @param value
     * @returns {*}
     */
    findValFromArr : function(array, value) {

        if(array.indexOf) return array.indexOf(value);

        for(var i = 0; i < array.length; i++)
            if (array[i] === value) return i;

        return -1;
    },

    checkEditableForm : function(list) {

        for(var i = 0; i < list.children.length; i++)
            if(list.children[i].className == 'editable')
                return false;
    },

    newIngredient : function() {

        var list = getId('ingredientList');

        if (!list.children[0]) {
            var elem = task.createIngredientForm();
            list.appendChild(elem[0]);
            list.children[0].className = 'editable';
            task.newIngredient()
        }

        var firstChildInpt  = list.children[0].querySelector('input');
        var parentCover     = firstChildInpt.parentNode.parentNode;

        if(firstChildInpt && parentCover){

            if(firstChildInpt && firstChildInpt.value != '' && (false !== task.checkEditableForm(list))) {

                    elem = task.createIngredientForm();

                    if(list.children.length > 0)
                        list.insertBefore(elem[0], list.children[0]);

                    elem[0].className = 'editable';

                // Set focus
                elem[1].focus();

            }else{

                parentCover.className = 'cover';
                parentCover.style.background = '#FF9466';

                setTimeout(function() {

                    parentCover.className = 'cover-active';
                    parentCover.style.background = 'transparent';
                    firstChildInpt.focus();
                }, 5);
            }
        }

        return false;
    },

    saveIngredient : function(event) {

        var list = getId('ingredientList');

        if(event.keyCode == 13){

            var currLi      = event.target.parentNode.parentNode.parentNode,
                parentCover = currLi.children[0];

                parentCover.className = 'cover';
                parentCover.style.background = '#FFD633';

                setTimeout(function() {

                    parentCover.className = 'cover-active';
                    parentCover.style.background = 'transparent';
                    currLi.className = '';
                    event.target.blur();

                }, 5);

            // Forming the param
            var params = {
                url : '/ingredient/add',
                data : event.target.value.trim(),
                method : 'post'
            };

            // Send params & get json data
            $.ajax(params, function(entry){

                console.log('del: ', entry);
            });

            return false;
        }
    },

    createIngredientForm : function() {

        var LI      = create('LI'),
            COVER   = create('DIV'),
            IN_DIV  = create('DIV'),
            INPT    = create('INPUT');

            COVER.className = 'cover';
            INPT.type = 'text';
            INPT.setAttribute('onkeydown', 'return task.saveIngredient(event)');

            LI.appendChild(COVER);
              COVER.appendChild(IN_DIV);
                IN_DIV.appendChild(INPT);

        return [LI, INPT];
    },

    /**
     * Change recipes view
     *
     * @param elem
     * @param curr
     */
    view : function(elem, curr){

        //Initiate vars
        var tabs  = getId('tab_view_list'),
            tasks = getId('recipe_list');

        //Assign the class
        tasks.className = curr;

        //will disable
        for(var i = 0; i < tabs.children.length; i++)
            tabs.children[i].className = '';

        //will enable
        elem.className = 'active';

        localStorage.setItem('view', curr);
    },

    /**
     * Change view recipes list
     */
    changeView : function() {

        var list    = getId('recipe_list'),
            tabList = getId('tab_view_list'),
            viewKey = localStorage.getItem('view');

        if(list){

            // Clear class for li
            for(var i = 0; i < tabList.children.length; i++)
                tabList.children[i].className = '';

            // Set 'active' class for current tab
            if(viewKey == 'task_default')
                tabList.children[0].className = 'active';
            else
                tabList.children[1].className = 'active';

            // Set current view class for ul#recipe_list
            if(viewKey)
                list.className = viewKey;
            else
                list.className = 'task_list';
        }
    },

    /**
     * Remove current recipe, set the is_active to false
     *
     * @param elem
     * @return void
     */
    remove : function (elem){

        //Initiate list
        var list = getId('recipe_list'),
            curr = elem.parentNode.parentNode.parentNode.parentNode.parentNode;

        //Collapse recipe
        collapseTask(curr, elem.previousElementSibling);

        //Rotate close img
        elem.style.WebkitTransform  = 'rotate(180deg)';
        elem.style.MozTransform     = 'rotate(180deg)';
        elem.style.OTransform       = 'rotate(180deg)';
        elem.style.MsTransform      = 'rotate(180deg)';
        elem.style.transform        = 'rotate(180deg)';

        // Send the ajax for set the is_active to false
        var params = {
            url : '/recipe/del' + curr.id.substr(6),
            method : 'post'
        };

        // Send params & get json data
        $.ajax(params, function(entry){

            console.log('del: ', entry);
        });
    },

    /**
     * Show task help window
     * @param elem
     */
    hlp_show : function(elem){

        var currElem = elem.previousElementSibling;
            currElem.style.opacity = '1';
            currElem.style.visibility = 'visible';
    },

    /**
     * Hide task help window
     * @param elem
     */
    hlp_hide : function(elem){

        var currElem = elem.previousElementSibling;
            currElem.style.opacity = '0';
            currElem.style.visibility = 'hidden';
    },

    /**
     * Show jornal helper
     * @param elem
     */
    hlp_jornal : function(elem){

        var currElem = elem.previousElementSibling;
            currElem.style.opacity = '1';
            currElem.style.visibility = 'visible';
    },

    /**
     * Hide jornal helper
     * @param elem
     */
    hlp_hideJornal : function(elem){

        var currElem = elem.previousElementSibling;
            currElem.style.opacity = '0';
            currElem.style.visibility = 'hidden';
    },

    /**
     * Add new recipe in JORNAL
     * @param elem
     */
    addJornal : function(elem){

        var currLi = elem.parentNode.parentNode.parentNode.parentNode.parentNode,
            currId = currLi.id.substr(6),
            recipes = JSON.parse(localStorage.getItem("recipes"));

        //Add task
        if(elem.className == 'task_response'){
            elem.className = 'task_response-active';
            elem.children[0].className = 'cover-active';
            elem.children[0].style.width = '11px';

            elem.parentNode.children[0].children[0].innerHTML = 'Убрать из журнала';

            if(recipes){

                // If current recipe id exists in localStorage
                if(!(recipes.ids.indexOf(currId) != -1)){

                    recipes.ids.push(currId);

                    var ids = JSON.stringify({ 'ids' : recipes.ids });
                    localStorage.setItem("recipes", ids);

                    task.jornalView();
                }

            }else{

                ids = JSON.stringify({ 'ids' : [currId] });
                localStorage.setItem("recipes", ids);
                task.jornalView();
            }

            //Delete task
        }else{

            elem.className = 'task_response';
            elem.children[0].style.width = '0px';

            elem.parentNode.children[0].children[0].innerHTML = 'Добавить в журнал';

            if(recipes){

                if((recipes.ids.indexOf(currId) != -1)){

                    var idxOfarray = recipes.ids.indexOf(currId);

                    recipes.ids.remove(currId);

                    ids = JSON.stringify({ 'ids' : recipes.ids });
                    localStorage.setItem("recipes", ids);

                    task.jornalView();
                }
            }
        }
    },

    /**
     * Convert timestamp string
     *
     * @param timestamp
     * @returns {string}
     */
    currDate : function(timestamp) {

        var dateStr = new Date(timestamp);

        var day = dateStr.getDate(),
            month = (dateStr.getUTCMonth() + 1),
            year = dateStr.getFullYear(),
            hours = (dateStr.getHours() < 10) ? "0" + dateStr.getHours() : dateStr.getHours(),
            minutes = (dateStr.getMinutes() < 10) ? "0" + dateStr.getMinutes() : dateStr.getMinutes();

        return day + '.' + month + '.' + String(year).substr(2) + ' в ' + hours + ':' + minutes;
    }
};

/**
 * Extension for deleting value from Array elements
 *
 * @param value
 * @returns {*}
 */
Array.prototype.remove = function(value){

    var idx = this.indexOf(value);
    if (idx != -1)
        return this.splice(idx, 1);

    return false;
};

var $ = {

    ajax : function(params, handler){

        var xhr     = (typeof(XMLHttpRequest) == 'undefined') ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest(),
            request = 'data='+ params.data,
            method  = (params.method) ? params.method : 'get';

        if(params.url){

            xhr.open(method, params.url, true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send(request);

            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4){

                    if(handler)
                        handler(xhr.responseText.trim());
                    else
                        return xhr.responseText.trim();
                }
            }
        }
    }
};

var srch = {

    find : function (elem) {

        var recipes = JSON.parse(localStorage.getItem("recipes")),
            list    = getId('recipe_list'),
            val = elem.value.trim();

        var params = {
            url : '/recipe/find',
            data : JSON.stringify({searchStr : val}),
            method : 'post'
        };

        if(val.length > 0)
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

    createSearchingElement : function (obj) {

        var LI              = create('LI'),
            TASK            = create('DIV'),
            INNER           = create('DIV'),
            TSK_IMG_WRP     = create('DIV'),
            TSK_IMG_LINK    = create('a'),
            TSK_IMG         = create('IMG'),
            NAV_WRAPPER     = create('DIV'),
            TSK_REMOVE      = create('DIV'),
            RMV_HELPER      = create('DIV'),
            RMV_TRIANGLE    = create('DIV'),
            RMV_TXT         = create('DIV'),
            RMV_IMG         = create('IMG'),
            LINK_MORE       = create('A'),
            DESCRIPTION     = create('P'),
            INFO_WRP        = create('DIV'),
            INFO_INNER      = create('DIV'),
            CREATED         = create('A'),
            TODAY           = create('ABBR'),
            POINT           = create('SPAN'),
            EDIT_LINK       = create('A'),
            BTNS_WRP        = create('DIV'),
            JORNAL_HLP      = create('DIV'),
            JORNAL_TEXT     = create('DIV'),
            JORNAL_TRIANGLE = create('DIV'),
            RESPONSE_ACTIVE = create('DIV'),
            COVER           = create('DIV'),
            COVER_IMG       = create('IMG');

        LI.id = 'recipe' + obj.id;
        TASK.className = 'task';
          INNER.className = 'inner';
            TSK_IMG_WRP.className = 'tsk_img';
              TSK_IMG_LINK.href = '/show/' + obj.id;
              TSK_IMG.src = '/uploads/' + obj.brochure;
            NAV_WRAPPER.className = 'nav_wrapper';
              TSK_REMOVE.className = 'task_remove';
                RMV_HELPER.className = 'rmv_helper_cont';
                  RMV_TXT.className = 'task_rmv_txt';
                  RMV_TXT.innerHTML = 'удалить';
                  RMV_TRIANGLE.className = 'hlp_triangle';
              RMV_IMG.src = '/img/close.gif';
              RMV_IMG.setAttribute('onmouseover', 'task.hlp_show(this)');
              RMV_IMG.setAttribute('onmouseout', 'task.hlp_hide(this)');
              RMV_IMG.setAttribute('onclick', 'task.remove(this)');
            LINK_MORE.className  = 'task_link';
            LINK_MORE.innerHTML  = obj.title;
            LINK_MORE.href = '/show/' + obj.id;
          DESCRIPTION.className = 'task_description';
          DESCRIPTION.innerHTML = obj.description.replace(/(<([^>]+)>)/ig,"").substr(0, 200);
          INFO_WRP.className = 'task_info_wrapper';
            INFO_INNER.className = 'task_info_inner';
              CREATED.href = '';
                TODAY.className = 'today';
                TODAY.innerHTML = task.currDate(obj.created);
                POINT.className = 'point';
                EDIT_LINK.href = '/edit/' + obj.id;
                EDIT_LINK.innerHTML = 'Редактировать';
            BTNS_WRP.className = 'task_btns_wrapper';
              JORNAL_HLP.className = 'jornal_hlp';
                JORNAL_TEXT.className = 'task_jornal_txt';
                JORNAL_TEXT.innerHTML = 'Добавить в журнал';
                JORNAL_TRIANGLE.className = 'hlp_triangle';
              RESPONSE_ACTIVE.className = 'task_response';
              RESPONSE_ACTIVE.setAttribute('onmouseover', 'task.hlp_jornal(this)');
              RESPONSE_ACTIVE.setAttribute('onmouseout', 'task.hlp_hideJornal(this)');
              RESPONSE_ACTIVE.setAttribute('onclick', 'task.addJornal(this)');
                COVER.className = 'cover';
                  COVER_IMG.src = '/img/checked.gif';

        LI.appendChild(TASK);
          TASK.appendChild(INNER);
            INNER.appendChild(TSK_IMG_WRP);
              TSK_IMG_WRP.appendChild(TSK_IMG_LINK);
              TSK_IMG_LINK.appendChild(TSK_IMG);
            INNER.appendChild(NAV_WRAPPER);
              NAV_WRAPPER.appendChild(TSK_REMOVE);
                TSK_REMOVE.appendChild(RMV_HELPER);
                  RMV_HELPER.appendChild(RMV_TXT);
                  RMV_HELPER.appendChild(RMV_TRIANGLE);
                TSK_REMOVE.appendChild(RMV_IMG);
              NAV_WRAPPER.appendChild(LINK_MORE);
            INNER.appendChild(DESCRIPTION);
            INNER.appendChild(INFO_WRP);
              INFO_WRP.appendChild(INFO_INNER);
                INFO_INNER.appendChild(CREATED);
                  CREATED.appendChild(TODAY);
                INFO_INNER.appendChild(POINT);
                INFO_INNER.appendChild(EDIT_LINK);
              INFO_WRP.appendChild(BTNS_WRP);
                BTNS_WRP.appendChild(JORNAL_HLP);
                  JORNAL_HLP.appendChild(JORNAL_TEXT);
                  JORNAL_HLP.appendChild(JORNAL_TRIANGLE);
                BTNS_WRP.appendChild(RESPONSE_ACTIVE);
                  RESPONSE_ACTIVE.appendChild(COVER);
                    COVER.appendChild(COVER_IMG);

        return LI;
    },

    /**
     * Validate json string
     *
     * @param str
     * @return void
     */
    isJson : function(str) {

        var jsonStr = JSON.parse(str);

        if(jsonStr) return jsonStr;
    }
};

/**
 * Collapse current recipe
 *
 * @param elem
 * @param txt
 */
function collapseTask(elem, txt){
    var step = 4;

    if(elem.clientHeight >= step){
        var h = elem.clientHeight - step;
        elem.style.height = h + 'px';
        setTimeout(function(){collapseTask(elem,txt)},2);
    }else{
        elem.style.height = '0px';
        txt.style.opacity = '0';
    }
}

var recipe = {

    view : function(elem, curr){

    },

    vote : function (elem, action){

        var currClassName = elem.className,
            like          = elem.parentNode.children[0],
            dislike       = elem.parentNode.children[1],
            likeVal       = parseInt(like.children[1].innerHTML),
            dislikeVal    = parseInt(dislike.children[1].innerHTML);

        var params = {
            url : '/recipe/vote',
            data : action,
            method : 'post'
        };

        if(currClassName != 'vote active'){

            // If was a click on the button like
            if(action == 'like'){

                like.className = 'vote active';
                like.children[1].innerHTML = likeVal + 1;

                if(dislike.className == 'vote active'){

                    dislike.children[1].innerHTML = dislikeVal - 1;
                    dislike.className = 'vote';
                }

            }

            // If was a click on the button dislike
            if(action == 'dislike'){

                dislike.className = 'vote active';
                dislike.children[1].innerHTML = dislikeVal + 1;

                if(like.className == 'vote active'){

                    like.children[1].innerHTML = likeVal - 1;
                    like.className = 'vote';
                }
            }

            // Send user vote
            $.ajax(params, function(entry){

                console.log(entry)

            });
        }

    }


};
