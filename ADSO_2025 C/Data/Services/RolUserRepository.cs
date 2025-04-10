

using Data.Interfaces;
using Entity.Context;
using Entity.DTOs;
using Entity.Model;
using Microsoft.EntityFrameworkCore;

namespace Data.Services
{
    public class RolUserRepository : Repository<RolUser>
    {
        public RolUserRepository(ApplicationDbContext context) : base(context)
        {
        }


        public async Task<IEnumerable<RolUserDto>> GetAllJoinAsync()
        {
            return await _dbSet
                .Include(x => x.User)
                .Include(x => x.Rol)
                .Where(e => EF.Property<bool>(e, "isdeleted") == false)
                .Select(ru => new RolUserDto
                {
                    Id = ru.id,
                    UserId = ru.userid,
                    RolId = ru.rolid,
                    UserName = ru.User.username,
                    RolName = ru.Rol.name
                })
                .ToListAsync();
        }

    }
}
