document.addEventListener('DOMContentLoaded',function () {
    const grid = document.querySelector('.grid');
    const width = 10;
    const scoreDisplay = document.getElementById('score');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    let startButton = document.getElementById('start-button');
    let nextRandom = 0;
    let score = 0;
    let timerId = NaN;
    const colors = [
        '#ff6e00',
        '#db0000',
        '#ac00eb',
        '#2ac200',
        '#0004e6'];

    const borderColors = ['#ff8324','#ff0f0f','#c629ff','#37ff00','#1a1dff'];

    //tetromino and its rotations
    const lTetromino = [
        [1,width+1,width *2 +1,2],
        [width,width+1,width +2,width * 2 +2],
        [1,width+1, width*2+1,width*2],
        [width,width*2, width*2+1,width*2 + 2]
    ];

    const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
    ];

    const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ];

    const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ];

    const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ];

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    let currentPosition = 4;
    let currentRotation = 0;
    let random = Math.floor(Math.random() * theTetrominoes.length);
    let current = theTetrominoes[random][0];


    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].style.backgroundColor = colors[random];
            squares[currentPosition + index].style.borderColor = borderColors[random];
        })
    }

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].style.backgroundColor = '';
            squares[currentPosition + index].style.borderColor = '';
        })
    }

    function control(e) {
        if(e.code === 'ArrowLeft' || e.code === 'KeyA') {
            moveLeft()
        } else if(e.code === 'ArrowRight' || e.code === 'KeyD') {
            moveRight();
        } else if(e.code === 'ArrowDown' || e.code === 'KeyS') {
            moveDown()
        } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
            rotate();
        }
    }

    document.addEventListener('keydown',control);

    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }

    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);

        if(!isAtLeftEdge) {
            currentPosition -= 1;
        }

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        }

        draw();
    }

    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);

        if(!isAtRightEdge) {
            currentPosition += 1;
        }

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }

        draw();
    }

    function rotate() {
        undraw();

        currentRotation++;

        if(currentRotation === current.length) {
            currentRotation = 0;
        }

        current = theTetrominoes[random][currentRotation];

        draw();
    }

    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    const displayIndex = 0;

    const upNextTetraminos = [
        [1,displayWidth+1,displayWidth *2 +1,2],
        [0,displayWidth,displayWidth+1,displayWidth*2+1],
        [1,displayWidth,displayWidth+1,displayWidth+2],
        [0,1,displayWidth,displayWidth+1],
        [1,displayWidth+1,displayWidth*2+1,displayWidth*3+1],
    ];

    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
            square.style.backgroundColor = '';
            square.style.borderColor = '';
        })
        upNextTetraminos[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino');
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
            displaySquares[displayIndex + index].style.borderColor = borderColors[nextRandom];
        })
    }

    startButton.addEventListener('click',() => {
        if(timerId) {
            clearInterval(timerId);
            timerId = null;
            startButton.innerText = 'Start';
        } else {
            draw();
            startButton.innerText = 'Stop'
            timerId = setInterval(moveDown,1000)
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            displayShape();
        }
    });

    function addScore() {
        for (let i = 0; i< 199;i += width) {
            const row = [i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9];

            if(row.every(index => squares[index].classList.contains('taken'))) {
                score += 10;
                scoreDisplay.innerText = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                    squares[index].style.backgroundColor = '';
                });
                const squareRemoved = squares.splice(i,width);
                squares = squareRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }

    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerText = 'end';
            clearInterval(timerId);
        }
    }

})