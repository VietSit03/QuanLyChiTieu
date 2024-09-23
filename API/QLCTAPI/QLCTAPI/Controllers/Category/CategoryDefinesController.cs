using System;
using System.Collections.Generic;
using System.Linq;
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
    [CustomAuthorize]
    public class CategoryDefinesController : ControllerBase
    {
        private readonly QuanLyChiTieuContext _context;

        public CategoryDefinesController(QuanLyChiTieuContext context)
        {
            _context = context;
        }

        [HttpGet("GetAll")]
        public async Task<Response> GetAllCategories()
        {
            var message = string.Empty;
            List<CategoryDefine> listCategories = await _context.CategoryDefines.ToListAsync();



            if (listCategories.Count > 0)
            {
                var groupedCategories = listCategories
                    .Join(_context.PurposeDefines,
                    lc => lc.PurposeCode,
                    pd => pd.Code,
                    (lc, pd) => new {lc, pd})
                    .GroupBy(c => c.lc.PurposeCode)
                    .Select(g => new CategoryDTO
                    {
                        purposeName = g.First().pd.PurposeName,
                        categories = g.Select(x => x.lc).ToList()
                    }).ToList();

                message = ErrorCode.GETDATASUCCESS;

                return new Response(message, groupedCategories);
            } else
            {
                message = ErrorCode.NODATA;
                return new Response(message, new List<CategoryDTO>());
            }
        }
    }
}
