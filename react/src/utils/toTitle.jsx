//Make a word or sentence title cased
export default function toTitle(str, firstOnly = false) {
  //Option for only capitalizing the first word of sentence
  if (firstOnly) {
    return str[0].toUpperCase() + str.slice(1);
  } else {
    //Capitalize every word
    const splitString = str.split(" ");

    const titleCased = splitString.map((word) => {
      return word[0].toUpperCase() + word.slice(1);
    });

    return titleCased.join(" ");
  }
}
