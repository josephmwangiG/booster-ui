export const formatAmount = (amount: any) => {
  if (amount) {
    return Number(amount).toLocaleString("en-US", {
      style: "currency",
      currency: "KES",
    });
  }else{
    return "KES 0.00"
  }
};

export const formatNumber = (number: any) => {
  if (number) {
    return Number(number).toLocaleString("en-US");
  }else{
    return "0"
  }
};

export const formatLargeNumber = (num: any) => {
  if (!num) return "0";
  
  const number = Number(num);
  if (isNaN(number)) return "0";
  
  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(1) + 'b';
  } else if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'm';
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'k';
  } else {
    return number.toString();
  }
};

export const formatAmountCompact = (amount: any) => {
  if (!amount) return "KES 0.00";
  
  const number = Number(amount);
  if (isNaN(number)) return "KES 0.00";
  
  if (number >= 1000000000) {
    return `KES ${(number / 1000000000).toFixed(1)}b`;
  } else if (number >= 1000000) {
    return `KES ${(number / 1000000).toFixed(1)}m`;
  } else if (number >= 1000) {
    return `KES ${(number / 1000).toFixed(1)}k`;
  } else {
    return formatAmount(amount);
  }
};
