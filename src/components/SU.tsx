import { useState } from 'react';
import { AVAILABLE_YEARS, HOUSING_STATUS, INCOME_CEILING, MAX_EARNABLE, TAX_CARD_OPTIONS } from '../data/studentGrantData';

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
  onHousingChange 
}: SUProps) {
  const [selectedYear, setSelectedYear] = useState(AVAILABLE_YEARS[0]);
  const [suData, setSUData] = useState<SUData>({
    incomeCeiling: INCOME_CEILING,
    currentIncome: 10000,
    maxEarnable: MAX_EARNABLE,
    updatedDate: '17/03-2025'
  });

  // Calculate percentage dynamically
  const calculatePercentage = () => {
    return Math.min(
      Math.round((suData.currentIncome / suData.incomeCeiling) * 100), 
      100
    );
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
      strokeDashoffset: dashOffset
    };
  };

  const percentage = calculatePercentage();
  const progressPaths = generateProgressPath(percentage);

  // Handle SU brutto change from slider
  const handleSuDataChange = (value: number) => {
    setSUData(prev => ({
      ...prev, 
      currentIncome: value
    }));
    
    // Notify parent component if callback provided
    if (onSuChange) {
      onSuChange(value);
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
    <div className="w-full rounded-lg border-2 border-gray-200 p-4 md:p-5 bg-white relative">
      <h2 className="mb-4 text-center text-xl md:text-2xl font-bold">
        Student <span className="text-accent">Grant</span> Dashboard
      </h2>
      
      <div className="flex flex-wrap items-center justify-center mb-4 gap-2">
        <select 
          value={selectedYear} 
          onChange={(e) => handleYearChange(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          {AVAILABLE_YEARS.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        
        <select 
          value={housingStatus} 
          onChange={(e) => handleHousingChange(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value={HOUSING_STATUS.AWAY.value}>{HOUSING_STATUS.AWAY.label}</option>
          <option value={HOUSING_STATUS.WITH_PARENTS.value}>{HOUSING_STATUS.WITH_PARENTS.label}</option>
        </select>
        
        <select 
          value={taxCard} 
          onChange={(e) => handleTaxCardChange(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value={TAX_CARD_OPTIONS.MAIN.value}>{TAX_CARD_OPTIONS.MAIN.label}</option>
          <option value={TAX_CARD_OPTIONS.SECONDARY.value}>{TAX_CARD_OPTIONS.SECONDARY.label}</option>
        </select>
      </div>
      
      <div className="relative flex justify-center items-center mb-6">
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="w-36 h-36 md:w-48 md:h-48 bg-white rounded-full shadow-sm"></div>
        </div>
        <div className="w-44 h-44 md:w-56 md:h-56 relative">
          <svg viewBox="0 0 36 36" className="w-full h-full">
            {/* Background circle */}
            <path 
              d={progressPaths.backgroundPath}
              fill="none"
              stroke="#f1f1f1"
              strokeWidth="3"
            />
            {/* Progress arc */}
            <path 
              d={progressPaths.backgroundPath}
              fill="none"
              stroke="#FF6B6B"
              strokeWidth="3"
              strokeDasharray={progressPaths.strokeDasharray}
              strokeDashoffset={progressPaths.strokeDashoffset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <span className="text-3xl md:text-4xl font-bold">{percentage}%</span>
            <p className="text-sm text-gray-500">of your income ceiling</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="bg-gray-100 rounded-lg p-3 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Remaining earnings allowance</p>
            <p className="font-semibold text-accent">{suData.maxEarnable.toLocaleString()} kr.</p>
            <p className="text-xs text-gray-500">
              Maximum income ceiling: {suData.incomeCeiling.toLocaleString()} kr.
            </p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </div>
        
        <div className="bg-gray-100 rounded-lg p-3 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Your monthly grant payment</p>
            <p className="font-semibold">{suBrutto?.toLocaleString() || '7,086'} kr. (gross)</p>
            <div className="text-xs text-gray-500">
              <p>Tax card: {taxCard === TAX_CARD_OPTIONS.MAIN.value ? TAX_CARD_OPTIONS.MAIN.label : TAX_CARD_OPTIONS.SECONDARY.label}</p>
              <p>Housing: {housingStatus === HOUSING_STATUS.AWAY.value ? HOUSING_STATUS.AWAY.label : HOUSING_STATUS.WITH_PARENTS.label}</p>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </div>
      </div>

      {/* Slider with accent styling and filled progress */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm text-gray-700">Current Income</label>
          <span className="text-sm font-semibold text-accent">
            {suData.currentIncome.toLocaleString()} kr.
          </span>
        </div>
        <input 
          type="range" 
          min="0" 
          max={suData.incomeCeiling} 
          value={suData.currentIncome}
          onChange={(e) => handleSuDataChange(Number(e.target.value))}
          style={{
            background: `linear-gradient(to right, 
              #FF6B6B 0%, 
              #FF6B6B ${(suData.currentIncome / suData.incomeCeiling) * 100}%, 
              #e5e7eb ${(suData.currentIncome / suData.incomeCeiling) * 100}%, 
              #e5e7eb 100%)`
          }}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer 
            [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:w-4 
            [&::-webkit-slider-thumb]:h-4 
            [&::-webkit-slider-thumb]:bg-accent 
            [&::-webkit-slider-thumb]:rounded-full 
            [&::-webkit-slider-track]:w-full 
            [&::-webkit-slider-track]:h-2 
            [&::-webkit-slider-track]:bg-transparent"
        />
      </div>
    </div>
  );
}

// Default export as a standalone component with no props
export default function DefaultSUSection() {
  return <SUSection />;
}