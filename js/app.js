let UI = (function () {
    let DOM = {
        newGameBtn: ".new-game-btn",
        box: ".game-board",
        boxImage: ".game-board > img",
        won: "#won-score",
        lose: "#lose-score",
        draw: "#draw-score",
        chooseOption: ".choose",
        wonText: ".won-text",
        loseText: ".lose-text",
        drawText: ".draw-text",
        scaleUp: "scale-up",
        hidden: "hidden"

    };

    return {
        getDOM: () => DOM,

        resetUIBoard: function() {
            let boxes = Array.prototype.slice.call(document.querySelectorAll(DOM.boxImage));
            boxes.forEach(element => {
                element.src = "image/none.svg";
            });
        },

        addUI: function(id, userOption) {
            document.getElementById(id).src = `image/${userOption}.svg`;
        },

        updateUIScore: function(event, data) {
            document.querySelector(DOM[event]).innerHTML = String(data);
        }
    };

})();


let dataStructure = (function() {
    let data = {
        board: [
            "", "", "",
            "", "", "",
            "", "", ""
        ],
        won: 0,
        lose: 0,
        draw: 0
    };

    return {
        testing: function() {
            console.log(data);
        },

        resetDataBoard: () => {
            data.board = [
                "", "", "",
                "", "", "",
                "", "", ""
            ];
        },

        checkIfEmpty: function(id) {
            if (data.board[Number(id)] === "") {
                return true;
            }
            return false;
        },

        addData: function(id, symbol) {
            data.board[Number(id)] = symbol;
        },

        checkIfWon: function (symbol) {
            let box = data.board;
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
        },

        checkIfDraw: function() {
            for (let i = 0; i < data.board.length; i++) {
                if (data.board[i] === "") {
                    return false;
                }
            }
            return true;
        },

        updateDataScore: function(event) {
            data[event]++;
            return data[event];
        }
    };

})();


let controller = (function (interface, data) {
    let userOption = "";
    let pcOption = "";
    let firstTurn = "pc";
    let currentTurn = "";
    let DOM = interface.getDOM();

    function setupEventListener() {
        // clear data board and UI board when new game button is clicked
        document.querySelector(DOM.newGameBtn).addEventListener("click", newGame);

        // after new button is clicked, choose option is appeared
        document.querySelector(DOM.chooseOption).addEventListener("click", chooseOption);

        // after everything is setup now start the game
        document.querySelector(DOM.box).addEventListener("click", userTurn);
    };

    function newGame() {
        // remove shine shadow
        document.querySelector(DOM.newGameBtn).classList.remove("shine-btn");

        // remove previous won, lose or darw text
        document.querySelector(DOM.wonText).classList.add(DOM.hidden);
        document.querySelector(DOM.loseText).classList.add(DOM.hidden);
        document.querySelector(DOM.drawText).classList.add(DOM.hidden);

        // reset data board
        data.resetDataBoard();

        // reset UI board
        UI.resetUIBoard();

        // choose X or O
        document.querySelector(DOM.chooseOption).classList.add(DOM.scaleUp);
    };

    function chooseOption(event) {
        //only close choose when X or O button are clicked
        if (event.target.id === "x" || event.target.id === "o") {
            userOption = event.target.id;
            pcOption = userOption === "x" ? "o" : "x";
            currentTurn = firstTurn;
            document.querySelector(DOM.chooseOption).classList.remove(DOM.scaleUp);
            pcTurn(pcOption);
        }
    };

    function userTurn(event) {
        if (currentTurn === "user") {
            let regex = /[0-8]/.test(event.target.id);
            let id = event.target.id;

            // check if clicked box is empty in dataStructure
            // if empty then add in dataStructure
            if (userOption && regex && data.checkIfEmpty(id)) {
                data.addData(id, userOption);
                UI.addUI(id, userOption);
                if (data.checkIfWon(userOption)) {
                    gameEnd("won");
                    return;
                } else if (data.checkIfDraw()) {
                    gameEnd();
                    return;
                }

                currentTurn = "pc";
                pcTurn(pcOption);
            }
        }
    };

    function pcTurn(pcOption) {
        if (currentTurn === "pc") {
            let id = 5;


            
            data.addData(id, pcOption);
            UI.addUI(id, pcOption);

            if (data.checkIfWon(pcOption)) {
                gameEnd("lose");
                return;
            } else if (data.checkIfDraw()) {
                gameEnd();
                return;
            }

            currentTurn = "user";
        }
    };

    function gameEnd(event="draw") {
        firstTurn = "user";
        userOption = "";
        document.querySelector(DOM.newGameBtn).classList.add("shine-btn");
        data.resetDataBoard();
        UI.resetUIBoard();
        let value = data.updateDataScore(event);
        interface.updateUIScore(event, value);

        if (event === "won") {
            firstTurn = "user";
            document.querySelector(DOM.wonText).classList.remove(DOM.hidden);
        } else if (event === "lose") {
            firstTurn = "pc";
            document.querySelector(DOM.loseText).classList.remove(DOM.hidden);
        } else {
            document.querySelector(DOM.drawText).classList.remove(DOM.hidden);
        }
    };

    return {
        init: function () {
            console.log("Application has started.");
            setupEventListener();
        }
    };

})(UI, dataStructure);


controller.init();
