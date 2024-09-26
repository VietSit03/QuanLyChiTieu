using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLCTAPI.Controllers.Currency;
using QLCTAPI.DTOs;
using QLCTAPI.Models;
using System.Security.Claims;

namespace QLCTAPI.Controllers.Transaction
{
    [Route("Transaction/")]
    [ApiController]
    [CustomAuthorize]
    public class TransactionController : ControllerBase
    {
        private readonly QuanLyChiTieuContext _context;

        public TransactionController(QuanLyChiTieuContext context)
        {
            _context = context;
        }


        [HttpPost("Add")]
        public async Task<ActionResult> AddTransaction([FromBody] AddRequest request)
        {
            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (Guid.TryParse(userID, out var id))
            {
                var trans = new Models.Transaction
                {
                    UserId = id,
                    CategoryCustomId = request.CategoryId,
                    Type = request.Type,
                    Money = request.Money,
                    CurrencyCode = request.CurrencyCode,
                    CreateAt = request.CreateAt,
                    Note = request.Note,
                    Status = "P"
                };

                await _context.Transactions.AddAsync(trans);

                await _context.SaveChangesAsync();

                foreach (var imgSrc in request.ImgSrc)
                {
                    await _context.AddAsync(new TransactionImage
                    {
                        TransactionId = trans.Id,
                        ImgSrc = imgSrc,
                    });
                }

                await _context.SaveChangesAsync();

                trans.Status = "S";

                await _context.SaveChangesAsync();

                return Ok(new { ErrorCode = ErrorCode.CREATEDATASUCCESS });
            }

            return BadRequest(new { ErrorCode = ErrorCode.CREATEDATAFAIL });
        }
    }
}
