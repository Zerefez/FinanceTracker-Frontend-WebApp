import { useState } from 'react';
import AnimatedText from "../components/ui/animation/animatedText";

interface SUData {
  incomeCeiling: number;
  currentIncome: number;
  maxEarnable: number;
  updatedDate: string;
}

export default function SUSection() {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [suData, setSUData] = useState<SUData>({
    incomeCeiling: 247976,
    currentIncome: 10000,
    maxEarnable: 228138,
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

  return (
    <div className="w-full rounded-lg border-2 border-gray-200 p-5">
      <AnimatedText
        phrases={["Student Grant Overview [SU]"]}
        accentWords={["[SU]"]}
        className="mb-4 text-center text-2xl font-bold md:text-3xl lg:text-4xl"
        accentClassName="text-accent"
      />
      
      <div className="flex items-center justify-between mb-4">
        <select 
          value={selectedYear} 
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
        </select>
        <p className="text-sm text-gray-500">Updated {suData.updatedDate}</p>
      </div>
      
      <div className="relative flex justify-center items-center mb-4">
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="w-48 h-48 bg-white rounded-full shadow-lg"></div>
        </div>
        <div className="w-56 h-56 relative">
          <svg viewBox="0 0 36 36" className="w-full h-full">
            {/* Background circle */}
            <path 
              d={progressPaths.backgroundPath}
              fill="none"
              stroke="#eee"
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
            <span className="text-3xl font-bold">{percentage}%</span>
            <AnimatedText
              phrases={["of your income ceiling"]}
              className="text-sm text-gray-500"
              accentClassName="text-accent"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="bg-gray-100 rounded-lg p-3 flex justify-between items-center">
          <div>
            <AnimatedText
              phrases={["How much more you can earn"]}
              className="text-sm text-gray-600"
              accentClassName="text-accent"
            />
            <p className="font-semibold text-accent">{suData.maxEarnable.toLocaleString()} kr.</p>
            <p className="text-xs text-gray-500">
              Amount for AM contribution: {suData.incomeCeiling.toLocaleString()} kr.
            </p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </div>
        
        <div className="bg-gray-100 rounded-lg p-3 flex justify-between items-center">
          <div>
            <AnimatedText
              phrases={["How many more hours you can work"]}
              className="text-sm text-gray-600"
              accentClassName="text-accent"
            />
            <p className="font-semibold">-</p>
            <p className="text-xs text-gray-500">Enter your timesheet to see remaining hours</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </div>
      </div>

      {/* Slider with accent styling and filled progress */}
      <div className="mt-4 px-2">
        <div className="flex justify-between items-center mb-2">
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
          onChange={(e) => setSUData(prev => ({
            ...prev, 
            currentIncome: Number(e.target.value)
          }))}
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