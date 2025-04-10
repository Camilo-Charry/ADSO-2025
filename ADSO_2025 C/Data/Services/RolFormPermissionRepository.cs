using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Entity.Context;
using Entity.DTOs;
using Entity.Model;
using Microsoft.EntityFrameworkCore;

namespace Data.Services
{
    public class RolFormPermissionRepository : Repository<RolFormPermission>
    {
        public RolFormPermissionRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<RolFormPermissionDto>> GetAllJoinAsync()
        {
            return await _dbSet
                .Include(x => x.Rol)
                .Include(x => x.Form)
                .Include(x => x.Permission)
                .Where(e => EF.Property<bool>(e, "isdeleted") == false)
                .Select(rfp => new RolFormPermissionDto
                {
                   Id = rfp.id,
                   RolId = rfp.rolid,
                   FormId = rfp.formid,
                   Permissionid = rfp.permissionid,
                   RolName = rfp.Rol.name,
                   FormName = rfp.Form.name,
                   PermissionName = rfp.Permission.name,
                   
                })
                .ToListAsync();
        }

    }
}
