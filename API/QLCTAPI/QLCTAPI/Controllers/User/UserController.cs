﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLCTAPI.Models;

namespace QLCTAPI.Controllers.User
{
    [Route("Users/")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly QuanLyChiTieuContext _context;

        public UserController(QuanLyChiTieuContext context)
        {
            _context = context;
        }

        [HttpGet("CheckExistedEmail")]
        public async Task<ActionResult> CheckExistedEmail(string email)
        {
            var user = await _context.Users.Where(u => u.Email.Equals(email)).FirstOrDefaultAsync();

            if (user == null)
            {
                return BadRequest(new { ErrorCode = ErrorCode.NOTEXISTEDEMAIL });
            }

            return Ok(new { ErrorCode = ErrorCode.EXISTEDEMAIL });
        }

        [HttpGet("ActiveUser")]
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
    }
}