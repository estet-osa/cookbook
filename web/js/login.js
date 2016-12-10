"use strict";

var lgn = {

    viewPass : function(elem){

        var inpt = elem.parentNode.querySelector('input');

        if(elem.className == 'view_password'){

            //Set the class
            elem.className = 'view_password show_password';
            inpt.type = 'text'

        }else{

            elem.className = 'view_password';
            inpt.type = 'password';
        }
    },

    issetUser : function(elem, currentField){

        var cover = elem.parentNode.parentNode.querySelector('.login_check_wrp > .cover');
        //cover.style.width = '15px';


    },

    isPrivacyPolicy : function(){

        var checkbox = document.getElementById('privacy_policy'),
            border   = checkbox.parentNode.parentNode;

        if(!checkbox.checked){

            border.style.border = '#555 solid 2px';

            setTimeout(function(){

                border.style.border = 'transparent solid 2px';

            }, 500);

            return false;
        }
    }

};
