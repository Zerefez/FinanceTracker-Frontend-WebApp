using FinanceTracker.DataAccess;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;


public class DataAccessService<T> : IDataAccessService<T> where T : class
{
    private readonly FinanceTrackerContext _context;
    private readonly DbSet<T> _dbSet;


    public DataAccessService(FinanceTrackerContext context)
    {
        _context = context;
        _dbSet = _context.Set<T>();
    }

    public async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public async Task<T?> GetByIdAsync(params object[] keyValues)
    {
        return await _dbSet.FindAsync(keyValues);
    }

    public async Task AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(T entity)
    {
        _dbSet.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(T entity)
    {
        _dbSet.Remove(entity);
        await _context.SaveChangesAsync();
    }
}
