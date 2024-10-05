﻿using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using QLCTAPI.Models;
using System.Security.Claims;

namespace QLCTAPI
{
    public class CustomAuthorize : Attribute, IAsyncAuthorizationFilter
    {
        private readonly string[] _requiredClaims;
        private readonly string[] _requiredRoles;
        private readonly QuanLyChiTieuContext _context = new QuanLyChiTieuContext();

        public CustomAuthorize(string[] requiredClaims = null, string[] requiredRoles = null)
        {
            _requiredClaims = requiredClaims;
            _requiredRoles = requiredRoles;
        }

        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            var user = context.HttpContext.User;

            if (!user.Identity.IsAuthenticated)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var token = context.HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            if (! await new Common().CheckToken(token))
            {
                context.Result = new ForbidResult();
                return;
            }
        }
    }
}

