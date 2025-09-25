$(document).ready(function() {
    // Initialize Confetti library
    const jsConfetti = new JSConfetti();

    // --- General UI & Navigation ---
    // Smooth scrolling for navigation and 'Explore Programs' button
    $('a[href^="#"], .scroll-to-offer').on('click', function(event) {
        var target = $(this.hash);
        if (target.length) {
            event.preventDefault();
            $('html, body').animate({
                scrollTop: target.offset().top - $('header').outerHeight()
            }, 800);
        }
    });

    // Active navigation link highlighting
    $(window).on('scroll', function() {
        var scrollPos = $(document).scrollTop();
        var headerHeight = $('header').outerHeight();

        $('section').each(function() {
            var currLink = $(this);
            var refElement = $('nav ul li a[href="#' + currLink.attr("id") + '"]');

            // Add a small buffer to the top position for better active state switching
            if (currLink.offset().top - headerHeight - 50 <= scrollPos &&
                currLink.offset().top + currLink.outerHeight() - headerHeight > scrollPos) {
                refElement.addClass('active');
            } else {
                refElement.removeClass('active');
            }
        });
    }).scroll(); // Trigger on page load

    // // --- Game Modals Functionality ---
    // $('.open-game').on('click', function() {
    //     var gameId = $(this).data('game');
    //     $('#' + gameId).addClass('active'); // Use direct ID for modals
    //     $('body').css('overflow', 'hidden'); // Prevent scrolling
    // });

    $('.open-game').on('click', function() {
    var gameId = $(this).data('game');
    $('#' + gameId).addClass('active'); // Use direct ID for modals
    $('body').css('overflow', 'hidden'); // Prevent scrolling

    // ADD THIS:
    if (gameId === 'maze-game') {
        resetMaze(); // Initialize the maze when its modal is opened
    }
    // ADD THIS:
    if (gameId === 'guess-number') {
        startGuessNumberGame(); // Initialize the guess number game too
    }
});

    $('.close-game').on('click', function() {
        $(this).closest('.game-modal').removeClass('active');
        $('body').css('overflow', 'auto'); // Re-enable scrolling

        // Reset specific games when closing
        if ($(this).closest('.game-modal').attr('id') === 'tictactoe-game') {
            resetTicTacToe();
            $('#tictactoe-game-area').hide();
            $('#tictactoe-start-screen').show();
            $('#player-name').val('');
        }
        if ($(this).closest('.game-modal').attr('id') === 'maze-game') {
            resetMaze();
        }
        if ($(this).closest('.game-modal').attr('id') === 'guess-number-game') {
            resetGuessNumberGame();
        }
    });

    // Close modal if clicking outside content
    $('.game-modal').on('click', function(e) {
        if ($(e.target).hasClass('game-modal')) {
            $(this).removeClass('active');
            $('body').css('overflow', 'auto');

            if ($(this).attr('id') === 'tictactoe-game') {
                resetTicTacToe();
                $('#tictactoe-game-area').hide();
                $('#tictactoe-start-screen').show();
                $('#player-name').val('');
            }
            if ($(this).attr('id') === 'maze-game') {
                resetMaze();
            }
            if ($(this).attr('id') === 'guess-number-game') {
                resetGuessNumberGame();
            }
        }
    });


    // --- Tic-Tac-Toe Game Logic ---
    let ticTacToeBoard = ['', '', '', '', '', '', '', '', ''];
    let ticTacToeCurrentPlayer = 'X';
    let ticTacToeGameActive = true;
    let playerName = "Player"; // Default name

    const ticTacToeWinningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    const ticTacToeStatusDisplay = $('#game-status');
    const ticTacToeCells = $('#board .cell');

    $('#start-tictactoe').on('click', function() {
        const nameInput = $('#player-name').val().trim();
        if (nameInput) {
            playerName = nameInput;
        } else {
            playerName = "Player"; // Fallback if no name entered
        }
        $('#tictactoe-start-screen').hide();
        $('#tictactoe-game-area').show();
        resetTicTacToe(); // Start a new game with the name
        ticTacToeStatusDisplay.text(`${playerName}'s Turn (X)`);
    });


    function handleTicTacToeResultValidation() {
        let roundWon = false;
        for (let i = 0; i < ticTacToeWinningConditions.length; i++) {
            const winCondition = ticTacToeWinningConditions[i];
            let a = ticTacToeBoard[winCondition[0]];
            let b = ticTacToeBoard[winCondition[1]];
            let c = ticTacToeBoard[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            let winnerName = (ticTacToeCurrentPlayer === 'X') ? playerName : 'AI'; // Assuming O is AI for now
            ticTacToeStatusDisplay.text(`${winnerName} has won!`);
            ticTacToeGameActive = false;
            jsConfetti.addConfetti({
                emojis: ['🎉', '✨', '🌟', '🥳'],
                confettiNumber: 80,
            });
            return;
        }

        if (!ticTacToeBoard.includes('')) {
            ticTacToeStatusDisplay.text('Game ended in a draw!');
            ticTacToeGameActive = false;
            return;
        }

        handleTicTacToePlayerChange();
    }

    function handleTicTacToePlayerChange() {
        ticTacToeCurrentPlayer = ticTacToeCurrentPlayer === 'X' ? 'O' : 'X';
        const displayPlayerName = (ticTacToeCurrentPlayer === 'X') ? playerName : 'AI';
        ticTacToeStatusDisplay.text(`${displayPlayerName}'s Turn (${ticTacToeCurrentPlayer})`);
    }

    function handleTicTacToeCellClick(clickedCellEvent) {
        const clickedCell = $(clickedCellEvent.target);
        const clickedCellIndex = parseInt(clickedCell.attr('data-cell-index'));

        if (ticTacToeBoard[clickedCellIndex] !== '' || !ticTacToeGameActive) {
            return;
        }

        ticTacToeBoard[clickedCellIndex] = ticTacToeCurrentPlayer;
        clickedCell.text(ticTacToeCurrentPlayer).addClass(ticTacToeCurrentPlayer.toLowerCase());
        handleTicTacToeResultValidation();
    }

    function resetTicTacToe() {
        ticTacToeBoard = ['', '', '', '', '', '', '', '', ''];
        ticTacToeGameActive = true;
        ticTacToeCurrentPlayer = 'X';
        ticTacToeStatusDisplay.text(`${playerName}'s Turn (X)`); // Reset with current player name
        ticTacToeCells.each(function() {
            $(this).text('').removeClass('x o');
        });
    }

    ticTacToeCells.on('click', handleTicTacToeCellClick);
    $('#reset-game').on('click', resetTicTacToe);


    // --- Random Color Generator Logic ---
    $('#generate-color').on('click', function() {
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        $('#color-box').css('background-color', randomColor);
        $('#color-hex').text(randomColor.toUpperCase());

        // Update the background gradient for the "crazy" effect
        const complimentaryColor = getComplimentaryColor(randomColor);
        const triadic1 = getTriadicColor(randomColor, 0);
        const triadic2 = getTriadicColor(randomColor, 1);

        $('#color-box-wrapper').css('background', `linear-gradient(45deg, ${randomColor}, ${complimentaryColor}, ${triadic1}, ${triadic2})`);

        // Add a subtle pop animation
        $('#color-box').css('transform', 'scale(1.05)');
        setTimeout(() => $('#color-box').css('transform', 'scale(1)'), 200);
    });

    // Helper to get a complimentary color (simple inversion)
    function getComplimentaryColor(hex) {
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        const compR = (255 - r).toString(16).padStart(2, '0');
        const compG = (255 - g).toString(16).padStart(2, '0');
        const compB = (255 - b).toString(16).padStart(2, '0');
        return `#${compR}${compG}${compB}`;
    }

    // Helper to get triadic colors
    function getTriadicColor(hex, offset) {
        let r = parseInt(hex.substring(1, 3), 16) / 255;
        let g = parseInt(hex.substring(3, 5), 16) / 255;
        let b = parseInt(hex.substring(5, 7), 16) / 255;

        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        // Rotate hue for triadic
        h = (h + (1/3) * (offset + 1)) % 1; // +1/3 for first triadic, +2/3 for second

        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        let R = Math.round(hue2rgb(p, q, h + 1/3) * 255).toString(16).padStart(2, '0');
        let G = Math.round(hue2rgb(p, q, h) * 255).toString(16).padStart(2, '0');
        let B = Math.round(hue2rgb(p, q, h - 1/3) * 255).toString(16).padStart(2, '0');

        return `#${R}${G}${B}`;
    }


    $('#generate-color').trigger('click'); // Set initial color

    // --- NEW: Rabbit Maze Adventure Game Logic ---
    const mazeBoardDiv = $('#maze-board');
    const mazeStatusDisplay = $('#maze-status');
    let maze = [];
    let playerPos = { row: 0, col: 0 };
    let carrotPos = { row: 0, col: 0 };
    const MAZE_SIZE = 10; // 10x10 maze

    function generateMaze(size) {
        // Simple random maze generation (not perfect, but functional)
        const newMaze = Array(size).fill(0).map(() => Array(size).fill(0)); // 0 = path, 1 = wall

        // Fill with some random walls
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (Math.random() < 0.25) { // 25% chance of being a wall
                    newMaze[i][j] = 1;
                }
            }
        }

        // Ensure start (0,0) and end (size-1, size-1) are paths
        newMaze[0][0] = 0;
        newMaze[size - 1][size - 1] = 0;

        // Reset player and carrot positions
        playerPos = { row: 0, col: 0 };
        carrotPos = { row: size - 1, col: size - 1 };

        maze = newMaze;
        renderMaze();
        mazeStatusDisplay.text("Guide the rabbit!");
    }

    function renderMaze() {
        mazeBoardDiv.empty();
        mazeBoardDiv.css({
            'grid-template-columns': `repeat(${MAZE_SIZE}, 1fr)`,
            'grid-template-rows': `repeat(${MAZE_SIZE}, 1fr)`
        });

        for (let r = 0; r < MAZE_SIZE; r++) {
            for (let c = 0; c < MAZE_SIZE; c++) {
                const cell = $('<div>').addClass('maze-cell').attr('data-row', r).attr('data-col', c);

                if (maze[r][c] === 1) {
                    cell.addClass('wall');
                } else {
                    // Start cell icon (optional, could just be empty or a subtle marker)
                    // if (r === 0 && c === 0) {
                    //     cell.addClass('start');
                    // }
                    if (r === playerPos.row && c === playerPos.col) {
                        cell.addClass('player').html('<i class="fas fa-rabbit"></i>');
                    } else if (r === carrotPos.row && c === carrotPos.col) {
                        cell.html('<i class="fas fa-carrot"></i>');
                    }
                }
                mazeBoardDiv.append(cell);
            }
        }
    }


    function movePlayer(dRow, dCol) {
        const newRow = playerPos.row + dRow;
        const newCol = playerPos.col + dCol;

        // Check boundary conditions
        if (newRow >= 0 && newRow < MAZE_SIZE && newCol >= 0 && newCol < MAZE_SIZE) {
            // Check if it's a wall
            if (maze[newRow][newCol] !== 1) {
                playerPos.row = newRow;
                playerPos.col = newCol;
                renderMaze();
                checkMazeWin();
            } else {
                mazeStatusDisplay.text("Ouch! That's a wall. Try another way.");
            }
        } else {
            mazeStatusDisplay.text("Can't go that way!");
        }
    }

    function checkMazeWin() {
        if (playerPos.row === carrotPos.row && playerPos.col === carrotPos.col) {
            mazeStatusDisplay.text("You found the carrot! Yum! 🎉");
            jsConfetti.addConfetti({
                emojis: ['🥕', '🥕', '🐰', '🌟'], // Carrot & Rabbit confetti!
                confettiNumber: 70,
            });
            // Disable controls until new game
            $('#maze-controls button').prop('disabled', true);
        }
    }

    function resetMaze() {
        generateMaze(MAZE_SIZE);
        $('#maze-controls button').prop('disabled', false);
    }

    // Maze controls
    $('#maze-up').on('click', () => movePlayer(-1, 0));
    $('#maze-down').on('click', () => movePlayer(1, 0));
    $('#maze-left').on('click', () => movePlayer(0, -1));
    $('#maze-right').on('click', () => movePlayer(0, 1));
    $('#reset-maze').on('click', resetMaze);

    // // Initial maze generation when modal is opened
    // $('#maze-game').on('click', function(e) {
    //     // Only reset if the game modal itself is clicked to open, not internal elements
    //     if ($(e.target).hasClass('open-game')) {
    //         resetMaze();
    //     }
    // });

    // --- NEW: Guess the Number Game Logic ---
    let secretNumber = 0;
    let attempts = 0;
    let guessGameActive = true;
    const guessFeedback = $('#guess-feedback');
    const guessAttemptsDisplay = $('#guess-attempts');
    const guessInput = $('#guess-input');
    const submitGuessButton = $('#submit-guess');
    const resetGuessButton = $('#reset-guess-game');

    function startGuessNumberGame() {
        secretNumber = Math.floor(Math.random() * 100) + 1; // Number between 1 and 100
        attempts = 0;
        guessGameActive = true;
        guessFeedback.text("Make your first guess!");
        guessAttemptsDisplay.text("Attempts: 0");
        guessInput.val('');
        guessInput.prop('disabled', false);
        submitGuessButton.prop('disabled', false);
        resetGuessButton.hide();
        console.log("Secret Number (for testing):", secretNumber); // Remove for production
    }

    function checkGuess() {
        if (!guessGameActive) return;

        const guess = parseInt(guessInput.val());

        if (isNaN(guess) || guess < 1 || guess > 100) {
            guessFeedback.text("Please enter a valid number between 1 and 100.");
            return;
        }

        attempts++;
        guessAttemptsDisplay.text(`Attempts: ${attempts}`);

        if (guess === secretNumber) {
            guessFeedback.text(`Congratulations! You guessed the number ${secretNumber} in ${attempts} attempts! 🎉`);
            jsConfetti.addConfetti({
                emojis: ['💯', '✅', '🥳', '🌟'],
                confettiNumber: 60,
            });
            guessGameActive = false;
            guessInput.prop('disabled', true);
            submitGuessButton.prop('disabled', true);
            resetGuessButton.show();
        } else if (guess < secretNumber) {
            guessFeedback.text("Too low! Try a higher number.");
        } else {
            guessFeedback.text("Too high! Try a lower number.");
        }
    }

    function resetGuessNumberGame() {
        startGuessNumberGame();
    }

    submitGuessButton.on('click', checkGuess);
    guessInput.on('keypress', function(e) {
        if (e.which === 13) { // Enter key
            checkGuess();
        }
    });
    resetGuessButton.on('click', resetGuessNumberGame);

    // Initialize the game when the modal is opened for the first time
    $('#guess-number-game').on('click', function(e) {
        // Only start if the game modal itself is clicked to open, not internal elements
        if ($(e.target).hasClass('open-game')) {
            startGuessNumberGame();
        }
    });


    // --- Basic Scroll-triggered animation for sections ---
    // (Still recommending Intersection Observer API or AOS for better performance/control in production)
    function checkAnimations() {
        // Elements that should animate in
        $('.offer-card, .why-us-card, .game-card').each(function() {
            var element = $(this);
            // Check if element has already been animated (to prevent re-animating on scroll up/down)
            if (!element.hasClass('animated')) {
                var elementTop = element.offset().top;
                var viewportBottom = $(window).scrollTop() + $(window).height();
                // When 80% of the element is in view
                if (elementTop < viewportBottom - (element.outerHeight() * 0.2)) {
                    element.css({
                        'opacity': 1,
                        'transform': 'translateY(0)'
                    }).addClass('animated'); // Add class to mark as animated
                }
            }
        });

        // Hero image animation trigger (once)
        var heroImage = $('.hero-image img');
        if (heroImage.length && !heroImage.hasClass('animated')) {
            var heroImageTop = heroImage.offset().top;
            var heroImageViewportBottom = $(window).scrollTop() + $(window).height();
            if (heroImageTop < heroImageViewportBottom - 50) {
                 heroImage.css({
                    'opacity': 1,
                    'transform': 'scale(1)'
                }).addClass('animated');
            }
        }
    }

    $(window).on('scroll resize', checkAnimations);
    checkAnimations(); // Trigger on load

}); // End of document.ready