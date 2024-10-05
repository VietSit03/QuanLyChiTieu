namespace QLCTAPI.Controllers.Schedule
{
    public class ScheduleRequest
    {
        public int CategoryCustomId { get; set; }
        public string? Name { get; set; }
        public string? Type { get; set; }
        public decimal? Money { get; set; }
        public string? FrequencyId { get; set; }
        public string? StartDate { get; set; }
        public string? EndDate { get; set; }
        public string? Note { get; set; }
    }
}
