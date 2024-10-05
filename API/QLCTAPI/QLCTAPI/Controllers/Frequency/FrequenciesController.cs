using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLCTAPI.Controllers.Category;
using QLCTAPI.DTOs;
using QLCTAPI.Models;

namespace QLCTAPI.Controllers.Frequency
{
    [Route("frequencies/")]
    [ApiController]
    public class FrequenciesController : ControllerBase
    {

        private readonly QuanLyChiTieuContext _context;

        public FrequenciesController(QuanLyChiTieuContext context)
        {
            _context = context;
        }


        [HttpGet("all")]
        public async Task<ActionResult> GetAllFrequencies()
        {
            var list = await _context.FrequencyDefines
                .Where(fd => (bool)fd.IsActive)
                .Select(x => new
                {
                    Id = x.FrequencyId,
                    Name = x.FrequencyName,
                    Order = x.Order,
                })
                .OrderBy(x => x.Order)
                .ToListAsync();

            if (list.Count > 0)
            {

                return Ok(new { ErrorCode = ErrorCode.GETDATASUCCESS, Data = list });
            }
            else
            {
                return BadRequest(new { ErrorCode = ErrorCode.NODATA });
            }
        }
    }
}
