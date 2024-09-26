using Microsoft.AspNetCore.Mvc;
using QLCTAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using QLCTAPI.DTOs;

namespace QLCTAPI.Controllers.Login
{
    [Route("")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly QuanLyChiTieuContext _context;
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;

        public LoginController(QuanLyChiTieuContext context, IConfiguration config, HttpClient httpClient)
        {
            _context = context;
            _config = config;
            _httpClient = httpClient;
        }

        [HttpPost("Login")]
        public async Task<ActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
            {
                return BadRequest(new LoginResponse { ErrorCode = ErrorCode.NOTFOUND });
            }

            if (!(bool)user.IsActive)
            {
                if (user.NumLoginFail == -1)
                {
                    return BadRequest(new LoginResponse { ErrorCode = ErrorCode.NOTACTIVATEUSER });
                }
                return BadRequest(new LoginResponse { ErrorCode = ErrorCode.DISABLEDUSER });
            }

            if (BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                user.NumLoginFail = 0;

                await _context.SaveChangesAsync();

                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                var claims = new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                };

                var expireDate = DateTime.Now.AddMonths(Convert.ToInt32(_config["Jwt:ExpireMonth"]));

                var token = new JwtSecurityToken(
                    issuer: _config["Jwt:Issuer"],
                    audience: _config["Jwt:Audience"],
                    claims: claims,
                    expires: DateTime.Now.AddYears(1),
                    signingCredentials: credentials);

                var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

                var newToken = new UserToken
                {
                    UserId = user.Id,
                    Token = tokenString,
                    ExpiredDate = token.ValidTo
                };

                var existedToken = await _context.UserTokens.FindAsync(user.Id);

                if (existedToken != null)
                {
                    existedToken.Token = newToken.Token;
                    existedToken.ExpiredDate = newToken.ExpiredDate;

                    await _context.SaveChangesAsync();

                    return Ok(new LoginResponse
                    {
                        ErrorCode = ErrorCode.GETDATASUCCESS,
                        Token = existedToken.Token,
                        Data = new UserDTO
                        {
                            Id = user.Id,
                            Name = user.Name,
                            CurrencyCode = user.CurrencyCode,
                        }
                    });
                }
                else
                {
                    await _context.UserTokens.AddAsync(newToken);

                    await _context.SaveChangesAsync();

                    return Ok(new LoginResponse
                    {
                        ErrorCode = ErrorCode.GETDATASUCCESS,
                        Token = newToken.Token,
                        Data = new UserDTO
                        {
                            Id = user.Id,
                            Name = user.Name,
                            CurrencyCode = user.CurrencyCode,
                        }
                    });
                }
            }
            else
            {
                user.NumLoginFail = user.NumLoginFail + 1;

                if (user.NumLoginFail == Config.NumLoginFail)
                {
                    user.IsActive = false;
                }

                await _context.SaveChangesAsync();

                return BadRequest(new LoginResponse { ErrorCode = ErrorCode.NOTFOUND });
            }
        }

        [HttpPost("Register")]
        public async Task<ActionResult> Register([FromBody] RegisterRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user != null)
            {
                return BadRequest(new RegisterResponse(ErrorCode.EXISTEDEMAIL));
            }

            var newUser = new Models.User
            {
                Id = Guid.NewGuid(),
                Email = request.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Name = request.Name,
            };

            await _context.Users.AddAsync(newUser);

            await _context.SaveChangesAsync();

            var mail = new MailDTO
            {
                TemplateID = Mail.RGT_TEMPLATEID,
                Email = request.Email,
                Name = request.Name,
            };

            await new Common().SendEmailAsync(mail);

            return Ok(new RegisterResponse(ErrorCode.CREATEDATASUCCESS));
        }

        [HttpPost("ChangePassword")]
        public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
            {
                return BadRequest(new { ErrorCode = ErrorCode.NOTFOUND });
            }

            user.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

            await _context.SaveChangesAsync();

            return Ok(new RegisterResponse(ErrorCode.UPDATEDATASUCCESS));
        }

        [CustomAuthorize]
        [HttpPost("Logout")]
        public async Task<ActionResult> Logout()
        {
            var userIdFromToken = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (Guid.TryParse(userIdFromToken, out var parsedUserId))
            {
                await _context.UserTokens.Where(ut => ut.UserId == parsedUserId)
                .ExecuteUpdateAsync(g => g.SetProperty(g => g.ExpiredDate, DateTime.Now));

                await _context.SaveChangesAsync();

                return Ok(new { ErrorCode = ErrorCode.LOGOUTSUCCESS });
            }

            return BadRequest(new { ErrorCode = ErrorCode.LOGOUTFAIL });
        }

        [HttpPost("CheckToken")]
        public async Task<ActionResult> CheckToken()
        {
            if (Request.Headers.TryGetValue("Authorization", out var token))
            {
                string tokenValue = token.ToString().Replace("Bearer ", "");
                if (await new Common().CheckToken(tokenValue))
                {
                    return Ok(new { ErrorCode = ErrorCode.TOKENVALID });
                }
            }
            return BadRequest(new { ErrorCode = ErrorCode.TOKENINVALID });
        }

        [HttpPost("ForgetPassword")]
        public async Task<ActionResult> ForgetPassword([FromBody] MailDTO request)
        {
            var user = await _context.Users.Where(u => u.Email == request.Email).FirstOrDefaultAsync();
            if (user == null)
            {
                return BadRequest(new { ErrorCode = ErrorCode.NOTEXISTEDUSER });
            }
            if (!(bool)user.IsActive)
            {
                if (user.NumLoginFail == -1)
                {
                    return BadRequest(new { ErrorCode = ErrorCode.NOTACTIVATEUSER });
                }
                else
                {
                    return BadRequest(new { ErrorCode = ErrorCode.DISABLEDUSER });
                }
            }
            var code = Guid.NewGuid().ToString("N").Substring(0, 12);
            request.TemplateID = Mail.FGP_TEMPLATEID;
            request.Name = "A";
            if (request.Params == null)
            {
                request.Params = new Dictionary<string, string>();
            }
            request.Params.Add("code", code);

            if (await new Common().SendEmailAsync(request))
            {
                var verifyCode = await _context.VerifyCodes
                                     .Where(vc => vc.Email == request.Email)
                                     .FirstOrDefaultAsync();

                if (verifyCode != null)
                {
                    _context.VerifyCodes.Remove(verifyCode);

                    await _context.SaveChangesAsync();
                }

                Models.VerifyCode obj = new Models.VerifyCode
                {
                    Email = request.Email,
                    Code = code,
                    ExpiredDate = DateTime.Now.AddMinutes(5),
                    IsVerify = false,
                };

                await _context.VerifyCodes.AddAsync(obj);

                await _context.SaveChangesAsync();

                return Ok(new { ErrorCode = ErrorCode.SENDMAILSUCCESS });
            }

            return BadRequest(new { ErrorCode = ErrorCode.SENDMAILFAIL });
        }

    }
}
