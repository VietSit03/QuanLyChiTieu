namespace QLCTAPI
{
    public class Config
    {
        public static string ConnectionString { get; set; }
        public static string API_URL { get; set; }
        public static int NumLoginFail = 5;
    }

    public class ErrorCode
    {
        public static string GETDATASUCCESS = "#0001";
        public static string CREATEDATASUCCESS = "#0002";
        public static string UPDATEDATASUCCESS = "#0003";
        public static string DELETEDATASUCCESS = "#0004";
        public static string LOGOUTSUCCESS = "#0005";
        public static string TOKENVALID = "#0006";
        public static string NODATA = "#1001";
        public static string NOTFOUND = "#1002";
        public static string DISABLEDUSER = "#1003";
        public static string EXISTEDEMAIL = "#1004";
        public static string NOTEXISTEDEMAIL = "#1005";
        public static string LOGOUTFAIL = "#1006";
        public static string TOKENINVALID = "#1007";
        public static string EXISTEDUSER = "#1008";
        public static string NOTEXISTEDUSER = "#1009";
        public static string NOTACTIVATEUSER = "#1010";
        public static string SENDMAILSUCCESS = "#2001";
        public static string SENDMAILFAIL = "#2002";
        public static string VERIFYCODESUCCESS = "#2003";
        public static string VERIFYCODEFAIL = "#2004";
    }

    public class Mail
    {
        public static string SERVICEID = "service_qltc";
        public static string USERID = "BzbGBRdfsAE9CWMN9";
        public static string ACCESSTOKEN = "WjGkaR5snD1MqB0r0N9v-";
        public static string FROMNAME = "Quản lý tài chính APP";
        public static string FGP_TEMPLATEID = "FGP";
        public static string RGT_TEMPLATEID = "RGT";
    }
}
