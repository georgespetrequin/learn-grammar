// Array of paragraphs from classic literature
const sampleParagraphs = [
    "Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, 'and what is the use of a book,' thought Alice 'without pictures or conversations?'",
    "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.",
    "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat: it was a hobbit-hole, and that means comfort.",
    "Mr. and Mrs. Dursley, of number four, Privet Drive, were proud to say that they were perfectly normal, thank you very much. They were the last people you'd expect to be involved in anything strange or mysterious, because they just didn't hold with such nonsense.",
    "All children, except one, grow up. They soon know that they will grow up, and the way Wendy knew was this. One day when she was two years old she was playing in a garden, and she plucked another flower and ran with it to her mother."
];

// Function to process text and highlight parts of speech
function processText(text) {
    if (!text) {
        document.getElementById('highlightedText').innerHTML = '';
        resetCounts();
        resetReadabilityStats();
        return;
    }

    const doc = nlp(text);
    let html = text;
    const words = new Map();

    // Function to safely add words to our map
    const addWord = (word, type) => {
        if (word && word.trim()) {
            words.set(word, type);
        }
    };

    // Find contractions first (they take precedence)
    doc.contractions().forEach(match => {
        addWord(match.text(), 'contraction');
    });

    // Find and mark all nouns that aren't already marked
    doc.nouns().forEach(match => {
        const text = match.text();
        if (!words.has(text)) {
            addWord(text, 'noun');
        }
    });

    // Find and mark all verbs
    doc.verbs().forEach(match => {
        const text = match.text();
        if (!words.has(text)) {
            addWord(text, 'verb');
        }
    });

    // Find and mark all adjectives
    doc.adjectives().forEach(match => {
        const text = match.text();
        if (!words.has(text)) {
            addWord(text, 'adjective');
        }
    });

    // Find and mark all adverbs
    doc.adverbs().forEach(match => {
        const text = match.text();
        if (!words.has(text)) {
            addWord(text, 'adverb');
        }
    });

    // Find and mark all pronouns
    doc.pronouns().forEach(match => {
        const text = match.text();
        if (!words.has(text)) {
            addWord(text, 'pronoun');
        }
    });

    // Find and mark all prepositions
    doc.prepositions().forEach(match => {
        const text = match.text();
        if (!words.has(text)) {
            addWord(text, 'preposition');
        }
    });

    // Apply highlights to the text
    const sortedWords = Array.from(words.entries()).sort((a, b) => b[0].length - a[0].length);
    
    const tempElement = document.createElement('div');
    tempElement.textContent = text;
    let processedText = tempElement.innerHTML;

    sortedWords.forEach(([word, type]) => {
        const regex = new RegExp(`\\b${word}\\b`, 'g');
        processedText = processedText.replace(regex, `<span class="${type}">${word}</span>`);
    });

    document.getElementById('highlightedText').innerHTML = processedText;
    updateCounts(words);
    updateReadabilityStats(text);
}

// Function to reset counts
function resetCounts() {
    document.getElementById('nounCount').textContent = 0;
    document.getElementById('verbCount').textContent = 0;
    document.getElementById('adjectiveCount').textContent = 0;
    document.getElementById('adverbCount').textContent = 0;
    document.getElementById('pronounCount').textContent = 0;
    document.getElementById('prepositionCount').textContent = 0;
    document.getElementById('contractionCount').textContent = 0;
}

// Function to reset readability stats
function resetReadabilityStats() {
    document.getElementById('letterCount').textContent = 0;
    document.getElementById('characterCount').textContent = 0;
    document.getElementById('totalWordCount').textContent = 0;
    document.getElementById('sentenceCount').textContent = 0;
    document.getElementById('paragraphCount').textContent = 0;
    document.getElementById('readingTime').textContent = '0';
}

// Function to update counts
function updateCounts(words) {
    const counts = {
        noun: 0,
        verb: 0,
        adjective: 0,
        adverb: 0,
        pronoun: 0,
        preposition: 0,
        contraction: 0
    };

    words.forEach((type) => {
        counts[type]++;
    });

    document.getElementById('nounCount').textContent = counts.noun;
    document.getElementById('verbCount').textContent = counts.verb;
    document.getElementById('adjectiveCount').textContent = counts.adjective;
    document.getElementById('adverbCount').textContent = counts.adverb;
    document.getElementById('pronounCount').textContent = counts.pronoun;
    document.getElementById('prepositionCount').textContent = counts.preposition;
    document.getElementById('contractionCount').textContent = counts.contraction;
}

// Function to update readability stats
function updateReadabilityStats(text) {
    const letters = text.replace(/\s/g, '').length; // Count letters
    const characters = text.length; // Count characters
    const words = text.split(/\s+/).filter(word => word.length > 0).length; // Count words
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length; // Count sentences
    const paragraphs = text.split(/\n+/).filter(paragraph => paragraph.trim().length > 0).length; // Count paragraphs
    const readingTime = Math.ceil(words / 200); // Estimate reading time (200 words per minute)

    document.getElementById('letterCount').textContent = letters;
    document.getElementById('characterCount').textContent = characters;
    document.getElementById('totalWordCount').textContent = words;
    document.getElementById('sentenceCount').textContent = sentences;
    document.getElementById('paragraphCount').textContent = paragraphs;
    document.getElementById('readingTime').textContent = readingTime;
}

// Event listener for text input
document.getElementById('inputText').addEventListener('input', function(e) {
    processText(e.target.value);
});

// Event listener for suggest button
document.getElementById('suggestButton').addEventListener('click', function() {
    const randomIndex = Math.floor(Math.random() * sampleParagraphs.length);
    const textarea = document.getElementById('inputText');
    textarea.value = sampleParagraphs[randomIndex];
    processText(textarea.value);
}); 