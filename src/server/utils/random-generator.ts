export const getRandomPort = () => {
  return Math.floor(Math.random() * 1000) + 1234;
};

export const getRandomPassword = () => {
  return (Math.random() + 1).toString(36).substring(4);
};
