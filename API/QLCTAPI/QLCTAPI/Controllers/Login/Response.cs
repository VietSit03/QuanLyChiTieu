namespace QLCTAPI.Controllers.Login
{
    public class LoginResponse
    {
        public string ErrorCode { get; set; }
        public string Token { get; set; }
        public LoginResponse(string errorCode, string token)
        {
            this.ErrorCode = errorCode;
            this.Token = token;
        }
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
