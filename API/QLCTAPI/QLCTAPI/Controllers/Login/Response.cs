using QLCTAPI.DTOs;

namespace QLCTAPI.Controllers.Login
{
    public class LoginResponse
    {
        public string ErrorCode { get; set; }
        public string Token { get; set; }
        public UserDTO Data { get; set; }
    }
    public class RegisterResponse
    {
        public string ErrorCode { get; set; }
        public RegisterResponse(string errorCode)
        {
            this.ErrorCode = errorCode;
        }
    }
}
