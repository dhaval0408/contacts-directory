using System.Threading.Tasks;
using Domain.Entities;
using Domain.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Service.Interface;

namespace ContactsAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController : Controller
    {
        private readonly IContactService _service;

        public ContactController(IContactService service)
        {
            _service = service;
        }
       
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var contact = await _service.GetByIdAsync(id);
            return contact is null ? NotFound() : Ok(contact);
        }

        [HttpPost]
        public async Task<IActionResult> Post(Contact contact)
        {
            await _service.AddAsync(contact);
            return CreatedAtAction(nameof(Get), new { id = contact.Id }, contact);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Contact contact)
        {
            if (id != contact.Id) return BadRequest();
            await _service.UpdateAsync(contact);
            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }

        /// <summary>
        /// This API will be use for search, sort and pagination
        /// passing all parameters like search, sort and page into request body
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("search")]
        public async Task<IActionResult> Get([FromBody] BaseSearch request)
        {
            return Ok(await _service.GetAllAsync(request));
        }
    }
}
