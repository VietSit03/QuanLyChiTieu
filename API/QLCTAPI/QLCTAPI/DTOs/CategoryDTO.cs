using QLCTAPI.Models;

namespace QLCTAPI.DTOs
{
    public class ListCategoryDTO
    {
        public string purposeName { get; set; }
        public List<CategoryDefine> categories { get; set; }
    }

    public class CategoryDTO
    {
        public int id { get; set; }
        public string imgSrc { get; set; }
    }
}
