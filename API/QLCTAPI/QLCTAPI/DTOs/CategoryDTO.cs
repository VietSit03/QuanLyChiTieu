using QLCTAPI.Models;

namespace QLCTAPI.DTOs
{
    public class CategoryDTO
    {
        public string purposeName { get; set; }
        public List<CategoryDefine> categories { get; set; }
    }
}
