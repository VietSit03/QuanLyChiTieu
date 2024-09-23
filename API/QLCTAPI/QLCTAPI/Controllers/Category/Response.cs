using QLCTAPI.DTOs;
using QLCTAPI.Models;

namespace QLCTAPI.Controllers.Category
{
    public class CategoryByTypeResponse
    {
        public string ErrorCode { get; set; }
        public List<ListCategoryDTO> Data { get; set; }
    }
    public class CategoryAddResponse
    {
        public string ErrorCode { get; set; }
        public List<CategoryDTO> Data { get; set; }
    }
}
