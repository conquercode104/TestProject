class TextProcessing {
    private _keyword: String;
    private nonWordBoundaries:Set<String>;
    private keywordsTrie;
    private caseSensitive: Boolean;
    constructor(caseSensitive = false) {
        this._keyword = '_keyword_';
        this.nonWordBoundaries = (():Set<String> => {
            const getChars = (start, end, ascii):Array<String> => {
                const temp = [];
                for (let i = start; i <= end; i++) {
					temp.push(ascii ? String.fromCharCode(i) : i);
				}
				return temp;
            };
            return new Set([
                ...getChars(0, 9, true),
                ...getChars(65, 90, true),
                ...getChars(97, 122, true),
                '_'
            ])
        })();
        this.keywordsTrie = new Map();
        this.caseSensitive = caseSensitive;
    }

    public addKeyword = (keyword:String, cleanName: String) => {
        if (!cleanName) {
            cleanName = keyword;
        }

        if (keyword && cleanName) {
            if (!this.caseSensitive) keyword = keyword.toLowerCase();
            let currentDictRef = this.keywordsTrie;
            keyword.split('').map(char => {
                if (!currentDictRef.get(char)) {
                    currentDictRef.set(char, new Map());
                }
                currentDictRef = currentDictRef.get(char);
            })
            currentDictRef.set(this._keyword, cleanName);
        }
    }

    public replaceKeywords = (sentence:String):String => {
        const sentenceLength = sentence.length;

        if (typeof sentence !== 'string' && sentenceLength === 0) return sentence;
        const orgSentence = sentence;

        if (!this.caseSensitive) sentence = sentence.toLowerCase();
        let newSentence = '';

        let currentWord = '';
        let currentDictRef = this.keywordsTrie;
        let currentWhiteSpace = '';
        let sequenceEndPos = 0;
        let idx = 0;

        while (idx < sentenceLength) {
            let char = sentence[idx];
			currentWord += orgSentence[idx];

			let sequenceFound, longestSequenceFound, isLongerSequenceFound, idy;

			if (!this.nonWordBoundaries.has(char)) {
				currentWhiteSpace = char;

				if (currentDictRef.has(this._keyword) || currentDictRef.has(char)) {
					sequenceFound = '';
					longestSequenceFound = '';
					isLongerSequenceFound = false;

					if (currentDictRef.has(this._keyword)) {
						sequenceFound = currentDictRef.get(this._keyword);
						longestSequenceFound = currentDictRef.get(this._keyword);
						sequenceEndPos = idx;
					}

					if (currentDictRef.has(char)) {
						let currentDictContinued = currentDictRef.get(char);
						let currentWordContinued = currentWord;
						idy = idx + 1;

						while (idy < sentenceLength) {
							let innerChar = sentence[idy];
							currentWordContinued += orgSentence[idy];

							if (
								!this.nonWordBoundaries.has(innerChar) &&
								currentDictContinued.has(this._keyword)
							) {
								currentWhiteSpace = innerChar;
								longestSequenceFound = currentDictContinued.get(this._keyword);
								sequenceEndPos = idy;
								isLongerSequenceFound = true;
							}

							if (currentDictContinued.has(innerChar)) {
								currentDictContinued = currentDictContinued.get(innerChar);
							} else {
								break;
							}

							++idy;
						}

						if (
							idy >= sentenceLength &&
							currentDictContinued.has(this._keyword)
						) {
							currentWhiteSpace = '';
							longestSequenceFound = currentDictContinued.get(this._keyword);
							sequenceEndPos = idy;
							isLongerSequenceFound = true;
						}

						if (isLongerSequenceFound) {
							idx = sequenceEndPos;
							currentWord = currentWordContinued;
						}
					}
					currentDictRef = this.keywordsTrie;

					if (longestSequenceFound) {
						newSentence += longestSequenceFound + currentWhiteSpace;
						currentWord = '';
						currentWhiteSpace = '';
					} else {
						newSentence += currentWord;
						currentWord = '';
						currentWhiteSpace = '';
					}
				} else {
					currentDictRef = this.keywordsTrie;
					newSentence += currentWord;
					currentWord = '';
					currentWhiteSpace = '';
				}
			} else if (currentDictRef.has(char)) {
				currentDictRef = currentDictRef.get(char);
			} else {
				currentDictRef = this.keywordsTrie;
				idy = idx + 1;

				while (idy < sentenceLength) {
					char = sentence[idy];
					currentWord += orgSentence[idy];

					if (!this.nonWordBoundaries.has(char)) break;

					++idy;
				}
				idx = idy;
				newSentence += currentWord;
				currentWord = '';
				currentWhiteSpace = '';
			}

			if (idx + 1 >= sentenceLength) {
				if (currentDictRef.has(this._keyword)) {
					sequenceFound = currentDictRef.get(this._keyword);
					newSentence += sequenceFound;
				} else {
					newSentence += currentWord;
				}
			}

			++idx;
        }
        return newSentence;
    }
}

export = TextProcessing;