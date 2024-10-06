using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLCTAPI.Models;
using System.Net.Http;

namespace QLCTAPI.Controllers.VerifyCode
{
    [Route("verifycodes/")]
    [ApiController]
    public class VerifyCodeController : ControllerBase
    {
        private readonly QuanLyChiTieuContext _context;

        public VerifyCodeController(QuanLyChiTieuContext context)
        {
            _context = context;
        }

        [HttpGet("verify")]
        public async Task<ActionResult> VerifyCode(string email, string code)
        {
            if (await new Common().VerifyCode(email, code))
            {
                return Ok(new { ErrorCode = ErrorCode.VERIFYCODESUCCESS });
            }

            return BadRequest(new { ErrorCode = ErrorCode.VERIFYCODEFAIL });
        }

        [HttpGet("verifycodebylink")]
        public async Task<ActionResult> VerifyCodeByLink(string email, string code)
        {
            if (await new Common().VerifyCode(email, code))
            {
                return Ok(new { ErrorCode = ErrorCode.VERIFYCODESUCCESS, Message = "Xác thực thành công, hãy quay lại ứng dụng để tiếp tục" });
            }

            return BadRequest(new { ErrorCode = ErrorCode.VERIFYCODEFAIL, Message = "Xảy ra lỗi, mã xác nhận đã hết hạn" });
        }

        [HttpGet("check")]
        public async Task<ActionResult> CheckVerifyCode([FromQuery] string email)
        {
            var verifyCode = await _context.VerifyCodes.Where(vc => vc.Email == email && vc.ExpiredDate > DateTime.Now).FirstOrDefaultAsync();

            if ((bool)verifyCode.IsVerify)
            {
                verifyCode.IsVerify = false;

                await _context.SaveChangesAsync();

                return Ok(new { ErrorCode = ErrorCode.VERIFYCODESUCCESS });
            }

            return BadRequest(new { ErrorCode = ErrorCode.VERIFYCODEFAIL });
        }
    }
}
