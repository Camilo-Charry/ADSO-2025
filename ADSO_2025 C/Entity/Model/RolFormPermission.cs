using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.Model
{
    public class RolFormPermission
    {
        public int id { get; set; }
        public bool isdeleted { get; set; }
        public int rolid { get; set; }
        public int formid { get; set; }
        public int permissionid { get; set; }
        public rol Rol { get; set; }
        public Form Form { get; set; }
        public Permission Permission { get; set; }

    }
}
