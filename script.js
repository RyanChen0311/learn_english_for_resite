class VocabularyManager {
    constructor() {
        this.words = JSON.parse(localStorage.getItem('vocabulary')) || [];
        this.records = JSON.parse(localStorage.getItem('vocabulary_records')) || {};
        this.initializeElements();
        this.bindEvents();
        this.renderWords();
        this.updateRecordList();
    }

    initializeElements() {
        this.englishInput = document.getElementById('englishWord');
        this.chineseInput = document.getElementById('chineseTranslation');
        this.addButton = document.getElementById('addWord');
        this.wordContainer = document.getElementById('wordContainer');
        this.wordTemplate = document.getElementById('word-template');
        
        // Record management elements
        this.recordNameInput = document.getElementById('recordName');
        this.saveRecordButton = document.getElementById('saveRecord');
        this.recordList = document.getElementById('recordList');
        this.loadRecordButton = document.getElementById('loadRecord');
        this.deleteRecordButton = document.getElementById('deleteRecord');
    }

    bindEvents() {
        this.addButton.addEventListener('click', () => this.addWord());
        this.englishInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addWord();
        });
        this.chineseInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addWord();
        });

        // Record management events
        this.saveRecordButton.addEventListener('click', () => this.saveRecord());
        this.loadRecordButton.addEventListener('click', () => this.loadRecord());
        this.deleteRecordButton.addEventListener('click', () => this.deleteRecord());
    }

    addWord() {
        const english = this.englishInput.value.trim();
        const chinese = this.chineseInput.value.trim();

        if (!english || !chinese) {
            alert('Please enter both English word and Chinese translation');
            return;
        }

        const word = {
            id: Date.now(),
            english,
            chinese,
            spelling: this.getSpelling(english)
        };

        this.words.push(word);
        this.saveWords();
        this.renderWords();
        this.clearInputs();
    }

    getSpelling(word) {
        return word.split('').join(' • ');
    }

    async speakWord(word, chinese) {
        // Cancel any ongoing speech
        speechSynthesis.cancel();

        // Function to create a promise that resolves when speech ends
        const speak = (text, lang = 'en-US') => {
            return new Promise(resolve => {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = lang;
                utterance.onend = resolve;
                speechSynthesis.speak(utterance);
            });
        };

        // First speak the full word
        await speak(word);

        // Add a pause before spelling
        await new Promise(resolve => setTimeout(resolve, 800));

        // Speak each letter
        const letters = word.split('');
        for (const letter of letters) {
            await speak(letter);
            // Add a small pause between letters
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        // Add a pause before Chinese
        await new Promise(resolve => setTimeout(resolve, 800));

        // Speak the Chinese translation
        await speak(chinese, 'zh-CN');
    }

    deleteWord(id) {
        this.words = this.words.filter(word => word.id !== id);
        this.saveWords();
        this.renderWords();
    }

    saveWords() {
        localStorage.setItem('vocabulary', JSON.stringify(this.words));
    }

    clearInputs() {
        this.englishInput.value = '';
        this.chineseInput.value = '';
        this.englishInput.focus();
    }

    renderWords() {
        this.wordContainer.innerHTML = '';
        
        this.words.forEach(word => {
            const wordElement = this.wordTemplate.content.cloneNode(true);
            
            const englishWord = wordElement.querySelector('.english-word');
            const spelling = wordElement.querySelector('.spelling');
            const chineseTranslation = wordElement.querySelector('.chinese-translation');
            const speakBtn = wordElement.querySelector('.speak-btn');
            const deleteBtn = wordElement.querySelector('.delete-btn');
            
            englishWord.textContent = word.english;
            spelling.textContent = word.spelling;
            chineseTranslation.textContent = word.chinese;
            
            speakBtn.addEventListener('click', () => this.speakWord(word.english, word.chinese));
            deleteBtn.addEventListener('click', () => this.deleteWord(word.id));
            
            this.wordContainer.appendChild(wordElement);
        });
    }

    // Record management methods
    saveRecord() {
        const name = this.recordNameInput.value.trim();
        if (!name) {
            alert('Please enter a name for the record');
            return;
        }

        this.records[name] = [...this.words];
        localStorage.setItem('vocabulary_records', JSON.stringify(this.records));
        this.updateRecordList();
        this.recordNameInput.value = '';
        alert('Record saved successfully!');
    }

    loadRecord() {
        const selectedRecord = this.recordList.value;
        if (!selectedRecord) {
            alert('Please select a record to load');
            return;
        }

        this.words = [...this.records[selectedRecord]];
        this.saveWords();
        this.renderWords();
    }

    deleteRecord() {
        const selectedRecord = this.recordList.value;
        if (!selectedRecord) {
            alert('Please select a record to delete');
            return;
        }

        if (confirm(`Are you sure you want to delete the record "${selectedRecord}"?`)) {
            delete this.records[selectedRecord];
            localStorage.setItem('vocabulary_records', JSON.stringify(this.records));
            this.updateRecordList();
            alert('Record deleted successfully!');
        }
    }

    updateRecordList() {
        this.recordList.innerHTML = '<option value="">Select a record</option>';
        Object.keys(this.records).forEach(recordName => {
            const option = document.createElement('option');
            option.value = recordName;
            option.textContent = recordName;
            this.recordList.appendChild(option);
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new VocabularyManager();
}); 