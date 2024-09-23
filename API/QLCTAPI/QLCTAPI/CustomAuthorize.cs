using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using QLCTAPI.Models;
using System.Security.Claims;

namespace QLCTAPI
{
    public class CustomAuthorize : Attribute, IAsyncAuthorizationFilter
    {
        private readonly QuanLyChiTieuContext _context = new QuanLyChiTieuContext();

        public CustomAuthorize()
        {
        }

        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            var token = context.HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            if (! await new Common().CheckToken(token))
            {
                context.Result = new ForbidResult();
                return;
            }
        }
    }
}

