export const onlyNumbers = (value) => {
  return value.replace(/\D/g, "");
};

export const maskCpf = (value) => {
  value = onlyNumbers(value);

  return value
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2")
    .slice(0, 14);
};

export const maskPhone = (value) => {
  value = onlyNumbers(value);

  return value
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15);
};

export const maskCep = (value) => {
  value = onlyNumbers(value);

  return value.replace(/^(\d{5})(\d)/, "$1-$2").slice(0, 9);
};

export const maskDate = (value) => {
  value = onlyNumbers(value);

  return value
    .replace(/^(\d{2})(\d)/, "$1/$2")
    .replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3")
    .slice(0, 10);
};

export const dateBrToIso = (date) => {
  if (!date) return "";

  const [day, month, year] = date.split("/");

  return `${year}-${month}-${day}`;
};
