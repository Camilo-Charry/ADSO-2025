using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.Model
{
    public class RolUser // Mucho
    {
        public int id { get; set; }
        public int rolid { get; set; }
        public int userid { get; set; }
        //public bool Active { get; set; }
        public bool isdeleted { get; set; }

        public rol? Rol { get; set; }
        public User? User { get; set; }
    }
}
