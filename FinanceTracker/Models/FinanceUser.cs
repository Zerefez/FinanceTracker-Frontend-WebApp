namespace FinanceTracker.Models;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
public class FinanceUser : IdentityUser
{
    public int Age { get; set; }
    public ICollection<Job> Jobs { get; set; }
    public ICollection<WorkShift> WorkShifts { get; set; }

}