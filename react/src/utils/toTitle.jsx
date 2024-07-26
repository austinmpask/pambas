//Make a word or sentence title cased
export default function toTitle(str, firstOnly = false) {
  //Option for only capitalizing the first word of sentence
  if (firstOnly) {
    return capitalize(str);
  } else {
    //Capitalize every word
    const splitString = str.split(" ");

    const titleCased = splitString.map((word) => capitalize(word));

    return titleCased.join(" ");
  }
}

function capitalize(word) {
  if (word) {
    const code = word.charCodeAt(0);
    return 64 < code < 91 || 96 < code < 123
      ? word[0].toUpperCase() + word.slice(1)
      : word;
  } else {
    return word;
  }
}
