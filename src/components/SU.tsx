import { useState } from "react";
import {
  AVAILABLE_YEARS,
  HOUSING_STATUS,
  INCOME_CEILING,
  MAX_EARNABLE,
  TAX_CARD_OPTIONS,
} from "../data/studentGrantData";
import { useLocalization } from "../lib/hooks";
import { toastService } from "./ui/toast";

interface SUData {
  incomeCeiling: number;
  currentIncome: number;
  maxEarnable: number;
  updatedDate: string;
}

interface SUProps {
  suBrutto?: number;
  taxCard?: string;
  housingStatus?: string;
  onSuChange?: (value: number) => void;
  onTaxCardChange?: (card: string) => void;
  onHousingChange?: (status: string) => void;
}

export function SUSection({
  suBrutto,
  taxCard = TAX_CARD_OPTIONS.MAIN.value,
  housingStatus = HOUSING_STATUS.AWAY.value,
  onSuChange,
  onTaxCardChange,
  onHousingChange,
}: SUProps) {
  const { t } = useLocalization();
  const [selectedYear, setSelectedYear] = useState(AVAILABLE_YEARS[0]);
  const [suData, setSUData] = useState<SUData>({
    incomeCeiling: INCOME_CEILING,
    currentIncome: 10000,
    maxEarnable: MAX_EARNABLE,
    updatedDate: "17/03-2025",
  });

  // Calculate percentage dynamically
  const calculatePercentage = () => {
    return Math.min(Math.round((suData.currentIncome / suData.incomeCeiling) * 100), 100);
  };

  // Calculate remaining earnings
  const calculateRemainingEarnings = () => {
    return Math.max(0, suData.incomeCeiling - suData.currentIncome);
  };

  // Generate SVG path for dynamic progress
  const generateProgressPath = (percentage: number) => {
    const radius = 15.9155;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference * (1 - percentage / 100);

    return {
      backgroundPath: `M18 2.0845
        a ${radius} ${radius} 0 0 1 0 31.831
        a ${radius} ${radius} 0 0 1 0 -31.831`,
      progressPath: `M18 2.0845
        a ${radius} ${radius} 0 0 1 0 31.831
        a ${radius} ${radius} 0 0 1 0 -31.831`,
      strokeDasharray: `${circumference}`,
      strokeDashoffset: dashOffset,
    };
  };

  const percentage = calculatePercentage();
  const progressPaths = generateProgressPath(percentage);
  const remainingEarnings = calculateRemainingEarnings();

  // Handle SU brutto change from slider
  const handleSuDataChange = (value: number) => {
    setSUData((prev) => ({
      ...prev,
      currentIncome: value,
    }));

    // Notify parent component if callback provided - but keep this separate from the suBrutto value
    if (onSuChange) {
      onSuChange(value);
    }

    if (INCOME_CEILING <= suData.currentIncome + (value - suData.currentIncome)) {
      toastService.error("YOU HAVE USED 100% OF YOUR LIMIT");
    }
  };

  // Handle year change
  const handleYearChange = (year: string) => {
    setSelectedYear(year);

    // Add any year-specific logic here
  };

  // Handle tax card change
  const handleTaxCardChange = (cardType: string) => {
    if (onTaxCardChange) {
      onTaxCardChange(cardType);
    }
  };

  // Handle housing status change
  const handleHousingChange = (status: string) => {
    if (onHousingChange) {
      onHousingChange(status);
    }
  };

  return (
    <div className="relative w-full rounded-lg border-2 border-gray-200 bg-white p-4 md:p-5">
      <h2 className="mb-4 text-center text-xl font-bold md:text-2xl">{t("studentGrant.title")}</h2>

      <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
        <select
          value={selectedYear}
          onChange={(e) => handleYearChange(e.target.value)}
          className="rounded border px-2 py-1 text-sm"
        >
          {AVAILABLE_YEARS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select
          value={housingStatus}
          onChange={(e) => handleHousingChange(e.target.value)}
          className="rounded border px-2 py-1 text-sm"
        >
          <option value={HOUSING_STATUS.AWAY.value}>{t("studentGrant.housingStatus.away")}</option>
          <option value={HOUSING_STATUS.WITH_PARENTS.value}>
            {t("studentGrant.housingStatus.withParents")}
          </option>
        </select>

        <select
          value={taxCard}
          onChange={(e) => handleTaxCardChange(e.target.value)}
          className="rounded border px-2 py-1 text-sm"
        >
          <option value={TAX_CARD_OPTIONS.MAIN.value}>
            {t("studentGrant.taxCardOptions.main")}
          </option>
          <option value={TAX_CARD_OPTIONS.SECONDARY.value}>
            {t("studentGrant.taxCardOptions.secondary")}
          </option>
        </select>
      </div>

      <div className="relative mb-6 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-36 w-36 rounded-full bg-white shadow-sm md:h-48 md:w-48"></div>
        </div>
        <div className="relative h-44 w-44 md:h-56 md:w-56">
          <svg viewBox="0 0 36 36" className="h-full w-full">
            {/* Background circle */}
            <path d={progressPaths.backgroundPath} fill="none" stroke="#f1f1f1" strokeWidth="3" />
            {/* Progress arc */}
            <path
              d={progressPaths.backgroundPath}
              fill="none"
              stroke="#0844BD"
              strokeWidth="3"
              strokeDasharray={progressPaths.strokeDasharray}
              strokeDashoffset={progressPaths.strokeDashoffset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold md:text-4xl">{percentage}%</span>
            <p className="text-sm text-gray-500">{t("studentGrant.incomeCeiling")}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-lg bg-gray-100 p-3">
          <div>
            <p className="text-sm text-gray-600">{t("studentGrant.remainingEarnings")}</p>
            <p className="font-semibold text-accent">{remainingEarnings.toLocaleString()} kr.</p>
            <p className="text-xs text-gray-500">
              {t("studentGrant.maxIncome")}: {suData.incomeCeiling.toLocaleString()} kr.
            </p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-gray-100 p-3">
          <div>
            <p className="text-sm text-gray-600">{t("studentGrant.monthlyGrant")}</p>
            <p className="font-semibold">
              {suBrutto?.toLocaleString() || "7,086"} kr. ({t("studentGrant.gross")})
            </p>
            <div className="text-xs text-gray-500">
              <p>
                {t("studentGrant.taxCard")}:{" "}
                {taxCard === TAX_CARD_OPTIONS.MAIN.value
                  ? t("studentGrant.taxCardOptions.main")
                  : t("studentGrant.taxCardOptions.secondary")}
              </p>
              <p>
                {t("studentGrant.housing")}:{" "}
                {housingStatus === HOUSING_STATUS.AWAY.value
                  ? t("studentGrant.housingStatus.away")
                  : t("studentGrant.housingStatus.withParents")}
              </p>
            </div>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </div>
      </div>

      {/* Slider with accent styling and filled progress */}
      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between">
          <label className="text-sm text-gray-700">{t("studentGrant.currentIncome")}</label>
          <span className="text-sm font-semibold text-accent">
            {suData.currentIncome.toLocaleString()} kr.
          </span>
        </div>
        <input
          type="range"
          min="0"
          max={suData.incomeCeiling}
          value={suData.currentIncome}
          onChange={(e) => handleSuDataChange(parseInt(e.target.value))}
          style={{
            background: `linear-gradient(to right, #0844BD 0%, #0844BD ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
          }}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-track]:h-2 [&::-webkit-slider-track]:w-full [&::-webkit-slider-track]:bg-transparent"
        />
      </div>
    </div>
  );
}

// Default export as a standalone component with no props
export default function DefaultSUSection() {
  return <SUSection />;
}
