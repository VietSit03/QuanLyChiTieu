using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using QLCTAPI.Models;
using System.Security.Claims;

namespace QLCTAPI.Controllers.User
{
    [Route("users/")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly QuanLyChiTieuContext _context;

        public UserController(QuanLyChiTieuContext context)
        {
            _context = context;
        }

        [HttpGet("checkexistedemail")]
        public async Task<ActionResult> CheckExistedEmail(string email)
        {
            var user = await _context.Users.Where(u => u.Email.Equals(email)).FirstOrDefaultAsync();

            if (user == null)
            {
                return BadRequest(new { ErrorCode = ErrorCode.NOTEXISTEDEMAIL });
            }

            return Ok(new { ErrorCode = ErrorCode.EXISTEDEMAIL });
        }

        [HttpGet("activeuser")]
        public async Task<ActionResult> ActiveUser(string email)
        {
            var user = await _context.Users.Where(u => u.Email.Equals(email)).FirstOrDefaultAsync();

            if (user == null)
            {
                return BadRequest(new { ErrorCode = ErrorCode.NOTEXISTEDUSER, Message = "Kích hoạt tài khoản thất bại, vui lòng thử lại sau" });
            }

            if (user.NumLoginFail == -1)
            {
                user.IsActive = true;
                user.NumLoginFail = 0;
            }
            else
            {
                return BadRequest(new { ErrorCode = ErrorCode.DISABLEDUSER, Message = "Kích hoạt tài khoản thất bại, bạn đã kích hoạt tài khoản lần đầu từ trước" });
            }

            await _context.SaveChangesAsync();

            return Ok(new { ErrorCode = ErrorCode.UPDATEDATASUCCESS, Message = "Kích hoạt tài khoản thành công, quay lại ứng dụng để tiếp tục" });
        }

        [HttpPut("changecurrency")]
        public async Task<ActionResult> ChangeCurrency([FromQuery] string code)
        {
            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (Guid.TryParse(userID, out var id))
            {
                var user = await _context.Users.Where(u => u.Id == id).FirstOrDefaultAsync();

                user.CurrencyCode = code;

                await _context.SaveChangesAsync();

                var newCur = await _context.CurrencyDefines.Where(cd => cd.CurrencyCode == code).FirstOrDefaultAsync();

                return Ok(new { ErrorCode = ErrorCode.UPDATEDATASUCCESS, Data = newCur });
            }
            return BadRequest(new { ErrorCode = ErrorCode.UPDATEDATAFAIL });
        }
    }
}
