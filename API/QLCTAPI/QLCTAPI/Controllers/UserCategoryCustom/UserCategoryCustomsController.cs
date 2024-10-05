using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLCTAPI.Models;

namespace QLCTAPI.Controllers.UserCategoryCustom
{
    [Route("CustomCategory/")]
    [ApiController]
    [CustomAuthorize]
    public class UserCategoryCustomsController : ControllerBase
    {
        private readonly QuanLyChiTieuContext _context;

        public UserCategoryCustomsController(QuanLyChiTieuContext context)
        {
            _context = context;
        }


        [HttpGet("GetTop")]
        public async Task<ActionResult> GetTopCategoryCustom([FromQuery] string type, [FromQuery] int num)
        {
            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (Guid.TryParse(userID, out var id))
            {
                var listCategory = await _context.UserCategoryCustoms.Where(ucc => (ucc.UserId.Equals(id) || (bool)ucc.IsDefault) && ucc.Type.Equals(type))
                .Join(_context.CategoryDefines,
                ucc => ucc.CategoryId,
                cd => cd.Id,
                (ucc, cd) => new { ucc, cd })
                .OrderBy(od => od.ucc.CategoryOrder)
                .Select(x => new CustomCategoryDTOResponse
                {
                    Id = x.ucc.Id,
                    CategoryId = x.ucc.CategoryId.Value,
                    ImgSrc = x.cd.ImgSrc,
                    Name = x.ucc.CategoryName,
                    Color = x.ucc.CategoryColor,
                })
                .Take(num).ToListAsync();

                return Ok(new Response { ErrorCode = ErrorCode.GETDATASUCCESS, Data = listCategory });
            }

            return BadRequest(new Response { ErrorCode = ErrorCode.ERROR });
        }

        [HttpGet("GetAll")]
        public async Task<ActionResult> GetAll([FromQuery] string type)
        {
            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (Guid.TryParse(userID, out var id))
            {
                var listCategory = await _context.UserCategoryCustoms.Where(ucc => (ucc.UserId == id || (bool)ucc.IsDefault) && ucc.Type.Equals(type))
                    .Join(_context.CategoryDefines,
                    ucc => ucc.CategoryId,
                    cd => cd.Id,
                    (ucc, cd) => new { ucc, cd })
                    .OrderBy(od => od.ucc.CategoryOrder)
                    .Select(x => new CustomCategoryDTOResponse
                    {
                        Id = x.ucc.Id,
                        CategoryId = x.ucc.CategoryId.Value,
                        ImgSrc = x.cd.ImgSrc,
                        Name = x.ucc.CategoryName,
                        Color = x.ucc.CategoryColor,
                    })
                    .ToListAsync();

                return Ok(new Response { ErrorCode = ErrorCode.GETDATASUCCESS, Data = listCategory });
            }

            return BadRequest(new Response { ErrorCode = ErrorCode.ERROR });
        }

        [HttpPost("Add")]
        public async Task<ActionResult> Add([FromBody] UCCRequest request)
        {
            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (Guid.TryParse(userID, out Guid userId))
            {
                var categoryOrder = await _context.UserCategoryCustoms
                    .Where(x => x.Type.Equals(request.Type) &&
                            ((bool)x.IsDefault || x.UserId.Equals(userId)))
                    .MaxAsync(x => x.CategoryOrder);

                var newCategory = new Models.UserCategoryCustom
                {
                    UserId = userId,
                    CategoryId = request.CategoryID,
                    CategoryName = request.CategoryName,
                    CategoryColor = request.CategoryColor,
                    CategoryOrder = categoryOrder + 1,
                    Type = request.Type,
                };

                await _context.UserCategoryCustoms.AddAsync(newCategory);

                await _context.SaveChangesAsync();

                return Ok(new Response { ErrorCode = ErrorCode.CREATEDATASUCCESS });
            }

            return BadRequest(new Response { ErrorCode = ErrorCode.CREATEDATAFAIL });

        }

        [HttpPost("Delete")]
        public async Task<ActionResult> Delete([FromQuery] int id)
        {
            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (Guid.TryParse(userID, out Guid userId))
            {
                var category = await _context.UserCategoryCustoms.Where(ucc => ucc.Id == id).FirstOrDefaultAsync();

                if (category != null)
                {
                    if ((bool)category.IsDefault)
                    {
                        return BadRequest(new Response { ErrorCode = ErrorCode.NOTPERMISSION });
                    }

                    if (category.UserId == userId)
                    {
                        _context.UserCategoryCustoms.Remove(category);

                        await _context.SaveChangesAsync();

                        return Ok(new Response { ErrorCode = ErrorCode.DELETEDATASUCCESS });
                    }
                    else
                    {
                        return BadRequest(new Response { ErrorCode = ErrorCode.NOTPERMISSION });
                    }
                }
            }

            return BadRequest(new Response { ErrorCode = ErrorCode.DELETEDATAFAIL });

        }
    }
}
