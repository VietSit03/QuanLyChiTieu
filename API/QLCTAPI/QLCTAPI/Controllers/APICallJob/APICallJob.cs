using QLCTAPI;
using Quartz;
using System;
using System.Net.Http;
using System.Threading.Tasks;

public class APICallJob : IJob
{
    private readonly HttpClient _httpClient;

    public APICallJob(IHttpClientFactory httpClientFactory)
    {
        _httpClient = httpClientFactory.CreateClient();
    }

    public async Task Execute(IJobExecutionContext context)
    {
        try
        {
            var response = await _httpClient.GetAsync(Config.API_URL + "/schedules/refresh");
            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadAsStringAsync();
                Console.WriteLine("API called successfully: " + data);
            }
            else
            {
                Console.WriteLine("Error calling API: " + response.StatusCode);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("Exception in API call: " + ex.Message);
        }
    }
}
