interface ConditionalClasses {
  [className: string]: boolean;
}

export const filerClasses = (classes: ConditionalClasses): string => {
  return Object.keys(classes)
    .filter((className) => classes[className])
    .join(" ");
};
