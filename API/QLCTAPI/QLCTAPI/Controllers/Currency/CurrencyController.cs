using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLCTAPI.DTOs;
using QLCTAPI.Models;

namespace QLCTAPI.Controllers.Currency
{
    [Route("Currency/")]
    [ApiController]
    public class CurrencyController : ControllerBase
    {
        private readonly QuanLyChiTieuContext _context;

        public CurrencyController(QuanLyChiTieuContext context)
        {
            _context = context;
        }

        [HttpGet("GetAll")]
        public async Task<ActionResult> GetAllCurrencies()
        {
            List<CurrencyDTO> listCurrencies = await _context.CurrencyDefines
                                            .Where(x => x.IsActive.Value)
                                            .Select(x => new CurrencyDTO
                                            {
                                                CurrencyCode = x.CurrencyCode,
                                                CurrencyName = x.CurrencyName,
                                                BuyRate = x.BuyRate,
                                                SellRate = x.SellRate,
                                                Symbol = x.Symbol
                                            })
                                            .ToListAsync();

            if (listCurrencies.Count > 0)
            {
                return Ok(new ListCurrencyResponse { ErrorCode = ErrorCode.GETDATASUCCESS, Data = listCurrencies });
            }
            else
            {
                return BadRequest(new ListCurrencyResponse { ErrorCode = ErrorCode.NODATA, Data = new List<CurrencyDTO>() });
            }
        }

        [HttpPost("ExchangeCurrency")]
        public async Task<ActionResult> ExchangeCurrency([FromBody] ExchangeCurrencyRequest request)
        {

            var money = await new Common().ExchangeMoney(request.Money, request.FromCurrencyCode, request.ToCurrencyCode);

            var data = new ExchangeCurrencyDTO
            {
                FromMoney = request.Money,
                FromCurrencyCode = request.FromCurrencyCode,
                ToCurrencyCode = request.ToCurrencyCode,
                ToMoney = money,
            };

            return Ok(new ExchangeCurrencyResponse { ErrorCode = ErrorCode.GETDATASUCCESS, Data = data });
        }
    }
}
