let modal = (function () {
    let data = {
        board: [
            "e", "e", "e",
            "e", "e", "e",
            "e", "e", "e"
        ],
        won: 0,
        lose: 0,
        draw: 0,
        user: "",
        pc: "",
        turn: "user",
    };


    return {
        testing: () => console.log(data),

        reset() {
            data.board = [
                "e", "e", "e",
                "e", "e", "e",
                "e", "e", "e"
            ];
            data.user = "";
            data.pc = "";
        },

        updateData(prop, value = false, index = false) {
            switch (prop) {
                case "board": data[prop][index] = value; break;
                case "won": case "lose": case "draw": data[prop]++; break;
                case "user": data[prop] = value; break;
                case "pc": data[prop] = value; break;
                case "turn": data[prop] = value; break;
            };
        },

        getData(prop) {
            if (prop === "board") return data[prop].slice();
            return data[prop];
        },

    };

})();


let view = (function () {
    let DOM = {
        newGameBtn: ".new-game-btn",
        shineBtn: "shine-btn",
        choose: ".choose",
        box: ".game-board > img",
        boxes: ".game-board",
        scaleUp: "scale-up",
        won: "#won-score",
        lose: "#lose-score",
        draw: "#draw-score",
        wonText: ".won-text",
        loseText: ".lose-text",
        drawText: ".draw-text",
        hidden: "hidden",
    };

    return {
        getDOM: () => DOM,

        reset() {
            let boxes = document.querySelectorAll(DOM.box);
            boxes = Array.prototype.slice.call(boxes);
            boxes.forEach(element => {
                element.src = "image/none.svg";
            });
        },

        updateBox(id, symbol) {
            document.getElementById(id).src = `image/${symbol}.svg`;
        },

    };

})();


let controller = (function (modal, view) {

    let DOM = view.getDOM();

    function eventListener() {
        // when new game button is clicked,
        document.querySelector(DOM.newGameBtn).addEventListener("click", newGame);

        // choose X or O and update data in modal
        document.querySelector(DOM.choose).addEventListener("click", chooseAnyOne);

        // after user chooses X or O, draw the user symbol on the box
        document.querySelector(DOM.boxes).addEventListener("click", move);

    };

    function newGame(event) {
        // remove prevoius game won, lose or draw text
        document.querySelector(DOM.wonText).classList.add(DOM.hidden);
        document.querySelector(DOM.loseText).classList.add(DOM.hidden);
        document.querySelector(DOM.drawText).classList.add(DOM.hidden);
        
        // remove shine-btn display choose option
        event.target.classList.remove(DOM.shineBtn);

        // reset data
        reset();

        // show options to choose between X or O
        document.querySelector(DOM.choose).classList.add(DOM.scaleUp);
    };

    function reset() {
        // resets both modal and view data
        modal.reset();
        view.reset();
    };

    function chooseAnyOne(event) {
        // if X or O option is clicked,
        if (event.target.id === "x" || event.target.id === "o") {

            // pc will be opposite of user option
            let pc = event.target.id === "x" ? "o" : "x";

            // update both data for user and pc option
            modal.updateData("user", event.target.id);
            modal.updateData("pc", pc);

            // remove choose option
            document.querySelector(DOM.choose).classList.remove(DOM.scaleUp);

            // call pc if first turn is pc
            if (modal.getData("turn") === "pc") {
                pcTurn();
            }
        }
    };

    function pcTurn() {

    };

    function move(event) {
        let index = event.target.id;
        let regex = /[0-8]/.test(index);
        let board = modal.getData("board");
        let user = modal.getData("user");

        // if user has choosen their option (X or O),
        // if clicked any one of the boxes,
        // if it is empty,
        if (user && regex && ifEmpty(Number(index), board)) {

            // update both data
            modal.updateData("board", user, Number(index));
            view.updateBox(index, user);

            // get copy of board for checking if won or draw
            board = modal.getData("board");
            if (ifWon(board, user)) {
                gameEnd("won");
                return;
            } else if (ifDraw(board)) {
                gameEnd("draw");
                return;
            }

            // if game not ended then call pc
            pcTurn();
        }
    };

    function ifEmpty(index, board) {
        if (board[index] === "e") {
            return true;
        }
        return false;
    };

    function ifWon(box, symbol) {
        return (
            ((box[0] === symbol) && (box[1] === symbol) && (box[2] === symbol)) ||
            ((box[3] === symbol) && (box[4] === symbol) && (box[5] === symbol)) ||
            ((box[6] === symbol) && (box[7] === symbol) && (box[8] === symbol)) ||
            ((box[0] === symbol) && (box[3] === symbol) && (box[6] === symbol)) ||
            ((box[1] === symbol) && (box[4] === symbol) && (box[7] === symbol)) ||
            ((box[2] === symbol) && (box[5] === symbol) && (box[8] === symbol)) ||
            ((box[0] === symbol) && (box[4] === symbol) && (box[8] === symbol)) ||
            ((box[6] === symbol) && (box[4] === symbol) && (box[2] === symbol))
        );
    };

    function ifDraw(board) {
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "e") {
                return false;
            }
        }
        return true;
    };

    function gameEnd(event) {
        
        // if won, lose or draw then display text and update for next firstTurn
        if (event === "won") {
            modal.updateData("turn", "user");
            document.querySelector(DOM.wonText).classList.remove(DOM.hidden);
        } else if (event === "lose") {
            modal.updateData("turn", "pc");
            document.querySelector(DOM.loseText).classList.remove(DOM.hidden);
        } else {
            modal.updateData("turn", "user");
            document.querySelector(DOM.drawText).classList.remove(DOM.hidden);
        }

        // reset both data,
        reset();

        // highlight new button
        document.querySelector(DOM.newGameBtn).classList.add(DOM.shineBtn);
        
        // update score board
        modal.updateData(event);
        document.querySelector(DOM[event]).innerHTML = modal.getData(event);
    };


    return {
        init() {
            console.log("Application has started.");
            eventListener();
        },
    };

})(modal, view);

controller.init();
