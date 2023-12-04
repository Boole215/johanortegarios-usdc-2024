/**
 * RECOMMENDATION
 *
 * To test your code, you should open "tester.html" in a web browser.
 * You can then use the "Developer Tools" to see the JavaScript console.
 * There, you will see the results unit test execution. You are welcome
 * to run the code any way you like, but this is similar to how we will
 * run your code submission.
 *
 * The Developer Tools in Chrome are available under the "..." menu,
 * futher hidden under the option "More Tools." In Firefox, they are
 * under the hamburger (three horizontal lines), also hidden under "More Tools."
 */

/**
 * Replaces symbols in text with spaces so it is easily splittable.
 * @param {string} text - The text to be sanitized.
 * @returns {string} - Sanitized text.
 * */
function stripSymbolsFromText(text) {
  // First, we replace characters that aren't alphanumeric, hyphens, apostrophes, with spaces.
  //    We keep hyphens because some words must be hyphenated to be correct.
  // Then, we reduce groups of multiple spaces to single spaces.
  let sanitized = text
    .replace(/[^a-zA-Z0-9-']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return sanitized;
}

/**
 * Searches for matches in scanned text.
 * @param {string} searchTerm - The word or term we're searching for.
 * @param {JSON} scannedTextObj - A JSON object representing the scanned text.
 * @returns {JSON} - Search results.
 * */
function findSearchTermInBooks(searchTerm, scannedTextObj) {
  /** You will need to implement your search and
   * return the appropriate object here. */
  // Index of words and their locations
  let word_index = {};

  let eolHyphenatedPage = null;
  let eolHyphenatedLine = null;
  let eolHyphenatedWord = null;

  for (const scannedText of scannedTextObj) {
    const textISBN = scannedText.ISBN;
    const textContent = scannedText.Content;

    // Iterate over each entry in 'Content'
    for (const content of textContent) {
      // Get the indivual words from the (sanitized) line's text
      const plaintext = stripSymbolsFromText(content.Text).split(" ");
      // Iterate over each word in the line
      for (let idx = 0; idx < plaintext.length; idx++) {
        let word = plaintext[idx];
        const page = content.Page;
        let line = content.Line;

        // Check for EOL hyphenation
        if (idx == plaintext.length - 1 && word.slice(-1) == "-") {
          eolHyphenatedPage = content.Page;
          eolHyphenatedLine = content.Line;
          eolHyphenatedWord = word.substring(0, word.length - 1);
          continue;
        } else if (
          idx == 0 &&
          eolHyphenatedLine == content.Line - 1 &&
          eolHyphenatedPage == content.Page
        ) {
          word = eolHyphenatedWord + word;
          line = eolHyphenatedLine;
          eolHyphenatedPage = null;
          eolHyphenatedLine = null;
          eolHyphenatedWord = null;
        }

        const wordLocation = {
          ISBN: textISBN,
          Page: content.Page,
          Line: line,
        };
        if (!(word in word_index)) {
          word_index[word] = [wordLocation];
        } else {
          word_index[word].push(wordLocation);
        }
      }
    }
  }

  const searchResult = searchTerm in word_index ? word_index[searchTerm] : [];
  var result = {
    SearchTerm: searchTerm,
    Results: searchResult,
  };

  return result;
}

/** Sample Text Objects */
const twentyLeagues = {
  Title: "Twenty Thousand Leagues Under the Sea",
  ISBN: "9780000528531",
  Content: [
    {
      Page: 31,
      Line: 8,
      Text: "now simply went on by her own momentum.  The dark-",
    },
    {
      Page: 31,
      Line: 9,
      Text: "ness was then profound; and however good the Canadian's",
    },
    {
      Page: 31,
      Line: 10,
      Text: "eyes were, I asked myself how he had managed to see, and",
    },
  ],
};

const mythOfSisyphus = {
  Title: "The Myth of Sisyphus",
  ISBN: "9780525564454",
  Content: [
    {
      Page: 14,
      Line: 1,
      Text: "he recognizes his worst enemy. Tomorrow, he was long-",
    },
    {
      Page: 14,
      Line: 2,
      Text: "ing for tomorrow, whereas everything in him ought to",
    },
    {
      Page: 14,
      Line: 3,
      Text: "reject it. That revolt of the flesh is the absurd.",
    },
    {
      Page: 16,
      Line: 11,
      Text: "I am interested—let me re-",
    },
    {
      Page: 16,
      Line: 12,
      Text: "peat again—not so much in absurd discoveries as in their",
    },
    {
      Page: 16,
      Line: 13,
      Text: "consequences. If one is assured of these facts, what is",
    },
    {
      Page: 16,
      Line: 27,
      Text: "the falsity of our own thesis (for the contrary assertion",
    },
    {
      Page: 16,
      Line: 28,
      Text: "does not admit that it can be true). And if one says that",
    },
  ],
};

const testText = {
  Title: "Text for Testing Use - 7th Edition",
  ISBN: "0000000000001",
  Content: [
    {
      Page: 16,
      Line: 3,
      Text: "Testing EOL hyphe-",
    },
    {
      Page: 17,
      Line: 4,
      Text: "nation. This should be parsed as nation rather than hyphenation.",
    },
  ],
};
/** Example input object. */
const twentyLeaguesIn = [twentyLeagues];
const mythOfSisyphusIn = [mythOfSisyphus];
const mythOfLeaguesIn = [twentyLeagues, mythOfSisyphus];
const testTextIn = [testText];

/** Example output object */
const twentyLeaguesOut = {
  SearchTerm: "the",
  Results: [
    {
      ISBN: "9780000528531",
      Page: 31,
      Line: 9,
    },
  ],
};

/*
 _   _ _   _ ___ _____   _____ _____ ____ _____ ____
| | | | \ | |_ _|_   _| |_   _| ____/ ___|_   _/ ___|
| | | |  \| || |  | |     | | |  _| \___ \ | | \___ \
| |_| | |\  || |  | |     | | | |___ ___) || |  ___) |
 \___/|_| \_|___| |_|     |_| |_____|____/ |_| |____/

 */

console.log("Beginning stripSymbolsFromText Testing");
/*
 * TEST String Sanitizer
 */

// TEST 1 - Stripping parentheses
const testSanitize1result = stripSymbolsFromText(
  "the falsity of our own thesis (for the contrary assertion",
);
const testSanitize1expected =
  "the falsity of our own thesis for the contrary assertion";
if (testSanitize1result === testSanitize1expected) {
  console.log("PASS: Test 1");
} else {
  console.log("FAIL: Test 1");
  console.log("Expected:", testSanitize1result);
  console.log("Received:", testSanitize1expected);
}

// TEST 2 - Stripping Em-dashes
const testSanitize2result = stripSymbolsFromText("I am interested—let me re-");
const testSanitize2expected = "I am interested let me re-";
if (testSanitize2result === testSanitize2expected) {
  console.log("PASS: Test 2");
} else {
  console.log("FAIL: Test 2");
  console.log("Expected:", testSanitize2result);
  console.log("Received:", testSanitize2expected);
}

// TEST 3 - Consecutive Symbols
const testSanitize3result = stripSymbolsFromText(
  "Multiple symbols———and we continue!",
);
const testSanitize3expected = "Multiple symbols and we continue";
if (testSanitize3result === testSanitize3expected) {
  console.log("PASS: Test 3");
} else {
  console.log("FAIL: Test 3");
  console.log("Expected:", testSanitize3result);
  console.log("Received:", testSanitize3expected);
}

/* We have provided two unit tests. They're really just `if` statements that
 * output to the console. We've provided two tests as examples, and
 * they should pass with a correct implementation of `findSearchTermInBooks`.
 *
 * Please add your unit tests below.
 * */
console.log("Beginning findSearchTermInBooks Testing");
// TEST 1
/** We can check that, given a known input, we get a known output. */
const test1result = findSearchTermInBooks("the", twentyLeaguesIn);
if (JSON.stringify(twentyLeaguesOut) === JSON.stringify(test1result)) {
  console.log("PASS: Test 1");
} else {
  console.log("FAIL: Test 1");
  console.log("Expected:", twentyLeaguesOut);
  console.log("Received:", test1result);
}

// TEST 2
/** We could choose to check that we get the right number of results. */
const test2result = findSearchTermInBooks("the", twentyLeaguesIn);
if (test2result.Results.length == 1) {
  console.log("PASS: Test 2");
} else {
  console.log("FAIL: Test 2");
  console.log("Expected:", twentyLeaguesOut.Results.length);
  console.log("Received:", test2result.Results.length);
}

// TEST 3 - Check search(the) != search(The)
const test3resultA = findSearchTermInBooks("the", twentyLeaguesIn);
const test3resultB = findSearchTermInBooks("The", twentyLeaguesIn);
if (JSON.stringify(test3resultA) == JSON.stringify(test3resultB)) {
  console.log("FAIL: Test 3");
  console.log("'the' Search Result:", atheResult);
  console.log("'The' Search Result", aTheResult);
} else {
  console.log("PASS: Test 3");
}

// TEST 4 - Check for punctuated search "Canadian's"
const test4result = findSearchTermInBooks("Canadian's", twentyLeaguesIn);
const test4expected = {
  SearchTerm: "Canadian's",
  Results: [
    {
      ISBN: "9780000528531",
      Page: 31,
      Line: 9,
    },
  ],
};
if (JSON.stringify(test4result) === JSON.stringify(test4expected)) {
  console.log("PASS: Test 4");
} else {
  console.log("FAIL: Test 4");
  console.log("Expected:", test4expected);
  console.log("Received:", test4result);
}

// Test 5 - Test with text containing symbols
// Testing with periods 'absurd.'
const test5_1result = findSearchTermInBooks("absurd", mythOfSisyphusIn);
const test5_1expected = {
  SearchTerm: "absurd",
  Results: [
    {
      ISBN: "9780525564454",
      Page: 14,
      Line: 3,
    },
    {
      ISBN: "9780525564454",
      Page: 16,
      Line: 12,
    },
  ],
};
if (JSON.stringify(test5_1result) === JSON.stringify(test5_1expected)) {
  console.log("PASS: Test 5_1");
} else {
  console.log("FAIL: Test 5_1");
  console.log("Expected:", test5_1expected);
  console.log("Received:", test5_1result);
}
// Testing with em-dash 'interested—'
const test5_2result = findSearchTermInBooks("interested", mythOfSisyphusIn);
const test5_2expected = {
  SearchTerm: "interested",
  Results: [
    {
      ISBN: "9780525564454",
      Page: 16,
      Line: 11,
    },
  ],
};
if (JSON.stringify(test5_2result) === JSON.stringify(test5_2expected)) {
  console.log("PASS: Test 5_2");
} else {
  console.log("FAIL: Test 5_2");
  console.log("Expected:", test5_2expected);
  console.log("Received:", test5_2result);
}

// Test 6 - Test with multiple texts
const test6result = findSearchTermInBooks("the", mythOfLeaguesIn);
const test6expected = {
  SearchTerm: "the",
  Results: [
    {
      ISBN: "9780000528531",
      Page: 31,
      Line: 9,
    },
    {
      ISBN: "9780525564454",
      Page: 14,
      Line: 3,
    },
    {
      ISBN: "9780525564454",
      Page: 14,
      Line: 3,
    },
    {
      ISBN: "9780525564454",
      Page: 16,
      Line: 27,
    },
    {
      ISBN: "9780525564454",
      Page: 16,
      Line: 27,
    },
  ],
};
if (JSON.stringify(test6result) === JSON.stringify(test6expected)) {
  console.log("PASS: Test 6");
} else {
  console.log("FAIL: Test 6");
  console.log("Expected:", test6expected);
  console.log("Received:", test6result);
}

// Test 7_1 - Test for EOL Hyphenation

// EOL hyphenated word is stored as complete word
const test7_1result = findSearchTermInBooks("darkness", twentyLeaguesIn);
const test7_1expected = {
  SearchTerm: "darkness",
  Results: [
    {
      ISBN: "9780000528531",
      Page: 31,
      Line: 8,
    },
  ],
};
if (JSON.stringify(test7_1result) === JSON.stringify(test7_1expected)) {
  console.log("PASS: Test 7_1");
} else {
  console.log("FAIL: Test 7_1");
  console.log("Expected:", test7_1expected);
  console.log("Received:", test7_1result);
}

// Incomplete EOL Hyphenated word is not matched by search
const test7_2result = findSearchTermInBooks("dark-", twentyLeaguesIn);
if (test7_2result.Results.length == 0) {
  console.log("PASS: Test 7_2");
} else {
  console.log("FAIL: Test 7_2");
  console.log("Expected: Empty results");
  console.log("Received:", test7_2result.Results);
}

const test7_3result = findSearchTermInBooks("longing", mythOfSisyphusIn);
const test7_3expected = {
  SearchTerm: "longing",
  Results: [
    {
      ISBN: "9780525564454",
      Page: 14,
      Line: 1,
    },
  ],
};
if (JSON.stringify(test7_3result) === JSON.stringify(test7_3expected)) {
  console.log("PASS: Test 7_3");
} else {
  console.log("FAIL: Test 7_3");
  console.log("Expected:", test7_3expected);
  console.log("Received:", test7_3result);
}

// Test 8 - Verify that EOL Hyphenation logic doesn't join text across pages
const test8_1result = findSearchTermInBooks("hyphenation", testTextIn);
if (test8_1result.Results.length != 0) {
  console.log("PASS: Test 8_1");
} else {
  console.log("FAIL: Test 8_1");
  console.log("Expected: Empty Results");
  console.log("Received:", test8results.Results);
}
const test8_2result = findSearchTermInBooks("nation", testTextIn);
if (test8_2result.Results.length == 2) {
  console.log("PASS: Test 8_2");
} else {
  console.log("FAIL: Test 8_2");
  console.log("Expected: Two Results");
  console.log("Received:", test8_2results.Results);
}
