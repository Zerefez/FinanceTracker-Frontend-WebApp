using FinanceTracker.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FinanceTracker.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PaycheckController : ControllerBase
    {

        private readonly IDataAccessService<Paycheck> _paycheckService;

        private readonly IDataAccessService<WorkShift> _workShiftService;



        PaycheckController(IDataAccessService<Paycheck> paycheckService, IDataAccessService<WorkShift> workshiftService)
        {
            _paycheckService = paycheckService;
            _workShiftService = workshiftService;
        }


        [HttpPost]
        public async Task<IActionResult> RegisterWorkShift(WorkShift workShift)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid model");
            }
            await _workShiftService.AddAsync(workShift);

            return CreatedAtAction(nameof(RegisterWorkShift), workShift);

        }

        [HttpGet]
        public async Task<Paycheck> GeneratePayCheckForMonth(int CVR, int month, int UserId)
        {

            throw new NotImplementedException();

        }



    }
}
