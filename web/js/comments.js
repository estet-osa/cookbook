var Cmt = {

    votePermissionFlag : 1000,

    vote : function(post, action, curr){

        //Проверяем флаг, можно ли сейчас исполнять манипуляции с лайком и дизлайком
        if(Cmt.votePermissionFlag == 1000){

            //Устанавливаем флаг в положение false
            this.votePermissionFlag = 50;

            //Initiate vars
            var parent      = curr.parentNode,
                like        = parent.children[0],
                dislike     = parent.children[1];

            //Пытаемся получить свой голос
            var myVote = (parent.querySelector('.my_vote'));

            //Если наш голос присутвсвует, значит выполним нужные манипуляции
            if(myVote){

                //Если текущее нажатие является лайком, идем дальше
                if(myVote == like){

                    //Если в данный момент мы нажали dislike, тогда выполняем следующий код
                    if(action == 'dislike'){
                        like.className = 'like';
                        dislike.className = 'dislike my_vote';

                        this.voteUp('up', [like, dislike], action);

                        //В данный момент у нас уже есть лайк, его нужно отжать
                        this.anotherVoteDown(like);

                    }else if(action == 'like'){
                        like.className = 'like';
                        dislike.className = 'dislike';

                        this.voteDown('down', [like, dislike], action);
                    }
                }
                //Если текущее нажатие является дизлайком, идем дальше
                else if(myVote == dislike){

                    //Если в данный момент мы нажали dislike, тогда выполняем следующий код
                    if(action == 'like'){
                        like.className = 'like my_vote';
                        dislike.className = 'dislike';

                        this.voteUp('up', [like, dislike], action);

                        this.anotherVoteDown(dislike);

                    }else if(action == 'dislike'){
                        like.className = 'like';
                        dislike.className = 'dislike';

                        this.voteDown('down', [like, dislike], action);
                    }
                }
            }
            //Если нашего голоса не присутствует, нужно его создать
            else{

                //Если мы нажали на лайк, то классно нам :D
                if(curr.className == 'like'){

                    like.className = 'like my_vote';

                    this.voteUp('up', [like, dislike], action);
                }

                //Если мы нажали на дизлайк, то тоже неплохо нам
                else if(curr.className == 'dislike'){

                    dislike.className = 'dislike my_vote';

                    this.voteUp('up', [like, dislike], action);
                }

            }

        }

        //Ставим ограничение, на выполнение цикла setTimeout, если внутренний счетчик равен 50
        // значит можно зайти в условие и запустить цикл
        if(Cmt.votePermissionFlag == 50){

            //this.voteResolution();
            this.voteResolution();
        }
    },

    voteResolution : function(){

        //Если внутренний счетчик не равен 1000, гоняем его,
        // когда станет 1000 значит функция vote перезарядилась и готова снова отработать лайк дизлайк
        setTimeout(function(){

            if(Cmt.votePermissionFlag < 1000){
                Cmt.votePermissionFlag = Cmt.votePermissionFlag + 50;
                Cmt.voteResolution();
            }
        }, 30);
    },

    anotherVoteDown : function(vote){

        //Инициируем переменные, в параметр vote попал элемент (like or dislike)
        var voteNum  = vote.children[1].children[0].innerHTML;

        //Для начала нужно получить число
        //Вычитаем 1 и одновременно преобразуем полученное в строку, что бы посчитать длинну строки
        var num = String(voteNum - 1);

        //Теперь нужно выяснить отличается ли длинна значения num от той, что была до вычитания, если нет, идем дальше
        if(num.length == voteNum.length){

            var moveNum = '';

            for(var i = 0; i < num.length; i++){
                if(num[i] != voteNum[i])
                    moveNum += num[i];
            }

            //Если полученное число больше 0, нужно создать элемент span, и анимировать его
            if(num >= 1){

                var SPAN             = create('SPAN');
                SPAN.className   = 'vote_num_down';
                SPAN.style.width = 'auto';
                SPAN.innerHTML   = moveNum;

                //Подвешиваем созданный элемент
                vote.children[1].children[0].appendChild(SPAN);

                //Плавно опускаем созданный элемент в низ
                setTimeout(function(){SPAN.style.top = '0';}, 15);
                setTimeout(function(){vote.children[1].children[0].innerHTML = num}, 500);
            }
            //Если в результате вычитания получается 0, делаем пустым текущий элемент (like or dislike)
            else{

                vote.children[1].children[0].className = 'vote_num_active';

                //Плавно поднимаем созданный элемент в низ
                setTimeout(function(){vote.children[1].children[0].style.top = '13px';}, 15);
                setTimeout(function(){vote.children[1].children[0].innerHTML = ''}, 500);
            }

        }
        //Если длинна значения num меньше, идем дальше
        else if(num.length < voteNum.length){

            moveNum = '';

            for(var i = 0; i < num.length; i++){
                if(num[i] != voteNum[i])
                    moveNum += num[i];
            }

            //Если полученное число больше 0, нужно создать элемент span, и анимировать его
            if(num >= 1){

                SPAN             = create('SPAN');
                SPAN.className   = 'vote_num_down';
                SPAN.style.width = vote.children[1].clientWidth + 'px';
                SPAN.innerHTML   = moveNum;

                //Подвешиваем созданный элемент
                vote.children[1].children[0].appendChild(SPAN);

                //Плавно опускаем созданный элемент в низ
                setTimeout(function(){SPAN.style.top = '0';}, 15);
                setTimeout(function(){vote.children[1].children[0].innerHTML = num}, 500);
            }
        }
    },

    voteUp : function(action, vote, curr){

        //Инициируем переменные, в параметр vote попал массив из элементов like & dislike
        var likeNum     = vote[0].children[1].children[0].innerHTML,
            dislikeNum  = vote[1].children[1].children[0].innerHTML;

        if(action == 'up'){

            //Если текущий элемент называется дизлайком, идем дальше
            if(curr == 'dislike'){

                //Для начала нужно получить число
                //Вычитаем 1 и одновременно преобразуем полученное в строку, что бы посчитать длинну строки
                var num = Number(dislikeNum) + 1;

                //Конвертируем полученное значение в строку, что бы можно было посчитать колличество символов
                // для сравнения с длинной значения в dislike
                num = String(num);

                var moveNum = '';

                for(var i = 0; i < num.length; i++){
                    if(num[i] != dislikeNum[i])
                        moveNum += num[i];
                }

                //Если значение в поле дизлайк существует, идем дальше
                if(dislikeNum){

                    var SPAN             = create('SPAN');
                    SPAN.className   = (action == 'down') ? 'vote_num_down' : 'vote_num_up';
                    SPAN.innerHTML   = moveNum;

                    //Подвешиваем созданный элемент
                    vote[1].children[1].children[0].appendChild(SPAN);

                    //Здесь мы вымеряем ширину блоков, что бы анимируемое число ложилось четко, а не где попало
                    if(vote[1].children[1].children[0].offsetWidth < SPAN.offsetWidth)
                        vote[1].children[1].children[0].style.width = SPAN.offsetWidth + 'px';
                    else
                        vote[1].children[1].children[0].style.width = vote[1].children[1].children[0].offsetWidth + 'px';

                    //Плавно опускаем созданный элемент в низ
                    setTimeout(function(){SPAN.style.top = '0';}, 15);
                    setTimeout(function(){vote[1].children[1].children[0].innerHTML = num}, 500);
                }
                //Если в поле дизлайк отсутствует значение, идем дальше
                else{

                    var SPAN           = create('SPAN');
                    SPAN.className = (action == 'down') ? 'vote_num_down' : 'vote_num_up';
                    SPAN.innerHTML = moveNum;

                    //Подвешиваем созданный элемент
                    vote[1].children[1].appendChild(SPAN);

                    //Плавно поднимаем созданный элемент в низ
                    setTimeout(function(){SPAN.style.top = '0';}, 15);
                    setTimeout(function(){vote[1].children[1].innerHTML = '<span>'+ num +'</span>'}, 500);
                }
            }
            //Если текущий элемент называется дизлайком, идем дальше
            else if(curr == 'like'){

                //Для начала нужно получить число
                //Вычитаем 1 и одновременно преобразуем полученное в строку, что бы посчитать длинну строки
                var num = Number(likeNum) + 1;

                //Конвертируем полученное значение в строку, что бы можно было посчитать колличество символов
                // для сравнения с длинной значения в dislike
                num = String(num);

                var moveNum = '';

                for(var i = 0; i < num.length; i++){
                    if(num[i] != likeNum[i])
                        moveNum += num[i];
                }

                //Если полученное число больше 0, нужно создать элемент span, и анимировать его
                if(likeNum){

                    var SPAN           = create('SPAN');
                    SPAN.className = (action == 'down') ? 'vote_num_down' : 'vote_num_up';
                    SPAN.innerHTML = moveNum;

                    //Подвешиваем созданный элемент
                    vote[0].children[1].children[0].appendChild(SPAN);

                    //Здесь мы вымеряем ширину блоков, что бы анимируемое число ложилось четко, а не где попало
                    if(vote[0].children[1].children[0].offsetWidth < SPAN.offsetWidth){
                        vote[0].children[1].children[0].style.width = SPAN.offsetWidth + 'px';
                    }else{
                        vote[0].children[1].children[0].style.width = vote[0].children[1].children[0].offsetWidth + 'px';
                    }

                    //Плавно опускаем созданный элемент в низ
                    setTimeout(function(){SPAN.style.top = '0';}, 15);
                    setTimeout(function(){vote[0].children[1].children[0].innerHTML = num}, 500);
                }
                //Если значения в лайке нету, добавим значение 1 и анмируем лайк
                else{

                    var SPAN           = create('SPAN');
                    SPAN.className = (action == 'down') ? 'vote_num_down' : 'vote_num_up';
                    SPAN.innerHTML = moveNum;

                    //Подвешиваем созданный элемент
                    vote[0].children[1].appendChild(SPAN);

                    //Плавно поднимаем созданный элемент в низ
                    setTimeout(function(){SPAN.style.top = '0';}, 15);
                    setTimeout(function(){vote[0].children[1].innerHTML = '<span>'+ num +'</span>'}, 500);
                }
            }


        }
    },

    voteDown  : function (action, vote, curr){

        //Так должна выглядеть строка которую мы будем добавлять в анимацию
        //<span class="vote_num">9</span>

        //Инициируем переменные, в параметр vote попал массив из элементов like & dislike
        var likeNum     = vote[0].children[1].children[0].innerHTML,
            dislikeNum  = vote[1].children[1].children[0].innerHTML;

        //Если action == down, это значит что сейчас будем вычитать
        if(action == 'down'){

            //Если текущий элемент называется дизлайком, идем дальше
            if(curr == 'dislike'){

                //Для начала нужно получить число
                //Вычитаем 1 и одновременно преобразуем полученное в строку, что бы посчитать длинну строки
                var num = String(dislikeNum - 1);

                //Теперь нужно выяснить отличается ли длинна значения num от той, что была до вычитания, если нет, идем дальше
                if(num.length == dislikeNum.length){

                    var moveNum = '';

                    for(var i = 0; i < num.length; i++){
                        if(num[i] != dislikeNum[i])
                            moveNum += num[i];
                    }

                    //Если полученное число больше 0, нужно создать элемент span, и анимировать его
                    if(num >= 1){

                        var SPAN             = create('SPAN');
                        SPAN.className   = (action == 'down') ? 'vote_num_down' : 'vote_num_up';
                        SPAN.style.width = 'auto';
                        SPAN.innerHTML   = moveNum;

                        //Подвешиваем созданный элемент
                        vote[1].children[1].children[0].appendChild(SPAN);

                        //Здесь мы вымеряем ширину блоков, что бы анимируемое число ложилось четко, а не где попало
                        if(vote[1].children[1].children[0].offsetWidth < SPAN.offsetWidth){
                            vote[1].children[1].children[0].style.width = SPAN.offsetWidth + 'px';
                        }else{
                            vote[1].children[1].children[0].style.width = vote[1].children[1].children[0].offsetWidth + 'px';
                        }

                        //Плавно опускаем созданный элемент в низ
                        setTimeout(function(){SPAN.style.top = '0';}, 15);
                        setTimeout(function(){vote[1].children[1].children[0].innerHTML = num}, 500);
                    }
                    //Если в результате вычитания получается 0, плавно делаем пустым элемент dislike
                    else{

                        vote[1].children[1].children[0].className = 'vote_num_active';

                        //Плавно поднимаем созданный элемент в низ
                        setTimeout(function(){vote[1].children[1].children[0].style.top = '13px';}, 15);
                        setTimeout(function(){vote[1].children[1].children[0].innerHTML = ''}, 500);
                    }

                }
                //Если длинна значения num меньше, идем дальше
                else if(num.length < dislikeNum.length){

                    moveNum = '';

                    for(var i = 0; i < num.length; i++){
                        if(num[i] != dislikeNum[i]){
                            moveNum += num[i];
                        }
                    }

                    //Если полученное число больше 0, нужно создать элемент span, и анимировать его
                    if(num >= 1){

                        SPAN             = create('SPAN');
                        SPAN.className   = (action == 'down') ? 'vote_num_down' : 'vote_num_up';
                        SPAN.style.width = vote[1].children[1].clientWidth + 'px';
                        SPAN.innerHTML   = moveNum;

                        //Подвешиваем созданный элемент
                        vote[1].children[1].children[0].appendChild(SPAN);

                        //Плавно опускаем созданный элемент в низ
                        setTimeout(function(){SPAN.style.top = '0';}, 15);
                        setTimeout(function(){vote[1].children[1].children[0].innerHTML = num}, 500);
                    }
                }
            }
            //Если текущий элемент называется дизлайком, идем дальше
            else if(curr == 'like'){

                //Для начала нужно получить число
                //Вычитаем 1 и одновременно преобразуем полученное в строку, что бы посчитать длинну строки
                var num = String(likeNum - 1);

                //Теперь нужно выяснить отличается ли длинна значения num от той, что была до вычитания, если нет, идем дальше
                if(num.length == likeNum.length){

                    var moveNum = '';

                    for(var i = 0; i < num.length; i++){
                        if(num[i] != likeNum[i]){
                            moveNum += num[i];
                        }
                    }

                    //Если полученное число больше 0, нужно создать элемент span, и анимировать его
                    if(num >= 1){

                        var SPAN             = create('SPAN');
                        SPAN.className   = (action == 'down') ? 'vote_num_down' : 'vote_num_up';
                        SPAN.style.width = 'auto';
                        SPAN.innerHTML   = moveNum;

                        //Подвешиваем созданный элемент
                        vote[0].children[1].children[0].appendChild(SPAN);

                        //Плавно опускаем созданный элемент в низ
                        setTimeout(function(){SPAN.style.top = '0';}, 15);
                        setTimeout(function(){vote[0].children[1].children[0].innerHTML = num}, 500);
                    }
                    //Если в результате вычитания получается 0, делаем пустым элемент like
                    else{

                        vote[0].children[1].children[0].className = 'vote_num_active';

                        //Плавно поднимаем созданный элемент в низ
                        setTimeout(function(){vote[0].children[1].children[0].style.top = '13px';}, 15);
                        setTimeout(function(){vote[0].children[1].children[0].innerHTML = ''}, 500);
                    }
                }
                //Если длинна значения num меньше, идем дальше
                else if(num.length < likeNum.length){

                    moveNum = '';

                    for(var i = 0; i < num.length; i++){
                        if(num[i] != likeNum[i])
                            moveNum += num[i];
                    }

                    //Если полученное число больше 0, нужно создать элемент span, и анимировать его
                    if(num >= 1){

                        SPAN             = create('SPAN');
                        SPAN.className   = (action == 'down') ? 'vote_num_down' : 'vote_num_up';
                        SPAN.style.width = vote[0].children[1].clientWidth + 'px';
                        SPAN.innerHTML   = moveNum;

                        //Подвешиваем созданный элемент
                        vote[0].children[1].children[0].appendChild(SPAN);

                        //Плавно опускаем созданный элемент в низ
                        setTimeout(function(){SPAN.style.top = '0';}, 15);
                        setTimeout(function(){vote[0].children[1].children[0].innerHTML = num}, 500);
                    }
                }

            }
        }
    },

    showEditComment : function(e){

        //Получаем блок и делаем его видимым
        var commentBlock = e.target.parentNode.querySelector('.comment_field');

        if(commentBlock.style.display == 'block')
            commentBlock.style.display = 'none';
        else commentBlock.style.display = 'block';
    },

    postSave : function(){






        console.log('this is cool');

        return false;
    }


};






















