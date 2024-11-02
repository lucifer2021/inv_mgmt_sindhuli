export const generateProductId = () => {
  const prefix = 'P';
  const randomNum = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `${prefix}${randomNum}`;
};

export const generateCustomerId = () => {
  const prefix = 'C';
  const randomNum = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `${prefix}${randomNum}`;
};

export const generateUniqueId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomStr}`.toUpperCase();
};