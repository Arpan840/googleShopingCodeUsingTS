"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guesser = void 0;
class Guesser {
    constructor() {
        this.word = '';
        this.correctGuesses = 0;
    }
    setWord(word) {
        this.word = word;
    }
    guessWord(word) {
        let correct = word.toLowerCase() === this.word.toLowerCase();
        if (correct)
            this.correctGuesses++;
        return correct;
    }
    getNumberCorrectGuesses() {
        return this.correctGuesses;
    }
}
exports.Guesser = Guesser;
