let modal = (function () {
    let data = {
        board: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        user: "",
        pc: "",
        won: 0,
        lose: 0,
        draw: 0,
        turn: "user"
    };

    return {
        testing: () => console.log(data),

        modalReset() {
            data.board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
            data.user = "";
            data.pc = "";
        },

        updateModalData(prop, value = false, index = false) {
            switch (prop) {
                case "board": data[prop][Number(index)] = value; break;
                case "won": case "lose": case "draw": data[prop]++; break;
                case "user": data[prop] = value; break;
                case "pc": data[prop] = value; break;
                case "turn": data[prop] = value; break;
            };
        },

        getModalData(prop) {
            if (prop === "board") return data[prop].slice();
            return data[prop];
        }
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

        resetView() {
            let boxes = document.querySelectorAll(DOM.box);
            boxes = Array.prototype.slice.call(boxes);
            boxes.forEach(element => {
                element.src = "image/none.svg";
            });
        },

        updateViewBox(id, symbol) {
            document.getElementById(String(id)).src = `image/${symbol}.svg`;
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
        document.querySelector(DOM.boxes).addEventListener("click", userMove);
    };

    function newGame(event) {
        document.querySelector(DOM.wonText).classList.add(DOM.hidden);
        document.querySelector(DOM.loseText).classList.add(DOM.hidden);
        document.querySelector(DOM.drawText).classList.add(DOM.hidden);

        event.target.classList.remove(DOM.shineBtn);

        modal.modalReset();
        view.resetView();

        document.querySelector(DOM.choose).classList.add(DOM.scaleUp);
    };

    function chooseAnyOne(event) {
        if (event.target.id === "x" || event.target.id === "o") {

            // pc will be opposite of user option
            let pc = event.target.id === "x" ? "o" : "x";

            // update both data for user and pc option
            modal.updateModalData("user", event.target.id);
            modal.updateModalData("pc", pc);

            // remove choose option
            document.querySelector(DOM.choose).classList.remove(DOM.scaleUp);

            // call pc if first turn is pc
            if (modal.getModalData("turn") === "pc") {
                pcMove();
            }
        }
    };

    function userMove(event) {
        let user = modal.getModalData("user");
        let index = event.target.id;
        let regex = /[0-8]/.test(index);
        let board = modal.getModalData("board");
        // if user has choosed option --- if box id is 0-8 --- if it is empty
        if (user && regex && Number(board[Number(index)]) >= 0)
        {
            modal.updateModalData("board", user, index);
            view.updateViewBox(index, user);
            board = modal.getModalData("board");
            if (won(board, user)) {
                gameEnd("won");
                return;
            }
            if (emptyIndex(board).length === 0) {
                gameEnd("draw");
                return;
            }
            pcMove();
        }
    };

    function pcMove() {
        let pc = modal.getModalData("pc");
        let board = modal.getModalData("board");
        let id = minimax(board, pc);
        if (id.hasOwnProperty("index")) {
            id = id.index;
        } else {
            id = emptyIndex(board)[0];
        }
        modal.updateModalData("board", pc, id);
        view.updateViewBox(id, pc);
        board = modal.getModalData("board");
        if (won(board, pc)) {
            gameEnd("lose");
            return;
        }
        if (emptyIndex(board).length === 0) {
            gameEnd("draw");
            return;
        }
    };

    function emptyIndex(board) {
        return board.filter(e => e !== "x" && e !== "o");
    };

    function won(board, player) {
        return (
            (board[0] == player && board[1] == player && board[2] == player) ||
            (board[3] == player && board[4] == player && board[5] == player) ||
            (board[6] == player && board[7] == player && board[8] == player) ||
            (board[0] == player && board[3] == player && board[6] == player) ||
            (board[1] == player && board[4] == player && board[7] == player) ||
            (board[2] == player && board[5] == player && board[8] == player) ||
            (board[0] == player && board[4] == player && board[8] == player) ||
            (board[2] == player && board[4] == player && board[6] == player)
        );
    };

    function gameEnd(event) {
        if(event === "won") {
            modal.updateModalData("turn", "user");
            document.querySelector(DOM.wonText).classList.remove(DOM.hidden);
        } else if (event === "lose") {
            modal.updateModalData("turn", "pc");
            document.querySelector(DOM.loseText).classList.remove(DOM.hidden);
        } else {
            modal.updateModalData("turn", "user");
            document.querySelector(DOM.drawText).classList.remove(DOM.hidden);
        }

        modal.modalReset();
        view.resetView();

        document.querySelector(DOM.newGameBtn).classList.add(DOM.shineBtn);

        modal.updateModalData(event);
        document.querySelector(DOM[event]).innerHTML = modal.getModalData(event);
    };

    function minimax(newBoard, player) {
        let user = modal.getModalData("user");
        let pc = modal.getModalData("pc");

        //available spots
        var availSpots = emptyIndex(newBoard);

        // checks for the terminal states such as win, lose, and tie and returning a value accordingly
        if (won(newBoard, user)) {
            return { score: -10 };
        }
        else if (won(newBoard, pc)) {
            return { score: 10 };
        }
        else if (availSpots.length === 0) {
            return { score: 0 };
        }

        // an array to collect all the objects
        var moves = [];

        // loop through available spots
        for (var i = 0; i < availSpots.length; i++) {
            //create an object for each and store the index of that spot that was stored as a number in the object's index key
            var move = {};
            move.index = newBoard[availSpots[i]];

            // set the empty spot to the current player
            newBoard[availSpots[i]] = player;

            //if collect the score resulted from calling minimax on the opponent of the current player
            if (player == pc) {
                var result = minimax(newBoard, user);
                move.score = result.score;
            }
            else {
                var result = minimax(newBoard, pc);
                move.score = result.score;
            }

            //reset the spot to empty
            newBoard[availSpots[i]] = move.index;

            // push the object to the array
            moves.push(move);
        }

        // if it is the computer's turn loop over the moves and choose the move with the highest score
        var bestMove;
        if (player === pc) {
            var bestScore = -10000;
            for (var i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            // else loop over the moves and choose the move with the lowest score
            var bestScore = 10000;
            for (var i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        // return the chosen move (object) from the array to the higher depth
        return moves[bestMove];
    };

    return {
        init() {
            console.log("Application has started.")
            eventListener();
        }
    }

})(modal, view);


controller.init();

