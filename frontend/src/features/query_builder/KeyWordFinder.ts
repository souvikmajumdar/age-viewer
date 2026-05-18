interface KeyWordMatrix {
  kw: string[];
  relationships: string[][];
}

class KeyWordFinder {
  keywordMap: Record<string, string[]>;
  allKeywords: Set<string>;

  constructor() {
    this.keywordMap = new Map() as unknown as Record<string, string[]>;
    this.allKeywords = new Set();
  }

  getConnectedNames(kw: string): string[] {
    const key = kw.toUpperCase();
    if (!this.allKeywords.has(key)) {
      return KeyWordFinder.INITIAL;
    }
    const relationships = this.keywordMap[key];
    const keywordList = Object.keys(this.keywordMap);
    const relatedKeys: string[] = [];
    relationships.forEach((element, index) => {
      if (element !== '0') {
        relatedKeys.push(keywordList[index]);
      }
    });
    return relatedKeys;
  }

  hasWord(word: string): boolean {
    const upperWord = word.toUpperCase();
    return this.allKeywords.has(upperWord);
  }

  static get INITIAL(): string[] {
    return ['MATCH', 'CREATE', 'MERGE'];
  }

  static fromMatrix(data: KeyWordMatrix): KeyWordFinder {
    const { kw, relationships } = data;
    const finder = new KeyWordFinder();
    // kw is list of keywordList and relationships is matrix
    kw.forEach((element, index) => {
      if (element === '') return;
      finder.keywordMap[element] = relationships[index].slice(1);
      finder.allKeywords.add(element);
    });
    return finder;
  }
}

export default KeyWordFinder;
