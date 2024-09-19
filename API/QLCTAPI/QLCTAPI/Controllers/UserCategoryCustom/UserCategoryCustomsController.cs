using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLCTAPI.Models;

namespace QLCTAPI.Controllers.UserCategoryCustom
{
    [Route("CustomCategory/")]
    [ApiController]
    public class UserCategoryCustomsController : ControllerBase
    {
        private readonly QuanLyChiTieuContext _context;

        public UserCategoryCustomsController(QuanLyChiTieuContext context)
        {
            _context = context;
        }
        

        //[HttpGet("GetTop")]
        //public async Task<ActionResult> GetTopCategoryCustom([FromQuery] int num)
        //{
        //    var listCategory = await _context.UserCategoryCustoms.ToListAsync();
        //    return ;
        //}
    }
}
