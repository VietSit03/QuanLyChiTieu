using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLCTAPI.Controllers.Currency;
using QLCTAPI.Controllers.User;
using QLCTAPI.DTOs;
using QLCTAPI.Models;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;

namespace QLCTAPI.Controllers.Transaction
{
    [Route("transactions/")]
    [ApiController]
    [CustomAuthorize]
    public class TransactionController : ControllerBase
    {
        private readonly QuanLyChiTieuContext _context;

        public TransactionController(QuanLyChiTieuContext context)
        {
            _context = context;
        }


        [HttpPost("add")]
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
                    CreateAt = DateTime.ParseExact(request.CreateAt, "yyyy-MM-dd HH:mm", null),
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

                trans.Status = "S";

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    ErrorCode = ErrorCode.CREATEDATASUCCESS,
                    Data = new
                    {
                        newBalance = user.Balance
                    }
                });
            }

            return BadRequest(new { ErrorCode = ErrorCode.CREATEDATAFAIL });
        }


        [HttpPut("update")]
        public async Task<ActionResult> UpdateTransaction([FromQuery] int id, [FromBody] AddRequest request)
        {
            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (Guid.TryParse(userID, out var uid))
            {
                var trans = await _context.Transactions.Where(t => t.Id == id).FirstOrDefaultAsync();
                var oldMoney = trans.Money;
                var user = await _context.Users.Where(u => u.Id == uid).FirstOrDefaultAsync();

                trans.CategoryCustomId = request.CategoryId;
                trans.Money = request.Money;
                trans.CurrencyCode = request.CurrencyCode;
                trans.CreateAt = DateTime.ParseExact(request.CreateAt, "yyyy-MM-dd HH:mm", null);
                trans.Note = request.Note;

                if (trans.Type == "CHI")
                {
                    user.Balance += (oldMoney - request.Money);
                }
                else if (trans.Type == "THU")
                {
                    user.Balance += (request.Money - oldMoney);
                }

                if (request.ImgSrc.Count > 0)
                {
                    foreach (var imgSrc in request.ImgSrc)
                    {
                        var img = await _context.TransactionImages.Where(ti => ti.ImgSrc == imgSrc).FirstOrDefaultAsync();

                        // Ảnh mới
                        if (img == null)
                        {
                            await _context.AddAsync(new TransactionImage
                            {
                                TransactionId = trans.Id,
                                ImgSrc = imgSrc,
                            });
                        }
                        // Ảnh cũ vẫn giữ lại
                        else
                        {
                            continue;
                        }
                    }
                    // Ảnh cũ không giữ lại
                    var removeImgs = await _context.TransactionImages.Where(ti => ti.TransactionId == id && request.ImgSrc.All(x => x != ti.ImgSrc)).ToListAsync();
                    _context.TransactionImages.RemoveRange(removeImgs);
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    ErrorCode = ErrorCode.UPDATEDATASUCCESS,
                    Data = new
                    {
                        newBalance = user.Balance
                    }
                });
            }

            return BadRequest(new { ErrorCode = ErrorCode.UPDATEDATAFAIL });
        }

        [HttpGet("getsummarybytype")]
        public async Task<ActionResult> GetSummaryByType([FromQuery] string type)
        {
            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (Guid.TryParse(userID, out var id))
            {
                var currencyBase = await new Common().GetCurrencyCode(id);

                var listTrans = await _context.Transactions.Where(t => t.UserId == id && t.Type == type && t.Status == "S").ToListAsync();

                var tasks = listTrans.GroupBy(lt => new { lt.UserId, lt.CategoryCustomId, lt.Type, lt.CurrencyCode })
                    .Select(async x => new
                    {
                        CategoryCustomId = x.Key.CategoryCustomId,
                        Budget = x.Key.CurrencyCode != currencyBase
                            ? await new Common().ExchangeMoney(x.Sum(t => t.Money).Value, x.Key.CurrencyCode, currencyBase)
                            : x.Sum(t => t.Money),
                    });

                var group = (await Task.WhenAll(tasks))
                    .GroupBy(t => t.CategoryCustomId)
                    .Select(g => new
                    {
                        CategoryCustomId = g.Key,
                        Budget = g.Sum(x => x.Budget)
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

        [HttpGet("getsummarybycategory")]
        public async Task<ActionResult> GetSummaryByCategory([FromQuery] string type, [FromQuery] int categoryId)
        {
            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (Guid.TryParse(userID, out var id))
            {
                var currencyBase = await new Common().GetCurrencyCode(id);

                var listTrans = await _context.Transactions.Where(t => t.UserId == id && t.Type == type && (categoryId == 0 || t.CategoryCustomId == categoryId) && t.Status == "S").ToListAsync();

                var tasks = listTrans.GroupBy(lt => new { lt.UserId, lt.Type, lt.CreateAt.Value.Year, lt.CreateAt.Value.Month, lt.CurrencyCode })
                    .Select(async x => new
                    {
                        Budget = x.Key.CurrencyCode != currencyBase
                            ? await new Common().ExchangeMoney(x.Sum(t => t.Money).Value, x.Key.CurrencyCode, currencyBase)
                            : x.Sum(t => t.Money),
                        Count = x.Count(),
                        Year = x.Key.Year,
                        Month = x.Key.Month
                    });

                var group = (await Task.WhenAll(tasks))
                    .GroupBy(t => new { t.Year, t.Month })
                    .Select(g => new
                    {
                        Budget = g.Sum(x => x.Budget),
                        Count = g.Sum(x => x.Count),
                        Year = g.Key.Year,
                        Month = g.Key.Month
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

        [HttpGet("getlistbytime")]
        public async Task<ActionResult> GetListByTime([FromQuery] string type, [FromQuery] int categoryId, [FromQuery] string time)
        {
            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);
            string[] parts = time.Split('-');
            int month, year;

            if (Guid.TryParse(userID, out var id))
            {
                if (parts.Length == 2 && int.TryParse(parts[0], out month) && int.TryParse(parts[1], out year))
                {
                    var currencyBase = await new Common().GetCurrencyCode(id);

                    var listTrans = await _context.Transactions
                    .Where(t => t.UserId == id && t.Type == type && (categoryId == 0 || t.CategoryCustomId == categoryId)
                            && t.Status == "S" && t.CreateAt.Value.Year == year && t.CreateAt.Value.Month == month)
                    .ToListAsync();

                    var tasks = listTrans.GroupBy(lt => new { lt.Id, lt.UserId, lt.Money, lt.CreateAt, lt.CategoryCustomId, lt.CurrencyCode })
                        .Select(async x => new
                        {
                            Id = x.Key.Id,
                            CategoryCustomId = x.Key.CategoryCustomId,
                            Money = x.Key.CurrencyCode != currencyBase
                            ? await new Common().ExchangeMoney(x.Key.Money.Value, x.Key.CurrencyCode, currencyBase)
                            : x.Key.Money,
                            CreateAt = x.Key.CreateAt
                        });

                    var group = (await Task.WhenAll(tasks))
                        .OrderByDescending(x => x.Money)
                        .ThenByDescending(x => x.CreateAt)
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

        [HttpGet("getlistbymoney")]
        public async Task<ActionResult> GetListByMoney([FromQuery] string type, [FromQuery] int categoryId)
        {
            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (Guid.TryParse(userID, out var id))
            {
                var currencyBase = await new Common().GetCurrencyCode(id);

                var listTrans = await _context.Transactions
                .Where(t => t.UserId == id && t.Type == type && (categoryId == 0 || t.CategoryCustomId == categoryId) && t.Status == "S")
                .ToListAsync();

                var tasks = listTrans
                    .GroupBy(lt => new { lt.Id, lt.Money, lt.CategoryCustomId, lt.CreateAt, lt.CurrencyCode })
                    .Select(async x => new
                    {
                        Id = x.Key.Id,
                        CategoryCustomId = x.Key.CategoryCustomId,
                        Money = x.Key.CurrencyCode != currencyBase
                            ? await new Common().ExchangeMoney(x.Key.Money.Value, x.Key.CurrencyCode, currencyBase)
                            : x.Key.Money,
                        CreateAt = x.Key.CreateAt
                    });

                var order = (await Task.WhenAll(tasks))
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

        [HttpGet("get")]
        public async Task<ActionResult> GetByTransId([FromQuery] int transId)
        {
            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (Guid.TryParse(userID, out var id))
            {
                var currencyBase = await new Common().GetCurrencyCode(id);

                var trans = await _context.Transactions
                .Where(t => t.Id == transId && t.UserId == id)
                .FirstOrDefaultAsync();

                if (trans.CurrencyCode != currencyBase)
                {
                    trans.Money = await new Common().ExchangeMoney(trans.Money.Value, trans.CurrencyCode, currencyBase);
                }


                var category = await _context.UserCategoryCustoms.Where(ucc => ucc.Id == trans.CategoryCustomId)
                    .Join(_context.CategoryDefines,
                    ucc => ucc.CategoryId,
                    cd => cd.Id,
                    (ucc, cd) => new { ucc, cd })
                    .Select(x => new
                    {
                        Id = x.ucc.Id,
                        ImgSrc = x.cd.ImgSrc,
                        Name = x.ucc.CategoryName,
                        Color = x.ucc.CategoryColor,
                    })
                    .FirstOrDefaultAsync();

                var img = await _context.TransactionImages.Where(ti => ti.TransactionId == transId).Select(x => x.ImgSrc).ToListAsync();

                var data = new
                {
                    Id = transId,
                    Type = trans.Type,
                    Money = trans.Money,
                    Category = category,
                    CreateAt = trans.CreateAt,
                    Note = trans.Note,
                    Img = img,
                };


                return Ok(new { ErrorCode = ErrorCode.GETDATASUCCESS, Data = data });
            }

            return BadRequest(new { ErrorCode = ErrorCode.GETDATAFAIL });
        }

        [HttpDelete("delete")]
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

                    _context.Transactions.Remove(trans);

                    await _context.SaveChangesAsync();


                    return Ok(new
                    {
                        ErrorCode = ErrorCode.DELETEDATASUCCESS,
                        Data = new
                        {
                            newBalance = user.Balance
                        }
                    });
                }
            }

            return BadRequest(new { ErrorCode = ErrorCode.DELETEDATAFAIL });
        }
    }
}
