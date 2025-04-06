using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Models;

[PrimaryKey(nameof(StartTime), nameof(EndTime), nameof(CVR))]
public class SupplementDetails
{
    public DayOfWeek Weekday { get; set; }
    public decimal Amount { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public int CVR { get; set; }
    public Job Job { get; set; }

}