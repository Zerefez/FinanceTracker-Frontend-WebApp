using System.ComponentModel.DataAnnotations;

namespace FinanceTracker.Models
{
    public class Paycheck
    {
        [Key]
        public DateOnly SalaryPeriod { get; set; }

        public string Tax { get; set; }
        public decimal SalarayBeforeTax { get; set; }
        public decimal HolidaySupplement { get; set; }
        public decimal Pension { get; set; }
        public decimal Holidaycompensation { get; set; }

        public decimal taxDeduction { get; set; }

        public decimal AMContribution { get; set; }
        public TimeOnly WorkedHours { get; set; }

        public ICollection<WorkShift> WorkShift { get; set; }
    }
}
