using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data.Interfaces;
using Entity.Context;
using Entity.Model;
using Microsoft.EntityFrameworkCore;
using static Dapper.SqlMapper;

namespace Data.Services
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected readonly ApplicationDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public Repository(ApplicationDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet
                .Where(e => EF.Property<bool>(e, "isdeleted") == false)
                .ToListAsync();
        }

        public async Task<T?> GetByIdAsync(int id)
        {
            var entity = await _dbSet.FindAsync(id);
            if (entity == null)
                return null;

            var isDeleted = (bool?)entity.GetType().GetProperty("isdeleted")?.GetValue(entity);

            return isDeleted == false ? entity : null;
        }


        public async Task<T> CreateAsync(T entity)
        {
            entity.GetType().GetProperty("isdeleted")?.SetValue(entity, false);

            _dbSet.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<bool> UpdateAsync(T entity) 
        { 
            _context.Entry(entity).State = EntityState.Modified; 
            await _context.SaveChangesAsync(); 
            return true; 
        }
        public async Task<bool> DeleteAsync(int id) 
        { 
            var entity = await _dbSet.FindAsync(id); 
            if (entity == null) 
                return false; 
            _dbSet.Remove(entity); await _context.SaveChangesAsync(); 
            return true; 
        }
        public async Task<bool> DeleteLogicalAsync(int id) { 
            var entity = await _dbSet.FindAsync(id); 
            if (entity == null) 
                return false; 
            entity.GetType().GetProperty("isdeleted")?.SetValue(entity, true); 
            _context.Entry(entity).State = EntityState.Modified; 
            await _context.SaveChangesAsync(); 
            return true; 
        }

    }
}
