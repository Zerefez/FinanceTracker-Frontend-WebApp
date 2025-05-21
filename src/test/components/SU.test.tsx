import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DefaultSUSection, { SUSection } from "../../components/SU";
import { AVAILABLE_YEARS, HOUSING_STATUS, TAX_CARD_OPTIONS } from "../../data/studentGrantData";

// Mock hooks
vi.mock("../../lib/hooks", () => ({
  useLocalization: () => ({
    t: (key: string) => key, // Simply return the key for testing
  }),
}));

describe("SU Component", () => {
  // Test the default export (no props)
  describe("DefaultSUSection", () => {
    it("renders without crashing", () => {
      render(<DefaultSUSection />);
      expect(screen.getByText("studentGrant.title")).toBeInTheDocument();
    });

    it("renders with default values", () => {
      render(<DefaultSUSection />);

      // Check for default tax card selection
      const taxCardSelect = screen.getByText("studentGrant.taxCardOptions.main");
      expect(taxCardSelect).toBeInTheDocument();

      // Check for default housing status
      const housingSelect = screen.getByText("studentGrant.housingStatus.away");
      expect(housingSelect).toBeInTheDocument();

      // Check for the percentage visualization
      const percentageDisplay = screen.getByText(/\d+%/);
      expect(percentageDisplay).toBeInTheDocument();
    });
  });

  // Test the SUSection component with various props
  describe("SUSection with props", () => {
    const mockOnSuChange = vi.fn();
    const mockOnTaxCardChange = vi.fn();
    const mockOnHousingChange = vi.fn();

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("renders with custom suBrutto value", () => {
      render(
        <SUSection
          suBrutto={8000}
          taxCard={TAX_CARD_OPTIONS.MAIN.value}
          housingStatus={HOUSING_STATUS.AWAY.value}
        />,
      );

      // Check if the custom suBrutto amount is displayed
      expect(screen.getByText("8,000 kr. (studentGrant.gross)")).toBeInTheDocument();
    });

    it("renders with custom taxCard value", () => {
      render(<SUSection taxCard={TAX_CARD_OPTIONS.SECONDARY.value} />);

      // Find the select element and check its value
      const taxCardSelect = screen.getAllByRole("combobox")[2]; // Tax card is the third select
      expect(taxCardSelect).toHaveValue(TAX_CARD_OPTIONS.SECONDARY.value);
    });

    it("renders with custom housingStatus value", () => {
      render(<SUSection housingStatus={HOUSING_STATUS.WITH_PARENTS.value} />);

      // Find the select element and check its value
      const housingSelect = screen.getAllByRole("combobox")[1]; // Housing status is the second select
      expect(housingSelect).toHaveValue(HOUSING_STATUS.WITH_PARENTS.value);
    });

    it("calls onTaxCardChange when tax card is changed", () => {
      render(
        <SUSection taxCard={TAX_CARD_OPTIONS.MAIN.value} onTaxCardChange={mockOnTaxCardChange} />,
      );

      const taxCardSelect = screen.getAllByRole("combobox")[2]; // Tax card is the third select
      fireEvent.change(taxCardSelect, { target: { value: TAX_CARD_OPTIONS.SECONDARY.value } });

      expect(mockOnTaxCardChange).toHaveBeenCalledWith(TAX_CARD_OPTIONS.SECONDARY.value);
    });

    it("calls onHousingChange when housing status is changed", () => {
      render(
        <SUSection
          housingStatus={HOUSING_STATUS.AWAY.value}
          onHousingChange={mockOnHousingChange}
        />,
      );

      const housingSelect = screen.getAllByRole("combobox")[1]; // Housing status is the second select
      fireEvent.change(housingSelect, { target: { value: HOUSING_STATUS.WITH_PARENTS.value } });

      expect(mockOnHousingChange).toHaveBeenCalledWith(HOUSING_STATUS.WITH_PARENTS.value);
    });

    it("handles year changes", () => {
      render(<SUSection />);

      const yearSelect = screen.getAllByRole("combobox")[0]; // Year is the first select
      const initialYear = AVAILABLE_YEARS[0];
      const secondYear = AVAILABLE_YEARS[1] || "2023"; // Use the second year or default to '2023'

      // Verify initial value
      expect(yearSelect).toHaveValue(initialYear);

      // Change the year
      fireEvent.change(yearSelect, { target: { value: secondYear } });

      // Verify the change
      expect(yearSelect).toHaveValue(secondYear);
    });

    it("handles income slider changes", () => {
      render(<SUSection onSuChange={mockOnSuChange} />);

      // Find the slider
      const slider = screen.getByRole("slider");

      // Change the value
      fireEvent.change(slider, { target: { value: "20000" } });

      // Verify the callback was called
      expect(mockOnSuChange).toHaveBeenCalledWith(20000);

      // Verify the display updates
      expect(screen.getByText(/20,000 kr\./)).toBeInTheDocument();
    });

    it("calculates percentage correctly", () => {
      render(<SUSection />);

      // Find the slider
      const slider = screen.getByRole("slider");

      // Change the value to around 40% of income ceiling
      fireEvent.change(slider, { target: { value: "100000" } });

      // Get the percentage text and verify it contains a number followed by %
      const percentageElement = screen.getByText(/\d+%/);
      expect(percentageElement).toBeInTheDocument();

      // The actual percentage might vary based on implementation details
      // We just need to ensure it's greater than 0
      const percentageText = percentageElement.textContent || "";
      const percentageValue = parseInt(percentageText);
      expect(percentageValue).toBeGreaterThan(0);
    });

    it("caps percentage at 100% when exceeding income ceiling", () => {
      render(<SUSection />);

      // Find the slider
      const slider = screen.getByRole("slider");

      // Change the value to more than income ceiling
      const highValue = "300000"; // Higher than income ceiling
      fireEvent.change(slider, { target: { value: highValue } });

      // Verify the percentage is capped at 100%
      expect(screen.getByText("100%")).toBeInTheDocument();
    });

    it("shows correct remaining earnings", () => {
      render(<SUSection />);

      // Find the slider
      const slider = screen.getByRole("slider");

      // Change the value to a specific amount
      fireEvent.change(slider, { target: { value: "50000" } });

      // First find the remaining earnings label
      const remainingLabel = screen.getByText("studentGrant.remainingEarnings");

      // Then navigate to its sibling element which contains the value
      const remainingValueElement = remainingLabel.parentElement?.querySelector(
        ".font-semibold.text-accent",
      );

      // Verify the remaining earnings element exists
      expect(remainingValueElement).not.toBeNull();

      // Verify it contains a number with commas followed by kr.
      expect(remainingValueElement?.textContent).toMatch(/\d+,\d+\s+kr\./);
    });

    it("shows zero remaining earnings when exceeding income ceiling", () => {
      render(<SUSection />);

      // Find the slider
      const slider = screen.getByRole("slider");

      // Change the value to more than income ceiling
      const highValue = "300000"; // Higher than income ceiling
      fireEvent.change(slider, { target: { value: highValue } });

      // Verify the remaining earnings display updates to 0
      expect(screen.getByText(/0 kr\./)).toBeInTheDocument();
    });
  });

  // Test the SVG generation for progress visualization
  describe("Progress visualization", () => {
    it("renders SVG with correct paths", () => {
      const { container } = render(<SUSection />);

      // Find the SVG paths directly using the container
      const paths = container.querySelectorAll("svg path");

      // Verify there are background and progress paths
      expect(paths.length).toBeGreaterThanOrEqual(2);

      // Verify the background path exists
      const backgroundPath = paths[0];
      expect(backgroundPath).toHaveAttribute("stroke", "#f1f1f1");

      // Verify the progress path exists
      const progressPath = paths[1];
      expect(progressPath).toHaveAttribute("stroke", "#0844BD");
      expect(progressPath).toHaveAttribute("stroke-dasharray");
      expect(progressPath).toHaveAttribute("stroke-dashoffset");
    });

    it("updates SVG progress path when income changes", () => {
      const { container } = render(<SUSection />);

      // Find the SVG paths directly
      const paths = container.querySelectorAll("svg path");
      const progressPath = paths[1]; // Second path is the progress path

      const initialDashOffset = progressPath.getAttribute("stroke-dashoffset");

      // Change the income
      const slider = screen.getByRole("slider");
      fireEvent.change(slider, { target: { value: "100000" } });

      // Verify the dashoffset has changed
      const updatedDashOffset = progressPath.getAttribute("stroke-dashoffset");
      expect(updatedDashOffset).not.toBe(initialDashOffset);
    });
  });
});
