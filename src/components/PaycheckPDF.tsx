import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { PaycheckData } from "../services/paycheckService";

// Create styles for the document
const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  section: {
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  header: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
  value: {
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 10,
  },
  difference: {
    fontSize: 12,
    color: "red",
    marginTop: 4,
  },
  positiveDifference: {
    fontSize: 12,
    color: "green",
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  column: {
    width: "30%",
    textAlign: "center",
  },
});

interface PaycheckPdfProps {
  generatedPaycheck: PaycheckData;
  manualData: any; // Replace with your actual data type
  calculateDifference: (generatedValue: number, manualValue: number) => number;
  formatCurrency: (value: number) => string;
  formatPercentage: (value: number) => string;
  formatWorkedHours: (value: number) => string;
}

const PaycheckPdf: React.FC<PaycheckPdfProps> = ({
  generatedPaycheck,
  manualData,
  calculateDifference,
  formatCurrency,
  formatPercentage,
  formatWorkedHours,
}) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>Paycheck Comparison</Text>

      {/* Salary Before Tax */}
      <View style={styles.section}>
        <Text style={styles.header}>Salary Before Tax (DKK)</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Your Actual Paycheck</Text>
            <Text style={styles.value}>{formatCurrency(manualData.salaryBeforeTax)}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Generated Paycheck</Text>
            <Text style={styles.value}>{formatCurrency(generatedPaycheck.salaryBeforeTax)}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Difference</Text>
            <Text
              style={
                calculateDifference(
                  generatedPaycheck.salaryBeforeTax,
                  manualData.salaryBeforeTax,
                ) === 0
                  ? styles.positiveDifference
                  : styles.difference
              }
            >
              {calculateDifference(
                generatedPaycheck.salaryBeforeTax,
                manualData.salaryBeforeTax,
              ) === 0
                ? "No Difference"
                : formatCurrency(
                    calculateDifference(
                      generatedPaycheck.salaryBeforeTax,
                      manualData.salaryBeforeTax,
                    ),
                  )}
            </Text>
          </View>
        </View>
      </View>

      {/* Salary After Tax */}
      <View style={styles.section}>
        <Text style={styles.header}>Salary After Tax (DKK)</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Your Actual Paycheck</Text>
            <Text style={styles.value}>{formatCurrency(manualData.salaryAfterTax)}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Generated Paycheck</Text>
            <Text style={styles.value}>{formatCurrency(generatedPaycheck.salaryAfterTax)}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Difference</Text>
            <Text
              style={
                calculateDifference(generatedPaycheck.salaryAfterTax, manualData.salaryAfterTax) ===
                0
                  ? styles.positiveDifference
                  : styles.difference
              }
            >
              {calculateDifference(generatedPaycheck.salaryAfterTax, manualData.salaryAfterTax) ===
              0
                ? "No Difference"
                : formatCurrency(
                    calculateDifference(
                      generatedPaycheck.salaryAfterTax,
                      manualData.salaryAfterTax,
                    ),
                  )}
            </Text>
          </View>
        </View>
      </View>

      {/* Tax Rate */}
      <View style={styles.section}>
        <Text style={styles.header}>Tax Rate (%)</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Your Actual Paycheck</Text>
            <Text style={styles.value}>{formatPercentage(manualData.tax)}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Generated Paycheck</Text>
            <Text style={styles.value}>{formatPercentage(generatedPaycheck.tax)}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Difference</Text>
            <Text
              style={
                calculateDifference(generatedPaycheck.tax, manualData.tax) === 0
                  ? styles.positiveDifference
                  : styles.difference
              }
            >
              {calculateDifference(generatedPaycheck.tax, manualData.tax) === 0
                ? "No Difference"
                : formatPercentage(calculateDifference(generatedPaycheck.tax, manualData.tax))}
            </Text>
          </View>
        </View>
      </View>

      {/* Worked Hours */}
      <View style={styles.section}>
        <Text style={styles.header}>Hours Worked</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Your Actual Paycheck</Text>
            <Text style={styles.value}>{formatWorkedHours(manualData.workedHours)}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Generated Paycheck</Text>
            <Text style={styles.value}>{formatWorkedHours(generatedPaycheck.workedHours)}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Difference</Text>
            <Text
              style={
                calculateDifference(generatedPaycheck.workedHours, manualData.workedHours) === 0
                  ? styles.positiveDifference
                  : styles.difference
              }
            >
              {calculateDifference(generatedPaycheck.workedHours, manualData.workedHours) === 0
                ? "No Difference"
                : `${calculateDifference(
                    generatedPaycheck.workedHours,
                    manualData.workedHours,
                  ).toFixed(2)} hours`}
            </Text>
          </View>
        </View>
      </View>

      {/* Repeat similar blocks for other fields like AM Contribution, Vacation Pay, etc. */}
    </Page>
  </Document>
);

export default PaycheckPdf;
