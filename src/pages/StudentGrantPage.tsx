import { SUSection } from '../components/SU';
import AnimatedText from "../components/ui/animation/animatedText";
import { AVAILABLE_YEARS, HOUSING_STATUS, TAX_CARD_OPTIONS } from "../data/studentGrantData";
import { useStudentGrant } from "../lib/hooks/useStudentGrant";

export default function StudentGrant() {
  const {
    year,
    messageNumber,
    totalMessages,
    suBrutto,
    taxCard,
    housingStatus,
    monthsData,
    totalBrutto,
    totalNetto,
    handleSuBruttoChange,
    handleTaxCardChange,
    handleHousingChange,
    handleYearChange,
    handleMessageNumberChange
  } = useStudentGrant();

  return (
    <section className="p-3 md:p-6 max-w-6xl mx-auto">
      <div className="mb-4 md:mb-6">
        <AnimatedText
          phrases={["Student Grant Overview"]}
          className="text-2xl md:text-3xl font-bold mb-2"
          accentClassName="text-accent"
        />
        <p className="text-gray-600 text-right text-sm md:text-base">Retrieved: 26.04.2025 11:11</p>
      </div>
      
      <div className="mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Based on grant notification from 21.03.2025</h2>
        <p className="text-gray-700 text-sm md:text-base">
          Here you can see how much student grant you receive each month. You can also see how much tax is deducted.
          At the bottom of the table under 'Total', you can see what you are entitled to throughout the year.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-center lg:justify-between mb-4 md:mb-6 gap-y-2 gap-x-4">
        <div className="flex items-center">
          <label className="whitespace-nowrap mr-2 text-sm md:text-base w-24 md:w-auto">Grant Year:</label>
          <select 
            value={year} 
            onChange={(e) => handleYearChange(e.target.value)}
            className="border rounded px-2 py-1 text-sm md:text-base flex-grow md:flex-grow-0"
          >
            {AVAILABLE_YEARS.map(yearOption => (
              <option key={yearOption} value={yearOption}>{yearOption}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center">
          <label className="whitespace-nowrap mr-2 text-sm md:text-base w-24 md:w-auto">Grant Notice:</label>
          <select 
            value={messageNumber} 
            onChange={(e) => handleMessageNumberChange(e.target.value)}
            className="border rounded px-2 py-1 text-sm md:text-base"
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
          <span className="mx-1 text-sm md:text-base">of</span>
          <span className="text-sm md:text-base">{totalMessages}</span>
        </div>
        
        <div className="flex items-center">
          <label className="whitespace-nowrap mr-2 text-sm md:text-base w-24 md:w-auto">Housing:</label>
          <select 
            value={housingStatus} 
            onChange={(e) => handleHousingChange(e.target.value)}
            className="border rounded px-2 py-1 text-sm md:text-base flex-grow md:flex-grow-0"
          >
            <option value={HOUSING_STATUS.AWAY.value}>{HOUSING_STATUS.AWAY.label}</option>
            <option value={HOUSING_STATUS.WITH_PARENTS.value}>{HOUSING_STATUS.WITH_PARENTS.label}</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <label className="whitespace-nowrap mr-2 text-sm md:text-base w-24 md:w-auto">Tax Card:</label>
          <select 
            value={taxCard} 
            onChange={(e) => handleTaxCardChange(e.target.value)}
            className="border rounded px-2 py-1 text-sm md:text-base flex-grow md:flex-grow-0"
          >
            <option value={TAX_CARD_OPTIONS.MAIN.value}>{TAX_CARD_OPTIONS.MAIN.label}</option>
            <option value={TAX_CARD_OPTIONS.SECONDARY.value}>{TAX_CARD_OPTIONS.SECONDARY.label}</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <label className="whitespace-nowrap mr-2 text-sm md:text-base w-24 md:w-auto">Grant (gross):</label>
          <input
            type="number"
            value={suBrutto}
            onChange={(e) => handleSuBruttoChange(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm md:text-base w-24"
            min="0"
            step="1"
          />
          <span className="ml-2 text-sm md:text-base">kr.</span>
        </div>
      </div>
      
      <div className="overflow-x-auto mb-6 md:mb-8 -mx-3 px-3 md:mx-0 md:px-0">
        <table className="min-w-full border-collapse border border-gray-300 text-sm md:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-2 py-1 md:px-4 md:py-2 text-left">Month</th>
              <th className="border border-gray-300 px-2 py-1 md:px-4 md:py-2 text-left">Status</th>
              <th className="border border-gray-300 px-2 py-1 md:px-4 md:py-2 text-left">Housing</th>
              <th className="border border-gray-300 px-2 py-1 md:px-4 md:py-2 text-left">Person Status</th>
              <th className="border border-gray-300 px-2 py-1 md:px-4 md:py-2 text-right">Gross Amount</th>
              <th className="border border-gray-300 px-2 py-1 md:px-4 md:py-2 text-right">Supplements</th>
              <th className="border border-gray-300 px-2 py-1 md:px-4 md:py-2 text-right">Tax</th>
              <th className="border border-gray-300 px-2 py-1 md:px-4 md:py-2 text-right">Net Amount</th>
            </tr>
          </thead>
          <tbody>
            {monthsData.map((month, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">{month.month}</td>
                <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">{month.status}</td>
                <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">{month.housing}</td>
                <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">{month.personStatus}</td>
                <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2 text-right">{month.brutto.toLocaleString()} kr.</td>
                <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2 text-right">{month.supplement} kr.</td>
                <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2 text-right">{month.tax.toLocaleString()} kr.</td>
                <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2 text-right">{month.netto.toLocaleString()} kr.</td>
              </tr>
            ))}
            <tr className="bg-gray-200 font-bold">
              <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">Total</td>
              <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2" colSpan={3}></td>
              <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2 text-right">{totalBrutto.toLocaleString()} kr.</td>
              <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2"></td>
              <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2"></td>
              <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2 text-right">{totalNetto.toLocaleString()} kr.</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mb-6 md:mb-8">
        <SUSection 
          suBrutto={suBrutto} 
          taxCard={taxCard} 
          housingStatus={housingStatus}
          onTaxCardChange={handleTaxCardChange}
          onHousingChange={handleHousingChange}
        />
      </div>
    </section>
  );
}
