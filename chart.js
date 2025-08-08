///////////////////////////////////////////////////////////
//GRAPH
let amortizationChart;

document.addEventListener("DOMContentLoaded", () => {
  const purchaseAmountInput = document.getElementById("purchaseAmount");
  const downPaymentInput = document.getElementById("downPayment");
  const interestRateInput = document.getElementById("interestRate");
  const mortgageTermInput = document.getElementById("mortgageTerm");
  const paymentIntervalSelect = document.getElementById("paymentInterval");
  const calculateBtn = document.getElementById("calculateBtn");

  const displayLoanAmount = document.getElementById("displayLoanAmount");
  const displayMonthlyPayment = document.getElementById(
    "displayMonthlyPayment"
  );
  const displayInterestRate = document.getElementById("displayInterestRate");
  const displayTotalPayments = document.getElementById("displayTotalPayments");
  const displayMortgageTerm = document.getElementById("displayMortgageTerm");
  const displayTotalAmountPaid = document.getElementById(
    "displayTotalAmountPaid"
  );
  const displayTotalInterestPaid = document.getElementById(
    "displayTotalInterestPaid"
  );

  const ctx = document.getElementById("amortizationChart").getContext("2d");

  function calculateMortgage() {
    const purchaseAmount = parseFloat(purchaseAmountInput.value);
    const downPayment = parseFloat(downPaymentInput.value);
    let annualInterestRate = parseFloat(interestRateInput.value) / 100;
    const mortgageTermYears = parseFloat(mortgageTermInput.value);
    const paymentInterval = paymentIntervalSelect.value;

    if (
      isNaN(purchaseAmount) ||
      isNaN(downPayment) ||
      isNaN(annualInterestRate) ||
      isNaN(mortgageTermYears) ||
      purchaseAmount <= 0
    ) {
      displayMonthlyPayment.textContent = "$0.00";
      displayTotalPayments.textContent = "0";
      displayTotalAmountPaid.textContent = "$0.00";
      displayTotalInterestPaid.textContent = "$0.00";
      updateChart([], [], [], []);
      return;
    }

    const loanAmount = purchaseAmount - downPayment;

    let paymentsPerYear;
    switch (paymentInterval) {
      case "monthly":
        paymentsPerYear = 12;
        break;
      case "semi-monthly":
        paymentsPerYear = 24; // 2 payments per month * 12 months
        break;
      case "bi-weekly":
        paymentsPerYear = 26;
        break;
      case "weekly":
        paymentsPerYear = 52;
        break;
      default:
        paymentsPerYear = 12;
    }

    const periodicInterestRate = annualInterestRate / paymentsPerYear;
    const numberOfPayments = mortgageTermYears * paymentsPerYear;

    let periodicPayment;
    if (periodicInterestRate === 0) {
      periodicPayment = loanAmount / numberOfPayments;
    } else {
      periodicPayment =
        (loanAmount *
          (periodicInterestRate *
            Math.pow(1 + periodicInterestRate, numberOfPayments))) /
        (Math.pow(1 + periodicInterestRate, numberOfPayments) - 1);
    }

    const totalAmountPaid = periodicPayment * numberOfPayments;
    const totalInterestPaid = totalAmountPaid - loanAmount;

    displayLoanAmount.textContent = `$${loanAmount.toFixed(2)}`;
    displayMonthlyPayment.textContent = `$${periodicPayment.toFixed(2)}`;
    displayInterestRate.textContent = `${(annualInterestRate * 100).toFixed(
      2
    )}%`;
    displayTotalPayments.textContent = Math.round(numberOfPayments);
    displayMortgageTerm.textContent = `${mortgageTermYears} years`;
    displayTotalAmountPaid.textContent = `$${totalAmountPaid.toFixed(2)}`;
    displayTotalInterestPaid.textContent = `$${totalInterestPaid.toFixed(2)}`;

    const amortizationSchedule = [];
    let remainingBalance = loanAmount;
    let totalPrincipalPaidForChart = 0;
    let cumulativeInterest = 0;

    for (let i = 0; i <= numberOfPayments; i++) {
      const currentBalance = remainingBalance;
      const interestPayment = currentBalance * periodicInterestRate;
      let principalPayment = periodicPayment - interestPayment;

      if (i === numberOfPayments) {
        principalPayment = currentBalance;
      }
      if (principalPayment < 0) principalPayment = 0;

      remainingBalance -= principalPayment;
      totalPrincipalPaidForChart += principalPayment;
      cumulativeInterest += interestPayment;

      amortizationSchedule.push({
        period: i,
        balance: remainingBalance,
        interestPaid: interestPayment,
        principalPaid: principalPayment,
        equity: downPayment + totalPrincipalPaidForChart,
        cumulativeInterest: cumulativeInterest,
      });
    }

    const chartLabels = [];
    const chartDebtData = [];
    const chartInterestData = [];
    const chartEquityData = [];

    const intervalYears = 2.5;
    const totalYears = mortgageTermYears;

    for (let year = 0; year <= totalYears; year += intervalYears) {
      const targetPaymentIndex = Math.round(year * paymentsPerYear);
      const dataPoint =
        amortizationSchedule[Math.min(targetPaymentIndex, numberOfPayments)];

      if (dataPoint) {
        chartLabels.push(year.toFixed(1));
        chartDebtData.push(dataPoint.balance);
        chartInterestData.push(dataPoint.cumulativeInterest);
        chartEquityData.push(dataPoint.equity);
      }
    }

    updateChart(chartLabels, chartDebtData, chartInterestData, chartEquityData);
  }

  function updateChart(labels, debtData, interestData, equityData) {
    if (amortizationChart) {
      amortizationChart.destroy();
    }

    amortizationChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Debt",
            data: debtData,
            borderColor: "red",
            backgroundColor: "rgba(255, 0, 0, 0.1)",
            fill: false,
            pointRadius: 3,
            pointBackgroundColor: "red",
            pointBorderColor: "red",
            tension: 0.1,
          },
          {
            label: "Interest",
            data: interestData,
            borderColor: "orange",
            backgroundColor: "rgba(255, 165, 0, 0.1)",
            fill: false,
            pointRadius: 3,
            pointBackgroundColor: "orange",
            pointBorderColor: "orange",
            tension: 0.1,
          },
          {
            label: "Equity",
            data: equityData,
            borderColor: "green",
            backgroundColor: "rgba(0, 128, 0, 0.1)",
            fill: false,
            pointRadius: 3,
            pointBackgroundColor: "green",
            pointBorderColor: "green",
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: "Years",
              font: {
                size: 14,
                family: "Mukta",
              },
              color: "#555",
            },
            ticks: {
              font: {
                family: "Mukta",
              },
              color: "#555",
            },
          },
          y: {
            title: {
              display: true,
              text: "Amount ($)",
              font: {
                size: 14,
                family: "Mukta",
              },
              color: "#555",
            },
            ticks: {
              callback: function (value) {
                return "$" + value.toLocaleString();
              },
              font: {
                family: "Mukta",
              },
              color: "#555",
            },
            min: 0,
          },
        },
        plugins: {
          legend: {
            position: "top",
            labels: {
              font: {
                size: 14,
                family: "Mukta",
              },
              color: "#333",
              usePointStyle: true,
              boxWidth: 10,
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || "";
                if (label) {
                  label += ": ";
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(context.parsed.y);
                }
                return label;
              },
            },
          },
        },
      },
    });
  }

  calculateMortgage();

  purchaseAmountInput.addEventListener("input", calculateMortgage);
  downPaymentInput.addEventListener("input", calculateMortgage);
  interestRateInput.addEventListener("input", calculateMortgage);
  mortgageTermInput.addEventListener("input", calculateMortgage);
  paymentIntervalSelect.addEventListener("change", calculateMortgage);
  calculateBtn.addEventListener("click", calculateMortgage);
});
