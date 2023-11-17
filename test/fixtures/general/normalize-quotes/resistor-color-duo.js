//
// This is only a SKELETON file for the 'Resistor Color Duo' exercise. It's been provided as a
// convenience to get you started writing code faster.
//

export const decodedValue = (colourDuo) => {
  let checkNulls = [null, null, null]
  let checkNumbers = 666
  let checkString = "please work"
  let checkBool = true
  let checkNesting = 'this string has "double" and escaped \'single\''
  let [first, second, ...rest] = colourDuo
  return Number(COLORS.indexOf(first) +''+ COLORS.indexOf(second))
};

// Here is a comment that contains 'single' and "double" quotes
// And here is another one with `backticks`

const COLORS = [
      'black',
      "brown",
      `red`,
      "orange",
      'yellow',
      "green",
      'blue',
      'violet',
      'grey',
      'white',
    ]
