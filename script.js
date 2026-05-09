document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    const POINTS_CORRECT = { "Raja": 1000, "Mantri": 800, "Sipahi": 500, "Chor": 0 };
    const POINTS_WRONG  = { "Raja": 1000, "Mantri": 800, "Sipahi": 0,   "Chor": 500 };

    // ─── State ───
    let gamePhase = 'picking'; // picking | roleReveal | guessing | result
    let roleMap = {};          // cardId -> role
    let playerMap = {};        // cardId -> 'USER' | 'BOT-1' | 'BOT-2' | 'BOT-3'
    let roundNumber = 0;
    let totalScores = { 'BOT-1': 0, 'BOT-2': 0, 'BOT-3': 0, 'USER': 0 };

    // ─── Helpers ───
    function addingWaterMark(card, text) {
        let wm = card.querySelector('.watermark');
        if (!wm) {
            wm = document.createElement('div');
            wm.className = 'watermark';
            card.appendChild(wm);
        }
        wm.textContent = text;
    }

    function revealCard(card) {
        card.querySelector('img').style.display = 'none';
        const role = card.querySelector('.role');
        role.style.display = 'block';
        card.classList.add('card-revealing');
    }

    function hideCard(card) {
        card.querySelector('img').style.display = 'block';
        card.querySelector('.role').style.display = 'none';
        card.classList.remove('card-revealing');
    }

    function findCardByRole(roleName) {
        for (const [id, role] of Object.entries(roleMap)) {
            if (role === roleName) return document.getElementById(id);
        }
        return null;
    }

    function getUserCard() {
        return document.querySelector('.center-bottom');
    }

    function getBotCards() {
        return [
            document.querySelector('.left-center'),
            document.querySelector('.up-center'),
            document.querySelector('.right-center')
        ].filter(Boolean);
    }

    // ─── Role Assignment (all hidden) ───
    function setKirdaar() {
        const roles = Object.keys(POINTS_CORRECT);
        for (let i = roles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [roles[i], roles[j]] = [roles[j], roles[i]];
        }
        const cardArr = Array.from(cards);
        cardArr.forEach((c, i) => {
            c.querySelector('.role').textContent = roles[i];
            c.querySelector('.role').style.display = 'none';
            c.querySelector('img').style.display = 'block';
            roleMap[c.id] = roles[i];
        });
    }

    // ─── Build Player Map ───
    function buildPlayerMap() {
        playerMap = {};
        const center = document.querySelector('.center-bottom');
        const left = document.querySelector('.left-center');
        const up = document.querySelector('.up-center');
        const right = document.querySelector('.right-center');
        if (center) playerMap[center.id] = 'USER';
        if (left) playerMap[left.id] = 'BOT-1';
        if (up) playerMap[up.id] = 'BOT-2';
        if (right) playerMap[right.id] = 'BOT-3';
    }

    // ─── Card Pick Handler ───
    function handleCardPick(card) {
        if (gamePhase !== 'picking') return;
        if (card.classList.contains('unclick')) return;

        gamePhase = 'rearranging';

        // Reset positions
        cards.forEach(c => {
            c.classList.remove('center-bottom', 'left-center', 'right-center', 'up-center', 'clickable');
            addingWaterMark(c, '');
        });

        // Rearrange based on which card was clicked
        if (card.id === 'left') {
            card.classList.add('center-bottom');
            document.getElementById('right').classList.add('right-center');
            document.getElementById('up').classList.add('up-center');
            document.getElementById('down').classList.add('left-center');
        } else if (card.id === 'right') {
            card.classList.add('center-bottom');
            document.getElementById('left').classList.add('left-center');
            document.getElementById('up').classList.add('up-center');
            document.getElementById('down').classList.add('right-center');
        } else if (card.id === 'up') {
            card.classList.add('center-bottom');
            document.getElementById('left').classList.add('left-center');
            document.getElementById('right').classList.add('right-center');
            document.getElementById('down').classList.add('up-center');
        } else if (card.id === 'down') {
            card.classList.add('center-bottom');
            document.getElementById('left').classList.add('left-center');
            document.getElementById('right').classList.add('right-center');
            document.getElementById('up').classList.add('up-center');
        }

        // Lock all cards
        cards.forEach(c => c.classList.add('unclick'));

        // Assign roles (all hidden)
        setKirdaar();
        buildPlayerMap();

        // Add watermarks
        setTimeout(() => {
            addingWaterMark(document.querySelector('.center-bottom'), 'USER');
            addingWaterMark(document.querySelector('.left-center'), 'BOT-1');
            addingWaterMark(document.querySelector('.up-center'), 'BOT-2');
            addingWaterMark(document.querySelector('.right-center'), 'BOT-3');
        }, 600);

        // After cards settle, let user click their card to reveal their role
        setTimeout(() => {
            gamePhase = 'roleReveal';
            const userCard = getUserCard();
            userCard.classList.remove('unclick');
            userCard.addEventListener('click', handleUserReveal, { once: true });
        }, 900);
    }

    // ─── Announcement Icon on Raja Card ───
    function showAnnouncementIcon(card) {
        let icon = card.querySelector('.announcement-icon');
        if (!icon) {
            icon = document.createElement('div');
            icon.className = 'announcement-icon';
            icon.textContent = '📢';
            card.appendChild(icon);
        }
        icon.style.display = 'flex';
    }

    function removeAnnouncementIcon() {
        document.querySelectorAll('.announcement-icon').forEach(el => el.style.display = 'none');
    }

    // ─── Game Message ───
    function showGameMessage(text) {
        const el = document.getElementById('gameMessage');
        document.getElementById('gameMessageText').textContent = text;
        document.getElementById('gameCountdown').classList.add('hidden');
        el.classList.remove('hidden');
    }

    function hideGameMessage() {
        document.getElementById('gameMessage').classList.add('hidden');
    }

    // ─── User Reveals Their Role (cinematic sequence) ───
    function handleUserReveal() {
        const userCard = getUserCard();
        revealCard(userCard);
        userCard.classList.add('unclick');

        // Step 1: Reveal Raja + announcement icon
        setTimeout(() => {
            const rajaCard = findCardByRole('Raja');
            revealCard(rajaCard);
            showAnnouncementIcon(rajaCard);

            // Step 2: Show "Sipahi Sipahi, Chor ko pakdo!"
            setTimeout(() => {
                showGameMessage('Sipahi Sipahi,\nChor ko pakdo!');

                // Step 3: Reveal Sipahi, then start guessing
                setTimeout(() => {
                    const userRole = roleMap[userCard.id];

                    if (userRole === 'Sipahi') {
                        // User IS the Sipahi — they choose
                        hideGameMessage();
                        removeAnnouncementIcon();
                        userGuessing();
                    } else {
                        // Reveal bot Sipahi card
                        const sipahiCard = findCardByRole('Sipahi');
                        revealCard(sipahiCard);

                        // Start bouncing selection after a beat
                        setTimeout(() => {
                            botGuessing();
                        }, 600);
                    }
                }, 1200);
            }, 700);
        }, 700);
    }

    // ─── User is Sipahi → User picks Chor ───
    function userGuessing() {
        gamePhase = 'guessing';
        const botCards = getBotCards();
        const candidates = botCards.filter(c => roleMap[c.id] !== 'Raja');

        candidates.forEach(c => {
            c.classList.add('selectable');
            c.classList.remove('unclick');
        });

        const guessHandlers = {};
        candidates.forEach(c => {
            const handler = () => {
                candidates.forEach(cc => {
                    cc.classList.remove('selectable');
                    cc.classList.add('unclick');
                    cc.removeEventListener('click', guessHandlers[cc.id]);
                });

                const isCorrect = roleMap[c.id] === 'Chor';
                revealCard(c);

                setTimeout(() => {
                    revealAllCards();
                    showResult(isCorrect, playerMap[getUserCard().id], playerMap[c.id]);
                }, 800);
            };
            guessHandlers[c.id] = handler;
            c.addEventListener('click', handler, { once: true });
        });
    }

    // ─── Bot is Sipahi → Bouncing selection animation ───
    function botGuessing() {
        gamePhase = 'guessing';
        const sipahiCard = findCardByRole('Sipahi');
        const allCardsArr = Array.from(cards);

        // Candidates: not Raja, not Sipahi (= Mantri & Chor)
        const candidates = allCardsArr.filter(c => {
            const role = roleMap[c.id];
            return role !== 'Raja' && role !== 'Sipahi';
        });

        // Pre-determine the bot's choice
        const chosen = candidates[Math.floor(Math.random() * candidates.length)];
        const isCorrect = roleMap[chosen.id] === 'Chor';

        // Show countdown inside the game message
        const countdownEl = document.getElementById('gameCountdown');
        countdownEl.textContent = '3';
        countdownEl.classList.remove('hidden');

        // Update countdown numbers
        setTimeout(() => countdownEl.textContent = '2', 1000);
        setTimeout(() => countdownEl.textContent = '1', 2000);

        // Start bouncing highlight (slot machine effect)
        bouncingSelection(candidates, chosen, () => {
            // Bouncing done — chosen card is highlighted
            chosen.classList.add('bot-selected');
            hideGameMessage();
            removeAnnouncementIcon();

            // Reveal all and show result
            setTimeout(() => {
                revealAllCards();
                const sipahiPlayer = playerMap[sipahiCard.id];
                const chosenPlayer = playerMap[chosen.id];
                showResult(isCorrect, sipahiPlayer, chosenPlayer);
            }, 800);
        });
    }

    // ─── Bouncing Selection (slot machine that slows down) ───
    function bouncingSelection(candidates, chosenCard, callback) {
        const totalBounces = 14;
        const delays = [];
        for (let i = 0; i < totalBounces; i++) {
            const t = i / (totalBounces - 1);
            delays.push(Math.round(80 + 350 * t * t)); // 80ms → 430ms (easing)
        }

        // Ensure last bounce lands on the chosen card
        const chosenIndex = candidates.indexOf(chosenCard);
        const startIndex = (chosenIndex + 1) % 2;

        let bounce = 0;
        function nextBounce() {
            if (bounce >= totalBounces) {
                callback();
                return;
            }
            candidates.forEach(c => c.classList.remove('candidate-highlight'));
            const idx = (startIndex + bounce) % 2;
            candidates[idx].classList.add('candidate-highlight');
            bounce++;
            setTimeout(nextBounce, delays[bounce - 1]);
        }
        nextBounce();
    }

    // ─── Reveal All Cards ───
    function revealAllCards() {
        cards.forEach(c => revealCard(c));
    }

    // ─── Show Result Box ───
    function showResult(isCorrect, sipahiPlayerName, guessedPlayerName) {
        gamePhase = 'result';
        const points = isCorrect ? POINTS_CORRECT : POINTS_WRONG;

        // Build per-player scores for this round
        const roundScores = {};
        for (const [cardId, player] of Object.entries(playerMap)) {
            const role = roleMap[cardId];
            roundScores[player] = points[role];
        }

        // Show points badges on each card
        cards.forEach(c => {
            const player = playerMap[c.id];
            const role = roleMap[c.id];
            const badge = c.querySelector('.points-badge');
            badge.textContent = points[role];
            badge.classList.add('show');
        });

        // Update result box
        const titleEl = document.getElementById('resultTitle');
        const verdictEl = document.getElementById('resultVerdict');
        const bodyEl = document.getElementById('resultBody');

        titleEl.textContent = `${sipahiPlayerName} (Sipahi) guessed ${guessedPlayerName} as Chor`;

        if (isCorrect) {
            verdictEl.textContent = '✅ CORRECT!';
            verdictEl.className = 'result-verdict correct';
        } else {
            verdictEl.textContent = '❌ WRONG!';
            verdictEl.className = 'result-verdict wrong';
        }

        // Build result table rows
        bodyEl.innerHTML = '';
        const positions = ['left-center', 'up-center', 'right-center', 'center-bottom'];
        const posLabels = { 'left-center': 'BOT-1', 'up-center': 'BOT-2', 'right-center': 'BOT-3', 'center-bottom': 'USER' };
        positions.forEach(pos => {
            const card = document.querySelector('.' + pos);
            if (!card) return;
            const player = playerMap[card.id];
            const role = roleMap[card.id];
            const pt = points[role];

            const tr = document.createElement('tr');
            if (role === 'Sipahi' || role === 'Chor') tr.classList.add('highlight-row');
            tr.innerHTML = `<td>${player}</td><td>${role}</td><td>${pt}</td>`;
            bodyEl.appendChild(tr);
        });

        document.getElementById('resultBox').classList.remove('hidden');

        // Update sidebar
        updateSidebar(roundScores);
    }

    // ─── Update Sidebar ───
    function updateSidebar(roundScores) {
        roundNumber++;
        // Accumulate totals
        for (const player of ['BOT-1', 'BOT-2', 'BOT-3', 'USER']) {
            totalScores[player] += (roundScores[player] || 0);
        }

        // Add round row
        const tbody = document.getElementById('scoreBody');
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${roundNumber}</td>
            <td>${roundScores['BOT-1'] || 0}</td>
            <td>${roundScores['BOT-2'] || 0}</td>
            <td>${roundScores['BOT-3'] || 0}</td>
            <td>${roundScores['USER'] || 0}</td>
        `;
        tbody.appendChild(tr);

        // Update totals
        document.getElementById('totalB1').textContent = totalScores['BOT-1'];
        document.getElementById('totalB2').textContent = totalScores['BOT-2'];
        document.getElementById('totalB3').textContent = totalScores['BOT-3'];
        document.getElementById('totalU').textContent = totalScores['USER'];
    }

    // ─── Next Round ───
    function resetRound() {
        gamePhase = 'picking';
        roleMap = {};
        playerMap = {};

        // Hide overlays
        document.getElementById('resultBox').classList.add('hidden');
        document.getElementById('gameMessage').classList.add('hidden');
        removeAnnouncementIcon();

        // Reset all cards
        cards.forEach(c => {
            c.classList.remove(
                'center-bottom', 'left-center', 'right-center', 'up-center',
                'unclick', 'selectable', 'candidate-highlight', 'bot-selected', 'card-revealing'
            );
            hideCard(c);
            addingWaterMark(c, '');
            const badge = c.querySelector('.points-badge');
            badge.textContent = '';
            badge.classList.remove('show');
        });
    }

    // ─── Event Listeners ───
    cards.forEach(card => {
        card.addEventListener('click', () => handleCardPick(card));
    });

    document.getElementById('nextRound').addEventListener('click', resetRound);
});
