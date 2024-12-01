// 📚 SentenceJoiner: Because splitting sentences is like recess - fun and a bit chaotic!
class SentenceJoiner {
    constructor() {
        // 📝 Class roster - keeping track of all our sentence students
        this.sentences = [];
        this.splitSentences = [];
        this.matchedPairs = new Set();
        this.selectedHalf = null;
        this.sentenceCount = 1;

        // 🎯 Taking attendance - getting all our DOM elements in order
        this.sentenceList = document.querySelector('.sentence-list');
        this.addSentenceBtn = document.getElementById('addSentenceBtn');
        this.splitBtn = document.getElementById('splitBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.leftHalves = document.querySelector('.left-halves');
        this.rightHalves = document.querySelector('.right-halves');
        this.completedSentences = document.querySelector('.completed-sentences');

        // 🔔 Ring the bell - time to start class!
        this.initializeEventListeners();
    }

    // 👂 Like a teacher with eyes in the back of their head - we catch all events
    initializeEventListeners() {
        // ➕ The "please let me add one more student to the class" button
        this.addSentenceBtn.addEventListener('click', () => this.addSentenceInput());

        // 🎮 The "let the games begin" and "oops, let's start over" buttons
        this.splitBtn.addEventListener('click', () => this.handleSplitButtonClick());
        this.resetBtn.addEventListener('click', () => this.resetGame());

        // 📝 Getting the first student ready for class
        this.addInputListener(this.sentenceList.querySelector('input'));
    }

    // 🆕 Like adding a new student mid-semester
    addSentenceInput() {
        this.sentenceCount++;
        const div = document.createElement('div');
        div.className = 'sentence-input';
        div.innerHTML = `
            <input type="text" placeholder="Enter sentence ${this.sentenceCount}" maxlength="100">
            <button class="remove-btn" title="Remove sentence">✕</button>
            <span class="split-preview"></span>
        `;

        const input = div.querySelector('input');
        const removeBtn = div.querySelector('.remove-btn');

        // 🚪 The "transfer to another school" button
        removeBtn.addEventListener('click', () => {
            div.remove();
            this.updatePlaceholders();
        });

        this.addInputListener(input);
        this.sentenceList.appendChild(div);
    }

    // 👀 Watching students like a hawk during a pop quiz
    addInputListener(input) {
        input.addEventListener('input', () => {
            const preview = input.parentElement.querySelector('.split-preview');
            if (input.value.trim()) {
                const { left, right } = this.findSplitPoint(input.value.trim());
                preview.textContent = `Split preview: "${left}" | "${right}"`;
            } else {
                preview.textContent = '';
            }
        });
    }

    // 📋 Updating the seating chart after someone leaves
    updatePlaceholders() {
        const inputs = this.sentenceList.querySelectorAll('input');
        inputs.forEach((input, index) => {
            input.placeholder = `Enter sentence ${index + 1}`;
        });
        this.sentenceCount = inputs.length;
    }

    // ✂️ Like splitting the class into groups, but with words!
    findSplitPoint(sentence) {
        const words = sentence.split(' ');
        let totalLength = 0;
        const halfLength = sentence.length / 2;

        // 📏 Measuring each word like grading papers
        for (let i = 0; i < words.length; i++) {
            totalLength += words[i].length + 1; // +1 for the space
            if (totalLength >= halfLength) {
                const firstHalf = words.slice(0, i + 1).join(' ');
                const secondHalf = words.slice(i + 1).join(' ');
                
                // 📊 Making sure both halves are fair - like splitting candy
                if (secondHalf.length < firstHalf.length * 0.3) {
                    return {
                        left: words.slice(0, i).join(' '),
                        right: words.slice(i).join(' ')
                    };
                }
                return {
                    left: firstHalf,
                    right: secondHalf
                };
            }
        }
        
        // 🤏 For those tiny sentences that are like one-word answers
        return {
            left: words[0],
            right: words.slice(1).join(' ')
        };
    }

    // 🎭 Time to put on the show - splitting sentences like a drama performance
    handleSplitButtonClick() {
        const inputs = this.sentenceList.querySelectorAll('input');
        this.sentences = Array.from(inputs)
            .map(input => input.value.trim())
            .filter(sentence => sentence.length > 0);

        if (this.sentences.length === 0) {
            alert('Please enter at least one sentence!');
            return;
        }

        this.splitSentences = this.sentences.map(sentence => {
            const { left, right } = this.findSplitPoint(sentence);
            return {
                left: left,
                right: right,
                full: sentence
            };
        });

        this.displaySplitSentences();
        this.enableDragAndDrop();
        this.toggleInputSection(false);
    }

    // 🎲 Shuffling sentences like a deck of vocabulary cards
    displaySplitSentences() {
        // 🎯 Creating arrays of indices like assigning random seats
        const indices = Array.from({ length: this.splitSentences.length }, (_, i) => i);
        const leftIndices = this.shuffleArray([...indices]);
        const rightIndices = this.shuffleArray([...indices]);

        // 🎭 Making sure no matching pairs are sitting together
        for (let i = 0; i < leftIndices.length; i++) {
            if (leftIndices[i] === rightIndices[i]) {
                const swapPos = (i + 1) % rightIndices.length;
                [rightIndices[i], rightIndices[swapPos]] = [rightIndices[swapPos], rightIndices[i]];
            }
        }

        // 📝 Writing out the left side of the worksheet
        this.leftHalves.innerHTML = leftIndices
            .map(index => `
                <div class="sentence-half" draggable="true" data-index="${index}" data-side="left">
                    ${this.splitSentences[index].left}
                </div>
            `).join('');

        // 📝 And the right side - like a matching exercise
        this.rightHalves.innerHTML = rightIndices
            .map(index => `
                <div class="sentence-half" draggable="true" data-index="${index}" data-side="right">
                    ${this.splitSentences[index].right}
                </div>
            `).join('');
    }

    // 🔄 The good old Fisher-Yates shuffle - like mixing up test questions
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // 🎮 Setting up the game like preparing a class activity
    enableDragAndDrop() {
        const halves = document.querySelectorAll('.sentence-half');

        halves.forEach(half => {
            half.addEventListener('dragstart', (e) => {
                half.classList.add('dragging');
                this.selectedHalf = half;
            });

            half.addEventListener('dragend', () => {
                half.classList.remove('dragging');
            });

            half.addEventListener('click', () => this.handleHalfClick(half));
        });
    }

    // 🤝 When two halves meet - like pairing up study buddies
    handleHalfClick(half) {
        if (this.selectedHalf === null) {
            this.selectedHalf = half;
            half.classList.add('selected');
        } else {
            if (this.selectedHalf !== half) {
                this.checkMatch(this.selectedHalf, half);
            }
            this.selectedHalf.classList.remove('selected');
            this.selectedHalf = null;
        }
    }

    // ✅ Checking answers like grading a test
    checkMatch(firstHalf, secondHalf) {
        const firstIndex = parseInt(firstHalf.dataset.index);
        const secondIndex = parseInt(secondHalf.dataset.index);
        const firstSide = firstHalf.dataset.side;
        const secondSide = secondHalf.dataset.side;

        if (firstSide === secondSide) return;

        const matchKey = firstIndex < secondIndex ? 
            `${firstIndex}-${secondIndex}` : 
            `${secondIndex}-${firstIndex}`;

        if (!this.matchedPairs.has(matchKey)) {
            const sentence = this.splitSentences[firstIndex];
            const isCorrectMatch = (firstSide === 'left' && secondIndex === firstIndex) ||
                                 (firstSide === 'right' && secondIndex === firstIndex);

            if (isCorrectMatch) {
                this.matchedPairs.add(matchKey);
                firstHalf.classList.add('matched');
                secondHalf.classList.add('matched');
                this.addCompletedSentence(sentence.full);
                this.checkGameCompletion();
            }
        }
    }

    // 🌟 Displaying completed sentences like putting gold stars on good work
    addCompletedSentence(sentence) {
        const div = document.createElement('div');
        div.className = 'completed-sentence';
        div.textContent = sentence;
        this.completedSentences.appendChild(div);
    }

    // 🎉 Victory check - like seeing if everyone passed the test
    checkGameCompletion() {
        if (this.matchedPairs.size === this.splitSentences.length) {
            setTimeout(() => {
                alert('Congratulations! You\'ve matched all the sentences! 🎉');
            }, 500);
        }
    }

    // 🔒 Locking down the inputs like after the bell rings
    toggleInputSection(enabled) {
        const inputs = this.sentenceList.querySelectorAll('input');
        inputs.forEach(input => input.disabled = !enabled);
        this.splitBtn.style.display = enabled ? 'block' : 'none';
    }

    // 🔄 Reset everything like starting a new semester
    resetGame() {
        // 🧹 Clean the whiteboard
        this.sentenceList.innerHTML = `
            <div class="sentence-input">
                <input type="text" placeholder="Enter sentence 1" maxlength="100">
                <span class="split-preview"></span>
            </div>
        `;
        this.sentenceCount = 1;
        
        // 📝 Get the first page ready
        this.addInputListener(this.sentenceList.querySelector('input'));

        // 🆕 New game, new rules
        this.sentences = [];
        this.splitSentences = [];
        this.matchedPairs.clear();
        this.selectedHalf = null;

        // 🧼 Clean up the game board
        this.leftHalves.innerHTML = '';
        this.rightHalves.innerHTML = '';
        this.completedSentences.innerHTML = '';

        // 🔓 Open the gates
        this.toggleInputSection(true);
    }
}

// 🎓 When the school day starts, get everything ready!
document.addEventListener('DOMContentLoaded', () => {
    new SentenceJoiner();
});
