import { useState } from 'react';
import AnimatedText from "../components/ui/animatedText";

export default function SUSection() {
  const [selectedYear, setSelectedYear] = useState('2025');

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
        <p className="text-sm text-gray-500">Updated 17/03-2025</p>
      </div>
      
      <div className="relative flex justify-center items-center mb-4">
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="w-48 h-48 bg-white rounded-full shadow-lg"></div>
        </div>
        <div className="w-56 h-56 relative">
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <path 
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#eee"
              strokeWidth="3"
            />
            <path 
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#FF6B6B"
              strokeWidth="3"
              strokeDasharray="4, 100"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <span className="text-3xl font-bold">4%</span>
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
            <p className="font-semibold">228.138 kr.</p>
            <p className="text-xs text-gray-500">Amount for AM contribution: 247.976 kr.</p>
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
    </div>
  );
}