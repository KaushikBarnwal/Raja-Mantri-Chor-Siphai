document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            //seeing that code is running or not
            console.log("running");
            // Reset all cards
            cards.forEach(c => {
                c.classList.remove('center-bottom', 'left-center', 'right-center', 'up-center');
            });
            // Add the appropriate classes based on the clicked card
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
        });
    });
});
