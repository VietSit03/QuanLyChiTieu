namespace QLCTAPI.Controllers.UserCategoryCustom
{
    public class Response
    {
        public string ErrorCode { get; set; }
        public List<CustomCategoryDTOResponse> Data { get; set; }
    }

    public class CustomCategoryDTOResponse
    {
        public int Id { get; set; }
        public int CategoryId { get; set; }
        public string? ImgSrc { get; set; }
        public string? Name { get; set; }
        public string? Color { get; set; }

    }
}
