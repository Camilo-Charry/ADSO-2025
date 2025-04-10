using Entity.Model;

public class Module
{
    public int id { get; set; }
    public string name { get; set; }
    public string description { get; set; }
    //public DateTime createddate { get; set; }
    public bool active { get; set; }
    public bool isdeleted { get; set; }

    public virtual ICollection<FormModule> FormModules { get; set; } = new List<FormModule>();

}