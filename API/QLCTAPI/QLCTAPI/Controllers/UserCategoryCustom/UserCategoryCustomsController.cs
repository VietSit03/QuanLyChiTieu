﻿using System;
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
    [Route("customcategories/")]
    [ApiController]
    [CustomAuthorize]
    public class UserCategoryCustomsController : ControllerBase
    {
        private readonly QuanLyChiTieuContext _context;

        public UserCategoryCustomsController(QuanLyChiTieuContext context)
        {
            _context = context;
        }

        [HttpGet("get")]
        public async Task<ActionResult> GetById([FromQuery] int id)
        {
            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (Guid.TryParse(userID, out var uid))
            {
                var category = await _context.UserCategoryCustoms.Where(ucc => ucc.UserId == uid && ucc.Id == id)
                .Join(_context.CategoryDefines,
                    ucc => ucc.CategoryId,
                    cd => cd.Id,
                    (ucc, cd) => new { ucc, cd })
                .Select(x => new CustomCategoryDTOResponse
                {
                    Id = x.ucc.Id,
                    CategoryId = x.ucc.CategoryId.Value,
                    ImgSrc = x.cd.ImgSrc,
                    Name = x.ucc.CategoryName,
                    Color = x.ucc.CategoryColor,
                    IsDefault = x.ucc.IsDefault,
                })
                .FirstOrDefaultAsync();

                if (category == null)
                {
                    return BadRequest(new Response { ErrorCode = ErrorCode.GETDATAFAIL });
                }
                else
                {
                    return Ok(new { ErrorCode = ErrorCode.GETDATASUCCESS, Data = category });
                }

            }

            return BadRequest(new Response { ErrorCode = ErrorCode.ERROR });
        }

        [HttpGet("top")]
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
                    IsDefault = x.ucc.IsDefault,
                })
                .Take(num).ToListAsync();

                return Ok(new Response { ErrorCode = ErrorCode.GETDATASUCCESS, Data = listCategory });
            }

            return BadRequest(new Response { ErrorCode = ErrorCode.ERROR });
        }

        [HttpGet("all")]
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
                        IsDefault = x.ucc.IsDefault,
                    })
                    .ToListAsync();

                return Ok(new Response { ErrorCode = ErrorCode.GETDATASUCCESS, Data = listCategory });
            }

            return BadRequest(new Response { ErrorCode = ErrorCode.ERROR });
        }

        [HttpPost("add")]
        public async Task<ActionResult> Add([FromBody] UCCRequest request)
        {
            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (Guid.TryParse(userID, out Guid userId))
            {
                var categoryOrder = await _context.UserCategoryCustoms
                    .Where(x => x.Type.Equals(request.Type) && x.UserId.Equals(userId))
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

        [HttpPut("update")]
        public async Task<ActionResult> Update([FromQuery] int id, [FromBody] UCCRequest request)
        {
            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (Guid.TryParse(userID, out Guid userId))
            {
                var category = await _context.UserCategoryCustoms
                    .Where(x => x.Id == id)
                    .FirstOrDefaultAsync();

                if (category == null)
                {
                    return NotFound();
                }

                category.CategoryId = request.CategoryID;
                category.CategoryName = request.CategoryName;
                category.CategoryColor = request.CategoryColor;

                await _context.SaveChangesAsync();

                return Ok(new Response { ErrorCode = ErrorCode.UPDATEDATASUCCESS });
            }

            return BadRequest(new Response { ErrorCode = ErrorCode.UPDATEDATAFAIL });
        }

        [HttpPost("changeorder")]
        public async Task<ActionResult> ChangeOrder([FromBody] ChangeOrderUCCRequest request)
        {
            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (Guid.TryParse(userID, out Guid userId))
            {
                var categories = request.Categories;

                foreach (var item in categories)
                {
                    var category = await _context.UserCategoryCustoms.Where(ucc => ucc.Id == item.Id && !ucc.IsDefault.Value).FirstOrDefaultAsync();

                    if (category != null)
                    {
                        category.CategoryOrder = item.CategoryOrder;
                    }
                }

                await _context.SaveChangesAsync();

                return Ok(new Response { ErrorCode = ErrorCode.UPDATEDATASUCCESS });
            }

            return BadRequest(new Response { ErrorCode = ErrorCode.UPDATEDATAFAIL });
        }

        [HttpPost("delete")]
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
                        var transactions = await _context.Transactions
                            .Where(t => t.CategoryCustomId == category.Id)
                            .ToListAsync();

                        var categoryDefault = await _context.UserCategoryCustoms
                            .Where(ucc => (bool)ucc.IsDefault && ucc.Type == category.Type)
                            .FirstOrDefaultAsync();

                        foreach (var transaction in transactions)
                        {
                            transaction.CategoryCustomId = categoryDefault.Id;
                        }

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
