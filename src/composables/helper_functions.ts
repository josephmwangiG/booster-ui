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
