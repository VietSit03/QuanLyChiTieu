namespace QLCTAPI.Controllers.UserCategoryCustom
{
    public class UCCRequest
    {
        public int CategoryID { get; set; }
        public string? CategoryName { get; set; }
        public string? CategoryColor { get; set; }
        public string? Type { get; set; }
    }
    public class ChangeOrderUCCRequest
    {
        public List<ChangeOrder> Categories { get; set; }
    }
    public class ChangeOrder
    {
        public int Id { get; set; }
        public int? CategoryOrder { get; set; }
    }
}
