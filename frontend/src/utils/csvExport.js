/**
 * Converts an array of transaction objects into a CSV string and
 * triggers a browser download.
 *
 * @param {Array} transactions - filtered transaction array from Redux
 * @param {string} filename - optional filename override
 */
export function exportTransactionsToCSV(transactions, filename = "smartspend-transactions.csv") {
  if (!transactions || transactions.length === 0) {
    alert("No transactions to export.");
    return;
  }

  const headers = ["Date", "Type", "Category", "Amount ($)", "Notes", "Recurring", "Frequency"];

  const rows = transactions.map((t) => {
    const date = new Date(t.date).toLocaleDateString("en-US");
    const amount = Number(t.amount).toFixed(2);
    const notes = t.notes ? `"${t.notes.replace(/"/g, '""')}"` : "";
    const recurring = t.isRecurring ? "Yes" : "No";
    const frequency = t.recurrenceFrequency || "-";
    return [date, t.type, t.category, amount, notes, recurring, frequency].join(",");
  });

  const csvContent = [headers.join(","), ...rows].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
