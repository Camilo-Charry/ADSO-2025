using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.DTOs
{
    public class FormDto
    {
        public int id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        //public DateTime createddate { get; set; }
        public bool active { get; set; }
        //public bool isdeleted { get; set; }

    }
}
