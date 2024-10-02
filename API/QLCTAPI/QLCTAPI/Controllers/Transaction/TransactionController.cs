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

                var user = await _context.Users.Where(u => u.Id == id).FirstOrDefaultAsync();

                if (trans.Type == "CHI")
                {
                    user.Balance -= trans.Money;
                }
                else if (trans.Type == "THU")
                {
                    user.Balance += trans.Money;
                }

                await _context.SaveChangesAsync();

                trans.Status = "S";

                await _context.SaveChangesAsync();

                return Ok(new { ErrorCode = ErrorCode.CREATEDATASUCCESS });
            }

            return BadRequest(new { ErrorCode = ErrorCode.CREATEDATAFAIL });
        }

        [HttpGet("GetSummaryByType")]
        public async Task<ActionResult> GetSummaryByType([FromQuery] string type)
        {
            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (Guid.TryParse(userID, out var id))
            {
                var listTrans = await _context.Transactions.Where(t => t.UserId == id && t.Type == type && t.Status == "S").ToListAsync();

                var group = listTrans.GroupBy(lt => new { lt.UserId, lt.CategoryCustomId, lt.Type })
                    .Select(x => new
                    {
                        CategoryCustomId = x.Key.CategoryCustomId,
                        Budget = x.Sum(t => t.Money)
                    })
                    .OrderByDescending(x => x.Budget)
                    .ToList();

                var summary = group.Join(_context.UserCategoryCustoms,
                    g => g.CategoryCustomId,
                    ucc => ucc.Id,
                    (g, ucc) => new { g, ucc })
                    .Select(x => new SummaryByTypeResponse
                    {
                        CategoryCustomId = x.g.CategoryCustomId,
                        ImgSrc = _context.CategoryDefines.Where(cd => cd.Id == x.ucc.CategoryId).Select(x => x.ImgSrc).First(),
                        Color = x.ucc.CategoryColor,
                        CategoryName = x.ucc.CategoryName,
                        Budget = x.g.Budget,
                    })
                    .ToList();

                return Ok(new { ErrorCode = ErrorCode.GETDATASUCCESS, Data = summary });
            }

            return BadRequest(new { ErrorCode = ErrorCode.GETDATAFAIL });
        }

        [HttpGet("GetSummaryByCategory")]
        public async Task<ActionResult> GetSummaryByCategory([FromQuery] string type, [FromQuery] int categoryId)
        {
            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (Guid.TryParse(userID, out var id))
            {
                var listTrans = await _context.Transactions.Where(t => t.UserId == id && t.Type == type && (categoryId == 0 || t.CategoryCustomId == categoryId) && t.Status == "S").ToListAsync();

                var group = listTrans.GroupBy(lt => new { lt.UserId, lt.Type, lt.CreateAt.Value.Year, lt.CreateAt.Value.Month })
                    .Select(x => new
                    {
                        Budget = x.Sum(t => t.Money),
                        Count = x.Count(),
                        Year = x.Key.Year,
                        Month = x.Key.Month
                    })
                    .OrderByDescending(x => x.Year)
                    .ThenByDescending(x => x.Month)
                    .ToList();

                var summary = group.Select(x => new
                {
                    Budget = x.Budget,
                    Count = x.Count,
                    Time = x.Month + "-" + x.Year,
                })
                    .ToList();

                return Ok(new { ErrorCode = ErrorCode.GETDATASUCCESS, Data = summary });
            }

            return BadRequest(new { ErrorCode = ErrorCode.GETDATAFAIL });
        }

        [HttpGet("GetListByTime")]
        public async Task<ActionResult> GetListByTime([FromQuery] string type, [FromQuery] int categoryId, [FromQuery] string time)
        {
            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);
            string[] parts = time.Split('-');
            int month, year;

            if (Guid.TryParse(userID, out var id))
            {
                if (parts.Length == 2 && int.TryParse(parts[0], out month) && int.TryParse(parts[1], out year))
                {
                    var listTrans = await _context.Transactions
                    .Where(t => t.UserId == id && t.Type == type && (categoryId == 0 || t.CategoryCustomId == categoryId)
                            && t.Status == "S" && t.CreateAt.Value.Year == year && t.CreateAt.Value.Month == month)
                    .ToListAsync();

                    var group = listTrans.GroupBy(lt => new { lt.Id, lt.UserId, lt.Money, lt.CreateAt, lt.CategoryCustomId })
                        .Select(x => new
                        {
                            Id = x.Key.Id,
                            CategoryCustomId = x.Key.CategoryCustomId,
                            Money = x.Key.Money,
                            CreateAt = x.Key.CreateAt
                        })
                        .OrderByDescending(x => x.CreateAt)
                        .ToList();

                    var list = group.Join(_context.UserCategoryCustoms,
                        g => g.CategoryCustomId,
                        ucc => ucc.Id,
                        (g, ucc) => new { g, ucc })
                        .Join(_context.CategoryDefines,
                        y => y.ucc.CategoryId,
                        cd => cd.Id,
                        (y, cd) => new { y, cd })
                        .Select(x => new
                        {
                            Id = x.y.g.Id,
                            ImgSrc = x.cd.ImgSrc,
                            Color = x.y.ucc.CategoryColor,
                            CategoryName = x.y.ucc.CategoryName,
                            CreateAt = x.y.g.CreateAt,
                            Money = x.y.g.Money,
                        })
                        .ToList();


                    return Ok(new { ErrorCode = ErrorCode.GETDATASUCCESS, Data = list });
                }
                else
                {
                    return BadRequest(new { ErrorCode = ErrorCode.INCORRECTFORMAT });
                }
            }

            return BadRequest(new { ErrorCode = ErrorCode.GETDATAFAIL });
        }

        [HttpGet("GetListByMoney")]
        public async Task<ActionResult> GetListByMoney([FromQuery] string type, [FromQuery] int categoryId)
        {
            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (Guid.TryParse(userID, out var id))
            {
                var listTrans = await _context.Transactions
                .Where(t => t.UserId == id && t.Type == type && (categoryId == 0 || t.CategoryCustomId == categoryId) && t.Status == "S")
                .ToListAsync();

                var order = listTrans.GroupBy(lt => new { lt.Id, lt.Money, lt.CategoryCustomId, lt.CreateAt })
                    .Select(x => new
                    {
                        Id = x.Key.Id,
                        CategoryCustomId = x.Key.CategoryCustomId,
                        Money = x.Key.Money,
                        CreateAt = x.Key.CreateAt
                    })
                    .OrderByDescending(x => x.Money)
                    .ThenByDescending(x => x.CreateAt)
                    .ToList();

                var list = order.Join(_context.UserCategoryCustoms,
                    g => g.CategoryCustomId,
                    ucc => ucc.Id,
                    (g, ucc) => new { g, ucc })
                    .Join(_context.CategoryDefines,
                    y => y.ucc.CategoryId,
                    cd => cd.Id,
                    (y, cd) => new { y, cd })
                    .Select(x => new
                    {
                        Id = x.y.g.Id,
                        ImgSrc = x.cd.ImgSrc,
                        Color = x.y.ucc.CategoryColor,
                        CategoryName = x.y.ucc.CategoryName,
                        CreateAt = x.y.g.CreateAt,
                        Money = x.y.g.Money,
                    })
                    .ToList();


                return Ok(new { ErrorCode = ErrorCode.GETDATASUCCESS, Data = list });
            }

            return BadRequest(new { ErrorCode = ErrorCode.GETDATAFAIL });
        }

        [HttpGet("GetByTransId")]
        public async Task<ActionResult> GetByTransId([FromQuery] int transId)
        {
            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (Guid.TryParse(userID, out var id))
            {
                var trans = await _context.Transactions
                .Where(t => t.Id == transId && t.UserId == id)
                .FirstOrDefaultAsync();


                var category = await _context.UserCategoryCustoms.Where(ucc => ucc.Id == trans.CategoryCustomId)
                    .Join(_context.CategoryDefines,
                    ucc => ucc.CategoryId,
                    cd => cd.Id,
                    (ucc, cd) => new { ucc, cd })
                    .Select(x => new
                    {
                        ImgSrc = x.cd.ImgSrc,
                        Name = x.ucc.CategoryName,
                        Color = x.ucc.CategoryColor,
                    })
                    .FirstOrDefaultAsync();

                var img = await _context.TransactionImages.Where(ti => ti.TransactionId == transId).Select(x => x.ImgSrc).ToListAsync();

                var data = new
                {
                    Money = trans.Money,
                    Category = category,
                    CreateAt = trans.CreateAt,
                    Img = img,
                };


                return Ok(new { ErrorCode = ErrorCode.GETDATASUCCESS, Data = data });
            }

            return BadRequest(new { ErrorCode = ErrorCode.GETDATAFAIL });
        }

        [HttpDelete("Delete")]
        public async Task<ActionResult> Delete([FromQuery] int transId)
        {
            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (Guid.TryParse(userID, out var id))
            {
                var trans = await _context.Transactions
                .Where(t => t.Id == transId && t.UserId == id)
                .FirstOrDefaultAsync();

                if (trans != null)
                {
                    var transactionImages = await _context.TransactionImages
                        .Where(img => img.TransactionId == transId)
                        .ToListAsync();

                    _context.TransactionImages.RemoveRange(transactionImages);

                    await _context.SaveChangesAsync();

                    var user = await _context.Users.Where(u => u.Id == id).FirstOrDefaultAsync();

                    if (trans.Status == "S" && trans.Type == "CHI")
                    {
                        user.Balance += trans.Money;
                    }
                    else if (trans.Status == "S" && trans.Type == "THU")
                    {
                        user.Balance -= trans.Money;
                    }

                    await _context.SaveChangesAsync();
                }

                _context.Transactions.Remove(trans);

                await _context.SaveChangesAsync();


                return Ok(new { ErrorCode = ErrorCode.DELETEDATASUCCESS});
            }

            return BadRequest(new { ErrorCode = ErrorCode.DELETEDATAFAIL });
        }
    }
}
