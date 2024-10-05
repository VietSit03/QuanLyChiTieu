using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLCTAPI.DTOs;
using QLCTAPI.Models;

namespace QLCTAPI.Controllers.Category
{
    [Route("Category/")]
    [ApiController]
    //[CustomAuthorize]
    public class CategoryDefinesController : ControllerBase
    {
        private readonly QuanLyChiTieuContext _context;

        public CategoryDefinesController(QuanLyChiTieuContext context)
        {
            _context = context;
        }

        [HttpGet("GetAll")]
        public async Task<ActionResult> GetAllCategories()
        {
            List<CategoryDefine> listCategories = await _context.CategoryDefines.ToListAsync();

            if (listCategories.Count > 0)
            {
                var groupedCategories = listCategories
                    .Join(_context.PurposeDefines,
                    lc => lc.PurposeCode,
                    pd => pd.Code,
                    (lc, pd) => new { lc, pd })
                    .GroupBy(c => c.lc.PurposeCode)
                    .Select(g => new ListCategoryDTO
                    {
                        purposeName = g.First().pd.PurposeName,
                        categories = g.Select(x => x.lc).ToList()
                    }).ToList();

                return Ok(new CategoryByTypeResponse { ErrorCode = ErrorCode.GETDATASUCCESS, Data = groupedCategories });
            }
            else
            {
                return BadRequest(new CategoryByTypeResponse { ErrorCode = ErrorCode.NODATA, Data = new List<ListCategoryDTO>() });
            }
        }


        [HttpGet("GetTop")]
        public async Task<ActionResult> GetTop([FromQuery] string type, [FromQuery] int num)
        {
            var listCategory = await _context.CategoryDefines
                .Join(_context.PurposeDefines,
                cd => cd.PurposeCode,
                pd => pd.Code,
                (cd, pd) => new { cd, pd })
                .Where(x => (x.cd.Type.Equals(type) || x.cd.Type.Equals("ALL") && (bool)x.pd.IsActive))
                .Select(x => new CategoryDTO
                {
                    id = x.cd.Id,
                    imgSrc = x.cd.ImgSrc
                })
                .Take(num).ToListAsync();

            return Ok(new CategoryAddResponse { ErrorCode = ErrorCode.GETDATASUCCESS, Data = listCategory });
        }
    }
}
