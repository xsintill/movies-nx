//type which can only hold all the letters of the alphabet
export type Letter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';
//type which can only hold 2 letters
export type TwoLetters = [Letter, Letter];
//type which can only hold 3 letters
export type ThreeLetters = [Letter, Letter, Letter];
//type which can hold either 1 letter two letters or three letter combos
export type LetterCombo = Letter | TwoLetters | ThreeLetters;