using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLCTAPI.Models;

namespace QLCTAPI.Controllers
{
    [Route("")]
    [ApiController]
    public class CategoryDefinesController : ControllerBase
    {
        private readonly QuanLyChiTieuContext _context;

        public CategoryDefinesController(QuanLyChiTieuContext context)
        {
            _context = context;
        }

        // GET: api/CategoryDefines
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDefine>>> GetCategoryDefines()
        {
            return await _context.CategoryDefines.ToListAsync();
        }

        // GET: api/CategoryDefines/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDefine>> GetCategoryDefine(int id)
        {
            var categoryDefine = await _context.CategoryDefines.FindAsync(id);

            if (categoryDefine == null)
            {
                return NotFound();
            }

            return categoryDefine;
        }

        // PUT: api/CategoryDefines/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategoryDefine(int id, CategoryDefine categoryDefine)
        {
            if (id != categoryDefine.Id)
            {
                return BadRequest();
            }

            _context.Entry(categoryDefine).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryDefineExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/CategoryDefines
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<CategoryDefine>> PostCategoryDefine(CategoryDefine categoryDefine)
        {
            _context.CategoryDefines.Add(categoryDefine);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCategoryDefine", new { id = categoryDefine.Id }, categoryDefine);
        }

        // DELETE: api/CategoryDefines/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategoryDefine(int id)
        {
            var categoryDefine = await _context.CategoryDefines.FindAsync(id);
            if (categoryDefine == null)
            {
                return NotFound();
            }

            _context.CategoryDefines.Remove(categoryDefine);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CategoryDefineExists(int id)
        {
            return _context.CategoryDefines.Any(e => e.Id == id);
        }
    }
}
