using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.Model
{
    public class Form
    {

        public int id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        //public DateTime? createddate { get; set; } = DateTime.UtcNow;

        public bool active { get; set; }
        public bool isdeleted { get; set; }

        public virtual ICollection<FormModule> FormModules { get; set; } = new List<FormModule>();
        public virtual ICollection<RolFormPermission> RolFormPermission { get; set; } = new List<RolFormPermission>();

    }
}
