"use strict";

var d = document, w = window;

function getId(id){
    return document.getElementById(id)
}

function create(elem){
    return document.createElement(elem)
}

var task = {

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
     * Add new task in JORNAL
     * @param elem
     */
    addJornal : function(elem){

        //Add task
        if(elem.className == 'task_response'){
            elem.className = 'task_response-active';
            elem.children[0].className = 'cover-active';
            elem.children[0].style.width = '11px';

            elem.parentNode.children[0].children[0].innerHTML = 'Убрать из журнала';

            //Delete task
        }else{
            elem.className = 'task_response';
            elem.children[0].style.width = '0px';

            elem.parentNode.children[0].children[0].innerHTML = 'Добавить в журнал';
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

        var params = {
            url : '/recipe/find',
            data : JSON.stringify({searchStr : elem.value.trim()}),
            method : 'post'
        };

        // Send params & get json data
        $.ajax(params, function(entries){

            if (typeof entries == 'string' && entries != 'not_found') {

                var json = srch.isJson(entries);

                if (json) {

                    var list = getId('recipe_list');
                        list.innerHTML = '';

                    for(var key in json)
                        list.appendChild(srch.createSearchingElement(json[key]));
                }
            }

        });
    },

    createSearchingElement : function (obj) {

        var LI              = create('LI'),
            TASK            = create('DIV'),
            INNER           = create('DIV'),
            TSK_IMG_WRP     = create('DIV'),
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

        TASK.className = 'task';
          INNER.className = 'inner';
            TSK_IMG_WRP.className = 'tsk_img';
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
          DESCRIPTION.innerHTML = obj.description.substr(0, 200);
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
              TSK_IMG_WRP.appendChild(TSK_IMG);
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
