// helpers.js
export const calculateTransactionsToBalance = (saldosUsuarios: Record<string, number>) => {  
  const transactions = [];
  
  const sortedSaldos = Object.entries(saldosUsuarios)
    .sort((a, b) => a[1] - b[1]);
  
  let i = 0;
  let j = sortedSaldos.length - 1;
  
  while (i < j) {
    const [deudor, saldoDeudor] = sortedSaldos[i];
    const [acreedor, saldoAcreedor] = sortedSaldos[j];
  
    const monto = Math.min(-saldoDeudor, saldoAcreedor);
    if (monto > 0) {
      transactions.push({
        deudor,
        acreedor,
        monto,
      });
  
      sortedSaldos[i][1] += monto;
      sortedSaldos[j][1] -= monto;
  
      if (sortedSaldos[i][1] === 0) i++;
      if (sortedSaldos[j][1] === 0) j--;
    }
  }
  
  return transactions;
};
  