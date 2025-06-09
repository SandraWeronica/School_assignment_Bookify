const createElement = (tag, className, textContent, imgSrc) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (textContent) element.textContent = textContent;
  if (imgSrc) element.src = imgSrc;
  return element;
};

export default createElement;
