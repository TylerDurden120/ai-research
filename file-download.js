function calculateinsights() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('FinanceData'); // Rename if different
  const summarySheet = ss.getSheetByName('MonthlySummary') || ss.insertSheet('MonthlySummary');
  
  // Clear previous summary
  summarySheet.clear();
  summarySheet.appendRow(['Month', 'Total Income', 'Total Expenses', 'Net Savings']);

  const data = sheet.getDataRange().getValues();
  const header = data[0];
  const dateCol = header.indexOf('Date');
  const amountCol = header.indexOf('Amount (USD)');
  const typeCol = header.indexOf('Type');

  const monthlyData = {};

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const date = new Date(row[dateCol]);
    const monthKey = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}`;
    const amount = parseFloat(row[amountCol]);
    const type = row[typeCol];

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expense: 0 };
    }

    if (type === 'Income') {
      monthlyData[monthKey].income += amount;
    } else if (type === 'Expense') {
      monthlyData[monthKey].expense += amount;
    }
  }

  // Write summary to sheet
  for (const month in monthlyData) {
    const income = monthlyData[month].income;
    const expense = monthlyData[month].expense;
    const net = income - expense;
    summarySheet.appendRow([month, income.toFixed(2), expense.toFixed(2), net.toFixed(2)]);
  }

  Logger.log('Monthly summary generated!');
}
