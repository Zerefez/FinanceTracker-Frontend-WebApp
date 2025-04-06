using Microsoft.EntityFrameworkCore;
using FinanceTracker.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace FinanceTracker.DataAccess;

public class FinanceTrackerContext : IdentityDbContext<FinanceUser>
{
    public FinanceTrackerContext(DbContextOptions<FinanceTrackerContext> options)
          : base(options)
    {
    }

    public DbSet<FinanceUser> Users { get; set; }
    public DbSet<WorkShift> WorkShifts { get; set; }
    public DbSet<Job> Jobs { get; set; }
    public DbSet<Paycheck> Paychecks { get; set; }
    public DbSet<SupplementDetails> supplementPays { get; set; }



}