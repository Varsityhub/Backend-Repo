import crypto from "crypto";

export const generateAdminPassword = (): string => {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const special = "@#$%&*";

  const allChars = upper + lower + numbers + special;

  const getRandomChar = (chars: string) =>
    chars[crypto.randomInt(0, chars.length)];

  // Ensure complexity
  const passwordChars = [
    getRandomChar(upper),
    getRandomChar(lower),
    getRandomChar(numbers),
    getRandomChar(special),
  ];

  // Remaining chars (to make 6–7 length)
  const length = crypto.randomInt(6, 8); // 6 or 7
  while (passwordChars.length < length) {
    passwordChars.push(getRandomChar(allChars));
  }

  // Shuffle characters
  for (let i = passwordChars.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    [passwordChars[i], passwordChars[j]] = [
      passwordChars[j],
      passwordChars[i],
    ];
  }

  return passwordChars.join("");
};
