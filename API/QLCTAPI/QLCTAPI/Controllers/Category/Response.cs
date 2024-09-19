using QLCTAPI.DTOs;
using QLCTAPI.Models;

namespace QLCTAPI.Controllers.Category
{
    public class Response
    {
        public string message { get; set; }
        public List<CategoryDTO> data { get; set; }
        public Response(string message, List<CategoryDTO> list) {
            this.message = message;
            this.data = list;
        }
    }
}
