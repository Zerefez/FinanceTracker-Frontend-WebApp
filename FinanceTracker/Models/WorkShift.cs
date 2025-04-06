using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Models;

[PrimaryKey(nameof(StartTime), nameof(EndTime), nameof(FinanceUserId))]
public class WorkShift
{
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public int FinanceUserId { get; set; }
    public FinanceUser User { get; set; }
    public Paycheck Paycheck { get; set; }

}