using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.Model
{
    public class Person
    {
        public int id { get; set; }
        public string firstname { get; set; }
        public string lastname { get; set; }
        public string phonenumber { get; set; }
        public bool active { get; set; }
        public bool isdeleted { get; set; }
        public User User { get; set; }
    }
}
