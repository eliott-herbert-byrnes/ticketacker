import zxcvbn from "zxcvbn";

const checkPasswordStrength = (password: string) => {
  return zxcvbn(password);
};
export { checkPasswordStrength };
