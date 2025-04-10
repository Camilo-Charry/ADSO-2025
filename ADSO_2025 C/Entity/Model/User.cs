using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Identity.Client;

namespace Entity.Model
{
    public class User // uno 
    {
        public int id { get; set; }
        public string username { get; set; } 

        public string email { get; set; } 
        public string password { get; set; }
        //public DateTime createddate { get; set; }
        public bool active { get; set; }
        public bool isdeleted { get; set; }
        public int personid { get; set; }

        public Person? person { get; set; }
    }

}
