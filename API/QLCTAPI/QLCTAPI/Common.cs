using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLCTAPI.DTOs;
using QLCTAPI.Models;
using System.Net.Http;
using System.Text;

namespace QLCTAPI
{
    public class Common
    {
        private readonly QuanLyChiTieuContext _context = new QuanLyChiTieuContext();
        private readonly HttpClient _httpClient = new HttpClient();

        public Common() { }

        public async Task<bool> CheckToken(string token)
        {
            var expireToken = await _context.UserTokens
                .Where(ut => ut.Token.Equals(token))
                .Select(x => x.ExpiredDate)
                .FirstOrDefaultAsync();

            if (expireToken < DateTime.Now || expireToken == null)
            {
                return false;
            }

            return true;
        }

        public async Task<bool> SendEmailAsync(MailDTO request)
        {
            var data = new
            {
                service_id = Mail.SERVICEID,
                template_id = request.TemplateID,
                user_id = Mail.USERID,
                accessToken = Mail.ACCESSTOKEN,
                template_params = new
                {
                    API_URL = Config.API_URL,
                    from_name = Mail.FROMNAME,
                    to_mail = request.Email,
                    to_name = request.Name,
                    otherParams = request.Params,
                }
            };

            var json = System.Text.Json.JsonSerializer.Serialize(data);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            try
            {
                var response = await _httpClient.PostAsync("https://api.emailjs.com/api/v1.0/email/send", content);

                response.EnsureSuccessStatusCode();

                return true;
            }
            catch (HttpRequestException e)
            {
                return false;
            }
        }

        public async Task<bool> VerifyCode(string email, string code)
        {
            var obj = await _context.VerifyCodes
                .Where(vc => !vc.IsVerify.Value && vc.Email.Equals(email) && vc.Code.Equals(code))
                .FirstOrDefaultAsync();

            if (obj == null || obj.ExpiredDate < DateTime.Now)
            {
                return false;
            }

            obj.IsVerify = true;

            await _context.SaveChangesAsync();

            return true;
        }
    }
}
